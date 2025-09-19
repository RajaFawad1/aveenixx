import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  Calendar,
  FileText,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Briefcase,
  CreditCard,
  BarChart3,
  Headphones,
  Ticket,
  MessageSquare
} from 'lucide-react';
import { getJarvisInsights, type JarvisInsights } from '@/lib/api/jarvis';
import JarvisChat from '@/components/JarvisChat';
import Helpdesk from '@/pages/Helpdesk';

export default function JarvisDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [insights, setInsights] = useState<JarvisInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getJarvisInsights();
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch Jarvis insights:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto text-blue-600 mb-4 animate-pulse" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Jarvis is analyzing your data...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Failed to load Jarvis insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Bot className="w-16 h-16 mx-auto text-blue-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Jarvis AI Business Suite
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your intelligent business assistant providing insights across CRM, Invoicing, HR, and Analytics.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* AI Quick Insights */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Today's AI Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sales Today</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${insights.salesToday.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+15.3% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {insights.pendingOrders}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Clock className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">3 urgent orders</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Customers</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {insights.customerInsights.newCustomers}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">+28% this week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AOV</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${insights.customerInsights.averageOrderValue}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600">+12% this month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Suite Modules */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-none lg:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="crm">CRM</TabsTrigger>
              <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
              <TabsTrigger value="hr">HR Management</TabsTrigger>
              <TabsTrigger value="helpdesk">Helpdesk</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* CRM Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    CRM Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Leads</span>
                    <Badge>{insights.crmStats.activeLeads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Converted Today</span>
                    <Badge className="bg-green-100 text-green-800">{insights.crmStats.convertedLeads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming Tasks</span>
                    <Badge className="bg-blue-100 text-blue-800">{insights.crmStats.upcomingTasks}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overdue Tasks</span>
                    <Badge className="bg-red-100 text-red-800">{insights.crmStats.overdueTasks}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Invoicing Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Invoicing Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending Invoices</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{insights.invoiceStats.pendingInvoices}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overdue</span>
                    <Badge className="bg-red-100 text-red-800">{insights.invoiceStats.overdue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</span>
                    <span className="font-semibold">${insights.invoiceStats.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Recurring Revenue</span>
                    <span className="font-semibold text-green-600">${insights.invoiceStats.monthlyRecurring.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* HR Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    HR Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Employees</span>
                    <Badge>{insights.hrStats.totalEmployees}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">On Leave</span>
                    <Badge className="bg-blue-100 text-blue-800">{insights.hrStats.onLeave}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{insights.hrStats.pendingRequests}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Birthdays This Week</span>
                    <Badge className="bg-pink-100 text-pink-800">{insights.hrStats.birthdaysThisWeek}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Helpdesk Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Headphones className="w-5 h-5 mr-2" />
                    Helpdesk Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Open Tickets</span>
                    <Badge className="bg-red-100 text-red-800">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                    <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Resolved Today</span>
                    <Badge className="bg-green-100 text-green-800">15</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                    <span className="text-sm font-medium">2.5 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="crm" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-semibold">TechCorp Solutions</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise software inquiry</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Hot Lead</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-semibold">StartupXYZ</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">SaaS platform demo request</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Warm Lead</Badge>
                    </div>
                    <Button className="w-full">View All Leads</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Call completed with ABC Corp</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Demo scheduled for next week</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Lead converted to customer</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Invoicing Tab */}
          <TabsContent value="invoicing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="font-semibold">Invoice #INV-2024-001</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">TechCorp Solutions - $12,500</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div>
                        <p className="font-semibold">Invoice #INV-2024-002</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">StartupXYZ - $4,200</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                    <Button className="w-full">Create New Invoice</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Payment Time</span>
                      <span className="font-semibold">12.5 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Collection Rate</span>
                      <span className="font-semibold text-green-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Outstanding Amount</span>
                      <span className="font-semibold text-red-600">$18,300</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HR Tab */}
          <TabsContent value="hr" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-semibold">Sarah Johnson</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Vacation request - Dec 25-30</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="font-semibold">Mike Chen</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sick leave - Today</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                    <Button className="w-full">Manage All Requests</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Team meeting - Tomorrow 10 AM</p>
                        <p className="text-xs text-gray-500">Conference Room A</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-pink-600" />
                      <div>
                        <p className="text-sm font-medium">Alex's Birthday - Thursday</p>
                        <p className="text-xs text-gray-500">Engineering team</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <BarChart3 className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Revenue Growth</h3>
                    <p className="text-2xl font-bold text-blue-600">+23.5%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">vs last month</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Users className="w-12 h-12 mx-auto text-green-600 mb-4" />
                    <h3 className="font-semibold mb-2">Customer Acquisition</h3>
                    <p className="text-2xl font-bold text-green-600">+18.2%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">vs last month</p>
                  </div>
                  
                  <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <CreditCard className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                    <h3 className="font-semibold mb-2">Conversion Rate</h3>
                    <p className="text-2xl font-bold text-purple-600">4.8%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">vs 4.2% last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Helpdesk Tab */}
          <TabsContent value="helpdesk" className="space-y-6">
            <Helpdesk />
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* AI Chat Interface */}
              <div className="lg:col-span-2">
                <JarvisChat />
              </div>

              {/* AI Insights Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.orderSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.productSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Package className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Action Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Sales Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        Analyze Customer Trends
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <Package className="w-4 h-4 mr-2" />
                        Inventory Optimization
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Revenue Forecasting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}