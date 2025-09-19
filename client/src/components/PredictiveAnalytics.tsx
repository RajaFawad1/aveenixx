import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Database,
  Cpu,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface PredictionModel {
  id: string;
  name: string;
  type: 'demand_forecast' | 'seasonal_trend' | 'pricing_optimization' | 'quality_prediction' | 'market_opportunity';
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'pending' | 'error';
  description: string;
}

interface Forecast {
  period: string;
  prediction: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

interface PredictiveAnalyticsProps {
  className?: string;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ className }) => {
  const [models, setModels] = useState<PredictionModel[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [activeTab, setActiveTab] = useState('models');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadModelsAndForecasts();
  }, []);

  const loadModelsAndForecasts = async () => {
    setLoading(true);
    try {
      const [modelsResponse, forecastsResponse] = await Promise.all([
        fetch('/api/predictive/models'),
        fetch('/api/predictive/forecasts')
      ]);

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        setModels(modelsData);
      }

      if (forecastsResponse.ok) {
        const forecastsData = await forecastsResponse.json();
        setForecasts(forecastsData);
      }
    } catch (error) {
      console.error('Error loading predictive analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const trainModel = async (modelId: string) => {
    try {
      const response = await fetch(`/api/predictive/models/${modelId}/train`, {
        method: 'POST'
      });

      if (response.ok) {
        loadModelsAndForecasts();
      }
    } catch (error) {
      console.error('Error training model:', error);
    }
  };

  const refreshPredictions = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/predictive/refresh', {
        method: 'POST'
      });

      if (response.ok) {
        loadModelsAndForecasts();
      }
    } catch (error) {
      console.error('Error refreshing predictions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Mock data for demonstration
  const mockModels: PredictionModel[] = [
    {
      id: 'demand_forecast',
      name: 'Demand Forecasting',
      type: 'demand_forecast',
      accuracy: 87.3,
      lastTrained: '2025-01-22T10:30:00Z',
      status: 'active',
      description: 'Predicts product demand based on historical sales, seasonality, and market trends'
    },
    {
      id: 'seasonal_trends',
      name: 'Seasonal Trends',
      type: 'seasonal_trend',
      accuracy: 92.1,
      lastTrained: '2025-01-21T15:45:00Z',
      status: 'active',
      description: 'Identifies seasonal patterns and cyclical demand fluctuations'
    },
    {
      id: 'pricing_optimization',
      name: 'Pricing Optimization',
      type: 'pricing_optimization',
      accuracy: 84.7,
      lastTrained: '2025-01-22T08:15:00Z',
      status: 'training',
      description: 'Optimizes pricing strategies based on competition and demand elasticity'
    },
    {
      id: 'quality_prediction',
      name: 'Quality Prediction',
      type: 'quality_prediction',
      accuracy: 89.5,
      lastTrained: '2025-01-20T12:00:00Z',
      status: 'active',
      description: 'Predicts product quality scores and approval likelihood'
    },
    {
      id: 'market_opportunity',
      name: 'Market Opportunity',
      type: 'market_opportunity',
      accuracy: 76.8,
      lastTrained: '2025-01-19T14:30:00Z',
      status: 'pending',
      description: 'Identifies emerging market opportunities and product gaps'
    }
  ];

  const mockForecasts: Forecast[] = [
    {
      period: 'Next 30 Days',
      prediction: 2847,
      confidence: 87,
      trend: 'up',
      factors: ['Seasonal increase', 'Marketing campaign', 'Product launches']
    },
    {
      period: 'Next Quarter',
      prediction: 8924,
      confidence: 82,
      trend: 'up',
      factors: ['Holiday season', 'Inventory expansion', 'Market growth']
    },
    {
      period: 'Next 6 Months',
      prediction: 17548,
      confidence: 74,
      trend: 'stable',
      factors: ['Market maturity', 'Competition increase', 'Economic factors']
    },
    {
      period: 'Next Year',
      prediction: 36892,
      confidence: 68,
      trend: 'up',
      factors: ['Long-term growth', 'Market expansion', 'Technology adoption']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'training': return 'text-blue-600 dark:text-blue-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'training': return 'secondary';
      case 'pending': return 'outline';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'demand_forecast': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'seasonal_trend': return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'pricing_optimization': return <Target className="w-5 h-5 text-green-500" />;
      case 'quality_prediction': return <CheckCircle className="w-5 h-5 text-yellow-500" />;
      case 'market_opportunity': return <Zap className="w-5 h-5 text-red-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const displayModels = models.length > 0 ? models : mockModels;
  const displayForecasts = forecasts.length > 0 ? forecasts : mockForecasts;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Predictive Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Machine learning models for demand forecasting and trend prediction
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={refreshPredictions} variant="outline" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Database className="w-4 h-4 mr-2" />
            Train Models
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* ML Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayModels.map((model) => (
              <Card key={model.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getModelIcon(model.type)}
                      <span>{model.name}</span>
                    </div>
                    <Badge variant={getStatusBadge(model.status) as any}>
                      {model.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {model.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm font-bold">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last trained: {new Date(model.lastTrained).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => trainModel(model.id)} 
                      size="sm" 
                      variant="outline"
                      disabled={model.status === 'training'}
                    >
                      <Cpu className="w-4 h-4 mr-2" />
                      {model.status === 'training' ? 'Training...' : 'Retrain'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Forecasts Tab */}
        <TabsContent value="forecasts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayForecasts.map((forecast, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{forecast.period}</h3>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {forecast.prediction.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expected products
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(forecast.trend)}
                      <Badge variant="outline">
                        {forecast.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Key Factors:</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {forecast.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Strong Q4 Growth Expected
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Electronics category shows 89% probability of 25%+ growth in Q4 based on historical patterns and market indicators.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        Inventory Optimization Opportunity
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Fashion category demand will peak in 3 weeks. Consider increasing inventory by 15% to avoid stockouts.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Emerging Market Trend
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Health & Beauty products show 67% correlation with social media trends. Monitor viral content for opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Optimize Electronics Pricing</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Increase margins by 8% based on demand forecast
                    </p>
                  </div>
                  <Badge variant="default">High Impact</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Expand Home & Garden</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add 12 new products in trending subcategories
                    </p>
                  </div>
                  <Badge variant="secondary">Medium Impact</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Review Fashion Strategy</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Seasonal patterns suggest repositioning needed
                    </p>
                  </div>
                  <Badge variant="outline">Low Impact</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayModels.map((model) => (
                    <div key={model.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{model.name}</span>
                        <span className="text-sm">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Prediction Accuracy Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-500">Accuracy trend visualization</p>
                  <p className="text-xs text-gray-400 mt-1">Historical performance data</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Training Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Models</span>
                  <span className="font-medium">{displayModels.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Models</span>
                  <span className="font-medium">
                    {displayModels.filter(m => m.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Accuracy</span>
                  <span className="font-medium">
                    {Math.round(displayModels.reduce((acc, m) => acc + m.accuracy, 0) / displayModels.length)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Training</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalytics;