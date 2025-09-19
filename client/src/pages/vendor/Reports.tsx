import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import VendorLayout from "@/components/vendor/VendorLayout";

export default function VendorReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('sales');

  // Mock data for reports
  const salesData = {
    totalRevenue: 12547.89,
    totalOrders: 234,
    averageOrderValue: 53.62,
    conversionRate: 3.2,
    revenueChange: 12.5,
    ordersChange: 8.3,
    aovChange: -2.1,
    conversionChange: 0.8
  };

  const productPerformance = [
    { name: "Wireless Headphones", sales: 45, revenue: 4049.55, rating: 4.8, change: 12.3 },
    { name: "Smart Watch", sales: 32, revenue: 6399.68, rating: 4.6, change: -5.2 },
    { name: "Bluetooth Speaker", sales: 28, revenue: 1287.72, rating: 4.9, change: 8.7 },
    { name: "Laptop Stand", sales: 22, revenue: 879.78, rating: 4.7, change: 15.4 },
    { name: "USB-C Hub", sales: 18, revenue: 1079.82, rating: 4.5, change: -3.1 }
  ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 8500 },
    { month: "Feb", revenue: 9200 },
    { month: "Mar", revenue: 8800 },
    { month: "Apr", revenue: 10500 },
    { month: "May", revenue: 11200 },
    { month: "Jun", revenue: 12548 }
  ];

  const orderStatusData = [
    { status: "Completed", count: 189, percentage: 80.8 },
    { status: "Processing", count: 28, percentage: 12.0 },
    { status: "Shipped", count: 12, percentage: 5.1 },
    { status: "Cancelled", count: 5, percentage: 2.1 }
  ];

  const customerMetrics = {
    totalCustomers: 1247,
    newCustomers: 89,
    returningCustomers: 158,
    customerRetention: 78.5
  };

  const periodOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: DollarSign },
    { value: 'products', label: 'Product Performance', icon: Package },
    { value: 'customers', label: 'Customer Analytics', icon: Users },
    { value: 'orders', label: 'Order Analysis', icon: ShoppingCart }
  ];

  const exportReport = () => {
    // Mock export functionality
    console.log('Exporting report...');
    alert('Report exported successfully!');
  };

  return (
    <VendorLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vendor Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Analyze your store performance and track key metrics
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Period:</span>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Report Type:</span>
                <div className="flex space-x-2">
                  {reportTypes.map(type => (
                    <Button
                      key={type.value}
                      variant={selectedReport === type.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedReport(type.value)}
                      className="flex items-center space-x-1"
                    >
                      <type.icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Overview */}
        {selectedReport === 'sales' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${salesData.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">+{salesData.revenueChange}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {salesData.totalOrders}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">+{salesData.ordersChange}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${salesData.averageOrderValue}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">{salesData.aovChange}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {salesData.conversionRate}%
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">+{salesData.conversionChange}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5" />
                  <span>Revenue Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {monthlyRevenue.map((data, index) => (
                    <div key={data.month} className="flex flex-col items-center space-y-2">
                      <div 
                        className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(data.revenue / 13000) * 200}px` }}
                        title={`${data.month}: $${data.revenue.toLocaleString()}`}
                      />
                      <span className="text-xs text-gray-500">{data.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Product Performance */}
        {selectedReport === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Product Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{product.sales} sales</span>
                        <span className="text-sm text-gray-500">${product.revenue.toLocaleString()}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500">{product.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {product.change > 0 ? (
                        <Badge variant="default" className="bg-green-500">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{product.change}%
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {product.change}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Analytics */}
        {selectedReport === 'customers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {customerMetrics.totalCustomers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {customerMetrics.newCustomers}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Returning Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {customerMetrics.returningCustomers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retention Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {customerMetrics.customerRetention}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Order Analysis */}
        {selectedReport === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Order Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderStatusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-gray-900 dark:text-white">{status.status}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{status.count} orders</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {status.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </VendorLayout>
  );
}
