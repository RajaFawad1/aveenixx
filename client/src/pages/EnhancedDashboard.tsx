import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  BarChart3, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  Truck
} from 'lucide-react';

interface DashboardData {
  salesAnalytics: any;
  customerAnalytics: any;
  vendorAnalytics: any;
  inventoryReport: any;
  conversionFunnel: any;
  recentOrders: any[];
  lowStockItems: any[];
}

export default function EnhancedDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchDashboardData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (authToken: string) => {
    try {
      const [salesRes, customerRes, vendorRes, inventoryRes, funnelRes] = await Promise.all([
        fetch('/api/analytics/sales', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/analytics/customers', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/analytics/vendors', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/inventory/report', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        }),
        fetch('/api/analytics/conversion-funnel', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        })
      ]);

      const dashboardData: DashboardData = {
        salesAnalytics: salesRes.ok ? await salesRes.json() : null,
        customerAnalytics: customerRes.ok ? await customerRes.json() : null,
        vendorAnalytics: vendorRes.ok ? await vendorRes.json() : null,
        inventoryReport: inventoryRes.ok ? await inventoryRes.json() : null,
        conversionFunnel: funnelRes.ok ? await funnelRes.json() : null,
        recentOrders: [],
        lowStockItems: []
      };

      setData(dashboardData);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (token) {
      setLoading(true);
      fetchDashboardData(token);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please login to access the enhanced dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => window.location.href = '/'}>
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Enhanced E-Commerce Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive analytics and management interface
            </p>
          </div>
          <Button onClick={refreshData} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${data?.salesAnalytics?.totalRevenue?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.salesAnalytics?.totalOrders?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.customerAnalytics?.totalCustomers?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data?.vendorAnalytics?.activeVendors || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +5.3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>Track customer journey through purchase process</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.conversionFunnel && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Visitors</span>
                        <span className="text-sm font-medium">
                          {data.conversionFunnel.visitors?.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Product Views</span>
                        <span className="text-sm font-medium">
                          {data.conversionFunnel.productViews?.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(data.conversionFunnel.productViews / data.conversionFunnel.visitors) * 100} 
                        className="h-2" 
                      />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Add to Cart</span>
                        <span className="text-sm font-medium">
                          {data.conversionFunnel.addToCart?.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(data.conversionFunnel.addToCart / data.conversionFunnel.visitors) * 100} 
                        className="h-2" 
                      />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Purchases</span>
                        <span className="text-sm font-medium">
                          {data.conversionFunnel.purchases?.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(data.conversionFunnel.purchases / data.conversionFunnel.visitors) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Current inventory health overview</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.inventoryReport && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Total Products</span>
                        </div>
                        <span className="text-sm font-medium">
                          {data.inventoryReport.totalProducts}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Total Stock</span>
                        </div>
                        <span className="text-sm font-medium">
                          {data.inventoryReport.totalStock}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Low Stock Items</span>
                        </div>
                        <span className="text-sm font-medium">
                          {data.inventoryReport.lowStockItems}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Reorder Required</span>
                        </div>
                        <span className="text-sm font-medium">
                          {data.inventoryReport.reorderRequired}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Products with highest sales volume</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.salesAnalytics?.topSellingProducts?.map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.totalSold} sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${product.totalRevenue?.toLocaleString()}</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.averageRating}
                          </span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Revenue breakdown by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.salesAnalytics?.salesByCategory?.map((category: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.productCount} products
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${category.totalRevenue?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.totalSold} sold
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Overview</CardTitle>
                  <CardDescription>Key customer metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.customerAnalytics && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Customers</span>
                        <span className="text-sm font-medium">
                          {data.customerAnalytics.totalCustomers?.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Customers</span>
                        <span className="text-sm font-medium">
                          {data.customerAnalytics.newCustomers?.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Returning Customers</span>
                        <span className="text-sm font-medium">
                          {data.customerAnalytics.returningCustomers?.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Lifetime Value</span>
                        <span className="text-sm font-medium">
                          ${data.customerAnalytics.averageLifetimeValue?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Customers with highest purchase value</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.customerAnalytics?.topCustomers?.map((customer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {customer.totalOrders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${customer.totalSpent?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(customer.lastOrderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                  <CardDescription>Current inventory status</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.inventoryReport && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {data.inventoryReport.totalProducts}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {data.inventoryReport.totalStock}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Stock</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">
                          {data.inventoryReport.lowStockItems}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>Products requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Low Stock Items</span>
                      <Badge variant="secondary">{data?.inventoryReport?.lowStockItems || 0}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Reorder Required</span>
                      <Badge variant="destructive">{data?.inventoryReport?.reorderRequired || 0}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Reserved Stock</span>
                      <Badge variant="outline">{data?.inventoryReport?.totalReserved || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium">
                        {data?.salesAnalytics?.conversionRate}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Order Value</span>
                      <span className="text-sm font-medium">
                        ${data?.salesAnalytics?.averageOrderValue?.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Lifetime Value</span>
                      <span className="text-sm font-medium">
                        ${data?.customerAnalytics?.averageLifetimeValue?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Platform operational status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">API Status</span>
                      </div>
                      <Badge variant="default" className="bg-green-500">Operational</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Database</span>
                      </div>
                      <Badge variant="default" className="bg-green-500">Healthy</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Payment System</span>
                      </div>
                      <Badge variant="default" className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}