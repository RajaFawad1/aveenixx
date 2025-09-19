import { z } from 'zod';

// Question classification and scoring system
export interface QuestionMetrics {
  problemSolvingScore: number;    // 0-100: How much it solves real problems
  businessValue: number;          // 0-100: Commercial/business relevance
  communityImpact: number;        // 0-100: How many people this could help
  searchability: number;          // 0-100: How findable/reusable this is
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  category: string;
  subcategory?: string;
  tags: string[];
}

export interface StorageDecision {
  storageLevel: 'full' | 'summary' | 'reference' | 'discard';
  retentionPeriod: number; // days
  indexPriority: 'high' | 'medium' | 'low';
  reason: string;
}

export class QuestionClassificationService {
  // Define high-value categories that deserve full storage
  private highValueCategories = [
    'business-strategy', 'technical-solutions', 'integration', 'troubleshooting',
    'best-practices', 'security', 'performance', 'compliance', 'automation',
    'data-management', 'user-experience', 'conversion-optimization'
  ];

  // Special retention categories with custom policies
  private specialRetentionCategories = {
    'health-wellness': { days: 1825, reason: 'Health information has long-term value' }, // 5 years
    'medical-natural-remedies': { days: 1825, reason: 'Natural remedies maintain relevance' }, // 5 years
    'legal-compliance': { days: 2555, reason: 'Legal information needs extended retention' }, // 7 years
    'financial-advice': { days: 1095, reason: 'Financial guidance has medium-term value' }, // 3 years
    'educational-learning': { days: 1460, reason: 'Educational content has enduring value' }, // 4 years
    'mental-health': { days: 1825, reason: 'Mental health resources need long retention' }, // 5 years
    'parenting-family': { days: 1095, reason: 'Family guidance has multi-year relevance' }, // 3 years
    'career-development': { days: 1095, reason: 'Career advice maintains relevance' }, // 3 years
    'safety-emergency': { days: 2190, reason: 'Safety information is critical long-term' }, // 6 years
  };

  // Low-value categories that get minimal storage
  private lowValueCategories = [
    'personal-preferences', 'subjective-opinions', 'casual-chat', 
    'entertainment', 'random-questions', 'off-topic'
  ];

  // Problem-solving keywords that indicate high value
  private problemSolvingKeywords = [
    'how to', 'best way', 'solution', 'fix', 'error', 'problem', 'issue',
    'optimize', 'improve', 'integrate', 'implement', 'configure', 'setup',
    'troubleshoot', 'debug', 'resolve', 'prevent', 'avoid'
  ];

  // Business-relevant keywords
  private businessKeywords = [
    'revenue', 'sales', 'customers', 'conversion', 'roi', 'profit', 'growth',
    'marketing', 'analytics', 'performance', 'efficiency', 'automation',
    'workflow', 'process', 'management', 'team', 'productivity'
  ];

  /**
   * Classify a question and determine storage strategy
   */
  public classifyQuestion(question: string, context?: any): QuestionMetrics & StorageDecision {
    const questionLower = question.toLowerCase();
    
    // Calculate problem-solving score
    const problemSolvingScore = this.calculateProblemSolvingScore(questionLower);
    
    // Calculate business value
    const businessValue = this.calculateBusinessValue(questionLower);
    
    // Estimate community impact
    const communityImpact = this.estimateCommunityImpact(questionLower, problemSolvingScore);
    
    // Calculate searchability
    const searchability = this.calculateSearchability(question);
    
    // Determine complexity
    const complexity = this.determineComplexity(questionLower);
    
    // Categorize the question
    const category = this.categorizeQuestion(questionLower);
    const tags = this.extractTags(questionLower);
    
    // Make storage decision
    const storageDecision = this.makeStorageDecision({
      problemSolvingScore,
      businessValue,
      communityImpact,
      searchability,
      complexity,
      category,
      tags
    });

    return {
      problemSolvingScore,
      businessValue,
      communityImpact,
      searchability,
      complexity,
      category,
      tags,
      ...storageDecision
    };
  }

  private calculateProblemSolvingScore(question: string): number {
    let score = 0;
    
    // Check for problem-solving keywords
    this.problemSolvingKeywords.forEach(keyword => {
      if (question.includes(keyword)) {
        score += 15;
      }
    });
    
    // Question format indicates problem-solving intent
    if (question.includes('?')) score += 10;
    if (question.startsWith('how')) score += 20;
    if (question.startsWith('why')) score += 15;
    if (question.startsWith('what')) score += 10;
    if (question.includes('error') || question.includes('problem')) score += 25;
    
    return Math.min(score, 100);
  }

  private calculateBusinessValue(question: string): number {
    let score = 0;
    
    // Check for business keywords
    this.businessKeywords.forEach(keyword => {
      if (question.includes(keyword)) {
        score += 12;
      }
    });
    
    // Technical implementation questions have business value
    if (question.includes('integrate') || question.includes('api') || question.includes('system')) {
      score += 20;
    }
    
    // Process improvement questions
    if (question.includes('optimize') || question.includes('improve') || question.includes('automate')) {
      score += 25;
    }
    
    return Math.min(score, 100);
  }

  private estimateCommunityImpact(question: string, problemSolvingScore: number): number {
    let impact = problemSolvingScore * 0.6; // Base on problem-solving potential
    
    // Common problems have higher impact
    const commonIssues = ['payment', 'login', 'setup', 'configuration', 'installation'];
    commonIssues.forEach(issue => {
      if (question.includes(issue)) {
        impact += 15;
      }
    });
    
    // Platform-specific questions have targeted impact
    if (question.includes('shopify') || question.includes('wordpress') || question.includes('stripe')) {
      impact += 10;
    }
    
    return Math.min(impact, 100);
  }

  private calculateSearchability(question: string): number {
    let score = 0;
    
    // Length affects searchability
    const words = question.split(' ').length;
    if (words >= 5 && words <= 15) score += 20; // Optimal length
    
    // Specific terms make it more searchable
    if (/\b(how|what|why|when|where)\b/i.test(question)) score += 15;
    
    // Technical terms improve searchability
    if (/\b(api|integration|database|security|performance)\b/i.test(question)) score += 20;
    
    // Clear structure
    if (question.includes('?')) score += 10;
    
    return Math.min(score, 100);
  }

  private determineComplexity(question: string): 'simple' | 'moderate' | 'complex' | 'expert' {
    const technicalTerms = question.match(/\b(api|database|server|configuration|integration|architecture|security|performance|optimization)\b/gi) || [];
    const questionLength = question.split(' ').length;
    
    if (technicalTerms.length >= 3 || questionLength > 20) return 'expert';
    if (technicalTerms.length >= 2 || questionLength > 15) return 'complex';
    if (technicalTerms.length >= 1 || questionLength > 8) return 'moderate';
    return 'simple';
  }

  private categorizeQuestion(question: string): string {
    const questionLower = question.toLowerCase();
    
    // Health & Wellness (high retention value)
    if (/\b(health|wellness|natural|remedy|remedies|cure|treatment|diet|nutrition|fitness|exercise|weight|medical|symptoms|pain|healing|herbs|supplements|vitamins|mental health|stress|anxiety|depression)\b/i.test(question)) {
      // More specific health categorization
      if (/\b(natural|remedy|remedies|herbs|supplements|alternative|holistic)\b/i.test(question)) {
        return 'medical-natural-remedies';
      }
      if (/\b(mental|stress|anxiety|depression|therapy|counseling)\b/i.test(question)) {
        return 'mental-health';
      }
      return 'health-wellness';
    }
    
    // Legal & Compliance
    if (/\b(legal|law|compliance|regulation|gdpr|privacy|terms|policy|contract|license|copyright|trademark)\b/i.test(question)) {
      return 'legal-compliance';
    }
    
    // Financial & Investment
    if (/\b(finance|financial|money|investment|budget|tax|accounting|profit|loss|revenue|roi|income|salary|credit|debt|loan|insurance)\b/i.test(question)) {
      return 'financial-advice';
    }
    
    // Education & Learning
    if (/\b(learn|learning|education|study|course|tutorial|training|skill|knowledge|teach|explain|understand)\b/i.test(question)) {
      return 'educational-learning';
    }
    
    // Parenting & Family
    if (/\b(parent|parenting|child|children|family|baby|toddler|teenager|discipline|development|growth)\b/i.test(question)) {
      return 'parenting-family';
    }
    
    // Career & Development
    if (/\b(career|job|work|employment|resume|interview|professional|development|promotion|leadership|management)\b/i.test(question)) {
      return 'career-development';
    }
    
    // Safety & Emergency
    if (/\b(safety|emergency|danger|risk|security|protection|accident|injury|first aid|disaster|evacuation)\b/i.test(question)) {
      return 'safety-emergency';
    }
    
    // E-commerce related
    if (/\b(payment|checkout|cart|order|product|shipping|inventory|ecommerce|store|shop)\b/i.test(question)) {
      return 'ecommerce';
    }
    
    // Technical integration
    if (/\b(api|integration|webhook|database|server|code|programming|software|development)\b/i.test(question)) {
      return 'technical-integration';
    }
    
    // Business operations
    if (/\b(business|strategy|marketing|sales|customer|revenue|operations|process|workflow)\b/i.test(question)) {
      return 'business-operations';
    }
    
    // UI/UX related
    if (/\b(design|interface|user|experience|layout|theme|ui|ux|usability)\b/i.test(question)) {
      return 'user-experience';
    }
    
    // Security related
    if (/\b(security|authentication|permission|access|login|password|encryption|cybersecurity)\b/i.test(question)) {
      return 'security';
    }
    
    // Personal/subjective (low value)
    if (/\b(favorite|prefer|like|opinion|think|feel|taste|personal|subjective)\b/i.test(question)) {
      return 'personal-preference';
    }
    
    return 'general';
  }

  private extractTags(question: string): string[] {
    const tags: string[] = [];
    
    // Common platform tags
    const platforms = ['stripe', 'paypal', 'shopify', 'wordpress', 'facebook', 'google', 'amazon'];
    platforms.forEach(platform => {
      if (question.includes(platform)) tags.push(platform);
    });
    
    // Technical tags
    const techTerms = ['api', 'database', 'security', 'performance', 'integration', 'automation'];
    techTerms.forEach(term => {
      if (question.includes(term)) tags.push(term);
    });
    
    return tags;
  }

  private makeStorageDecision(metrics: QuestionMetrics): StorageDecision {
    const totalScore = (
      metrics.problemSolvingScore * 0.4 +
      metrics.businessValue * 0.3 +
      metrics.communityImpact * 0.2 +
      metrics.searchability * 0.1
    );

    // Check for special retention categories first (health, legal, etc.)
    if (metrics.category in this.specialRetentionCategories) {
      const specialCategory = this.specialRetentionCategories[metrics.category as keyof typeof this.specialRetentionCategories];
      
      // Determine storage level based on retention period and content value
      let storageLevel: 'full' | 'summary' | 'reference' | 'discard';
      if (specialCategory.days >= 1825 || totalScore >= 50) { // 5+ years or decent score
        storageLevel = 'full';
      } else if (specialCategory.days >= 1095) { // 3+ years
        storageLevel = 'summary';
      } else {
        storageLevel = totalScore >= 30 ? 'summary' : 'reference';
      }
      
      return {
        storageLevel,
        retentionPeriod: specialCategory.days,
        indexPriority: specialCategory.days >= 1825 ? 'high' : 'medium',
        reason: `Special retention category: ${specialCategory.reason} (${specialCategory.days} days)`
      };
    }

    // Standard storage decision logic for other categories
    if (totalScore >= 70 || this.highValueCategories.includes(metrics.category)) {
      return {
        storageLevel: 'full',
        retentionPeriod: 730, // 2 years
        indexPriority: 'high',
        reason: `High-value content (score: ${totalScore.toFixed(1)}) with strong problem-solving potential`
      };
    }
    
    // Medium-value content: Summary storage
    if (totalScore >= 40) {
      return {
        storageLevel: 'summary',
        retentionPeriod: 365, // 1 year
        indexPriority: 'medium',
        reason: `Moderate value content (score: ${totalScore.toFixed(1)}) - storing summary with external links`
      };
    }
    
    // Low-value content: Reference only
    if (totalScore >= 20 && !this.lowValueCategories.includes(metrics.category)) {
      return {
        storageLevel: 'reference',
        retentionPeriod: 90, // 3 months
        indexPriority: 'low',
        reason: `Low value but potentially useful - storing reference with links to full content`
      };
    }
    
    // Very low value: Discard after short period
    return {
      storageLevel: 'discard',
      retentionPeriod: 7, // 1 week
      indexPriority: 'low',
      reason: `Very low value content (score: ${totalScore.toFixed(1)}) - minimal storage, auto-cleanup`
    };
  }
}

export const questionClassifier = new QuestionClassificationService();