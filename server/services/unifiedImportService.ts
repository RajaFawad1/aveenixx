import { db } from "../db";
import { 
  products, 
  categories, 
  importSessions, 
  platformSyncLogs, 
  categoryMappings,
  type InsertProduct,
  type InsertImportSession,
  type InsertPlatformSyncLog,
  type UnifiedProduct,
  type CategoryWithSubcategories
} from "@shared/schema";
import { eq, and, inArray } from "drizzle-orm";
import { QualityControlOrchestrator } from "./qualityControl/qualityControlOrchestrator";

export interface WooCommerceProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  categories: Array<{ id: string; name: string; slug: string }>;
  images: Array<{ src: string; alt: string }>;
  stock_quantity: number;
  in_stock: boolean;
  sku: string;
  brand?: string;
  external_url?: string;
  tags: Array<{ name: string; slug: string }>;
  meta_data: Record<string, any>;
}

export interface ImportConfig {
  sourcePlatform: 'amazon' | 'aliexpress' | 'walmart' | 'woocommerce';
  productType: 'affiliate' | 'dropship' | 'multivendor';
  batchSize: number;
  categoryMappingMode: 'auto' | 'manual';
  priceMarkup?: number; // Percentage markup for dropship products
  defaultCurrency: string;
  syncInventory: boolean;
  enableAutoSync: boolean;
}

export class UnifiedImportService {
  private qualityControl: QualityControlOrchestrator;
  
  constructor() {
    this.qualityControl = new QualityControlOrchestrator();
  }
  
  /**
   * Start a new import session from WooCommerce or other platforms
   */
  async startImportSession(config: ImportConfig, createdBy?: number): Promise<number> {
    const [session] = await db
      .insert(importSessions)
      .values({
        sourcePlatform: config.sourcePlatform,
        status: 'pending',
        importConfig: config as any,
        createdBy,
      })
      .returning();

    console.log(`✓ Started import session ${session.id} for ${config.sourcePlatform}`);
    return session.id;
  }

  /**
   * Process WooCommerce product data and convert to AVEENIX format
   */
  async processWooCommerceProduct(
    wooProduct: WooCommerceProduct, 
    config: ImportConfig,
    sessionId: number
  ): Promise<UnifiedProduct | null> {
    try {
      // Map WooCommerce categories to AVEENIX unified categories
      const mappedCategory = await this.mapCategoriesToUnified(
        wooProduct.categories,
        config.sourcePlatform
      );

      if (!mappedCategory) {
        await this.logSyncError(
          wooProduct.id,
          config.sourcePlatform,
          'category_mapping',
          `No unified category found for: ${wooProduct.categories.map(c => c.name).join(', ')}`
        );
        return null;
      }

      // Determine product type based on tags and metadata
      const productType = this.determineProductType(wooProduct, config);
      
      // Calculate pricing with markup if needed
      const pricing = this.calculatePricing(wooProduct, config);

      // Build AVEENIX product data
      const productData: InsertProduct = {
        id: `${config.sourcePlatform}_${wooProduct.id}`,
        name: wooProduct.name,
        description: wooProduct.description,
        price: pricing.price.toString(),
        originalPrice: pricing.originalPrice?.toString(),
        category: mappedCategory.name,
        brand: wooProduct.brand || 'Unknown',
        imageUrl: wooProduct.images[0]?.src || '/placeholder-product.jpg',
        rating: "0",
        reviewCount: 0,
        isOnSale: !!wooProduct.sale_price,
        discountPercentage: pricing.discountPercentage,
        
        // Unified import fields
        sourcePlatform: config.sourcePlatform,
        productType: productType === 'native' ? 'physical' : productType, // Fix productType enum
        externalId: wooProduct.id,
        affiliateUrl: productType === 'affiliate' ? wooProduct.external_url : null,
        categoryMapping: mappedCategory.name,
        platformSpecificData: JSON.stringify({
          sku: wooProduct.sku,
          tags: wooProduct.tags,
          meta_data: wooProduct.meta_data,
          original_categories: wooProduct.categories
        }),
        
        // Inventory
        stockQuantity: wooProduct.stock_quantity || 0,
        isInStock: wooProduct.in_stock,
        lastSyncedAt: new Date(),
        syncStatus: 'active',
        
        // Currency
        originalCurrency: config.defaultCurrency,
        exchangeRate: "1.0",
        
        // Commission for affiliate products
        commissionRate: productType === 'affiliate' ? "5.0" : "0.0",
      };

      // === QUALITY CONTROL PHASE ===
      console.log(`🔍 Running quality control for: ${wooProduct.name}`);
      const qualityResult = await this.qualityControl.processProduct(productData);
      
      // If quality control rejects the product, set status and reasoning
      if (qualityResult.shouldReject) {
        productData.workflowStatus = 'rejected';
        console.log(`❌ Product rejected: ${qualityResult.rejectionReason} (Score: ${qualityResult.qualityScore})`);
      } else {
        // Product passes quality control, set to preview for AI categorization
        productData.workflowStatus = 'preview';
        console.log(`✅ Product approved: ${qualityResult.overallAssessment} (Score: ${qualityResult.qualityScore})`);
      }

      // Insert or update product
      const [product] = await db
        .insert(products)
        .values(productData)
        .onConflictDoUpdate({
          target: products.id,
          set: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            originalPrice: productData.originalPrice,
            stockQuantity: productData.stockQuantity,
            isInStock: productData.isInStock,
            lastSyncedAt: new Date(),
            platformSpecificData: productData.platformSpecificData,
          }
        })
        .returning();

      // Log successful sync with quality data
      await this.logSync(
        product.id,
        config.sourcePlatform,
        'full',
        { 
          imported: true, 
          session_id: sessionId,
          quality_score: qualityResult.qualityScore,
          quality_status: qualityResult.shouldReject ? 'rejected' : 'approved'
        },
        { product_data: productData },
        'success'
      );

      console.log(`✓ Processed product: ${product.name} (Quality: ${qualityResult.qualityScore})`);
      
      return {
        ...product,
        category: mappedCategory,
        isAffiliate: productType === 'affiliate',
        isDropship: productType === 'dropship',
        isMultivendor: productType === 'multivendor',
        isNative: productType === 'physical'
      } as UnifiedProduct;

    } catch (error) {
      await this.logSyncError(
        wooProduct.id,
        config.sourcePlatform,
        'full',
        `Product processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      console.error(`❌ Failed to process product ${wooProduct.id}:`, error);
      return null;
    }
  }

  /**
   * Map external platform categories to AVEENIX unified categories
   */
  private async mapCategoriesToUnified(
    externalCategories: Array<{ name: string; slug: string }>,
    platform: string
  ) {
    for (const extCategory of externalCategories) {
      // Try to find existing mapping
      const [mapping] = await db
        .select({
          category: categories
        })
        .from(categoryMappings)
        .innerJoin(categories, eq(categoryMappings.aveenixCategoryId, categories.id))
        .where(and(
          eq(categoryMappings.sourcePlatform, platform as any),
          eq(categoryMappings.externalCategoryName, extCategory.name)
        ))
        .limit(1);

      if (mapping) {
        return mapping.category;
      }
    }

    // Auto-create category mapping using fuzzy matching
    return await this.autoMapCategory(externalCategories[0], platform);
  }

  /**
   * Auto-create category mapping using intelligent matching
   */
  private async autoMapCategory(
    externalCategory: { name: string; slug: string },
    platform: string
  ) {
    const categoryName = externalCategory.name.toLowerCase();
    
    // Simple keyword matching for initial implementation
    const mappingRules = {
      'electronics': ['electronic', 'phone', 'computer', 'tech', 'gadget'],
      'fashion': ['clothing', 'fashion', 'apparel', 'shirt', 'dress', 'shoe'],
      'home-garden': ['home', 'garden', 'furniture', 'decor', 'kitchen'],
      'health-beauty': ['health', 'beauty', 'cosmetic', 'skincare', 'makeup'],
      'sports-outdoors': ['sport', 'outdoor', 'fitness', 'athletic', 'exercise'],
      'automotive': ['automotive', 'car', 'auto', 'vehicle', 'motor'],
      'books-media': ['book', 'media', 'movie', 'music', 'dvd'],
      'toys-games': ['toy', 'game', 'puzzle', 'children', 'kid'],
      'baby-kids': ['baby', 'infant', 'child', 'kid', 'toddler'],
    };

    for (const [unifiedSlug, keywords] of Object.entries(mappingRules)) {
      if (keywords.some(keyword => categoryName.includes(keyword))) {
        const [unifiedCategory] = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, unifiedSlug))
          .limit(1);

        if (unifiedCategory) {
          // Create mapping
          await db
            .insert(categoryMappings)
            .values({
              aveenixCategoryId: unifiedCategory.id,
              sourcePlatform: platform as any,
              externalCategoryId: externalCategory.slug,
              externalCategoryName: externalCategory.name,
              confidence: "0.8", // Auto-mapped with 80% confidence
              isActive: true,
            })
            .onConflictDoNothing();

          console.log(`✓ Auto-mapped category: ${externalCategory.name} → ${unifiedCategory.name}`);
          return unifiedCategory;
        }
      }
    }

    // Default to "Collectibles & Antiques" for unmatched categories
    const [defaultCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, 'collectibles-antiques'))
      .limit(1);

    return defaultCategory || null;
  }

  /**
   * Determine product type based on tags and metadata
   */
  private determineProductType(
    wooProduct: WooCommerceProduct,
    config: ImportConfig
  ): 'affiliate' | 'dropship' | 'multivendor' | 'native' {
    // Check for affiliate indicators
    if (wooProduct.external_url || 
        wooProduct.tags.some(tag => tag.name.toLowerCase().includes('affiliate'))) {
      return 'affiliate';
    }

    // Check for dropship indicators
    if (wooProduct.tags.some(tag => 
        ['dropship', 'aliexpress', 'alibaba'].includes(tag.name.toLowerCase()))) {
      return 'dropship';
    }

    // Check for multivendor indicators
    if (wooProduct.meta_data?.vendor_id) {
      return 'multivendor';
    }

    // Default to the configured product type
    return config.productType;
  }

  /**
   * Calculate pricing with markup and discounts
   */
  private calculatePricing(wooProduct: WooCommerceProduct, config: ImportConfig) {
    const regularPrice = parseFloat(wooProduct.regular_price || wooProduct.price);
    const salePrice = wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : null;
    
    let finalPrice = salePrice || regularPrice;
    
    // Apply markup for dropship products
    if (config.productType === 'dropship' && config.priceMarkup) {
      finalPrice = finalPrice * (1 + config.priceMarkup / 100);
    }

    const discountPercentage = salePrice 
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

    return {
      price: finalPrice,
      originalPrice: salePrice ? regularPrice : null,
      discountPercentage
    };
  }

  /**
   * Log sync operation
   */
  private async logSync(
    productId: string,
    platform: string,
    syncType: string,
    oldValue: any,
    newValue: any,
    status: 'success' | 'failed' | 'skipped'
  ) {
    await db
      .insert(platformSyncLogs)
      .values({
        productId,
        sourcePlatform: platform as any,
        syncType,
        oldValue,
        newValue,
        status,
      })
      .execute();
  }

  /**
   * Log sync error
   */
  private async logSyncError(
    productId: string,
    platform: string,
    syncType: string,
    errorMessage: string
  ) {
    await this.logSync(
      productId,
      platform,
      syncType,
      {},
      {},
      'failed'
    );

    await db
      .insert(platformSyncLogs)
      .values({
        productId,
        sourcePlatform: platform as any,
        syncType,
        status: 'failed',
        errorMessage,
      })
      .execute();
  }

  /**
   * Complete import session
   */
  async completeImportSession(
    sessionId: number, 
    stats: { successful: number; failed: number; total: number }
  ) {
    await db
      .update(importSessions)
      .set({
        status: 'completed',
        processedProducts: stats.total,
        successfulImports: stats.successful,
        failedImports: stats.failed,
        completedAt: new Date(),
      })
      .where(eq(importSessions.id, sessionId));

    console.log(`✅ Import session ${sessionId} completed: ${stats.successful}/${stats.total} products imported`);
  }

  /**
   * Get unified categories with product counts and platform distribution
   */
  async getUnifiedCategoriesWithStats(): Promise<CategoryWithSubcategories[]> {
    const categoriesWithStats = await db
      .select({
        category: categories,
        productCount: categories.productCount,
      })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder);

    // For now, return basic structure - this can be enhanced with real stats
    return categoriesWithStats.map(item => ({
      ...item.category,
      subcategories: [],
      productCount: item.productCount || 0,
      platformDistribution: {
        aveenix: 0,
        amazon: 0,
        aliexpress: 0,
        walmart: 0,
        woocommerce: 0
      }
    }));
  }

  /**
   * Search unified products across all platforms
   */
  async searchUnifiedProducts(
    query: string,
    category?: string,
    platforms?: string[],
    limit: number = 20,
    offset: number = 0
  ): Promise<UnifiedProduct[]> {
    let whereConditions = [];
    
    if (category) {
      whereConditions.push(eq(products.category, category));
    }
    
    if (platforms && platforms.length > 0) {
      whereConditions.push(inArray(products.sourcePlatform, platforms as any));
    }

    // For now, return basic search - this can be enhanced with full-text search
    const searchResults = await db
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.category, categories.name))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .limit(limit)
      .offset(offset);

    return searchResults.map(result => ({
      ...result.product,
      category: result.category || { name: result.product.category } as any,
      isAffiliate: result.product.productType === 'affiliate',
      isDropship: result.product.productType === 'dropship',
      isMultivendor: result.product.productType === 'multivendor',
      isNative: result.product.productType === 'native'
    }));
  }
}

export const unifiedImportService = new UnifiedImportService();