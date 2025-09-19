// Content Filtering Service - Phase 2 Quality Control
import { type Product } from "@shared/schema";

export interface ContentFilterResult {
  isAllowed: boolean;
  score: number; // 0-100 (higher = cleaner content)
  flags: string[];
  rejectionReason?: string;
}

export interface ContentFilterSettings {
  enabledCategories: string[];
  blockedKeywords: string[];
  blockedBrands: string[];
  allowedBrands: string[];
  strictMode: boolean;
}

export class ContentFilteringService {
  private defaultSettings: ContentFilterSettings = {
    enabledCategories: ['inappropriate', 'trademark', 'spam', 'illegal'],
    blockedKeywords: [
      // Inappropriate content
      'adult', 'xxx', 'porn', 'sex', 'nude', 'erotic',
      // Illegal items
      'weapon', 'gun', 'knife', 'drug', 'cannabis', 'marijuana',
      // Spam indicators
      'get rich quick', 'make money fast', 'limited time only',
      'act now', 'free money', 'guaranteed income',
      // Medical claims
      'cure cancer', 'lose weight fast', 'miracle pill',
      // Trademark violations
      'genuine fake', 'replica', 'knockoff', 'counterfeit'
    ],
    blockedBrands: [
      'supreme', 'gucci', 'louis vuitton', 'chanel', 'prada',
      'nike', 'adidas', 'apple', 'samsung', 'sony'
    ],
    allowedBrands: [],
    strictMode: false
  };

  constructor(private customSettings?: Partial<ContentFilterSettings>) {
    this.defaultSettings = { ...this.defaultSettings, ...customSettings };
  }

  /**
   * Filter product content and return filtering result
   */
  async filterProduct(product: Partial<Product>): Promise<ContentFilterResult> {
    const flags: string[] = [];
    let score = 100;

    const content = this.extractProductContent(product);

    // Check for blocked keywords
    const keywordIssues = this.checkBlockedKeywords(content);
    if (keywordIssues.length > 0) {
      flags.push(...keywordIssues.map(keyword => `Blocked keyword: ${keyword}`));
      score -= keywordIssues.length * 20;
    }

    // Check for trademark violations
    const trademarkIssues = this.checkTrademarkViolations(product);
    if (trademarkIssues.length > 0) {
      flags.push(...trademarkIssues.map(brand => `Potential trademark violation: ${brand}`));
      score -= trademarkIssues.length * 25;
    }

    // Check for spam indicators
    const spamScore = this.calculateSpamScore(content);
    if (spamScore > 50) {
      flags.push(`High spam indicators detected (score: ${spamScore})`);
      score -= spamScore / 2;
    }

    // Check for inappropriate content
    const inappropriateContent = this.checkInappropriateContent(content);
    if (inappropriateContent.length > 0) {
      flags.push(...inappropriateContent.map(issue => `Inappropriate content: ${issue}`));
      score -= inappropriateContent.length * 30;
    }

    // Check content quality
    const qualityIssues = this.checkContentQuality(content);
    if (qualityIssues.length > 0) {
      flags.push(...qualityIssues);
      score -= qualityIssues.length * 10;
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    const isAllowed = score >= 70 && flags.length === 0; // Minimum 70% score required
    const rejectionReason = !isAllowed ? 'content_filtered' : undefined;

    return {
      isAllowed,
      score,
      flags,
      rejectionReason
    };
  }

  /**
   * Extract all text content from product for analysis
   */
  private extractProductContent(product: Partial<Product>): string {
    const parts: string[] = [];
    
    if (product.name) parts.push(product.name);
    if (product.description) parts.push(product.description);
    if (product.brand) parts.push(product.brand);
    if (product.sku) parts.push(product.sku);
    
    return parts.join(' ').toLowerCase();
  }

  /**
   * Check for blocked keywords in content
   */
  private checkBlockedKeywords(content: string): string[] {
    return this.defaultSettings.blockedKeywords.filter(keyword => 
      content.includes(keyword.toLowerCase())
    );
  }

  /**
   * Check for potential trademark violations
   */
  private checkTrademarkViolations(product: Partial<Product>): string[] {
    const violations: string[] = [];
    const content = this.extractProductContent(product);

    // Check if product claims to be from blocked brands
    for (const brand of this.defaultSettings.blockedBrands) {
      if (content.includes(brand.toLowerCase())) {
        // Check if it's an authorized brand listing
        if (!this.defaultSettings.allowedBrands.includes(brand.toLowerCase())) {
          violations.push(brand);
        }
      }
    }

    // Check for counterfeit indicators
    const counterfeiteIndicators = [
      'replica', 'knockoff', 'inspired by', 'similar to', 'like original'
    ];
    
    for (const indicator of counterfeiteIndicators) {
      if (content.includes(indicator)) {
        violations.push(`Counterfeit indicator: ${indicator}`);
      }
    }

    return violations;
  }

  /**
   * Calculate spam score based on various indicators
   */
  private calculateSpamScore(content: string): number {
    let spamScore = 0;

    // Check for excessive capitalization
    const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (upperCaseRatio > 0.3) spamScore += 20;

    // Check for excessive punctuation
    const punctuationRatio = (content.match(/[!?]{2,}/g) || []).length;
    spamScore += punctuationRatio * 10;

    // Check for promotional language
    const promoWords = ['amazing', 'incredible', 'best deal', 'limited time', 'act now'];
    const promoCount = promoWords.filter(word => content.includes(word)).length;
    spamScore += promoCount * 15;

    // Check for repeated characters
    const repeatedChars = content.match(/(.)\1{3,}/g) || [];
    spamScore += repeatedChars.length * 10;

    // Check for excessive use of currency symbols
    const currencyCount = (content.match(/\$/g) || []).length;
    if (currencyCount > 3) spamScore += (currencyCount - 3) * 5;

    return Math.min(100, spamScore);
  }

  /**
   * Check for inappropriate content
   */
  private checkInappropriateContent(content: string): string[] {
    const issues: string[] = [];

    // Adult content indicators
    const adultKeywords = ['adult', 'xxx', 'erotic', 'sexual', 'nude'];
    const foundAdultContent = adultKeywords.filter(keyword => content.includes(keyword));
    if (foundAdultContent.length > 0) {
      issues.push('Adult content detected');
    }

    // Violence indicators
    const violenceKeywords = ['weapon', 'gun', 'knife', 'violence', 'kill'];
    const foundViolence = violenceKeywords.filter(keyword => content.includes(keyword));
    if (foundViolence.length > 0) {
      issues.push('Violence-related content detected');
    }

    // Illegal substance indicators
    const substanceKeywords = ['drug', 'cannabis', 'marijuana', 'cocaine', 'heroin'];
    const foundSubstances = substanceKeywords.filter(keyword => content.includes(keyword));
    if (foundSubstances.length > 0) {
      issues.push('Illegal substance references detected');
    }

    return issues;
  }

  /**
   * Check overall content quality
   */
  private checkContentQuality(content: string): string[] {
    const issues: string[] = [];

    // Check for minimum content length
    if (content.length < 20) {
      issues.push('Content too short for quality assessment');
    }

    // Check for coherent language
    const words = content.split(/\s+/);
    const shortWords = words.filter(word => word.length < 3).length;
    if (shortWords / words.length > 0.6) {
      issues.push('Poor language quality detected');
    }

    // Check for excessive special characters
    const specialCharRatio = (content.match(/[^a-zA-Z0-9\s]/g) || []).length / content.length;
    if (specialCharRatio > 0.2) {
      issues.push('Excessive special characters');
    }

    return issues;
  }

  /**
   * Get filtering statistics for a batch of products
   */
  async filterBatch(products: Partial<Product>[]): Promise<{
    totalProducts: number;
    allowedProducts: number;
    filteredProducts: number;
    averageScore: number;
    commonFlags: string[];
  }> {
    const results = await Promise.all(
      products.map(product => this.filterProduct(product))
    );

    const allowedProducts = results.filter(r => r.isAllowed).length;
    const filteredProducts = results.length - allowedProducts;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // Count most common flags
    const flagCount: Record<string, number> = {};
    results.forEach(result => {
      result.flags.forEach(flag => {
        flagCount[flag] = (flagCount[flag] || 0) + 1;
      });
    });

    const commonFlags = Object.entries(flagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([flag]) => flag);

    return {
      totalProducts: products.length,
      allowedProducts,
      filteredProducts,
      averageScore: Math.round(averageScore),
      commonFlags
    };
  }

  /**
   * Update filtering settings
   */
  updateSettings(newSettings: Partial<ContentFilterSettings>): void {
    this.defaultSettings = { ...this.defaultSettings, ...newSettings };
  }
}