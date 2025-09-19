import { pgTable, text, serial, integer, boolean, decimal, timestamp, pgEnum, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for better type safety
export const userRoleEnum = pgEnum("user_role", ["customer", "admin", "manager", "support", "vendor"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);
export const vendorStatusEnum = pgEnum("vendor_status", ["pending", "approved", "rejected", "suspended"]);
export const sourcePlatformEnum = pgEnum("source_platform", ["aveenix", "amazon", "aliexpress", "walmart", "woocommerce"]);
export const productTypeEnum = pgEnum("product_type", ["affiliate", "dropship", "physical", "consumable", "service", "digital", "custom", "multivendor"]);
export const approvalStatusEnum = pgEnum("approval_status", ["preview", "pricing", "pending", "approved", "rejected", "published"]);
export const notificationTypeEnum = pgEnum("notification_type", ["order", "message", "system", "promotion", "security"]);
export const notificationPriorityEnum = pgEnum("notification_priority", ["low", "medium", "high", "urgent"]);
export const movementTypeEnum = pgEnum("movement_type", ["in", "out", "transfer", "adjustment", "return", "loss"]);
export const vendorApplicationStatusEnum = pgEnum("vendor_application_status", ["pending", "approved", "rejected"]);
export const stockStatusEnum = 
pgEnum("stock_status", ["in_stock", "low_stock", "out_of_stock", "overstock"]);
export const affiliatePlatformEnum = pgEnum("affiliate_platform", ["amazon", "aliexpress", "walmart", "ebay", "shopify"]);
export const addressTypeEnum = pgEnum("address_type", ["shipping", "billing", "both"]);

// Brands table for authentic brand management
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  productCount: integer("product_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("customer"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  
  // Profile information
  dateOfBirth: text("date_of_birth"), // Store as YYYY-MM-DD string
  gender: text("gender"), // "male", "female", "non-binary", "prefer-not-to-say"
  bio: text("bio"), // User biography/description
  avatarUrl: text("avatar_url"), // Profile picture URL
  
  // Security and verification
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  
  // User preferences for localization
  preferredCountry: text("preferred_country").default("US"),
  preferredLanguage: text("preferred_language").default("en"),
  preferredCurrency: text("preferred_currency").default("USD"),
  timezone: text("timezone").default("America/New_York"),
  // Theme preferences
  theme: text("theme").default("light"),
  colorTheme: text("color_theme").default("yellow"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User address book for shipping/billing addresses
export const userAddresses = pgTable("user_addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: addressTypeEnum("type").default("shipping"),
  label: text("label").notNull(), // "Home", "Work", "Mom's House", etc.
  fullName: text("full_name").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull().default("US"),
  phone: text("phone"),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userDefaultIdx: index("user_addresses_user_default_idx").on(table.userId, table.isDefault),
  userActiveIdx: index("user_addresses_user_active_idx").on(table.userId, table.isActive),
}));

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(),
  brand: text("brand"),
  imageUrl: text("image_url").notNull(),
  
  // Tier 1 Enhancement: Product Gallery (3-4 images max)
  imageUrl2: text("image_url_2"),
  imageUrl3: text("image_url_3"),
  imageUrl4: text("image_url_4"),
  
  // Tier 1 Enhancement: Enhanced Product Structure
  shortDescription: text("short_description"), // Brief product summary for listings
  isFeatured: boolean("is_featured").default(false), // Highlight best/promoted products
  
  // Tier 1 Enhancement: Sale & Pricing Intelligence
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }), // Actual discounted price
  saleStartDate: timestamp("sale_start_date"), // Sale period start
  saleEndDate: timestamp("sale_end_date"), // Sale period end
  totalSales: integer("total_sales").default(0), // Social proof through sales volume
  viewCount: integer("view_count").default(0), // Track product views for recommendations
  salesCount: integer("sales_count").default(0), // Track actual sales for best sellers
  
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isNew: boolean("is_new").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  isOnSale: boolean("is_on_sale").default(false),
  discountPercentage: integer("discount_percentage").default(0),
  
  // Unified Import System Fields
  sourcePlatform: sourcePlatformEnum("source_platform").default("aveenix"),
  productType: productTypeEnum("product_type").default("physical"),
  externalId: text("external_id"), // Original product ID from source platform
  affiliateUrl: text("affiliate_url"), // Direct link to external platform
  categoryMapping: jsonb("category_mapping").$type<string[]>(), // Array of unified categories
  platformSpecificData: jsonb("platform_specific_data").$type<Record<string, any>>(), // Store platform-specific fields
  
  // Additional Product Identity Fields (as requested)
  productCode: text("product_code"), // Product Code
  sku: text("sku"), // SKU
  barcode: text("barcode"), // Barcode
  reference: text("reference"), // Reference
  manufacturer: text("manufacturer"), // Manufacturer
  productTags: jsonb("product_tags").$type<string[]>(), // Product Tags as array
  seoField: text("seo_field"), // SEO Field
  notes: text("notes"), // Notes
  
  // Inventory & Sync Management
  stockQuantity: integer("stock_quantity").default(0),
  isInStock: boolean("is_in_stock").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  syncStatus: text("sync_status").default("active"), // 'active', 'paused', 'error'
  
  // Multi-currency support
  originalCurrency: text("original_currency").default("USD"),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }).default("1.0"),
  
  // Pricing Management Fields  
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }), // Base cost from supplier/platform

  // Vendor/Creator fields
  vendorId: integer("vendor_id"), // For multivendor products
  creatorId: integer("creator_id"), // For creator-made products
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("0"), // For affiliate products
  
  // Approval Workflow Fields
  approvalStatus: approvalStatusEnum("approval_status").default("preview"),
  approvedBy: integer("approved_by"), // User ID who approved/rejected
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"), // Reason for rejection
  rejectionDate: timestamp("rejection_date"),
  
  // Smart Import Automation Fields
  automationAction: text("automation_action"), // 'auto-approve', 'auto-pending', 'auto-reject', 'manual-review'
  
  // Product Intelligence & Analytics Fields
  viabilityScore: decimal("viability_score", { precision: 5, scale: 2 }).default("0"), // 0-100 product viability score
  competitiveScore: decimal("competitive_score", { precision: 5, scale: 2 }).default("0"), // 0-100 competitive advantage score
  profitMarginScore: decimal("profit_margin_score", { precision: 5, scale: 2 }).default("0"), // 0-100 profit margin score
  marketTrendScore: decimal("market_trend_score", { precision: 5, scale: 2 }).default("0"), // 0-100 market trend score
  overallIntelligenceScore: decimal("overall_intelligence_score", { precision: 5, scale: 2 }).default("0"), // Combined weighted score
  
  // Competitive Intelligence
  competitorPrices: jsonb("competitor_prices").$type<{ platform: string; price: number; url: string; lastChecked: string }[]>(),
  suggestedPrice: decimal("suggested_price", { precision: 10, scale: 2 }),
  priceOptimizationReason: text("price_optimization_reason"),
  
  // AI Category Suggestions
  aiSuggestedCategories: jsonb("ai_suggested_categories").$type<{ category: string; confidence: number; reason: string }[]>(),
  categoryConfidenceScore: decimal("category_confidence_score", { precision: 5, scale: 2 }).default("0"),
  
  // Market Intelligence
  googleTrendsScore: decimal("google_trends_score", { precision: 5, scale: 2 }).default("0"),
  amazonBestSellerRank: integer("amazon_bestseller_rank"),
  marketDemandLevel: text("market_demand_level").default("unknown"), // 'low', 'medium', 'high', 'very_high'
  seasonalityPattern: jsonb("seasonality_pattern").$type<{ month: number; demandMultiplier: number }[]>(),
  
  // Intelligence Analysis Metadata
  intelligenceLastUpdated: timestamp("intelligence_last_updated"),
  intelligenceAnalysisVersion: text("intelligence_analysis_version").default("1.0"),
  dataSourcesUsed: jsonb("data_sources_used").$type<string[]>(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Indexes for performance
  sourcePlatformIdx: index("products_source_platform_idx").on(table.sourcePlatform),
  productTypeIdx: index("products_product_type_idx").on(table.productType),
  categoryIdx: index("products_category_idx").on(table.category),
  externalIdIdx: index("products_external_id_idx").on(table.externalId),
  vendorIdIdx: index("products_vendor_id_idx").on(table.vendorId),
  approvalStatusIdx: index("products_approval_status_idx").on(table.approvalStatus),
  approvedByIdx: index("products_approved_by_idx").on(table.approvedBy),
}));

// Reviews table for authentic product reviews from external platforms
// Review moderation status enum
export const reviewModerationStatusEnum = pgEnum("review_moderation_status", ["pending", "approved", "rejected"]);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'set null' }), // Link to authenticated users
  externalId: text("external_id"), // Original review ID from source platform
  sourcePlatform: sourcePlatformEnum("source_platform").default("aveenix"),
  
  // Review content
  reviewerName: text("reviewer_name").notNull(),
  reviewerEmail: text("reviewer_email"), // Optional, may not be available from all platforms
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"), // Review title/subject
  content: text("content").notNull(), // Review text
  
  // Review metadata
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  helpfulCount: integer("helpful_count").default(0), // How many found this helpful
  unhelpfulCount: integer("unhelpful_count").default(0), // How many found this unhelpful
  reviewDate: timestamp("review_date").notNull(), // When review was originally posted
  
  // Moderation system
  moderationStatus: reviewModerationStatusEnum("moderation_status").default("pending"),
  moderatedBy: integer("moderated_by").references(() => users.id, { onDelete: 'set null' }),
  moderatedAt: timestamp("moderated_at"),
  moderationReason: text("moderation_reason"), // Reason for rejection if applicable
  
  // Platform-specific data
  platformSpecificData: jsonb("platform_specific_data").$type<Record<string, any>>(),
  
  // Import tracking
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  productIdIdx: index("reviews_product_id_idx").on(table.productId),
  userIdIdx: index("reviews_user_id_idx").on(table.userId),
  sourcePlatformIdx: index("reviews_source_platform_idx").on(table.sourcePlatform),
  externalIdIdx: index("reviews_external_id_idx").on(table.externalId),
  ratingIdx: index("reviews_rating_idx").on(table.rating),
  moderationStatusIdx: index("reviews_moderation_status_idx").on(table.moderationStatus),
}));

// Table for tracking helpful/unhelpful votes
export const reviewVotes = pgTable("review_votes", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").references(() => reviews.id, { onDelete: 'cascade' }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  voteType: text("vote_type").notNull(), // 'helpful' or 'unhelpful'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  reviewUserIdx: index("review_votes_review_user_idx").on(table.reviewId, table.userId),
  userIdIdx: index("review_votes_user_id_idx").on(table.userId),
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly category identifier
  icon: text("icon").notNull(),
  isHot: boolean("is_hot").default(false),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  
  // Unified category system fields
  productCount: integer("product_count").default(0), // Auto-calculated
  platformMapping: jsonb("platform_mapping").$type<Record<string, string[]>>(), // Maps to external platform categories
  isAutoCreated: boolean("is_auto_created").default(false), // Created during import
  
  // SEO and display
  description: text("description"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  slugIdx: index("categories_slug_idx").on(table.slug),
  parentIdIdx: index("categories_parent_id_idx").on(table.parentId),
}));

// Platform Category Mapping Table for Hybrid Management
export const platformCategoryMappings = pgTable("platform_category_mappings", {
  id: serial("id").primaryKey(),
  masterCategoryId: integer("master_category_id").references(() => categories.id, { onDelete: 'cascade' }).notNull(),
  platformName: text("platform_name").notNull(), // 'amazon', 'aliexpress', 'woocommerce', etc.
  platformCategoryId: text("platform_category_id").notNull(), // External platform's category ID
  platformCategoryName: text("platform_category_name").notNull(), // External platform's category name
  platformCategoryPath: text("platform_category_path"), // Full hierarchy path (e.g., "Electronics > Cell Phones > Accessories")
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }).default("100"), // How confident we are in this mapping
  isAutoGenerated: boolean("is_auto_generated").default(false), // Created by AI vs manually
  lastVerified: timestamp("last_verified").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  masterCategoryIdx: index("platform_mappings_master_category_idx").on(table.masterCategoryId),
  platformIdx: index("platform_mappings_platform_idx").on(table.platformName),
  uniquePlatformMapping: index("unique_platform_mapping").on(table.platformName, table.platformCategoryId),
}));

// Fallback Category Classification Rules
export const categoryClassificationRules = pgTable("category_classification_rules", {
  id: serial("id").primaryKey(),
  ruleName: text("rule_name").notNull(),
  ruleType: text("rule_type").notNull(), // 'keyword', 'brand', 'price_range', 'title_pattern'
  pattern: text("pattern").notNull(), // The pattern to match
  targetCategoryId: integer("target_category_id").references(() => categories.id).notNull(),
  priority: integer("priority").default(50), // Higher numbers = higher priority
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }).default("75"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  ruleTypeIdx: index("classification_rules_type_idx").on(table.ruleType),
  priorityIdx: index("classification_rules_priority_idx").on(table.priority),
  targetCategoryIdx: index("classification_rules_target_category_idx").on(table.targetCategoryId),
}));

export const productAttributes = pgTable("product_attributes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(), // "text", "number", "selection", "color", "boolean"
  isRequired: boolean("is_required").default(false),
  isFilterable: boolean("is_filterable").default(true),
  sortOrder: integer("sort_order").default(0),
  categoryId: integer("category_id").references(() => categories.id), // Attribute applies to specific category
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  slugIdx: index("attributes_slug_idx").on(table.slug),
  categoryIdIdx: index("attributes_category_id_idx").on(table.categoryId),
}));

export const attributeValues = pgTable("attribute_values", {
  id: serial("id").primaryKey(),
  attributeId: integer("attribute_id").references(() => productAttributes.id, { onDelete: 'cascade' }).notNull(),
  value: text("value").notNull(),
  colorCode: text("color_code"), // For color attributes
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  attributeIdIdx: index("attribute_values_attribute_id_idx").on(table.attributeId),
}));

// Automation Rules System
export const automationRuleTypeEnum = pgEnum("automation_rule_type", [
  "auto_download", 
  "preview_to_pending", 
  "pending_to_approved", 
  "approved_to_published", 
  "auto_reject"
]);

export const automationConditionTypeEnum = pgEnum("automation_condition_type", [
  "price_range", 
  "category", 
  "rating", 
  "brand", 
  "description_length", 
  "stock_level", 
  "product_type", 
  "source_platform",
  "keyword_match",
  "exclude_keyword"
]);

export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ruleType: automationRuleTypeEnum("rule_type").notNull(),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(50), // Higher = processed first
  
  // Execution settings
  batchSize: integer("batch_size").default(10), // How many products to process at once
  executionInterval: integer("execution_interval").default(30), // Minutes between runs
  maxDailyExecutions: integer("max_daily_executions").default(100),
  
  // Time-based restrictions
  enableSchedule: boolean("enable_schedule").default(false),
  scheduleStart: text("schedule_start"), // "09:00" format
  scheduleEnd: text("schedule_end"), // "17:00" format
  scheduleDays: jsonb("schedule_days").$type<string[]>(), // ["monday", "tuesday", ...]
  
  // Statistics
  executionCount: integer("execution_count").default(0),
  lastExecutedAt: timestamp("last_executed_at"),
  successfulExecutions: integer("successful_executions").default(0),
  failedExecutions: integer("failed_executions").default(0),
  
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  ruleTypeIdx: index("automation_rules_type_idx").on(table.ruleType),
  isActiveIdx: index("automation_rules_active_idx").on(table.isActive),
  priorityIdx: index("automation_rules_priority_idx").on(table.priority),
}));

export const automationConditions = pgTable("automation_conditions", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id").references(() => automationRules.id, { onDelete: 'cascade' }).notNull(),
  conditionType: automationConditionTypeEnum("condition_type").notNull(),
  operator: text("operator").notNull(), // "equals", "greater_than", "less_than", "contains", "in", "not_in"
  value: text("value").notNull(), // Stored as string, parsed based on condition type
  logicalOperator: text("logical_operator").default("AND"), // "AND", "OR" with next condition
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  ruleIdIdx: index("automation_conditions_rule_id_idx").on(table.ruleId),
  conditionTypeIdx: index("automation_conditions_type_idx").on(table.conditionType),
}));

export const automationExecutionLogs = pgTable("automation_execution_logs", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id").references(() => automationRules.id, { onDelete: 'cascade' }).notNull(),
  executionStatus: text("execution_status").notNull(), // "success", "error", "partial"
  productsProcessed: integer("products_processed").default(0),
  productsAffected: integer("products_affected").default(0),
  errorMessage: text("error_message"),
  executionTimeMs: integer("execution_time_ms"),
  
  // Details about what was processed
  sourceStatus: text("source_status"), // "preview", "pending", etc.
  targetStatus: text("target_status"), // "pending", "approved", etc.
  productIds: jsonb("product_ids").$type<string[]>(), // IDs of affected products
  
  executedAt: timestamp("executed_at").defaultNow(),
}, (table) => ({
  ruleIdIdx: index("automation_logs_rule_id_idx").on(table.ruleId),
  executedAtIdx: index("automation_logs_executed_at_idx").on(table.executedAt),
  executionStatusIdx: index("automation_logs_status_idx").on(table.executionStatus),
}));

// Automation System Types
export type AutomationRule = typeof automationRules.$inferSelect;
export type AutomationCondition = typeof automationConditions.$inferSelect;
export type AutomationExecutionLog = typeof automationExecutionLogs.$inferSelect;

export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({
  id: true,
  executionCount: true,
  lastExecutedAt: true,
  successfulExecutions: true,
  failedExecutions: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAutomationConditionSchema = createInsertSchema(automationConditions).omit({
  id: true,
  createdAt: true,
});

export const insertAutomationExecutionLogSchema = createInsertSchema(automationExecutionLogs).omit({
  id: true,
  executedAt: true,
});

export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type InsertAutomationCondition = z.infer<typeof insertAutomationConditionSchema>;
export type InsertAutomationExecutionLog = z.infer<typeof insertAutomationExecutionLogSchema>;

// Brand types
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = typeof brands.$inferInsert;

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  productCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBrandType = z.infer<typeof insertBrandSchema>;

export const productAttributeValues = pgTable("product_attribute_values", {
  id: serial("id").primaryKey(),
  productId: text("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
  attributeId: integer("attribute_id").references(() => productAttributes.id, { onDelete: 'cascade' }).notNull(),
  valueId: integer("value_id").references(() => attributeValues.id, { onDelete: 'cascade' }),
  customValue: text("custom_value"), // For text/number attributes
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  productIdIdx: index("product_attributes_product_id_idx").on(table.productId),
  attributeIdIdx: index("product_attributes_attribute_id_idx").on(table.attributeId),
  uniqueProductAttribute: index("unique_product_attribute").on(table.productId, table.attributeId),
}));

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'shipping' or 'billing'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id").notNull(),
  status: orderStatusEnum("status").default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: integer("shipping_address_id").notNull(),
  billingAddressId: integer("billing_address_id").notNull(),
  shippingMethod: text("shipping_method"), // 'standard', 'express', 'overnight'
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  productName: text("product_name").notNull(), // Store product name at time of order
  productImage: text("product_image"), // Store product image at time of order
});



export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // 'percentage' or 'fixed'
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minimumAmount: decimal("minimum_amount", { precision: 10, scale: 2 }),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  businessDescription: text("business_description").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  taxId: text("tax_id").notNull(),
  website: text("website"),
  status: vendorStatusEnum("status").default("pending"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("15.00"),
  totalSales: decimal("total_sales", { precision: 15, scale: 2 }).default("0.00"),
  totalOrders: integer("total_orders").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendor applications captured before full vendor creation
export const vendorApplications = pgTable("vendor_applications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  storeName: text("store_name").notNull(),
  status: vendorApplicationStatusEnum("status").default("pending"),
  data: jsonb("data").$type<Record<string, any>>(),
  notes: text("notes"),
  reviewedBy: integer("reviewed_by").references(() => users.id, { onDelete: 'set null' }),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  emailIdx: index("vendor_applications_email_idx").on(table.email),
  statusIdx: index("vendor_applications_status_idx").on(table.status),
}));

// Unified Import System Tables
export const importSessions = pgTable("import_sessions", {
  id: serial("id").primaryKey(),
  sourcePlatform: sourcePlatformEnum("source_platform").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'running', 'completed', 'failed'
  totalProducts: integer("total_products").default(0),
  processedProducts: integer("processed_products").default(0),
  successfulImports: integer("successful_imports").default(0),
  failedImports: integer("failed_imports").default(0),
  errorLog: jsonb("error_log").$type<Record<string, any>[]>(),
  importConfig: jsonb("import_config").$type<Record<string, any>>(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdBy: integer("created_by"), // User who initiated the import
});

export const platformSyncLogs = pgTable("platform_sync_logs", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull(),
  sourcePlatform: sourcePlatformEnum("source_platform").notNull(),
  syncType: text("sync_type").notNull(), // 'price', 'stock', 'metadata', 'full'
  oldValue: jsonb("old_value").$type<Record<string, any>>(),
  newValue: jsonb("new_value").$type<Record<string, any>>(),
  status: text("status").notNull(), // 'success', 'failed', 'skipped'
  errorMessage: text("error_message"),
  syncedAt: timestamp("synced_at").defaultNow(),
});

export const categoryMappings = pgTable("category_mappings", {
  id: serial("id").primaryKey(),
  aveenixCategoryId: integer("aveenix_category_id").notNull(),
  sourcePlatform: sourcePlatformEnum("source_platform").notNull(),
  externalCategoryId: text("external_category_id").notNull(),
  externalCategoryName: text("external_category_name").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("1.0"), // Mapping confidence 0-1
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  platformCategoryIdx: index("category_mappings_platform_category_idx").on(table.sourcePlatform, table.externalCategoryId),
  aveenixCategoryIdx: index("category_mappings_aveenix_category_idx").on(table.aveenixCategoryId),
}));

// Quality Control System Tables
export const productQualityMetrics = pgTable("product_quality_metrics", {
  id: serial("id").primaryKey(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  validationScore: integer("validation_score").default(0), // 0-100
  duplicateRisk: integer("duplicate_risk").default(0), // 0-100  
  contentQualityScore: integer("content_quality_score").default(0), // 0-100
  filteringFlags: text("filtering_flags").array().default([]), // ['inappropriate', 'trademark']
  performanceScore: integer("performance_score").default(0), // 0-100
  rejectionReason: varchar("rejection_reason", { length: 255 }), // 'missing_data', 'content_filtered', 'duplicate_detected', 'performance_risk'
  qualityCheckedAt: timestamp("quality_checked_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qualityControlSettings = pgTable("quality_control_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value").notNull(),
  categoryId: integer("category_id"), // NULL for global settings, category ID for category-specific
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const importQualityLogs = pgTable("import_quality_logs", {
  id: serial("id").primaryKey(),
  importBatch: varchar("import_batch", { length: 255 }),
  source: varchar("source", { length: 100 }).notNull(),
  totalProducts: integer("total_products").default(0),
  validationFailures: integer("validation_failures").default(0),
  duplicatesDetected: integer("duplicates_detected").default(0),
  filteredProducts: integer("filtered_products").default(0),
  averageQualityScore: integer("average_quality_score").default(0),
  importDate: timestamp("import_date").defaultNow(),
});

// Amazon Commission Rates Table
export const amazonCommissionRates = pgTable("amazon_commission_rates", {
  id: serial("id").primaryKey(),
  categoryName: varchar("category_name", { length: 255 }).notNull().unique(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(), // e.g., 4.50 for 4.5%
  rateSource: varchar("rate_source", { length: 100 }).default("amazon_official"), // 'amazon_official', 'estimated', 'custom'
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Dropship Markup Rates table for category-based pricing
export const dropshipMarkupRates = pgTable("dropship_markup_rates", {
  id: serial("id").primaryKey(),
  categoryName: varchar("category_name", { length: 255 }).notNull().unique(),
  markupPercentage: decimal("markup_percentage", { precision: 5, scale: 2 }).notNull(), // e.g., 50.00 for 50%
  minMargin: decimal("min_margin", { precision: 5, scale: 2 }).default("30.00"), // Minimum profit margin %
  maxMargin: decimal("max_margin", { precision: 5, scale: 2 }).default("100.00"), // Maximum profit margin %
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1), // Higher priority overrides lower
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual Product Markup Overrides table for custom product pricing
export const productMarkupOverrides = pgTable("product_markup_overrides", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().unique(),
  customMarkupPercentage: decimal("custom_markup_percentage", { precision: 5, scale: 2 }).notNull(),
  reason: text("reason"), // Why this product has custom markup
  setBy: integer("set_by"), // User ID who set this override
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for dropship tables
export const insertDropshipMarkupRateSchema = createInsertSchema(dropshipMarkupRates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductMarkupOverrideSchema = createInsertSchema(productMarkupOverrides).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDropshipMarkupRate = z.infer<typeof insertDropshipMarkupRateSchema>;
export type DropshipMarkupRate = typeof dropshipMarkupRates.$inferSelect;
export type InsertProductMarkupOverride = z.infer<typeof insertProductMarkupOverrideSchema>;
export type ProductMarkupOverride = typeof productMarkupOverrides.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAddressSchema = createInsertSchema(userAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  moderatedBy: true,
  moderatedAt: true,
});

export const insertReviewVoteSchema = createInsertSchema(reviewVotes).omit({
  id: true,
  createdAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlist).omit({
  id: true,
  createdAt: true,
});

export const insertCartSchema = createInsertSchema(cart).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
  id: true,
  createdAt: true,
});

export const insertProductQualityMetricsSchema = createInsertSchema(productQualityMetrics).omit({
  id: true,
  createdAt: true,
  qualityCheckedAt: true,
});

export const insertQualityControlSettingsSchema = createInsertSchema(qualityControlSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertImportQualityLogsSchema = createInsertSchema(importQualityLogs).omit({
  id: true,
  importDate: true,
});

export const insertAmazonCommissionRatesSchema = createInsertSchema(amazonCommissionRates).omit({
  id: true,
  lastUpdated: true,
  createdAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVendorApplicationSchema = createInsertSchema(vendorApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  reviewedBy: true,
  status: true,
});

export const insertImportSessionSchema = createInsertSchema(importSessions).omit({
  id: true,
  startedAt: true,
});

export const insertPlatformSyncLogSchema = createInsertSchema(platformSyncLogs).omit({
  id: true,
  syncedAt: true,
});

export const insertCategoryMappingSchema = createInsertSchema(categoryMappings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
// Product Q&A Knowledge Base
export const productQA = pgTable('product_qa', {
  id: serial('id').primaryKey(),
  productId: varchar('product_id', { length: 255 }).notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  isHelpful: boolean('is_helpful').default(true).notNull(),
  helpfulVotes: integer('helpful_votes').default(0).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  userId: varchar('user_id', { length: 255 }), // Optional - for tracking contributors
  customerName: varchar('customer_name', { length: 255 }), // Optional display name
});

export const insertProductQASchema = createInsertSchema(productQA).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = z.infer<typeof insertUserAddressSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type ProductQA = typeof productQA.$inferSelect;
export type InsertProductQA = z.infer<typeof insertProductQASchema>;
export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ReviewVote = typeof reviewVotes.$inferSelect;
export type InsertReviewVote = z.infer<typeof insertReviewVoteSchema>;

export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Cart = typeof cart.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type VendorApplication = typeof vendorApplications.$inferSelect;
export type InsertVendorApplication = z.infer<typeof insertVendorApplicationSchema>;
export type ImportSession = typeof importSessions.$inferSelect;
export type InsertImportSession = z.infer<typeof insertImportSessionSchema>;
export type PlatformSyncLog = typeof platformSyncLogs.$inferSelect;
export type InsertPlatformSyncLog = z.infer<typeof insertPlatformSyncLogSchema>;
export type CategoryMapping = typeof categoryMappings.$inferSelect;
export type InsertCategoryMapping = z.infer<typeof insertCategoryMappingSchema>;

// Quality Control Types
export type ProductQualityMetrics = typeof productQualityMetrics.$inferSelect;
export type InsertProductQualityMetrics = z.infer<typeof insertProductQualityMetricsSchema>;
export type QualityControlSettings = typeof qualityControlSettings.$inferSelect;
export type InsertQualityControlSettings = z.infer<typeof insertQualityControlSettingsSchema>;
export type ImportQualityLogs = typeof importQualityLogs.$inferSelect;
export type InsertImportQualityLogs = z.infer<typeof insertImportQualityLogsSchema>;
export type AmazonCommissionRate = typeof amazonCommissionRates.$inferSelect;
export type InsertAmazonCommissionRate = z.infer<typeof insertAmazonCommissionRatesSchema>;

// Product Attribute schemas
export const insertProductAttributeSchema = createInsertSchema(productAttributes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProductAttribute = z.infer<typeof insertProductAttributeSchema>;
export type ProductAttribute = typeof productAttributes.$inferSelect;

export const insertAttributeValueSchema = createInsertSchema(attributeValues).omit({
  id: true,
  createdAt: true,
});
export type InsertAttributeValue = z.infer<typeof insertAttributeValueSchema>;
export type AttributeValue = typeof attributeValues.$inferSelect;

export const insertProductAttributeValueSchema = createInsertSchema(productAttributeValues).omit({
  id: true,
  createdAt: true,
});
export type InsertProductAttributeValue = z.infer<typeof insertProductAttributeValueSchema>;
export type ProductAttributeValue = typeof productAttributeValues.$inferSelect;

// Extended types for API responses
export type OrderWithItems = Order & {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  user: Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName'>;
};

export type ProductWithReviews = Product & {
  reviews: Review[];
  category: Category;
};

// Extended types for unified product system
export type UnifiedProduct = Product & {
  category: Category;
  vendor?: Vendor;
  platformData?: Record<string, any>;
  isAffiliate: boolean;
  isDropship: boolean;
  isMultivendor: boolean;
  isNative: boolean;
};

export type CategoryWithSubcategories = Category & {
  subcategories: Category[];
  productCount: number;
  platformDistribution: Record<string, number>;
};

export type ImportSessionWithLogs = ImportSession & {
  syncLogs: PlatformSyncLog[];
  createdByUser?: Pick<User, 'id' | 'username' | 'email'>;
};

export type ReviewWithUser = Review & {
  user: Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>;
};

// Community Questions Management System
// Intelligent question storage with retention policies based on content value

export const communityQuestions = pgTable(
  "community_questions",
  {
    id: varchar("id").primaryKey(), // q_12345
    userId: varchar("user_id").notNull(),
    
    // Core content (always stored)
    questionText: text("question_text").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    subcategory: varchar("subcategory", { length: 50 }),
    tags: jsonb("tags").$type<string[]>().default([]),
    
    // Classification scores
    problemSolvingScore: integer("problem_solving_score").notNull(), // 0-100
    businessValue: integer("business_value").notNull(), // 0-100
    communityImpact: integer("community_impact").notNull(), // 0-100
    searchability: integer("searchability").notNull(), // 0-100
    complexity: varchar("complexity", { length: 20 }).notNull(), // simple|moderate|complex|expert
    
    // Storage management
    storageLevel: varchar("storage_level", { length: 20 }).notNull(), // full|summary|reference|discard
    retentionPeriod: integer("retention_days").notNull(), // days to keep
    indexPriority: varchar("index_priority", { length: 10 }).notNull(), // high|medium|low
    
    // Status tracking
    isActive: boolean("is_active").default(true),
    isSolved: boolean("is_solved").default(false),
    solvedAt: timestamp("solved_at"),
    bestAnswerId: varchar("best_answer_id"),
    
    // External content links (resource-efficient)
    externalLinks: jsonb("external_links").$type<{
      originalPost?: string;
      images?: string[];
      videos?: string[];
      documents?: string[];
      relatedContent?: string[];
    }>().default({}),
    
    // Platform distribution tracking
    platformPosts: jsonb("platform_posts").$type<{
      twitter?: { postId: string; url: string; status: string };
      linkedin?: { postId: string; url: string; status: string };
      facebook?: { postId: string; url: string; status: string };
      instagram?: { postId: string; url: string; status: string };
      youtube?: { postId: string; url: string; status: string };
      pinterest?: { postId: string; url: string; status: string };
      tiktok?: { postId: string; url: string; status: string };
    }>().default({}),
    
    // Engagement metrics
    totalResponses: integer("total_responses").default(0),
    totalViews: integer("total_views").default(0),
    totalEngagement: integer("total_engagement").default(0),
    qualityRating: decimal("quality_rating", { precision: 3, scale: 2 }), // 0.00-5.00
    
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    expiresAt: timestamp("expires_at"), // For auto-cleanup
  },
  (table) => [
    index("idx_category_score").on(table.category, table.problemSolvingScore),
    index("idx_storage_level").on(table.storageLevel, table.isActive),
    index("idx_expiry").on(table.expiresAt),
    index("idx_tags").on(table.tags),
  ]
);

export const communityAnswers = pgTable(
  "community_answers",
  {
    id: varchar("id").primaryKey(), // a_12345
    questionId: varchar("question_id").notNull(),
    
    // Core answer content (text only for efficiency)
    answerText: text("answer_text").notNull(),
    answerSummary: varchar("answer_summary", { length: 500 }), // For quick display
    
    // Answer source
    platform: varchar("platform", { length: 20 }).notNull(),
    authorName: varchar("author_name", { length: 100 }),
    authorHandle: varchar("author_handle", { length: 100 }),
    authorReputation: integer("author_reputation"),
    
    // External links for rich content
    externalContent: jsonb("external_content").$type<{
      originalPostUrl: string;
      mediaUrls?: string[];
      codeSnippets?: string[];
      attachments?: string[];
    }>().notNull(),
    
    // Answer quality metrics
    upvotes: integer("upvotes").default(0),
    downvotes: integer("downvotes").default(0),
    engagementScore: integer("engagement_score").default(0),
    isVerified: boolean("is_verified").default(false),
    isBestAnswer: boolean("is_best_answer").default(false),
    
    // Classification
    answerType: varchar("answer_type", { length: 20 }).notNull(), // solution|explanation|resource|opinion
    technicalLevel: varchar("technical_level", { length: 20 }), // beginner|intermediate|advanced|expert
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_question_quality").on(table.questionId, table.engagementScore),
    index("idx_best_answers").on(table.isBestAnswer, table.isVerified),
    index("idx_platform").on(table.platform),
  ]
);

export const knowledgeBase = pgTable(
  "knowledge_base",
  {
    id: varchar("id").primaryKey(), // kb_12345
    questionId: varchar("question_id").notNull(),
    
    // Processed content for fast searches
    title: varchar("title", { length: 200 }).notNull(),
    processedAnswer: text("processed_answer").notNull(), // AI-optimized answer
    quickSolution: varchar("quick_solution", { length: 300 }), // One-liner solution
    
    // Search optimization
    searchKeywords: jsonb("search_keywords").$type<string[]>().notNull(),
    relatedQuestions: jsonb("related_questions").$type<string[]>().default([]),
    
    // Content classification
    difficultyLevel: varchar("difficulty_level", { length: 20 }),
    timeToImplement: varchar("time_to_implement", { length: 50 }), // "5 minutes", "1 hour", "1 day"
    requiredSkills: jsonb("required_skills").$type<string[]>().default([]),
    
    // Quality metrics
    confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }), // 0-100
    usageCount: integer("usage_count").default(0),
    successRate: decimal("success_rate", { precision: 5, scale: 2 }), // Based on user feedback
    
    // Links to full content (efficient storage)
    fullContentLinks: jsonb("full_content_links").$type<{
      originalQuestion: string;
      bestAnswers: string[];
      discussionThread: string;
      additionalResources?: string[];
    }>().notNull(),
    
    lastUpdated: timestamp("last_updated").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_search_keywords").on(table.searchKeywords),
    index("idx_confidence").on(table.confidenceScore),
    index("idx_usage").on(table.usageCount),
  ]
);

export const searchAnalytics = pgTable(
  "search_analytics",
  {
    id: varchar("id").primaryKey(),
    searchQuery: varchar("search_query", { length: 500 }).notNull(),
    resultsFound: integer("results_found").notNull(),
    clickedResult: varchar("clicked_result"), // Which result was clicked
    userSatisfaction: integer("user_satisfaction"), // 1-5 rating
    searchDate: timestamp("search_date").defaultNow(),
    userId: varchar("user_id"),
  },
  (table) => [
    index("idx_search_query").on(table.searchQuery),
    index("idx_search_date").on(table.searchDate),
  ]
);

// Community schema types
export const insertCommunityQuestionSchema = createInsertSchema(communityQuestions).extend({
  tags: z.array(z.string()).optional(),
  externalLinks: z.object({
    originalPost: z.string().optional(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
    relatedContent: z.array(z.string()).optional(),
  }).optional(),
});

// Creator Economy Tables (imported from server schema)
export const creatorProfiles = pgTable(
  "creator_profiles",
  {
    id: varchar("id").primaryKey(), // cr_12345
    userId: varchar("user_id").notNull(), // Links to main users table
    
    // Creator Identity
    displayName: varchar("display_name", { length: 100 }).notNull(),
    bio: text("bio"),
    profileImageUrl: varchar("profile_image_url"),
    
    // Creator Stats
    totalSolutions: integer("total_solutions").default(0),
    totalViews: integer("total_views").default(0),
    totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
    averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
    
    // Creator Level & Status
    creatorLevel: varchar("creator_level", { length: 20 }).default("rookie"), // rookie|rising|expert|master|legend
    isVerified: boolean("is_verified").default(false),
    isActive: boolean("is_active").default(true),
    
    // Social Media Links
    socialLinks: jsonb("social_links").$type<{
      tiktok?: string;
      youtube?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
    }>().default({}),
    
    // Specialization Tags
    expertiseTags: jsonb("expertise_tags").$type<string[]>().default([]),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_creator_level").on(table.creatorLevel),
    index("idx_verified").on(table.isVerified),
    index("idx_expertise").on(table.expertiseTags),
  ]
);

export const creatorSolutions = pgTable(
  "creator_solutions",
  {
    id: varchar("id").primaryKey(), // cs_12345
    questionId: varchar("question_id").notNull(),
    creatorId: varchar("creator_id").notNull(),
    
    // Solution Content
    solutionTitle: varchar("solution_title", { length: 200 }).notNull(),
    solutionContent: text("solution_content").notNull(),
    solutionType: varchar("solution_type", { length: 30 }).notNull(), // video|article|tutorial|recipe|guide|code
    
    // Media Content
    mediaUrls: jsonb("media_urls").$type<{
      mainVideo?: string; // TikTok, YouTube, etc.
      images?: string[];
      attachments?: string[];
      codeSnippets?: string[];
    }>().default({}),
    
    // Monetization Links
    monetizationLinks: jsonb("monetization_links").$type<{
      affiliateLinks?: Array<{
        platform: string; // "amazon" | "tiktok_shop" | "shopify" | etc.
        url: string;
        description: string;
        commission: number; // Expected commission percentage
      }>;
      directSales?: Array<{
        platform: string;
        url: string;
        price: number;
        description: string;
      }>;
      sponsoredContent?: Array<{
        brand: string;
        url: string;
        description: string;
        fee: number;
      }>;
    }>().default({}),
    
    // Performance Metrics
    views: integer("views").default(0),
    likes: integer("likes").default(0),
    saves: integer("saves").default(0),
    clickThroughs: integer("click_throughs").default(0), // Clicks on monetization links
    revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"), // Creator's earnings from this solution
    
    // Quality Metrics
    rating: decimal("rating", { precision: 3, scale: 2 }),
    ratingCount: integer("rating_count").default(0),
    isVerifiedSolution: boolean("is_verified_solution").default(false),
    
    // Status
    status: varchar("status", { length: 20 }).default("active"), // active|featured|archived|flagged
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_question_creator").on(table.questionId, table.creatorId),
    index("idx_solution_type").on(table.solutionType),
    index("idx_performance").on(table.views, table.revenue),
    index("idx_status").on(table.status),
  ]
);

// Schema types
export const insertCreatorProfileSchema = createInsertSchema(creatorProfiles);
export const insertCreatorSolutionSchema = createInsertSchema(creatorSolutions);

export type CommunityQuestion = typeof communityQuestions.$inferSelect;
export type InsertCommunityQuestion = z.infer<typeof insertCommunityQuestionSchema>;
export type CommunityAnswer = typeof communityAnswers.$inferSelect;
export type KnowledgeBaseEntry = typeof knowledgeBase.$inferSelect;
export type CreatorProfile = typeof creatorProfiles.$inferSelect;
export type InsertCreatorProfile = z.infer<typeof insertCreatorProfileSchema>;
export type CreatorSolution = typeof creatorSolutions.$inferSelect;
export type InsertCreatorSolution = z.infer<typeof insertCreatorSolutionSchema>;

// Community Rewards & Referral System
export const communityRewards = pgTable("community_rewards", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  rewardType: varchar("reward_type").notNull(), // question_bonus, review_reward, referral_commission, challenge_prize, etc.
  amount: decimal("amount").notNull(),
  credits: integer("credits").default(0),
  sourceId: varchar("source_id"), // Question ID, Review ID, Referral ID, etc.
  description: text("description"),
  status: varchar("status").default("pending"), // pending, approved, paid
  createdAt: timestamp("created_at").defaultNow(),
});

export const referralTracking = pgTable("referral_tracking", {
  id: varchar("id").primaryKey().notNull(),
  referrerId: varchar("referrer_id").notNull(), // User who made the referral
  referredId: varchar("referred_id").notNull(), // User who was referred
  referralCode: varchar("referral_code").notNull(),
  status: varchar("status").default("pending"), // pending, active, completed
  totalEarnings: decimal("total_earnings").default("0"),
  commissionsEarned: decimal("commissions_earned").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const communityActivities = pgTable("community_activities", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  activityType: varchar("activity_type").notNull(), // question_asked, solution_provided, review_given, vote_cast, etc.
  targetId: varchar("target_id"), // ID of the question, solution, review, etc.
  points: integer("points").default(0),
  metadata: jsonb("metadata"), // Additional activity-specific data
  createdAt: timestamp("created_at").defaultNow(),
});

export const challengeParticipation = pgTable("challenge_participation", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  challengeId: varchar("challenge_id").notNull(),
  submissionId: varchar("submission_id"), // Link to their solution/entry
  rank: integer("rank"),
  prizeAmount: decimal("prize_amount").default("0"),
  status: varchar("status").default("participating"), // participating, winner, completed
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for rewards system
export const insertCommunityRewardSchema = createInsertSchema(communityRewards);
export const insertReferralTrackingSchema = createInsertSchema(referralTracking);
export const insertCommunityActivitySchema = createInsertSchema(communityActivities);
export const insertChallengeParticipationSchema = createInsertSchema(challengeParticipation);

// Enhanced Rewards & Tasks System (Comprehensive)
export const rewardsLedger = pgTable('rewards_ledger', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  sourceType: varchar('source_type', { length: 24 }).notNull(), // affiliate|dropship|task|adjustment|reversal
  sourceId: varchar('source_id', { length: 128 }),
  amountCents: integer('amount_cents').notNull().default(0),   // money rewards in cents
  points: integer('points').notNull().default(0),              // optional points bucket
  status: varchar('status', { length: 16 }).notNull().default('confirmed'), // pending|confirmed|redeemed|expired
  createdAt: timestamp('created_at').defaultNow(),
});

export const vouchers = pgTable('vouchers', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 32 }).notNull().unique(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  amountCents: integer('amount_cents').notNull(),
  status: varchar('status', { length: 16 }).notNull().default('active'), // active|used|expired
  createdAt: timestamp('created_at').defaultNow(),
  usedAt: timestamp('used_at'),
});

export const giftCards = pgTable('giftcards', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 32 }).notNull().unique(),
  initialAmountCents: integer('initial_amount_cents').notNull(),
  remainingAmountCents: integer('remaining_amount_cents').notNull(),
  status: varchar('status', { length: 16 }).notNull().default('active'),
  userId: varchar('user_id', { length: 64 }),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description'),
  points: integer('points').notNull().default(0),
  amountCents: integer('amount_cents').notNull().default(0),
  verification: varchar('verification', { length: 16 }).notNull().default('event'), // event|webhook|manual
  eventKey: varchar('event_key', { length: 64 }), // e.g., USER_REGISTERED
  frequency: varchar('frequency', { length: 16 }).notNull().default('once'), // once|daily|weekly|monthly|custom
  cooldownHours: integer('cooldown_hours').notNull().default(0),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  isActive: boolean('is_active').notNull().default(true),
});

export const userTasks = pgTable('user_tasks', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  taskId: integer('task_id').notNull(),
  status: varchar('status', { length: 16 }).notNull().default('eligible'), // eligible|completed|cooldown
  completedAt: timestamp('completed_at'),
  nextEligibleAt: timestamp('next_eligible_at'),
  lastEventId: varchar('last_event_id', { length: 128 }),
});

export const redemptions = pgTable('redemptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  type: varchar('type', { length: 16 }).notNull(), // voucher|cash|giftcard
  amountCents: integer('amount_cents').notNull(),
  feeCents: integer('fee_cents').notNull().default(0),
  currency: varchar('currency', { length: 8 }).notNull().default('USD'),
  target: text('target'), // JSON
  status: varchar('status', { length: 16 }).notNull().default('requested'), // requested|approved|processing|paid|rejected|failed
  provider: varchar('provider', { length: 16 }).notNull().default('internal'),
  providerRef: varchar('provider_ref', { length: 128 }),
  createdAt: timestamp('created_at').defaultNow(),
  processedAt: timestamp('processed_at'),
});

// Insert schemas for enhanced rewards system
export const insertRewardsLedgerSchema = createInsertSchema(rewardsLedger);
export const insertVoucherSchema = createInsertSchema(vouchers);
export const insertGiftCardSchema = createInsertSchema(giftCards);
export const insertTaskSchema = createInsertSchema(tasks);
export const insertUserTaskSchema = createInsertSchema(userTasks);
export const insertRedemptionSchema = createInsertSchema(redemptions);

// Types for rewards system
export type CommunityReward = typeof communityRewards.$inferSelect;
export type InsertCommunityReward = z.infer<typeof insertCommunityRewardSchema>;
export type ReferralTracking = typeof referralTracking.$inferSelect;
export type InsertReferralTracking = z.infer<typeof insertReferralTrackingSchema>;
export type CommunityActivity = typeof communityActivities.$inferSelect;
export type InsertCommunityActivity = z.infer<typeof insertCommunityActivitySchema>;
export type ChallengeParticipation = typeof challengeParticipation.$inferSelect;
export type InsertChallengeParticipation = z.infer<typeof insertChallengeParticipationSchema>;

// Enhanced rewards system types
export type RewardsLedger = typeof rewardsLedger.$inferSelect;
export type InsertRewardsLedger = z.infer<typeof insertRewardsLedgerSchema>;
export type Voucher = typeof vouchers.$inferSelect;
export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type GiftCard = typeof giftCards.$inferSelect;
export type InsertGiftCard = z.infer<typeof insertGiftCardSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UserTask = typeof userTasks.$inferSelect;
export type InsertUserTask = z.infer<typeof insertUserTaskSchema>;
export type Redemption = typeof redemptions.$inferSelect;
export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;

// Notifications System
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // null for system-wide notifications
  type: notificationTypeEnum("type").notNull(),
  priority: notificationPriorityEnum("priority").default("medium"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  icon: text("icon"), // lucide icon name
  actionUrl: text("action_url"), // URL to navigate when clicked
  isRead: boolean("is_read").default(false),
  isGlobal: boolean("is_global").default(false), // true for system-wide notifications
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}), // Additional notification data
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
}, (table) => [
  index("idx_user_unread").on(table.userId, table.isRead),
  index("idx_created_at").on(table.createdAt),
  index("idx_type_priority").on(table.type, table.priority),
]);

// Notification schemas
export const insertNotificationSchema = createInsertSchema(notifications);
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// ===== INVENTORY MANAGEMENT SYSTEM =====

// Inventory Locations - Track warehouse locations and storage areas
export const inventoryLocations = pgTable("inventory_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipCode: text("zip_code"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  isActive: boolean("is_active").default(true),
  capacity: integer("capacity"), // Maximum items this location can hold
  currentStock: integer("current_stock").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory Items - Links products to specific locations with stock levels
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  locationId: integer("location_id").notNull().references(() => inventoryLocations.id, { onDelete: "cascade" }),
  
  // Stock information
  currentStock: integer("current_stock").notNull().default(0),
  reservedStock: integer("reserved_stock").default(0), // Stock reserved for pending orders
  availableStock: integer("available_stock").notNull().default(0), // Current - Reserved
  
  // Inventory management
  minimumStock: integer("minimum_stock").default(10), // Reorder point
  maximumStock: integer("maximum_stock").default(1000), // Overstock alert point
  reorderPoint: integer("reorder_point").default(20),
  reorderQuantity: integer("reorder_quantity").default(100),
  
  // Costs and valuation
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  
  // Status tracking
  stockStatus: stockStatusEnum("stock_status").default("in_stock"),
  lastCountDate: timestamp("last_count_date"),
  lastMovementDate: timestamp("last_movement_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_product_location").on(table.productId, table.locationId),
  index("idx_stock_status").on(table.stockStatus),
  index("idx_low_stock").on(table.currentStock, table.minimumStock),
]);

// Stock Movements - Track all inventory movements and changes
export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  locationId: integer("location_id").notNull().references(() => inventoryLocations.id, { onDelete: "cascade" }),
  
  // Movement details
  movementType: movementTypeEnum("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  
  // Reference information
  referenceType: text("reference_type"), // "order", "purchase", "adjustment", "transfer"
  referenceId: text("reference_id"), // ID of the related record
  reason: text("reason"), // Reason for the movement
  notes: text("notes"),
  
  // Stock levels after movement
  stockBefore: integer("stock_before").notNull(),
  stockAfter: integer("stock_after").notNull(),
  
  // Tracking
  performedBy: integer("performed_by").references(() => users.id),
  performedAt: timestamp("performed_at").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_product_movement").on(table.productId, table.performedAt),
  index("idx_movement_type").on(table.movementType),
  index("idx_reference").on(table.referenceType, table.referenceId),
]);

// Inventory Alerts - System alerts for low stock, overstock, etc.
export const inventoryAlerts = pgTable("inventory_alerts", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  locationId: integer("location_id").references(() => inventoryLocations.id, { onDelete: "cascade" }),
  
  // Alert details
  alertType: text("alert_type").notNull(), // "low_stock", "out_of_stock", "overstock", "reorder_point"
  severity: text("severity").default("medium"), // "low", "medium", "high", "critical"
  title: text("title").notNull(),
  message: text("message").notNull(),
  
  // Alert conditions
  currentStock: integer("current_stock"),
  thresholdValue: integer("threshold_value"),
  suggestedAction: text("suggested_action"),
  
  // Status tracking
  isActive: boolean("is_active").default(true),
  isRead: boolean("is_read").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_alert_active").on(table.isActive, table.severity),
  index("idx_product_alerts").on(table.productId),
  index("idx_alert_type").on(table.alertType),
]);

// Stock Transfers - Track transfers between locations
export const stockTransfers = pgTable("stock_transfers", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  fromLocationId: integer("from_location_id").notNull().references(() => inventoryLocations.id),
  toLocationId: integer("to_location_id").notNull().references(() => inventoryLocations.id),
  
  // Transfer details
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  notes: text("notes"),
  
  // Status tracking
  status: text("status").default("pending"), // "pending", "in_transit", "completed", "cancelled"
  requestedBy: integer("requested_by").notNull().references(() => users.id),
  approvedBy: integer("approved_by").references(() => users.id),
  completedBy: integer("completed_by").references(() => users.id),
  
  // Timestamps
  requestedAt: timestamp("requested_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  shippedAt: timestamp("shipped_at"),
  completedAt: timestamp("completed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_transfer_status").on(table.status),
  index("idx_product_transfer").on(table.productId),
  index("idx_locations_transfer").on(table.fromLocationId, table.toLocationId),
]);

// Inventory schemas for API
export const insertInventoryLocationSchema = createInsertSchema(inventoryLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryAlertSchema = createInsertSchema(inventoryAlerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStockTransferSchema = createInsertSchema(stockTransfers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Inventory type exports
export type InventoryLocation = typeof inventoryLocations.$inferSelect;
export type InsertInventoryLocation = z.infer<typeof insertInventoryLocationSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type InventoryAlert = typeof inventoryAlerts.$inferSelect;
export type InsertInventoryAlert = z.infer<typeof insertInventoryAlertSchema>;
export type StockTransfer = typeof stockTransfers.$inferSelect;
export type InsertStockTransfer = z.infer<typeof insertStockTransferSchema>;

// Extended inventory types for API responses
export type InventoryItemWithProduct = InventoryItem & {
  product: Product;
  location: InventoryLocation;
  alerts: InventoryAlert[];
  recentMovements: StockMovement[];
};

export type InventoryLocationWithItems = InventoryLocation & {
  items: InventoryItemWithProduct[];
  totalItems: number;
  totalValue: number;
  alertsCount: number;
};

export type StockMovementWithDetails = StockMovement & {
  product: Product;
  location: InventoryLocation;
  performedByUser?: Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>;
};

export type InventoryDashboardStats = {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  inStockItems: number;
  overstockItems: number;
  reorderItems: number;
  totalValue: number;
  locationsCount: number;
  alertsCount: number;
  todaysMovements: number;
};


// Amazon Affiliate Commission Rates Table
export const affiliateCommissionRates = pgTable("affiliate_commission_rates", {
  id: serial("id").primaryKey(),
  platform: affiliatePlatformEnum("platform").default("amazon").notNull(),
  categoryName: text("category_name").notNull(), // Amazon category name
  categoryPath: text("category_path"), // Full category hierarchy path
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(), // Percentage (e.g., 2.50 for 2.5%)
  
  // Override capabilities for promotional rates
  isPromotional: boolean("is_promotional").default(false),
  promotionalRate: decimal("promotional_rate", { precision: 5, scale: 2 }), 
  promotionalStartDate: timestamp("promotional_start_date"),
  promotionalEndDate: timestamp("promotional_end_date"),
  
  // Metadata
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  source: text("source").default("amazon_associates"), // Data source
  notes: text("notes"), // Additional notes about the rate
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  platformCategoryIdx: index("affiliate_rates_platform_category_idx").on(table.platform, table.categoryName),
  categoryPathIdx: index("affiliate_rates_category_path_idx").on(table.categoryPath),
  isActiveIdx: index("affiliate_rates_is_active_idx").on(table.isActive),
}));

// Insert and Select schemas for commission rates
export const insertAffiliateCommissionRateSchema = createInsertSchema(affiliateCommissionRates);
export const selectAffiliateCommissionRateSchema = createInsertSchema(affiliateCommissionRates);
export type AffiliateCommissionRate = typeof affiliateCommissionRates.$inferSelect;
export type InsertAffiliateCommissionRate = typeof affiliateCommissionRates.$inferInsert;


// User Downloads table for downloadable content, receipts, invoices
export const userDownloads = pgTable("user_downloads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "set null" }), // Link to order if applicable
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileType: text("file_type").notNull(), // "invoice", "receipt", "manual", "product_file", "warranty"
  downloadUrl: text("download_url").notNull(),
  fileSize: integer("file_size"), // Size in bytes
  mimeType: text("mime_type"), // "application/pdf", "image/jpeg", etc.
  downloadCount: integer("download_count").default(0),
  expiresAt: timestamp("expires_at"), // Optional expiration date
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("user_downloads_user_id_idx").on(table.userId),
  orderIdIdx: index("user_downloads_order_id_idx").on(table.orderId),
  fileTypeIdx: index("user_downloads_file_type_idx").on(table.fileType),
}));

// User Payment Methods table for saved payment methods
export const userPaymentMethods = pgTable("user_payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "card", "bank_account", "paypal", "apple_pay", "google_pay"
  provider: text("provider").notNull(), // "stripe", "paypal", "square", "manual"
  externalId: text("external_id"), // Stripe customer ID, PayPal customer ID, etc.
  
  // Card information (masked for security)
  cardLast4: text("card_last4"),
  cardBrand: text("card_brand"), // "visa", "mastercard", "amex", etc.
  cardExpMonth: integer("card_exp_month"),
  cardExpYear: integer("card_exp_year"),
  
  // General payment method info
  label: text("label").notNull(), // "Primary Visa", "Work Card", etc.
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  
  // Security and verification
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  
  // Metadata for provider-specific data
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("user_payment_methods_user_id_idx").on(table.userId),
  providerIdx: index("user_payment_methods_provider_idx").on(table.provider),
  userDefaultIdx: index("user_payment_methods_user_default_idx").on(table.userId, table.isDefault),
}));

// Type exports for new tables
export type UserDownload = typeof userDownloads.$inferSelect;
export type InsertUserDownload = typeof userDownloads.$inferInsert;
export type UserPaymentMethod = typeof userPaymentMethods.$inferSelect;
export type InsertUserPaymentMethod = typeof userPaymentMethods.$inferInsert;

// Export sales schema
export * from './salesSchema';
