import { eq, sql, desc, asc, like, and, or } from "drizzle-orm";
import { db } from "../db.js";
import { categories, platformCategoryMappings, categoryClassificationRules, products, type Category } from "../../shared/schema.js";

export interface PlatformMapping {
  platform: string;
  categoryId: string;
  categoryName: string;
  categoryPath?: string;
  confidence: number;
}

export interface ClassificationResult {
  categoryId: number;
  categoryName: string;
  confidence: number;
  reason: string;
  isAutoClassified: boolean;
}

export class CategoryService {
  // Get all master categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder));
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0] || null;
  }

  // Find master category from platform category
  async findMasterCategoryFromPlatform(platformName: string, platformCategoryId: string, platformCategoryName?: string): Promise<Category | null> {
    const mapping = await db
      .select({
        masterCategoryId: platformCategoryMappings.masterCategoryId,
        confidence: platformCategoryMappings.confidenceScore
      })
      .from(platformCategoryMappings)
      .where(
        and(
          eq(platformCategoryMappings.platformName, platformName),
          or(
            eq(platformCategoryMappings.platformCategoryId, platformCategoryId),
            platformCategoryName ? like(platformCategoryMappings.platformCategoryName, `%${platformCategoryName}%`) : sql`false`
          )
        )
      )
      .orderBy(desc(platformCategoryMappings.confidenceScore))
      .limit(1);

    if (mapping.length === 0) {
      return null;
    }

    const category = await db.select().from(categories).where(eq(categories.id, mapping[0].masterCategoryId)).limit(1);
    return category[0] || null;
  }

  // Smart classify product based on title, description, and brand
  async classifyProduct(productName: string, description?: string, brand?: string, price?: number): Promise<ClassificationResult> {
    const searchText = `${productName} ${description || ''} ${brand || ''}`.toLowerCase();
    
    // Get all classification rules ordered by priority
    const rules = await db
      .select()
      .from(categoryClassificationRules)
      .where(eq(categoryClassificationRules.isActive, true))
      .orderBy(desc(categoryClassificationRules.priority), desc(categoryClassificationRules.confidenceScore));

    let bestMatch: ClassificationResult | null = null;
    let bestConfidence = 0;

    for (const rule of rules) {
      let matches = false;
      let confidence = Number(rule.confidenceScore);

      switch (rule.ruleType) {
        case 'keyword':
          const keywords = rule.pattern.split('|');
          const matchedKeywords = keywords.filter(keyword => searchText.includes(keyword.toLowerCase()));
          if (matchedKeywords.length > 0) {
            matches = true;
            // Boost confidence based on number of matched keywords
            confidence += Math.min(matchedKeywords.length * 5, 20);
          }
          break;

        case 'brand':
          if (brand && rule.pattern.toLowerCase().includes(brand.toLowerCase())) {
            matches = true;
            confidence += 10; // Brand matches are high confidence
          }
          break;

        case 'title_pattern':
          const regex = new RegExp(rule.pattern, 'i');
          if (regex.test(productName)) {
            matches = true;
            confidence += 15; // Title pattern matches are very high confidence
          }
          break;

        case 'price_range':
          if (price && rule.pattern.includes('-')) {
            const [min, max] = rule.pattern.split('-').map(p => parseFloat(p));
            if (price >= min && price <= max) {
              matches = true;
              confidence += 5; // Price range matches are moderate confidence
            }
          }
          break;
      }

      if (matches && confidence > bestConfidence) {
        const category = await db.select().from(categories).where(eq(categories.id, rule.targetCategoryId)).limit(1);
        if (category[0]) {
          bestMatch = {
            categoryId: rule.targetCategoryId,
            categoryName: category[0].name,
            confidence: Math.min(confidence, 100),
            reason: `Matched ${rule.ruleType} rule: "${rule.ruleName}"`,
            isAutoClassified: true
          };
          bestConfidence = confidence;
        }
      }
    }

    // If no rules matched, return Uncategorized
    if (!bestMatch) {
      const uncategorized = await db.select().from(categories).where(eq(categories.slug, 'uncategorized')).limit(1);
      if (uncategorized[0]) {
        return {
          categoryId: uncategorized[0].id,
          categoryName: uncategorized[0].name,
          confidence: 0,
          reason: 'No classification rules matched - requires manual review',
          isAutoClassified: false
        };
      }
    }

    return bestMatch!;
  }

  // Create platform mapping
  async createPlatformMapping(
    masterCategoryId: number,
    platformName: string,
    platformCategoryId: string,
    platformCategoryName: string,
    platformCategoryPath?: string,
    confidence = 100,
    isAutoGenerated = false
  ): Promise<void> {
    await db.insert(platformCategoryMappings).values({
      masterCategoryId,
      platformName,
      platformCategoryId,
      platformCategoryName,
      platformCategoryPath,
      confidenceScore: confidence.toString(),
      isAutoGenerated,
      lastVerified: new Date(),
    });
  }

  // Get all platform mappings for a category
  async getPlatformMappings(masterCategoryId: number): Promise<PlatformMapping[]> {
    const mappings = await db
      .select()
      .from(platformCategoryMappings)
      .where(eq(platformCategoryMappings.masterCategoryId, masterCategoryId));

    return mappings.map(mapping => ({
      platform: mapping.platformName,
      categoryId: mapping.platformCategoryId,
      categoryName: mapping.platformCategoryName,
      categoryPath: mapping.platformCategoryPath || undefined,
      confidence: Number(mapping.confidenceScore)
    }));
  }

  // Update product counts for all categories
  async updateCategoryCounts(): Promise<void> {
    const counts = await db
      .select({
        category: products.category,
        count: sql<number>`count(*)`.as('count')
      })
      .from(products)
      .groupBy(products.category);

    // Reset all counts to 0
    await db.update(categories).set({ productCount: 0 });

    // Update counts for categories with products
    for (const countResult of counts) {
      const category = await db.select().from(categories).where(eq(categories.name, countResult.category)).limit(1);
      if (category[0]) {
        await db.update(categories).set({ productCount: countResult.count }).where(eq(categories.id, category[0].id));
      }
    }
  }

  // Create classification rule
  async createClassificationRule(
    ruleName: string,
    ruleType: 'keyword' | 'brand' | 'title_pattern' | 'price_range',
    pattern: string,
    targetCategoryId: number,
    priority = 50,
    confidence = 75
  ): Promise<void> {
    await db.insert(categoryClassificationRules).values({
      ruleName,
      ruleType,
      pattern,
      targetCategoryId,
      priority,
      confidenceScore: confidence.toString(),
      isActive: true
    });
  }

  // Get classification stats
  async getClassificationStats(): Promise<{
    totalRules: number;
    totalMappings: number;
    categoriesWithMappings: number;
    averageConfidence: number;
  }> {
    const [rulesCount] = await db.select({ count: sql<number>`count(*)` }).from(categoryClassificationRules);
    const [mappingsCount] = await db.select({ count: sql<number>`count(*)` }).from(platformCategoryMappings);
    
    const [categoriesWithMappings] = await db
      .select({ count: sql<number>`count(distinct master_category_id)` })
      .from(platformCategoryMappings);

    const [avgConfidence] = await db
      .select({ avg: sql<number>`avg(confidence_score)` })
      .from(platformCategoryMappings);

    return {
      totalRules: rulesCount.count,
      totalMappings: mappingsCount.count,
      categoriesWithMappings: categoriesWithMappings.count,
      averageConfidence: Math.round(avgConfidence.avg || 0)
    };
  }
}

export const categoryService = new CategoryService();