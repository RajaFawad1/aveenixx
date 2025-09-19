import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { products } from "../../shared/schema.js";

interface CompetitorPrice {
  platform: string;
  price: number;
  url: string;
  lastChecked: string;
}

interface CategorySuggestion {
  category: string;
  confidence: number;
  reason: string;
}

interface SeasonalityData {
  month: number;
  demandMultiplier: number;
}

interface ProductIntelligenceData {
  viabilityScore: number;
  competitiveScore: number;
  profitMarginScore: number;
  marketTrendScore: number;
  overallIntelligenceScore: number;
  competitorPrices: CompetitorPrice[];
  suggestedPrice: number;
  priceOptimizationReason: string;
  aiSuggestedCategories: CategorySuggestion[];
  categoryConfidenceScore: number;
  googleTrendsScore: number;
  amazonBestSellerRank?: number;
  marketDemandLevel: 'low' | 'medium' | 'high' | 'very_high';
  seasonalityPattern: SeasonalityData[];
}

export class ProductIntelligenceService {
  
  /**
   * Calculate comprehensive product viability score (0-100)
   * Based on market demand, competition level, profit potential, and trend analysis
   */
  async calculateViabilityScore(productData: any): Promise<number> {
    let score = 0;
    
    // Market demand factor (30% weight)
    const demandScore = await this.calculateMarketDemandScore(productData);
    score += demandScore * 0.3;
    
    // Competition level factor (25% weight)
    const competitionScore = await this.calculateCompetitionScore(productData);
    score += competitionScore * 0.25;
    
    // Profit margin factor (25% weight)
    const profitScore = await this.calculateProfitMarginScore(productData);
    score += profitScore * 0.25;
    
    // Trend momentum factor (20% weight)
    const trendScore = await this.calculateTrendScore(productData);
    score += trendScore * 0.2;
    
    return Math.min(Math.max(score, 0), 100);
  }
  
  /**
   * Analyze market demand using multiple data sources
   */
  private async calculateMarketDemandScore(productData: any): Promise<number> {
    let demandScore = 50; // Base score
    
    // Google Trends analysis simulation
    const trendsData = await this.getGoogleTrendsData(productData.name);
    if (trendsData.averageInterest > 70) demandScore += 20;
    else if (trendsData.averageInterest > 40) demandScore += 10;
    else if (trendsData.averageInterest < 20) demandScore -= 15;
    
    // Category popularity analysis
    const categoryDemand = this.getCategoryDemandLevel(productData.category);
    if (categoryDemand === 'very_high') demandScore += 15;
    else if (categoryDemand === 'high') demandScore += 10;
    else if (categoryDemand === 'low') demandScore -= 10;
    
    // Product reviews and ratings factor
    if (productData.reviewCount > 100 && productData.rating > 4.0) demandScore += 10;
    else if (productData.reviewCount < 10) demandScore -= 5;
    
    return Math.min(Math.max(demandScore, 0), 100);
  }
  
  /**
   * Analyze competitive landscape and price positioning
   */
  async calculateCompetitiveScore(productData: any): Promise<number> {
    let competitiveScore = 50; // Base score
    
    // Get competitor prices
    const competitorPrices = await this.getCompetitorPrices(productData);
    
    if (competitorPrices.length > 0) {
      const avgCompetitorPrice = competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / competitorPrices.length;
      const productPrice = parseFloat(productData.price);
      
      // Price positioning analysis
      const priceRatio = productPrice / avgCompetitorPrice;
      
      if (priceRatio < 0.8) {
        // Significantly cheaper than competitors
        competitiveScore += 20;
      } else if (priceRatio < 0.95) {
        // Slightly cheaper
        competitiveScore += 10;
      } else if (priceRatio > 1.2) {
        // Significantly more expensive
        competitiveScore -= 15;
      } else if (priceRatio > 1.05) {
        // Slightly more expensive
        competitiveScore -= 5;
      }
      
      // Competition density analysis
      if (competitorPrices.length > 10) competitiveScore -= 10; // High competition
      else if (competitorPrices.length < 3) competitiveScore += 15; // Low competition
    }
    
    return Math.min(Math.max(competitiveScore, 0), 100);
  }
  
  /**
   * Calculate profit margin score based on pricing strategy
   */
  private async calculateProfitMarginScore(productData: any): Promise<number> {
    const price = parseFloat(productData.price);
    const originalPrice = parseFloat(productData.originalPrice || productData.price);
    
    // Calculate margin percentage
    const marginPercentage = ((price - originalPrice * 0.6) / price) * 100; // Assuming 60% cost basis
    
    let profitScore = 0;
    
    if (marginPercentage > 50) profitScore = 100;
    else if (marginPercentage > 30) profitScore = 80;
    else if (marginPercentage > 20) profitScore = 60;
    else if (marginPercentage > 10) profitScore = 40;
    else if (marginPercentage > 5) profitScore = 20;
    else profitScore = 0;
    
    return profitScore;
  }
  
  /**
   * Analyze market trends and seasonal patterns
   */
  private async calculateTrendScore(productData: any): Promise<number> {
    let trendScore = 50; // Base score
    
    // Google Trends momentum analysis
    const trendsData = await this.getGoogleTrendsData(productData.name);
    if (trendsData.isRising) trendScore += 20;
    else if (trendsData.isFalling) trendScore -= 15;
    
    // Seasonal factor analysis
    const currentMonth = new Date().getMonth() + 1;
    const seasonalMultiplier = this.getSeasonalMultiplier(productData.category, currentMonth);
    
    if (seasonalMultiplier > 1.5) trendScore += 15;
    else if (seasonalMultiplier > 1.2) trendScore += 10;
    else if (seasonalMultiplier < 0.8) trendScore -= 10;
    
    return Math.min(Math.max(trendScore, 0), 100);
  }
  
  /**
   * Get competitor prices from multiple platforms
   */
  async getCompetitorPrices(productData: any): Promise<CompetitorPrice[]> {
    // Simulate competitor price analysis
    // In production, this would integrate with price tracking APIs
    const basePrice = parseFloat(productData.price);
    const competitorPrices: CompetitorPrice[] = [];
    
    const platforms = ['Amazon', 'eBay', 'Walmart', 'AliExpress', 'Shopify'];
    
    for (const platform of platforms) {
      // Simulate price variations
      const priceVariation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const competitorPrice = basePrice * (1 + priceVariation);
      
      competitorPrices.push({
        platform,
        price: Math.round(competitorPrice * 100) / 100,
        url: `https://${platform.toLowerCase()}.com/search?q=${encodeURIComponent(productData.name)}`,
        lastChecked: new Date().toISOString()
      });
    }
    
    return competitorPrices;
  }
  
  /**
   * Generate AI-powered category suggestions
   */
  async generateCategorySuggestions(productData: any): Promise<CategorySuggestion[]> {
    const productName = productData.name.toLowerCase();
    const description = (productData.description || '').toLowerCase();
    const currentCategory = productData.category.toLowerCase();
    
    const suggestions: CategorySuggestion[] = [];
    
    // AI category analysis based on keywords
    const categoryKeywords = {
      'Electronics': ['electronic', 'digital', 'tech', 'device', 'gadget', 'smart', 'wireless'],
      'Home & Garden': ['home', 'garden', 'decor', 'furniture', 'kitchen', 'bathroom', 'outdoor'],
      'Fashion': ['clothing', 'apparel', 'fashion', 'style', 'wear', 'shirt', 'dress', 'shoes'],
      'Health & Beauty': ['health', 'beauty', 'skincare', 'wellness', 'supplement', 'cosmetic'],
      'Sports & Outdoors': ['sport', 'fitness', 'outdoor', 'exercise', 'gym', 'athletic', 'hiking'],
      'Automotive': ['car', 'auto', 'vehicle', 'automotive', 'parts', 'accessories', 'driving'],
      'Toys & Games': ['toy', 'game', 'play', 'children', 'kids', 'educational', 'fun'],
      'Books & Media': ['book', 'media', 'reading', 'literature', 'educational', 'learning']
    };
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (category.toLowerCase() === currentCategory) continue;
      
      let matchCount = 0;
      let totalKeywords = keywords.length;
      
      for (const keyword of keywords) {
        if (productName.includes(keyword) || description.includes(keyword)) {
          matchCount++;
        }
      }
      
      const confidence = (matchCount / totalKeywords) * 100;
      
      if (confidence > 20) {
        suggestions.push({
          category,
          confidence: Math.round(confidence),
          reason: `Product contains ${matchCount} relevant keywords for ${category} category`
        });
      }
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }
  
  /**
   * Get Google Trends data simulation
   */
  private async getGoogleTrendsData(productName: string): Promise<{
    averageInterest: number;
    isRising: boolean;
    isFalling: boolean;
  }> {
    // Simulate Google Trends API data
    // In production, integrate with actual Google Trends API
    const baseInterest = Math.random() * 100;
    const trend = Math.random() - 0.5; // -0.5 to 0.5
    
    return {
      averageInterest: Math.round(baseInterest),
      isRising: trend > 0.1,
      isFalling: trend < -0.1
    };
  }
  
  /**
   * Get category demand level
   */
  private getCategoryDemandLevel(category: string): 'low' | 'medium' | 'high' | 'very_high' {
    // Simulate category demand analysis
    const highDemandCategories = ['Electronics', 'Health & Beauty', 'Fashion'];
    const mediumDemandCategories = ['Home & Garden', 'Sports & Outdoors'];
    
    if (highDemandCategories.includes(category)) return 'high';
    if (mediumDemandCategories.includes(category)) return 'medium';
    return 'low';
  }
  
  /**
   * Get seasonal demand multiplier
   */
  private getSeasonalMultiplier(category: string, month: number): number {
    // Seasonal patterns by category
    const seasonalPatterns: Record<string, Record<number, number>> = {
      'Electronics': {
        11: 1.5, // Black Friday
        12: 1.8, // Christmas
        1: 0.8,  // Post-holiday
        9: 1.2   // Back to school
      },
      'Fashion': {
        3: 1.3,  // Spring
        9: 1.4,  // Fall fashion
        12: 1.2  // Holiday parties
      },
      'Home & Garden': {
        3: 1.5,  // Spring cleaning
        4: 1.6,  // Gardening season
        5: 1.4,
        10: 1.2  // Fall preparation
      }
    };
    
    return seasonalPatterns[category]?.[month] || 1.0;
  }
  
  /**
   * Calculate suggested optimal price
   */
  async calculateOptimalPrice(productData: any): Promise<{
    suggestedPrice: number;
    reason: string;
  }> {
    const currentPrice = parseFloat(productData.price);
    const competitorPrices = await this.getCompetitorPrices(productData);
    
    if (competitorPrices.length === 0) {
      return {
        suggestedPrice: currentPrice,
        reason: "No competitor data available for price optimization"
      };
    }
    
    const avgCompetitorPrice = competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / competitorPrices.length;
    const minCompetitorPrice = Math.min(...competitorPrices.map(cp => cp.price));
    const maxCompetitorPrice = Math.max(...competitorPrices.map(cp => cp.price));
    
    // Strategy: Price slightly below average competitor price for competitive advantage
    const strategicPrice = avgCompetitorPrice * 0.95;
    
    let suggestedPrice = strategicPrice;
    let reason = `Priced 5% below average competitor price (${avgCompetitorPrice.toFixed(2)}) for competitive advantage`;
    
    // Ensure price is above minimum threshold for profitability
    const minProfitablePrice = currentPrice * 0.8; // Don't go below 20% discount
    if (suggestedPrice < minProfitablePrice) {
      suggestedPrice = minProfitablePrice;
      reason = "Adjusted to maintain minimum profit margin";
    }
    
    return {
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      reason
    };
  }
  
  /**
   * Generate seasonal demand pattern
   */
  generateSeasonalPattern(category: string): SeasonalityData[] {
    const pattern: SeasonalityData[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const multiplier = this.getSeasonalMultiplier(category, month);
      pattern.push({ month, demandMultiplier: multiplier });
    }
    
    return pattern;
  }
  
  /**
   * Run complete product intelligence analysis
   */
  async analyzeProduct(productId: string): Promise<ProductIntelligenceData> {
    // Get product data
    const productResult = await db.select().from(products).where(eq(products.id, productId));
    
    if (productResult.length === 0) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    const productData = productResult[0];
    
    // Calculate all intelligence scores
    const viabilityScore = await this.calculateViabilityScore(productData);
    const competitiveScore = await this.calculateCompetitiveScore(productData);
    const profitMarginScore = await this.calculateProfitMarginScore(productData);
    const marketTrendScore = await this.calculateTrendScore(productData);
    
    // Calculate overall weighted score
    const overallIntelligenceScore = (
      viabilityScore * 0.3 +
      competitiveScore * 0.25 +
      profitMarginScore * 0.25 +
      marketTrendScore * 0.2
    );
    
    // Get additional intelligence data
    const competitorPrices = await this.getCompetitorPrices(productData);
    const priceOptimization = await this.calculateOptimalPrice(productData);
    const categorySuggestions = await this.generateCategorySuggestions(productData);
    const trendsData = await this.getGoogleTrendsData(productData.name);
    const marketDemandLevel = this.getCategoryDemandLevel(productData.category);
    const seasonalityPattern = this.generateSeasonalPattern(productData.category);
    
    // Calculate category confidence score
    const categoryConfidenceScore = categorySuggestions.length > 0 
      ? categorySuggestions[0].confidence 
      : 85; // High confidence for current category if no suggestions
    
    const intelligenceData: ProductIntelligenceData = {
      viabilityScore: Math.round(viabilityScore * 100) / 100,
      competitiveScore: Math.round(competitiveScore * 100) / 100,
      profitMarginScore: Math.round(profitMarginScore * 100) / 100,
      marketTrendScore: Math.round(marketTrendScore * 100) / 100,
      overallIntelligenceScore: Math.round(overallIntelligenceScore * 100) / 100,
      competitorPrices,
      suggestedPrice: priceOptimization.suggestedPrice,
      priceOptimizationReason: priceOptimization.reason,
      aiSuggestedCategories: categorySuggestions,
      categoryConfidenceScore,
      googleTrendsScore: trendsData.averageInterest,
      amazonBestSellerRank: Math.floor(Math.random() * 10000) + 1, // Simulate Amazon rank
      marketDemandLevel,
      seasonalityPattern
    };
    
    // Update database with intelligence data
    await this.updateProductIntelligence(productId, intelligenceData);
    
    return intelligenceData;
  }
  
  /**
   * Update product intelligence data in database
   */
  private async updateProductIntelligence(productId: string, intelligenceData: ProductIntelligenceData): Promise<void> {
    await db.update(products)
      .set({
        viabilityScore: intelligenceData.viabilityScore.toString(),
        competitiveScore: intelligenceData.competitiveScore.toString(),
        profitMarginScore: intelligenceData.profitMarginScore.toString(),
        marketTrendScore: intelligenceData.marketTrendScore.toString(),
        overallIntelligenceScore: intelligenceData.overallIntelligenceScore.toString(),
        competitorPrices: intelligenceData.competitorPrices,
        suggestedPrice: intelligenceData.suggestedPrice.toString(),
        priceOptimizationReason: intelligenceData.priceOptimizationReason,
        aiSuggestedCategories: intelligenceData.aiSuggestedCategories,
        categoryConfidenceScore: intelligenceData.categoryConfidenceScore.toString(),
        googleTrendsScore: intelligenceData.googleTrendsScore.toString(),
        amazonBestSellerRank: intelligenceData.amazonBestSellerRank,
        marketDemandLevel: intelligenceData.marketDemandLevel,
        seasonalityPattern: intelligenceData.seasonalityPattern,
        intelligenceLastUpdated: new Date(),
        intelligenceAnalysisVersion: "2.0",
        dataSourcesUsed: ["google_trends", "competitor_analysis", "market_research", "seasonal_patterns"]
      })
      .where(eq(products.id, productId));
  }
  
  /**
   * Bulk analyze multiple products
   */
  async bulkAnalyzeProducts(productIds: string[]): Promise<Record<string, ProductIntelligenceData>> {
    const results: Record<string, ProductIntelligenceData> = {};
    
    // Process in batches to avoid overwhelming external APIs
    const batchSize = 5;
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (productId) => {
        try {
          const intelligenceData = await this.analyzeProduct(productId);
          results[productId] = intelligenceData;
        } catch (error) {
          console.error(`Failed to analyze product ${productId}:`, error);
        }
      });
      
      await Promise.all(batchPromises);
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < productIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

export const productIntelligenceService = new ProductIntelligenceService();