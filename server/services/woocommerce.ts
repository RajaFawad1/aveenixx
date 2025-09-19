import fetch from 'node-fetch';
import { categoryService } from './categoryService';
import { hybridCategoryMappingService } from './hybridCategoryMappingService';
import { detectSourcePlatform } from '../utils/sourcePlatformDetector';
import { apiRateTracker } from './apiRateTracker';
import { dropshipMarkupService } from './dropshipMarkupService';

interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string; name: string }[];
  stock_status: string;
  stock_quantity: number | null;
  rating_count: number;
  average_rating: string;
  external_url?: string;
  type: string;
  status: string;
  virtual?: boolean;
  downloadable?: boolean;
  manage_stock?: boolean;
  featured?: boolean;
  date_on_sale_from?: string;
  date_on_sale_to?: string;
  total_sales?: number;
  // Enhanced fields available from WooCommerce API
  sku?: string;
  tags: { id: number; name: string; slug: string }[];
  attributes: { id: number; name: string; position: number; visible: boolean; variation: boolean; options: string[] }[];
  dimensions: { length: string; width: string; height: string };
  weight?: string;
  meta_data: { id: number; key: string; value: any }[];
  product_url?: string;
  button_text?: string;
  tax_status: string;
  tax_class: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  reviews_allowed: boolean;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note?: string;
  default_attributes: any[];
  variations: number[];
  grouped_products: number[];
}

interface WooCommerceReview {
  id: number;
  date_created: string;
  product_id: number;
  status: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer_avatar_urls: Record<string, string>;
}

export class WooCommerceService {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    this.baseUrl = process.env.WOO_BASE_URL || 'https://aveenixx.com';
    this.consumerKey = process.env.WOO_CONSUMER_KEY || 'ck_909bf587a6681c7b1f96bb10901ff823ccb0be17';
    this.consumerSecret = process.env.WOO_CONSUMER_SECRET || 'cs_f1ec6456ac6ffb6872ad8888e9e4440b27eaf6ec';
  }

  // Enhanced HTML cleaning for product descriptions
  private cleanProductDescription(htmlContent: string): string {
    if (!htmlContent) return '';
    
    return htmlContent
      // Remove price-related content completely - handle all patterns including the specific one from image
      .replace(/<p[^>]*>.*?Price.*?<\/p>/gi, '')
      .replace(/<span[^>]*style="color:#[^"]*"[^>]*>.*?<\/span>/gi, '')
      .replace(/<span[^>]*class="wp_automatic_ama[^"]*"[^>]*>.*?<\/span>/gi, '')
      .replace(/<i><small>.*?<\/small><\/i>/gi, '')
      .replace(/Price:\s*<span[^>]*>.*?<\/span>/gi, '')
      .replace(/Price:\s*[^<\n]*/gi, '')
      .replace(/\(as of[^)]*\)/gi, '')
      .replace(/– Details/gi, '')
      .replace(/\$[\d,]+\.?\d*/g, '') // Remove any standalone prices
      // Handle the specific pattern from the image: <p>Price: <span style="color:#b12704"></span><br /><i><small>(as of - <span class="wp_automatic_ama...
      .replace(/<p>\s*Price:\s*<span[^>]*><\/span>\s*<br[^>]*>\s*<i>\s*<small>\s*\([^)]*<span[^>]*>[^<]*<\/span>[^)]*\)[^<]*<\/small>\s*<\/i>\s*<\/p>/gi, '')
      // Strip all HTML tags completely for clean text
      .replace(/<[^>]*>/g, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '') // trim
      // Clean whitespace and normalize
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async fetchProductReviews(productId: number): Promise<WooCommerceReview[]> {
    try {
      const url = `${this.baseUrl}/wp-json/wc/v3/products/reviews?product=${productId}&per_page=100&status=approved`;
      
      // Track API request
      apiRateTracker.trackRequest('woocommerce', 1000, 1);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`WooCommerce Reviews API error for product ${productId}: ${response.status} ${response.statusText}`);
        return [];
      }

      const reviews = await response.json() as WooCommerceReview[];
      return reviews;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      return [];
    }
  }

  async fetchProducts(page: number = 1, perPage: number = 20): Promise<WooCommerceProduct[]> {
    try {
      const url = `${this.baseUrl}/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&status=publish`;
      
      // Track API request
      apiRateTracker.trackRequest('woocommerce', 1000, 1);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
      }

      const products = await response.json() as WooCommerceProduct[];
      return products;
    } catch (error) {
      console.error('Error fetching WooCommerce products:', error);
      throw error;
    }
  }

  async fetchCategories(): Promise<{ id: number; name: string; slug: string; count: number }[]> {
    try {
      const url = `${this.baseUrl}/wp-json/wc/v3/products/categories?per_page=100`;
      
      // Track API request
      apiRateTracker.trackRequest('woocommerce', 1000, 1);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
      }

      const categories = await response.json() as { id: number; name: string; slug: string; count: number }[];
      return categories;
    } catch (error) {
      console.error('Error fetching WooCommerce categories:', error);
      throw error;
    }
  }

  async transformToAveenixProduct(wooProduct: WooCommerceProduct): Promise<any> {
    // Directly use WooCommerce category without reclassification/mapping
    let aveenixCategory = 'Uncategorized';
    let categoryConfidenceScore = 100;
    let aiSuggestedCategories: { category: string; confidence: number; reason: string }[] = [];
    let mappingSource = 'woocommerce_direct';

    // Prepare WooCommerce category information
    const wooCommerceCategories = wooProduct.categories || [];
    const primaryWooCategory = wooCommerceCategories[0];
    
    // Use WooCommerce primary category name directly
    if (primaryWooCategory) {
      aveenixCategory = primaryWooCategory.name || 'Uncategorized';
      categoryConfidenceScore = 100;
      mappingSource = 'woocommerce_direct';
      console.log(`[WooCommerce Category Direct] ${wooProduct.name}:`);
      console.log(`  ✓ WooCommerce Category: ${primaryWooCategory.name}`);
      console.log(`  ✓ Using as Aveenix category: ${aveenixCategory}`);
      console.log(`  ✓ Mapping Source: ${mappingSource}`);
    }

    // Do not run AI classification or mapping fallbacks

    // Keep Uncategorized only if WooCommerce provided no category

    // Auto-detect product type based on WooCommerce product characteristics
    const detectProductType = (product: WooCommerceProduct): string => {
      // External/Affiliate products - redirect to external URL for purchase
      if (product.type === 'external' || product.external_url) {
        return 'affiliate';
      }
      
      // Virtual products (downloadable, no shipping) - digital products
      if (product.virtual || product.downloadable) {
        return 'digital';
      }
      
      // Grouped products or variable products - could be multivendor
      if (product.type === 'grouped' || product.type === 'variable') {
        return 'multivendor';
      }
      
      // Simple products with stock management - physical inventory
      if (product.type === 'simple' && product.manage_stock && (product.stock_quantity || 0) > 0) {
        return 'physical';
      }
      
      // Products without stock management but not external - likely dropship
      if (product.type === 'simple' && !product.manage_stock && !product.external_url) {
        return 'dropship';
      }
      
      // Default to affiliate for external products, physical for others
      return product.external_url ? 'affiliate' : 'physical';
    };

    const detectedProductType = detectProductType(wooProduct);

    // Extract image gallery - capture multiple images
    const imageGallery = wooProduct.images?.map(img => ({
      id: img.id,
      src: img.src,
      alt: img.alt || wooProduct.name,
      name: img.name || ''
    })) || [];

    // Extract product tags
    const productTags = wooProduct.tags?.map(tag => tag.name) || [];

    // Extract product attributes for detailed specifications
    const productAttributes = wooProduct.attributes?.map(attr => ({
      id: attr.id,
      name: attr.name,
      options: attr.options,
      visible: attr.visible,
      variation: attr.variation,
      position: attr.position
    })) || [];

    // Extract dimensions and weight
    const dimensions = wooProduct.dimensions ? {
      length: wooProduct.dimensions.length || '',
      width: wooProduct.dimensions.width || '',
      height: wooProduct.dimensions.height || ''
    } : null;

    // Extract meta data for additional product information
    const metaData = wooProduct.meta_data?.reduce((acc, meta) => {
      if (meta.key && meta.value) {
        acc[meta.key] = meta.value;
      }
      return acc;
    }, {} as Record<string, any>) || {};

    // Build platform-specific data to preserve all WooCommerce fields
    const platformSpecificData = {
      woocommerce: {
        slug: wooProduct.slug,
        type: wooProduct.type,
        virtual: wooProduct.virtual,
        downloadable: wooProduct.downloadable,
        manage_stock: wooProduct.manage_stock,
        tax_status: wooProduct.tax_status,
        tax_class: wooProduct.tax_class,
        backorders: wooProduct.backorders,
        backorders_allowed: wooProduct.backorders_allowed,
        backordered: wooProduct.backordered,
        sold_individually: wooProduct.sold_individually,
        shipping_required: wooProduct.shipping_required,
        shipping_taxable: wooProduct.shipping_taxable,
        shipping_class: wooProduct.shipping_class,
        reviews_allowed: wooProduct.reviews_allowed,
        upsell_ids: wooProduct.upsell_ids || [],
        cross_sell_ids: wooProduct.cross_sell_ids || [],
        parent_id: wooProduct.parent_id,
        purchase_note: wooProduct.purchase_note,
        default_attributes: wooProduct.default_attributes || [],
        variations: wooProduct.variations || [],
        grouped_products: wooProduct.grouped_products || [],
        button_text: wooProduct.button_text,
        product_url: wooProduct.product_url,
        image_gallery: imageGallery,
        attributes: productAttributes,
        dimensions: dimensions,
        weight: wooProduct.weight,
        meta_data: metaData,
        short_description: wooProduct.short_description
      }
    };

    // Calculate pricing based on product type
    const basePrice = parseFloat(wooProduct.price) || parseFloat(wooProduct.regular_price) || 0;
    const regularPrice = parseFloat(wooProduct.regular_price) || parseFloat(wooProduct.price) || 0;
    
    let finalPrice: number;
    let finalOriginalPrice: number;
    let costPrice: number | null = null;
    
    if (detectedProductType === 'dropship') {
      // For dropship products: use rate card system for pricing
      costPrice = basePrice;
      
      try {
        // Get markup percentage from rate card system
        const markupInfo = await dropshipMarkupService.getMarkupPercentage(aveenixCategory, `woo-${wooProduct.id}`);
        const markupMultiplier = 1 + (markupInfo.percentage / 100);
        
        finalPrice = basePrice * markupMultiplier;
        finalOriginalPrice = regularPrice * markupMultiplier;
        
        console.log(`[Dropship Pricing] ${wooProduct.name}: Cost=${costPrice}, Markup=${markupInfo.percentage}%, Sell=${finalPrice} (${markupInfo.source})`);
      } catch (error) {
        console.error(`[Dropship Pricing Error] ${wooProduct.name}:`, error);
        // Fallback to 50% margin if rate card fails
        finalPrice = basePrice * 1.5;
        finalOriginalPrice = regularPrice * 1.5;
      }
    } else {
      // For non-dropship products: keep original pricing logic
      finalPrice = basePrice;
      finalOriginalPrice = regularPrice;
    }

    const transformedProduct = {
      id: `woo-${wooProduct.id}`,
      name: wooProduct.name,
      description: this.cleanProductDescription(wooProduct.description || wooProduct.short_description),
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      costPrice: costPrice,
      category: aveenixCategory,
      brand: 'AVEENIX',
      imageUrl: wooProduct.images?.[0]?.src || '/placeholder-image.jpg',
      
      // Tier 1 Enhancement: Product Gallery (3-4 images max)
      imageUrl2: wooProduct.images?.[1]?.src || null,
      imageUrl3: wooProduct.images?.[2]?.src || null,
      imageUrl4: wooProduct.images?.[3]?.src || null,
      
      // Tier 1 Enhancement: Enhanced Product Structure
      shortDescription: this.cleanProductDescription(wooProduct.short_description) || null,
      isFeatured: wooProduct.featured || false,
      
      // Tier 1 Enhancement: Sale & Pricing Intelligence
      salePrice: wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : null,
      saleStartDate: wooProduct.date_on_sale_from ? new Date(wooProduct.date_on_sale_from) : null,
      saleEndDate: wooProduct.date_on_sale_to ? new Date(wooProduct.date_on_sale_to) : null,
      totalSales: wooProduct.total_sales || 0,
      
      rating: parseFloat(wooProduct.average_rating) || 0,
      reviewCount: wooProduct.rating_count || 0,
      isNew: false,
      isBestseller: wooProduct.rating_count > 50,
      isOnSale: !!wooProduct.sale_price,
      discountPercentage: wooProduct.sale_price ? 
        Math.round(((parseFloat(wooProduct.regular_price) - parseFloat(wooProduct.sale_price)) / parseFloat(wooProduct.regular_price)) * 100) : 0,
      stockStatus: wooProduct.stock_status === 'instock' ? 'in_stock' : 'out_of_stock',
      stockQuantity: wooProduct.stock_quantity || 0,
      isInStock: wooProduct.stock_status === 'instock',
      sourcePlatform: detectSourcePlatform(wooProduct.external_url).name,
      externalId: wooProduct.id.toString(),
      affiliateUrl: wooProduct.external_url || '',
      productType: detectedProductType,
      approvalStatus: 'preview',
      
      // Enhanced fields from WooCommerce API
      sku: wooProduct.sku || '',
      productTags: productTags,
      platformSpecificData: platformSpecificData,
      
      // Additional product identity fields
      productCode: wooProduct.sku || `WOO-${wooProduct.id}`, // Use SKU as product code or generate one
      barcode: metaData._barcode || metaData.barcode || '', // Check meta data for barcode
      reference: `WOO-REF-${wooProduct.id}`, // Generate reference
      manufacturer: 'AVEENIX', // Set manufacturer
      seoField: wooProduct.name.toLowerCase().replace(/\s+/g, '-'), // Generate SEO field
      notes: `Imported from WooCommerce on ${new Date().toISOString()}`,

      // AI Category Classification Results
      aiSuggestedCategories: aiSuggestedCategories,
      categoryConfidenceScore: categoryConfidenceScore,
      categoryMappingSource: mappingSource,
      
      // WooCommerce Category Information
      wooCommerceCategories: wooCommerceCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      }))
    };

    // Debug logging to track what's being transformed
    console.log(`[WooCommerce Transform] Product ${wooProduct.id}:`);
    console.log(`  - Name: ${wooProduct.name}`);
    console.log(`  - SKU: "${wooProduct.sku || '(empty)'}"`);
    console.log(`  - Tags: ${wooProduct.tags?.length || 0} tags`);
    console.log(`  - Images: ${wooProduct.images?.length || 0} images`);
    if (wooProduct.images && wooProduct.images.length > 0) {
      wooProduct.images.forEach((img, index) => {
        console.log(`    Image ${index + 1}: ${img.src}`);
      });
    }
    console.log(`  - Stock Status: "${wooProduct.stock_status}"`);
    console.log(`  - Stock Quantity: ${wooProduct.stock_quantity}`);
    console.log(`  - Manage Stock: ${wooProduct.manage_stock}`);
    console.log(`  - Final imageUrl: "${transformedProduct.imageUrl}"`);
    console.log(`  - Final imageUrl2: "${transformedProduct.imageUrl2}"`);
    console.log(`  - Final imageUrl3: "${transformedProduct.imageUrl3}"`);
    console.log(`  - Final imageUrl4: "${transformedProduct.imageUrl4}"`);
    console.log(`  - Final stockStatus: "${transformedProduct.stockStatus}"`);
    console.log(`  - Final isInStock: ${transformedProduct.isInStock}`);
    console.log(`  - Attributes: ${wooProduct.attributes?.length || 0} attributes`);
    console.log(`  - Weight: "${wooProduct.weight || '(empty)'}"`);
    console.log(`  - Platform Data Keys: ${Object.keys(platformSpecificData.woocommerce).length} keys`);
    console.log(`  - Product Tags Array: [${productTags.join(', ')}]`);
    console.log(`  - Transformed productTags:`, JSON.stringify(transformedProduct.productTags));
    console.log(`  - Transformed platformSpecificData exists:`, !!transformedProduct.platformSpecificData);

    return transformedProduct;
  }

  transformToAveenixReview(wooReview: WooCommerceReview, productId: string) {
    return {
      productId,
      externalId: wooReview.id.toString(),
      sourcePlatform: 'woocommerce' as const, // Reviews always come from WooCommerce system
      reviewerName: wooReview.reviewer || 'Anonymous',
      reviewerEmail: wooReview.reviewer_email || null,
      rating: wooReview.rating || 5,
      title: null, // WooCommerce reviews don't have titles
      content: wooReview.review || '',
      isVerifiedPurchase: wooReview.verified || false,
      helpfulCount: 0,
      reviewDate: new Date(wooReview.date_created),
      lastSyncedAt: new Date(),
    };
  }

  async fetchAndTransformProductWithReviews(wooProduct: WooCommerceProduct) {
    // Transform the product first
    const transformedProduct = await this.transformToAveenixProduct(wooProduct);
    
    // Fetch real reviews from WooCommerce
    const wooReviews = await this.fetchProductReviews(wooProduct.id);
    
    // Update product with real rating data
    if (wooReviews.length > 0) {
      const totalRating = wooReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / wooReviews.length;
      
      transformedProduct.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
      transformedProduct.reviewCount = wooReviews.length;
    }
    
    // Transform reviews
    const transformedReviews = wooReviews.map(review => 
      this.transformToAveenixReview(review, transformedProduct.id)
    );
    
    return {
      product: transformedProduct,
      reviews: transformedReviews
    };
  }

  async importProductsWithReviews(page: number = 1, perPage: number = 20, saveToDatabase: boolean = true) {
    try {
      const wooProducts = await this.fetchProducts(page, perPage);
      let savedProducts = [];
      let totalReviewsImported = 0;
      
      if (saveToDatabase && wooProducts.length > 0) {
        // Import the db connection and storage
        const { storage } = await import('../storage');
        
        // Process each product with reviews
        for (const wooProduct of wooProducts) {
          try {
            // Transform product first
            const aveenixProduct = await this.transformToAveenixProduct(wooProduct);
            
            // Fetch authentic reviews from WooCommerce
            const wooReviews = await this.fetchProductReviews(wooProduct.id);
            
            // Update product with real rating data from authentic reviews
            if (wooReviews.length > 0) {
              const totalRating = wooReviews.reduce((sum, review) => sum + review.rating, 0);
              const averageRating = totalRating / wooReviews.length;
              
              aveenixProduct.rating = Math.round(averageRating * 10) / 10;
              aveenixProduct.reviewCount = wooReviews.length;
            } else {
              // No reviews available - set authentic null values
              aveenixProduct.rating = null;
              aveenixProduct.reviewCount = 0;
            }
            
            // Save product to database
            const savedProduct = await storage.createProduct(aveenixProduct);
            savedProducts.push(savedProduct);
            
            // Transform and save authentic reviews
            if (wooReviews.length > 0) {
              const transformedReviews = wooReviews.map(review => 
                this.transformToAveenixReview(review, savedProduct.id)
              );
              
              if (transformedReviews.length > 0) {
                await storage.createReviews(transformedReviews);
                totalReviewsImported += transformedReviews.length;
                console.log(`[Import] ✅ Imported ${transformedReviews.length} authentic reviews for ${savedProduct.name}`);
              }
            }
            
            console.log(`[Import] ✅ Imported product: ${savedProduct.name} with ${wooReviews.length} reviews`);
            
          } catch (dbError) {
            console.error(`Error saving product ${wooProduct.name}:`, dbError);
          }
        }
      }
      
      return {
        success: true,
        imported: wooProducts.length,
        saved: savedProducts.length,
        reviewsImported: totalReviewsImported,
        products: savedProducts,
        page,
        perPage,
        hasMore: wooProducts.length === perPage,
      };
    } catch (error) {
      console.error('Error importing WooCommerce products with reviews:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        imported: 0,
        saved: 0,
        reviewsImported: 0,
        products: [],
      };
    }
  }

  async importProducts(page: number = 1, perPage: number = 20, saveToDatabase: boolean = true) {
    // Delegate to the enhanced import method with reviews
    return this.importProductsWithReviews(page, perPage, saveToDatabase);
  }

  // NEW: Proper staging workflow for product imports
  async importProductsToStaging(page: number = 1, perPage: number = 20) {
    try {
      const wooProducts = await this.fetchProducts(page, perPage);
      let stagedProducts = [];
      let skippedDuplicates = 0;
      
      if (wooProducts.length > 0) {
        const { storage } = await import('../storage');
        
        for (const wooProduct of wooProducts) {
          try {
            // Check if product already exists
            const existingProduct = await storage.getProduct(`woo-${wooProduct.id}`);
            if (existingProduct) {
              console.log(`[Staging] Skipping duplicate product: woo-${wooProduct.id}`);
              skippedDuplicates++;
              continue;
            }
            
            // Transform product for staging
            const aveenixProduct = await this.transformToAveenixProduct(wooProduct);
            
            // CRITICAL: Set approval status to 'preview' for staging workflow
            aveenixProduct.approvalStatus = 'preview';
            
            // Fetch and apply authentic reviews
            const wooReviews = await this.fetchProductReviews(wooProduct.id);
            if (wooReviews.length > 0) {
              const totalRating = wooReviews.reduce((sum, review) => sum + review.rating, 0);
              const averageRating = totalRating / wooReviews.length;
              aveenixProduct.rating = Math.round(averageRating * 10) / 10;
              aveenixProduct.reviewCount = wooReviews.length;
            } else {
              aveenixProduct.rating = null;
              aveenixProduct.reviewCount = 0;
            }
            
            // Save to staging (with pending status)
            const stagedProduct = await storage.createProduct(aveenixProduct);
            stagedProducts.push(stagedProduct);
            
            console.log(`[Staging] ✅ Staged product: ${stagedProduct.name} (Status: ${stagedProduct.approvalStatus})`);
            
          } catch (productError) {
            console.error(`[Staging] Error staging product ${wooProduct.name}:`, productError);
          }
        }
      }
      
      return {
        success: true,
        imported: wooProducts.length,
        saved: stagedProducts.length,
        skipped: skippedDuplicates,
        products: stagedProducts,
        message: `Staged ${stagedProducts.length} products in preview, skipped ${skippedDuplicates} duplicates`,
        page,
        perPage,
        hasMore: wooProducts.length === perPage,
      };
    } catch (error) {
      console.error('Error in importProductsToStaging:', error);
      throw error;
    }
  }
}