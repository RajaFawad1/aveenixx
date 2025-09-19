import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  TrendingUp, 
  Award, 
  Target, 
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  Medal,
  Trophy,
  Star
} from 'lucide-react';

interface BenchmarkMetric {
  id: string;
  name: string;
  category: string;
  ourValue: number;
  industryAverage: number;
  topQuartile: number;
  topDecile: number;
  unit: string;
  isInverse?: boolean; // For metrics where lower is better (like rejection rate)
  description: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface CompetitorData {
  id: string;
  name: string;
  metrics: { [key: string]: number };
  marketShare: number;
  category: string;
}

interface PerformanceBenchmarkingProps {
  className?: string;
}

const PerformanceBenchmarking: React.FC<PerformanceBenchmarkingProps> = ({ className }) => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkMetric[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('ecommerce');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadBenchmarkData();
  }, [selectedIndustry, selectedCategory]);

  const loadBenchmarkData = async () => {
    setLoading(true);
    try {
      const [benchmarksResponse, competitorsResponse] = await Promise.all([
        fetch(`/api/benchmarks/metrics?industry=${selectedIndustry}&category=${selectedCategory}`),
        fetch(`/api/benchmarks/competitors?industry=${selectedIndustry}`)
      ]);

      if (benchmarksResponse.ok) {
        const benchmarksData = await benchmarksResponse.json();
        setBenchmarks(benchmarksData);
      }

      if (competitorsResponse.ok) {
        const competitorsData = await competitorsResponse.json();
        setCompetitors(competitorsData);
      }
    } catch (error) {
      console.error('Error loading benchmark data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockBenchmarks: BenchmarkMetric[] = [
    {
      id: 'approval_rate',
      name: 'Product Approval Rate',
      category: 'Quality',
      ourValue: 87.3,
      industryAverage: 82.1,
      topQuartile: 91.5,
      topDecile: 95.2,
      unit: '%',
      description: 'Percentage of submitted products that get approved',
      trend: 'up',
      trendValue: 5.2
    },
    {
      id: 'time_to_market',
      name: 'Average Time to Market',
      category: 'Efficiency',
      ourValue: 3.4,
      industryAverage: 4.7,
      topQuartile: 2.8,
      topDecile: 2.1,
      unit: ' days',
      isInverse: true,
      description: 'Average days from submission to market availability',
      trend: 'up',
      trendValue: -12.5
    },
    {
      id: 'customer_satisfaction',
      name: 'Customer Satisfaction Score',
      category: 'Quality',
      ourValue: 4.2,
      industryAverage: 3.8,
      topQuartile: 4.4,
      topDecile: 4.7,
      unit: '/5.0',
      description: 'Average customer rating across all products',
      trend: 'up',
      trendValue: 0.3
    },
    {
      id: 'rejection_rate',
      name: 'Product Rejection Rate',
      category: 'Quality',
      ourValue: 12.7,
      industryAverage: 17.9,
      topQuartile: 8.5,
      topDecile: 4.8,
      unit: '%',
      isInverse: true,
      description: 'Percentage of submitted products that get rejected',
      trend: 'up',
      trendValue: -3.1
    },
    {
      id: 'revenue_per_product',
      name: 'Revenue per Product',
      category: 'Financial',
      ourValue: 847,
      industryAverage: 623,
      topQuartile: 1124,
      topDecile: 1456,
      unit: '$',
      description: 'Average revenue generated per approved product',
      trend: 'up',
      trendValue: 23.7
    },
    {
      id: 'vendor_retention',
      name: 'Vendor Retention Rate',
      category: 'Relationships',
      ourValue: 84.6,
      industryAverage: 78.2,
      topQuartile: 89.3,
      topDecile: 94.1,
      unit: '%',
      description: 'Percentage of vendors who continue after 12 months',
      trend: 'stable',
      trendValue: 1.2
    }
  ];

  const mockCompetitors: CompetitorData[] = [
    {
      id: 'competitor_a',
      name: 'MarketPlace Pro',
      marketShare: 23.4,
      category: 'Direct Competitor',
      metrics: {
        approval_rate: 89.1,
        time_to_market: 2.9,
        customer_satisfaction: 4.3,
        rejection_rate: 10.9,
        revenue_per_product: 1124
      }
    },
    {
      id: 'competitor_b',
      name: 'E-Commerce Hub',
      marketShare: 18.7,
      category: 'Direct Competitor',
      metrics: {
        approval_rate: 91.5,
        time_to_market: 3.8,
        customer_satisfaction: 4.1,
        rejection_rate: 8.5,
        revenue_per_product: 892
      }
    },
    {
      id: 'competitor_c',
      name: 'Digital Bazaar',
      marketShare: 12.3,
      category: 'Indirect Competitor',
      metrics: {
        approval_rate: 85.2,
        time_to_market: 4.2,
        customer_satisfaction: 3.9,
        rejection_rate: 14.8,
        revenue_per_product: 645
      }
    }
  ];

  const getPerformanceLevel = (benchmark: BenchmarkMetric) => {
    const { ourValue, industryAverage, topQuartile, topDecile, isInverse } = benchmark;
    
    if (isInverse) {
      if (ourValue <= topDecile) return 'excellent';
      if (ourValue <= topQuartile) return 'good';
      if (ourValue <= industryAverage) return 'average';
      return 'below_average';
    } else {
      if (ourValue >= topDecile) return 'excellent';
      if (ourValue >= topQuartile) return 'good';
      if (ourValue >= industryAverage) return 'average';
      return 'below_average';
    }
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'average': return 'text-yellow-600 dark:text-yellow-400';
      case 'below_average': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPerformanceBadge = (level: string) => {
    switch (level) {
      case 'excellent': return { variant: 'default' as const, icon: Trophy, label: 'Excellent' };
      case 'good': return { variant: 'secondary' as const, icon: Medal, label: 'Good' };
      case 'average': return { variant: 'outline' as const, icon: Star, label: 'Average' };
      case 'below_average': return { variant: 'destructive' as const, icon: AlertTriangle, label: 'Below Avg' };
      default: return { variant: 'outline' as const, icon: Minus, label: 'Unknown' };
    }
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up' && value > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'up' && value < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const calculateBenchmarkPosition = (benchmark: BenchmarkMetric) => {
    const { ourValue, industryAverage, topQuartile, topDecile, isInverse } = benchmark;
    const max = Math.max(ourValue, industryAverage, topQuartile, topDecile);
    const min = Math.min(ourValue, industryAverage, topQuartile, topDecile);
    const range = max - min || 1;
    
    if (isInverse) {
      return {
        our: Math.max(0, (max - ourValue) / range * 100),
        industry: Math.max(0, (max - industryAverage) / range * 100),
        topQuartile: Math.max(0, (max - topQuartile) / range * 100),
        topDecile: Math.max(0, (max - topDecile) / range * 100)
      };
    } else {
      return {
        our: Math.max(0, (ourValue - min) / range * 100),
        industry: Math.max(0, (industryAverage - min) / range * 100),
        topQuartile: Math.max(0, (topQuartile - min) / range * 100),
        topDecile: Math.max(0, (topDecile - min) / range * 100)
      };
    }
  };

  const displayBenchmarks = benchmarks.length > 0 ? benchmarks : mockBenchmarks;
  const displayCompetitors = competitors.length > 0 ? competitors : mockCompetitors;
  const categories = [...new Set(displayBenchmarks.map(b => b.category))];

  const filteredBenchmarks = selectedCategory === 'all' 
    ? displayBenchmarks 
    : displayBenchmarks.filter(b => b.category === selectedCategory);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Performance Benchmarking
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compare your performance against industry standards and competitors
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ecommerce">E-Commerce</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="b2b">B2B Platforms</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={loadBenchmarkData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBenchmarks.map((benchmark) => {
              const level = getPerformanceLevel(benchmark);
              const badge = getPerformanceBadge(level);
              const Icon = badge.icon;
              
              return (
                <Card key={benchmark.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {benchmark.name}
                        </p>
                        <p className={`text-2xl font-bold ${getPerformanceColor(level)}`}>
                          {benchmark.ourValue}{benchmark.unit}
                        </p>
                      </div>
                      <Badge variant={badge.variant} className="flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Industry Avg: {benchmark.industryAverage}{benchmark.unit}</span>
                        <span>Top 10%: {benchmark.topDecile}{benchmark.unit}</span>
                      </div>
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                          style={{ width: `${calculateBenchmarkPosition(benchmark).our}%` }}
                        />
                        <div 
                          className="absolute top-0.5 h-1 w-0.5 bg-yellow-500"
                          style={{ left: `${calculateBenchmarkPosition(benchmark).industry}%` }}
                        />
                        <div 
                          className="absolute top-0.5 h-1 w-0.5 bg-green-500"
                          style={{ left: `${calculateBenchmarkPosition(benchmark).topDecile}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getTrendIcon(benchmark.trend, benchmark.trendValue)}
                      <span className={`text-sm font-medium ${
                        benchmark.trendValue > 0 ? 'text-green-600' : 
                        benchmark.trendValue < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {benchmark.trendValue > 0 ? '+' : ''}{benchmark.trendValue}%
                      </span>
                      <span className="text-sm text-gray-500">vs last period</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Detailed Analysis Tab */}
        <TabsContent value="detailed" className="space-y-6">
          <div className="space-y-6">
            {filteredBenchmarks.map((benchmark) => {
              const level = getPerformanceLevel(benchmark);
              const position = calculateBenchmarkPosition(benchmark);
              
              return (
                <Card key={benchmark.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{benchmark.name}</span>
                      <Badge variant="outline">{benchmark.category}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {benchmark.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Our Performance</p>
                        <p className="text-xl font-bold text-blue-600">
                          {benchmark.ourValue}{benchmark.unit}
                        </p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Industry Average</p>
                        <p className="text-xl font-bold">
                          {benchmark.industryAverage}{benchmark.unit}
                        </p>
                      </div>
                      
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Top 25%</p>
                        <p className="text-xl font-bold text-yellow-600">
                          {benchmark.topQuartile}{benchmark.unit}
                        </p>
                      </div>
                      
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Top 10%</p>
                        <p className="text-xl font-bold text-green-600">
                          {benchmark.topDecile}{benchmark.unit}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Performance Comparison</span>
                        <span className={getPerformanceColor(level)}>
                          {getPerformanceBadge(level).label}
                        </span>
                      </div>
                      <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                          style={{ width: `${position.our}%` }}
                        />
                        <div 
                          className="absolute top-1 h-4 w-1 bg-yellow-500 rounded"
                          style={{ left: `${position.industry}%` }}
                        />
                        <div 
                          className="absolute top-1 h-4 w-1 bg-green-500 rounded"
                          style={{ left: `${position.topDecile}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Minimum</span>
                        <span>Industry Avg</span>
                        <span>Top 10%</span>
                        <span>Maximum</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayCompetitors.map((competitor) => (
              <Card key={competitor.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{competitor.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{competitor.category}</Badge>
                      <Badge variant="secondary">
                        {competitor.marketShare}% market share
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(competitor.metrics).map(([metricId, value]) => {
                    const benchmark = displayBenchmarks.find(b => b.id === metricId);
                    if (!benchmark) return null;
                    
                    const ourValue = benchmark.ourValue;
                    const isWinning = benchmark.isInverse ? 
                      ourValue < value : ourValue > value;
                    
                    return (
                      <div key={metricId} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{benchmark.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                Us: {ourValue}{benchmark.unit}
                              </span>
                              <span className="text-sm text-gray-500">
                                Them: {value}{benchmark.unit}
                              </span>
                              {isWinning ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <div className="flex-1 h-2 bg-blue-200 rounded">
                              <div 
                                className="h-full bg-blue-500 rounded"
                                style={{ 
                                  width: `${Math.min(100, (ourValue / Math.max(ourValue, value)) * 100)}%` 
                                }}
                              />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded">
                              <div 
                                className="h-full bg-gray-500 rounded"
                                style={{ 
                                  width: `${Math.min(100, (value / Math.max(ourValue, value)) * 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Historical Trend Analysis</h3>
                <p>Performance trends over time would be displayed here</p>
                <p className="text-sm mt-2">
                  Showing comparison against industry benchmarks across different time periods
                </p>
                
                <div className="mt-6 flex justify-center gap-3">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Trends
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter Periods
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceBenchmarking;