import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import {
  Users,
  Shield,
  Settings,
  CreditCard,
  BarChart3,
  Database,
  Globe,
  Activity,
  FileText,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface AdminModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  status: 'active' | 'maintenance' | 'disabled';
  userCount?: number;
  priority: 'high' | 'medium' | 'low';
}

export function AdminDashboard() {
  const adminModules: AdminModule[] = [
    {
      id: 'users',
      name: 'User Management',
      description: 'Manage user accounts, permissions, and access control',
      icon: <Users className="w-6 h-6" />,
      href: '/admin/users',
      status: 'active',
      userCount: 15847,
      priority: 'high'
    },
    {
      id: 'roles',
      name: 'Roles & Permissions',
      description: 'Configure role-based access control and security settings',
      icon: <Shield className="w-6 h-6" />,
      href: '/admin/roles',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'modules',
      name: 'Module Management',
      description: 'Monitor and configure platform modules and applications',
      icon: <Settings className="w-6 h-6" />,
      href: '/admin/modules',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 'billing',
      name: 'Billing & Subscriptions',
      description: 'Manage billing, payments, and subscription plans',
      icon: <CreditCard className="w-6 h-6" />,
      href: '/admin/billing',
      status: 'active',
      userCount: 8234,
      priority: 'high'
    },
    {
      id: 'analytics',
      name: 'Platform Analytics',
      description: 'View detailed analytics and performance metrics',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/admin/analytics',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 'database',
      name: 'Database Management',
      description: 'Monitor database performance and manage backups',
      icon: <Database className="w-6 h-6" />,
      href: '/admin/database',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 'domains',
      name: 'Domain & DNS',
      description: 'Manage custom domains and DNS configurations',
      icon: <Globe className="w-6 h-6" />,
      href: '/admin/domains',
      status: 'active',
      priority: 'low'
    },
    {
      id: 'monitoring',
      name: 'System Monitoring',
      description: 'Real-time system health and performance monitoring',
      icon: <Activity className="w-6 h-6" />,
      href: '/admin/monitoring',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'audit',
      name: 'Audit Logs',
      description: 'Security audit logs and activity tracking',
      icon: <FileText className="w-6 h-6" />,
      href: '/admin/audit',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'integrations',
      name: 'API & Integrations',
      description: 'Manage third-party integrations and API keys',
      icon: <Zap className="w-6 h-6" />,
      href: '/admin/integrations',
      status: 'maintenance',
      priority: 'medium'
    }
  ];

  const platformStats = {
    totalUsers: 15847,
    activeModules: 8,
    monthlyRevenue: 284650,
    systemUptime: 99.97
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'disabled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {platformStats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Modules</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {platformStats.activeModules}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Activity className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm text-blue-600">All systems operational</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${platformStats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {platformStats.systemUptime}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Activity className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">Excellent performance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/admin/users/new">
                <Users className="w-4 h-4 mr-2" />
                Add User
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/admin/modules/deploy">
                <Zap className="w-4 h-4 mr-2" />
                Deploy Module
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/admin/database/backup">
                <Database className="w-4 h-4 mr-2" />
                Create Backup
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/admin/monitoring">
                <Activity className="w-4 h-4 mr-2" />
                System Status
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/admin/audit">
                <FileText className="w-4 h-4 mr-2" />
                View Logs
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Modules */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Administration Modules
          </h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-100 text-red-800">
              {adminModules.filter(m => m.priority === 'high').length} High Priority
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800">
              {adminModules.filter(m => m.status === 'maintenance').length} In Maintenance
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <Card 
              key={module.id} 
              className={`hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${getPriorityColor(module.priority)}`}
            >
              <Link href={module.href}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {module.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                      {module.status === 'maintenance' && (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {module.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {module.userCount && (
                        <span>{module.userCount.toLocaleString()} users</span>
                      )}
                      <Badge 
                        variant="outline" 
                        className={
                          module.priority === 'high' ? 'border-red-200 text-red-700' :
                          module.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                          'border-green-200 text-green-700'
                        }
                      >
                        {module.priority} priority
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            System Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  API & Integrations module is under maintenance
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Scheduled maintenance window: 2:00 AM - 4:00 AM UTC
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  User registration increased by 25% this week
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Consider upgrading server capacity if trend continues
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Database backup completed successfully
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Last backup: Today at 3:00 AM UTC (2.4 GB)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}