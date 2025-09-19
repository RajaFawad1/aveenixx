import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Package, 
  Warehouse, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle,
  Activity,
  BarChart3,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  Package2,
  AlertCircle,
  Boxes,
  CheckCircle,
  XCircle,
  Download,
  Edit,
  Edit3,
  MoreHorizontal,
  RefreshCw,
  Building2,
  Settings,
  ArrowLeftRight,
  Copy,
  FileText,
  Eye,
  Bell,
  X,
  Info,
  Target,
  Clock,
  PieChart,
  RotateCcw,
  Lightbulb,
  Zap,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for inventory data
interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  inStockItems: number;
  overstockItems: number;
  reorderItems: number;
  totalValue: number;
  locationsCount: number;
  alertsCount: number;
  todaysMovements: number;
}

interface InventoryItem {
  id: number;
  productId: string;
  locationId: number;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: string;
  totalValue: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  lastMovementDate?: string;
  product: {
    id: string;
    name: string;
    category: string;
    imageUrl?: string;
  };
  location: {
    id: number;
    name: string;
    city?: string;
  };
}

interface InventoryLocation {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  currentStock: number;
  capacity?: number;
  isActive: boolean;
}

function InventoryManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch inventory dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<InventoryStats>({
    queryKey: ['/api/inventory/dashboard/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch inventory items
  const { data: items = [], isLoading: itemsLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory/items'],
  });

  // Fetch inventory locations
  const { data: locations = [], isLoading: locationsLoading } = useQuery<InventoryLocation[]>({
    queryKey: ['/api/inventory/locations'],
  });

  // Create inventoryStats from the stats data for header badges
  const inventoryStats = {
    totalItems: stats?.totalItems || 512,
    totalLocations: locations?.length || 5,
    totalValue: stats?.totalValue || 847000
  };

  const renderStatsIndicators = () => {
    if (statsLoading) {
      return (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-3 py-2 rounded-lg animate-pulse">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    const statsIndicators = [
      {
        title: 'Total Items',
        value: stats?.totalItems || 0,
        icon: Package,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900',
      },
      {
        title: 'Low Stock',
        value: stats?.lowStockItems || 0,
        icon: TrendingDown,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900',
      },
      {
        title: 'Out of Stock',
        value: stats?.outOfStockItems || 0,
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900',
      },
      {
        title: 'In Stock',
        value: stats?.inStockItems || 0,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900',
      },
      {
        title: 'Overstock',
        value: stats?.overstockItems || 0,
        icon: AlertCircle,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900',
      },
      {
        title: 'Reorder',
        value: stats?.reorderItems || 0,
        icon: ShoppingCart,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100 dark:bg-amber-900',
      },
    ];

    return (
      <div className="flex flex-wrap gap-3">
        {statsIndicators.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 px-3 py-2 rounded-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all">
              <div className={cn("p-1 rounded", stat.bgColor)}>
                <IconComponent className={cn("w-4 h-4", stat.color)} />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Recent Stock Items */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Recent Stock Items</CardTitle>
          </div>
          <CardDescription>Latest inventory items across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading inventory items...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No inventory items found</div>
          ) : (
            <div className="space-y-4">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Package2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.location?.name || 'Unknown Location'} • Stock: {item.currentStock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        item.stockStatus === 'in_stock' ? 'default' :
                        item.stockStatus === 'low_stock' ? 'secondary' :
                        item.stockStatus === 'out_of_stock' ? 'destructive' : 'outline'
                      }
                    >
                      {item.stockStatus.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ${Number(item.totalValue || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Locations */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Warehouse className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Active Locations</CardTitle>
          </div>
          <CardDescription>Warehouse and storage locations</CardDescription>
        </CardHeader>
        <CardContent>
          {locationsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading locations...</div>
          ) : locations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No locations found</div>
          ) : (
            <div className="space-y-4">
              {locations.slice(0, 5).map((location) => (
                <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.city && location.state ? `${location.city}, ${location.state}` : location.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Stock: {location.currentStock}
                    </span>
                    <Badge variant={location.isActive ? 'default' : 'secondary'}>
                      {location.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStockTab = () => (
    <div className="space-y-5">
      {/* Stock Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search products by name or SKU..." 
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter by Status
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Stock Items Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">Stock Items</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>Manage inventory stock levels across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading stock items...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stock items found</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first inventory item</p>
              <Button className="flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
                <Plus className="h-4 w-4" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                <div>Product</div>
                <div>SKU</div>
                <div>Location</div>
                <div>Current Stock</div>
                <div>Available</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              {/* Table Rows */}
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-7 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    {item.product?.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package2 className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-sm text-gray-500">{item.product?.category || 'No category'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {item.productId || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{item.location?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{item.location?.city || 'No city'}</p>
                  </div>
                  <div>
                    <span className="text-lg font-semibold">{item.currentStock}</span>
                    <p className="text-sm text-gray-500">Min: {item.minimumStock}</p>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-green-600">{item.availableStock}</span>
                    <p className="text-sm text-gray-500">Reserved: {item.reservedStock}</p>
                  </div>
                  <div>
                    <Badge 
                      variant={
                        item.stockStatus === 'in_stock' ? 'default' :
                        item.stockStatus === 'low_stock' ? 'secondary' :
                        item.stockStatus === 'out_of_stock' ? 'destructive' : 'outline'
                      }
                      className="mb-1"
                    >
                      {item.stockStatus ? item.stockStatus.replace('_', ' ') : 'Unknown'}
                    </Badge>
                    <p className="text-sm text-gray-500">${Number(item.totalValue || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderLocationsTab = () => (
    <div className="space-y-5">
      {/* Location Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Locations</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{locations.length}</p>
                <p className="text-xs text-blue-600">{locations.filter(l => l.isActive).length} active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Capacity</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {locations.reduce((sum, l) => sum + (l.capacity || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600">Units across all locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Utilization Rate</p>
                <p className="text-xl font-bold text-purple-600">
                  {locations.length > 0 ? 
                    Math.round(locations.reduce((sum, l) => 
                      sum + (l.capacity ? (l.currentStock / l.capacity) * 100 : 0), 0
                    ) / locations.length) : 0}%
                </p>
                <p className="text-xs text-purple-600">Average across locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">High Utilization</p>
                <p className="text-xl font-bold text-orange-600">
                  {locations.filter(l => l.capacity && (l.currentStock / l.capacity) > 0.8).length}
                </p>
                <p className="text-xs text-orange-600">Locations over 80%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search locations by name or address..." 
              className="pl-10 w-80"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Locations</DropdownMenuItem>
              <DropdownMenuItem>Active Only</DropdownMenuItem>
              <DropdownMenuItem>Inactive Only</DropdownMenuItem>
              <DropdownMenuItem>High Utilization</DropdownMenuItem>
              <DropdownMenuItem>Low Utilization</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync All
          </Button>
          <Button className="flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Location Report</DropdownMenuItem>
              <DropdownMenuItem>Capacity Analysis</DropdownMenuItem>
              <DropdownMenuItem>Utilization Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {locationsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : locations.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-16">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Warehouse className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Locations Configured</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Set up your first warehouse or storage location to start organizing your inventory efficiently.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
                    <Plus className="h-4 w-4" />
                    Create Location
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Import Locations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          locations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Location Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                        <Warehouse className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {location.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {location.city && location.state ? `${location.city}, ${location.state}` : 
                           location.description || 'Primary storage location'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={location.isActive ? 'default' : 'secondary'} className="text-xs">
                        {location.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit3 className="h-4 w-4" />
                            Edit Location
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            View Inventory
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            View Movements
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Address */}
                  {location.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{location.address}</span>
                    </div>
                  )}

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Stock</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {location.currentStock.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Units stored</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Capacity</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {location.capacity ? location.capacity.toLocaleString() : 'Unlimited'}
                      </p>
                      {location.capacity && (
                        <p className="text-xs text-gray-500">
                          {Math.round((location.currentStock / location.capacity) * 100)}% utilized
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  {location.capacity && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Space Utilization</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {Math.round((location.currentStock / location.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            (location.currentStock / location.capacity) > 0.8 ? 'bg-red-500' :
                            (location.currentStock / location.capacity) > 0.6 ? 'bg-orange-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min((location.currentStock / location.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${location.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {location.isActive ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {location.id}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderMovementsTab = () => (
    <div className="space-y-5">
      {/* Movement Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stock In (Today)</p>
                <p className="text-xl font-bold text-green-600">247</p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-green-600">+12% from yesterday</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stock Out (Today)</p>
                <p className="text-xl font-bold text-red-600">189</p>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-red-600">-3% from yesterday</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <ArrowLeftRight className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Transfers</p>
                <p className="text-xl font-bold text-purple-600">34</p>
                <p className="text-xs text-purple-600">Between locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adjustments</p>
                <p className="text-xl font-bold text-blue-600">12</p>
                <p className="text-xs text-blue-600">Manual corrections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movement Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search movements by product, location, or reference..." 
              className="pl-10 w-80"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Movement Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Movements</DropdownMenuItem>
              <DropdownMenuItem>Stock In</DropdownMenuItem>
              <DropdownMenuItem>Stock Out</DropdownMenuItem>
              <DropdownMenuItem>Transfers</DropdownMenuItem>
              <DropdownMenuItem>Adjustments</DropdownMenuItem>
              <DropdownMenuItem>Returns</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>Yesterday</DropdownMenuItem>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
              <DropdownMenuItem>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="h-4 w-4" />
            Record Movement
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Movement History</DropdownMenuItem>
              <DropdownMenuItem>Daily Summary</DropdownMenuItem>
              <DropdownMenuItem>Stock Movement Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Recent Movements */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">Recent Stock Movements</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                Last 24 hours
              </Badge>
              <Button variant="ghost" size="sm" className="text-emerald-600">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Sample movement records - will be replaced with real data */}
            {[
              {
                id: 1,
                type: 'stock_in',
                product: 'Wireless Headphones Pro',
                quantity: 50,
                location: 'Main Warehouse',
                reference: 'PO-2024-001',
                timestamp: '2 hours ago',
                user: 'John Smith',
                reason: 'Purchase Order Received'
              },
              {
                id: 2,
                type: 'stock_out',
                product: 'Smart Watch Series X',
                quantity: -12,
                location: 'Main Warehouse',
                reference: 'SO-2024-156',
                timestamp: '4 hours ago',
                user: 'Sarah Johnson',
                reason: 'Sales Order Fulfillment'
              },
              {
                id: 3,
                type: 'transfer',
                product: 'USB-C Cable 3-Pack',
                quantity: 25,
                location: 'Storage Room B → Main Warehouse',
                reference: 'TR-2024-032',
                timestamp: '6 hours ago',
                user: 'Mike Wilson',
                reason: 'Inter-location Transfer'
              },
              {
                id: 4,
                type: 'adjustment',
                product: 'Bluetooth Speaker',
                quantity: -3,
                location: 'Main Warehouse',
                reference: 'ADJ-2024-015',
                timestamp: '8 hours ago',
                user: 'Admin User',
                reason: 'Physical Count Adjustment'
              },
              {
                id: 5,
                type: 'stock_in',
                product: 'Phone Case Premium',
                quantity: 100,
                location: 'Storage Room A',
                reference: 'PO-2024-002',
                timestamp: '12 hours ago',
                user: 'Lisa Chen',
                reason: 'Supplier Delivery'
              }
            ].map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    movement.type === 'stock_in' ? 'bg-green-50 dark:bg-green-950' :
                    movement.type === 'stock_out' ? 'bg-red-50 dark:bg-red-950' :
                    movement.type === 'transfer' ? 'bg-purple-50 dark:bg-purple-950' :
                    'bg-blue-50 dark:bg-blue-950'
                  }`}>
                    {movement.type === 'stock_in' && <TrendingUp className="h-5 w-5 text-green-600" />}
                    {movement.type === 'stock_out' && <TrendingDown className="h-5 w-5 text-red-600" />}
                    {movement.type === 'transfer' && <ArrowLeftRight className="h-5 w-5 text-purple-600" />}
                    {movement.type === 'adjustment' && <RefreshCw className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {movement.product}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          movement.type === 'stock_in' ? 'text-green-600 border-green-300' :
                          movement.type === 'stock_out' ? 'text-red-600 border-red-300' :
                          movement.type === 'transfer' ? 'text-purple-600 border-purple-300' :
                          'text-blue-600 border-blue-300'
                        }`}
                      >
                        {movement.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {movement.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {movement.reference}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {movement.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {movement.reason} • by {movement.user}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      units
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Duplicate Movement
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Generate Report
                      </DropdownMenuItem>
                      {movement.type === 'adjustment' && (
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <X className="h-4 w-4" />
                          Reverse Adjustment
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Load More Movements
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Movement Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Daily Movement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Stock In</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium">247</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Stock Out</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '63%' }}></div>
                  </div>
                  <span className="text-sm font-medium">189</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Transfers</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium">34</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Adjustments</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Top Moving Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Wireless Headphones Pro', movements: 156, change: '+23%' },
                { name: 'Smart Watch Series X', movements: 134, change: '+18%' },
                { name: 'USB-C Cable 3-Pack', movements: 89, change: '+12%' },
                { name: 'Bluetooth Speaker', movements: 67, change: '-5%' },
                { name: 'Phone Case Premium', movements: 45, change: '+8%' }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950 rounded-md flex items-center justify-center text-emerald-600 font-medium text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.movements}</span>
                    <Badge variant="outline" className={`text-xs ${
                      product.change.startsWith('+') ? 'text-green-600 border-green-300' : 'text-red-600 border-red-300'
                    }`}>
                      {product.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-5">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Critical Alerts</p>
                <p className="text-xl font-bold text-red-600">8</p>
                <p className="text-xs text-red-600">Immediate action required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Alerts</p>
                <p className="text-xl font-bold text-orange-600">23</p>
                <p className="text-xs text-orange-600">Reorder recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Info Alerts</p>
                <p className="text-xl font-bold text-blue-600">12</p>
                <p className="text-xs text-blue-600">General notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Resolved Today</p>
                <p className="text-xl font-bold text-green-600">15</p>
                <p className="text-xs text-green-600">Issues addressed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search alerts by product or location..." 
              className="pl-10 w-80"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Priority Level
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Alerts</DropdownMenuItem>
              <DropdownMenuItem>Critical Only</DropdownMenuItem>
              <DropdownMenuItem>Low Stock Only</DropdownMenuItem>
              <DropdownMenuItem>Info Only</DropdownMenuItem>
              <DropdownMenuItem>Unresolved</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Range
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button className="flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Settings className="h-4 w-4" />
            Alert Settings
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Alert Report</DropdownMenuItem>
              <DropdownMenuItem>Critical Issues</DropdownMenuItem>
              <DropdownMenuItem>Resolution Log</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Critical Alerts */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg text-red-600">Critical Alerts</CardTitle>
              </div>
              <Badge variant="destructive" className="text-sm">
                8 active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  product: 'Medical Supplies Kit',
                  level: 'Out of Stock',
                  quantity: 0,
                  threshold: 10,
                  location: 'Main Warehouse',
                  priority: 'critical',
                  timestamp: '15 minutes ago',
                  message: 'Emergency reorder required - patient care supplies'
                },
                {
                  id: 2,
                  product: 'Fire Safety Equipment',
                  level: 'Critical Low',
                  quantity: 2,
                  threshold: 25,
                  location: 'Safety Storage',
                  priority: 'critical',
                  timestamp: '1 hour ago',
                  message: 'Safety compliance at risk - immediate replenishment needed'
                },
                {
                  id: 3,
                  product: 'Server Hardware Components',
                  level: 'Stock Depletion',
                  quantity: 1,
                  threshold: 15,
                  location: 'Tech Storage',
                  priority: 'critical',
                  timestamp: '2 hours ago',
                  message: 'Business continuity risk - critical infrastructure parts'
                }
              ].map((alert) => (
                <div key={alert.id} className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-red-100 dark:bg-red-900 rounded-md">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {alert.product}
                        </h4>
                        <p className="text-sm text-red-600 font-medium">{alert.level}</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      CRITICAL
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Stock</p>
                      <p className="text-lg font-bold text-red-600">{alert.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Threshold</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.threshold}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Reorder Now
                      </Button>
                      <Button size="sm" className="text-xs h-7" style={{ backgroundColor: 'var(--primary-color)' }}>
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg text-orange-600">Low Stock Alerts</CardTitle>
              </div>
              <Badge variant="secondary" className="text-sm bg-orange-100 text-orange-700">
                23 active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: 4,
                  product: 'Wireless Mouse Pro',
                  level: 'Low Stock',
                  quantity: 8,
                  threshold: 25,
                  location: 'Electronics Storage',
                  priority: 'low_stock',
                  timestamp: '3 hours ago',
                  message: 'Popular item - consider bulk reorder for better pricing'
                },
                {
                  id: 5,
                  product: 'USB-C Charging Cables',
                  level: 'Below Threshold',
                  quantity: 12,
                  threshold: 50,
                  location: 'Accessories Storage',
                  priority: 'low_stock',
                  timestamp: '5 hours ago',
                  message: 'High demand item - restock recommended'
                },
                {
                  id: 6,
                  product: 'Desk Organizer Set',
                  level: 'Low Inventory',
                  quantity: 6,
                  threshold: 20,
                  location: 'Office Supplies',
                  priority: 'low_stock',
                  timestamp: '8 hours ago',
                  message: 'Seasonal demand increase - monitor closely'
                }
              ].map((alert) => (
                <div key={alert.id} className="p-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-orange-100 dark:bg-orange-900 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {alert.product}
                        </h4>
                        <p className="text-sm text-orange-600 font-medium">{alert.level}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      LOW STOCK
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Stock</p>
                      <p className="text-lg font-bold text-orange-600">{alert.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Threshold</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.threshold}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Create PO
                      </Button>
                      <Button size="sm" className="text-xs h-7" style={{ backgroundColor: 'var(--primary-color)' }}>
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alerts & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Info Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-600">Information Alerts</CardTitle>
              </div>
              <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                12 active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: 7,
                  type: 'reorder_suggestion',
                  title: 'Optimal Reorder Recommendation',
                  message: 'Based on sales patterns, consider ordering 200 units of Premium Laptop Stand',
                  timestamp: '1 day ago',
                  action: 'Review Recommendation'
                },
                {
                  id: 8,
                  type: 'price_update',
                  title: 'Supplier Price Update',
                  message: 'TechSupplier Inc. has updated pricing for 5 products in your catalog',
                  timestamp: '2 days ago',
                  action: 'Review Changes'
                },
                {
                  id: 9,
                  type: 'location_capacity',
                  title: 'Storage Capacity Notice',
                  message: 'Main Warehouse is approaching 85% capacity utilization',
                  timestamp: '3 days ago',
                  action: 'Plan Optimization'
                }
              ].map((alert) => (
                <div key={alert.id} className="p-3 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-md mt-0.5">
                        <Info className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{alert.timestamp}</span>
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            {alert.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">Alert Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Low Stock Threshold
                </label>
                <Input type="number" defaultValue="25" className="h-8" />
                <p className="text-xs text-gray-500">Alert when stock falls below this number</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Critical Stock Threshold
                </label>
                <Input type="number" defaultValue="5" className="h-8" />
                <p className="text-xs text-gray-500">Critical alert threshold</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-alerts" defaultChecked className="rounded" />
                  <label htmlFor="email-alerts" className="text-sm text-gray-600 dark:text-gray-400">
                    Send email alerts for critical issues
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  SMS Notifications
                </label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sms-alerts" className="rounded" />
                  <label htmlFor="sms-alerts" className="text-sm text-gray-600 dark:text-gray-400">
                    Send SMS for out-of-stock items
                  </label>
                </div>
              </div>
              
              <Button className="w-full flex items-center gap-2 mt-4" style={{ backgroundColor: 'var(--primary-color)' }}>
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-5">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                <RotateCcw className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Turnover Rate</p>
                <p className="text-xl font-bold text-emerald-600">4.8x</p>
                <p className="text-xs text-emerald-600">+0.3 from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fill Rate</p>
                <p className="text-xl font-bold text-blue-600">94.7%</p>
                <p className="text-xs text-blue-600">Above target 90%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inventory Value</p>
                <p className="text-xl font-bold text-purple-600">$847K</p>
                <p className="text-xs text-purple-600">+$23K this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <TrendingDown className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Carrying Cost</p>
                <p className="text-xl font-bold text-orange-600">12.4%</p>
                <p className="text-xs text-orange-600">-0.8% improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stockout Rate</p>
                <p className="text-xl font-bold text-red-600">2.3%</p>
                <p className="text-xs text-red-600">-0.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last 30 Days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 days</DropdownMenuItem>
              <DropdownMenuItem>Last 12 months</DropdownMenuItem>
              <DropdownMenuItem>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                All Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Categories</DropdownMenuItem>
              <DropdownMenuItem>Electronics</DropdownMenuItem>
              <DropdownMenuItem>Accessories</DropdownMenuItem>
              <DropdownMenuItem>Office Supplies</DropdownMenuItem>
              <DropdownMenuItem>Safety Equipment</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Analytics
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Full Analytics Report</DropdownMenuItem>
              <DropdownMenuItem>Performance Summary</DropdownMenuItem>
              <DropdownMenuItem>ABC Analysis</DropdownMenuItem>
              <DropdownMenuItem>Location Performance</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Inventory Trends */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Inventory Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Interactive inventory trend chart</p>
                  <p className="text-xs text-gray-400">Stock levels, turnover, and movement patterns</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Peak Month</p>
                  <p className="font-semibold text-gray-900 dark:text-white">March 2024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Monthly Growth</p>
                  <p className="font-semibold text-green-600">+8.3%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Seasonality Index</p>
                  <p className="font-semibold text-blue-600">1.24</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ABC Analysis */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-emerald-600" />
              ABC Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium">Category A (High Value)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">67 items</span>
                    <p className="text-xs text-gray-500">80% of value</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Category B (Medium Value)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">156 items</span>
                    <p className="text-xs text-gray-500">15% of value</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Category C (Low Value)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">289 items</span>
                    <p className="text-xs text-gray-500">5% of value</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Moving Items */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              Top Moving Items (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Wireless Headphones Pro', units: 1247, revenue: '$98,760', growth: '+23%' },
                { name: 'Smart Watch Series X', units: 892, revenue: '$178,400', growth: '+18%' },
                { name: 'USB-C Cable 3-Pack', units: 2156, revenue: '$43,120', growth: '+15%' },
                { name: 'Bluetooth Speaker', units: 445, revenue: '$35,600', growth: '+12%' },
                { name: 'Phone Case Premium', units: 834, revenue: '$25,020', growth: '+8%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950 rounded-md flex items-center justify-center text-emerald-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.units} units • {item.revenue}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                    {item.growth}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Performance */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Location Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { location: 'Main Warehouse', efficiency: 94, utilization: 82, movements: 2847 },
                { location: 'Storage Room A', efficiency: 88, utilization: 67, movements: 1654 },
                { location: 'Electronics Storage', efficiency: 91, utilization: 89, movements: 1893 },
                { location: 'Safety Storage', efficiency: 85, utilization: 45, movements: 298 },
                { location: 'Tech Storage', efficiency: 89, utilization: 76, movements: 945 }
              ].map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{location.location}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">Efficiency: <span className="font-medium">{location.efficiency}%</span></span>
                      <span className="text-gray-500">Utilization: <span className="font-medium">{location.utilization}%</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Performance</span>
                        <span className="font-medium">{Math.round((location.efficiency + location.utilization) / 2)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            Math.round((location.efficiency + location.utilization) / 2) > 85 ? 'bg-green-500' :
                            Math.round((location.efficiency + location.utilization) / 2) > 70 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.round((location.efficiency + location.utilization) / 2)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {location.movements.toLocaleString()} moves
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-emerald-600" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {[
                {
                  type: 'optimization',
                  title: 'Inventory Optimization Opportunity',
                  message: 'Consider reducing safety stock for slow-moving Category C items by 15% to free up $34,200 in capital.',
                  impact: 'High',
                  confidence: '87%'
                },
                {
                  type: 'reorder',
                  title: 'Seasonal Demand Prediction',
                  message: 'Electronics category shows 28% increase in Q4. Plan early procurement for premium items.',
                  impact: 'Medium',
                  confidence: '92%'
                },
                {
                  type: 'efficiency',
                  title: 'Location Efficiency Alert',
                  message: 'Safety Storage shows low utilization (45%). Consider consolidating with Tech Storage.',
                  impact: 'Medium',
                  confidence: '78%'
                }
              ].map((insight, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-100 dark:bg-emerald-900 rounded-md mt-0.5">
                      <Lightbulb className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{insight.title}</h4>
                        <Badge variant="outline" className={`text-xs ${
                          insight.impact === 'High' ? 'text-red-600 border-red-300' :
                          insight.impact === 'Medium' ? 'text-orange-600 border-orange-300' :
                          'text-green-600 border-green-300'
                        }`}>
                          {insight.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Confidence: {insight.confidence}</span>
                        <Button size="sm" variant="outline" className="text-xs h-6">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Performance Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Efficiency</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">89%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cost Optimization</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">76%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Service Level</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">94%</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4 flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
                <Download className="h-4 w-4" />
                Download Full Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-5 p-5">
      {/* Professional Header Banner - Matching Product Management Design */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border-0">
        <CardContent className="p-5">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
              <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Track and manage your product inventory across all locations</p>
            </div>
          </div>

          {/* Professional Stats Badges Row */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Package className="w-4 h-4 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalItems || 512}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Total Items</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.lowStockItems || 0}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Low Stock</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Warehouse className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{locations?.length || 5}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Locations</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">${(stats?.totalValue || 847000).toLocaleString()}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Total Value</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.todaysMovements || 0}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Today's Movements</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-4 h-4 text-orange-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.alertsCount || 0}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Active Alerts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Stock ({items.length})
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <Warehouse className="h-4 w-4" />
            Locations ({locations.length})
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Movements
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stock">{renderStockTab()}</TabsContent>
        <TabsContent value="locations">{renderLocationsTab()}</TabsContent>
        <TabsContent value="movements">{renderMovementsTab()}</TabsContent>
        <TabsContent value="alerts">{renderAlertsTab()}</TabsContent>
        <TabsContent value="analytics">{renderAnalyticsTab()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
