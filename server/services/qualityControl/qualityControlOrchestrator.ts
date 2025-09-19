// Quality Control Orchestrator - Coordinates all quality control services
import { type Product, type InsertProductQualityMetrics, productQualityMetrics } from "@shared/schema";
import { db } from "../../db";
import { ImportValidationService, type ValidationResult } from "./importValidationService";
import { ContentFilteringService, type ContentFilterResult } from "./contentFilteringService";

export interface QualityControlResult {
  shouldReject: boolean;
  rejectionReason?: string;
  qualityScore: number;
  validationResult: ValidationResult;
  contentFilterResult: ContentFilterResult;
  duplicateRisk: number;
  overallAssessment: string;
}

export class QualityControlOrchestrator {
  private validationService: ImportValidationService;
  private contentFilterService: ContentFilteringService;

  constructor() {
    this.validationService = new ImportValidationService();
    this.contentFilterService = new ContentFilteringService();
  }

  /**
   * Run complete quality control analysis on a product
   */
  async processProduct(product: Partial<Product>): Promise<QualityControlResult> {
    console.log(`[Quality Control] Processing product: ${product.name}`);

    // Phase 1: Import Validation
    const validationResult = await this.validationService.validateProduct(product);
    console.log(`[Quality Control] Validation score: ${validationResult.score}`);

    // Phase 2: Content Filtering
    const contentFilterResult = await this.contentFilterService.filterProduct(product);
    console.log(`[Quality Control] Content filter score: ${contentFilterResult.score}`);

    // Phase 3: Duplicate Detection (placeholder for now)
    const duplicateRisk = await this.checkDuplicateRisk(product);
    console.log(`[Quality Control] Duplicate risk: ${duplicateRisk}`);

    // Calculate overall quality score (weighted average)
    const qualityScore = this.calculateOverallQualityScore(
      validationResult.score,
      contentFilterResult.score,
      duplicateRisk
    );

    // Determine if product should be rejected
    const { shouldReject, rejectionReason, overallAssessment } = this.determineRejection(
      validationResult,
      contentFilterResult,
      duplicateRisk,
      qualityScore
    );

    // Save quality metrics to database
    if (product.id) {
      await this.saveQualityMetrics(product.id, {
        validationScore: validationResult.score,
        contentQualityScore: contentFilterResult.score,
        duplicateRisk,
        rejectionReason,
        filteringFlags: contentFilterResult.flags
      });
    }

    console.log(`[Quality Control] Overall assessment: ${overallAssessment} (Score: ${qualityScore})`);

    return {
      shouldReject,
      rejectionReason,
      qualityScore,
      validationResult,
      contentFilterResult,
      duplicateRisk,
      overallAssessment
    };
  }

  /**
   * Calculate weighted overall quality score
   */
  private calculateOverallQualityScore(
    validationScore: number,
    contentScore: number,
    duplicateRisk: number
  ): number {
    // Weights: validation (40%), content (40%), duplicates (20%)
    const validationWeight = 0.4;
    const contentWeight = 0.4;
    const duplicateWeight = 0.2;

    // Invert duplicate risk (high risk = low score)
    const duplicateScore = 100 - duplicateRisk;

    const weightedScore = 
      (validationScore * validationWeight) +
      (contentScore * contentWeight) +
      (duplicateScore * duplicateWeight);

    return Math.round(weightedScore);
  }

  /**
   * Determine if product should be rejected and why
   */
  private determineRejection(
    validationResult: ValidationResult,
    contentFilterResult: ContentFilterResult,
    duplicateRisk: number,
    qualityScore: number
  ): { shouldReject: boolean; rejectionReason?: string; overallAssessment: string } {
    
    // Critical validation failures
    if (!validationResult.isValid && validationResult.score < 50) {
      return {
        shouldReject: true,
        rejectionReason: 'missing_data',
        overallAssessment: 'REJECTED - Critical data missing'
      };
    }

    // Content filtering failures
    if (!contentFilterResult.isAllowed || contentFilterResult.score < 60) {
      return {
        shouldReject: true,
        rejectionReason: 'content_filtered',
        overallAssessment: 'REJECTED - Content policy violation'
      };
    }

    // High duplicate risk
    if (duplicateRisk > 80) {
      return {
        shouldReject: true,
        rejectionReason: 'duplicate_detected',
        overallAssessment: 'REJECTED - Likely duplicate product'
      };
    }

    // Overall quality too low
    if (qualityScore < 60) {
      return {
        shouldReject: true,
        rejectionReason: 'performance_risk',
        overallAssessment: 'REJECTED - Poor overall quality'
      };
    }

    // Determine quality level for approved products
    if (qualityScore >= 85) {
      return {
        shouldReject: false,
        overallAssessment: 'APPROVED - High quality product'
      };
    } else if (qualityScore >= 75) {
      return {
        shouldReject: false,
        overallAssessment: 'APPROVED - Good quality product'
      };
    } else {
      return {
        shouldReject: false,
        overallAssessment: 'APPROVED - Acceptable quality (needs monitoring)'
      };
    }
  }

  /**
   * Check for duplicate products (simplified implementation)
   */
  private async checkDuplicateRisk(product: Partial<Product>): Promise<number> {
    if (!product.name) return 0;

    try {
      // Simple title-based duplicate detection
      // In a real implementation, this would be more sophisticated
      const similarProducts = await db
        .select()
        .from({ p: productQualityMetrics })
        .limit(5);

      // For now, return a low risk unless we implement proper duplicate detection
      return 10; // Low risk by default
    } catch (error) {
      console.error('[Quality Control] Error checking duplicates:', error);
      return 0;
    }
  }

  /**
   * Save quality metrics to database
   */
  private async saveQualityMetrics(
    productId: string,
    metrics: {
      validationScore: number;
      contentQualityScore: number;
      duplicateRisk: number;
      rejectionReason?: string;
      filteringFlags: string[];
    }
  ): Promise<void> {
    try {
      const qualityMetrics: InsertProductQualityMetrics = {
        productId,
        validationScore: metrics.validationScore,
        contentQualityScore: metrics.contentQualityScore,
        duplicateRisk: metrics.duplicateRisk,
        rejectionReason: metrics.rejectionReason,
        filteringFlags: metrics.filteringFlags,
        performanceScore: 0 // Will be updated based on actual performance
      };

      await db.insert(productQualityMetrics).values(qualityMetrics);
      console.log(`[Quality Control] Saved quality metrics for product ${productId}`);
    } catch (error) {
      console.error('[Quality Control] Error saving quality metrics:', error);
    }
  }

  /**
   * Get quality dashboard statistics
   */
  async getQualityDashboardStats(): Promise<{
    totalProductsChecked: number;
    averageQualityScore: number;
    rejectionBreakdown: Record<string, number>;
    recentIssues: string[];
  }> {
    try {
      // Get all quality metrics
      const allMetrics = await db.select().from(productQualityMetrics);

      const totalProductsChecked = allMetrics.length;
      const averageQualityScore = totalProductsChecked > 0 
        ? Math.round(allMetrics.reduce((sum, m) => sum + (m.validationScore || 0), 0) / totalProductsChecked)
        : 0;

      // Count rejections by reason
      const rejectionBreakdown: Record<string, number> = {};
      allMetrics.forEach(metric => {
        if (metric.rejectionReason) {
          rejectionBreakdown[metric.rejectionReason] = (rejectionBreakdown[metric.rejectionReason] || 0) + 1;
        }
      });

      // Get recent filtering flags as issues
      const recentIssues = allMetrics
        .filter(m => m.filteringFlags && m.filteringFlags.length > 0)
        .slice(-10)
        .flatMap(m => m.filteringFlags || []);

      return {
        totalProductsChecked,
        averageQualityScore,
        rejectionBreakdown,
        recentIssues: [...new Set(recentIssues)].slice(0, 5) // Unique recent issues
      };
    } catch (error) {
      console.error('[Quality Control] Error getting dashboard stats:', error);
      return {
        totalProductsChecked: 0,
        averageQualityScore: 0,
        rejectionBreakdown: {},
        recentIssues: []
      };
    }
  }

  /**
   * Process multiple products in batch
   */
  async processBatch(products: Partial<Product>[]): Promise<{
    results: QualityControlResult[];
    summary: {
      totalProcessed: number;
      approved: number;
      rejected: number;
      rejectionReasons: Record<string, number>;
    };
  }> {
    console.log(`[Quality Control] Processing batch of ${products.length} products`);

    const results = await Promise.all(
      products.map(product => this.processProduct(product))
    );

    const approved = results.filter(r => !r.shouldReject).length;
    const rejected = results.length - approved;

    const rejectionReasons: Record<string, number> = {};
    results.forEach(result => {
      if (result.rejectionReason) {
        rejectionReasons[result.rejectionReason] = (rejectionReasons[result.rejectionReason] || 0) + 1;
      }
    });

    console.log(`[Quality Control] Batch complete: ${approved} approved, ${rejected} rejected`);

    return {
      results,
      summary: {
        totalProcessed: products.length,
        approved,
        rejected,
        rejectionReasons
      }
    };
  }

  /**
   * Get quality control dashboard statistics
   */
  async getQualityDashboardStats() {
    try {
      // Get basic statistics from quality metrics
      const metrics = await db.select().from(productQualityMetrics);
      
      const totalProductsChecked = metrics.length;
      const averageQualityScore = metrics.length > 0 
        ? Math.round(metrics.reduce((sum, m) => sum + parseFloat(m.qualityScore), 0) / metrics.length)
        : 0;

      // Get rejection breakdown from import logs
      const rejectionLogs = await db
        .select()
        .from(importQualityLogs)
        .where(eq(importQualityLogs.status, 'rejected'));

      const rejectionBreakdown: Record<string, number> = {};
      rejectionLogs.forEach(log => {
        const reason = log.rejectionReason || 'unknown';
        rejectionBreakdown[reason] = (rejectionBreakdown[reason] || 0) + 1;
      });

      // Get recent issues (last 10 rejections)
      const recentIssues = rejectionLogs
        .slice(-10)
        .map(log => log.rejectionReason || 'Unknown issue')
        .filter((reason, index, arr) => arr.indexOf(reason) === index); // Remove duplicates

      return {
        totalProductsChecked,
        averageQualityScore,
        rejectionBreakdown,
        recentIssues
      };
    } catch (error) {
      console.error('Error getting quality dashboard stats:', error);
      return {
        totalProductsChecked: 0,
        averageQualityScore: 0,
        rejectionBreakdown: {},
        recentIssues: []
      };
    }
  }
}