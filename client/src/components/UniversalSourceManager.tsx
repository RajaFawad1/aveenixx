import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Upload, ExternalLink, ShoppingBag, Package, Globe } from 'lucide-react';
import { API_SOURCES, APISource, getAPISourcesByCategory } from '@shared/apiSources';

interface UniversalSourceManagerProps {
  onSourceSelect: (sourceId: string) => void;
  selectedSource: string;
  connectionStates: Record<string, boolean>;
  onToggleConnection: (sourceId: string) => void;
}

const getIconComponent = (iconName: string) => {
  const icons = {
    ExternalLink,
    ShoppingBag, 
    Package,
    Globe,
    Upload,
    Settings,
    Plus
  };
  return icons[iconName as keyof typeof icons] || Settings;
};

export function UniversalSourceManager({ 
  onSourceSelect, 
  selectedSource, 
  connectionStates, 
  onToggleConnection 
}: UniversalSourceManagerProps) {
  const [showAddSource, setShowAddSource] = useState(false);
  const [showSourceConfig, setShowSourceConfig] = useState<string | null>(null);

  const categories = [
    { id: 'ecommerce', name: 'E-commerce Platforms', color: 'bg-blue-100 text-blue-800' },
    { id: 'marketplace', name: 'Marketplaces', color: 'bg-green-100 text-green-800' },
    { id: 'wholesale', name: 'Wholesale & Dropshipping', color: 'bg-orange-100 text-orange-800' },
    { id: 'file', name: 'File Upload', color: 'bg-purple-100 text-purple-800' },
    { id: 'custom', name: 'Custom APIs', color: 'bg-gray-100 text-gray-800' }
  ];

  const renderSourceCard = (source: APISource) => {
    const IconComponent = getIconComponent(source.icon);
    const isConnected = connectionStates[source.id] || false;

    return (
      <Card key={source.id} className={`cursor-pointer transition-all ${
        selectedSource === source.id ? 'ring-2 ring-yellow-500' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
              <CardTitle className="text-sm">{source.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isConnected}
                onCheckedChange={() => onToggleConnection(source.id)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSourceConfig(source.id)}
                className="h-6 w-6 p-0"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {source.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {source.features.realTimeSync && (
                <Badge variant="secondary" className="text-xs">Real-time</Badge>
              )}
              {source.features.bulkImport && (
                <Badge variant="secondary" className="text-xs">Bulk</Badge>
              )}
            </div>
            <Button
              size="sm"
              variant={selectedSource === source.id ? "default" : "outline"}
              onClick={() => onSourceSelect(source.id)}
              className="h-6 text-xs"
            >
              {selectedSource === source.id ? 'Active' : 'Select'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSourceConfig = (source: APISource) => {
    return (
      <Dialog open={showSourceConfig === source.id} onOpenChange={() => setShowSourceConfig(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {React.createElement(getIconComponent(source.icon), { className: "w-5 h-5" })}
              Configure {source.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {source.authFields?.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === 'select' ? (
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </div>
            ))}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowSourceConfig(null)}>
                Cancel
              </Button>
              <Button>Save Configuration</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Source Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Connected Sources</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your product import sources and file uploads
          </p>
        </div>
        <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Import Source</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="ecommerce" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    {category.name.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getAPISourcesByCategory(category.id).map(renderSourceCard)}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(API_SOURCES)
          .filter(source => connectionStates[source.id])
          .map(renderSourceCard)}
      </div>

      {/* Source Configuration Dialogs */}
      {Object.values(API_SOURCES).map(renderSourceConfig)}
    </div>
  );
}