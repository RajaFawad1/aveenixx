// API Rate Tracking Service for WooCommerce and other external APIs
export class ApiRateTracker {
  private static instance: ApiRateTracker;
  private requestCounts: Map<string, { count: number; resetTime: number; limit: number }> = new Map();

  private constructor() {}

  public static getInstance(): ApiRateTracker {
    if (!ApiRateTracker.instance) {
      ApiRateTracker.instance = new ApiRateTracker();
    }
    return ApiRateTracker.instance;
  }

  // Track API request for a specific service (e.g., 'woocommerce', 'stripe', etc.)
  public trackRequest(service: string, limit: number = 1000, windowHours: number = 1): void {
    const now = Date.now();
    const windowMs = windowHours * 60 * 60 * 1000; // Convert hours to milliseconds
    const key = service.toLowerCase();
    
    const current = this.requestCounts.get(key);
    
    if (!current || now >= current.resetTime) {
      // Reset window
      this.requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs,
        limit
      });
    } else {
      // Increment count
      current.count++;
      this.requestCounts.set(key, current);
    }
  }

  // Get current usage for a service
  public getUsage(service: string): { used: number; limit: number; remaining: number; resetTime: number } | null {
    const key = service.toLowerCase();
    const current = this.requestCounts.get(key);
    
    if (!current) {
      return null;
    }

    const now = Date.now();
    if (now >= current.resetTime) {
      // Window expired, return fresh state
      return {
        used: 0,
        limit: current.limit,
        remaining: current.limit,
        resetTime: current.resetTime
      };
    }

    return {
      used: current.count,
      limit: current.limit,
      remaining: Math.max(0, current.limit - current.count),
      resetTime: current.resetTime
    };
  }

  // Get usage percentage for UI display
  public getUsagePercentage(service: string): number {
    const usage = this.getUsage(service);
    if (!usage) return 0;
    
    return Math.min(100, (usage.used / usage.limit) * 100);
  }

  // Check if service is near rate limit
  public isNearLimit(service: string, threshold: number = 0.8): boolean {
    const usage = this.getUsage(service);
    if (!usage) return false;
    
    return usage.used >= (usage.limit * threshold);
  }

  // Get all tracked services
  public getAllUsage(): Record<string, { used: number; limit: number; remaining: number; resetTime: number }> {
    const result: Record<string, { used: number; limit: number; remaining: number; resetTime: number }> = {};
    
    for (const [service] of this.requestCounts) {
      const usage = this.getUsage(service);
      if (usage) {
        result[service] = usage;
      }
    }
    
    return result;
  }
}

export const apiRateTracker = ApiRateTracker.getInstance();