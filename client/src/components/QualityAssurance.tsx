import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  BarChart3, 
  Shield, 
  TestTube, 
  Eye,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Search,
  Filter
} from 'lucide-react';

export default function QualityAssurance() {
  const [activeTab, setActiveTab] = useState('quality-checks');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const queryClient = useQueryClient();

  // Fetch quality check results
  const { data: qualityResults = [], isLoading: qualityLoading } = useQuery({
    queryKey: ['/api/qa/quality-checks'],
    queryFn: () => fetch('/api/qa/quality-checks').then(res => res.json()),
  });

  // Fetch A/B test results
  const { data: abTests = [], isLoading: abLoading } = useQuery({
    queryKey: ['/api/qa/ab-tests'],
    queryFn: () => fetch('/api/qa/ab-tests').then(res => res.json()),
  });

  // Fetch validation results
  const { data: validationResults = [], isLoading: validationLoading } = useQuery({
    queryKey: ['/api/qa/validation'],
    queryFn: () => fetch('/api/qa/validation').then(res => res.json()),
  });

  // Fetch integration test results
  const { data: integrationTests = [], isLoading: integrationLoading } = useQuery({
    queryKey: ['/api/qa/integration-tests'],
    queryFn: () => fetch('/api/qa/integration-tests').then(res => res.json()),
  });

  // Run quality checks mutation
  const runQualityChecksMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch('/api/qa/run-quality-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qa/quality-checks'] });
    },
  });

  // Create A/B test mutation
  const createAbTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      const response = await fetch('/api/qa/create-ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qa/ab-tests'] });
      setTestName('');
      setTestDescription('');
    },
  });

  // Run validation mutation
  const runValidationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/qa/run-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qa/validation'] });
    },
  });

  // Run integration tests mutation
  const runIntegrationTestsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/qa/run-integration-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qa/integration-tests'] });
    },
  });

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quality Assurance & Testing</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Automated quality checks, A/B testing, validation, and integration testing
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => runValidationMutation.mutate()}
            disabled={runValidationMutation.isPending}
            variant="outline"
          >
            <Shield className="w-4 h-4 mr-2" />
            Run All Validations
          </Button>
          <Button 
            onClick={() => runIntegrationTestsMutation.mutate()}
            disabled={runIntegrationTestsMutation.isPending}
          >
            <TestTube className="w-4 h-4 mr-2" />
            Run Integration Tests
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quality-checks" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Quality Checks
          </TabsTrigger>
          <TabsTrigger value="ab-testing" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Data Validation
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Integration Tests
          </TabsTrigger>
        </TabsList>

        {/* Quality Checks Tab */}
        <TabsContent value="quality-checks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Quality Score</p>
                    <p className="text-2xl font-bold text-green-600">87.4%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Products Checked</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Issues Found</p>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Quality Analysis</CardTitle>
                <div className="flex items-center gap-2">
                  <Input placeholder="Product ID" className="w-32" />
                  <Button 
                    onClick={() => runQualityChecksMutation.mutate(selectedProduct)}
                    disabled={runQualityChecksMutation.isPending}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Check
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityResults.map((result: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{result.productName}</h4>
                        <p className="text-sm text-gray-600">{result.productId}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityScoreBg(result.overallScore)} ${getQualityScoreColor(result.overallScore)}`}>
                        {result.overallScore}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Image Quality</p>
                        <Progress value={result.imageQuality} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">{result.imageQuality}% - {result.imageQuality >= 80 ? 'Good' : 'Needs Improvement'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Description Score</p>
                        <Progress value={result.descriptionScore} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">{result.descriptionScore}% - {result.descriptionScore >= 80 ? 'Complete' : 'Incomplete'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">SEO Score</p>
                        <Progress value={result.seoScore} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">{result.seoScore}% - {result.seoScore >= 80 ? 'Optimized' : 'Needs SEO'}</p>
                      </div>
                    </div>
                    
                    {result.issues && result.issues.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Issues Found:</p>
                        <div className="space-y-1">
                          {result.issues.map((issue: string, issueIndex: number) => (
                            <div key={issueIndex} className="flex items-center gap-2 text-sm text-orange-600">
                              <AlertTriangle className="w-3 h-3" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="ab-testing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Tests</p>
                    <p className="text-2xl font-bold text-blue-600">8</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Improvement</p>
                    <p className="text-2xl font-bold text-green-600">+12.3%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tests Completed</p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New A/B Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Test Name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
                <Textarea
                  placeholder="Test Description"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  rows={3}
                />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Test Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product-title">Product Title</SelectItem>
                    <SelectItem value="product-description">Product Description</SelectItem>
                    <SelectItem value="product-image">Product Image</SelectItem>
                    <SelectItem value="pricing-display">Pricing Display</SelectItem>
                    <SelectItem value="call-to-action">Call to Action</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => createAbTestMutation.mutate({
                    name: testName,
                    description: testDescription,
                    type: 'product-title'
                  })}
                  disabled={!testName || createAbTestMutation.isPending}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Create Test
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active A/B Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {abTests.map((test: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{test.name}</h4>
                        <Badge variant={test.status === 'active' ? 'default' : 'secondary'}>
                          {test.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Variant A</p>
                          <p className="text-sm text-gray-600">Conversion: {test.variantA.conversion}%</p>
                          <p className="text-sm text-gray-600">Visitors: {test.variantA.visitors}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Variant B</p>
                          <p className="text-sm text-gray-600">Conversion: {test.variantB.conversion}%</p>
                          <p className="text-sm text-gray-600">Visitors: {test.variantB.visitors}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            Improvement: 
                            <span className={test.improvement >= 0 ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                              {test.improvement >= 0 ? '+' : ''}{test.improvement}%
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Confidence: {test.confidence}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Validation Tab */}
        <TabsContent value="validation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valid Products</p>
                    <p className="text-2xl font-bold text-green-600">1,224</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Validation Errors</p>
                    <p className="text-2xl font-bold text-red-600">23</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
                    <p className="text-2xl font-bold text-orange-600">89</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-blue-600">98.2%</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationResults.map((result: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{result.ruleName}</h4>
                        <p className="text-sm text-gray-600">{result.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.severity === 'error' ? 'destructive' : result.severity === 'warning' ? 'secondary' : 'default'}>
                          {result.severity}
                        </Badge>
                        {result.severity === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                        {result.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                        {result.severity === 'pass' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Checked</p>
                        <p className="text-lg font-semibold">{result.totalChecked}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Passed</p>
                        <p className="text-lg font-semibold text-green-600">{result.passed}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Failed</p>
                        <p className="text-lg font-semibold text-red-600">{result.failed}</p>
                      </div>
                    </div>
                    
                    {result.failedProducts && result.failedProducts.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Failed Products:</p>
                        <div className="text-sm text-gray-600">
                          {result.failedProducts.slice(0, 3).map((product: string, prodIndex: number) => (
                            <span key={prodIndex} className="inline-block bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mr-2 mb-1">
                              {product}
                            </span>
                          ))}
                          {result.failedProducts.length > 3 && (
                            <span className="text-blue-600">+{result.failedProducts.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Tests Tab */}
        <TabsContent value="integration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">API Endpoints</p>
                    <p className="text-2xl font-bold text-green-600">24/26</p>
                  </div>
                  <TestTube className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Data Sources</p>
                    <p className="text-2xl font-bold text-blue-600">7/8</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                    <p className="text-2xl font-bold text-green-600">245ms</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">96.2%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationTests.map((test: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{test.name}</h4>
                        <p className="text-sm text-gray-600">{test.endpoint}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={test.status === 'pass' ? 'default' : 'destructive'}>
                          {test.status}
                        </Badge>
                        {test.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {test.status === 'fail' && <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Response Time</p>
                        <p className="text-lg font-semibold">{test.responseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status Code</p>
                        <p className="text-lg font-semibold">{test.statusCode}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Data Quality</p>
                        <p className="text-lg font-semibold">{test.dataQuality}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Run</p>
                        <p className="text-sm text-gray-600">{test.lastRun}</p>
                      </div>
                    </div>
                    
                    {test.errors && test.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Errors:</p>
                        <div className="space-y-1">
                          {test.errors.map((error: string, errorIndex: number) => (
                            <div key={errorIndex} className="flex items-center gap-2 text-sm text-red-600">
                              <XCircle className="w-3 h-3" />
                              {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}