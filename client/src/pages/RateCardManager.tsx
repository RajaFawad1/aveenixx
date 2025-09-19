import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Percent, Tag, Settings, Plus, Save } from 'lucide-react';

interface DropshipMarkupRate {
  id: number;
  categoryName: string;
  markupPercentage: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductMarkupOverride {
  id: number;
  productId: string;
  customMarkupPercentage: number;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RateCardManager() {
  const [categoryRates, setCategoryRates] = useState<DropshipMarkupRate[]>([]);
  const [productOverrides, setProductOverrides] = useState<ProductMarkupOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryRate, setNewCategoryRate] = useState({
    categoryName: '',
    markupPercentage: '',
    notes: ''
  });
  const [newProductOverride, setNewProductOverride] = useState({
    productId: '',
    customMarkupPercentage: '',
    reason: ''
  });
  const { toast } = useToast();

  const fetchRates = async () => {
    try {
      const response = await fetch('/api/dropship/rates');
      const data = await response.json();
      
      if (data.success) {
        setCategoryRates(data.rates.categoryRates || []);
        setProductOverrides(data.rates.productOverrides || []);
      } else {
        throw new Error('Failed to fetch rates');
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      toast({
        title: "Error",
        description: "Failed to load dropship rates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultRates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dropship/seed-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Default rates loaded successfully"
        });
        await fetchRates();
      } else {
        throw new Error(data.error || 'Failed to seed rates');
      }
    } catch (error) {
      console.error('Error seeding rates:', error);
      toast({
        title: "Error",
        description: "Failed to load default rates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategoryRate = async () => {
    if (!newCategoryRate.categoryName || !newCategoryRate.markupPercentage) {
      toast({
        title: "Error",
        description: "Category name and markup percentage are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/dropship/rates/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: newCategoryRate.categoryName,
          markupPercentage: parseFloat(newCategoryRate.markupPercentage),
          notes: newCategoryRate.notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Category rate added successfully"
        });
        setNewCategoryRate({ categoryName: '', markupPercentage: '', notes: '' });
        await fetchRates();
      } else {
        throw new Error(data.error || 'Failed to add category rate');
      }
    } catch (error) {
      console.error('Error adding category rate:', error);
      toast({
        title: "Error",
        description: "Failed to add category rate",
        variant: "destructive"
      });
    }
  };

  const addProductOverride = async () => {
    if (!newProductOverride.productId || !newProductOverride.customMarkupPercentage) {
      toast({
        title: "Error",
        description: "Product ID and markup percentage are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/dropship/rates/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: newProductOverride.productId,
          customMarkupPercentage: parseFloat(newProductOverride.customMarkupPercentage),
          reason: newProductOverride.reason
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Product override added successfully"
        });
        setNewProductOverride({ productId: '', customMarkupPercentage: '', reason: '' });
        await fetchRates();
      } else {
        throw new Error(data.error || 'Failed to add product override');
      }
    } catch (error) {
      console.error('Error adding product override:', error);
      toast({
        title: "Error",
        description: "Failed to add product override",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading rate card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Percent className="h-8 w-8 text-purple-600" />
            Dropship Rate Card Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage markup rates for categories and individual products
          </p>
        </div>
        <Button onClick={seedDefaultRates} variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Load Default Rates
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-600" />
              Category Markup Rates
            </CardTitle>
            <CardDescription>
              Default markup percentages by product category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Category Rate */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Category Rate
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryRate.categoryName}
                    onChange={(e) => setNewCategoryRate(prev => ({ ...prev, categoryName: e.target.value }))}
                    placeholder="e.g., Electronics, Fashion"
                  />
                </div>
                <div>
                  <Label htmlFor="markupPercentage">Markup Percentage</Label>
                  <Input
                    id="markupPercentage"
                    type="number"
                    min="0"
                    max="1000"
                    step="0.1"
                    value={newCategoryRate.markupPercentage}
                    onChange={(e) => setNewCategoryRate(prev => ({ ...prev, markupPercentage: e.target.value }))}
                    placeholder="e.g., 40"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newCategoryRate.notes}
                    onChange={(e) => setNewCategoryRate(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes about this rate..."
                    rows={2}
                  />
                </div>
                <Button onClick={addCategoryRate} className="w-full" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Add Category Rate
                </Button>
              </div>
            </div>

            {/* Existing Category Rates */}
            <div className="space-y-2">
              {categoryRates.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No category rates defined. Click "Load Default Rates" to get started.
                </p>
              ) : (
                categoryRates.map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{rate.categoryName}</div>
                      {rate.notes && (
                        <div className="text-sm text-muted-foreground">{rate.notes}</div>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {rate.markupPercentage}%
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Overrides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Product Overrides
            </CardTitle>
            <CardDescription>
              Custom markup rates for specific products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Product Override */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product Override
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={newProductOverride.productId}
                    onChange={(e) => setNewProductOverride(prev => ({ ...prev, productId: e.target.value }))}
                    placeholder="e.g., woo-12345"
                  />
                </div>
                <div>
                  <Label htmlFor="customMarkupPercentage">Custom Markup %</Label>
                  <Input
                    id="customMarkupPercentage"
                    type="number"
                    min="0"
                    max="1000"
                    step="0.1"
                    value={newProductOverride.customMarkupPercentage}
                    onChange={(e) => setNewProductOverride(prev => ({ ...prev, customMarkupPercentage: e.target.value }))}
                    placeholder="e.g., 75"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    value={newProductOverride.reason}
                    onChange={(e) => setNewProductOverride(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Reason for custom rate..."
                    rows={2}
                  />
                </div>
                <Button onClick={addProductOverride} className="w-full" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Add Product Override
                </Button>
              </div>
            </div>

            {/* Existing Product Overrides */}
            <div className="space-y-2">
              {productOverrides.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No product overrides defined.
                </p>
              ) : (
                productOverrides.map((override) => (
                  <div key={override.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{override.productId}</div>
                      {override.reason && (
                        <div className="text-sm text-muted-foreground">{override.reason}</div>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {override.customMarkupPercentage}%
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Card Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Card Summary</CardTitle>
          <CardDescription>
            How the rate card system works
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{categoryRates.length}</div>
              <div className="text-sm text-muted-foreground">Category Rates</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{productOverrides.length}</div>
              <div className="text-sm text-muted-foreground">Product Overrides</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">50%</div>
              <div className="text-sm text-muted-foreground">Default Fallback</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Priority Order:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Product Override:</strong> If a specific product has a custom rate, it takes priority</li>
              <li><strong>Category Rate:</strong> If no product override exists, use the category rate</li>
              <li><strong>Default Fallback:</strong> If no category rate exists, use 50% default margin</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}