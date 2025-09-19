import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { dropshipMarkupRates, productMarkupOverrides, type DropshipMarkupRate, type ProductMarkupOverride } from "@shared/schema";

export interface DropshipMarkupCalculation {
  productId: string;
  productName: string;
  costPrice: number;
  category: string;
  markupPercentage: number;
  sellPrice: number;
  profitAmount: number;
  profitMargin: number;
  source: 'category' | 'individual' | 'default';
  appliedRule?: string;
}

export class DropshipMarkupService {
  // Industry-standard dropship markup rates by category
  private static readonly DEFAULT_MARKUP_RATES: Record<string, number> = {
    // Electronics & Technology - Lower margins due to competition
    'Electronics': 35.00,
    'Cell Phones & Accessories': 30.00,
    'Computers': 25.00,
    'Video Games': 30.00,
    'Camera & Photo': 40.00,
    
    // Fashion & Beauty - Higher margins
    'Clothing, Shoes & Jewelry': 60.00,
    'Luxury Beauty': 70.00,
    'Beauty & Personal Care': 55.00,
    'Handbags & Accessories': 65.00,
    
    // Home & Garden - Medium margins
    'Home & Kitchen': 45.00,
    'Home Improvement': 40.00,
    'Patio, Lawn & Garden': 50.00,
    'Furniture': 55.00,
    
    // Sports & Outdoors - Medium margins
    'Sports & Outdoors': 45.00,
    'Outdoor Recreation': 50.00,
    
    // Books & Media - Lower margins
    'Books': 35.00,
    'Movies & TV': 30.00,
    'Music': 35.00,
    
    // Automotive - Variable margins
    'Automotive Parts & Accessories': 40.00,
    'Automotive Tools & Equipment': 45.00,
    
    // Health & Household - Higher margins
    'Health & Household': 50.00,
    'Baby Products': 55.00,
    
    // Toys & Games - Higher margins
    'Toys & Games': 50.00,
    
    // Office & Business - Medium margins
    'Office & Business': 40.00,
    'Industrial & Scientific': 35.00,
    
    // Default fallback rate
    'default': 50.00,
  };

  /**
   * Get markup percentage for a category or product
   */
  async getMarkupPercentage(category: string, productId?: string): Promise<{
    percentage: number;
    source: 'category' | 'individual' | 'default';
    appliedRule?: string;
  }> {
    try {
      // 1. Check for individual product override first (highest priority)
      if (productId) {
        const [productOverride] = await db
          .select()
          .from(productMarkupOverrides)
          .where(and(
            eq(productMarkupOverrides.productId, productId),
            eq(productMarkupOverrides.isActive, true)
          ));

        if (productOverride) {
          return {
            percentage: parseFloat(productOverride.customMarkupPercentage),
            source: 'individual',
            appliedRule: `Individual override: ${productOverride.reason || 'Custom rate'}`
          };
        }
      }

      // 2. Check for category-based rate
      const [categoryRate] = await db
        .select()
        .from(dropshipMarkupRates)
        .where(and(
          eq(dropshipMarkupRates.categoryName, category),
          eq(dropshipMarkupRates.isActive, true)
        ));

      if (categoryRate) {
        return {
          percentage: parseFloat(categoryRate.markupPercentage),
          source: 'category',
          appliedRule: `Category rate for ${category}`
        };
      }

      // 3. Use default rate from predefined rates
      const defaultRate = DropshipMarkupService.DEFAULT_MARKUP_RATES[category] || 
                         DropshipMarkupService.DEFAULT_MARKUP_RATES.default;

      return {
        percentage: defaultRate,
        source: 'default',
        appliedRule: `Default industry rate for ${category}`
      };

    } catch (error) {
      console.error('Error getting markup percentage:', error);
      return {
        percentage: 50.00,
        source: 'default',
        appliedRule: 'Fallback rate due to error'
      };
    }
  }

  /**
   * Calculate dropship pricing for a product
   */
  async calculatePricing(
    productId: string,
    productName: string,
    costPrice: number,
    category: string
  ): Promise<DropshipMarkupCalculation> {
    const markupInfo = await this.getMarkupPercentage(category, productId);
    
    const sellPrice = costPrice * (1 + markupInfo.percentage / 100);
    const profitAmount = sellPrice - costPrice;
    const profitMargin = (profitAmount / costPrice) * 100;

    return {
      productId,
      productName,
      costPrice,
      category,
      markupPercentage: markupInfo.percentage,
      sellPrice: Math.round(sellPrice * 100) / 100, // Round to 2 decimal places
      profitAmount: Math.round(profitAmount * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      source: markupInfo.source,
      appliedRule: markupInfo.appliedRule
    };
  }

  /**
   * Seed default markup rates for categories
   */
  async seedDefaultRates(): Promise<void> {
    try {
      console.log('🔄 Seeding default dropship markup rates...');

      const ratesToSeed = Object.entries(DropshipMarkupService.DEFAULT_MARKUP_RATES)
        .filter(([category]) => category !== 'default') // Skip default entry
        .map(([categoryName, markupPercentage]) => ({
          categoryName,
          markupPercentage: markupPercentage.toString(),
          notes: `Industry standard markup rate for ${categoryName}`,
          priority: 1
        }));

      // Insert rates, ignoring conflicts (if already exist)
      for (const rate of ratesToSeed) {
        try {
          await db.insert(dropshipMarkupRates)
            .values(rate)
            .onConflictDoNothing();
        } catch (error) {
          // Ignore individual conflicts and continue
          console.log(`⚠️ Rate for ${rate.categoryName} already exists, skipping...`);
        }
      }

      console.log(`✅ Seeded ${ratesToSeed.length} default dropship markup rates`);
    } catch (error) {
      console.error('❌ Error seeding default markup rates:', error);
    }
  }



  /**
   * Create or update category markup rate
   */
  async setCategoryMarkupRate(
    categoryName: string,
    markupPercentage: number,
    notes?: string
  ): Promise<DropshipMarkupRate> {
    const [rate] = await db
      .insert(dropshipMarkupRates)
      .values({
        categoryName,
        markupPercentage: markupPercentage.toString(),
        notes,
        priority: 1
      })
      .onConflictDoUpdate({
        target: dropshipMarkupRates.categoryName,
        set: {
          markupPercentage: markupPercentage.toString(),
          notes,
          updatedAt: new Date()
        }
      })
      .returning();

    return rate;
  }

  /**
   * Set individual product markup override
   */
  async setProductMarkupOverride(
    productId: string,
    customMarkupPercentage: number,
    reason?: string,
    setBy?: number
  ): Promise<ProductMarkupOverride> {
    const [override] = await db
      .insert(productMarkupOverrides)
      .values({
        productId,
        customMarkupPercentage: customMarkupPercentage.toString(),
        reason,
        setBy
      })
      .onConflictDoUpdate({
        target: productMarkupOverrides.productId,
        set: {
          customMarkupPercentage: customMarkupPercentage.toString(),
          reason,
          setBy,
          updatedAt: new Date()
        }
      })
      .returning();

    return override;
  }

  /**
   * Seed default industry-standard markup rates
   */
  async seedDefaultRates(): Promise<void> {
    try {
      const defaultRates = Object.entries(DropshipMarkupService.DEFAULT_MARKUP_RATES)
        .filter(([category]) => category !== 'default')
        .map(([categoryName, markupPercentage]) => ({
          categoryName,
          markupPercentage: markupPercentage.toString(),
          source: 'official' as const,
          notes: 'Industry-standard markup rate',
          isActive: true
        }));

      // Insert or update default rates
      for (const rate of defaultRates) {
        await db
          .insert(dropshipMarkupRates)
          .values(rate)
          .onConflictDoUpdate({
            target: dropshipMarkupRates.categoryName,
            set: {
              markupPercentage: rate.markupPercentage,
              source: rate.source,
              notes: rate.notes,
              isActive: rate.isActive,
              updatedAt: new Date()
            }
          });
      }

      console.log(`✅ Seeded ${defaultRates.length} default dropship markup rates`);
    } catch (error) {
      console.error('Error seeding default dropship rates:', error);
      throw error;
    }
  }

  /**
   * Get all markup rates for display/management
   */
  async getAllMarkupRates() {
    try {
      const [categoryRates, productOverrides] = await Promise.all([
        db.select().from(dropshipMarkupRates).orderBy(dropshipMarkupRates.categoryName),
        db.select().from(productMarkupOverrides).orderBy(productMarkupOverrides.productId)
      ]);

      return {
        categoryRates,
        productOverrides
      };
    } catch (error) {
      console.error('Error fetching all markup rates:', error);
      return {
        categoryRates: [],
        productOverrides: []
      };
    }
  }
}

// Export a singleton instance
export const dropshipMarkupService = new DropshipMarkupService();