import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, X, Grid3x3, List, Star, ShoppingBag, Tag, TrendingUp, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MainEcommerceLayout from "@/components/layout/MainEcommerceLayout";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

// API data fetching functions
const useAllProducts = () => {
  return useQuery({
    queryKey: ['/api/products'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

const useCategories = () => {
  return useQuery({
    queryKey: ['/api/categories'],
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

const useCategoryFilters = () => {
  return useQuery({
    queryKey: ['/api/categories/all/filters'],
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// New product recommendation hooks - using query parameters to avoid route conflicts
const useNewArrivals = () => {
  return useQuery({
    queryKey: ['/api/products', 'new-arrivals'],
    queryFn: () => fetch('/api/products?sortBy=createdAt&sortOrder=desc&limit=6').then(res => res.json()),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

const useTrendingProducts = () => {
  return useQuery({
    queryKey: ['/api/products', 'trending'],
    queryFn: () => fetch('/api/products?sortBy=rating&sortOrder=desc&limit=6').then(res => res.json()),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

const useRecommendedProducts = () => {
  return useQuery({
    queryKey: ['/api/products', 'recommended'],
    queryFn: () => fetch('/api/products?sortBy=name&sortOrder=asc&limit=6').then(res => res.json()),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default function ShopPage() {
  // Get search term from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearchTerm = urlParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  // Quick filter chips state
  const [quickFilters, setQuickFilters] = useState({
    onSale: false,
    freeShipping: false,
    newArrivals: false,
    highRated: false
  });

  // API data fetching
  const { data: allProducts = [], isLoading: productsLoading, error: productsError } = useAllProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: filterData, isLoading: filtersLoading } = useCategoryFilters();
  
  // Recommendation data fetching
  const { data: newArrivals = [], isLoading: newArrivalsLoading } = useNewArrivals();
  const { data: trendingProducts = [], isLoading: trendingLoading } = useTrendingProducts();
  const { data: recommendedProducts = [], isLoading: recommendedLoading } = useRecommendedProducts();

  // Extract brands from API data
  const availableBrands = useMemo(() => {
    if (!filterData?.brands) return ["All"];
    return ["All", ...filterData.brands];
  }, [filterData]);

  // Extract categories from API data 
  const availableCategories = useMemo(() => {
    if (!categories?.length) return ["All"];
    return ["All", ...categories.map((cat: any) => cat.name)];
  }, [categories]);

  // Product filtering and sorting logic
  const filteredProducts = useMemo(() => {
    if (!allProducts.length) return [];
    
    let filtered = allProducts.filter((product: any) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      
      // Brand filter  
      if (selectedBrand !== "All" && product.brand !== selectedBrand) {
        return false;
      }
      
      // Price range filter
      const price = parseFloat(product.price) || 0;
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }
      
      // Rating filter
      if (ratingFilter > 0 && (product.rating || 0) < ratingFilter) {
        return false;
      }
      
      // Stock filter - for imported products that don't manage stock, treat as in-stock by default
      if (showOutOfStock) {
        // Show only explicitly out-of-stock products when toggle is enabled
        if (product.inStock !== false) {
          return false;
        }
      } else {
        // Hide only explicitly out-of-stock products (imported products default to in-stock)
        if (product.inStock === false) {
          return false;
        }
      }
      
      // Quick filter: On Sale
      if (quickFilters.onSale && !product.salePrice) {
        return false;
      }
      
      // Quick filter: Free Shipping (assuming products have freeShipping field)
      if (quickFilters.freeShipping && !product.freeShipping) {
        return false;
      }
      
      // Quick filter: New Arrivals (products added in last 30 days)
      if (quickFilters.newArrivals) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const productDate = new Date(product.createdAt || 0);
        if (productDate < thirtyDaysAgo) {
          return false;
        }
      }
      
      // Quick filter: High Rated (4+ stars)
      if (quickFilters.highRated && (product.rating || 0) < 4) {
        return false;
      }
      
      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "reviews":
        // Sort by number of reviews (assuming reviewCount field exists)
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "popularity":
        // Sort by combination of rating and review count
        filtered.sort((a, b) => {
          const aScore = (a.rating || 0) * Math.log(1 + (a.reviewCount || 0));
          const bScore = (b.rating || 0) * Math.log(1 + (b.reviewCount || 0));
          return bScore - aScore;
        });
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "discount":
        // Sort by discount percentage
        filtered.sort((a, b) => {
          const aDiscount = a.salePrice ? ((parseFloat(a.price) - parseFloat(a.salePrice)) / parseFloat(a.price)) * 100 : 0;
          const bDiscount = b.salePrice ? ((parseFloat(b.price) - parseFloat(b.salePrice)) / parseFloat(b.price)) * 100 : 0;
          return bDiscount - aDiscount;
        });
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, selectedBrand, priceRange, ratingFilter, showOutOfStock, sortBy, quickFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, ratingFilter, showOutOfStock, sortBy, quickFilters]);

  // Update price range when products change
  useEffect(() => {
    if (filterData?.priceRange) {
      setPriceRange([filterData.priceRange.min || 0, filterData.priceRange.max || 1000]);
    }
  }, [filterData]);

  // Quick filter handlers
  const toggleQuickFilter = (filterType: keyof typeof quickFilters) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  // Active filters for display
  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedCategory !== "All") filters.push({ type: "category", value: selectedCategory });
    if (selectedBrand !== "All") filters.push({ type: "brand", value: selectedBrand });
    if (ratingFilter > 0) filters.push({ type: "rating", value: `${ratingFilter}+ stars` });
    if (showOutOfStock) filters.push({ type: "stock", value: "Out of Stock" });
    if (quickFilters.onSale) filters.push({ type: "quickFilter", value: "On Sale" });
    if (quickFilters.freeShipping) filters.push({ type: "quickFilter", value: "Free Shipping" });
    if (quickFilters.newArrivals) filters.push({ type: "quickFilter", value: "New Arrivals" });
    if (quickFilters.highRated) filters.push({ type: "quickFilter", value: "High Rated" });
    return filters;
  }, [selectedCategory, selectedBrand, ratingFilter, showOutOfStock, quickFilters]);

  const clearFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "category":
        setSelectedCategory("All");
        break;
      case "brand":
        setSelectedBrand("All");
        break;
      case "rating":
        setRatingFilter(0);
        break;
      case "stock":
        setShowOutOfStock(false);
        break;
      case "quickFilter":
        // Clear specific quick filter based on value
        if (value === "On Sale") setQuickFilters(prev => ({ ...prev, onSale: false }));
        if (value === "Free Shipping") setQuickFilters(prev => ({ ...prev, freeShipping: false }));
        if (value === "New Arrivals") setQuickFilters(prev => ({ ...prev, newArrivals: false }));
        if (value === "High Rated") setQuickFilters(prev => ({ ...prev, highRated: false }));
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setRatingFilter(0);
    setShowOutOfStock(false);
    setSearchTerm("");
    setQuickFilters({
      onSale: false,
      freeShipping: false,
      newArrivals: false,
      highRated: false
    });
  };

  // Show loading state
  if (productsLoading || categoriesLoading || filtersLoading) {
    return (
      <MainEcommerceLayout>
        <div className="w-full px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Shop All Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Discover our complete collection</p>
          </div>
          <ProductGridSkeleton count={12} />
        </div>
      </MainEcommerceLayout>
    );
  }

  // Show error state
  if (productsError) {
    return (
      <MainEcommerceLayout>
        <div className="w-full px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Shop All Products</h1>
            <p className="text-red-600 dark:text-red-400">Failed to load products. Please try again.</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reload Page
            </Button>
          </div>
        </div>
      </MainEcommerceLayout>
    );
  }

  return (
    <MainEcommerceLayout>
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Shop All Products</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our complete collection with {allProducts.length} products
          </p>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-80 flex-shrink-0">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5" />
                      Filters
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Search Products
                    </label>
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Separator />

                  {/* Quick Filter Chips */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Quick Filters</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={quickFilters.onSale ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleQuickFilter("onSale")}
                        className="h-8 text-xs"
                      >
                        🏷️ On Sale
                      </Button>
                      <Button
                        variant={quickFilters.freeShipping ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleQuickFilter("freeShipping")}
                        className="h-8 text-xs"
                      >
                        🚚 Free Shipping
                      </Button>
                      <Button
                        variant={quickFilters.newArrivals ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleQuickFilter("newArrivals")}
                        className="h-8 text-xs"
                      >
                        ✨ New Arrivals
                      </Button>
                      <Button
                        variant={quickFilters.highRated ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleQuickFilter("highRated")}
                        className="h-8 text-xs"
                      >
                        ⭐ High Rated
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <Grid3x3 className="h-4 w-4" />
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                            {category !== "All" && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({allProducts.filter(p => p.category === category).length})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Brand Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Brand
                    </label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                            {brand !== "All" && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({allProducts.filter(p => p.brand === brand).length})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Price Range</label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-20 h-8"
                          min={0}
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-20 h-8"
                          min={0}
                        />
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={filterData?.priceRange?.max || 1000}
                        min={filterData?.priceRange?.min || 0}
                        step={10}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center">
                        ${priceRange[0]} - ${priceRange[1]}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Minimum Rating
                    </label>
                    <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Stock Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Availability
                    </label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="outOfStock"
                        checked={showOutOfStock}
                        onCheckedChange={setShowOutOfStock}
                      />
                      <label htmlFor="outOfStock" className="text-sm">
                        Out of Stock
                      </label>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFilters.length > 0 && (
                    <>
                      <Separator />
                      <Button variant="outline" onClick={clearAllFilters} className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters ({activeFilters.length})
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Top Bar with Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {!showFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Show Filters
                  </Button>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Best Match</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="discount">Biggest Discounts</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode and Filter Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3x3 className="h-4 w-4" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                      List
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Save Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      Load Saved
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-gray-500">Active filters:</span>
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter.value}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => clearFilter(filter.type, filter.value)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">All Products</h2>
              {currentProducts.length > 0 ? (
                <>
                  <div className={`grid gap-4 mb-8 ${
                    viewMode === "grid" 
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                      : "grid-cols-1"
                  }`}>
                    {currentProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {/* Show page numbers with ellipsis for many pages */}
                        {totalPages <= 7 ? (
                          /* Show all pages if 7 or fewer */
                          Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          ))
                        ) : (
                          /* Show condensed pagination for many pages */
                          <>
                            {currentPage > 3 && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} className="w-10">1</Button>
                                {currentPage > 4 && <span className="px-2">...</span>}
                              </>
                            )}
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              const page = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                              if (page > totalPages) return null;
                              return (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className="w-10"
                                >
                                  {page}
                                </Button>
                              );
                            }).filter(Boolean)}
                            
                            {currentPage < totalPages - 2 && (
                              <>
                                {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} className="w-10">{totalPages}</Button>
                              </>
                            )}
                          </>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  {/* Custom Empty State Illustration */}
                  <div className="mb-6 flex justify-center">
                    <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-300 dark:text-gray-600">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8,4"/>
                      <path d="M40 50 L60 70 L80 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <text x="60" y="90" textAnchor="middle" className="text-sm fill-current">No Results</text>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </div>
              )}
            </div>

            {/* Recommendation Sections - Show below All Products when no filters are active */}
            {activeFilters.length === 0 && (
              <div className="space-y-8">
                {/* Recommended for You */}
                {recommendedProducts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        Recommended for You
                      </h2>
                      <span className="text-sm text-gray-500">Based on your browsing history</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {recommendedProducts.slice(0, 6).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* What's New Everywhere */}
                {newArrivals.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Star className="h-5 w-5 text-green-600" />
                        What's New Everywhere
                      </h2>
                      <span className="text-sm text-gray-500">Latest arrivals from all categories</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {newArrivals.slice(0, 6).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Across All Categories */}
                {trendingProducts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        Trending Across All Categories
                      </h2>
                      <span className="text-sm text-gray-500">Popular items from different categories</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {trendingProducts.slice(0, 6).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}