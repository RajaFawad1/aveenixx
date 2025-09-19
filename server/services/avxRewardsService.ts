import { CommissionService } from "./commissionService";
import { DropshipMarkupService } from "./dropshipMarkupService";

export interface AVXRewardCalculation {
  productId: string;
  productName: string;
  productType: 'affiliate' | 'dropship' | 'physical' | 'digital' | 'service' | 'custom' | 'multivendor' | 'consumable';
  productPrice: number;
  baseMarginCents: number; // Commission or markup in cents
  avxRewardCents: number; // Actual reward amount in cents
  avxRewardPercentage: number; // Percentage of margin that becomes rewards
  rewardRate: number; // Rate applied to margin (12% for affiliate, 6.5% for dropship)
  isInstantReward: boolean; // True for dropship, false for affiliate (needs verification)
  coolingOffDays: number; // Days until reward can be redeemed
  displayText: string; // User-friendly display text
  source: 'commission' | 'markup' | 'none';
}

export class AVXRewardsService {
  private commissionService: CommissionService;
  private dropshipMarkupService: DropshipMarkupService;

  // Reward rates - configurable percentages
  private static readonly AFFILIATE_REWARD_RATE = 12; // 12% of commission
  private static readonly DROPSHIP_REWARD_RATE = 6.5; // 6.5% of markup margin
  private static readonly PHYSICAL_REWARD_RATE = 3.0; // 3% of price for physical products
  
  // Cooling off periods
  private static readonly AFFILIATE_COOLING_DAYS = 45; // 45 days for Amazon verification
  private static readonly DROPSHIP_COOLING_DAYS = 0; // Instant for Aveenix-controlled pricing
  private static readonly PHYSICAL_COOLING_DAYS = 3; // 3 days for physical product verification

  constructor() {
    this.commissionService = new CommissionService();
    this.dropshipMarkupService = new DropshipMarkupService();
  }

  /**
   * Calculate AVX rewards for a product based on its type and pricing structure
   */
  async calculateAVXRewards(
    productId: string,
    productName: string,
    productType: string,
    productPrice: number,
    category: string,
    costPrice?: number
  ): Promise<AVXRewardCalculation> {
    const priceCents = Math.round(productPrice * 100);

    switch (productType) {
      case 'affiliate':
        return await this.calculateAffiliateRewards(productId, productName, productPrice, category);
      
      case 'dropship':
        return await this.calculateDropshipRewards(productId, productName, productPrice, category, costPrice);
      
      case 'physical':
      case 'digital':
      case 'service':
      case 'custom':
      case 'multivendor':
      case 'consumable':
        return this.calculateStandardRewards(productId, productName, productType as any, productPrice);
      
      default:
        return this.createNoRewardCalculation(productId, productName, productType as any, productPrice);
    }
  }

  /**
   * Calculate rewards for affiliate products based on commission
   */
  private async calculateAffiliateRewards(
    productId: string,
    productName: string,
    productPrice: number,
    category: string
  ): Promise<AVXRewardCalculation> {
    try {
      const commissionCalc = await this.commissionService.calculateCommissionForProduct(
        productId,
        productName,
        productPrice,
        category
      );

      const commissionCents = Math.round(commissionCalc.commissionAmount * 100);
      const rewardCents = Math.round(commissionCents * (AVXRewardsService.AFFILIATE_REWARD_RATE / 100));
      const rewardPercentage = (rewardCents / (productPrice * 100)) * 100;

      return {
        productId,
        productName,
        productType: 'affiliate',
        productPrice,
        baseMarginCents: commissionCents,
        avxRewardCents: rewardCents,
        avxRewardPercentage: rewardPercentage,
        rewardRate: AVXRewardsService.AFFILIATE_REWARD_RATE,
        isInstantReward: false,
        coolingOffDays: AVXRewardsService.AFFILIATE_COOLING_DAYS,
        displayText: `Earn ${this.formatCents(rewardCents)} AVX Rewards (pending verification)`,
        source: 'commission'
      };
    } catch (error) {
      console.error('Error calculating affiliate rewards:', error);
      return this.createNoRewardCalculation(productId, productName, 'affiliate', productPrice);
    }
  }

  /**
   * Calculate rewards for dropship products based on markup margin
   */
  private async calculateDropshipRewards(
    productId: string,
    productName: string,
    productPrice: number,
    category: string,
    costPrice?: number
  ): Promise<AVXRewardCalculation> {
    try {
      // If no cost price provided, estimate based on markup service
      let marginCents: number;
      
      if (costPrice) {
        marginCents = Math.round((productPrice - costPrice) * 100);
      } else {
        // Use dropship markup service to get estimated margin
        const markupCalc = await this.dropshipMarkupService.calculatePricing(
          productId,
          productName,
          productPrice * 0.6, // Estimate cost as 60% of sale price
          category
        );
        marginCents = Math.round(markupCalc.profitAmount * 100);
      }

      const rewardCents = Math.round(marginCents * (AVXRewardsService.DROPSHIP_REWARD_RATE / 100));
      const rewardPercentage = (rewardCents / (productPrice * 100)) * 100;

      return {
        productId,
        productName,
        productType: 'dropship',
        productPrice,
        baseMarginCents: marginCents,
        avxRewardCents: rewardCents,
        avxRewardPercentage: rewardPercentage,
        rewardRate: AVXRewardsService.DROPSHIP_REWARD_RATE,
        isInstantReward: true,
        coolingOffDays: AVXRewardsService.DROPSHIP_COOLING_DAYS,
        displayText: `Earn ${this.formatCents(rewardCents)} AVX Rewards (instant)`,
        source: 'markup'
      };
    } catch (error) {
      console.error('Error calculating dropship rewards:', error);
      return this.createNoRewardCalculation(productId, productName, 'dropship', productPrice);
    }
  }

  /**
   * Calculate rewards for standard Aveenix products (physical, digital, etc.)
   */
  private calculateStandardRewards(
    productId: string,
    productName: string,
    productType: 'physical' | 'digital' | 'service' | 'custom' | 'multivendor' | 'consumable',
    productPrice: number
  ): AVXRewardCalculation {
    const rewardCents = Math.round(productPrice * 100 * (AVXRewardsService.PHYSICAL_REWARD_RATE / 100));
    
    return {
      productId,
      productName,
      productType,
      productPrice,
      baseMarginCents: Math.round(productPrice * 100), // Full price as base for standard products
      avxRewardCents: rewardCents,
      avxRewardPercentage: AVXRewardsService.PHYSICAL_REWARD_RATE,
      rewardRate: AVXRewardsService.PHYSICAL_REWARD_RATE,
      isInstantReward: false,
      coolingOffDays: AVXRewardsService.PHYSICAL_COOLING_DAYS,
      displayText: `Earn ${this.formatCents(rewardCents)} AVX Rewards`,
      source: 'none'
    };
  }

  /**
   * Create a no-reward calculation for products that don't qualify
   */
  private createNoRewardCalculation(
    productId: string,
    productName: string,
    productType: 'affiliate' | 'dropship' | 'physical' | 'digital' | 'service' | 'custom' | 'multivendor' | 'consumable',
    productPrice: number
  ): AVXRewardCalculation {
    return {
      productId,
      productName,
      productType,
      productPrice,
      baseMarginCents: 0,
      avxRewardCents: 0,
      avxRewardPercentage: 0,
      rewardRate: 0,
      isInstantReward: false,
      coolingOffDays: 0,
      displayText: 'No rewards available',
      source: 'none'
    };
  }

  /**
   * Calculate total rewards for multiple products (cart calculation)
   */
  async calculateCartRewards(
    cartItems: Array<{
      productId: string;
      productName: string;
      productType: string;
      productPrice: number;
      quantity: number;
      category?: string;
      costPrice?: number;
    }>
  ): Promise<{
    totalRewardCents: number;
    instantRewardCents: number;
    pendingRewardCents: number;
    items: AVXRewardCalculation[];
  }> {
    const calculations: AVXRewardCalculation[] = [];
    let totalRewardCents = 0;
    let instantRewardCents = 0;
    let pendingRewardCents = 0;

    for (const item of cartItems) {
      const calculation = await this.calculateAVXRewards(
        item.productId,
        item.productName,
        item.productType,
        item.productPrice,
        item.category || 'General',
        item.costPrice
      );

      // Multiply by quantity
      const itemRewardCents = calculation.avxRewardCents * item.quantity;
      calculation.avxRewardCents = itemRewardCents;
      
      totalRewardCents += itemRewardCents;
      
      if (calculation.isInstantReward) {
        instantRewardCents += itemRewardCents;
      } else {
        pendingRewardCents += itemRewardCents;
      }

      calculations.push(calculation);
    }

    return {
      totalRewardCents,
      instantRewardCents,
      pendingRewardCents,
      items: calculations
    };
  }

  /**
   * Format cents to currency display
   */
  private formatCents(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  /**
   * Get reward configuration
   */
  static getRewardConfig() {
    return {
      affiliateRate: AVXRewardsService.AFFILIATE_REWARD_RATE,
      dropshipRate: AVXRewardsService.DROPSHIP_REWARD_RATE,
      physicalRate: AVXRewardsService.PHYSICAL_REWARD_RATE,
      affiliateCoolingDays: AVXRewardsService.AFFILIATE_COOLING_DAYS,
      dropshipCoolingDays: AVXRewardsService.DROPSHIP_COOLING_DAYS,
      physicalCoolingDays: AVXRewardsService.PHYSICAL_COOLING_DAYS
    };
  }
}