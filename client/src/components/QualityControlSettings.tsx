import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Settings, AlertCircle, Check, X } from 'lucide-react';

interface QualityControlSettings {
  // Validation Rules
  enableValidation: boolean;
  requireTitle: boolean;
  requireDescription: boolean;
  requireImages: boolean;
  requirePrice: boolean;
  minDescriptionLength: number;
  minPriceValue: number;
  maxPriceValue: number;
  
  // Content Filtering
  enableContentFiltering: boolean;
  blockedKeywords: string[];
  blockedBrands: string[];
  allowedBrands: string[];
  strictMode: boolean;
  
  // Duplicate Detection
  enableDuplicateDetection: boolean;
  titleSimilarityThreshold: number;
  imageSimilarityLevel: 'low' | 'medium' | 'high';
  priceDifferenceTolerance: number;
  autoActionForDuplicates: 'flag' | 'reject' | 'merge';
  
  // Performance Thresholds
  enablePerformanceTracking: boolean;
  minimumQualityScore: number;
  historicalPerformanceWeight: number;
}

interface QualityDashboardStats {
  totalProductsChecked: number;
  averageQualityScore: number;
  rejectionBreakdown: Record<string, number>;
  recentIssues: string[];
}

export function QualityControlSettings() {
  const [settings, setSettings] = useState<QualityControlSettings>({
    // Default values
    enableValidation: true,
    requireTitle: true,
    requireDescription: true,
    requireImages: true,
    requirePrice: true,
    minDescriptionLength: 50,
    minPriceValue: 0.01,
    maxPriceValue: 50000,
    
    enableContentFiltering: true,
    blockedKeywords: [
      'adult', 'xxx', 'weapon', 'drug', 'cannabis', 'get rich quick', 
      'make money fast', 'limited time only', 'cure cancer', 'lose weight fast'
    ],
    blockedBrands: ['supreme', 'gucci', 'louis vuitton', 'chanel', 'nike', 'apple'],
    allowedBrands: [],
    strictMode: false,
    
    enableDuplicateDetection: true,
    titleSimilarityThreshold: 85,
    imageSimilarityLevel: 'medium',
    priceDifferenceTolerance: 10,
    autoActionForDuplicates: 'flag',
    
    enablePerformanceTracking: true,
    minimumQualityScore: 60,
    historicalPerformanceWeight: 30
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock dashboard stats for demo purposes
  const dashboardStats: QualityDashboardStats = {
    totalProductsChecked: 0,
    averageQualityScore: 0,
    rejectionBreakdown: {},
    recentIssues: []
  };

  // Local save settings function (no API call)
  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem('qualityControlSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Quality control settings have been updated locally.",
    });
  };

  // Local reset to defaults function
  const handleReset = () => {
    const defaultSettings: QualityControlSettings = {
      enableValidation: true,
      requireTitle: true,
      requireDescription: true,
      requireImages: true,
      requirePrice: true,
      minDescriptionLength: 50,
      minPriceValue: 0.01,
      maxPriceValue: 50000,
      
      enableContentFiltering: true,
      blockedKeywords: [
        'adult', 'xxx', 'weapon', 'drug', 'cannabis', 'get rich quick', 
        'make money fast', 'limited time only', 'cure cancer', 'lose weight fast'
      ],
      blockedBrands: ['supreme', 'gucci', 'louis vuitton', 'chanel', 'nike', 'apple'],
      allowedBrands: [],
      strictMode: false,
      
      enableDuplicateDetection: true,
      titleSimilarityThreshold: 85,
      imageSimilarityLevel: 'medium',
      priceDifferenceTolerance: 10,
      autoActionForDuplicates: 'flag',
      
      enablePerformanceTracking: true,
      minimumQualityScore: 60,
      historicalPerformanceWeight: 30
    };
    
    setSettings(defaultSettings);
    localStorage.removeItem('qualityControlSettings');
    toast({
      title: "Settings Reset",
      description: "Quality control settings have been reset to defaults.",
    });
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('qualityControlSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.warn('Failed to parse saved quality control settings');
      }
    }
  }, []);

  const updateBlockedKeywords = (keywords: string) => {
    setSettings(prev => ({
      ...prev,
      blockedKeywords: keywords.split('\n').filter(k => k.trim().length > 0)
    }));
  };

  const updateBlockedBrands = (brands: string) => {
    setSettings(prev => ({
      ...prev,
      blockedBrands: brands.split('\n').filter(b => b.trim().length > 0)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Quality Control Settings
          </h2>
          <p className="text-muted-foreground">
            Configure quality control rules to automatically filter and validate products during import.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>

      {/* Quality Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{dashboardStats.totalProductsChecked}</div>
              <p className="text-sm text-muted-foreground">Products Checked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{dashboardStats.averageQualityScore}%</div>
              <p className="text-sm text-muted-foreground">Avg Quality Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(dashboardStats.rejectionBreakdown).reduce((sum, count) => sum + count, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Rejections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {dashboardStats.totalProductsChecked - Object.values(dashboardStats.rejectionBreakdown).reduce((sum, count) => sum + count, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Approved Products</p>
            </CardContent>
          </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="validation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="validation">Validation Rules</TabsTrigger>
          <TabsTrigger value="content">Content Filtering</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicate Detection</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Validation Rules</CardTitle>
              <CardDescription>
                Configure required fields and validation criteria for imported products.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-validation">Enable Import Validation</Label>
                <Switch
                  id="enable-validation"
                  checked={settings.enableValidation}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableValidation: checked }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.requireTitle}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireTitle: checked }))}
                  />
                  <Label>Require Title</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.requireDescription}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireDescription: checked }))}
                  />
                  <Label>Require Description</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.requireImages}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireImages: checked }))}
                  />
                  <Label>Require Images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.requirePrice}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requirePrice: checked }))}
                  />
                  <Label>Require Price</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Min Description Length</Label>
                  <Input
                    type="number"
                    value={settings.minDescriptionLength}
                    onChange={(e) => setSettings(prev => ({ ...prev, minDescriptionLength: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.minPriceValue}
                    onChange={(e) => setSettings(prev => ({ ...prev, minPriceValue: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Price ($)</Label>
                  <Input
                    type="number"
                    value={settings.maxPriceValue}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxPriceValue: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Filtering</CardTitle>
              <CardDescription>
                Configure content filters to automatically block inappropriate or unwanted products.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-content-filtering">Enable Content Filtering</Label>
                <Switch
                  id="enable-content-filtering"
                  checked={settings.enableContentFiltering}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableContentFiltering: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="strict-mode">Strict Mode (More aggressive filtering)</Label>
                <Switch
                  id="strict-mode"
                  checked={settings.strictMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, strictMode: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Blocked Keywords (one per line)</Label>
                <Textarea
                  placeholder="Enter blocked keywords..."
                  value={settings.blockedKeywords.join('\n')}
                  onChange={(e) => updateBlockedKeywords(e.target.value)}
                  rows={8}
                />
                <p className="text-sm text-muted-foreground">
                  Products containing these keywords will be automatically rejected.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Blocked Brands (one per line)</Label>
                <Textarea
                  placeholder="Enter blocked brand names..."
                  value={settings.blockedBrands.join('\n')}
                  onChange={(e) => updateBlockedBrands(e.target.value)}
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  Products claiming to be from these brands will be flagged for trademark review.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Duplicate Detection</CardTitle>
              <CardDescription>
                Configure how the system detects and handles duplicate products.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-duplicate-detection">Enable Duplicate Detection</Label>
                <Switch
                  id="enable-duplicate-detection"
                  checked={settings.enableDuplicateDetection}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableDuplicateDetection: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Title Similarity Threshold: {settings.titleSimilarityThreshold}%</Label>
                <Slider
                  value={[settings.titleSimilarityThreshold]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, titleSimilarityThreshold: value }))}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Products with titles {settings.titleSimilarityThreshold}% similar or higher will be flagged as potential duplicates.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Price Difference Tolerance: ±{settings.priceDifferenceTolerance}%</Label>
                <Slider
                  value={[settings.priceDifferenceTolerance]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, priceDifferenceTolerance: value }))}
                  max={50}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Thresholds</CardTitle>
              <CardDescription>
                Set minimum quality standards and performance tracking settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-performance-tracking">Enable Performance Tracking</Label>
                <Switch
                  id="enable-performance-tracking"
                  checked={settings.enablePerformanceTracking}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enablePerformanceTracking: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Quality Score: {settings.minimumQualityScore}%</Label>
                <Slider
                  value={[settings.minimumQualityScore]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, minimumQualityScore: value }))}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Products scoring below {settings.minimumQualityScore}% will be automatically rejected.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Historical Performance Weight: {settings.historicalPerformanceWeight}%</Label>
                <Slider
                  value={[settings.historicalPerformanceWeight]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, historicalPerformanceWeight: value }))}
                  max={100}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rejection Breakdown */}
      {dashboardStats && Object.keys(dashboardStats.rejectionBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Rejection Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(dashboardStats.rejectionBreakdown).map(([reason, count]) => (
                <div key={reason} className="text-center">
                  <Badge variant="destructive" className="mb-2">
                    {reason.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}