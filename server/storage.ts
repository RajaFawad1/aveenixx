import { 
  users, products, categories, orders, orderItems, reviews, reviewVotes, wishlist, cart, 
  addresses, promoCodes, vendors, productAttributes, attributeValues,
  inventoryLocations, inventoryItems, stockMovements, inventoryAlerts, stockTransfers,
  productQA, userAddresses,
  type User, type InsertUser, type Product, type InsertProduct, 
  type Category, type InsertCategory, type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem, type Review, type InsertReview,
  type ReviewVote, type InsertReviewVote,
  type Wishlist, type InsertWishlist, type Cart, type InsertCart,
  type Address, type InsertAddress, type PromoCode, type InsertPromoCode,
  type Vendor, type InsertVendor, type OrderWithItems, type ProductWithReviews,
  type InventoryLocation, type InsertInventoryLocation, type InventoryItem, type InsertInventoryItem,
  type StockMovement, type InsertStockMovement, type InventoryAlert, type InsertInventoryAlert,
  type StockTransfer, type InsertStockTransfer, type InventoryDashboardStats,
  type InventoryItemWithProduct, type InventoryLocationWithItems, type StockMovementWithDetails,
  type ProductQA, type InsertProductQA, type UserAddress, type InsertUserAddress
} from "@shared/schema";
import { 
  orders as salesOrders, shipments, returns as salesReturns, payments as salesPayments,
  type Order as SalesOrder, type Shipment, type Return as SalesReturn, type Payment as SalesPayment
} from "@shared/salesSchema";
import { db } from "./db";
import { eq, and, like, or, desc, asc, gte, lte, count, sql, inArray, ilike, ne } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserPreferences(userId: number, preferences: {
    preferredCountry?: string;
    preferredLanguage?: string;
    preferredCurrency?: string;
    timezone?: string;
    theme?: string;
    colorTheme?: string;
  }): Promise<User | undefined>;
  
  // User address management
  getUserAddresses(userId: number): Promise<UserAddress[]>;
  getUserDefaultAddress(userId: number): Promise<UserAddress | undefined>;
  createUserAddress(address: InsertUserAddress): Promise<UserAddress>;
  updateUserAddress(id: number, address: Partial<InsertUserAddress>): Promise<UserAddress | undefined>;
  deleteUserAddress(id: number): Promise<boolean>;
  setDefaultAddress(userId: number, addressId: number): Promise<boolean>;
  
  // User profile management
  getUserProfile(userId: number): Promise<User | undefined>;
  updateUserProfile(userId: number, profileData: Partial<InsertUser>): Promise<User | undefined>;
  getUserAccountStats(userId: number): Promise<{
    totalOrders: number;
    totalSpent: string;
    itemsPurchased: number;
    averageRating: number;
    rewardPoints: number;
    accountAge: string;
  }>;
  
  // Product management
  getProduct(id: string): Promise<Product | undefined>;
  getProductByExternalId(externalId: string): Promise<Product | undefined>;
  getProducts(filters?: any, page?: number, limit?: number, sortBy?: string, sortOrder?: string): Promise<Product[]>;
  getAllProductsForManagement(): Promise<Product[]>; // Get ALL products regardless of approval status for admin management
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductAutomationAction(productId: string, automationAction: string): Promise<Product | undefined>;
  updateProductPrice(productId: string, price: string): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getProductsByType(productType: string): Promise<Product[]>;
  getProductsByVendor(vendorId: number): Promise<Product[]>;
  getImportedProductIds(platform: string): Promise<string[]>;
  
  // Product recommendations
  getNewArrivalsByCategory(categoryName: string, limit?: number): Promise<Product[]>;
  getBestSellersByCategory(categoryName: string, limit?: number): Promise<Product[]>;
  getCustomersAlsoViewedByCategory(categoryName: string, limit?: number): Promise<Product[]>;
  incrementProductViewCount(productId: string): Promise<void>;
  
  // Product approval management
  getProductsByApprovalStatus(status: string): Promise<Product[]>;
  updateProductApprovalStatus(productId: string, status: string): Promise<Product | undefined>;
  approveProducts(productIds: string[], approvedBy: number): Promise<number>;
  rejectProducts(productIds: string[], rejectionReason: string, rejectedBy: number): Promise<number>;
  publishProducts(productIds: string[]): Promise<number>;
  getSmartImportProducts(): Promise<Product[]>;
  
  // Category management
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getProductCountByCategory(categoryName: string): Promise<number>;
  getCategoryFilters(categoryName: string): Promise<{
    brands: string[];
    priceRanges: Array<{ label: string; min: number; max: number; }>;
    colors: string[];
    sizes: string[];
    materials: string[];
    specifications: string[];
    availability: Array<{ label: string; value: string; }>;
    ratings: Array<{ label: string; value: number; }>;
  }>;
  
  // Order management
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  getOrders(userId?: number, vendorId?: number, page?: number, limit?: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order items
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Cart management
  getCart(userId: number): Promise<Cart[]>;
  addToCart(cartItem: InsertCart): Promise<Cart>;
  updateCartItem(id: number, quantity: number): Promise<Cart | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Wishlist management
  getWishlist(userId: number): Promise<Wishlist[]>;
  addToWishlist(wishlistItem: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(id: number): Promise<boolean>;
  
  // Address management
  getAddresses(userId: number): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, address: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;
  
  // Review management
  getReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  createReviews(reviews: InsertReview[]): Promise<Review[]>;
  getReviewsByModerationStatus(status: string, limit?: number, offset?: number): Promise<Review[]>;
  getReviewStats(): Promise<{pending: number, approved: number, rejected: number, total: number}>;
  moderateReview(reviewId: number, moderation: {
    moderationStatus: string;
    moderatedBy?: number | null;
    moderatedAt?: Date;
    moderationReason?: string | null;
  }): Promise<Review | undefined>;
  
  // Review voting system
  createReviewVote(vote: InsertReviewVote): Promise<ReviewVote>;
  getReviewVote(reviewId: number, userId: number): Promise<ReviewVote | undefined>;
  getUserReviewVote(reviewId: number, userId: number): Promise<ReviewVote | undefined>;
  voteOnReview(reviewId: number, userId: number, voteType: string): Promise<{ success: boolean; helpfulCount: number; unhelpfulCount: number; }>;
  updateReviewVoteCounts(reviewId: number): Promise<boolean>;
  
  // Promo codes
  getPromoCode(code: string): Promise<PromoCode | undefined>;
  
  // Vendor management
  getVendor(id: number): Promise<Vendor | undefined>;
  getVendorByUserId(userId: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  getVendors(status?: string): Promise<Vendor[]>;
  
  // Product Attributes management
  getProductAttributes(): Promise<any[]>;
  createProductAttribute(attribute: any): Promise<any>;
  getAttributeValues(attributeId: number): Promise<any[]>;
  
  // Product category filtering
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsBySubcategory(subcategory: string): Promise<Product[]>;
  
  // ===== INVENTORY MANAGEMENT =====
  
  // Inventory Dashboard Stats
  getInventoryDashboardStats(): Promise<InventoryDashboardStats>;
  
  // Inventory Locations
  getInventoryLocations(): Promise<InventoryLocation[]>;
  getInventoryLocation(id: number): Promise<InventoryLocationWithItems | undefined>;
  createInventoryLocation(location: InsertInventoryLocation): Promise<InventoryLocation>;
  updateInventoryLocation(id: number, location: Partial<InsertInventoryLocation>): Promise<InventoryLocation | undefined>;
  deleteInventoryLocation(id: number): Promise<boolean>;
  
  // Inventory Items
  getInventoryItems(locationId?: number, filters?: any): Promise<InventoryItemWithProduct[]>;
  getInventoryItem(productId: string, locationId: number): Promise<InventoryItemWithProduct | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  updateStock(productId: string, locationId: number, quantity: number, movementType: string, reason?: string, performedBy?: number): Promise<boolean>;
  
  // Stock Movements
  getStockMovements(productId?: string, locationId?: number, limit?: number): Promise<StockMovementWithDetails[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  
  // Inventory Alerts
  getInventoryAlerts(isActive?: boolean): Promise<InventoryAlert[]>;
  createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert>;
  resolveInventoryAlert(id: number, resolvedBy: number): Promise<boolean>;
  
  // Stock Transfers
  getStockTransfers(status?: string): Promise<StockTransfer[]>;
  createStockTransfer(transfer: InsertStockTransfer): Promise<StockTransfer>;
  updateStockTransferStatus(id: number, status: string, updatedBy: number): Promise<StockTransfer | undefined>;
  
  // Inventory Analytics
  getLowStockItems(threshold?: number): Promise<InventoryItemWithProduct[]>;
  getOutOfStockItems(): Promise<InventoryItemWithProduct[]>;
  getOverstockItems(): Promise<InventoryItemWithProduct[]>;
  getReorderItems(): Promise<InventoryItemWithProduct[]>;
  
  // Product Q&A Knowledge Base
  createProductQA(qa: InsertProductQA): Promise<ProductQA>;
  getProductQA(productId: string, includePrivate?: boolean): Promise<ProductQA[]>;
  updateQAHelpfulness(qaId: number, helpful: boolean): Promise<boolean>;

  // My Account features - Order Tracking
  getUserOrdersWithTracking(userId: number): Promise<any[]>;
  getOrderShipments(orderId: string): Promise<any[]>;
  
  // My Account features - Returns & Exchanges  
  getUserReturns(userId: number): Promise<any[]>;
  createReturn(returnData: any): Promise<any>;
  updateReturnStatus(returnId: string, status: string): Promise<any | undefined>;
  
  // My Account features - Downloads (placeholder for now)
  getUserDownloads(userId: number): Promise<any[]>;
  
  // My Account features - Payment Methods (placeholder for now) 
  getUserPaymentMethods(userId: number): Promise<any[]>;
}

// Helper to generate URL-safe slugs
function generateSlug(input: string | undefined | null): string {
  const value = (input || '')
    .toString()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return value || `item-${Date.now()}`;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...userData, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserPreferences(userId: number, preferences: {
    preferredCountry?: string;
    preferredLanguage?: string;
    preferredCurrency?: string;
    timezone?: string;
    theme?: string;
    colorTheme?: string;
  }): Promise<User | undefined> {
    const [user] = await db.update(users).set({ 
      ...preferences, 
      updatedAt: new Date() 
    }).where(eq(users.id, userId)).returning();
    return user;
  }

  // User address management
  async getUserAddresses(userId: number): Promise<UserAddress[]> {
    return await db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
  }

  async getUserDefaultAddress(userId: number): Promise<UserAddress | undefined> {
    const [address] = await db.select().from(userAddresses)
      .where(and(eq(userAddresses.userId, userId), eq(userAddresses.isDefault, true)));
    return address;
  }

  async createUserAddress(address: InsertUserAddress): Promise<UserAddress> {
    // If this is being set as default, clear other defaults first
    if (address.isDefault) {
      await db.update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, address.userId));
    }
    
    const [newAddress] = await db.insert(userAddresses).values(address).returning();
    return newAddress;
  }

  async updateUserAddress(id: number, address: Partial<InsertUserAddress>): Promise<UserAddress | undefined> {
    // If this is being set as default, clear other defaults first
    if (address.isDefault && address.userId) {
      await db.update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, address.userId));
    }
    
    const [updatedAddress] = await db.update(userAddresses)
      .set({ ...address, updatedAt: new Date() })
      .where(eq(userAddresses.id, id))
      .returning();
    return updatedAddress;
  }

  async deleteUserAddress(id: number): Promise<boolean> {
    const result = await db.delete(userAddresses).where(eq(userAddresses.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<boolean> {
    // Clear all default flags for this user
    await db.update(userAddresses)
      .set({ isDefault: false })
      .where(eq(userAddresses.userId, userId));
    
    // Set the new default
    const result = await db.update(userAddresses)
      .set({ isDefault: true })
      .where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, userId)));
    
    return (result.rowCount ?? 0) > 0;
  }

  // Product management
  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductByExternalId(externalId: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.externalId, externalId));
    return product;
  }

  async getImportedProductIds(platform: string): Promise<string[]> {
    try {
      const result = await db.select()
        .from(products)
        .where(eq(products.sourcePlatform, platform as any));
      return result.map(p => p.externalId).filter(Boolean) as string[];
    } catch (error) {
      console.error('Error fetching imported product IDs:', error);
      return [];
    }
  }

  async getProducts(filters: any = {}, page: number = 1, limit: number = 20, sortBy: string = 'name', sortOrder: string = 'asc'): Promise<Product[]> {
    let query = db.select().from(products);
    
    // Apply filters
    const conditions = [];
    
    // CRITICAL: Only show published products in public listing
    conditions.push(eq(products.approvalStatus, 'published'));
    
    if (filters.category) {
      // Handle category mapping - frontend might send different format than database
      const categoryFilter = filters.category;
      
      // Create flexible category matching conditions
      const categoryConditions = [
        eq(products.category, categoryFilter), // Exact match
        like(products.category, `%${categoryFilter}%`), // Partial match
      ];
      
      // Add case-insensitive matching for common category mappings
      if (categoryFilter.toLowerCase().includes('electronic')) {
        categoryConditions.push(like(products.category, '%Electronic%'));
        categoryConditions.push(eq(products.category, 'Electronics'));
        categoryConditions.push(eq(products.category, 'Electronics & Technology'));
      }
      
      if (categoryFilter.toLowerCase().includes('automotive') || categoryFilter.toLowerCase().includes('auto')) {
        categoryConditions.push(like(products.category, '%Automotive%'));
      }
      
      if (categoryFilter.toLowerCase().includes('home') || categoryFilter.toLowerCase().includes('garden')) {
        categoryConditions.push(like(products.category, '%Home%'));
        categoryConditions.push(like(products.category, '%Garden%'));
      }
      
      if (categoryFilter.toLowerCase().includes('pet')) {
        categoryConditions.push(like(products.category, '%Pet%'));
      }
      
      if (categoryFilter.toLowerCase().includes('sport')) {
        categoryConditions.push(like(products.category, '%Sport%'));
        categoryConditions.push(like(products.category, '%Outdoor%'));
      }
      
      if (categoryFilter.toLowerCase().includes('fashion') || categoryFilter.toLowerCase().includes('apparel') || categoryFilter.toLowerCase().includes('clothing')) {
        categoryConditions.push(like(products.category, '%Fashion%'));
        categoryConditions.push(like(products.category, '%Apparel%'));
        categoryConditions.push(like(products.category, '%Clothing%'));
        categoryConditions.push(eq(products.category, 'Fashion & Apparel'));
      }
      
      conditions.push(or(...categoryConditions));
    }
    if (filters.search) conditions.push(like(products.name, `%${filters.search}%`));
    if (filters.minPrice) conditions.push(gte(products.price, filters.minPrice.toString()));
    if (filters.maxPrice) conditions.push(lte(products.price, filters.maxPrice.toString()));
    if (filters.isNew) conditions.push(eq(products.isNew, true));
    if (filters.isBestseller) conditions.push(eq(products.isBestseller, true));
    if (filters.isOnSale) conditions.push(eq(products.isOnSale, true));
    
    query = query.where(and(...conditions));
    
    // Apply sorting
    const sortColumn = products[sortBy as keyof typeof products] || products.name;
    query = query.orderBy(sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn));
    
    // Apply pagination
    query = query.limit(limit).offset((page - 1) * limit);
    
    return await query;
  }

  // Get ALL products regardless of approval status for admin management
  async getAllProductsForManagement(): Promise<Product[]> {
    console.log('[DEBUG] getAllProductsForManagement: Starting query...');
    try {
      const result = await db.select().from(products).orderBy(asc(products.name));
      console.log(`[DEBUG] getAllProductsForManagement: Query completed, found ${result.length} products`);
      return result;
    } catch (error) {
      console.error('[ERROR] getAllProductsForManagement:', error);
      throw error;
    }
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();

    // Increment product count for the product's category if it exists in categories table
    try {
      const categoryName = productData.category;
      if (categoryName && categoryName.trim() !== '') {
        const existing = await db.select({ id: categories.id, productCount: categories.productCount })
          .from(categories)
          .where(eq(categories.name, categoryName))
          .limit(1);

        if (existing[0]) {
          await db.update(categories)
            .set({ 
              productCount: sql`${categories.productCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(categories.id, existing[0].id));
        }
      }
    } catch (err) {
      console.warn('[storage.createProduct] Failed to increment category productCount:', err);
    }

    return product;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(productData).where(eq(products.id, id)).returning();
    return product;
  }

  async updateProductAutomationAction(productId: string, automationAction: string): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set({ automationAction, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();
    return product;
  }

  async updateProductPrice(productId: string, price: string): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set({ price, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getProductsByType(productType: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.productType, productType as any));
  }

  async getProductsByVendor(vendorId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.vendorId, vendorId));
  }

  // Product recommendation methods
  async getNewArrivalsByCategory(categoryName: string, limit: number = 6): Promise<Product[]> {
    // Map common category variations - "Electronics & Technology" -> "Electronics"
    const mappedCategory = categoryName.includes('Electronics') ? 'Electronics' : categoryName;
    
    const conditions = [
      eq(products.approvalStatus, 'published'),
      or(
        eq(products.category, mappedCategory),
        like(products.category, `%${mappedCategory}%`),
        ilike(products.category, `%${mappedCategory}%`)
      )
    ];

    return await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  async getBestSellersByCategory(categoryName: string, limit: number = 6): Promise<Product[]> {
    // Map common category variations - "Electronics & Technology" -> "Electronics"
    const mappedCategory = categoryName.includes('Electronics') ? 'Electronics' : categoryName;
    
    const conditions = [
      eq(products.approvalStatus, 'published'),
      or(
        eq(products.category, mappedCategory),
        like(products.category, `%${mappedCategory}%`),
        ilike(products.category, `%${mappedCategory}%`)
      )
    ];

    return await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.salesCount), desc(products.totalSales))
      .limit(limit);
  }

  async getCustomersAlsoViewedByCategory(categoryName: string, limit: number = 6): Promise<Product[]> {
    // Map common category variations - "Electronics & Technology" -> "Electronics"
    const mappedCategory = categoryName.includes('Electronics') ? 'Electronics' : categoryName;
    
    const conditions = [
      eq(products.approvalStatus, 'published'),
      or(
        eq(products.category, mappedCategory),
        like(products.category, `%${mappedCategory}%`),
        ilike(products.category, `%${mappedCategory}%`)
      )
    ];

    return await db.select().from(products)
      .where(and(...conditions))
      .orderBy(desc(products.viewCount), desc(products.rating))
      .limit(limit);
  }

  async incrementProductViewCount(productId: string): Promise<void> {
    await db.update(products)
      .set({ 
        viewCount: sql`${products.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(products.id, productId));
  }

  // Category management
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.sortOrder));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    // Ensure slug is always provided (db requires NOT NULL)
    if (!categoryData.slug || categoryData.slug === null) {
      categoryData.slug = generateSlug(categoryData.name || categoryData.title);
    }

    // If slug already exists in DB, append a timestamp suffix to avoid unique constraint issues
    try {
      const existing = await db.select().from(categories).where(eq(categories.slug, categoryData.slug));
      if (existing && existing.length > 0) {
        categoryData.slug = `${categoryData.slug}-${Date.now()}`;
      }
    } catch (e) {
      // ignore lookup errors and proceed with generated slug
      console.warn('Warning: could not verify existing slugs', e);
    }

    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async getProductCountByCategory(categoryName: string): Promise<number> {
    try {
      const result = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.category, categoryName));
      
      return result[0]?.count || 0;
    } catch (error) {
      console.error(`Error getting product count for category ${categoryName}:`, error);
      return 0;
    }
  }

  // Dynamic category filters based on real product data
  async getCategoryFilters(categoryName: string): Promise<{
    brands: string[];
    priceRanges: Array<{ label: string; min: number; max: number; }>;
    colors: string[];
    sizes: string[];
    materials: string[];
    specifications: string[];
    availability: Array<{ label: string; value: string; }>;
    ratings: Array<{ label: string; value: number; }>;
  }> {
    try {
      // Get products for this category
      const categoryProducts = await db
        .select()
        .from(products)
        .where(and(
          categoryName === 'all' ? sql`1=1` : ilike(products.category, `%${categoryName}%`),
          eq(products.approvalStatus, "approved")
        ));

      // Extract unique brands
      const brands = [...new Set(
        categoryProducts
          .map(p => p.brand)
          .filter(brand => brand && brand.trim() !== '')
      )].sort();

      // Calculate dynamic price ranges based on actual prices
      const prices = categoryProducts
        .map(p => parseFloat(p.price || "0"))
        .filter(price => price > 0)
        .sort((a, b) => a - b);
      
      let priceRanges: Array<{ label: string; min: number; max: number; }> = [];
      if (prices.length > 0) {
        const minPrice = prices[0];
        const maxPrice = prices[prices.length - 1];
        
        // Create intelligent price ranges based on distribution
        if (maxPrice <= 50) {
          priceRanges = [
            { label: "Under $25", min: 0, max: 25 },
            { label: "$25 - $50", min: 25, max: 50 }
          ];
        } else if (maxPrice <= 200) {
          priceRanges = [
            { label: "Under $50", min: 0, max: 50 },
            { label: "$50 - $100", min: 50, max: 100 },
            { label: "$100 - $200", min: 100, max: 200 }
          ];
        } else {
          priceRanges = [
            { label: "Under $100", min: 0, max: 100 },
            { label: "$100 - $500", min: 100, max: 500 },
            { label: "$500 - $1000", min: 500, max: 1000 },
            { label: "Over $1000", min: 1000, max: 999999 }
          ];
        }
      }

      // Extract colors, sizes, materials from product tags and descriptions
      const colors: string[] = [];
      const sizes: string[] = [];
      const materials: string[] = [];
      const specifications: string[] = [];

      categoryProducts.forEach(product => {
        // Extract from product tags if available
        if (product.productTags && Array.isArray(product.productTags)) {
          product.productTags.forEach(tag => {
            const lowerTag = tag.toLowerCase();
            
            // Common colors
            if (['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey', 'silver', 'gold', 'navy', 'beige'].includes(lowerTag)) {
              colors.push(tag);
            }
            
            // Common sizes
            if (['xs', 's', 'm', 'l', 'xl', 'xxl', 'small', 'medium', 'large', 'one size'].includes(lowerTag)) {
              sizes.push(tag);
            }
            
            // Common materials
            if (['cotton', 'polyester', 'wool', 'silk', 'leather', 'plastic', 'metal', 'wood', 'glass'].includes(lowerTag)) {
              materials.push(tag);
            }
            
            // Common specifications
            if (['wireless', 'bluetooth', '4k', 'waterproof', 'rechargeable', 'usb-c', 'fast charging'].includes(lowerTag)) {
              specifications.push(tag);
            }
          });
        }
        
        // Extract from description if available (look for common patterns)
        if (product.description) {
          const desc = product.description.toLowerCase();
          
          // Color extraction from description
          const colorPatterns = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'silver', 'gold'];
          colorPatterns.forEach(color => {
            if (desc.includes(color)) {
              colors.push(color.charAt(0).toUpperCase() + color.slice(1));
            }
          });
        }
      });

      // Availability options based on stock
      const availability = [
        { label: "In Stock", value: "in_stock" },
        { label: "Out of Stock", value: "out_of_stock" }
      ];

      // Rating options
      const ratings = [
        { label: "4+ Stars", value: 4 },
        { label: "3+ Stars", value: 3 },
        { label: "2+ Stars", value: 2 },
        { label: "1+ Star", value: 1 }
      ];

      return {
        brands,
        priceRanges,
        colors: [...new Set(colors)].sort(),
        sizes: [...new Set(sizes)].sort(),
        materials: [...new Set(materials)].sort(),
        specifications: [...new Set(specifications)].sort(),
        availability,
        ratings
      };
    } catch (error) {
      console.error('Error fetching category filters:', error);
      // Return empty filters on error
      return {
        brands: [],
        priceRanges: [],
        colors: [],
        sizes: [],
        materials: [],
        specifications: [],
        availability: [
          { label: "In Stock", value: "in_stock" },
          { label: "Out of Stock", value: "out_of_stock" }
        ],
        ratings: [
          { label: "4+ Stars", value: 4 },
          { label: "3+ Stars", value: 3 },
          { label: "2+ Stars", value: 2 },
          { label: "1+ Star", value: 1 }
        ]
      };
    }
  }

  // Order management
  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;
    
    const items = await this.getOrderItems(id);
    const shippingAddress = await db.select().from(addresses).where(eq(addresses.id, order.shippingAddressId));
    const billingAddress = await db.select().from(addresses).where(eq(addresses.id, order.billingAddressId));
    const user = await db.select().from(users).where(eq(users.id, order.userId));
    
    return {
      ...order,
      items,
      shippingAddress: shippingAddress[0],
      billingAddress: billingAddress[0],
      user: user[0]
    };
  }

  async getOrders(userId?: number, vendorId?: number, page: number = 1, limit: number = 20): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (userId) {
      query = query.where(eq(orders.userId, userId));
    }
    
    return await query.orderBy(desc(orders.createdAt)).limit(limit).offset((page - 1) * limit);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status: status as any, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return order;
  }

  // Order items
  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(orderItemData).returning();
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Cart management with product details
  async getCart(userId: number): Promise<Cart[]> {
    const cartWithProducts = await db
      .select({
        id: cart.id,
        userId: cart.userId,
        productId: cart.productId,
        quantity: cart.quantity,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        // Product details for cart display
        name: products.name,
        price: products.price,
        image: products.imageUrl,
        brand: products.brand,
        productType: products.productType,
        affiliateUrl: products.affiliateUrl,
        sourcePlatform: products.sourcePlatform
      })
      .from(cart)
      .innerJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId));
    
    return cartWithProducts as Cart[];
  }

  async addToCart(cartData: InsertCart): Promise<Cart> {
    const [cartItem] = await db.insert(cart).values(cartData).returning();
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<Cart | undefined> {
    const [cartItem] = await db.update(cart).set({ quantity, updatedAt: new Date() }).where(eq(cart.id, id)).returning();
    return cartItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cart).where(eq(cart.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cart).where(eq(cart.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }

  // Wishlist management
  async getWishlist(userId: number): Promise<Wishlist[]> {
    return await db.select().from(wishlist).where(eq(wishlist.userId, userId));
  }

  async addToWishlist(wishlistData: InsertWishlist): Promise<Wishlist> {
    const [wishlistItem] = await db.insert(wishlist).values(wishlistData).returning();
    return wishlistItem;
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    const result = await db.delete(wishlist).where(eq(wishlist.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Address management
  async getAddresses(userId: number): Promise<Address[]> {
    return await db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async createAddress(addressData: InsertAddress): Promise<Address> {
    const [address] = await db.insert(addresses).values(addressData).returning();
    return address;
  }

  async updateAddress(id: number, addressData: Partial<InsertAddress>): Promise<Address | undefined> {
    const [address] = await db.update(addresses).set(addressData).where(eq(addresses.id, id)).returning();
    return address;
  }

  async deleteAddress(id: number): Promise<boolean> {
    const result = await db.delete(addresses).where(eq(addresses.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Review management (working with current DB schema)
  async getReviews(productId: string): Promise<any[]> {
    // For now, return empty array since current DB has product_id as integer 
    // but our product IDs are strings like "woo-52091"
    console.log(`[STORAGE] getReviews called for productId: ${productId}`);
    return [];
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async getReviewsByModerationStatus(status: string, limit: number = 50, offset: number = 0): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.moderationStatus, status))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewStats(): Promise<{pending: number, approved: number, rejected: number, total: number}> {
    const [stats] = await db.select({
      pending: sql<number>`COUNT(CASE WHEN moderation_status = 'pending' THEN 1 END)`,
      approved: sql<number>`COUNT(CASE WHEN moderation_status = 'approved' THEN 1 END)`,
      rejected: sql<number>`COUNT(CASE WHEN moderation_status = 'rejected' THEN 1 END)`,
      total: sql<number>`COUNT(*)`
    }).from(reviews);
    
    return {
      pending: Number(stats.pending || 0),
      approved: Number(stats.approved || 0),
      rejected: Number(stats.rejected || 0),
      total: Number(stats.total || 0)
    };
  }

  async moderateReview(reviewId: number, moderation: {
    moderationStatus: string;
    moderatedBy?: number | null;
    moderatedAt?: Date;
    moderationReason?: string | null;
  }): Promise<Review | undefined> {
    const [review] = await db.update(reviews)
      .set({
        moderationStatus: moderation.moderationStatus,
        moderatedBy: moderation.moderatedBy,
        moderatedAt: moderation.moderatedAt,
        moderationReason: moderation.moderationReason,
        updatedAt: new Date()
      })
      .where(eq(reviews.id, reviewId))
      .returning();
    return review;
  }

  // Review voting system
  async createReviewVote(vote: InsertReviewVote): Promise<ReviewVote> {
    const [reviewVote] = await db.insert(reviewVotes).values(vote).returning();
    return reviewVote;
  }

  async getReviewVote(reviewId: number, userId: number): Promise<ReviewVote | undefined> {
    const [vote] = await db.select()
      .from(reviewVotes)
      .where(and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.userId, userId)));
    return vote;
  }

  async getUserReviewVote(reviewId: number, userId: number): Promise<ReviewVote | undefined> {
    return this.getReviewVote(reviewId, userId);
  }

  async voteOnReview(reviewId: number, userId: number, voteType: string): Promise<{ success: boolean; helpfulCount: number; unhelpfulCount: number; }> {
    try {
      // Check if review exists
      const [review] = await db.select().from(reviews).where(eq(reviews.id, reviewId));
      if (!review) {
        throw new Error('Review not found');
      }

      // Check if user has already voted
      const existingVote = await this.getReviewVote(reviewId, userId);
      if (existingVote) {
        throw new Error('Vote already exists');
      }

      // Create the vote
      await this.createReviewVote({
        reviewId,
        userId,
        voteType
      });

      // Update vote counts
      await this.updateReviewVoteCounts(reviewId);

      // Get updated counts
      const [updatedReview] = await db.select({
        helpfulCount: reviews.helpfulCount,
        unhelpfulCount: reviews.unhelpfulCount
      }).from(reviews).where(eq(reviews.id, reviewId));

      return {
        success: true,
        helpfulCount: updatedReview?.helpfulCount || 0,
        unhelpfulCount: updatedReview?.unhelpfulCount || 0
      };
    } catch (error) {
      console.error('Error voting on review:', error);
      throw error;
    }
  }

  async updateReviewVoteCounts(reviewId: number): Promise<boolean> {
    try {
      // Count helpful and unhelpful votes
      const [counts] = await db.select({
        helpful: sql<number>`COUNT(CASE WHEN vote_type = 'helpful' THEN 1 END)`,
        unhelpful: sql<number>`COUNT(CASE WHEN vote_type = 'unhelpful' THEN 1 END)`
      })
      .from(reviewVotes)
      .where(eq(reviewVotes.reviewId, reviewId));

      // Update the review with new counts
      await db.update(reviews)
        .set({
          helpfulCount: Number(counts.helpful || 0),
          unhelpfulCount: Number(counts.unhelpful || 0),
          updatedAt: new Date()
        })
        .where(eq(reviews.id, reviewId));

      return true;
    } catch (error) {
      console.error('Error updating review vote counts:', error);
      return false;
    }
  }

  // Promo codes
  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    const [promoCode] = await db.select().from(promoCodes).where(eq(promoCodes.code, code));
    return promoCode;
  }

  // Vendor management
  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor;
  }

  async getVendorByUserId(userId: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }

  async createVendor(vendorData: InsertVendor): Promise<Vendor> {
    const [vendor] = await db.insert(vendors).values(vendorData).returning();
    return vendor;
  }

  async updateVendor(id: number, vendorData: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const [vendor] = await db.update(vendors).set({ ...vendorData, updatedAt: new Date() }).where(eq(vendors.id, id)).returning();
    return vendor;
  }

  async getVendors(status?: string): Promise<Vendor[]> {
    let query = db.select().from(vendors);
    
    if (status) {
      query = query.where(eq(vendors.status, status as any));
    }
    
    return await query.orderBy(desc(vendors.createdAt));
  }

  // Product approval management
  async getProductsByApprovalStatus(status: string): Promise<Product[]> {
    if (status === 'all') {
      return await db.select().from(products)
        .orderBy(desc(products.createdAt));
    }
    return await db.select().from(products)
      .where(eq(products.approvalStatus, status as any))
      .orderBy(desc(products.createdAt));
  }

  async updateProductApprovalStatus(productId: string, status: string): Promise<Product | undefined> {
    const updateData: any = { 
      approvalStatus: status as any,
      updatedAt: new Date()
    };
    
    // Add timestamp fields based on status
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
      updateData.rejectionDate = new Date();
    } else if (status === 'published') {
      updateData.publishedAt = new Date();
    }
    
    const result = await db.update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning();
    
    return result[0] || undefined;
  }

  async approveProducts(productIds: string[], approvedBy: number): Promise<number> {
    const result = await db.update(products)
      .set({ 
        approvalStatus: 'approved' as any,
        approvedBy,
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(inArray(products.id, productIds));
    
    return result.rowCount || 0;
  }

  async rejectProducts(productIds: string[], rejectionReason: string, rejectedBy: number): Promise<number> {
    const result = await db.update(products)
      .set({ 
        approvalStatus: 'rejected' as any,
        rejectionReason,
        rejectionDate: new Date(),
        approvedBy: rejectedBy,
        updatedAt: new Date()
      })
      .where(inArray(products.id, productIds));
    
    return result.rowCount || 0;
  }

  async publishProducts(productIds: string[]): Promise<number> {
    const result = await db.update(products)
      .set({ 
        approvalStatus: 'published' as any,
        updatedAt: new Date()
      })
      .where(inArray(products.id, productIds));
    
    return result.rowCount || 0;
  }

  async unpublishProducts(productIds: string[]): Promise<number> {
    const result = await db.update(products)
      .set({ 
        approvalStatus: 'approved' as any,
        updatedAt: new Date()
      })
      .where(inArray(products.id, productIds));
    
    return result.rowCount || 0;
  }

  async reconsiderProducts(productIds: string[]): Promise<number> {
    const result = await db.update(products)
      .set({ 
        approvalStatus: 'pending' as any,
        rejectionReason: null,
        rejectionDate: null,
        updatedAt: new Date()
      })
      .where(inArray(products.id, productIds));
    
    return result.rowCount || 0;
  }

  async deleteProducts(productIds: string[]): Promise<number> {
    const result = await db.delete(products)
      .where(inArray(products.id, productIds));
    
    return result.rowCount || 0;
  }

  async getImportedWooCommerceIds(): Promise<string[]> {
    const result = await db.select({ externalId: products.externalId })
      .from(products)
      .where(eq(products.sourcePlatform, 'woocommerce'));
    
    return result.map(r => r.externalId).filter(Boolean);
  }

  // Product Intelligence methods
  async updateProductIntelligence(productId: string, intelligenceData: any): Promise<void> {
    await db.update(products)
      .set({
        viabilityScore: intelligenceData.viabilityScore?.toString(),
        competitiveScore: intelligenceData.competitiveScore?.toString(),
        profitMarginScore: intelligenceData.profitMarginScore?.toString(),
        marketTrendScore: intelligenceData.marketTrendScore?.toString(),
        overallIntelligenceScore: intelligenceData.overallIntelligenceScore?.toString(),
        competitorPrices: intelligenceData.competitorPrices ? JSON.stringify(intelligenceData.competitorPrices) : null,
        suggestedPrice: intelligenceData.suggestedPrice?.toString(),
        priceOptimizationReason: intelligenceData.priceOptimizationReason,
        aiSuggestedCategories: intelligenceData.aiSuggestedCategories ? JSON.stringify(intelligenceData.aiSuggestedCategories) : null,
        categoryConfidenceScore: intelligenceData.categoryConfidenceScore?.toString(),
        googleTrendsScore: intelligenceData.googleTrendsScore?.toString(),
        amazonBestSellerRank: intelligenceData.amazonBestSellerRank,
        marketDemandLevel: intelligenceData.marketDemandLevel,
        seasonalityPattern: intelligenceData.seasonalityPattern ? JSON.stringify(intelligenceData.seasonalityPattern) : null,
        intelligenceLastUpdated: new Date(),
        intelligenceAnalysisVersion: intelligenceData.analysisVersion || '1.0',
        dataSourcesUsed: intelligenceData.dataSources ? JSON.stringify(intelligenceData.dataSources) : null,
        updatedAt: new Date()
      })
      .where(eq(products.id, productId));
  }

  async getProductIntelligence(productId: string): Promise<any> {
    const [product] = await db.select({
      viabilityScore: products.viabilityScore,
      competitiveScore: products.competitiveScore,
      profitMarginScore: products.profitMarginScore,
      marketTrendScore: products.marketTrendScore,
      overallIntelligenceScore: products.overallIntelligenceScore,
      competitorPrices: products.competitorPrices,
      suggestedPrice: products.suggestedPrice,
      priceOptimizationReason: products.priceOptimizationReason,
      aiSuggestedCategories: products.aiSuggestedCategories,
      categoryConfidenceScore: products.categoryConfidenceScore,
      googleTrendsScore: products.googleTrendsScore,
      amazonBestSellerRank: products.amazonBestSellerRank,
      marketDemandLevel: products.marketDemandLevel,
      seasonalityPattern: products.seasonalityPattern,
      intelligenceLastUpdated: products.intelligenceLastUpdated,
      intelligenceAnalysisVersion: products.intelligenceAnalysisVersion
    }).from(products)
      .where(eq(products.id, productId));
    
    if (!product) return null;
    
    return {
      ...product,
      competitorPrices: product.competitorPrices ? JSON.parse(product.competitorPrices as string) : [],
      aiSuggestedCategories: product.aiSuggestedCategories ? JSON.parse(product.aiSuggestedCategories as string) : [],
      seasonalityPattern: product.seasonalityPattern ? JSON.parse(product.seasonalityPattern as string) : []
    };
  }

  async getTopPerformingProducts(limit: number = 10): Promise<Product[]> {
    return await db.select().from(products)
      .where(sql`${products.overallIntelligenceScore} IS NOT NULL`)
      .orderBy(desc(products.overallIntelligenceScore))
      .limit(limit);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getSmartImportProducts(): Promise<Product[]> {
    // Get products with high AI categorization confidence scores (80%+)
    // and overall intelligence scores for smart import recommendations
    return await db.select().from(products)
      .where(
        and(
          sql`CAST(${products.categoryConfidenceScore} AS DECIMAL) >= 0.8`, // High confidence in AI categorization
          sql`CAST(${products.overallIntelligenceScore} AS DECIMAL) >= 75`, // Good overall intelligence score
          eq(products.approvalStatus, 'pending') // Only pending products need smart import
        )
      )
      .orderBy(desc(products.categoryConfidenceScore), desc(products.overallIntelligenceScore))
      .limit(100); // Limit to top 100 candidates
  }

  // Product Attributes management
  async getProductAttributes(): Promise<any[]> {
    const attributes = await db.select({
      id: productAttributes.id,
      name: productAttributes.name,
      slug: productAttributes.slug,
      type: productAttributes.type,
      isRequired: productAttributes.isRequired,
      isFilterable: productAttributes.isFilterable,
      sortOrder: productAttributes.sortOrder,
      categoryId: productAttributes.categoryId,
      createdAt: productAttributes.createdAt,
      updatedAt: productAttributes.updatedAt
    }).from(productAttributes).orderBy(asc(productAttributes.sortOrder));

    // Get values for each attribute
    const attributesWithValues = await Promise.all(
      attributes.map(async (attr) => {
        const values = await this.getAttributeValues(attr.id);
        return {
          ...attr,
          values: values,
          productCount: values.length > 0 ? Math.floor(Math.random() * 30) + 1 : 0 // Calculate actual usage later
        };
      })
    );

    return attributesWithValues;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    // Map display category names to actual database values
    const categoryMapping: { [key: string]: string[] } = {
      'Electronics & Technology': ['Electronics', 'Computers', 'Smartphones', 'Electronics & Technology'],
      'Fashion & Apparel': ['Clothing', 'Footwear', 'Fashion & Apparel'],
      'Home & Garden': ['Home & Garden', 'Home Appliances'],
      'Automotive': ['Automotive'],
      'Arts & Crafts': ['Arts & Crafts'],
      'Health & Beauty': ['Health & Beauty'],
      'Books & Media': ['Books & Media'],
      'Baby & Kids': ['Baby & Kids'],
      'Food & Beverages': ['Food & Beverages'],
      'Sports & Outdoors': ['Sports & Outdoors'],
      'Office & Business': ['Office & Business'],
      'Pet Supplies': ['Pet Supplies'],
      'Jewelry & Accessories': ['Jewelry & Accessories'],
      'Tools & Hardware': ['Tools & Hardware']
    };

    const mappedCategories = categoryMapping[category] || [category];
    
    if (mappedCategories.length === 1) {
      return await db.select().from(products)
        .where(eq(products.category, mappedCategories[0]))
        .limit(50);
    } else {
      // For multiple categories, build OR conditions
      const conditions = mappedCategories.map(cat => 
        eq(products.category, cat)
      );
      
      return await db.select().from(products)
        .where(or(...conditions))
        .limit(50);
    }
  }

  async getProductsBySubcategory(subcategory: string): Promise<Product[]> {
    try {
      console.log(`[DEBUG] Searching for subcategory: "${subcategory}"`);
      
      let query = db.select().from(products);
      const conditions = [];
      
      // Only show published products
      conditions.push(eq(products.approvalStatus, 'published'));
      
      const subcategoryLower = subcategory.toLowerCase();
      
      // Intelligent pattern matching for subcategories
      if (subcategoryLower === 'women\'s clothing' || subcategoryLower === 'womens clothing') {
        conditions.push(
          and(
            or(
              sql`LOWER(${products.name}) LIKE '%women%'`,
              sql`LOWER(${products.name}) LIKE '%lady%'`,
              sql`LOWER(${products.name}) LIKE '%female%'`
            ),
            or(
              sql`LOWER(${products.name}) LIKE '%clothing%'`,
              sql`LOWER(${products.name}) LIKE '%shirt%'`,
              sql`LOWER(${products.name}) LIKE '%dress%'`,
              sql`LOWER(${products.name}) LIKE '%blouse%'`,
              sql`LOWER(${products.name}) LIKE '%top%'`,
              sql`LOWER(${products.name}) LIKE '%jacket%'`,
              sql`LOWER(${products.name}) LIKE '%sweater%'`,
              sql`LOWER(${products.name}) LIKE '%hoodie%'`,
              sql`LOWER(${products.name}) LIKE '%cardigan%'`,
              sql`LOWER(${products.category}) LIKE '%fashion%'`
            )
          )
        );
      } else if (subcategoryLower === 'men\'s clothing' || subcategoryLower === 'mens clothing') {
        conditions.push(
          and(
            or(
              sql`LOWER(${products.name}) LIKE '%men%'`,
              sql`LOWER(${products.name}) LIKE '%male%'`,
              sql`LOWER(${products.name}) LIKE '%boy%'`
            ),
            or(
              sql`LOWER(${products.name}) LIKE '%clothing%'`,
              sql`LOWER(${products.name}) LIKE '%shirt%'`,
              sql`LOWER(${products.name}) LIKE '%t-shirt%'`,
              sql`LOWER(${products.name}) LIKE '%polo%'`,
              sql`LOWER(${products.name}) LIKE '%jacket%'`,
              sql`LOWER(${products.name}) LIKE '%pants%'`,
              sql`LOWER(${products.name}) LIKE '%jeans%'`,
              sql`LOWER(${products.name}) LIKE '%shorts%'`,
              sql`LOWER(${products.name}) LIKE '%hoodie%'`,
              sql`LOWER(${products.category}) LIKE '%fashion%'`
            )
          )
        );
      } else if (subcategoryLower === 'shoes') {
        conditions.push(
          or(
            sql`LOWER(${products.name}) LIKE '%shoe%'`,
            sql`LOWER(${products.name}) LIKE '%sneaker%'`,
            sql`LOWER(${products.name}) LIKE '%boot%'`,
            sql`LOWER(${products.name}) LIKE '%sandal%'`,
            sql`LOWER(${products.name}) LIKE '%heel%'`,
            sql`LOWER(${products.name}) LIKE '%slipper%'`,
            sql`LOWER(${products.name}) LIKE '%loafer%'`,
            sql`LOWER(${products.name}) LIKE '%footwear%'`
          )
        );
      } else if (subcategoryLower === 'bags & handbags' || subcategoryLower === 'bags and handbags') {
        conditions.push(
          or(
            sql`LOWER(${products.name}) LIKE '%bag%'`,
            sql`LOWER(${products.name}) LIKE '%handbag%'`,
            sql`LOWER(${products.name}) LIKE '%purse%'`,
            sql`LOWER(${products.name}) LIKE '%backpack%'`,
            sql`LOWER(${products.name}) LIKE '%tote%'`,
            sql`LOWER(${products.name}) LIKE '%wallet%'`,
            sql`LOWER(${products.name}) LIKE '%clutch%'`
          )
        );
      } else if (subcategoryLower === 'watches') {
        conditions.push(
          or(
            sql`LOWER(${products.name}) LIKE '%watch%'`,
            sql`LOWER(${products.name}) LIKE '%timepiece%'`,
            sql`LOWER(${products.name}) LIKE '%smartwatch%'`,
            sql`LOWER(${products.name}) LIKE '%wrist%'`
          )
        );
      } else if (subcategoryLower === 'sunglasses') {
        conditions.push(
          or(
            sql`LOWER(${products.name}) LIKE '%sunglasses%'`,
            sql`LOWER(${products.name}) LIKE '%eyewear%'`,
            sql`LOWER(${products.name}) LIKE '%glasses%'`,
            sql`LOWER(${products.name}) LIKE '%shades%'`
          )
        );
      } else if (subcategoryLower === 'activewear') {
        conditions.push(
          or(
            sql`LOWER(${products.name}) LIKE '%activewear%'`,
            sql`LOWER(${products.name}) LIKE '%sportswear%'`,
            sql`LOWER(${products.name}) LIKE '%athletic%'`,
            sql`LOWER(${products.name}) LIKE '%gym%'`,
            sql`LOWER(${products.name}) LIKE '%workout%'`,
            sql`LOWER(${products.name}) LIKE '%fitness%'`,
            sql`LOWER(${products.name}) LIKE '%yoga%'`,
            sql`LOWER(${products.name}) LIKE '%legging%'`,
            sql`LOWER(${products.name}) LIKE '%sports bra%'`
          )
        );
      } else if (subcategoryLower === 'underwear & lingerie' || subcategoryLower === 'underwear and lingerie') {
        conditions.push(
          or(
            sql`LOWER(${products.name}) LIKE '%underwear%'`,
            sql`LOWER(${products.name}) LIKE '%lingerie%'`,
            sql`LOWER(${products.name}) LIKE '%bra%'`,
            sql`LOWER(${products.name}) LIKE '%panties%'`,
            sql`LOWER(${products.name}) LIKE '%boxer%'`,
            sql`LOWER(${products.name}) LIKE '%briefs%'`,
            sql`LOWER(${products.name}) LIKE '%intimate%'`
          )
        );
      } else {
        // Fallback: try to match subcategory name in product name or category
        const searchPattern = `%${subcategoryLower}%`;
        conditions.push(
          or(
            sql`LOWER(${products.name}) LIKE ${searchPattern}`,
            sql`LOWER(${products.category}) LIKE ${searchPattern}`
          )
        );
      }
      
      query = query.where(and(...conditions));
      query = query.orderBy(asc(products.name));
      query = query.limit(50); // Limit results for performance
      
      const result = await query;
      console.log(`[DEBUG] Found ${result.length} products for subcategory "${subcategory}"`);
      return result;
    } catch (error) {
      console.error('Error in getProductsBySubcategory:', error);
      return [];
    }
  }

  async createProductAttribute(attributeData: any): Promise<any> {
    const [newAttribute] = await db.insert(productAttributes).values({
      name: attributeData.name,
      slug: attributeData.slug || attributeData.name.toLowerCase().replace(/\s+/g, '-'),
      type: attributeData.type,
      isRequired: attributeData.isRequired || false,
      isFilterable: attributeData.isFilterable !== false,
      sortOrder: attributeData.sortOrder || 0,
      categoryId: attributeData.categoryId || null
    }).returning();

    return newAttribute;
  }

  async getAttributeValues(attributeId: number): Promise<any[]> {
    const values = await db.select({
      id: attributeValues.id,
      attributeId: attributeValues.attributeId,
      value: attributeValues.value,
      colorCode: attributeValues.colorCode,
      sortOrder: attributeValues.sortOrder,
      createdAt: attributeValues.createdAt
    }).from(attributeValues)
      .where(eq(attributeValues.attributeId, attributeId))
      .orderBy(asc(attributeValues.sortOrder));

    return values;
  }

  // ===== INVENTORY MANAGEMENT IMPLEMENTATION =====
  
  async getInventoryDashboardStats(): Promise<InventoryDashboardStats> {
    // Get total items across all locations
    const totalItemsResult = await db.select({ count: count() }).from(inventoryItems);
    const totalItems = totalItemsResult[0]?.count || 0;
    
    // Get items by stock status
    const lowStockResult = await db.select({ count: count() }).from(inventoryItems).where(eq(inventoryItems.stockStatus, 'low_stock'));
    const outOfStockResult = await db.select({ count: count() }).from(inventoryItems).where(eq(inventoryItems.stockStatus, 'out_of_stock'));
    const inStockResult = await db.select({ count: count() }).from(inventoryItems).where(eq(inventoryItems.stockStatus, 'in_stock'));
    const overstockResult = await db.select({ count: count() }).from(inventoryItems).where(eq(inventoryItems.stockStatus, 'overstock'));
    
    // Get items needing reorder
    const reorderResult = await db.select({ count: count() }).from(inventoryItems)
      .where(sql`current_stock <= reorder_point`);
    
    // Get total locations
    const locationsResult = await db.select({ count: count() }).from(inventoryLocations).where(eq(inventoryLocations.isActive, true));
    
    // Get active alerts
    const alertsResult = await db.select({ count: count() }).from(inventoryAlerts).where(eq(inventoryAlerts.isActive, true));
    
    // Get today's movements
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysMovementsResult = await db.select({ count: count() }).from(stockMovements)
      .where(gte(stockMovements.performedAt, today));
    
    // Calculate total value (sum of all item values)
    const totalValueResult = await db.select({ 
      totalValue: sql<string>`COALESCE(SUM(total_value), 0)` 
    }).from(inventoryItems);
    
    return {
      totalItems,
      lowStockItems: lowStockResult[0]?.count || 0,
      outOfStockItems: outOfStockResult[0]?.count || 0,
      inStockItems: inStockResult[0]?.count || 0,
      overstockItems: overstockResult[0]?.count || 0,
      reorderItems: reorderResult[0]?.count || 0,
      totalValue: Number(totalValueResult[0]?.totalValue || 0),
      locationsCount: locationsResult[0]?.count || 0,
      alertsCount: alertsResult[0]?.count || 0,
      todaysMovements: todaysMovementsResult[0]?.count || 0,
    };
  }
  
  async getInventoryLocations(): Promise<InventoryLocation[]> {
    return await db.select().from(inventoryLocations).where(eq(inventoryLocations.isActive, true)).orderBy(inventoryLocations.name);
  }
  
  async getInventoryLocation(id: number): Promise<InventoryLocationWithItems | undefined> {
    const [location] = await db.select().from(inventoryLocations).where(eq(inventoryLocations.id, id));
    if (!location) return undefined;
    
    const items = await this.getInventoryItems(id);
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + Number(item.totalValue || 0), 0);
    const alertsCount = await db.select({ count: count() }).from(inventoryAlerts)
      .where(eq(inventoryAlerts.isActive, true));
    
    return {
      ...location,
      items,
      totalItems,
      totalValue,
      alertsCount: alertsCount[0]?.count || 0,
    };
  }
  
  async createInventoryLocation(location: InsertInventoryLocation): Promise<InventoryLocation> {
    const [created] = await db.insert(inventoryLocations).values(location).returning();
    return created;
  }
  
  async updateInventoryLocation(id: number, location: Partial<InsertInventoryLocation>): Promise<InventoryLocation | undefined> {
    const [updated] = await db.update(inventoryLocations)
      .set({ ...location, updatedAt: new Date() })
      .where(eq(inventoryLocations.id, id))
      .returning();
    return updated;
  }
  
  async deleteInventoryLocation(id: number): Promise<boolean> {
    const result = await db.update(inventoryLocations)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(inventoryLocations.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  
  async getInventoryItems(locationId?: number, filters: any = {}): Promise<InventoryItemWithProduct[]> {
    let query = db.select({
      id: inventoryItems.id,
      productId: inventoryItems.productId,
      locationId: inventoryItems.locationId,
      currentStock: inventoryItems.currentStock,
      reservedStock: inventoryItems.reservedStock,
      availableStock: inventoryItems.availableStock,
      minimumStock: inventoryItems.minimumStock,
      maximumStock: inventoryItems.maximumStock,
      reorderPoint: inventoryItems.reorderPoint,
      reorderQuantity: inventoryItems.reorderQuantity,
      unitCost: inventoryItems.unitCost,
      averageCost: inventoryItems.averageCost,
      totalValue: inventoryItems.totalValue,
      stockStatus: inventoryItems.stockStatus,
      lastCountDate: inventoryItems.lastCountDate,
      lastMovementDate: inventoryItems.lastMovementDate,
      createdAt: inventoryItems.createdAt,
      updatedAt: inventoryItems.updatedAt,
      product: products,
      location: inventoryLocations,
    })
    .from(inventoryItems)
    .leftJoin(products, eq(inventoryItems.productId, products.id))
    .leftJoin(inventoryLocations, eq(inventoryItems.locationId, inventoryLocations.id));
    
    const conditions = [];
    if (locationId) conditions.push(eq(inventoryItems.locationId, locationId));
    if (filters.stockStatus) conditions.push(eq(inventoryItems.stockStatus, filters.stockStatus));
    if (filters.lowStock) conditions.push(sql`current_stock <= minimum_stock`);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const results = await query.orderBy(products.name);
    
    // Transform results to match InventoryItemWithProduct type
    return results.map(result => ({
      ...result,
      alerts: [], // Will be populated separately if needed
      recentMovements: [], // Will be populated separately if needed
    })) as InventoryItemWithProduct[];
  }
  
  async getInventoryItem(productId: string, locationId: number): Promise<InventoryItemWithProduct | undefined> {
    const [result] = await db.select({
      id: inventoryItems.id,
      productId: inventoryItems.productId,
      locationId: inventoryItems.locationId,
      currentStock: inventoryItems.currentStock,
      reservedStock: inventoryItems.reservedStock,
      availableStock: inventoryItems.availableStock,
      minimumStock: inventoryItems.minimumStock,
      maximumStock: inventoryItems.maximumStock,
      reorderPoint: inventoryItems.reorderPoint,
      reorderQuantity: inventoryItems.reorderQuantity,
      unitCost: inventoryItems.unitCost,
      averageCost: inventoryItems.averageCost,
      totalValue: inventoryItems.totalValue,
      stockStatus: inventoryItems.stockStatus,
      lastCountDate: inventoryItems.lastCountDate,
      lastMovementDate: inventoryItems.lastMovementDate,
      createdAt: inventoryItems.createdAt,
      updatedAt: inventoryItems.updatedAt,
      product: products,
      location: inventoryLocations,
    })
    .from(inventoryItems)
    .leftJoin(products, eq(inventoryItems.productId, products.id))
    .leftJoin(inventoryLocations, eq(inventoryItems.locationId, inventoryLocations.id))
    .where(and(eq(inventoryItems.productId, productId), eq(inventoryItems.locationId, locationId)));
    
    if (!result) return undefined;
    
    return {
      ...result,
      alerts: [],
      recentMovements: [],
    } as InventoryItemWithProduct;
  }
  
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [created] = await db.insert(inventoryItems).values({
      ...item,
      availableStock: item.currentStock - (item.reservedStock || 0),
      totalValue: String(Number(item.currentStock) * Number(item.unitCost || 0)),
    }).returning();
    return created;
  }
  
  async updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const updateData: any = { ...item, updatedAt: new Date() };
    
    // Recalculate available stock and total value if quantities change
    if (item.currentStock !== undefined || item.reservedStock !== undefined) {
      const current = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
      if (current[0]) {
        const currentStock = item.currentStock ?? current[0].currentStock;
        const reservedStock = item.reservedStock ?? current[0].reservedStock;
        updateData.availableStock = currentStock - reservedStock;
        updateData.totalValue = String(Number(currentStock) * Number(item.unitCost || current[0].unitCost || 0));
      }
    }
    
    const [updated] = await db.update(inventoryItems)
      .set(updateData)
      .where(eq(inventoryItems.id, id))
      .returning();
    return updated;
  }
  
  async updateStock(productId: string, locationId: number, quantity: number, movementType: string, reason?: string, performedBy?: number): Promise<boolean> {
    const item = await this.getInventoryItem(productId, locationId);
    if (!item) return false;
    
    const stockBefore = item.currentStock;
    let newStock = stockBefore;
    
    switch (movementType) {
      case 'in':
        newStock = stockBefore + quantity;
        break;
      case 'out':
        newStock = stockBefore - quantity;
        break;
      case 'adjustment':
        newStock = quantity; // Direct set
        break;
      default:
        return false;
    }
    
    if (newStock < 0) newStock = 0;
    
    // Determine stock status
    let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock' = 'in_stock';
    if (newStock === 0) stockStatus = 'out_of_stock';
    else if (newStock <= item.minimumStock) stockStatus = 'low_stock';
    else if (newStock >= item.maximumStock) stockStatus = 'overstock';
    
    // Update inventory item
    await db.update(inventoryItems)
      .set({
        currentStock: newStock,
        availableStock: newStock - item.reservedStock,
        stockStatus,
        lastMovementDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(inventoryItems.id, item.id));
    
    // Create stock movement record
    await this.createStockMovement({
      productId,
      locationId,
      movementType: movementType as any,
      quantity: Math.abs(quantity),
      stockBefore,
      stockAfter: newStock,
      reason,
      performedBy,
    });
    
    return true;
  }
  
  async getStockMovements(productId?: string, locationId?: number, limit: number = 100): Promise<StockMovementWithDetails[]> {
    let query = db.select({
      id: stockMovements.id,
      productId: stockMovements.productId,
      locationId: stockMovements.locationId,
      movementType: stockMovements.movementType,
      quantity: stockMovements.quantity,
      unitCost: stockMovements.unitCost,
      totalCost: stockMovements.totalCost,
      referenceType: stockMovements.referenceType,
      referenceId: stockMovements.referenceId,
      reason: stockMovements.reason,
      notes: stockMovements.notes,
      stockBefore: stockMovements.stockBefore,
      stockAfter: stockMovements.stockAfter,
      performedBy: stockMovements.performedBy,
      performedAt: stockMovements.performedAt,
      createdAt: stockMovements.createdAt,
      product: products,
      location: inventoryLocations,
      performedByUser: users,
    })
    .from(stockMovements)
    .leftJoin(products, eq(stockMovements.productId, products.id))
    .leftJoin(inventoryLocations, eq(stockMovements.locationId, inventoryLocations.id))
    .leftJoin(users, eq(stockMovements.performedBy, users.id));
    
    const conditions = [];
    if (productId) conditions.push(eq(stockMovements.productId, productId));
    if (locationId) conditions.push(eq(stockMovements.locationId, locationId));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const results = await query.orderBy(desc(stockMovements.performedAt)).limit(limit);
    
    return results.map(result => ({
      ...result,
      performedByUser: result.performedByUser ? {
        id: result.performedByUser.id,
        username: result.performedByUser.username,
        firstName: result.performedByUser.firstName,
        lastName: result.performedByUser.lastName,
      } : undefined,
    })) as StockMovementWithDetails[];
  }
  
  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const [created] = await db.insert(stockMovements).values(movement).returning();
    return created;
  }
  
  async getInventoryAlerts(isActive?: boolean): Promise<InventoryAlert[]> {
    let query = db.select().from(inventoryAlerts);
    
    if (isActive !== undefined) {
      query = query.where(eq(inventoryAlerts.isActive, isActive));
    }
    
    return await query.orderBy(desc(inventoryAlerts.createdAt));
  }
  
  async createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert> {
    const [created] = await db.insert(inventoryAlerts).values(alert).returning();
    return created;
  }
  
  async resolveInventoryAlert(id: number, resolvedBy: number): Promise<boolean> {
    const result = await db.update(inventoryAlerts)
      .set({
        isActive: false,
        isRead: true,
        resolvedAt: new Date(),
        resolvedBy,
        updatedAt: new Date(),
      })
      .where(eq(inventoryAlerts.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  
  async getStockTransfers(status?: string): Promise<StockTransfer[]> {
    let query = db.select().from(stockTransfers);
    
    if (status) {
      query = query.where(eq(stockTransfers.status, status));
    }
    
    return await query.orderBy(desc(stockTransfers.createdAt));
  }
  
  async createStockTransfer(transfer: InsertStockTransfer): Promise<StockTransfer> {
    const [created] = await db.insert(stockTransfers).values(transfer).returning();
    return created;
  }
  
  async updateStockTransferStatus(id: number, status: string, updatedBy: number): Promise<StockTransfer | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    
    switch (status) {
      case 'approved':
        updateData.approvedBy = updatedBy;
        updateData.approvedAt = new Date();
        break;
      case 'in_transit':
        updateData.shippedAt = new Date();
        break;
      case 'completed':
        updateData.completedBy = updatedBy;
        updateData.completedAt = new Date();
        break;
    }
    
    const [updated] = await db.update(stockTransfers)
      .set(updateData)
      .where(eq(stockTransfers.id, id))
      .returning();
    return updated;
  }
  
  async getLowStockItems(threshold?: number): Promise<InventoryItemWithProduct[]> {
    return await this.getInventoryItems(undefined, { 
      stockStatus: 'low_stock',
      lowStock: true 
    });
  }
  
  async getOutOfStockItems(): Promise<InventoryItemWithProduct[]> {
    return await this.getInventoryItems(undefined, { stockStatus: 'out_of_stock' });
  }
  
  async getOverstockItems(): Promise<InventoryItemWithProduct[]> {
    return await this.getInventoryItems(undefined, { stockStatus: 'overstock' });
  }
  
  async getReorderItems(): Promise<InventoryItemWithProduct[]> {
    let query = db.select({
      id: inventoryItems.id,
      productId: inventoryItems.productId,
      locationId: inventoryItems.locationId,
      currentStock: inventoryItems.currentStock,
      reservedStock: inventoryItems.reservedStock,
      availableStock: inventoryItems.availableStock,
      minimumStock: inventoryItems.minimumStock,
      maximumStock: inventoryItems.maximumStock,
      reorderPoint: inventoryItems.reorderPoint,
      reorderQuantity: inventoryItems.reorderQuantity,
      unitCost: inventoryItems.unitCost,
      averageCost: inventoryItems.averageCost,
      totalValue: inventoryItems.totalValue,
      stockStatus: inventoryItems.stockStatus,
      lastCountDate: inventoryItems.lastCountDate,
      lastMovementDate: inventoryItems.lastMovementDate,
      createdAt: inventoryItems.createdAt,
      updatedAt: inventoryItems.updatedAt,
      product: products,
      location: inventoryLocations,
    })
    .from(inventoryItems)
    .leftJoin(products, eq(inventoryItems.productId, products.id))
    .leftJoin(inventoryLocations, eq(inventoryItems.locationId, inventoryLocations.id))
    .where(sql`current_stock <= reorder_point`);
    
    const results = await query.orderBy(products.name);
    
    return results.map(result => ({
      ...result,
      alerts: [],
      recentMovements: [],
    })) as InventoryItemWithProduct[];
  }

  // Review management implementation (duplicate - using the correct one above)
  // This method is replaced by the earlier implementation at line 456

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  async createReviews(reviewsList: InsertReview[]): Promise<Review[]> {
    if (reviewsList.length === 0) return [];
    
    const created = await db.insert(reviews).values(reviewsList).returning();
    return created;
  }

  // Product Q&A Knowledge Base implementation
  async createProductQA(qa: InsertProductQA): Promise<ProductQA> {
    const [created] = await db.insert(productQA).values(qa).returning();
    return created;
  }

  async getProductQA(productId: string, includePrivate: boolean = false): Promise<ProductQA[]> {
    let query = db.select().from(productQA).where(eq(productQA.productId, productId));
    
    if (!includePrivate) {
      query = query.where(eq(productQA.isPublic, true));
    }
    
    return await query.orderBy(desc(productQA.timestamp));
  }

  async updateQAHelpfulness(qaId: number, helpful: boolean): Promise<boolean> {
    try {
      if (helpful) {
        await db.update(productQA)
          .set({ 
            isHelpful: true,
            helpfulVotes: sql`${productQA.helpfulVotes} + 1`
          })
          .where(eq(productQA.id, qaId));
      } else {
        await db.update(productQA)
          .set({ isHelpful: false })
          .where(eq(productQA.id, qaId));
      }
      return true;
    } catch (error) {
      console.error('Error updating Q&A helpfulness:', error);
      return false;
    }
  }

  // User profile management implementation
  async getUserProfile(userId: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  async updateUserProfile(userId: number, profileData: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getUserAccountStats(userId: number): Promise<{
    totalOrders: number;
    totalSpent: string;
    itemsPurchased: number;
    averageRating: number;
    rewardPoints: number;
    accountAge: string;
  }> {
    try {
      // Get user info for account age calculation
      const [user] = await db.select({
        createdAt: users.createdAt
      }).from(users).where(eq(users.id, userId));

      // Get order statistics
      const [orderStats] = await db
        .select({
          totalOrders: count(orders.id),
          totalSpent: sql<string>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`,
          itemsPurchased: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`
        })
        .from(orders)
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
        .where(and(
          eq(orders.userId, userId),
          eq(orders.status, 'delivered')
        ));

      // Get average rating given by user (from reviews)
      const [ratingStats] = await db
        .select({
          averageRating: sql<number>`COALESCE(AVG(CAST(${reviews.rating} AS DECIMAL)), 0)`
        })
        .from(reviews)
        .where(eq(reviews.userId, userId));

      // Calculate account age
      const accountAge = user?.createdAt 
        ? this.calculateAccountAge(user.createdAt) 
        : '0 days';

      // Note: Reward points would come from the rewards system
      // For now, we'll use a placeholder - this would be connected to the actual rewards API
      const rewardPoints = 1250; // This should be fetched from rewards system

      return {
        totalOrders: orderStats?.totalOrders || 0,
        totalSpent: orderStats?.totalSpent || '0.00',
        itemsPurchased: orderStats?.itemsPurchased || 0,
        averageRating: Number((ratingStats?.averageRating || 0).toFixed(1)),
        rewardPoints,
        accountAge
      };
    } catch (error) {
      console.error('Error fetching user account stats:', error);
      return {
        totalOrders: 0,
        totalSpent: '0.00',
        itemsPurchased: 0,
        averageRating: 0,
        rewardPoints: 0,
        accountAge: '0 days'
      };
    }
  }

  private calculateAccountAge(createdAt: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return remainingMonths > 0 
        ? `${years}.${Math.floor(remainingMonths / 3)} years`
        : `${years} year${years > 1 ? 's' : ''}`;
    }
  }

  // ===== MY ACCOUNT FEATURES =====

  // Order Tracking
  async getUserOrdersWithTracking(userId: number): Promise<any[]> {
    try {
      const ordersWithShipments = await db
        .select({
          orderId: salesOrders.id,
          orderStatus: salesOrders.status,
          orderCreatedAt: salesOrders.createdAt,
          totals: salesOrders.totals,
          shippingAddress: salesOrders.shippingAddress,
          shipmentId: shipments.id,
          carrier: shipments.carrier,
          tracking: shipments.tracking,
          shippedAt: shipments.shippedAt,
          deliveredAt: shipments.deliveredAt
        })
        .from(salesOrders)
        .leftJoin(shipments, eq(salesOrders.id, shipments.orderId))
        .where(eq(salesOrders.userId, userId.toString()))
        .orderBy(desc(salesOrders.createdAt));

      return ordersWithShipments;
    } catch (error) {
      console.error('Error fetching orders with tracking:', error);
      return [];
    }
  }

  async getOrderShipments(orderId: string): Promise<any[]> {
    try {
      const orderShipments = await db
        .select()
        .from(shipments)
        .where(eq(shipments.orderId, orderId))
        .orderBy(desc(shipments.shippedAt));

      return orderShipments;
    } catch (error) {
      console.error('Error fetching order shipments:', error);
      return [];
    }
  }

  // Returns & Exchanges
  async getUserReturns(userId: number): Promise<any[]> {
    try {
      const userReturns = await db
        .select()
        .from(salesReturns)
        .where(eq(salesReturns.userId, userId.toString()))
        .orderBy(desc(salesReturns.createdAt));

      return userReturns;
    } catch (error) {
      console.error('Error fetching user returns:', error);
      return [];
    }
  }

  async createReturn(returnData: any): Promise<any> {
    try {
      const [newReturn] = await db
        .insert(salesReturns)
        .values(returnData)
        .returning();

      return newReturn;
    } catch (error) {
      console.error('Error creating return:', error);
      throw error;
    }
  }

  async updateReturnStatus(returnId: string, status: string): Promise<any | undefined> {
    try {
      const [updatedReturn] = await db
        .update(salesReturns)
        .set({ 
          status: status as any,
          processedAt: new Date()
        })
        .where(eq(salesReturns.id, returnId))
        .returning();

      return updatedReturn;
    } catch (error) {
      console.error('Error updating return status:', error);
      return undefined;
    }
  }

  // Downloads (placeholder - will implement when database tables are ready)
  async getUserDownloads(userId: number): Promise<any[]> {
    // TODO: Implement when userDownloads table is available
    return [];
  }

  // Payment Methods (placeholder - will implement when database tables are ready)
  async getUserPaymentMethods(userId: number): Promise<any[]> {
    // TODO: Implement when userPaymentMethods table is available
    return [];
  }
}

export const storage = new DatabaseStorage();
