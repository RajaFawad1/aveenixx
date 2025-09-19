import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { affiliateCommissionRates, products, amazonCommissionRates, type AffiliateCommissionRate } from "@shared/schema";

export interface CommissionCalculation {
  productId: string;
  productName: string;
  productPrice: number;
  category: string;
  commissionRate: number;
  commissionAmount: number;
  isPromotional: boolean;
  promotionalRate?: number;
  actualRate: number;
  source: 'database' | 'default' | 'promotional';
}

export class CommissionService {
  // Default Amazon commission rates as fallback (current as of 2025)
  private static readonly DEFAULT_AMAZON_RATES: Record<string, number> = {
    // Electronics & Technology
    'Electronics': 2.50,
    'Cell Phones & Accessories': 2.50,
    'Computers': 2.50,
    'Video Games': 2.50,
    'Camera & Photo': 2.50,
    
    // Fashion & Beauty
    'Clothing, Shoes & Jewelry': 4.00,
    'Luxury Beauty': 10.00,
    'Beauty & Personal Care': 4.00,
    'Handbags & Accessories': 8.00,
    
    // Home & Garden
    'Home & Kitchen': 4.00,
    'Home Improvement': 4.00,
    'Patio, Lawn & Garden': 3.00,
    'Furniture': 8.00,
    
    // Sports & Outdoors
    'Sports & Outdoors': 4.00,
    'Outdoor Recreation': 5.50,
    
    // Books & Media
    'Books': 4.50,
    'Movies & TV': 4.50,
    'Music': 4.50,
    
    // Automotive
    'Automotive Parts & Accessories': 4.50,
    'Automotive Tools & Equipment': 12.00,
    
    // Health & Household
    'Health & Household': 4.00,
    'Baby Products': 4.50,
    
    // Toys & Games
    'Toys & Games': 3.00,
    
    // Default fallback rate
    'default': 3.00,
  };

  /**
   * Get commission rate for a category with promotional override support
   */
  async getCommissionRate(category: string, platform: 'amazon' | 'aliexpress' | 'walmart' = 'amazon'): Promise<{
    rate: number;
    isPromotional: boolean;
    source: 'database' | 'default';
    promotionalRate?: number;
  }> {
    try {
      // First, try to get from database
      // Use the amazonCommissionRates table instead since we only have Amazon rates for now
      if (platform === 'amazon') {
        const dbRate = await db
          .select()
          .from(amazonCommissionRates)
          .where(
            and(
              eq(amazonCommissionRates.categoryName, category),
              eq(amazonCommissionRates.isActive, true)
            )
          )
          .limit(1);
        
        if (dbRate.length > 0) {
          const rate = dbRate[0];
          return {
            rate: Number(rate.commissionRate),
            isPromotional: false,
            source: 'database' as const
          };
        }
      }
      
      // If not found in database, use default rates
      const dbRate: any[] = [];

      if (dbRate.length > 0) {
        const rate = dbRate[0];
        const now = new Date();
        
        // Check if promotional rate is active
        const isPromotionalActive = Boolean(rate.isPromotional && 
          rate.promotionalStartDate && 
          rate.promotionalEndDate &&
          now >= rate.promotionalStartDate && 
          now <= rate.promotionalEndDate &&
          rate.promotionalRate);

        return {
          rate: isPromotionalActive ? Number(rate.promotionalRate) : Number(rate.commissionRate),
          isPromotional: isPromotionalActive,
          source: 'database',
          promotionalRate: rate.promotionalRate ? Number(rate.promotionalRate) : undefined,
        };
      }

      // Fallback to default rates
      const defaultRate = CommissionService.DEFAULT_AMAZON_RATES[category] || 
                         CommissionService.DEFAULT_AMAZON_RATES['default'];
      
      return {
        rate: defaultRate,
        isPromotional: false,
        source: 'default',
      };
    } catch (error) {
      console.error('Error getting commission rate:', error);
      // Return safe default
      return {
        rate: CommissionService.DEFAULT_AMAZON_RATES['default'],
        isPromotional: false,
        source: 'default',
      };
    }
  }

  /**
   * Calculate commission for a single product
   */
  async calculateProductCommission(productId: string): Promise<CommissionCalculation | null> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (product.length === 0) {
        return null;
      }

      const prod = product[0];
      const price = Number(prod.price);
      const category = prod.category;

      // Get commission rate (check for promotional rates)
      const rateInfo = await this.getCommissionRate(category, 'amazon');
      
      const commissionAmount = (price * rateInfo.rate) / 100;

      return {
        productId: prod.id,
        productName: prod.name,
        productPrice: price,
        category: category,
        commissionRate: Number(prod.commissionRate) || rateInfo.rate,
        commissionAmount: commissionAmount,
        isPromotional: rateInfo.isPromotional,
        promotionalRate: rateInfo.promotionalRate,
        actualRate: rateInfo.rate,
        source: rateInfo.source,
      };
    } catch (error) {
      console.error('Error calculating product commission:', error);
      return null;
    }
  }

  /**
   * Calculate commissions for multiple products
   */
  async calculateBulkCommissions(productIds: string[]): Promise<CommissionCalculation[]> {
    const calculations: CommissionCalculation[] = [];
    
    for (const productId of productIds) {
      const calculation = await this.calculateProductCommission(productId);
      if (calculation) {
        calculations.push(calculation);
      }
    }

    return calculations;
  }

  /**
   * Update commission rate for a product
   */
  async updateProductCommissionRate(productId: string, newRate: number): Promise<boolean> {
    try {
      await db
        .update(products)
        .set({ 
          commissionRate: newRate.toString(),
          updatedAt: new Date() 
        })
        .where(eq(products.id, productId));
      
      return true;
    } catch (error) {
      console.error('Error updating product commission rate:', error);
      return false;
    }
  }

  /**
   * Seed default Amazon commission rates into the database
   */
  async seedDefaultRates(): Promise<void> {
    try {
      const ratesToInsert = Object.entries(CommissionService.DEFAULT_AMAZON_RATES)
        .filter(([category]) => category !== 'default')
        .map(([category, rate]) => ({
          categoryName: category,
          commissionRate: rate.toString(),
          rateSource: 'amazon_official',
          isActive: true,
        }));

      // Insert rates into amazonCommissionRates table, ignoring duplicates
      for (const rate of ratesToInsert) {
        try {
          await db.insert(amazonCommissionRates).values(rate);
        } catch (error) {
          // Ignore duplicate key errors
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes('duplicate key') && !errorMessage.includes('unique constraint')) {
            console.error(`Error inserting rate for ${rate.categoryName}:`, error);
          }
        }
      }

      console.log('✅ Default Amazon commission rates seeded successfully');
    } catch (error) {
      console.error('Error seeding default rates:', error);
    }
  }

  /**
   * Automatically calculate and apply commission rate for Amazon affiliate products
   */
  async calculateAmazonCommissionForProduct(productId: string, category: string, price: number): Promise<{
    commissionRate: number;
    commissionAmount: number;
    source: string;
  } | null> {
    try {
      // First try to get rate from amazon_commission_rates table
      const [amazonRate] = await db.select()
        .from(amazonCommissionRates)
        .where(eq(amazonCommissionRates.categoryName, category))
        .limit(1);

      let commissionRate: number;
      let source: string;

      if (amazonRate) {
        commissionRate = parseFloat(amazonRate.commissionRate);
        source = amazonRate.rateSource || 'amazon_official';
      } else {
        // Try category matching with fallback to default rates
        const matchedRate = this.findBestCategoryMatch(category);
        commissionRate = matchedRate;
        source = 'default_mapping';
      }

      const commissionAmount = (price * commissionRate) / 100;

      // Update the product with commission information
      await db.update(products)
        .set({
          commissionRate: commissionRate.toString(),
          updatedAt: new Date()
        })
        .where(eq(products.id, productId));

      console.log(`[Commission] Applied ${commissionRate}% rate to product ${productId} (${category}) = $${commissionAmount.toFixed(2)}`);

      return {
        commissionRate,
        commissionAmount,
        source
      };
    } catch (error) {
      console.error('Error calculating Amazon commission:', error);
      return null;
    }
  }

  /**
   * Find the best matching commission rate for a category
   */
  private findBestCategoryMatch(category: string): number {
    const categoryLower = category.toLowerCase();
    
    // Direct matches
    if (categoryLower.includes('electronics') || categoryLower.includes('technology')) return 2.50;
    if (categoryLower.includes('computer') || categoryLower.includes('laptop')) return 2.50;
    if (categoryLower.includes('home') || categoryLower.includes('kitchen') || categoryLower.includes('garden')) return 8.00;
    if (categoryLower.includes('automotive') && categoryLower.includes('tool')) return 12.00;
    if (categoryLower.includes('automotive')) return 4.50;
    if (categoryLower.includes('fashion') || categoryLower.includes('clothing') || categoryLower.includes('jewelry')) return 10.00;
    if (categoryLower.includes('beauty') || categoryLower.includes('personal care')) return 4.50;
    if (categoryLower.includes('health') || categoryLower.includes('household')) return 4.50;
    if (categoryLower.includes('baby')) return 4.50;
    if (categoryLower.includes('sports') || categoryLower.includes('outdoor')) return 4.50;
    if (categoryLower.includes('book')) return 4.50;
    if (categoryLower.includes('movie') || categoryLower.includes('tv') || categoryLower.includes('music')) return 4.50;
    if (categoryLower.includes('toy') || categoryLower.includes('game')) return 4.50;
    if (categoryLower.includes('pet')) return 5.00;
    if (categoryLower.includes('office')) return 6.00;
    if (categoryLower.includes('art') || categoryLower.includes('craft')) return 4.50;
    if (categoryLower.includes('grocery') || categoryLower.includes('food')) return 5.00;
    if (categoryLower.includes('industrial') || categoryLower.includes('scientific')) return 3.00;
    
    // Default fallback rate
    return 3.00;
  }

  /**
   * Process commission for multiple Amazon products during import
   */
  async processAmazonCommissionsForImport(productData: Array<{id: string, category: string, price: string}>): Promise<void> {
    for (const product of productData) {
      const price = parseFloat(product.price);
      if (price > 0) {
        await this.calculateAmazonCommissionForProduct(product.id, product.category, price);
      }
    }
  }

  /**
   * Get all commission rates for admin interface
   */
  async getAllCommissionRates(): Promise<AffiliateCommissionRate[]> {
    try {
      return await db
        .select()
        .from(affiliateCommissionRates)
        .where(eq(affiliateCommissionRates.isActive, true))
        .orderBy(affiliateCommissionRates.categoryName);
    } catch (error) {
      console.error('Error getting all commission rates:', error);
      return [];
    }
  }

  /**
   * Update or create commission rate for a category
   */
  async upsertCommissionRate(
    platform: 'amazon' | 'aliexpress' | 'walmart', 
    categoryName: string, 
    commissionRate: number,
    isPromotional = false,
    promotionalRate?: number,
    promotionalStartDate?: Date,
    promotionalEndDate?: Date
  ): Promise<boolean> {
    try {
      const existingRate = await db
        .select()
        .from(affiliateCommissionRates)
        .where(
          and(
            eq(affiliateCommissionRates.platform, platform),
            eq(affiliateCommissionRates.categoryName, categoryName)
          )
        )
        .limit(1);

      const rateData = {
        platform,
        categoryName,
        commissionRate: commissionRate.toString(),
        isPromotional,
        promotionalRate: promotionalRate?.toString(),
        promotionalStartDate,
        promotionalEndDate,
        lastUpdated: new Date(),
        updatedAt: new Date(),
      };

      if (existingRate.length > 0) {
        // Update existing rate
        await db
          .update(affiliateCommissionRates)
          .set(rateData)
          .where(eq(affiliateCommissionRates.id, existingRate[0].id));
      } else {
        // Create new rate
        await db.insert(affiliateCommissionRates).values({
          ...rateData,
          createdAt: new Date(),
        });
      }

      return true;
    } catch (error) {
      console.error('Error upserting commission rate:', error);
      return false;
    }
  }
}

export const commissionService = new CommissionService();