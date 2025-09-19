import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Database, 
  Edit, 
  Plus, 
  Trash2, 
  Loader2, 
  Save, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AmazonCommissionRate {
  id: number;
  categoryName: string;
  commissionRate: string;
  rateSource: string;
  lastUpdated: string;
  isActive: boolean;
  createdAt: string;
}

interface EditRateDialogData {
  open: boolean;
  rate?: AmazonCommissionRate;
}

export function AmazonRatesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialog, setEditDialog] = useState<EditRateDialogData>({ open: false });
  const [newRate, setNewRate] = useState({ categoryName: '', commissionRate: '' });

  // Fetch Amazon commission rates
  const { data: rates = [], isLoading, error } = useQuery<AmazonCommissionRate[]>({
    queryKey: ['/api/amazon-rates'],
  });

  // Create/Update rate mutation
  const saveRateMutation = useMutation({
    mutationFn: async (data: { id?: number; categoryName: string; commissionRate: number }) => {
      const url = data.id ? `/api/amazon-rates/${data.id}` : '/api/amazon-rates';
      const method = data.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: data.categoryName,
          commissionRate: data.commissionRate,
          rateSource: data.id ? 'custom' : 'amazon_official'
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save rate');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/amazon-rates'] });
      setEditDialog({ open: false });
      setNewRate({ categoryName: '', commissionRate: '' });
      toast({
        title: "Rate Saved",
        description: "Amazon commission rate has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Save Failed", 
        description: error instanceof Error ? error.message : 'Failed to save commission rate',
        variant: "destructive",
      });
    },
  });

  // Delete rate mutation
  const deleteRateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/amazon-rates/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete rate');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/amazon-rates'] });
      toast({
        title: "Rate Deleted",
        description: "Commission rate has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : 'Failed to delete commission rate',
        variant: "destructive",
      });
    },
  });

  // Seed default rates mutation
  const seedDefaultRatesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/amazon-rates/seed-defaults', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to seed default rates');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/amazon-rates'] });
      toast({
        title: "Default Rates Loaded",
        description: "Amazon default commission rates have been loaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Seed Failed",
        description: error instanceof Error ? error.message : 'Failed to load default rates',
        variant: "destructive",
      });
    },
  });

  const handleSaveRate = () => {
    const rate = editDialog.rate 
      ? { 
          id: editDialog.rate.id, 
          categoryName: editDialog.rate.categoryName, 
          commissionRate: parseFloat(editDialog.rate.commissionRate) 
        }
      : { 
          categoryName: newRate.categoryName, 
          commissionRate: parseFloat(newRate.commissionRate) 
        };

    if (!rate.categoryName || !rate.commissionRate || rate.commissionRate <= 0) {
      toast({
        title: "Invalid Data",
        description: "Please provide valid category name and commission rate.",
        variant: "destructive",
      });
      return;
    }

    saveRateMutation.mutate(rate);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
        <p>Loading Amazon commission rates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-medium mb-2">Failed to Load Rates</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Unable to load Amazon commission rates
        </p>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/amazon-rates'] })}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Categories</p>
                <p className="text-2xl font-bold">{rates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rate</p>
                <p className="text-2xl font-bold">
                  {rates.length > 0 
                    ? `${(rates.reduce((sum: number, rate: AmazonCommissionRate) => sum + parseFloat(rate.commissionRate), 0) / rates.length).toFixed(2)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Rates</p>
                <p className="text-2xl font-bold">
                  {rates.filter((rate: AmazonCommissionRate) => rate.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Commission Rates Table</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => seedDefaultRatesMutation.mutate()}
            disabled={seedDefaultRatesMutation.isPending}
          >
            {seedDefaultRatesMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Load Defaults
          </Button>
          <Button 
            onClick={() => setEditDialog({ open: true })}
            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rate
          </Button>
        </div>
      </div>

      {/* Rates Table */}
      {rates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Commission Rates</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by loading the default Amazon commission rates or adding custom rates.
            </p>
            <div className="flex items-center gap-2 justify-center">
              <Button 
                variant="outline"
                onClick={() => seedDefaultRatesMutation.mutate()}
                disabled={seedDefaultRatesMutation.isPending}
              >
                {seedDefaultRatesMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Load Amazon Defaults
              </Button>
              <Button 
                onClick={() => setEditDialog({ open: true })}
                style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Rate
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-3 border-b font-semibold text-sm text-gray-600 dark:text-gray-400">
              <div>Category</div>
              <div>Commission Rate</div>
              <div>Source</div>
              <div>Last Updated</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-2">
              {rates.map((rate: AmazonCommissionRate) => (
                <div key={rate.id} className="grid grid-cols-6 gap-4 p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="font-medium">{rate.categoryName}</div>
                  <div>
                    <span className="font-mono text-green-600 font-semibold">
                      {parseFloat(rate.commissionRate).toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <Badge variant={rate.rateSource === 'amazon_official' ? 'default' : 'secondary'}>
                      {rate.rateSource === 'amazon_official' ? 'Official' : 'Custom'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(rate.lastUpdated).toLocaleDateString()}
                  </div>
                  <div>
                    <Badge variant={rate.isActive ? 'default' : 'secondary'}>
                      {rate.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditDialog({ open: true, rate })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRateMutation.mutate(rate.id)}
                        disabled={deleteRateMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Rate Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDialog.rate ? 'Edit Commission Rate' : 'Add New Commission Rate'}
            </DialogTitle>
            <DialogDescription>
              {editDialog.rate 
                ? 'Update the commission rate for this category.' 
                : 'Add a new Amazon affiliate commission rate for automatic calculations.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={editDialog.rate ? editDialog.rate.categoryName : newRate.categoryName}
                onChange={(e) => {
                  if (editDialog.rate) {
                    setEditDialog({ 
                      ...editDialog, 
                      rate: { ...editDialog.rate, categoryName: e.target.value }
                    });
                  } else {
                    setNewRate({ ...newRate, categoryName: e.target.value });
                  }
                }}
                placeholder="e.g., Electronics & Technology"
              />
            </div>
            
            <div>
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={editDialog.rate ? editDialog.rate.commissionRate : newRate.commissionRate}
                onChange={(e) => {
                  if (editDialog.rate) {
                    setEditDialog({ 
                      ...editDialog, 
                      rate: { ...editDialog.rate, commissionRate: e.target.value }
                    });
                  } else {
                    setNewRate({ ...newRate, commissionRate: e.target.value });
                  }
                }}
                placeholder="e.g., 4.50"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false })}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRate}
              disabled={saveRateMutation.isPending}
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            >
              {saveRateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {editDialog.rate ? 'Update Rate' : 'Add Rate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AmazonRatesManagement;