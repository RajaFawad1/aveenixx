import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Truck, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  Star, 
  Clock, 
  DollarSign,
  Building2,
  BarChart3,
  Zap,
  Globe,
  Settings,
  CheckCircle,
  XCircle,
  Activity,
  ShoppingCart,
  Target,
  Eye,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  platform: 'woocommerce' | 'shopify' | 'amazon' | 'aliexpress' | 'custom';
  status: 'active' | 'inactive' | 'pending';
  performanceScore: number;
  reliability: number;
  avgShippingTime: number;
  qualityRating: number;
  totalProducts: number;
  lastSync: string;
  apiStatus: 'connected' | 'error' | 'syncing';
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  supplier: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reorder_needed';
  demandForecast: number;
  seasonalTrend: 'high' | 'medium' | 'low';
}

interface ReorderSuggestion {
  productId: string;
  productName: string;
  currentStock: number;
  suggestedQuantity: number;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  supplier: string;
  estimatedCost: number;
  leadTime: number;
}

export default function InventorySourcing() {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  // Fetch suppliers data
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery<Supplier[]>({
    queryKey: ['/api/inventory/suppliers']
  });

  // Fetch inventory data
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory/items']
  });

  // Fetch reorder suggestions
  const { data: reorderSuggestions = [], isLoading: reorderLoading } = useQuery<ReorderSuggestion[]>({
    queryKey: ['/api/inventory/reorder-suggestions']
  });

  const getSupplierIcon = (platform: string) => {
    switch (platform) {
      case 'woocommerce': return <Package className="w-4 h-4" />;
      case 'shopify': return <ShoppingCart className="w-4 h-4" />;
      case 'amazon': return <Building2 className="w-4 h-4" />;
      case 'aliexpress': return <Globe className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': 
      case 'connected': 
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive': 
      case 'error': 
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
      case 'pending': 
      case 'syncing': 
        return <Badge variant="outline"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Syncing</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (item.currentStock <= item.reorderPoint) return { status: 'Reorder Needed', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (item.currentStock <= item.reorderPoint * 1.5) return { status: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const mockSuppliers: Supplier[] = [
    {
      id: 'sup_1',
      name: 'WooCommerce Main Store',
      platform: 'woocommerce',
      status: 'active',
      performanceScore: 94,
      reliability: 96,
      avgShippingTime: 3.2,
      qualityRating: 4.8,
      totalProducts: 1247,
      lastSync: '2025-01-23T05:30:00Z',
      apiStatus: 'connected'
    },
    {
      id: 'sup_2',
      name: 'Shopify Electronics',
      platform: 'shopify',
      status: 'active',
      performanceScore: 87,
      reliability: 89,
      avgShippingTime: 4.1,
      qualityRating: 4.5,
      totalProducts: 892,
      lastSync: '2025-01-23T05:25:00Z',
      apiStatus: 'connected'
    },
    {
      id: 'sup_3',
      name: 'Amazon FBA Supplier',
      platform: 'amazon',
      status: 'active',
      performanceScore: 91,
      reliability: 93,
      avgShippingTime: 2.8,
      qualityRating: 4.6,
      totalProducts: 2156,
      lastSync: '2025-01-23T05:28:00Z',
      apiStatus: 'syncing'
    },
    {
      id: 'sup_4',
      name: 'AliExpress Dropship',
      platform: 'aliexpress',
      status: 'inactive',
      performanceScore: 73,
      reliability: 78,
      avgShippingTime: 12.5,
      qualityRating: 4.1,
      totalProducts: 567,
      lastSync: '2025-01-22T18:45:00Z',
      apiStatus: 'error'
    }
  ];

  const mockInventory: InventoryItem[] = [
    {
      id: 'inv_1',
      name: 'AirPods Pro (2nd Generation)',
      sku: 'APP-2ND-GEN',
      supplier: 'WooCommerce Main Store',
      currentStock: 45,
      reorderPoint: 20,
      maxStock: 100,
      lastUpdated: '2025-01-23T05:30:00Z',
      status: 'in_stock',
      demandForecast: 85,
      seasonalTrend: 'high'
    },
    {
      id: 'inv_2',
      name: 'Smart Fitness Watch Pro',
      sku: 'SFW-PRO-001',
      supplier: 'Amazon FBA Supplier',
      currentStock: 8,
      reorderPoint: 15,
      maxStock: 60,
      status: 'low_stock',
      lastUpdated: '2025-01-23T05:28:00Z',
      demandForecast: 65,
      seasonalTrend: 'medium'
    },
    {
      id: 'inv_3',
      name: 'Wireless Gaming Headset',
      sku: 'WGH-001',
      supplier: 'Shopify Electronics',
      currentStock: 0,
      reorderPoint: 10,
      maxStock: 40,
      status: 'out_of_stock',
      lastUpdated: '2025-01-23T04:15:00Z',
      demandForecast: 42,
      seasonalTrend: 'high'
    }
  ];

  const mockReorderSuggestions: ReorderSuggestion[] = [
    {
      productId: 'inv_2',
      productName: 'Smart Fitness Watch Pro',
      currentStock: 8,
      suggestedQuantity: 35,
      urgency: 'high',
      reason: 'Below reorder point + high seasonal demand',
      supplier: 'Amazon FBA Supplier',
      estimatedCost: 8750,
      leadTime: 3
    },
    {
      productId: 'inv_3',
      productName: 'Wireless Gaming Headset',
      currentStock: 0,
      suggestedQuantity: 25,
      urgency: 'high',
      reason: 'Out of stock + consistent demand',
      supplier: 'Shopify Electronics',
      estimatedCost: 3750,
      leadTime: 5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Inventory & Sourcing Intelligence
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Multi-supplier management with AI-driven inventory optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Suppliers</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-green-600">+1 this month</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Performance</p>
                <p className="text-2xl font-bold">90.7%</p>
                <p className="text-xs text-green-600">+2.3% this week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Items Need Reorder</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-orange-600">Urgent action needed</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inventory Value</p>
                <p className="text-2xl font-bold">$125K</p>
                <p className="text-xs text-blue-600">Across all suppliers</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Suppliers
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="reorder" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            AI Reorder
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSupplierIcon(supplier.platform)}
                      <div>
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <CardDescription className="capitalize">{supplier.platform} Platform</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(supplier.apiStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Performance</span>
                        <span className="text-sm font-medium">{supplier.performanceScore}%</span>
                      </div>
                      <Progress value={supplier.performanceScore} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reliability</span>
                        <span className="text-sm font-medium">{supplier.reliability}%</span>
                      </div>
                      <Progress value={supplier.reliability} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Avg Shipping</p>
                      <p className="font-semibold">{supplier.avgShippingTime} days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Quality Rating</p>
                      <p className="font-semibold flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {supplier.qualityRating}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Products</p>
                      <p className="font-semibold">{supplier.totalProducts.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Inventory Status</CardTitle>
              <CardDescription>Dynamic inventory sync across all connected platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="outline" className={`${stockStatus.bg} ${stockStatus.color} border-0`}>
                            {stockStatus.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {item.seasonalTrend} demand
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">SKU: </span>
                            <span className="font-medium">{item.sku}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Current Stock: </span>
                            <span className="font-medium">{item.currentStock}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Reorder Point: </span>
                            <span className="font-medium">{item.reorderPoint}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Supplier: </span>
                            <span className="font-medium">{item.supplier}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Reorder Tab */}
        <TabsContent value="reorder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                AI-Driven Reorder Suggestions
              </CardTitle>
              <CardDescription>
                Automated reorder points with seasonal demand forecasting and supplier optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReorderSuggestions.map((suggestion) => (
                  <div key={suggestion.productId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{suggestion.productName}</h4>
                        <p className="text-sm text-gray-600">{suggestion.reason}</p>
                      </div>
                      <Badge 
                        variant={suggestion.urgency === 'high' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {suggestion.urgency} Priority
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Current Stock</p>
                        <p className="font-semibold">{suggestion.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Suggested Quantity</p>
                        <p className="font-semibold text-blue-600">{suggestion.suggestedQuantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Estimated Cost</p>
                        <p className="font-semibold">${suggestion.estimatedCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Lead Time</p>
                        <p className="font-semibold">{suggestion.leadTime} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Supplier</p>
                        <p className="font-semibold text-sm">{suggestion.supplier}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve Order
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Modify Quantity
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="w-3 h-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSuppliers.filter(s => s.status === 'active').map((supplier) => (
                    <div key={supplier.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{supplier.name}</span>
                        <span className="text-sm text-gray-600">{supplier.performanceScore}%</span>
                      </div>
                      <Progress value={supplier.performanceScore} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">12.4x</p>
                    <p className="text-sm text-gray-600">Average Turnover Rate</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">23 days</p>
                      <p className="text-xs text-gray-600">Avg Days to Sell</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">$47K</p>
                      <p className="text-xs text-gray-600">Fast-Moving Stock</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Seasonal Demand Forecasting</CardTitle>
                <CardDescription>AI-powered demand prediction for optimal inventory planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="font-semibold">High Demand Period</p>
                    <p className="text-sm text-gray-600">Expected in 2-3 weeks</p>
                    <p className="text-xs text-green-600">+35% increase predicted</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="font-semibold">Current Trend</p>
                    <p className="text-sm text-gray-600">Stable demand</p>
                    <p className="text-xs text-blue-600">Normal inventory levels</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="font-semibold">Reorder Timing</p>
                    <p className="text-sm text-gray-600">Optimal window</p>
                    <p className="text-xs text-orange-600">Next 5-7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}