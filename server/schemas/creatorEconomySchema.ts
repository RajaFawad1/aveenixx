import { pgTable, varchar, text, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";

/**
 * AVEENIX Creator Economy System
 * 
 * Business Model:
 * 1. Content creators provide solutions to community questions
 * 2. Creators earn revenue through affiliate links, sponsored content, and direct sales
 * 3. AVEENIX takes a percentage of transactions and charges premium creator features
 * 4. Community gets high-quality solutions, creators get paid, AVEENIX grows
 */

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

export const revenueTransactions = pgTable(
  "revenue_transactions",
  {
    id: varchar("id").primaryKey(), // tx_12345
    creatorId: varchar("creator_id").notNull(),
    solutionId: varchar("solution_id"),
    
    // Transaction Details
    transactionType: varchar("transaction_type", { length: 30 }).notNull(), // affiliate_commission|direct_sale|sponsorship|platform_fee
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    aveenixFee: decimal("aveenix_fee", { precision: 10, scale: 2 }).notNull(), // AVEENIX's cut
    creatorEarnings: decimal("creator_earnings", { precision: 10, scale: 2 }).notNull(),
    
    // Source Information
    sourceUrl: varchar("source_url"), // Where the sale came from
    sourcePlatform: varchar("source_platform", { length: 50 }), // amazon|tiktok|youtube|etc
    
    // Additional Details
    metadata: jsonb("metadata").$type<{
      productName?: string;
      customerInfo?: any;
      affiliateTrackingId?: string;
      conversionRate?: number;
    }>().default({}),
    
    transactionDate: timestamp("transaction_date").defaultNow(),
  },
  (table) => [
    index("idx_creator_earnings").on(table.creatorId, table.transactionDate),
    index("idx_platform_revenue").on(table.sourcePlatform, table.aveenixFee),
  ]
);

export const creatorAnalytics = pgTable(
  "creator_analytics",
  {
    id: varchar("id").primaryKey(),
    creatorId: varchar("creator_id").notNull(),
    
    // Time Period
    period: varchar("period", { length: 20 }).notNull(), // daily|weekly|monthly
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    
    // Performance Metrics
    totalViews: integer("total_views").default(0),
    totalClickThroughs: integer("total_click_throughs").default(0),
    totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0.00"),
    conversionRate: decimal("conversion_rate", { precision: 5, scale: 4 }), // Click-to-sale conversion
    
    // Top Performing Content
    topSolutionId: varchar("top_solution_id"),
    topRevenueSolutionId: varchar("top_revenue_solution_id"),
    
    // Platform Performance
    platformBreakdown: jsonb("platform_breakdown").$type<{
      [platform: string]: {
        clicks: number;
        revenue: number;
        conversions: number;
      };
    }>().default({}),
    
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_creator_period").on(table.creatorId, table.period, table.periodStart),
  ]
);

// AVEENIX Revenue Streams from Creator Economy
export const platformRevenue = pgTable(
  "platform_revenue",
  {
    id: varchar("id").primaryKey(),
    
    // Revenue Type
    revenueType: varchar("revenue_type", { length: 30 }).notNull(),
    // Types:
    // - "creator_commission" (% of creator earnings)
    // - "premium_creator_subscription" (monthly fees for advanced features)
    // - "featured_solution_fee" (pay to promote solutions)
    // - "analytics_premium" (advanced analytics for creators)
    // - "white_label_creator_tools" (licensing creator tools to other platforms)
    
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    creatorId: varchar("creator_id"), // If applicable
    
    // Revenue Details
    description: text("description"),
    metadata: jsonb("metadata").$type<{
      subscriptionTier?: string;
      promotionDuration?: string;
      transactionId?: string;
      billingCycle?: string;
    }>().default({}),
    
    revenueDate: timestamp("revenue_date").defaultNow(),
  },
  (table) => [
    index("idx_revenue_type_date").on(table.revenueType, table.revenueDate),
  ]
);

/**
 * MONETIZATION STRATEGY FOR AVEENIX:
 * 
 * 1. COMMISSION ON CREATOR EARNINGS (5-15%)
 *    - Take a percentage of all creator revenue from affiliate links
 *    - Higher percentage for new creators, lower for established ones
 * 
 * 2. PREMIUM CREATOR SUBSCRIPTIONS ($19-99/month)
 *    - Advanced analytics and insights
 *    - Priority placement in search results
 *    - Custom branding and profile features
 *    - Direct messaging with followers
 * 
 * 3. FEATURED SOLUTION FEES ($5-50 per promotion)
 *    - Creators pay to promote their solutions
 *    - Guaranteed top placement for 24-72 hours
 *    - Cross-platform promotion boost
 * 
 * 4. ENTERPRISE CREATOR TOOLS (B2B Revenue)
 *    - White-label the creator economy system
 *    - License to other platforms and companies
 *    - Custom integrations and features
 * 
 * 5. TRANSACTION PROCESSING FEES
 *    - Small fee on direct sales through the platform
 *    - Payment processing and escrow services
 * 
 * This creates a win-win-win:
 * - Creators earn money for quality solutions
 * - Community gets better, incentivized content
 * - AVEENIX generates sustainable revenue while growing
 */