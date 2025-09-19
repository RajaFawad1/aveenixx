CREATE TYPE "public"."address_type" AS ENUM('shipping', 'billing', 'both');--> statement-breakpoint
CREATE TYPE "public"."affiliate_platform" AS ENUM('amazon', 'aliexpress', 'walmart', 'ebay', 'shopify');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('preview', 'pricing', 'pending', 'approved', 'rejected', 'published');--> statement-breakpoint
CREATE TYPE "public"."automation_condition_type" AS ENUM('price_range', 'category', 'rating', 'brand', 'description_length', 'stock_level', 'product_type', 'source_platform', 'keyword_match', 'exclude_keyword');--> statement-breakpoint
CREATE TYPE "public"."automation_rule_type" AS ENUM('auto_download', 'preview_to_pending', 'pending_to_approved', 'approved_to_published', 'auto_reject');--> statement-breakpoint
CREATE TYPE "public"."movement_type" AS ENUM('in', 'out', 'transfer', 'adjustment', 'return', 'loss');--> statement-breakpoint
CREATE TYPE "public"."notification_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('order', 'message', 'system', 'promotion', 'security');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('affiliate', 'dropship', 'physical', 'consumable', 'service', 'digital', 'custom', 'multivendor');--> statement-breakpoint
CREATE TYPE "public"."review_moderation_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."source_platform" AS ENUM('aveenix', 'amazon', 'aliexpress', 'walmart', 'woocommerce');--> statement-breakpoint
CREATE TYPE "public"."stock_status" AS ENUM('in_stock', 'low_stock', 'out_of_stock', 'overstock');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin', 'manager', 'support', 'vendor');--> statement-breakpoint
CREATE TYPE "public"."vendor_status" AS ENUM('pending', 'approved', 'rejected', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_status" AS ENUM('unfulfilled', 'shipped', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('stripe', 'paypal', 'manual');--> statement-breakpoint
CREATE TYPE "public"."return_status" AS ENUM('requested', 'approved', 'rejected', 'completed');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"company" text,
	"address1" text NOT NULL,
	"address2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"country" text NOT NULL,
	"phone" text,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "affiliate_commission_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" "affiliate_platform" DEFAULT 'amazon' NOT NULL,
	"category_name" text NOT NULL,
	"category_path" text,
	"commission_rate" numeric(5, 2) NOT NULL,
	"is_promotional" boolean DEFAULT false,
	"promotional_rate" numeric(5, 2),
	"promotional_start_date" timestamp,
	"promotional_end_date" timestamp,
	"is_active" boolean DEFAULT true,
	"last_updated" timestamp DEFAULT now(),
	"source" text DEFAULT 'amazon_associates',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "amazon_commission_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"commission_rate" numeric(5, 2) NOT NULL,
	"rate_source" varchar(100) DEFAULT 'amazon_official',
	"last_updated" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "amazon_commission_rates_category_name_unique" UNIQUE("category_name")
);
--> statement-breakpoint
CREATE TABLE "attribute_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"attribute_id" integer NOT NULL,
	"value" text NOT NULL,
	"color_code" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "automation_conditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" integer NOT NULL,
	"condition_type" "automation_condition_type" NOT NULL,
	"operator" text NOT NULL,
	"value" text NOT NULL,
	"logical_operator" text DEFAULT 'AND',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "automation_execution_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" integer NOT NULL,
	"execution_status" text NOT NULL,
	"products_processed" integer DEFAULT 0,
	"products_affected" integer DEFAULT 0,
	"error_message" text,
	"execution_time_ms" integer,
	"source_status" text,
	"target_status" text,
	"product_ids" jsonb,
	"executed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "automation_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"rule_type" "automation_rule_type" NOT NULL,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 50,
	"batch_size" integer DEFAULT 10,
	"execution_interval" integer DEFAULT 30,
	"max_daily_executions" integer DEFAULT 100,
	"enable_schedule" boolean DEFAULT false,
	"schedule_start" text,
	"schedule_end" text,
	"schedule_days" jsonb,
	"execution_count" integer DEFAULT 0,
	"last_executed_at" timestamp,
	"successful_executions" integer DEFAULT 0,
	"failed_executions" integer DEFAULT 0,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo_url" text,
	"website_url" text,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"product_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "brands_name_unique" UNIQUE("name"),
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	"is_hot" boolean DEFAULT false,
	"parent_id" integer,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"product_count" integer DEFAULT 0,
	"platform_mapping" jsonb,
	"is_auto_created" boolean DEFAULT false,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "category_classification_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_name" text NOT NULL,
	"rule_type" text NOT NULL,
	"pattern" text NOT NULL,
	"target_category_id" integer NOT NULL,
	"priority" integer DEFAULT 50,
	"confidence_score" numeric(5, 2) DEFAULT '75',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "category_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"aveenix_category_id" integer NOT NULL,
	"source_platform" "source_platform" NOT NULL,
	"external_category_id" text NOT NULL,
	"external_category_name" text NOT NULL,
	"confidence" numeric(3, 2) DEFAULT '1.0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "challenge_participation" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"challenge_id" varchar NOT NULL,
	"submission_id" varchar,
	"rank" integer,
	"prize_amount" numeric DEFAULT '0',
	"status" varchar DEFAULT 'participating',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_activities" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"activity_type" varchar NOT NULL,
	"target_id" varchar,
	"points" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_answers" (
	"id" varchar PRIMARY KEY NOT NULL,
	"question_id" varchar NOT NULL,
	"answer_text" text NOT NULL,
	"answer_summary" varchar(500),
	"platform" varchar(20) NOT NULL,
	"author_name" varchar(100),
	"author_handle" varchar(100),
	"author_reputation" integer,
	"external_content" jsonb NOT NULL,
	"upvotes" integer DEFAULT 0,
	"downvotes" integer DEFAULT 0,
	"engagement_score" integer DEFAULT 0,
	"is_verified" boolean DEFAULT false,
	"is_best_answer" boolean DEFAULT false,
	"answer_type" varchar(20) NOT NULL,
	"technical_level" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_questions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"question_text" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"subcategory" varchar(50),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"problem_solving_score" integer NOT NULL,
	"business_value" integer NOT NULL,
	"community_impact" integer NOT NULL,
	"searchability" integer NOT NULL,
	"complexity" varchar(20) NOT NULL,
	"storage_level" varchar(20) NOT NULL,
	"retention_days" integer NOT NULL,
	"index_priority" varchar(10) NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_solved" boolean DEFAULT false,
	"solved_at" timestamp,
	"best_answer_id" varchar,
	"external_links" jsonb DEFAULT '{}'::jsonb,
	"platform_posts" jsonb DEFAULT '{}'::jsonb,
	"total_responses" integer DEFAULT 0,
	"total_views" integer DEFAULT 0,
	"total_engagement" integer DEFAULT 0,
	"quality_rating" numeric(3, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "community_rewards" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"reward_type" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"credits" integer DEFAULT 0,
	"source_id" varchar,
	"description" text,
	"status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"bio" text,
	"profile_image_url" varchar,
	"total_solutions" integer DEFAULT 0,
	"total_views" integer DEFAULT 0,
	"total_earnings" numeric(10, 2) DEFAULT '0.00',
	"average_rating" numeric(3, 2) DEFAULT '0.00',
	"creator_level" varchar(20) DEFAULT 'rookie',
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"expertise_tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creator_solutions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"question_id" varchar NOT NULL,
	"creator_id" varchar NOT NULL,
	"solution_title" varchar(200) NOT NULL,
	"solution_content" text NOT NULL,
	"solution_type" varchar(30) NOT NULL,
	"media_urls" jsonb DEFAULT '{}'::jsonb,
	"monetization_links" jsonb DEFAULT '{}'::jsonb,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"saves" integer DEFAULT 0,
	"click_throughs" integer DEFAULT 0,
	"revenue" numeric(10, 2) DEFAULT '0.00',
	"rating" numeric(3, 2),
	"rating_count" integer DEFAULT 0,
	"is_verified_solution" boolean DEFAULT false,
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dropship_markup_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"markup_percentage" numeric(5, 2) NOT NULL,
	"min_margin" numeric(5, 2) DEFAULT '30.00',
	"max_margin" numeric(5, 2) DEFAULT '100.00',
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 1,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "dropship_markup_rates_category_name_unique" UNIQUE("category_name")
);
--> statement-breakpoint
CREATE TABLE "giftcards" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(32) NOT NULL,
	"initial_amount_cents" integer NOT NULL,
	"remaining_amount_cents" integer NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"user_id" varchar(64),
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "giftcards_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "import_quality_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"import_batch" varchar(255),
	"source" varchar(100) NOT NULL,
	"total_products" integer DEFAULT 0,
	"validation_failures" integer DEFAULT 0,
	"duplicates_detected" integer DEFAULT 0,
	"filtered_products" integer DEFAULT 0,
	"average_quality_score" integer DEFAULT 0,
	"import_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "import_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_platform" "source_platform" NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"total_products" integer DEFAULT 0,
	"processed_products" integer DEFAULT 0,
	"successful_imports" integer DEFAULT 0,
	"failed_imports" integer DEFAULT 0,
	"error_log" jsonb,
	"import_config" jsonb,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_by" integer
);
--> statement-breakpoint
CREATE TABLE "inventory_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"location_id" integer,
	"alert_type" text NOT NULL,
	"severity" text DEFAULT 'medium',
	"title" text NOT NULL,
	"message" text NOT NULL,
	"current_stock" integer,
	"threshold_value" integer,
	"suggested_action" text,
	"is_active" boolean DEFAULT true,
	"is_read" boolean DEFAULT false,
	"resolved_at" timestamp,
	"resolved_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"location_id" integer NOT NULL,
	"current_stock" integer DEFAULT 0 NOT NULL,
	"reserved_stock" integer DEFAULT 0,
	"available_stock" integer DEFAULT 0 NOT NULL,
	"minimum_stock" integer DEFAULT 10,
	"maximum_stock" integer DEFAULT 1000,
	"reorder_point" integer DEFAULT 20,
	"reorder_quantity" integer DEFAULT 100,
	"unit_cost" numeric(10, 2),
	"average_cost" numeric(10, 2),
	"total_value" numeric(10, 2),
	"stock_status" "stock_status" DEFAULT 'in_stock',
	"last_count_date" timestamp,
	"last_movement_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text,
	"city" text,
	"state" text,
	"country" text,
	"zip_code" text,
	"contact_person" text,
	"contact_phone" text,
	"contact_email" text,
	"is_active" boolean DEFAULT true,
	"capacity" integer,
	"current_stock" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "knowledge_base" (
	"id" varchar PRIMARY KEY NOT NULL,
	"question_id" varchar NOT NULL,
	"title" varchar(200) NOT NULL,
	"processed_answer" text NOT NULL,
	"quick_solution" varchar(300),
	"search_keywords" jsonb NOT NULL,
	"related_questions" jsonb DEFAULT '[]'::jsonb,
	"difficulty_level" varchar(20),
	"time_to_implement" varchar(50),
	"required_skills" jsonb DEFAULT '[]'::jsonb,
	"confidence_score" numeric(5, 2),
	"usage_count" integer DEFAULT 0,
	"success_rate" numeric(5, 2),
	"full_content_links" jsonb NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" "notification_type" NOT NULL,
	"priority" "notification_priority" DEFAULT 'medium',
	"title" text NOT NULL,
	"message" text NOT NULL,
	"icon" text,
	"action_url" text,
	"is_read" boolean DEFAULT false,
	"is_global" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"product_name" text NOT NULL,
	"product_image" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"user_id" integer NOT NULL,
	"status" "order_status" DEFAULT 'pending',
	"payment_status" "payment_status" DEFAULT 'pending',
	"subtotal" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"shipping_amount" numeric(10, 2) DEFAULT '0',
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"total_amount" numeric(10, 2) NOT NULL,
	"shipping_address_id" integer NOT NULL,
	"billing_address_id" integer NOT NULL,
	"shipping_method" text,
	"tracking_number" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "platform_category_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"master_category_id" integer NOT NULL,
	"platform_name" text NOT NULL,
	"platform_category_id" text NOT NULL,
	"platform_category_name" text NOT NULL,
	"platform_category_path" text,
	"confidence_score" numeric(5, 2) DEFAULT '100',
	"is_auto_generated" boolean DEFAULT false,
	"last_verified" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "platform_sync_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"source_platform" "source_platform" NOT NULL,
	"sync_type" text NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"status" text NOT NULL,
	"error_message" text,
	"synced_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_attribute_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"attribute_id" integer NOT NULL,
	"value_id" integer,
	"custom_value" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_attributes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"is_required" boolean DEFAULT false,
	"is_filterable" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"category_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "product_attributes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_markup_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"custom_markup_percentage" numeric(5, 2) NOT NULL,
	"reason" text,
	"set_by" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "product_markup_overrides_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "product_qa" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" varchar(255) NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_helpful" boolean DEFAULT true NOT NULL,
	"helpful_votes" integer DEFAULT 0 NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255),
	"customer_name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "product_quality_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" varchar(255) NOT NULL,
	"validation_score" integer DEFAULT 0,
	"duplicate_risk" integer DEFAULT 0,
	"content_quality_score" integer DEFAULT 0,
	"filtering_flags" text[] DEFAULT '{}',
	"performance_score" integer DEFAULT 0,
	"rejection_reason" varchar(255),
	"quality_checked_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	"category" text NOT NULL,
	"brand" text,
	"image_url" text NOT NULL,
	"image_url_2" text,
	"image_url_3" text,
	"image_url_4" text,
	"short_description" text,
	"is_featured" boolean DEFAULT false,
	"sale_price" numeric(10, 2),
	"sale_start_date" timestamp,
	"sale_end_date" timestamp,
	"total_sales" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"sales_count" integer DEFAULT 0,
	"rating" numeric(2, 1) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	"is_new" boolean DEFAULT false,
	"is_bestseller" boolean DEFAULT false,
	"is_on_sale" boolean DEFAULT false,
	"discount_percentage" integer DEFAULT 0,
	"source_platform" "source_platform" DEFAULT 'aveenix',
	"product_type" "product_type" DEFAULT 'physical',
	"external_id" text,
	"affiliate_url" text,
	"category_mapping" jsonb,
	"platform_specific_data" jsonb,
	"product_code" text,
	"sku" text,
	"barcode" text,
	"reference" text,
	"manufacturer" text,
	"product_tags" jsonb,
	"seo_field" text,
	"notes" text,
	"stock_quantity" integer DEFAULT 0,
	"is_in_stock" boolean DEFAULT true,
	"last_synced_at" timestamp,
	"sync_status" text DEFAULT 'active',
	"original_currency" text DEFAULT 'USD',
	"exchange_rate" numeric(10, 6) DEFAULT '1.0',
	"cost_price" numeric(10, 2),
	"vendor_id" integer,
	"creator_id" integer,
	"commission_rate" numeric(5, 2) DEFAULT '0',
	"approval_status" "approval_status" DEFAULT 'preview',
	"approved_by" integer,
	"approved_at" timestamp,
	"rejection_reason" text,
	"rejection_date" timestamp,
	"automation_action" text,
	"viability_score" numeric(5, 2) DEFAULT '0',
	"competitive_score" numeric(5, 2) DEFAULT '0',
	"profit_margin_score" numeric(5, 2) DEFAULT '0',
	"market_trend_score" numeric(5, 2) DEFAULT '0',
	"overall_intelligence_score" numeric(5, 2) DEFAULT '0',
	"competitor_prices" jsonb,
	"suggested_price" numeric(10, 2),
	"price_optimization_reason" text,
	"ai_suggested_categories" jsonb,
	"category_confidence_score" numeric(5, 2) DEFAULT '0',
	"google_trends_score" numeric(5, 2) DEFAULT '0',
	"amazon_bestseller_rank" integer,
	"market_demand_level" text DEFAULT 'unknown',
	"seasonality_pattern" jsonb,
	"intelligence_last_updated" timestamp,
	"intelligence_analysis_version" text DEFAULT '1.0',
	"data_sources_used" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"minimum_amount" numeric(10, 2),
	"max_uses" integer,
	"current_uses" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "quality_control_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"setting_key" varchar(100) NOT NULL,
	"setting_value" text NOT NULL,
	"category_id" integer,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "quality_control_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "redemptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"type" varchar(16) NOT NULL,
	"amount_cents" integer NOT NULL,
	"fee_cents" integer DEFAULT 0 NOT NULL,
	"currency" varchar(8) DEFAULT 'USD' NOT NULL,
	"target" text,
	"status" varchar(16) DEFAULT 'requested' NOT NULL,
	"provider" varchar(16) DEFAULT 'internal' NOT NULL,
	"provider_ref" varchar(128),
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "referral_tracking" (
	"id" varchar PRIMARY KEY NOT NULL,
	"referrer_id" varchar NOT NULL,
	"referred_id" varchar NOT NULL,
	"referral_code" varchar NOT NULL,
	"status" varchar DEFAULT 'pending',
	"total_earnings" numeric DEFAULT '0',
	"commissions_earned" numeric DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "review_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"vote_type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"user_id" integer,
	"external_id" text,
	"source_platform" "source_platform" DEFAULT 'aveenix',
	"reviewer_name" text NOT NULL,
	"reviewer_email" text,
	"rating" integer NOT NULL,
	"title" text,
	"content" text NOT NULL,
	"is_verified_purchase" boolean DEFAULT false,
	"helpful_count" integer DEFAULT 0,
	"unhelpful_count" integer DEFAULT 0,
	"review_date" timestamp NOT NULL,
	"moderation_status" "review_moderation_status" DEFAULT 'pending',
	"moderated_by" integer,
	"moderated_at" timestamp,
	"moderation_reason" text,
	"platform_specific_data" jsonb,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rewards_ledger" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"source_type" varchar(24) NOT NULL,
	"source_id" varchar(128),
	"amount_cents" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"status" varchar(16) DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "search_analytics" (
	"id" varchar PRIMARY KEY NOT NULL,
	"search_query" varchar(500) NOT NULL,
	"results_found" integer NOT NULL,
	"clicked_result" varchar,
	"user_satisfaction" integer,
	"search_date" timestamp DEFAULT now(),
	"user_id" varchar
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"location_id" integer NOT NULL,
	"movement_type" "movement_type" NOT NULL,
	"quantity" integer NOT NULL,
	"unit_cost" numeric(10, 2),
	"total_cost" numeric(10, 2),
	"reference_type" text,
	"reference_id" text,
	"reason" text,
	"notes" text,
	"stock_before" integer NOT NULL,
	"stock_after" integer NOT NULL,
	"performed_by" integer,
	"performed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"from_location_id" integer NOT NULL,
	"to_location_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"reason" text,
	"notes" text,
	"status" text DEFAULT 'pending',
	"requested_by" integer NOT NULL,
	"approved_by" integer,
	"completed_by" integer,
	"requested_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"shipped_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"points" integer DEFAULT 0 NOT NULL,
	"amount_cents" integer DEFAULT 0 NOT NULL,
	"verification" varchar(16) DEFAULT 'event' NOT NULL,
	"event_key" varchar(64),
	"frequency" varchar(16) DEFAULT 'once' NOT NULL,
	"cooldown_hours" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "address_type" DEFAULT 'shipping',
	"label" text NOT NULL,
	"full_name" text NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"country" text DEFAULT 'US' NOT NULL,
	"phone" text,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_id" integer,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"file_type" text NOT NULL,
	"download_url" text NOT NULL,
	"file_size" integer,
	"mime_type" text,
	"download_count" integer DEFAULT 0,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"external_id" text,
	"card_last4" text,
	"card_brand" text,
	"card_exp_month" integer,
	"card_exp_year" integer,
	"label" text NOT NULL,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"verified_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"task_id" integer NOT NULL,
	"status" varchar(16) DEFAULT 'eligible' NOT NULL,
	"completed_at" timestamp,
	"next_eligible_at" timestamp,
	"last_event_id" varchar(128)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'customer',
	"first_name" text,
	"last_name" text,
	"phone" text,
	"is_active" boolean DEFAULT true,
	"date_of_birth" text,
	"gender" text,
	"bio" text,
	"avatar_url" text,
	"email_verified" boolean DEFAULT false,
	"phone_verified" boolean DEFAULT false,
	"two_factor_enabled" boolean DEFAULT false,
	"preferred_country" text DEFAULT 'US',
	"preferred_language" text DEFAULT 'en',
	"preferred_currency" text DEFAULT 'USD',
	"timezone" text DEFAULT 'America/New_York',
	"theme" text DEFAULT 'light',
	"color_theme" text DEFAULT 'yellow',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_name" text NOT NULL,
	"business_type" text NOT NULL,
	"business_description" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"country" text NOT NULL,
	"tax_id" text NOT NULL,
	"website" text,
	"status" "vendor_status" DEFAULT 'pending',
	"commission_rate" numeric(5, 2) DEFAULT '15.00',
	"total_sales" numeric(15, 2) DEFAULT '0.00',
	"total_orders" integer DEFAULT 0,
	"rating" numeric(2, 1) DEFAULT '0.0',
	"review_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(32) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"used_at" timestamp,
	CONSTRAINT "vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sales_order_notes" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"order_id" varchar(50) NOT NULL,
	"text" text NOT NULL,
	"created_by" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_payments" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"order_id" varchar(50) NOT NULL,
	"amount_cents" integer NOT NULL,
	"method" "payment_method" NOT NULL,
	"status" varchar(50) NOT NULL,
	"external_id" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_returns" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"order_id" varchar(50) NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"reason" text,
	"lines" jsonb,
	"status" "return_status" DEFAULT 'requested' NOT NULL,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_shipments" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"order_id" varchar(50) NOT NULL,
	"carrier" varchar(100) NOT NULL,
	"tracking" varchar(255),
	"shipped_at" timestamp DEFAULT now() NOT NULL,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_conditions" ADD CONSTRAINT "automation_conditions_rule_id_automation_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."automation_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_execution_logs" ADD CONSTRAINT "automation_execution_logs_rule_id_automation_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."automation_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_classification_rules" ADD CONSTRAINT "category_classification_rules_target_category_id_categories_id_fk" FOREIGN KEY ("target_category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_location_id_inventory_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_alerts" ADD CONSTRAINT "inventory_alerts_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_location_id_inventory_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_category_mappings" ADD CONSTRAINT "platform_category_mappings_master_category_id_categories_id_fk" FOREIGN KEY ("master_category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attribute_id_product_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."product_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_value_id_attribute_values_id_fk" FOREIGN KEY ("value_id") REFERENCES "public"."attribute_values"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_moderated_by_users_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_location_id_inventory_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_location_id_inventory_locations_id_fk" FOREIGN KEY ("from_location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_location_id_inventory_locations_id_fk" FOREIGN KEY ("to_location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_completed_by_users_id_fk" FOREIGN KEY ("completed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_downloads" ADD CONSTRAINT "user_downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_downloads" ADD CONSTRAINT "user_downloads_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_payment_methods" ADD CONSTRAINT "user_payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_notes" ADD CONSTRAINT "sales_order_notes_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_payments" ADD CONSTRAINT "sales_payments_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_returns" ADD CONSTRAINT "sales_returns_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_shipments" ADD CONSTRAINT "sales_shipments_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "affiliate_rates_platform_category_idx" ON "affiliate_commission_rates" USING btree ("platform","category_name");--> statement-breakpoint
CREATE INDEX "affiliate_rates_category_path_idx" ON "affiliate_commission_rates" USING btree ("category_path");--> statement-breakpoint
CREATE INDEX "affiliate_rates_is_active_idx" ON "affiliate_commission_rates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "attribute_values_attribute_id_idx" ON "attribute_values" USING btree ("attribute_id");--> statement-breakpoint
CREATE INDEX "automation_conditions_rule_id_idx" ON "automation_conditions" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "automation_conditions_type_idx" ON "automation_conditions" USING btree ("condition_type");--> statement-breakpoint
CREATE INDEX "automation_logs_rule_id_idx" ON "automation_execution_logs" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "automation_logs_executed_at_idx" ON "automation_execution_logs" USING btree ("executed_at");--> statement-breakpoint
CREATE INDEX "automation_logs_status_idx" ON "automation_execution_logs" USING btree ("execution_status");--> statement-breakpoint
CREATE INDEX "automation_rules_type_idx" ON "automation_rules" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "automation_rules_active_idx" ON "automation_rules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "automation_rules_priority_idx" ON "automation_rules" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "classification_rules_type_idx" ON "category_classification_rules" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "classification_rules_priority_idx" ON "category_classification_rules" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "classification_rules_target_category_idx" ON "category_classification_rules" USING btree ("target_category_id");--> statement-breakpoint
CREATE INDEX "category_mappings_platform_category_idx" ON "category_mappings" USING btree ("source_platform","external_category_id");--> statement-breakpoint
CREATE INDEX "category_mappings_aveenix_category_idx" ON "category_mappings" USING btree ("aveenix_category_id");--> statement-breakpoint
CREATE INDEX "idx_question_quality" ON "community_answers" USING btree ("question_id","engagement_score");--> statement-breakpoint
CREATE INDEX "idx_best_answers" ON "community_answers" USING btree ("is_best_answer","is_verified");--> statement-breakpoint
CREATE INDEX "idx_platform" ON "community_answers" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "idx_category_score" ON "community_questions" USING btree ("category","problem_solving_score");--> statement-breakpoint
CREATE INDEX "idx_storage_level" ON "community_questions" USING btree ("storage_level","is_active");--> statement-breakpoint
CREATE INDEX "idx_expiry" ON "community_questions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_tags" ON "community_questions" USING btree ("tags");--> statement-breakpoint
CREATE INDEX "idx_creator_level" ON "creator_profiles" USING btree ("creator_level");--> statement-breakpoint
CREATE INDEX "idx_verified" ON "creator_profiles" USING btree ("is_verified");--> statement-breakpoint
CREATE INDEX "idx_expertise" ON "creator_profiles" USING btree ("expertise_tags");--> statement-breakpoint
CREATE INDEX "idx_question_creator" ON "creator_solutions" USING btree ("question_id","creator_id");--> statement-breakpoint
CREATE INDEX "idx_solution_type" ON "creator_solutions" USING btree ("solution_type");--> statement-breakpoint
CREATE INDEX "idx_performance" ON "creator_solutions" USING btree ("views","revenue");--> statement-breakpoint
CREATE INDEX "idx_status" ON "creator_solutions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_alert_active" ON "inventory_alerts" USING btree ("is_active","severity");--> statement-breakpoint
CREATE INDEX "idx_product_alerts" ON "inventory_alerts" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_alert_type" ON "inventory_alerts" USING btree ("alert_type");--> statement-breakpoint
CREATE INDEX "idx_product_location" ON "inventory_items" USING btree ("product_id","location_id");--> statement-breakpoint
CREATE INDEX "idx_stock_status" ON "inventory_items" USING btree ("stock_status");--> statement-breakpoint
CREATE INDEX "idx_low_stock" ON "inventory_items" USING btree ("current_stock","minimum_stock");--> statement-breakpoint
CREATE INDEX "idx_search_keywords" ON "knowledge_base" USING btree ("search_keywords");--> statement-breakpoint
CREATE INDEX "idx_confidence" ON "knowledge_base" USING btree ("confidence_score");--> statement-breakpoint
CREATE INDEX "idx_usage" ON "knowledge_base" USING btree ("usage_count");--> statement-breakpoint
CREATE INDEX "idx_user_unread" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "idx_created_at" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_type_priority" ON "notifications" USING btree ("type","priority");--> statement-breakpoint
CREATE INDEX "platform_mappings_master_category_idx" ON "platform_category_mappings" USING btree ("master_category_id");--> statement-breakpoint
CREATE INDEX "platform_mappings_platform_idx" ON "platform_category_mappings" USING btree ("platform_name");--> statement-breakpoint
CREATE INDEX "unique_platform_mapping" ON "platform_category_mappings" USING btree ("platform_name","platform_category_id");--> statement-breakpoint
CREATE INDEX "product_attributes_product_id_idx" ON "product_attribute_values" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_attributes_attribute_id_idx" ON "product_attribute_values" USING btree ("attribute_id");--> statement-breakpoint
CREATE INDEX "unique_product_attribute" ON "product_attribute_values" USING btree ("product_id","attribute_id");--> statement-breakpoint
CREATE INDEX "attributes_slug_idx" ON "product_attributes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "attributes_category_id_idx" ON "product_attributes" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_source_platform_idx" ON "products" USING btree ("source_platform");--> statement-breakpoint
CREATE INDEX "products_product_type_idx" ON "products" USING btree ("product_type");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_external_id_idx" ON "products" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "products_vendor_id_idx" ON "products" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "products_approval_status_idx" ON "products" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "products_approved_by_idx" ON "products" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "review_votes_review_user_idx" ON "review_votes" USING btree ("review_id","user_id");--> statement-breakpoint
CREATE INDEX "review_votes_user_id_idx" ON "review_votes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reviews_product_id_idx" ON "reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "reviews_user_id_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reviews_source_platform_idx" ON "reviews" USING btree ("source_platform");--> statement-breakpoint
CREATE INDEX "reviews_external_id_idx" ON "reviews" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "reviews_rating_idx" ON "reviews" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "reviews_moderation_status_idx" ON "reviews" USING btree ("moderation_status");--> statement-breakpoint
CREATE INDEX "idx_search_query" ON "search_analytics" USING btree ("search_query");--> statement-breakpoint
CREATE INDEX "idx_search_date" ON "search_analytics" USING btree ("search_date");--> statement-breakpoint
CREATE INDEX "idx_product_movement" ON "stock_movements" USING btree ("product_id","performed_at");--> statement-breakpoint
CREATE INDEX "idx_movement_type" ON "stock_movements" USING btree ("movement_type");--> statement-breakpoint
CREATE INDEX "idx_reference" ON "stock_movements" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "idx_transfer_status" ON "stock_transfers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_product_transfer" ON "stock_transfers" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_locations_transfer" ON "stock_transfers" USING btree ("from_location_id","to_location_id");--> statement-breakpoint
CREATE INDEX "user_addresses_user_default_idx" ON "user_addresses" USING btree ("user_id","is_default");--> statement-breakpoint
CREATE INDEX "user_addresses_user_active_idx" ON "user_addresses" USING btree ("user_id","is_active");--> statement-breakpoint
CREATE INDEX "user_downloads_user_id_idx" ON "user_downloads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_downloads_order_id_idx" ON "user_downloads" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "user_downloads_file_type_idx" ON "user_downloads" USING btree ("file_type");--> statement-breakpoint
CREATE INDEX "user_payment_methods_user_id_idx" ON "user_payment_methods" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_payment_methods_provider_idx" ON "user_payment_methods" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "user_payment_methods_user_default_idx" ON "user_payment_methods" USING btree ("user_id","is_default");