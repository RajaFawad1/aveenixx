import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Target,
  BarChart3,
  Activity,
  Award,
  Package,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Zap,
  Database,
  Wifi,
  HardDrive
} from 'lucide-react';

interface DashboardStats {
  [key: string]: any;
}

const SuperAdminDashboard = ({ data }: { data: DashboardStats }) => (
  <div className="space-y-6">
    {/* Platform Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.totalUsers?.toLocaleString() || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Platform Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(data.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(data.totalOrders || 0).toLocaleString()}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.activeVendors || 0}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Platform Metrics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm">System Uptime</span>
            </div>
            <Badge variant="secondary">{data.platformMetrics?.systemUptime || 0}%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm">API Calls Today</span>
            </div>
            <span className="font-medium">{(data.platformMetrics?.apiCallsToday || 0).toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>{data.platformMetrics?.storageUsed || 0}%</span>
            </div>
            <Progress value={data.platformMetrics?.storageUsed || 0} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bandwidth Used</span>
              <span>{data.platformMetrics?.bandwidthUsed || 0}%</span>
            </div>
            <Progress value={data.platformMetrics?.bandwidthUsed || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Performing Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.topSellingCategories || []).map((category: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ${category.revenue?.toLocaleString()} revenue
                </p>
              </div>
              <div className="text-right">
                <Badge variant={category.growth > 20 ? "default" : "secondary"}>
                  +{category.growth}%
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const AdminDashboard = ({ data }: { data: DashboardStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Company Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(data.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                +{data.monthlyGrowth || 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(data.totalOrders || 0).toLocaleString()}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(data.activeCustomers || 0).toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold">{data.teamMetrics?.totalTeamMembers || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{data.teamMetrics?.supportTickets || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Support Tickets</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.teamMetrics?.processingOrders || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing Orders</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{data.teamMetrics?.pendingReviews || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.departmentPerformance || []).map((dept: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{dept.department}</span>
                {dept.percentage && (
                  <Badge variant={dept.percentage >= 100 ? "default" : "secondary"}>
                    {dept.percentage.toFixed(1)}%
                  </Badge>
                )}
              </div>
              {dept.target && (
                <div>
                  <Progress value={Math.min(100, dept.percentage || 0)} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>${(dept.achieved || 0).toLocaleString()}</span>
                    <span>Target: ${(dept.target || 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const VendorDashboard = ({ data }: { data: DashboardStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(data.myRevenue || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.myOrders || 0}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.myProducts || 0}
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.myCustomers || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{data.inventory?.inStock || 0}</p>
              <p className="text-sm text-green-700 dark:text-green-400">In Stock</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{data.inventory?.lowStock || 0}</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">Low Stock</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{data.inventory?.outOfStock || 0}</p>
              <p className="text-sm text-red-700 dark:text-red-400">Out of Stock</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.inventory?.pendingRestock || 0}</p>
              <p className="text-sm text-blue-700 dark:text-blue-400">Pending Restock</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.topSellingProducts || []).map((product: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.sales} sales
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(product.revenue || 0).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const CustomerDashboard = ({ data }: { data: DashboardStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.totalOrders || 0}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(data.totalSpent || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reward Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(data.rewardsPoints || 0).toLocaleString()}
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Membership</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.membershipLevel || 'Basic'}
              </p>
            </div>
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.recentOrders || []).map((order: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.amount}</p>
                <Badge variant={
                  order.status === 'delivered' ? 'default' : 
                  order.status === 'shipped' ? 'secondary' : 'outline'
                }>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Favorite Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.favoriteCategories || []).map((category: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.orders} orders
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${category.spent?.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const BusinessDashboard = ({ data }: { data: DashboardStats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Business Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(data.businessRevenue || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.totalProjects || 0}
              </p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.activeClients || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.teamSize || 0}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{data.businessMetrics?.projectsCompleted || 0}</p>
              <p className="text-sm text-green-700 dark:text-green-400">Projects Completed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.businessMetrics?.clientSatisfaction || 0}%</p>
              <p className="text-sm text-blue-700 dark:text-blue-400">Client Satisfaction</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">${(data.businessMetrics?.averageProjectValue || 0).toLocaleString()}</p>
              <p className="text-sm text-purple-700 dark:text-purple-400">Avg Project Value</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{data.businessMetrics?.recurringClients || 0}</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">Recurring Clients</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.servicePerformance || []).map((service: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{service.service}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.clients} clients
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(service.revenue || 0).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function RoleBasedDashboard() {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState<string>('customer');

  // Get role from user context or use role switching from System Administration
  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
    } else {
      // Check for role switching from System Administration
      const roleFromStorage = localStorage.getItem('selected-role') || 'customer';
      setCurrentRole(roleFromStorage);
    }
  }, [user]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/dashboard/stats/${currentRole}`],
    enabled: !!currentRole,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (currentRole) {
      case 'superadmin':
        return <SuperAdminDashboard data={dashboardData || {}} />;
      case 'admin':
        return <AdminDashboard data={dashboardData || {}} />;
      case 'vendor':
        return <VendorDashboard data={dashboardData || {}} />;
      case 'customer':
        return <CustomerDashboard data={dashboardData || {}} />;
      case 'business':
        return <BusinessDashboard data={dashboardData || {}} />;
      default:
        return <CustomerDashboard data={dashboardData || {}} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Role indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentRole === 'superadmin' && 'Platform-wide control and monitoring across all modules and vendors'}
            {currentRole === 'admin' && 'Company-level administration and team management'}
            {currentRole === 'vendor' && 'Manage your store, products, and customer relationships'}
            {currentRole === 'customer' && 'Track orders, manage account, and discover recommendations'}
            {currentRole === 'business' && 'Manage business operations, projects, and client relationships'}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {currentRole}
        </Badge>
      </div>

      {renderDashboard()}
    </div>
  );
}