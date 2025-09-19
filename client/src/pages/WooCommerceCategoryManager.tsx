import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Filter, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface CategoryMapping {
  wooCategoryName: string;
  wooCategorySlug: string;
  aveenixCategory: string;
  confidence: number;
  keywords: string[];
}

interface MappingStats {
  totalMappings: number;
  categoriesWithMappings: number;
  averageConfidence: number;
}

interface WooCommerceProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  sourcePlatform: string;
  categoryMappingSource?: string;
  categoryConfidenceScore?: number;
  wooCommerceCategories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export default function WooCommerceCategoryManager() {
  const [wooCategories, setWooCategories] = useState<WooCommerceCategory[]>([]);
  const [mappings, setMappings] = useState<CategoryMapping[]>([]);
  const [stats, setStats] = useState<MappingStats | null>(null);
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showUnmappedOnly, setShowUnmappedOnly] = useState(false);

  // Fetch WooCommerce categories
  const fetchWooCategories = async () => {
    try {
      const response = await fetch('/api/woocommerce/categories');
      if (!response.ok) throw new Error('Failed to fetch WooCommerce categories');
      const data = await response.json();
      setWooCategories(data);
    } catch (err) {
      console.error('Error fetching WooCommerce categories:', err);
      setError('Failed to fetch WooCommerce categories');
    }
  };

  // Fetch category mappings
  const fetchMappings = async () => {
    try {
      const response = await fetch('/api/woocommerce/category-mappings');
      if (!response.ok) throw new Error('Failed to fetch category mappings');
      const data = await response.json();
      setMappings(data.mappings);
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching category mappings:', err);
      setError('Failed to fetch category mappings');
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (category: string) => {
    try {
      const response = await fetch(`/api/woocommerce/products/by-category/${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  // Fetch all WooCommerce products
  const fetchAllWooProducts = async () => {
    try {
      const response = await fetch('/api/products?sourcePlatform=woocommerce');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchWooCategories(),
        fetchMappings(),
        fetchAllWooProducts()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredCategories = wooCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesUnmapped = !showUnmappedOnly || product.category === 'Uncategorized';
    return matchesSearch && matchesCategory && matchesUnmapped;
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getMappingSourceColor = (source: string) => {
    switch (source) {
      case 'exact_name_match': return 'bg-blue-100 text-blue-800';
      case 'slug_match': return 'bg-purple-100 text-purple-800';
      case 'keyword_match': return 'bg-orange-100 text-orange-800';
      case 'ai_classification': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading WooCommerce categories...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WooCommerce Category Manager</h1>
          <p className="text-gray-600 mt-2">
            Manage WooCommerce product categories and their mappings to Aveenix categories
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalMappings}</div>
              <div className="text-sm text-gray-600">Total Mappings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.categoriesWithMappings}</div>
              <div className="text-sm text-gray-600">Categories with Mappings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.averageConfidence}%</div>
              <div className="text-sm text-gray-600">Average Confidence</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">WooCommerce Categories</TabsTrigger>
          <TabsTrigger value="mappings">Category Mappings</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showUnmappedOnly ? "default" : "outline"}
              onClick={() => setShowUnmappedOnly(!showUnmappedOnly)}
            >
              {showUnmappedOnly ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showUnmappedOnly ? 'Show All' : 'Show Unmapped Only'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => {
              const mapping = mappings.find(m => m.wooCategoryName === category.name);
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{category.count} products</Badge>
                      {mapping ? (
                        <Badge className={getConfidenceColor(mapping.confidence)}>
                          {mapping.confidence}% confidence
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Unmapped</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {mapping ? (
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium">Maps to:</Label>
                          <div className="text-sm text-gray-600">{mapping.aveenixCategory}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Keywords:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mapping.keywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {mapping.keywords.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{mapping.keywords.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchProductsByCategory(category.name)}
                          className="w-full"
                        >
                          View Products
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No mapping found for this category
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-4">
          <div className="space-y-4">
            {mappings.map((mapping, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{mapping.wooCategoryName}</h3>
                        <Badge variant="outline">{mapping.wooCategorySlug}</Badge>
                        <Badge className={getConfidenceColor(mapping.confidence)}>
                          {mapping.confidence}%
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Maps to: <strong>{mapping.aveenixCategory}</strong>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mapping.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {Array.from(new Set(products.map(p => p.category))).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showUnmappedOnly ? "default" : "outline"}
              onClick={() => setShowUnmappedOnly(!showUnmappedOnly)}
            >
              {showUnmappedOnly ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showUnmappedOnly ? 'Show All' : 'Show Unmapped Only'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={product.imageUrl || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                      <div className="text-sm text-gray-600">${product.price}</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{product.category}</Badge>
                        {product.categoryMappingSource && (
                          <Badge className={getMappingSourceColor(product.categoryMappingSource)}>
                            {product.categoryMappingSource.replace('_', ' ')}
                          </Badge>
                        )}
                        {product.categoryConfidenceScore && (
                          <Badge className={getConfidenceColor(product.categoryConfidenceScore)}>
                            {product.categoryConfidenceScore}%
                          </Badge>
                        )}
                      </div>
                      {product.wooCommerceCategories && product.wooCommerceCategories.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500">WooCommerce Categories:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.wooCommerceCategories.map((cat, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found matching your criteria
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
