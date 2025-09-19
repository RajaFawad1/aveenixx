// Mock API for Jarvis AI insights - replace with real API calls
export interface JarvisInsights {
  salesToday: number;
  pendingOrders: number;
  orderSuggestions: string[];
  productSuggestions: string[];
  customerInsights: {
    totalCustomers: number;
    newCustomers: number;
    topCustomer: string;
    averageOrderValue: number;
  };
  crmStats: {
    activeLeads: number;
    convertedLeads: number;
    upcomingTasks: number;
    overdueTasks: number;
  };
  invoiceStats: {
    pendingInvoices: number;
    overdue: number;
    totalRevenue: number;
    monthlyRecurring: number;
  };
  hrStats: {
    totalEmployees: number;
    onLeave: number;
    pendingRequests: number;
    birthdaysThisWeek: number;
  };
}

export async function getJarvisInsights(): Promise<JarvisInsights> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    salesToday: 12450.75,
    pendingOrders: 23,
    orderSuggestions: [
      "Follow up with pending order #1234 - customer inquiry 2 days ago",
      "Restock iPhone cases - low inventory detected",
      "Promote wireless headphones - high conversion rate this week"
    ],
    productSuggestions: [
      "Bundle smartphone accessories for 15% higher AOV",
      "Cross-sell laptop bags with laptop purchases",
      "Recommend premium warranty for electronics orders"
    ],
    customerInsights: {
      totalCustomers: 15847,
      newCustomers: 234,
      topCustomer: "TechCorp Solutions",
      averageOrderValue: 127.50
    },
    crmStats: {
      activeLeads: 145,
      convertedLeads: 23,
      upcomingTasks: 18,
      overdueTasks: 3
    },
    invoiceStats: {
      pendingInvoices: 12,
      overdue: 4,
      totalRevenue: 284650,
      monthlyRecurring: 45200
    },
    hrStats: {
      totalEmployees: 156,
      onLeave: 8,
      pendingRequests: 5,
      birthdaysThisWeek: 3
    }
  };
}