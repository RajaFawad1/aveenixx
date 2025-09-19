import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Globe, 
  Smartphone, 
  MonitorSpeaker, 
  Zap, 
  Target, 
  BarChart3, 
  Link, 
  Settings, 
  RefreshCw,
  Download,
  Upload,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  Database,
  Network
} from 'lucide-react';

interface ElasticsearchConfig {
  endpoint: string;
  status: string;
  indexedProducts: number;
  responseTime: number;
  lastSync: string;
}

interface BulkOperation {
  id: string;
  type: string;
  status: string;
  progress: number;
  totalItems: number;
  processedItems: number;
  startTime: string;
  estimatedCompletion: string;
}

interface ProductRelationship {
  id: string;
  sourceProduct: string;
  targetProduct: string;
  relationType: string;
  strength: number;
  created: string;
}

interface MobileMetrics {
  category: string;
  desktopTime: number;
  mobileTime: number;
  improvement: number;
  status: string;
}

const AdvancedUserExperience: React.FC = () => {
  const [activeTab, setActiveTab] = useState('elasticsearch');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for Elasticsearch
  const [elasticsearchConfig] = useState<ElasticsearchConfig>({
    endpoint: 'https://elastic.aveenix.com:9200',
    status: 'Connected',
    indexedProducts: 15247,
    responseTime: 45,
    lastSync: '2 minutes ago'
  });

  // Mock data for Bulk Operations
  const [bulkOperations] = useState<BulkOperation[]>([
    {
      id: 'bulk_001',
      type: 'Price Update',
      status: 'In Progress',
      progress: 68,
      totalItems: 1250,
      processedItems: 850,
      startTime: '10:30 AM',
      estimatedCompletion: '11:15 AM'
    },
    {
      id: 'bulk_002',
      type: 'Category Assignment',
      status: 'Completed',
      progress: 100,
      totalItems: 340,
      processedItems: 340,
      startTime: '9:45 AM',
      estimatedCompletion: '10:20 AM'
    },
    {
      id: 'bulk_003',
      type: 'Stock Adjustment',
      status: 'Queued',
      progress: 0,
      totalItems: 890,
      processedItems: 0,
      startTime: '11:30 AM',
      estimatedCompletion: '12:15 PM'
    }
  ]);

  // Mock data for Product Relationships
  const [productRelationships] = useState<ProductRelationship[]>([
    {
      id: 'rel_001',
      sourceProduct: 'iPhone 15 Pro',
      targetProduct: 'MagSafe Charger',
      relationType: 'Frequently Bought Together',
      strength: 87,
      created: '3 days ago'
    },
    {
      id: 'rel_002',
      sourceProduct: 'MacBook Pro M3',
      targetProduct: 'USB-C Hub',
      relationType: 'Recommended Accessory',
      strength: 92,
      created: '1 week ago'
    },
    {
      id: 'rel_003',
      sourceProduct: 'Sony Headphones',
      targetProduct: 'Bluetooth Adapter',
      relationType: 'Alternative Product',
      strength: 78,
      created: '2 days ago'
    }
  ]);

  // Mock data for Mobile Performance
  const [mobileMetrics] = useState<MobileMetrics[]>([
    {
      category: 'Product Search',
      desktopTime: 3.2,
      mobileTime: 2.1,
      improvement: 34,
      status: 'Optimized'
    },
    {
      category: 'Checkout Process',
      desktopTime: 5.8,
      mobileTime: 4.2,
      improvement: 28,
      status: 'Optimized'
    },
    {
      category: 'Product Filtering',
      desktopTime: 2.5,
      mobileTime: 3.1,
      improvement: -24,
      status: 'Needs Attention'
    },
    {
      category: 'Image Loading',
      desktopTime: 1.8,
      mobileTime: 1.3,
      improvement: 28,
      status: 'Optimized'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected':
      case 'completed':
      case 'optimized':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in progress':
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'queued':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'needs attention':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'Frequently Bought Together':
        return <Target className="h-4 w-4" />;
      case 'Recommended Accessory':
        return <Link className="h-4 w-4" />;
      case 'Alternative Product':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Network className="h-4 w-4" />;
    }
  };

  const renderElasticsearchTab = () => (
    <div className="space-y-6">
      {/* Elasticsearch Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
            Elasticsearch Configuration
          </CardTitle>
          <CardDescription>
            Advanced search infrastructure and indexing management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connection Status</p>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(elasticsearchConfig.status)}>
                  {elasticsearchConfig.status}
                </Badge>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Indexed Products</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
                {elasticsearchConfig.indexedProducts.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-green-600">
                {elasticsearchConfig.responseTime}ms
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Sync</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">{elasticsearchConfig.lastSync}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
            Search Index Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="h-6 w-6" />
              <span>Rebuild Index</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Settings className="h-6 w-6" />
              <span>Configure Mappings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Search Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBulkOperationsTab = () => (
    <div className="space-y-6">
      {/* Bulk Operations Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
            Bulk Operations Management
          </CardTitle>
          <CardDescription>
            Efficient mass operations for product management and data processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              New Bulk Operation
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure Templates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulkOperations.map((operation) => (
              <div key={operation.id} className="p-4 border rounded-lg dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h3 className="font-semibold">{operation.type}</h3>
                    <Badge className={getStatusColor(operation.status)}>
                      {operation.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Started: {operation.startTime}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {operation.processedItems} / {operation.totalItems}</span>
                    <span>{operation.progress}%</span>
                  </div>
                  <Progress value={operation.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>ETA: {operation.estimatedCompletion}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductRelationshipsTab = () => (
    <div className="space-y-6">
      {/* Relationship Management Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
            Product Relationship Mapping
          </CardTitle>
          <CardDescription>
            AI-powered product relationships and recommendation intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Generate Relationships
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relationship Analytics
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Relationships List */}
      <Card>
        <CardHeader>
          <CardTitle>Product Relationships</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search relationships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="frequently-bought">Frequently Bought Together</SelectItem>
                <SelectItem value="recommended">Recommended Accessory</SelectItem>
                <SelectItem value="alternative">Alternative Product</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productRelationships.map((relationship) => (
              <div key={relationship.id} className="p-4 border rounded-lg dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRelationshipIcon(relationship.relationType)}
                    <div>
                      <h3 className="font-semibold">{relationship.sourceProduct}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        → {relationship.targetProduct}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {relationship.relationType}
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Strength: {relationship.strength}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Progress value={relationship.strength} className="h-2 flex-1 mr-4" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {relationship.created}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMobileOptimizationTab = () => (
    <div className="space-y-6">
      {/* Mobile Performance Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" style={{ color: 'var(--primary-color)' }} />
            Mobile-First Management
          </CardTitle>
          <CardDescription>
            Optimized mobile experience and performance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg dark:border-gray-700">
              <Smartphone className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
              <p className="font-semibold">Mobile Users</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>73%</p>
            </div>
            <div className="text-center p-4 border rounded-lg dark:border-gray-700">
              <MonitorSpeaker className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
              <p className="font-semibold">Page Load Speed</p>
              <p className="text-2xl font-bold text-green-600">2.1s</p>
            </div>
            <div className="text-center p-4 border rounded-lg dark:border-gray-700">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
              <p className="font-semibold">Mobile Conversion</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>4.8%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile vs Desktop Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mobileMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{metric.category}</h3>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Desktop</p>
                    <p className="font-semibold">{metric.desktopTime}s</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Mobile</p>
                    <p className="font-semibold">{metric.mobileTime}s</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Improvement</p>
                    <p className={`font-semibold ${metric.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced User Experience</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Enterprise UX optimization and advanced product management tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="elasticsearch" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Elasticsearch
          </TabsTrigger>
          <TabsTrigger value="bulk-operations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Product Relationships
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elasticsearch" className="mt-6">
          {renderElasticsearchTab()}
        </TabsContent>

        <TabsContent value="bulk-operations" className="mt-6">
          {renderBulkOperationsTab()}
        </TabsContent>

        <TabsContent value="relationships" className="mt-6">
          {renderProductRelationshipsTab()}
        </TabsContent>

        <TabsContent value="mobile" className="mt-6">
          {renderMobileOptimizationTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedUserExperience;