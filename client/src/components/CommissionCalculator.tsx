import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  Edit,
  Save,
  X,
  Tag,
  Percent,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CommissionCalculation {
  productId: string;
  productName: string;
  productPrice: number;
  category: string;
  commissionRate: number;
  commissionAmount: number;
  isPromotional: boolean;
  promotionalRate?: number;
  actualRate: number;
  source: 'database' | 'default' | 'promotional';
}

interface CommissionCalculatorProps {
  productId: string;
  productName: string;
  productPrice: number;
  category: string;
  productType: 'affiliate' | 'dropship';
  costPrice?: number;
  onSave: (data: { commissionRate?: number; costPrice?: number; profitMargin?: number }) => void;
}

export function CommissionCalculator({
  productId,
  productName,
  productPrice,
  category,
  productType,
  costPrice,
  onSave
}: CommissionCalculatorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRate, setEditingRate] = useState<number>(0);
  const [editingCostPrice, setEditingCostPrice] = useState<number>(costPrice || 0);
  const [editingProfitAmount, setEditingProfitAmount] = useState<number>(0);
  const [editingProfitMargin, setEditingProfitMargin] = useState<number>(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch commission calculation
  const { data: commission, isLoading, error } = useQuery<CommissionCalculation>({
    queryKey: ['/api/products', productId, 'commission'],
    enabled: productType === 'affiliate' && !!productId,
    staleTime: 0, // Force fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const updateCommissionMutation = useMutation({
    mutationFn: async (commissionRate: number) => {
      const response = await fetch(`/api/products/${productId}/commission-rate`, {
        method: 'PUT',
        body: JSON.stringify({ commissionRate }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to update commission rate');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId, 'commission'] });
      toast({
        title: "Success",
        description: "Commission rate updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update commission rate",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (commission && !isEditing) {
      // Use commissionRate (database stored) as primary, fallback to actualRate (calculated)
      setEditingRate(commission.commissionRate || commission.actualRate);
    }
  }, [commission, isEditing]);

  const handleSave = () => {
    if (productType === 'affiliate') {
      if (editingRate < 0 || editingRate > 100) {
        toast({
          title: "Invalid Rate",
          description: "Commission rate must be between 0% and 100%",
          variant: "destructive",
        });
        return;
      }
      
      updateCommissionMutation.mutate(editingRate);
      onSave({ commissionRate: editingRate });
    } else {
      // Dropshipping model
      if (editingCostPrice < 0) {
        toast({
          title: "Invalid Cost",
          description: "Cost price cannot be negative",
          variant: "destructive",
        });
        return;
      }
      
      onSave({ costPrice: editingCostPrice });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (commission) {
      setEditingRate(commission.actualRate);
    }
    setEditingCostPrice(costPrice || 0);
    setIsEditing(false);
  };

  // Calculate values based on product type
  const calculateValues = () => {
    if (productType === 'affiliate') {
      // Use commissionRate (database stored) as primary, fallback to actualRate (calculated)
      const rate = isEditing ? editingRate : (commission?.commissionRate || commission?.actualRate || 0);
      const earnings = (productPrice * rate) / 100;
      
      // Debug logging
      if (console && console.log && process.env.NODE_ENV === 'development') {
        console.log(`[CommissionCalculator] Product: ${productId}, Commission:`, commission, 'Rate:', rate, 'Earnings:', earnings);
      }
      
      return {
        rate,
        earnings,
        margin: rate,
        profit: earnings
      };
    } else {
      // Dropshipping
      const cost = isEditing ? editingCostPrice : (costPrice || 0);
      const profit = productPrice - cost;
      const margin = cost > 0 ? ((profit / cost) * 100) : 0;
      return {
        rate: margin,
        earnings: profit,
        margin,
        profit,
        cost
      };
    }
  };

  const values = calculateValues();

  if (productType === 'affiliate' && isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4 text-orange-500" />
            Commission Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-sm text-gray-600">Loading commission data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (productType === 'affiliate' && error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Commission Calculator - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">
            Failed to load commission data. API URL: /api/products/{productId}/commission
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${productType === 'affiliate' ? 'border-orange-200 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:from-orange-900/10 dark:to-yellow-900/10' : 'border-green-200 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {productType === 'affiliate' ? (
              <Tag className="h-4 w-4 text-orange-500" />
            ) : (
              <DollarSign className="h-4 w-4 text-green-500" />
            )}
            <span>
              {productType === 'affiliate' ? 'Commission Calculator' : 'Profit Calculator'}
            </span>
            <Badge variant="outline" className={`text-xs ${productType === 'affiliate' ? 'border-orange-300 text-orange-700' : 'border-green-300 text-green-700'}`}>
              {productType === 'affiliate' ? 'Affiliate' : 'Dropship'}
            </Badge>
          </div>
          
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(true);
                // Initialize editing values with current values
                if (productType === 'affiliate') {
                  setEditingRate(values.rate);
                } else {
                  setEditingCostPrice(costPrice || 0);
                  setEditingProfitAmount(values.profit);
                  setEditingProfitMargin(values.margin);
                }
              }}
              className="h-7 px-2 hover:bg-white/50"
            >
              <Edit className="h-3 w-3" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={updateCommissionMutation.isPending}
                className="h-7 px-2 text-green-600 hover:bg-green-100"
              >
                {updateCommissionMutation.isPending ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-7 px-2 text-red-600 hover:bg-red-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 px-0">
        <div className="space-y-3 px-4">
          {/* Full Width Horizontal Layout */}
          <div className={`grid ${productType === 'affiliate' ? 'grid-cols-3' : 'grid-cols-4'} gap-3 text-sm`}>
            {productType === 'affiliate' ? (
              <>
                {/* Affiliate Model - Full Width */}
                <div>
                  <div className="text-xs text-gray-600 mb-1">Amazon Price</div>
                  <div className="text-base font-semibold text-blue-600">${productPrice.toFixed(2)}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 mb-1">Commission Rate</div>
                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={editingRate}
                          onChange={(e) => setEditingRate(parseFloat(e.target.value) || 0)}
                          className="w-16 h-7 text-sm"
                          step="0.1"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-orange-600">{values.rate.toFixed(2)}%</span>
                        {commission?.isPromotional && (
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Promo
                          </Badge>
                        )}
                        {commission?.source === 'default' && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle className="h-3 w-3" />
                            Default
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 mb-1">Earnings per Sale</div>
                  <div className="text-base font-semibold text-green-600">
                    ${values.earnings.toFixed(2)}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Dropshipping Model - Reordered Layout: Cost -> Profit -> Margin -> Sell */}
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Cost Price</div>
                  <div className="flex items-center justify-center">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm">$</span>
                        <Input
                          type="number"
                          value={editingCostPrice}
                          onChange={(e) => {
                            const cost = parseFloat(e.target.value) || 0;
                            setEditingCostPrice(cost);
                            // Recalculate margin based on current profit amount
                            const margin = cost > 0 ? (editingProfitAmount / cost * 100) : 0;
                            setEditingProfitMargin(margin);
                          }}
                          className="w-16 h-7 text-sm text-center"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    ) : (
                      <span className="text-base font-semibold text-red-600">${(values.cost || 0).toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Profit per Sale</div>
                  <div className="flex items-center justify-center">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm">$</span>
                        <Input
                          type="number"
                          value={editingProfitAmount}
                          onChange={(e) => {
                            const profit = parseFloat(e.target.value) || 0;
                            setEditingProfitAmount(profit);
                            // Calculate margin from profit: margin = profit / cost * 100
                            const margin = editingCostPrice > 0 ? (profit / editingCostPrice * 100) : 0;
                            setEditingProfitMargin(margin);
                          }}
                          className="w-16 h-7 text-sm text-center"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    ) : (
                      <span className={`text-base font-semibold ${values.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${values.profit.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Profit Margin</div>
                  <div className="flex items-center justify-center">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={editingProfitMargin}
                          onChange={(e) => {
                            const margin = parseFloat(e.target.value) || 0;
                            setEditingProfitMargin(margin);
                            // Calculate profit from margin: profit = cost * (margin / 100)
                            const profit = editingCostPrice * (margin / 100);
                            setEditingProfitAmount(profit);
                          }}
                          className="w-16 h-7 text-sm text-center"
                          step="0.1"
                          min="0"
                          max="1000"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    ) : (
                      <span className={`text-base font-semibold ${values.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {values.margin.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Sell Price</div>
                  <div className="text-base font-semibold text-blue-600">
                    ${isEditing ? (editingCostPrice + editingProfitAmount).toFixed(2) : productPrice.toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Commission Source Info for Affiliates */}
          {productType === 'affiliate' && commission && (
            <div className="text-xs text-gray-500">
              Rate source: <span className="font-medium">{commission.source === 'database' ? 'Custom' : 'Default'}</span>
              {commission.isPromotional && commission.promotionalRate && (
                <span className="text-green-600 ml-2">• Promo active</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}