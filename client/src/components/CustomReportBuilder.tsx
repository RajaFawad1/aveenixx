import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Settings, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Table,
  Filter,
  Calendar,
  FileText,
  Share2,
  Save,
  RefreshCw,
  DragDropIcon,
  GripVertical
} from 'lucide-react';

interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  category: string;
  description?: string;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'table';
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregation?: string;
}

interface CustomReportBuilderProps {
  className?: string;
}

const CustomReportBuilder: React.FC<CustomReportBuilderProps> = ({ className }) => {
  const [reportName, setReportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({ type: 'table' });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('fields');

  const availableFields: ReportField[] = [
    // Product Fields
    { id: 'product_name', name: 'Product Name', type: 'text', category: 'Product' },
    { id: 'product_category', name: 'Category', type: 'select', category: 'Product' },
    { id: 'product_price', name: 'Price', type: 'number', category: 'Product' },
    { id: 'product_status', name: 'Status', type: 'select', category: 'Product' },
    { id: 'created_date', name: 'Created Date', type: 'date', category: 'Product' },
    { id: 'approval_date', name: 'Approval Date', type: 'date', category: 'Product' },
    
    // Performance Fields
    { id: 'approval_rate', name: 'Approval Rate', type: 'number', category: 'Performance' },
    { id: 'time_to_market', name: 'Time to Market', type: 'number', category: 'Performance' },
    { id: 'quality_score', name: 'Quality Score', type: 'number', category: 'Performance' },
    { id: 'revenue_impact', name: 'Revenue Impact', type: 'number', category: 'Performance' },
    
    // Intelligence Fields
    { id: 'viability_score', name: 'Viability Score', type: 'number', category: 'Intelligence' },
    { id: 'competitive_score', name: 'Competitive Score', type: 'number', category: 'Intelligence' },
    { id: 'market_trend_score', name: 'Market Trend Score', type: 'number', category: 'Intelligence' },
    { id: 'suggested_price', name: 'AI Suggested Price', type: 'number', category: 'Intelligence' },
    
    // Vendor Fields
    { id: 'vendor_name', name: 'Vendor Name', type: 'text', category: 'Vendor' },
    { id: 'vendor_rating', name: 'Vendor Rating', type: 'number', category: 'Vendor' },
    { id: 'vendor_category', name: 'Vendor Category', type: 'select', category: 'Vendor' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'between', label: 'Between' },
    { value: 'is_null', label: 'Is Empty' },
    { value: 'is_not_null', label: 'Is Not Empty' }
  ];

  const aggregations = [
    { value: 'count', label: 'Count' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' }
  ];

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = async () => {
    try {
      const response = await fetch('/api/reports/saved');
      if (response.ok) {
        const reports = await response.json();
        setSavedReports(reports);
      }
    } catch (error) {
      console.error('Error loading saved reports:', error);
    }
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, ...updates } : f
    ));
  };

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const generateReport = async () => {
    const reportConfig = {
      name: reportName,
      fields: selectedFields,
      filters,
      chartConfig
    };

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportConfig)
      });

      if (response.ok) {
        setIsPreviewMode(true);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const saveReport = async () => {
    const reportConfig = {
      name: reportName,
      fields: selectedFields,
      filters,
      chartConfig,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/reports/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportConfig)
      });

      if (response.ok) {
        loadSavedReports();
      }
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const response = await fetch(`/api/reports/export?format=${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: selectedFields, filters, chartConfig })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName || 'report'}.${format === 'excel' ? 'xlsx' : format}`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const getFieldsByCategory = (category: string) => {
    return availableFields.filter(field => field.category === category);
  };

  const categories = [...new Set(availableFields.map(field => field.category))];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Custom Report Builder
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create drag-and-drop custom analytics reports with advanced filtering
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsPreviewMode(!isPreviewMode)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={saveReport} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Report
          </Button>
          <Button onClick={generateReport} className="bg-purple-600 hover:bg-purple-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      {!isPreviewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="fields">Fields</TabsTrigger>
                    <TabsTrigger value="filters">Filters</TabsTrigger>
                    <TabsTrigger value="chart">Visualization</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  {/* Fields Tab */}
                  <TabsContent value="fields" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportName">Report Name</Label>
                      <Input
                        id="reportName"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="Enter report name..."
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Select Fields</h4>
                      {categories.map(category => (
                        <div key={category} className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b pb-1">
                            {category}
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            {getFieldsByCategory(category).map(field => (
                              <div key={field.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={field.id}
                                  checked={selectedFields.includes(field.id)}
                                  onCheckedChange={() => toggleField(field.id)}
                                />
                                <Label htmlFor={field.id} className="text-sm cursor-pointer">
                                  {field.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Filters Tab */}
                  <TabsContent value="filters" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Report Filters</h4>
                      <Button onClick={addFilter} size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Filter
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {filters.map(filter => (
                        <div key={filter.id} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-4">
                            <Label className="text-sm">Field</Label>
                            <Select value={filter.field} onValueChange={(value) => updateFilter(filter.id, { field: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableFields.map(field => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3">
                            <Label className="text-sm">Operator</Label>
                            <Select value={filter.operator} onValueChange={(value) => updateFilter(filter.id, { operator: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {operators.map(op => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-4">
                            <Label className="text-sm">Value</Label>
                            <Input
                              value={filter.value}
                              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                              placeholder="Enter value..."
                            />
                          </div>

                          <div className="col-span-1">
                            <Button
                              onClick={() => removeFilter(filter.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filters.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No filters added yet</p>
                        <p className="text-sm">Click "Add Filter" to filter your report data</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Chart Tab */}
                  <TabsContent value="chart" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Chart Type</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {[
                            { type: 'table', icon: Table, label: 'Table' },
                            { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
                            { type: 'line', icon: LineChart, label: 'Line Chart' },
                            { type: 'pie', icon: PieChart, label: 'Pie Chart' }
                          ].map(({ type, icon: Icon, label }) => (
                            <Button
                              key={type}
                              variant={chartConfig.type === type ? "default" : "outline"}
                              className="h-20 flex-col"
                              onClick={() => setChartConfig({ ...chartConfig, type: type as any })}
                            >
                              <Icon className="w-6 h-6 mb-2" />
                              <span className="text-xs">{label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {chartConfig.type !== 'table' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>X-Axis</Label>
                              <Select value={chartConfig.xAxis} onValueChange={(value) => setChartConfig({ ...chartConfig, xAxis: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select X-axis field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedFields.map(fieldId => {
                                    const field = availableFields.find(f => f.id === fieldId);
                                    return field ? (
                                      <SelectItem key={field.id} value={field.id}>
                                        {field.name}
                                      </SelectItem>
                                    ) : null;
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Y-Axis</Label>
                              <Select value={chartConfig.yAxis} onValueChange={(value) => setChartConfig({ ...chartConfig, yAxis: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Y-axis field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedFields.map(fieldId => {
                                    const field = availableFields.find(f => f.id === fieldId);
                                    return field && field.type === 'number' ? (
                                      <SelectItem key={field.id} value={field.id}>
                                        {field.name}
                                      </SelectItem>
                                    ) : null;
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Group By</Label>
                              <Select value={chartConfig.groupBy} onValueChange={(value) => setChartConfig({ ...chartConfig, groupBy: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grouping field" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">No grouping</SelectItem>
                                  {selectedFields.map(fieldId => {
                                    const field = availableFields.find(f => f.id === fieldId);
                                    return field && field.type === 'select' ? (
                                      <SelectItem key={field.id} value={field.id}>
                                        {field.name}
                                      </SelectItem>
                                    ) : null;
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Aggregation</Label>
                              <Select value={chartConfig.aggregation} onValueChange={(value) => setChartConfig({ ...chartConfig, aggregation: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select aggregation" />
                                </SelectTrigger>
                                <SelectContent>
                                  {aggregations.map(agg => (
                                    <SelectItem key={agg.value} value={agg.value}>
                                      {agg.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Export Options</Label>
                        <div className="flex gap-2 mt-2">
                          <Button onClick={() => exportReport('pdf')} variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                          <Button onClick={() => exportReport('excel')} variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Excel
                          </Button>
                          <Button onClick={() => exportReport('csv')} variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            CSV
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Sharing Options</Label>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Link
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Saved Reports */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedReports.length > 0 ? (
                    savedReports.map((report, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{report.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No saved reports yet</p>
                      <p className="text-xs">Create and save your first report</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Fields Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Selected Fields ({selectedFields.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedFields.map(fieldId => {
                    const field = availableFields.find(f => f.id === fieldId);
                    return field ? (
                      <div key={field.id} className="flex items-center justify-between text-sm">
                        <span>{field.name}</span>
                        <Badge variant="outline">{field.category}</Badge>
                      </div>
                    ) : null;
                  })}
                </div>
                
                {selectedFields.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No fields selected
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Report Preview: {reportName || 'Untitled Report'}</span>
              <Badge variant="outline">Preview Mode</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Report Preview</h3>
              <p>Your generated report would appear here</p>
              <p className="text-sm mt-2">
                Selected {selectedFields.length} fields with {filters.length} filters
              </p>
              
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={generateReport} className="bg-purple-600 hover:bg-purple-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button onClick={() => setIsPreviewMode(false)} variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomReportBuilder;