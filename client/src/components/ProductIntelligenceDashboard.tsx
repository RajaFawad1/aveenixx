import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  Calendar,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Star,
  Globe,
  Zap
} from 'lucide-react';

interface CompetitorPrice {
  platform: string;
  price: number;
  url: string;
  lastChecked: string;
}

interface CategorySuggestion {
  category: string;
  confidence: number;
  reason: string;
}

interface SeasonalityData {
  month: number;
  demandMultiplier: number;
}

interface ProductIntelligenceData {
  viabilityScore: number;
  competitiveScore: number;
  profitMarginScore: number;
  marketTrendScore: number;
  overallIntelligenceScore: number;
  competitorPrices: CompetitorPrice[];
  suggestedPrice: number;
  priceOptimizationReason: string;
  aiSuggestedCategories: CategorySuggestion[];
  categoryConfidenceScore: number;
  googleTrendsScore: number;
  amazonBestSellerRank?: number;
  marketDemandLevel: 'low' | 'medium' | 'high' | 'very_high';
  seasonalityPattern: SeasonalityData[];
}

interface ProductIntelligenceDashboardProps {
  productId: string;
  productName: string;
  currentPrice: number;
  currentCategory: string;
}

const ProductIntelligenceDashboard: React.FC<ProductIntelligenceDashboardProps> = ({
  productId,
  productName,
  currentPrice,
  currentCategory
}) => {
  const [intelligenceData, setIntelligenceData] = useState<ProductIntelligenceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const analyzeProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/product-intelligence/${productId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIntelligenceData(data);
      } else {
        console.error('Failed to analyze product');
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case 'very_high': return "text-green-600 dark:text-green-400";
      case 'high': return "text-green-500 dark:text-green-300";
      case 'medium': return "text-yellow-600 dark:text-yellow-400";
      default: return "text-red-600 dark:text-red-400";
    }
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Product Intelligence
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered analytics and optimization for {productName}
          </p>
        </div>
        <Button 
          onClick={analyzeProduct} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Analyze Product
            </>
          )}
        </Button>
      </div>

      {intelligenceData && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="market">Market Trends</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Overall Intelligence Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Overall Intelligence Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {intelligenceData.overallIntelligenceScore.toFixed(1)}
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={intelligenceData.overallIntelligenceScore} 
                      className="h-3"
                    />
                  </div>
                  <Badge variant={getScoreBadgeVariant(intelligenceData.overallIntelligenceScore)}>
                    {intelligenceData.overallIntelligenceScore >= 80 ? 'Excellent' :
                     intelligenceData.overallIntelligenceScore >= 60 ? 'Good' :
                     intelligenceData.overallIntelligenceScore >= 40 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Viability</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(intelligenceData.viabilityScore)}`}>
                    {intelligenceData.viabilityScore.toFixed(1)}
                  </div>
                  <Progress value={intelligenceData.viabilityScore} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Market Trend</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(intelligenceData.marketTrendScore)}`}>
                    {intelligenceData.marketTrendScore.toFixed(1)}
                  </div>
                  <Progress value={intelligenceData.marketTrendScore} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Profit Margin</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(intelligenceData.profitMarginScore)}`}>
                    {intelligenceData.profitMarginScore.toFixed(1)}
                  </div>
                  <Progress value={intelligenceData.profitMarginScore} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Competitive</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(intelligenceData.competitiveScore)}`}>
                    {intelligenceData.competitiveScore.toFixed(1)}
                  </div>
                  <Progress value={intelligenceData.competitiveScore} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Market Intelligence Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Google Trends Score</span>
                    <span className="font-medium">{intelligenceData.googleTrendsScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Market Demand</span>
                    <Badge className={getDemandLevelColor(intelligenceData.marketDemandLevel)}>
                      {intelligenceData.marketDemandLevel.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  {intelligenceData.amazonBestSellerRank && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amazon BSR</span>
                      <span className="font-medium">#{intelligenceData.amazonBestSellerRank.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Quick Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {intelligenceData.overallIntelligenceScore >= 80 && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">High-potential product</span>
                    </div>
                  )}
                  {intelligenceData.marketDemandLevel === 'high' || intelligenceData.marketDemandLevel === 'very_high' && (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Strong market demand</span>
                    </div>
                  )}
                  {intelligenceData.suggestedPrice !== currentPrice && (
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Price optimization available</span>
                    </div>
                  )}
                  {intelligenceData.aiSuggestedCategories.length > 0 && (
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Brain className="w-4 h-4" />
                      <span className="text-sm">Category improvements suggested</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Price Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                      <span className="text-xl font-bold">${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Suggested Price</span>
                      <span className="text-xl font-bold text-green-600">
                        ${intelligenceData.suggestedPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {intelligenceData.priceOptimizationReason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Competitor Prices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Competitor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {intelligenceData.competitorPrices.slice(0, 5).map((competitor, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{competitor.platform}</span>
                        <span className="text-sm">${competitor.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Category Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium">Current Category: {currentCategory}</span>
                    <Badge>
                      {intelligenceData.categoryConfidenceScore.toFixed(0)}% confidence
                    </Badge>
                  </div>
                  
                  {intelligenceData.aiSuggestedCategories.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Alternative Categories:</h4>
                      {intelligenceData.aiSuggestedCategories.map((suggestion, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{suggestion.category}</span>
                            <Badge variant="outline">
                              {suggestion.confidence}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {suggestion.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p>Current category is optimal for this product</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Trends Tab */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Seasonal Demand Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {intelligenceData.seasonalityPattern.map((month) => (
                    <div key={month.month} className="text-center p-3 rounded-lg border">
                      <div className="text-sm font-medium mb-1">{getMonthName(month.month)}</div>
                      <div className={`text-lg font-bold ${
                        month.demandMultiplier > 1.2 ? 'text-green-600' :
                        month.demandMultiplier < 0.8 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {(month.demandMultiplier * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seasonal multipliers show expected demand variations throughout the year.
                    Green indicates peak seasons, red indicates low seasons.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitive Tab */}
          <TabsContent value="competitive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Competitive Positioning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Competitive Score</span>
                      <span className={`text-xl font-bold ${getScoreColor(intelligenceData.competitiveScore)}`}>
                        {intelligenceData.competitiveScore.toFixed(1)}/100
                      </span>
                    </div>
                    <Progress value={intelligenceData.competitiveScore} className="h-3" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {intelligenceData.competitiveScore >= 70 ? 
                        "Strong competitive position with good differentiation" :
                        intelligenceData.competitiveScore >= 50 ?
                        "Moderate competition, consider optimization strategies" :
                        "High competition, focus on unique value propositions"
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Market Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Competitors Tracked</span>
                      <span className="font-medium">{intelligenceData.competitorPrices.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Competitor Price</span>
                      <span className="font-medium">
                        ${(intelligenceData.competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / intelligenceData.competitorPrices.length).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Price Position</span>
                      <Badge variant="outline">
                        {currentPrice < (intelligenceData.competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / intelligenceData.competitorPrices.length) ? 
                          'Below Average' : 'Above Average'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!intelligenceData && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Product Intelligence Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Run AI-powered analysis to get insights on market positioning, pricing optimization, 
              category suggestions, and competitive intelligence.
            </p>
            <Button onClick={analyzeProduct} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Brain className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductIntelligenceDashboard;