import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Package, 
  Users,
  BarChart3,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Globe,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface KPIMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: string;
  status: 'good' | 'warning' | 'danger';
}

interface ExecutiveDashboardProps {
  className?: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ className }) => {
  const [kpiData, setKpiData] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchKPIData();
  }, [selectedPeriod]);

  const fetchKPIData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/executive/kpis?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setKpiData(data);
      }
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockKPIData: KPIMetric[] = [
    {
      label: 'Product Approval Rate',
      value: '87.3%',
      change: 5.2,
      trend: 'up',
      target: '90%',
      status: 'warning'
    },
    {
      label: 'Avg. Time to Market',
      value: '3.4 days',
      change: -12.5,
      trend: 'up',
      target: '2.5 days',
      status: 'good'
    },
    {
      label: 'Revenue Impact',
      value: '$847K',
      change: 23.7,
      trend: 'up',
      status: 'good'
    },
    {
      label: 'Active Products',
      value: '2,847',
      change: 8.9,
      trend: 'up',
      status: 'good'
    },
    {
      label: 'Quality Score',
      value: '4.2/5.0',
      change: 0.3,
      trend: 'up',
      target: '4.5/5.0',
      status: 'good'
    },
    {
      label: 'Rejection Rate',
      value: '12.7%',
      change: -3.1,
      trend: 'up',
      target: '<10%',
      status: 'warning'
    }
  ];

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' && change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'up' && change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'danger': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return 'default';
      case 'warning': return 'secondary';
      case 'danger': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Executive Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time KPIs and business intelligence for product management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={fetchKPIData} variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(kpiData.length > 0 ? kpiData : mockKPIData).map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {metric.label}
                      </p>
                      <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}
                      </p>
                    </div>
                    <Badge variant={getStatusBadge(metric.status) as any}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend, metric.change)}
                      <span className={`text-sm font-medium ${
                        metric.change > 0 ? 'text-green-600' : 
                        metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                      <span className="text-sm text-gray-500">vs last period</span>
                    </div>
                    
                    {metric.target && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Target</p>
                        <p className="text-sm font-medium">{metric.target}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Approval efficiency improving
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Time-to-market reduced by 12.5% this month
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Quality threshold attention needed
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      12.7% rejection rate above target of 10%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                      Revenue impact trending positive
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      23.7% increase in revenue attribution
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Reduce rejection rate</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Focus on quality guidelines
                    </p>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Optimize approval workflow</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Streamline review process
                    </p>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Expand market analysis</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enhance competitive intelligence
                    </p>
                  </div>
                  <Badge variant="outline">Low</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Approval Rate</span>
                    <span className="text-sm">87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm">84.0%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Time Efficiency</span>
                    <span className="text-sm">76.5%</span>
                  </div>
                  <Progress value={76.5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Electronics', score: 92, change: 5.2 },
                    { category: 'Fashion', score: 88, change: -2.1 },
                    { category: 'Home & Garden', score: 85, change: 3.7 },
                    { category: 'Health & Beauty', score: 79, change: 1.4 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm">{item.score}%</span>
                        </div>
                        <Progress value={item.score} className="h-2" />
                      </div>
                      <div className="ml-4 text-right">
                        <span className={`text-sm font-medium ${
                          item.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Predictive Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Next 30 Days</h4>
                  <p className="text-2xl font-bold text-blue-600">+847</p>
                  <p className="text-sm text-gray-600">Expected products</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Revenue Forecast</h4>
                  <p className="text-2xl font-bold text-green-600">$1.2M</p>
                  <p className="text-sm text-gray-600">Projected impact</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Seasonal Trend</h4>
                  <p className="text-2xl font-bold text-purple-600">↗ Peak</p>
                  <p className="text-sm text-gray-600">Q4 demand surge</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  ML Model Insights
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Electronics category shows 89% confidence for growth</li>
                  <li>• Holiday season preparation should begin in 3 weeks</li>
                  <li>• Quality review process optimization could improve efficiency by 15%</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benchmarks Tab */}
        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Industry Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    metric: 'Product Approval Rate',
                    ourValue: 87.3,
                    industryAvg: 82.1,
                    topQuartile: 94.2,
                    status: 'above_avg'
                  },
                  {
                    metric: 'Time to Market',
                    ourValue: 3.4,
                    industryAvg: 4.7,
                    topQuartile: 2.1,
                    status: 'above_avg',
                    unit: 'days'
                  },
                  {
                    metric: 'Quality Score',
                    ourValue: 4.2,
                    industryAvg: 3.8,
                    topQuartile: 4.6,
                    status: 'above_avg',
                    unit: '/5.0'
                  },
                  {
                    metric: 'Rejection Rate',
                    ourValue: 12.7,
                    industryAvg: 15.3,
                    topQuartile: 8.2,
                    status: 'above_avg',
                    unit: '%',
                    inverse: true
                  }
                ].map((benchmark, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{benchmark.metric}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Our: <strong>{benchmark.ourValue}{benchmark.unit || '%'}</strong></span>
                        <span className="text-gray-500">Industry: {benchmark.industryAvg}{benchmark.unit || '%'}</span>
                        <span className="text-blue-600">Top 25%: {benchmark.topQuartile}{benchmark.unit || '%'}</span>
                      </div>
                    </div>
                    
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                        style={{ 
                          width: `${benchmark.inverse ? 
                            Math.max(0, 100 - (benchmark.ourValue / Math.max(benchmark.industryAvg, benchmark.topQuartile) * 100)) :
                            (benchmark.ourValue / Math.max(benchmark.industryAvg, benchmark.topQuartile) * 100)
                          }%` 
                        }}
                      />
                      <div 
                        className="absolute top-1 h-2 w-0.5 bg-yellow-500"
                        style={{ 
                          left: `${benchmark.inverse ? 
                            Math.max(0, 100 - (benchmark.industryAvg / Math.max(benchmark.industryAvg, benchmark.topQuartile) * 100)) :
                            (benchmark.industryAvg / Math.max(benchmark.industryAvg, benchmark.topQuartile) * 100)
                          }%` 
                        }}
                      />
                      <div 
                        className="absolute top-1 h-2 w-0.5 bg-green-500"
                        style={{ 
                          left: `${benchmark.inverse ? 
                            Math.max(0, 100 - (benchmark.topQuartile / Math.max(benchmark.industryAvg, benchmark.topQuartile) * 100)) :
                            (benchmark.topQuartile / Math.max(benchmark.industryAvg, benchmark.topQuartile) * 100)
                          }%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;