import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  Search,
  X,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductGallerySidebarProps {
  onFilterChange: (filters: any) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  onSortChange: (sort: string) => void;
  currentFilters: any;
  currentView: 'grid' | 'list';
  currentSort: string;
}

export default function ProductGallerySidebar({
  onFilterChange,
  onViewChange,
  onSortChange,
  currentFilters,
  currentView,
  currentSort
}: ProductGallerySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Beauty',
    'Sports',
    'Toys',
    'Automotive'
  ];

  const statusOptions = [
    { value: 'all', label: 'All Products', icon: Grid3X3 },
    { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'bg-red-500' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Price Low to High' },
    { value: 'price-desc', label: 'Price High to Low' },
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' }
  ];

  const handleCategoryFilter = (category: string) => {
    const newFilters = { ...currentFilters };
    if (newFilters.categories?.includes(category)) {
      newFilters.categories = newFilters.categories.filter((c: string) => c !== category);
    } else {
      newFilters.categories = [...(newFilters.categories || []), category];
    }
    onFilterChange(newFilters);
  };

  const handleStatusFilter = (status: string) => {
    onFilterChange({ ...currentFilters, status });
  };

  const handleSearch = () => {
    onFilterChange({ ...currentFilters, search: searchTerm });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({});
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Gallery</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Products</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">View Options</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex space-x-2">
            <Button
              variant={currentView === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('grid')}
              className="flex-1"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('list')}
              className="flex-1"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={currentSort === option.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onSortChange(option.value)}
                className="w-full justify-start"
              >
                {option.value.includes('asc') ? (
                  <SortAsc className="w-4 h-4 mr-2" />
                ) : (
                  <SortDesc className="w-4 h-4 mr-2" />
                )}
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={currentFilters.status === option.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleStatusFilter(option.value)}
                className="w-full justify-start"
              >
                <option.icon className={`w-4 h-4 mr-2 ${option.color || ''}`} />
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={currentFilters.categories?.includes(category) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryFilter(category)}
                  className="w-full justify-start"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {(currentFilters.categories?.length > 0 || currentFilters.status || currentFilters.search) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {currentFilters.search && (
                <Badge variant="secondary" className="mr-2">
                  Search: {currentFilters.search}
                </Badge>
              )}
              {currentFilters.status && currentFilters.status !== 'all' && (
                <Badge variant="secondary" className="mr-2">
                  Status: {currentFilters.status}
                </Badge>
              )}
              {currentFilters.categories?.map((category: string) => (
                <Badge key={category} variant="secondary" className="mr-2">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
