import { useState, useEffect } from 'react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Grid, List, Search, Star, Menu, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface UnifiedCategory {
  slug: string;
  name: string;
  icon: string;
  isHot?: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  brand: string;
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  isInStock: boolean;
  productType: 'aveenix' | 'affiliate';
}

export default function CategoryNavigation() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [filterTab, setFilterTab] = useState('main');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Fetch unified categories
  const { data: unifiedCategories = [] } = useQuery<UnifiedCategory[]>({
    queryKey: ['/api/unified-categories'],
  });

  // Debug log to check categories
  console.log('Unified categories:', unifiedCategories);

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const selectedCategoryName = unifiedCategories.find(cat => cat.slug === selectedCategory)?.name || 'All Categories';

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  if (isLoading) {
    return (
      <MainEcommerceLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </MainEcommerceLayout>
    );
  }

  return (
    <MainEcommerceLayout>
      {/* Top Filter Bar */}
      <div className="bg-background border-b border-border dark:border-border">
        <div className="container mx-auto px-4 py-3">
          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              

              <Button
                variant="outline"
                size="sm"
                className="p-2"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'black',
                  borderColor: 'var(--primary-color)'
                }}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-card dark:bg-card border-b md:border-r md:border-b-0 border-border dark:border-border flex flex-col">
          {/* Categories Header */}
          <div className="p-2 border-b border-border dark:border-border">
            <button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="w-full flex items-center justify-between gap-2 p-3 rounded-lg text-left transition-colors text-black font-semibold"
              style={{ backgroundColor: 'var(--primary-color)' }}
              title={categoriesExpanded ? "Collapse categories" : "Expand categories"}
            >
              <div className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                <span className="font-semibold text-sm">
                  All Categories
                </span>
              </div>
              {categoriesExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto bg-background dark:bg-background">
            <div className="p-2 space-y-1">
              {/* Show only first 5 categories by default, all when expanded */}
              {unifiedCategories
                .filter(category => category.slug !== 'all' && category.name !== 'All Categories')
                .slice(0, categoriesExpanded ? undefined : 5)
                .map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategorySelect(category.slug)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors hover:bg-muted dark:hover:bg-muted",
                      selectedCategory === category.slug 
                        ? "text-black font-medium" 
                        : "text-foreground dark:text-foreground"
                    )}
                    style={{
                      backgroundColor: selectedCategory === category.slug ? 'var(--primary-color)' : 'transparent'
                    }}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="flex-1 text-sm font-medium">
                      {category.name}
                    </span>
                    {category.isHot && (
                      <Badge 
                        variant="destructive" 
                        className="text-xs px-1.5 py-0.5"
                        style={{ backgroundColor: 'var(--primary-color)', color: 'black' }}
                      >
                        Hot
                      </Badge>
                    )}
                  </button>
                ))}
              
              {/* Show more/less button */}
              {unifiedCategories.filter(category => category.slug !== 'all' && category.name !== 'All Categories').length > 5 && (
                <button
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-left transition-colors hover:bg-muted dark:hover:bg-muted text-muted-foreground dark:text-muted-foreground"
                >
                  {categoriesExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="text-sm">Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="text-sm">Show More ({unifiedCategories.length - 6} more)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel - Below Categories */}
          <div className="border-t border-border dark:border-border bg-card dark:bg-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" />
              <span className="font-semibold text-foreground dark:text-foreground">Filters</span>
            </div>
              
              {/* Filter Tabs */}
              <div className="flex bg-muted dark:bg-muted rounded-lg p-1 mb-4">
                <button
                  onClick={() => setFilterTab('main')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    filterTab === 'main' 
                      ? "bg-background dark:bg-background text-foreground dark:text-foreground shadow-sm" 
                      : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                  )}
                >
                  Main
                </button>
                <button
                  onClick={() => setFilterTab('advanced')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    filterTab === 'advanced' 
                      ? "bg-background dark:bg-background text-foreground dark:text-foreground shadow-sm" 
                      : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                  )}
                >
                  Advanced
                </button>
              </div>
              
              {/* Price Range */}
              <div className="mb-4">
                <h3 className="font-medium mb-3 text-foreground dark:text-foreground">Price Range</h3>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="h-2 bg-muted dark:bg-muted rounded-full">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: 'var(--primary-color)',
                          width: `${(priceRange[1] / 1000) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground dark:text-muted-foreground">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>
              </div>
              
              {/* Brands */}
              <div className="mb-4">
                <h3 className="font-medium mb-3 text-foreground dark:text-foreground">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    { name: 'All Brands', count: 20 },
                    { name: 'TechSound', count: 1 },
                    { name: 'FitTech', count: 1 },
                    { name: 'ComfortSeating', count: 1 },
                    { name: 'BrewMaster', count: 1 },
                    { name: 'ChefPro', count: 1 },
                    { name: 'CottonCraft', count: 1 }
                  ].map((brand) => (
                    <div key={brand.name} className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand.name]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand.name));
                            }
                          }}
                          className="rounded border-border dark:border-border accent-[var(--primary-color)]"
                        />
                        <span className="text-sm text-foreground dark:text-foreground">{brand.name}</span>
                      </label>
                      <span className="text-xs text-muted-foreground dark:text-muted-foreground">{brand.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="p-2 md:p-4">
            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                {filteredProducts.map((product) => {
                  const isAffiliate = product.productType === 'affiliate';
                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden">
                      {product.discountPercentage && (
                        <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 z-10">
                          <Badge 
                            variant="destructive" 
                            className="text-xs px-1.5 py-0.5"
                            style={{ backgroundColor: 'var(--primary-color)', color: 'black' }}
                          >
                            -{product.discountPercentage}%
                          </Badge>
                        </div>
                      )}

                      {/* AVEENIX badge */}
                      {!isAffiliate && (
                        <div className="absolute top-1.5 md:top-2 right-1.5 md:right-2 z-10">
                          <Badge 
                            className="text-xs px-1.5 py-0.5 bg-orange-500 text-white"
                          >
                            AVEENIX
                          </Badge>
                        </div>
                      )}

                      <CardContent className="p-2 md:p-3">
                        <div className="aspect-square mb-1.5 md:mb-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div>
                        
                        <h3 className="font-medium text-sm md:text-base text-foreground dark:text-foreground line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-1 mb-1.5 md:mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <span className="font-bold text-base md:text-lg" style={{ color: 'var(--primary-color)' }}>
                              ${product.price}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-muted-foreground dark:text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          {!isAffiliate && product.isInStock && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              style={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'black',
                                borderColor: 'var(--primary-color)'
                              }}
                              className="p-1.5 md:p-2"
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div className="mt-1.5 md:mt-2 text-xs text-muted-foreground dark:text-muted-foreground">
                          {product.brand} • {product.productType}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 md:py-24">
                <div className="text-4xl md:text-6xl mb-4">📦</div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground dark:text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground dark:text-muted-foreground max-w-md mx-auto">
                  {searchTerm 
                    ? `No products match "${searchTerm}" in ${selectedCategoryName}`
                    : `No products available in ${selectedCategoryName}`
                  }
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      color: 'black',
                      borderColor: 'var(--primary-color)'
                    }}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
    </MainEcommerceLayout>
  );
}