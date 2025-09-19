import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Settings, Plus, Database, Package, Percent, RefreshCw, Edit, Trash2 } from 'lucide-react';

interface DropshipRateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DropshipRate {
  id: string;
  categoryName: string;
  markupPercentage: string;
  notes?: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductOverride extends DropshipRate {
  productId: string;
  reason?: string;
}

export default function DropshipRateCardModal({ isOpen, onClose }: DropshipRateCardModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryRate, setNewCategoryRate] = useState('');
  const [newCategoryNotes, setNewCategoryNotes] = useState('');
  
  const [newProductId, setNewProductId] = useState('');
  const [newProductRate, setNewProductRate] = useState('');
  const [newProductReason, setNewProductReason] = useState('');
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addType, setAddType] = useState<'category' | 'product'>('category');

  // Fetch rates data
  const { data: ratesData, isLoading } = useQuery({
    queryKey: ['/api/dropship/rates'],
    enabled: isOpen,
  });

  // Seed default rates mutation
  const seedRatesMutation = useMutation({
    mutationFn: () => fetch('/api/dropship/seed-rates', { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dropship/rates'] });
      toast({
        title: "Default Rates Loaded",
        description: "Industry-standard markup rates have been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load default rates",
        variant: "destructive",
      });
    }
  });

  // Add category rate mutation
  const addCategoryMutation = useMutation({
    mutationFn: (data: { categoryName: string; markupPercentage: number; notes?: string }) =>
      fetch('/api/dropship/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dropship/rates'] });
      setNewCategoryName('');
      setNewCategoryRate('');
      setNewCategoryNotes('');
      toast({
        title: "Category Rate Added",
        description: "New markup rate has been saved successfully",
      });
    }
  });

  // Add product override mutation
  const addProductMutation = useMutation({
    mutationFn: (data: { productId: string; markupPercentage: number; reason?: string }) =>
      fetch('/api/dropship/product-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dropship/rates'] });
      setNewProductId('');
      setNewProductRate('');
      setNewProductReason('');
      toast({
        title: "Product Override Added",
        description: "Custom markup rate has been set for this product",
      });
    }
  });

  const categoryRates = (ratesData as any)?.rates?.categoryRates || [];
  const productOverrides = (ratesData as any)?.rates?.productOverrides || [];
  const totalCategories = categoryRates.length;
  const activeRates = categoryRates.filter((rate: DropshipRate) => rate.isActive).length;
  const averageRate = categoryRates.length > 0 
    ? categoryRates.reduce((sum: number, rate: DropshipRate) => sum + parseFloat(rate.markupPercentage), 0) / categoryRates.length
    : 0;

  const handleAddCategory = () => {
    if (!newCategoryName || !newCategoryRate) {
      toast({
        title: "Missing Information",
        description: "Please provide both category name and markup percentage",
        variant: "destructive"
      });
      return;
    }

    addCategoryMutation.mutate({
      categoryName: newCategoryName,
      markupPercentage: parseFloat(newCategoryRate),
      notes: newCategoryNotes || undefined
    });
  };

  const handleAddProduct = () => {
    if (!newProductId || !newProductRate) {
      toast({
        title: "Missing Information", 
        description: "Please provide both product ID and markup percentage",
        variant: "destructive"
      });
      return;
    }

    addProductMutation.mutate({
      productId: newProductId,
      markupPercentage: parseFloat(newProductRate),
      reason: newProductReason || undefined
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-6 h-6 text-purple-600" />
            Dropship Rate Card Management
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure and manage dropship markup rates for automated profit calculations during product imports.
          </p>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{totalCategories}</p>
                  <p className="text-sm text-gray-600">Total Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Percent className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{averageRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Average Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{activeRates}</p>
                  <p className="text-sm text-gray-600">Active Rates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Markup Rates Table - Amazon Style */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Markup Rates Table</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => seedRatesMutation.mutate()}
                disabled={seedRatesMutation.isPending}
                className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Defaults
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rate
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category/Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Markup Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-600" />
                      <p className="text-gray-500 dark:text-gray-400">Loading markup rates...</p>
                    </td>
                  </tr>
                ) : categoryRates.length === 0 && productOverrides.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No markup rates defined. Click "Load Defaults" to get started.</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Category Rates */}
                    {categoryRates.map((rate: DropshipRate) => (
                      <tr key={rate.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{rate.categoryName}</div>
                          {rate.notes && <div className="text-sm text-gray-500 dark:text-gray-400">{rate.notes}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">{rate.markupPercentage}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Default
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rate.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {rate.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Product Overrides */}
                    {productOverrides.map((override: ProductOverride) => (
                      <tr key={override.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{override.productId}</div>
                          {override.reason && <div className="text-sm text-gray-500 dark:text-gray-400">{override.reason}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{override.markupPercentage}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Override
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            override.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {override.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Add Rate Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Rate</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={addType}
                    onChange={(e) => setAddType(e.target.value as 'category' | 'product')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="category">Category Rate</option>
                    <option value="product">Product Override</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {addType === 'category' ? 'Category Name' : 'Product ID'}
                  </label>
                  <input
                    type="text"
                    placeholder={addType === 'category' ? 'e.g. Electronics, Fashion' : 'e.g. woo-12345'}
                    value={addType === 'category' ? newCategoryName : newProductId}
                    onChange={(e) => addType === 'category' ? setNewCategoryName(e.target.value) : setNewProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Markup Percentage
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 40"
                    value={addType === 'category' ? newCategoryRate : newProductRate}
                    onChange={(e) => addType === 'category' ? setNewCategoryRate(e.target.value) : setNewProductRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {addType === 'category' ? 'Notes (Optional)' : 'Reason (Optional)'}
                  </label>
                  <textarea
                    placeholder={addType === 'category' ? 'Notes about this rate...' : 'Reason for custom rate...'}
                    value={addType === 'category' ? newCategoryNotes : newProductReason}
                    onChange={(e) => addType === 'category' ? setNewCategoryNotes(e.target.value) : setNewProductReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addType === 'category' ? handleAddCategory : handleAddProduct}
                  disabled={
                    addType === 'category' 
                      ? (!newCategoryName || !newCategoryRate || addCategoryMutation.isPending)
                      : (!newProductId || !newProductRate || addProductMutation.isPending)
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-medium"
                >
                  Add Rate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Rate Card Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Card Summary</CardTitle>
            <CardDescription>How the rate card system works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{categoryRates.length}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Category Rates</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{productOverrides.length}</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Product Overrides</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">50%</p>
                <p className="text-sm text-green-700 dark:text-green-300">Default Fallback</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Priority System:</strong> Product Override → Category Rate → Default Fallback (50%)</p>
              <p><strong>Automatic Application:</strong> Rates are automatically applied during WooCommerce product imports</p>
              <p><strong>Cost Calculation:</strong> Cost Price → Markup Rate → Sell Price → Profit Margin</p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}