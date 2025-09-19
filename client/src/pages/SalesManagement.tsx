import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import CustomerRewardsManagement from '@/components/CustomerRewardsManagement';
import MyOrders from './MyOrders';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  ArrowUpIcon,
  ArrowDownIcon,
  Activity,
  ShoppingCart,
  TrendingDown,
  Eye,
  Gift,
  Award,
  RefreshCw,
  List
} from 'lucide-react';

interface SalesStats {
  totalRevenue: number;
  monthlyGrowth: number;
  totalOrders: number;
  averageOrderValue: number;
  activeCustomers: number;
  conversionRate: number;
}

const SalesManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('sales-analytics');

  // Fetch sales dashboard stats
  const { data: salesStats, isLoading } = useQuery<SalesStats>({
    queryKey: ['/api/sales/dashboard/stats'],
    enabled: true
  });

  const stats = salesStats || {
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    activeCustomers: 0,
    conversionRate: 0
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sales-analytics':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Trend</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? 'Loading...' : `$${stats.totalRevenue.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sales Performance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? 'Loading...' : `${stats.totalOrders} Orders`}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Analytics</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? 'Loading...' : `${stats.conversionRate}%`}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sales Analytics Overview</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive sales performance analytics and revenue tracking will be displayed here. 
                  Connect your sales data sources to view detailed analytics, trends, and performance metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'sales-targets':
        return (
          <div className="space-y-5">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sales Targets & Goals</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Set and track sales targets, monitor goal progress, and manage team performance objectives. 
                  Configure quarterly targets, monthly goals, and individual performance metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'customer-insights':
        return (
          <div className="space-y-5">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Customer Insights & Behavior</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyze customer behavior, purchase patterns, and demographic insights. 
                  View customer lifetime value, retention rates, and segmentation analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'performance-reports':
        return (
          <div className="space-y-5">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Performance Reports & Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate comprehensive performance reports, sales analysis, and team productivity metrics. 
                  Export detailed reports and track key performance indicators across all sales channels.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'revenue-tracking':
        return (
          <div className="space-y-5">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Revenue Tracking & Forecasting</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor revenue streams, track financial performance, and forecast future earnings. 
                  View revenue by product, channel, and time period with advanced forecasting models.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'customer-rewards':
        return <CustomerRewardsManagement />;

      case 'sales-dashboard':
        return <div className="p-6 text-center text-gray-500">Sales Dashboard - Coming Soon</div>;

      case 'orders-management':
        return <div className="p-6 text-center text-gray-500">Orders Management - Coming Soon</div>;

      case 'returns-management':
        return <div className="p-6 text-center text-gray-500">Returns Management - Coming Soon</div>;

      case 'my-orders':
        return <MyOrders />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 p-5">
      {/* Professional Header Banner - Matching Product Management Design */}
      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-gray-800 dark:to-gray-900 border-0">
        <CardContent className="p-5">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Track sales performance and manage revenue across all channels</p>
            </div>
          </div>

          {/* Professional Stats Badges Row */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200/50 dark:border-purple-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">${isLoading ? '0' : stats.totalRevenue.toLocaleString()}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200/50 dark:border-purple-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{isLoading ? '0' : stats.monthlyGrowth}%</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Growth Rate</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200/50 dark:border-purple-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{isLoading ? '0' : stats.totalOrders}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Total Orders</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200/50 dark:border-purple-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">${isLoading ? '0' : stats.averageOrderValue}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Avg Order</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200/50 dark:border-purple-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{isLoading ? '0' : stats.activeCustomers}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Active Customers</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-purple-200/50 dark:border-purple-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{isLoading ? '0' : stats.conversionRate}%</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Conversion Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
        {[
          { key: 'sales-analytics', label: 'Sales Analytics', icon: BarChart3 },
          { key: 'sales-dashboard', label: 'Sales Dashboard', icon: Activity },
          { key: 'orders-management', label: 'Orders Management', icon: ShoppingCart },
          { key: 'returns-management', label: 'Returns & RMA', icon: RefreshCw },
          { key: 'my-orders', label: 'My Orders', icon: List },
          { key: 'sales-targets', label: 'Sales Targets', icon: Target },
          { key: 'customer-insights', label: 'Customer Insights', icon: Users },
          { key: 'performance-reports', label: 'Performance Reports', icon: TrendingUp },
          { key: 'revenue-tracking', label: 'Revenue Tracking', icon: DollarSign },
          { key: 'customer-rewards', label: 'Customer Rewards', icon: Award }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-5">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SalesManagement;