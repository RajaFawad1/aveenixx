import { storage } from "./storage";

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  topSellingProducts: ProductSales[];
  salesByCategory: CategorySales[];
  salesByMonth: MonthlySales[];
}

export interface ProductSales {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  averageRating: number;
}

export interface CategorySales {
  category: string;
  totalSold: number;
  totalRevenue: number;
  productCount: number;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageLifetimeValue: number;
  topCustomers: CustomerData[];
}

export interface CustomerData {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
}

export interface VendorAnalytics {
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  topVendors: VendorPerformance[];
  commissionGenerated: number;
}

export interface VendorPerformance {
  vendorId: number;
  businessName: string;
  totalSales: number;
  totalOrders: number;
  commission: number;
  rating: number;
}

export class AnalyticsService {
  async getSalesAnalytics(startDate?: Date, endDate?: Date): Promise<SalesAnalytics> {
    // Mock sales analytics data
    return {
      totalRevenue: 127450.75,
      totalOrders: 1342,
      averageOrderValue: 95.12,
      conversionRate: 3.2,
      topSellingProducts: [
        {
          productId: "prod_1",
          productName: "Sony WH-1000XM4 Wireless Headphones",
          totalSold: 145,
          totalRevenue: 50757.55,
          averageRating: 4.5
        },
        {
          productId: "prod_11",
          productName: "iPhone 15 Pro",
          totalSold: 89,
          totalRevenue: 88999.11,
          averageRating: 4.8
        },
        {
          productId: "prod_3",
          productName: "Samsung Galaxy S23 Ultra",
          totalSold: 76,
          totalRevenue: 91199.24,
          averageRating: 4.6
        },
        {
          productId: "prod_15",
          productName: "AirPods Pro (2nd Generation)",
          totalSold: 234,
          totalRevenue: 58497.66,
          averageRating: 4.7
        },
        {
          productId: "prod_9",
          productName: "Apple Watch Series 9",
          totalSold: 156,
          totalRevenue: 62399.44,
          averageRating: 4.6
        }
      ],
      salesByCategory: [
        { category: "Electronics", totalSold: 567, totalRevenue: 75429.32, productCount: 8 },
        { category: "Smartphones", totalSold: 234, totalRevenue: 45678.90, productCount: 3 },
        { category: "Computers", totalSold: 123, totalRevenue: 32145.67, productCount: 4 },
        { category: "Wearables", totalSold: 189, totalRevenue: 28934.56, productCount: 2 },
        { category: "Footwear", totalSold: 345, totalRevenue: 19876.43, productCount: 2 }
      ],
      salesByMonth: [
        { month: "January", revenue: 23456.78, orders: 234, averageOrderValue: 100.24 },
        { month: "February", revenue: 34567.89, orders: 298, averageOrderValue: 116.05 },
        { month: "March", revenue: 45678.90, orders: 387, averageOrderValue: 118.04 },
        { month: "April", revenue: 56789.01, orders: 456, averageOrderValue: 124.54 },
        { month: "May", revenue: 67890.12, orders: 534, averageOrderValue: 127.14 },
        { month: "June", revenue: 78901.23, orders: 612, averageOrderValue: 129.00 }
      ]
    };
  }

  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    // Mock customer analytics data
    return {
      totalCustomers: 2847,
      newCustomers: 342,
      returningCustomers: 1456,
      averageLifetimeValue: 287.45,
      topCustomers: [
        {
          userId: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          totalOrders: 23,
          totalSpent: 2456.78,
          lastOrderDate: new Date("2025-01-10")
        },
        {
          userId: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          totalOrders: 19,
          totalSpent: 1987.65,
          lastOrderDate: new Date("2025-01-12")
        },
        {
          userId: 3,
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@example.com",
          totalOrders: 16,
          totalSpent: 1765.43,
          lastOrderDate: new Date("2025-01-08")
        }
      ]
    };
  }

  async getVendorAnalytics(): Promise<VendorAnalytics> {
    // Mock vendor analytics data
    return {
      totalVendors: 156,
      activeVendors: 134,
      pendingVendors: 22,
      commissionGenerated: 19567.89,
      topVendors: [
        {
          vendorId: 1,
          businessName: "AVEENIX Electronics Store",
          totalSales: 45678.90,
          totalOrders: 234,
          commission: 6851.84,
          rating: 4.8
        },
        {
          vendorId: 2,
          businessName: "Tech Paradise",
          totalSales: 34567.89,
          totalOrders: 189,
          commission: 5185.18,
          rating: 4.6
        },
        {
          vendorId: 3,
          businessName: "Gadget World",
          totalSales: 23456.78,
          totalOrders: 145,
          commission: 3518.52,
          rating: 4.4
        }
      ]
    };
  }

  async getProductPerformance(productId: string): Promise<{
    views: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    averageRating: number;
    totalReviews: number;
  }> {
    // Mock product performance data
    return {
      views: 1234,
      conversions: 45,
      conversionRate: 3.65,
      revenue: 15749.55,
      averageRating: 4.5,
      totalReviews: 87
    };
  }

  async getRevenueByPeriod(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; revenue: number; orders: number }[]> {
    // Mock revenue data by period
    const data = [];
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(daysDiff, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.random() * 5000 + 1000,
        orders: Math.floor(Math.random() * 50) + 10
      });
    }
    
    return data;
  }

  async getInventoryAnalytics(): Promise<{
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalInventoryValue: number;
  }> {
    // Mock inventory analytics
    return {
      totalProducts: 1456,
      lowStockItems: 23,
      outOfStockItems: 7,
      totalInventoryValue: 287543.89
    };
  }

  async getConversionFunnel(): Promise<{
    visitors: number;
    productViews: number;
    addToCart: number;
    checkout: number;
    purchases: number;
  }> {
    // Mock conversion funnel data
    return {
      visitors: 45678,
      productViews: 23456,
      addToCart: 5678,
      checkout: 3456,
      purchases: 1234
    };
  }

  async getCustomerSegmentation(): Promise<{
    segment: string;
    customers: number;
    averageOrderValue: number;
    totalRevenue: number;
  }[]> {
    // Mock customer segmentation data
    return [
      { segment: "VIP Customers", customers: 234, averageOrderValue: 456.78, totalRevenue: 106934.52 },
      { segment: "Regular Customers", customers: 1456, averageOrderValue: 123.45, totalRevenue: 179743.20 },
      { segment: "New Customers", customers: 567, averageOrderValue: 67.89, totalRevenue: 38493.63 },
      { segment: "Inactive Customers", customers: 890, averageOrderValue: 45.67, totalRevenue: 40646.30 }
    ];
  }
}

export const analyticsService = new AnalyticsService();