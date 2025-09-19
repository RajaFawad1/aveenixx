// E-commerce API routes for Aveenix Platform

import type { Express } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertReviewSchema, 
  insertAddressSchema,
  insertCartSchema,
  insertWishlistSchema,
  insertProductSchema,
  type OrderWithItems,
  type ProductWithReviews,
  type ReviewWithUser
} from "../shared/schema";
import { 
  hasPermission, 
  canViewOrder, 
  canEditProduct, 
  Permission, 
  UserRole 
} from "../shared/permissions";
import { 
  generateOrderNumber, 
  calculateOrderTotal, 
  formatCurrency,
  validatePromoCode 
} from "../shared/utils";
import { db } from "./db";
import { categories } from "../shared/schema";
import { eq, desc, asc, like, and, or, isNull, sql, count, sum, gte, lte, inArray, isNotNull } from "drizzle-orm";
import qualityControlRoutes from "./routes/qualityControlRoutes";

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Permission middleware
const requirePermission = (permission: Permission) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

export function registerEcommerceRoutes(app: Express) {
  
  // PRODUCT ROUTES
  
  // RECOMMENDATION ENDPOINTS MOVED TO MAIN ROUTES.TS TO AVOID CONFLICTS

  // Get all products with filtering and pagination
  app.get("/api/products", async (req, res) => {
    try {
      const { 
        category, 
        search, 
        minPrice, 
        maxPrice, 
        isNew, 
        isBestseller, 
        isOnSale,
        page = 1, 
        limit = 1000,
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      const filters = {
        category: category as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        isNew: isNew === 'true',
        isBestseller: isBestseller === 'true',
        isOnSale: isOnSale === 'true',
      };

      const products = await storage.getProducts(
        filters,
        parseInt(page as string),
        parseInt(limit as string),
        sortBy as string,
        sortOrder as string
      );

      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product with reviews
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = req.params.id; // Keep as string, don't parse as integer
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Get reviews for this product
      const reviews = await storage.getReviews(productId);
      
      // Return product with reviews
      res.json({ ...product, reviews });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create new product (admin/manager only)
  app.post("/api/products", requireAuth, requirePermission(Permission.CREATE_PRODUCTS), async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Update product (admin/manager only)
  app.put("/api/products/:id", requireAuth, requirePermission(Permission.UPDATE_PRODUCTS), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      
      const product = await storage.updateProduct(productId, productData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // PRODUCT RECOMMENDATION ROUTES
  
  // Get new arrivals by category
  app.get("/api/categories/:categoryName/new-arrivals", async (req, res) => {
    try {
      const { categoryName } = req.params;
      const limit = parseInt(req.query.limit as string) || 6;
      
      // If categoryName is a number (ID), get the category name first
      let actualCategoryName = categoryName;
      if (!isNaN(parseInt(categoryName))) {
        const category = await storage.getCategory(parseInt(categoryName));
        actualCategoryName = category?.name || categoryName;
      }
      
      const products = await storage.getNewArrivalsByCategory(actualCategoryName, limit);
      res.json(products);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      res.status(500).json({ error: "Failed to fetch new arrivals" });
    }
  });

  // Get best sellers by category
  app.get("/api/categories/:categoryName/best-sellers", async (req, res) => {
    try {
      const { categoryName } = req.params;
      const limit = parseInt(req.query.limit as string) || 6;
      
      // If categoryName is a number (ID), get the category name first
      let actualCategoryName = categoryName;
      if (!isNaN(parseInt(categoryName))) {
        const category = await storage.getCategory(parseInt(categoryName));
        actualCategoryName = category?.name || categoryName;
      }
      
      const products = await storage.getBestSellersByCategory(actualCategoryName, limit);
      res.json(products);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      res.status(500).json({ error: "Failed to fetch best sellers" });
    }
  });

  // Get customers also viewed by category
  app.get("/api/categories/:categoryName/customers-also-viewed", async (req, res) => {
    try {
      const { categoryName } = req.params;
      const limit = parseInt(req.query.limit as string) || 6;
      
      // If categoryName is a number (ID), get the category name first
      let actualCategoryName = categoryName;
      if (!isNaN(parseInt(categoryName))) {
        const category = await storage.getCategory(parseInt(categoryName));
        actualCategoryName = category?.name || categoryName;
      }
      
      const products = await storage.getCustomersAlsoViewedByCategory(actualCategoryName, limit);
      res.json(products);
    } catch (error) {
      console.error('Error fetching customers also viewed:', error);
      res.status(500).json({ error: "Failed to fetch customers also viewed" });
    }
  });

  // Track product view (increment view count)
  app.post("/api/products/:id/view", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementProductViewCount(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking product view:', error);
      res.status(500).json({ error: "Failed to track product view" });
    }
  });

  // ORDER ROUTES

  // Get user's orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get all orders (admin/manager only)
  app.get("/api/orders/all", requireAuth, requirePermission(Permission.VIEW_ALL_ORDERS), async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const orders = await storage.getAllOrders(
        parseInt(page as string),
        parseInt(limit as string),
        status as string
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderWithItems(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Check if user can view this order
      if (!canViewOrder(req.user.role, orderId.toString(), req.user.id.toString())) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Create new order
  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id,
        orderNumber: generateOrderNumber()
      });
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Update order status (admin/manager only)
  app.put("/api/orders/:id/status", requireAuth, requirePermission(Permission.UPDATE_ORDER_STATUS), async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status, trackingNumber } = req.body;
      
      const order = await storage.updateOrderStatus(orderId, status, trackingNumber);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // REVIEW ROUTES

  // Get product reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = req.params.id; // Keep as string
      console.log(`[DEBUG] Fetching reviews for productId: ${productId}`);
      
      const reviews = await storage.getReviews(productId); // Use correct method name
      console.log(`[DEBUG] Found ${reviews.length} reviews for product ${productId}`);
      
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      console.error('Error details:', error.message, error.stack);
      res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
  });

  // Create product review
  app.post("/api/products/:id/reviews", requireAuth, async (req, res) => {
    try {
      const productId = req.params.id; // Keep as string
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId: req.user.id
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid review data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Update review
  app.put("/api/reviews/:id", requireAuth, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const reviewData = insertReviewSchema.partial().parse(req.body);
      
      const review = await storage.updateReview(reviewId, reviewData, req.user.id);
      if (!review) {
        return res.status(404).json({ error: "Review not found or access denied" });
      }
      
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid review data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  // Vote on review helpfulness
  app.post("/api/reviews/:id/vote", requireAuth, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { voteType } = req.body; // 'helpful' or 'unhelpful'
      
      if (!['helpful', 'unhelpful'].includes(voteType)) {
        return res.status(400).json({ error: "Invalid vote type. Must be 'helpful' or 'unhelpful'" });
      }
      
      const result = await storage.voteOnReview(reviewId, req.user.id, voteType);
      res.json(result);
    } catch (error) {
      if (error.message === 'Review not found') {
        return res.status(404).json({ error: "Review not found" });
      }
      if (error.message === 'Vote already exists') {
        return res.status(409).json({ error: "You have already voted on this review" });
      }
      console.error('Error voting on review:', error);
      res.status(500).json({ error: "Failed to vote on review" });
    }
  });

  // Get user's vote on a review
  app.get("/api/reviews/:id/vote", requireAuth, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const vote = await storage.getUserReviewVote(reviewId, req.user.id);
      res.json({ vote: vote?.voteType || null });
    } catch (error) {
      console.error('Error fetching review vote:', error);
      res.status(500).json({ error: "Failed to fetch vote" });
    }
  });

  // CART ROUTES

  // Get user's cart (supports guest carts via session)
  app.get("/api/cart", async (req: any, res: any) => {
    try {
      let cartItems = [];
      
      if (req.user?.id) {
        // Authenticated user - get from database
        const dbCart = await storage.getCart(req.user.id);
        
        // Fetch product details for each cart item
        for (const cartItem of dbCart) {
          try {
            const product = await storage.getProduct(cartItem.productId);
            if (product) {
              cartItems.push({
                ...cartItem,
                name: product.name,
                price: parseFloat(product.price || '0'),
                image: product.imageUrl || product.imageUrl2 || '/placeholder-image.jpg',
                sku: product.sku,
                brand: product.brand,
                productType: product.productType,     // Critical for dual checkout
                affiliateUrl: product.affiliateUrl,   // Critical for external redirects
                sourcePlatform: product.sourcePlatform // For display
              });
            }
          } catch (err) {
            console.error('Error fetching product for cart item:', cartItem.productId, err);
          }
        }
      } else {
        // Guest user - get from session and enrich with product data
        const sessionCart = req.session?.guestCart || [];
        
        for (const cartItem of sessionCart) {
          try {
            const product = await storage.getProduct(cartItem.productId);
            if (product) {
              cartItems.push({
                ...cartItem,
                name: product.name,
                price: parseFloat(product.price || '0'),
                image: product.imageUrl || product.imageUrl2 || '/placeholder-image.jpg',
                sku: product.sku,
                brand: product.brand,
                productType: product.productType,     // Critical for dual checkout
                affiliateUrl: product.affiliateUrl,   // Critical for external redirects
                sourcePlatform: product.sourcePlatform // For display
              });
            }
          } catch (err) {
            console.error('Error fetching product for cart item:', cartItem.productId, err);
          }
        }
      }
      res.json(cartItems);
    } catch (error) {
      console.error('Cart API Error:', error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  // Add item to cart (supports guest carts)
  app.post("/api/cart", async (req: any, res: any) => {
    try {
      const { productId, quantity = 1 } = req.body;
      
      if (req.user?.id) {
        // Authenticated user - save to database
        const cartData = {
          productId,
          quantity,
          userId: req.user.id
        };
        const cartItem = await storage.addToCart(cartData);
        res.status(201).json(cartItem);
      } else {
        // Guest user - save to session
        if (!req.session.guestCart) {
          req.session.guestCart = [];
        }
        
        // Find existing item
        const existingIndex = req.session.guestCart.findIndex((item: any) => item.productId === productId);
        
        if (existingIndex >= 0) {
          // Update quantity
          req.session.guestCart[existingIndex].quantity += quantity;
        } else {
          // Add new item
          req.session.guestCart.push({
            id: Date.now().toString(),
            productId,
            quantity,
            createdAt: new Date()
          });
        }
        
        res.status(201).json({ message: "Item added to cart", cartItems: req.session.guestCart });
      }
    } catch (error: any) {
      console.error('Add to Cart Error:', error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  // Update cart item quantity (supports guest carts)
  app.put("/api/cart/:id", async (req: any, res) => {
    try {
      const { quantity } = req.body;
      
      if (req.user?.id) {
        // Authenticated user - update in database
        const cartItemId = parseInt(req.params.id);
        const cartItem = await storage.updateCartItem(cartItemId, quantity);
        if (!cartItem) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        res.json(cartItem);
      } else {
        // Guest user - update in session
        if (!req.session.guestCart) {
          return res.status(404).json({ error: "Cart not found" });
        }
        
        const itemIndex = req.session.guestCart.findIndex((item: any) => item.id === req.params.id);
        if (itemIndex === -1) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        
        req.session.guestCart[itemIndex].quantity = quantity;
        res.json({ message: "Cart item updated" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  // Remove item from cart (supports guest carts)
  app.delete("/api/cart/:id", async (req: any, res) => {
    try {
      if (req.user?.id) {
        // Authenticated user - remove from database
        const cartItemId = parseInt(req.params.id);
        const success = await storage.removeFromCart(cartItemId);
        
        if (!success) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        
        res.json({ message: "Item removed from cart" });
      } else {
        // Guest user - remove from session
        if (!req.session.guestCart) {
          return res.status(404).json({ error: "Cart not found" });
        }
        
        const itemIndex = req.session.guestCart.findIndex((item: any) => item.id === req.params.id);
        if (itemIndex === -1) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        
        req.session.guestCart.splice(itemIndex, 1);
        res.json({ message: "Item removed from cart" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });

  // WISHLIST ROUTES

  // Get user's wishlist
  app.get("/api/wishlist", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const wishlist = await storage.getWishlist(userId);
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  // Add item to wishlist
  app.post("/api/wishlist", requireAuth, async (req, res) => {
    try {
      const wishlistData = insertWishlistSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const wishlistItem = await storage.addToWishlist(wishlistData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid wishlist data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add item to wishlist" });
    }
  });

  // Remove item from wishlist
  app.delete("/api/wishlist/:id", requireAuth, async (req, res) => {
    try {
      const wishlistItemId = parseInt(req.params.id);
      const success = await storage.removeFromWishlist(wishlistItemId, req.user.id);
      
      if (!success) {
        return res.status(404).json({ error: "Wishlist item not found" });
      }
      
      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove item from wishlist" });
    }
  });

  // PROMO CODE ROUTES

  // Validate promo code
  app.post("/api/promo-codes/validate", async (req, res) => {
    try {
      const { code, orderTotal } = req.body;
      
      if (!validatePromoCode(code)) {
        return res.status(400).json({ error: "Invalid promo code format" });
      }
      
      const promoCode = await storage.validatePromoCode(code, orderTotal);
      if (!promoCode) {
        return res.status(404).json({ error: "Promo code not found or expired" });
      }
      
      res.json(promoCode);
    } catch (error) {
      res.status(500).json({ error: "Failed to validate promo code" });
    }
  });

  // CATEGORY ROUTES

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      // Get only main categories (parent_id IS NULL)
      const mainCategories = await db.select().from(categories).where(sql`parent_id IS NULL`).orderBy(asc(categories.sortOrder));
      
      // Get subcategories for each main category
      const categoriesWithSubcategories = await Promise.all(
        mainCategories.map(async (category) => {
          const subcategories = await db
            .select()
            .from(categories)
            .where(and(
              eq(categories.parentId, category.id),
              eq(categories.isActive, true)
            ))
            .orderBy(asc(categories.sortOrder));
          
          return {
            ...category,
            subcategories: subcategories || []
          };
        })
      );
      
      res.json(categoriesWithSubcategories);
    } catch (error) {
      console.error('Error fetching categories with subcategories:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Dynamic Category Filters endpoint - replaces hardcoded filters with real product data
  app.get('/api/categories/:categoryName/filters', async (req, res) => {
    try {
      const categoryName = decodeURIComponent(req.params.categoryName);
      const filters = await storage.getCategoryFilters(categoryName);
      res.json(filters);
    } catch (error) {
      console.error('Error fetching category filters:', error);
      res.status(500).json({ error: 'Failed to fetch category filters' });
    }
  });

  // Route removed - master categories with counts is handled in routes.ts

  // Get master categories with product counts
  app.get("/api/categories/master-with-counts", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      
      // Get product counts for each category
      // Use current database productCount, but recalc if missing
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          if (category.productCount !== null && category.productCount !== undefined) {
            return category;
          }
          try {
            const productCount = await storage.getProductCountByCategory(category.name);
            return { ...category, productCount: productCount || 0 };
          } catch (error) {
            console.error(`Error getting product count for category ${category.name}:`, error);
            return { ...category, productCount: 0 };
          }
        })
      );
      
      res.json(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories with counts:', error);
      res.status(500).json({ error: "Failed to fetch categories with counts" });
    }
  });

  // Get all subcategories with dynamic product counts
  app.get("/api/subcategories", async (req, res) => {
    try {
      // Get only subcategories (parent_id IS NOT NULL)
      const subcategories = await db.select().from(categories).where(sql`parent_id IS NOT NULL`).orderBy(asc(categories.sortOrder));
      
      // Get all products to calculate real counts
      const allProducts = await storage.getAllProductsForManagement();
      
      // Enhanced mapping for subcategories (product categories -> actual subcategory names that exist)
      const subcategoryMapping = {
        'Electronics': 'Smartphones',            // Many electronics are phones/tech devices
        'Smartphones': 'Smartphones',            // Direct match with existing subcategory  
        'Computers': 'Laptops & Computers',      // Direct match with existing subcategory
        'Gaming': 'Gaming Consoles',             // Maps to existing subcategory
        'Photography': 'Technology',             // Camera gear goes under Technology
        'Audio': 'Headphones & Audio',           // Direct match with existing subcategory
        'Wearables': 'Technology',               // Wearables under Technology
        'Skincare': 'Skincare',                  // Direct match
        'Fitness': 'Exercise & Fitness',         // Direct match
        'Exercise': 'Exercise & Fitness',
        'Sports': 'Sports & Recreation',
        'Car': 'Car Accessories',                // Direct match
        'Auto': 'Car Accessories',
        'Automotive': 'Car Electronics',         // Some auto products are electronics
        'Home': 'Home Improvement',
        'Garden': 'Garden & Outdoor',
        'Beauty': 'Beauty & Personal Care',
        'Health': 'Health & Wellness'
      };

      // Calculate product counts for each subcategory using same logic as master categories
      const subcategoriesWithCounts = subcategories.map(subcategory => {
        const productCount = allProducts.filter(product => {
          if (!product.category) return false;
          
          // Direct match - subcategory name matches product category
          if (product.category === subcategory.name) return true;
          
          // Mapped match - check if product category maps to this subcategory
          const mappedSubcategory = subcategoryMapping[product.category];
          if (mappedSubcategory === subcategory.name) return true;
          
          // Partial match for subcategories
          const subcategoryNameLower = subcategory.name.toLowerCase();
          const productCategoryLower = product.category.toLowerCase();
          
          // Check if subcategory name contains product category or vice versa
          if (subcategoryNameLower.includes(productCategoryLower) || productCategoryLower.includes(subcategoryNameLower)) {
            return true;
          }
          
          // Check for word-level matches
          const subcategoryWords = subcategoryNameLower.split(/[\s&]+/);
          const productWords = productCategoryLower.split(/[\s&]+/);
          
          for (const subcategoryWord of subcategoryWords) {
            for (const productWord of productWords) {
              if (subcategoryWord === productWord && subcategoryWord.length > 2) {
                return true;
              }
            }
          }
          
          return false;
        }).length;
        
        return {
          ...subcategory,
          productCount
        };
      });
      
      res.json(subcategoriesWithCounts);
    } catch (error) {
      console.error('Error fetching subcategories with counts:', error);
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  // Get subcategories for a parent category
  app.get('/api/categories/:parentId/subcategories', async (req, res) => {
    try {
      const parentId = parseInt(req.params.parentId);
      const subcategories = await db
        .select()
        .from(categories)
        .where(and(
          eq(categories.parentId, parentId),
          eq(categories.isActive, true)
        ))
        .orderBy(asc(categories.sortOrder));
      
      res.json(subcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
  });

  // Get all subcategories with parent info
  app.get('/api/subcategories', async (req, res) => {
    try {
      const subcategoriesResult = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          icon: categories.icon,
          parentId: categories.parentId,
          isActive: categories.isActive,
          productCount: categories.productCount,
          sortOrder: categories.sortOrder,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt
        })
        .from(categories)
        .where(and(
          sql`${categories.parentId} IS NOT NULL`,
          eq(categories.isActive, true)
        ))
        .orderBy(asc(categories.sortOrder));

      // Get parent category names
      const subcategoriesWithParent = [];
      for (const subcat of subcategoriesResult) {
        const parent = await db
          .select({ name: categories.name, slug: categories.slug })
          .from(categories)
          .where(eq(categories.id, subcat.parentId!))
          .limit(1);
        
        subcategoriesWithParent.push({
          ...subcat,
          parentName: parent[0]?.name || 'Unknown',
          parentSlug: parent[0]?.slug || 'unknown',
          status: subcat.isActive ? 'Active' : 'Inactive'
        });
      }
      
      res.json(subcategoriesWithParent);
    } catch (error) {
      console.error('Error fetching subcategories with parent:', error);
      res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
  });

  // ADDRESS ROUTES

  // Get user's addresses
  app.get("/api/addresses", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  });

  // Add new address
  app.post("/api/addresses", requireAuth, async (req, res) => {
    try {
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const address = await storage.createAddress(addressData);
      res.status(201).json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid address data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create address" });
    }
  });

  // Update address
  app.put("/api/addresses/:id", requireAuth, async (req, res) => {
    try {
      const addressId = parseInt(req.params.id);
      const addressData = insertAddressSchema.partial().parse(req.body);
      
      const address = await storage.updateAddress(addressId, addressData, req.user.id);
      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      
      res.json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid address data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update address" });
    }
  });

  // Delete address
  app.delete("/api/addresses/:id", requireAuth, async (req, res) => {
    try {
      const addressId = parseInt(req.params.id);
      const success = await storage.deleteAddress(addressId, req.user.id);
      
      if (!success) {
        return res.status(404).json({ error: "Address not found" });
      }
      
      res.json({ message: "Address deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete address" });
    }
  });

  // Fix product types for existing imported products based on their characteristics
  app.post('/api/product-management/fix-product-types', async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      let updatedCount = 0;

      for (const product of allProducts) {
        let newProductType = product.productType;

        // Auto-detect correct product type based on existing data
        if (product.affiliateUrl || product.externalId) {
          newProductType = 'affiliate';
        } else if (product.stockQuantity && product.stockQuantity > 0) {
          newProductType = 'physical';
        } else if (!product.stockQuantity && product.sourcePlatform === 'woocommerce') {
          newProductType = 'dropship';
        }

        // Update if product type changed
        if (newProductType !== product.productType) {
          await db
            .update(products)
            .set({ 
              productType: newProductType,
              updatedAt: new Date().toISOString()
            })
            .where(eq(products.id, product.id));
          
          updatedCount++;
        }
      }

      res.json({ 
        success: true, 
        message: `Updated ${updatedCount} products with correct product types`,
        updatedCount 
      });
    } catch (error) {
      console.error('Error fixing product types:', error);
      res.status(500).json({ success: false, message: 'Failed to fix product types' });
    }
  });

  // Quality Control Routes
  app.use("/api/quality-control", qualityControlRoutes);
}