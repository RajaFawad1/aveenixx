// Import Validation Service - Phase 1 Quality Control
import { type Product } from "@shared/schema";

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  rejectionReason?: string;
}

export interface ValidationRules {
  requireTitle: boolean;
  requireDescription: boolean;
  requireImages: boolean;
  requirePrice: boolean;
  minDescriptionLength: number;
  minPriceValue: number;
  maxPriceValue: number;
  maxImageFileSize: number; // in MB
}

export class ImportValidationService {
  private defaultRules: ValidationRules = {
    requireTitle: true,
    requireDescription: true,
    requireImages: true,
    requirePrice: true,
    minDescriptionLength: 50,
    minPriceValue: 0.01,
    maxPriceValue: 50000,
    maxImageFileSize: 10
  };

  constructor(private customRules?: Partial<ValidationRules>) {
    this.defaultRules = { ...this.defaultRules, ...customRules };
  }

  /**
   * Validate a product and return validation result
   */
  async validateProduct(product: Partial<Product>): Promise<ValidationResult> {
    const issues: string[] = [];
    let score = 100;

    // Title validation
    if (this.defaultRules.requireTitle && (!product.name || product.name.trim().length === 0)) {
      issues.push("Missing product title");
      score -= 25;
    } else if (product.name && product.name.length < 10) {
      issues.push("Product title too short (minimum 10 characters)");
      score -= 10;
    }

    // Description validation
    if (this.defaultRules.requireDescription && (!product.description || product.description.trim().length === 0)) {
      issues.push("Missing product description");
      score -= 25;
    } else if (product.description && product.description.length < this.defaultRules.minDescriptionLength) {
      issues.push(`Description too short (minimum ${this.defaultRules.minDescriptionLength} characters)`);
      score -= 15;
    }

    // Price validation
    if (this.defaultRules.requirePrice && (!product.price || parseFloat(product.price) <= 0)) {
      issues.push("Missing or invalid price");
      score -= 20;
    } else if (product.price) {
      const price = parseFloat(product.price);
      if (price < this.defaultRules.minPriceValue) {
        issues.push(`Price too low (minimum $${this.defaultRules.minPriceValue})`);
        score -= 10;
      }
      if (price > this.defaultRules.maxPriceValue) {
        issues.push(`Price too high (maximum $${this.defaultRules.maxPriceValue})`);
        score -= 5;
      }
    }

    // Image validation
    if (this.defaultRules.requireImages) {
      const imageUrls = this.extractImageUrls(product);
      if (imageUrls.length === 0) {
        issues.push("Missing product images");
        score -= 20;
      } else {
        // Validate image URLs
        const invalidImages = imageUrls.filter(url => !this.isValidImageUrl(url));
        if (invalidImages.length > 0) {
          issues.push(`Invalid image URLs found: ${invalidImages.length}`);
          score -= invalidImages.length * 5;
        }
      }
    }

    // Additional quality checks
    if (product.name && this.containsSuspiciousContent(product.name)) {
      issues.push("Title contains suspicious content");
      score -= 15;
    }

    if (product.description && this.containsSuspiciousContent(product.description)) {
      issues.push("Description contains suspicious content");
      score -= 10;
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    const isValid = score >= 60 && issues.length === 0; // Minimum 60% score required
    const rejectionReason = !isValid ? 'missing_data' : undefined;

    return {
      isValid,
      score,
      issues,
      rejectionReason
    };
  }

  /**
   * Extract image URLs from product data
   */
  private extractImageUrls(product: Partial<Product>): string[] {
    const urls: string[] = [];
    
    if (product.imageUrl) {
      urls.push(product.imageUrl);
    }
    
    if (product.images && Array.isArray(product.images)) {
      urls.push(...product.images);
    }

    return urls;
  }

  /**
   * Validate if URL is a valid image URL
   */
  private isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return validExtensions.some(ext => pathname.endsWith(ext)) || 
             url.includes('image') || 
             url.includes('photo');
    } catch {
      return false;
    }
  }

  /**
   * Check for suspicious content that might indicate spam or low-quality products
   */
  private containsSuspiciousContent(text: string): boolean {
    const suspiciousPatterns = [
      /best\s+deal/i,
      /limited\s+time/i,
      /act\s+now/i,
      /free\s+shipping/i,
      /guarantee/i,
      /\$\$\$/,
      /!!!/,
      /amazing/i,
      /incredible/i,
      /unbelievable/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Get validation statistics for a batch of products
   */
  async validateBatch(products: Partial<Product>[]): Promise<{
    totalProducts: number;
    validProducts: number;
    invalidProducts: number;
    averageScore: number;
    commonIssues: string[];
  }> {
    const results = await Promise.all(
      products.map(product => this.validateProduct(product))
    );

    const validProducts = results.filter(r => r.isValid).length;
    const invalidProducts = results.length - validProducts;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // Count most common issues
    const issueCount: Record<string, number> = {};
    results.forEach(result => {
      result.issues.forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });

    const commonIssues = Object.entries(issueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);

    return {
      totalProducts: products.length,
      validProducts,
      invalidProducts,
      averageScore: Math.round(averageScore),
      commonIssues
    };
  }
}