import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Community questions with intelligent storage levels
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

// Efficient answer storage - only for high-value content
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

// Knowledge base - processed and optimized entries
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

// Search analytics for optimization
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

// Create Zod schemas for validation
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

export const insertCommunityAnswerSchema = createInsertSchema(communityAnswers).extend({
  externalContent: z.object({
    originalPostUrl: z.string(),
    mediaUrls: z.array(z.string()).optional(),
    codeSnippets: z.array(z.string()).optional(),
    attachments: z.array(z.string()).optional(),
  }),
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).extend({
  searchKeywords: z.array(z.string()),
  relatedQuestions: z.array(z.string()).optional(),
  requiredSkills: z.array(z.string()).optional(),
  fullContentLinks: z.object({
    originalQuestion: z.string(),
    bestAnswers: z.array(z.string()),
    discussionThread: z.string(),
    additionalResources: z.array(z.string()).optional(),
  }),
});

// Types
export type CommunityQuestion = typeof communityQuestions.$inferSelect;
export type InsertCommunityQuestion = z.infer<typeof insertCommunityQuestionSchema>;
export type CommunityAnswer = typeof communityAnswers.$inferSelect;
export type InsertCommunityAnswer = z.infer<typeof insertCommunityAnswerSchema>;
export type KnowledgeBaseEntry = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;