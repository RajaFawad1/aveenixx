import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useSearch } from 'wouter';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import LazyProductCard from '@/components/LazyProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { MobileFilterDrawer } from '@/components/MobileFilterDrawer';
import { MobileFilterModal } from '@/components/MobileFilterModal';
import { ProductRecommendations } from '@/components/ProductRecommendations';

import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Layers, ChevronRight, ChevronDown, Filter, 
  Grid3x3, List, Star, Heart, Eye, Scale,
  ShoppingCart, ChevronUp, Bell, Smartphone, Laptop,
  Headphones, Camera, Shirt, Home, Utensils, Dumbbell,
  Car, Book, Baby, Zap, Flame, Expand, Minimize,
  BarChart3, Trophy, Briefcase, Backpack, X, Menu
} from 'lucide-react';
import { getIconByName } from '@/utils/iconMapping';
import { decodeHtmlEntities } from '@/lib/utils';

export default function CategoriesPage() {
  // URL parameter handling
  const [location] = useLocation();
  const search = useSearch();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(search);
  const categoryFromUrl = urlParams.get('category') || 'electronics';
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [allSubcategoriesCollapsed, setAllSubcategoriesCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [displayedProducts, setDisplayedProducts] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);
  
  // Category-specific filter states
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [discountFilter, setDiscountFilter] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // QuickView modal state
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // QuickView handler functions
  const handleQuickView = (productId: string) => {
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
      setShowQuickView(true);
    }
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setQuickViewProduct(null);
  };

  // Simplified color swatches
  const colorSwatches: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#DC2626',
    'Blue': '#2563EB',
    'Green': '#059669',
    'Yellow': '#FBBF24',
    'Pink': '#EC4899',
    'Gray': '#6B7280',
    'Brown': '#92400E',
    'Purple': '#7C3AED',
    'Navy': '#1E3A8A',
    'Beige': '#FEF3C7',
    'Gold': '#F59E0B',
    'Silver': '#9CA3AF',
    'Rose Gold': '#F97316'
  };

  // On first load: sync Woo categories into database (skips existing), then show DB categories
  useEffect(() => {
    (async () => {
      try {
        await fetch('/api/woocommerce/categories/sync', { method: 'POST' });
      } catch {}
    })();
  }, []);

  // Fetch categories from database (with subcategories)
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json())
  });

  // Fetch master category counts and subcategory counts
  const { data: masterCategoryCounts = [] } = useQuery({
    queryKey: ['/api/categories/master-with-counts'],
    queryFn: () => fetch('/api/categories/master-with-counts').then(res => res.json())
  });

  const { data: subcategoryCounts = [] } = useQuery({
    queryKey: ['/api/subcategories/all-with-counts'],
    queryFn: () => fetch('/api/subcategories').then(res => res.json())
  });

  // Dynamic category filters using useQuery to fetch from API
  const categoryName = (categories as any[]).find((cat: any) => String(cat.id) === String(selectedCategory))?.name || 'all';
  
  const { data: categoryFilters, isLoading: filtersLoading } = useQuery({
    queryKey: ['/api/categories', categoryName, 'filters'],
    queryFn: () => fetch(`/api/categories/${encodeURIComponent(categoryName)}/filters`).then(res => res.json()),
    enabled: !!categoryName
  });

  // Fallback to empty filters while loading or on error
  const getCategoryFilters = () => {
    return categoryFilters || {
      brands: [],
      priceRanges: [],
      colors: [],
      sizes: [],
      materials: [],
      specifications: [],
      availability: [],
      ratings: []
    };
  };

  // Determine which API to use based on category selection
  const shouldFetchByCategory = selectedCategory !== 'all' && selectedCategory !== '';
  const apiCategoryName = Array.isArray(categories) ? categories.find((cat: any) => cat.id === parseInt(selectedCategory))?.name || selectedCategory : selectedCategory;
  
  // Fetch all products (for default view)
  const { data: allProducts = [] } = useQuery({
    queryKey: ['/api/products'],
    enabled: !shouldFetchByCategory
  });
  
  // Fetch products by category name when category is selected
  const { data: categoryProducts = [] } = useQuery({
    queryKey: ['/api/products', 'category', apiCategoryName],
    queryFn: () => fetch(`/api/products?category=${encodeURIComponent(apiCategoryName)}`).then(res => res.json()),
    enabled: shouldFetchByCategory && !selectedSubcategory && !!apiCategoryName
  });
  
  // Fetch products by subcategory when subcategory is selected
  const { data: subcategoryProducts = [], isLoading: subcategoryLoading } = useQuery({
    queryKey: ['/api/products/by-subcategory', selectedSubcategory],
    queryFn: () => fetch(`/api/products/by-subcategory/${encodeURIComponent(selectedSubcategory)}`).then(res => res.json()),
    enabled: !!selectedSubcategory
  });
  
  // Choose which products to use
  const products = selectedSubcategory ? subcategoryProducts : 
                   shouldFetchByCategory ? categoryProducts : 
                   allProducts;



  // Use dynamic filter brands instead of separate brand API
  const availableBrands = useMemo(() => {
    return categoryFilters?.brands || [];
  }, [categoryFilters]);

  // Calculate filter result counts for better UX
  const filterCounts = useMemo(() => {
    const baseProducts = products;
    
    // Count products for each availability option
    const availabilityCounts = categoryFilters?.availability?.map((option: any) => {
      const filtered = baseProducts.filter((product: any) => {
        const hasDiscount = product.discountPercentage > 0;
        const isPopular = (product.rating || 0) >= 4;
        const simulatedStock = hasDiscount ? Math.floor(Math.random() * 20) + 1 : 
                              isPopular ? Math.floor(Math.random() * 30) + 5 :
                              Math.floor(Math.random() * 50) + 1;
        
        switch (option.value) {
          case 'in_stock':
            return simulatedStock > 0;
          case 'out_of_stock':
            return simulatedStock === 0 || Math.random() < 0.1;
          default:
            return true;
        }
      });
      return { ...option, count: filtered.length };
    }) || [];

    // Count products for each rating option
    const ratingCounts = categoryFilters?.ratings?.map((rating: any) => {
      const filtered = baseProducts.filter((product: any) => {
        const productRating = product.averageRating || product.rating || 0;
        return productRating >= rating.value;
      });
      return { ...rating, count: filtered.length };
    }) || [];

    return {
      availability: availabilityCounts,
      ratings: ratingCounts
    };
  }, [products, categoryFilters]);

  // Use dynamic price ranges from filters
  const realPriceRange = useMemo(() => {
    if (categoryFilters?.priceRanges && categoryFilters.priceRanges.length > 0) {
      const minPrice = Math.min(...categoryFilters.priceRanges.map((r: any) => r.min));
      const maxPrice = Math.max(...categoryFilters.priceRanges.map((r: any) => r.max));
      return [minPrice, maxPrice];
    }
    // Fallback to extracting from products
    if (products.length === 0) return [0, 1000];
    const prices = products.map((p: any) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [categoryFilters, products]);



  // Initialize category from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const categoryFromUrl = urlParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [search]);

  // Initialize price range when products are loaded
  useEffect(() => {
    if (products.length > 0 && priceRange[0] === 0 && priceRange[1] === 0) {
      setPriceRange(realPriceRange as [number, number]);
    }
  }, [products, realPriceRange, priceRange]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Price filter
    filtered = filtered.filter((product: any) =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product: any) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Rating filter - check both averageRating and rating fields
    if (ratingFilter > 0) {
      filtered = filtered.filter((product: any) => {
        const productRating = product.averageRating || product.rating || 0;
        return productRating >= ratingFilter;
      });
    }

    // Category-specific filters
    const categoryFilters = getCategoryFilters();
    
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product: any) => {
        const productText = `${product.name} ${product.description}`.toLowerCase();
        return selectedSizes.some(size => 
          productText.includes(size.toLowerCase()) ||
          productText.includes(`size ${size.toLowerCase()}`)
        );
      });
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((product: any) => {
        const productText = `${product.name} ${product.description}`.toLowerCase();
        return selectedColors.some(color => 
          productText.includes(color.toLowerCase())
        );
      });
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product: any) => {
        const productText = `${product.name} ${product.description}`.toLowerCase();
        return selectedMaterials.some(material => 
          productText.includes(material.toLowerCase())
        );
      });
    }

    if (selectedSpecifications.length > 0) {
      filtered = filtered.filter((product: any) => {
        const productText = `${product.name} ${product.description}`.toLowerCase();
        return selectedSpecifications.some(spec => 
          productText.includes(spec.toLowerCase())
        );
      });
    }

    // Filter by availability (simulate stock based on product characteristics)
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter((product: any) => {
        // Simulate stock status based on product data since actual stock field may not exist
        const hasDiscount = product.discountPercentage > 0;
        const isPopular = (product.rating || 0) >= 4;
        const simulatedStock = hasDiscount ? Math.floor(Math.random() * 20) + 1 : 
                              isPopular ? Math.floor(Math.random() * 30) + 5 :
                              Math.floor(Math.random() * 50) + 1;
        
        switch (availabilityFilter) {
          case 'in_stock':
            return simulatedStock > 0;
          case 'out_of_stock':
            return simulatedStock === 0 || Math.random() < 0.1; // 10% chance out of stock
          case 'limited_stock':
            return simulatedStock > 0 && simulatedStock <= 5;
          default:
            return true;
        }
      });
    }

    // Filter by discount percentage
    if (discountFilter !== 'all') {
      filtered = filtered.filter((product: any) => {
        const discount = product.discountPercentage || 0;
        switch (discountFilter) {
          case '10_plus':
            return discount >= 10;
          case '25_plus':
            return discount >= 25;
          case '50_plus':
            return discount >= 50;
          default:
            return true;
        }
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a: any, b: any) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a: any, b: any) => b.price - a.price);
      case 'rating':
        // Sort by rating (products with ratings first, then by rating value)
        return filtered.sort((a: any, b: any) => {
          const aRating = a.averageRating || 0;
          const bRating = b.averageRating || 0;
          if (aRating === 0 && bRating === 0) return 0; // Both have no rating
          if (aRating === 0) return 1; // a has no rating, put it last
          if (bRating === 0) return -1; // b has no rating, put it last
          return bRating - aRating; // Sort by rating descending
        });
      case 'popular':
        // Sort by a popularity score based on multiple factors
        return filtered.sort((a: any, b: any) => {
          const aPopularity = (a.averageRating || 2.5) * (a.reviewCount || 1) + (a.soldCount || 0) * 0.1;
          const bPopularity = (b.averageRating || 2.5) * (b.reviewCount || 1) + (b.soldCount || 0) * 0.1;
          return bPopularity - aPopularity;
        });
      case 'newest':
        // Sort by ID (higher ID = newer product) as fallback for createdAt
        return filtered.sort((a: any, b: any) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (aDate && bDate) return bDate - aDate; // Use actual dates if available
          // Fallback to product ID (assuming higher ID = newer)
          const aId = parseInt(a.id.replace(/\D/g, '')) || 0;
          const bId = parseInt(b.id.replace(/\D/g, '')) || 0;
          return bId - aId;
        });
      case 'discount':
        // Sort by discount percentage (if available) or lower price
        return filtered.sort((a: any, b: any) => {
          const aDiscount = a.discountPercentage || 0;
          const bDiscount = b.discountPercentage || 0;
          if (aDiscount === bDiscount) {
            // If same discount, sort by lower price
            return a.price - b.price;
          }
          return bDiscount - aDiscount;
        });
      default:
        // Most Relevant - smart sorting by multiple factors
        return filtered.sort((a: any, b: any) => {
          const aRelevance = (a.averageRating || 2.5) + (a.reviewCount || 0) * 0.01 + (a.soldCount || 0) * 0.001;
          const bRelevance = (b.averageRating || 2.5) + (b.reviewCount || 0) * 0.01 + (b.soldCount || 0) * 0.001;
          return bRelevance - aRelevance;
        });
    }
  }, [products, selectedCategory, selectedSubcategory, priceRange, selectedBrands, ratingFilter, availabilityFilter, selectedSizes, selectedColors, selectedMaterials, selectedSpecifications, discountFilter, sortBy]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (ratingFilter > 0) count += 1;
    if (availabilityFilter !== 'all') count += 1;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedSpecifications.length > 0) count += selectedSpecifications.length;
    if (priceRange[0] !== realPriceRange[0] || priceRange[1] !== realPriceRange[1]) count += 1;
    if (discountFilter !== 'all') count += 1;
    return count;
  }, [selectedBrands, ratingFilter, availabilityFilter, selectedSizes, selectedColors, selectedMaterials, selectedSpecifications, priceRange, realPriceRange, discountFilter]);



  // Category selection
  const selectCategory = (categoryId: string) => {
    setIsSwitchingCategory(true);
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    setDisplayedProducts(12);
    
    // Reset category-specific filters when switching categories
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedSpecifications([]);
    setAvailabilityFilter('all');
    
    setTimeout(() => setIsSwitchingCategory(false), 300);
  };

  // Load more products
  const loadMoreProducts = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedProducts(prev => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  // Filter Panel Component
  const FilterPanel = () => {
    const categoryFilters = getCategoryFilters();
    const hasCategoryFilters = categoryFilters.sizes.length > 0 || categoryFilters.colors.length > 0 || 
                              categoryFilters.materials.length > 0 || categoryFilters.specifications.length > 0;
    
    // Check if we have any filters at all (including availability, ratings, brands)
    const hasAnyFilters = categoryFilters.availability.length > 0 || categoryFilters.ratings.length > 0 || 
                         categoryFilters.brands.length > 0 || hasCategoryFilters;

    return (
      <Card className="mb-3">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount} active
                </Badge>
              )}
            </h3>
            
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
            setSelectedBrands([]);
            setRatingFilter(0);
            setAvailabilityFilter('all');
            setSelectedSizes([]);
            setSelectedColors([]);
            setSelectedMaterials([]);
            setSelectedSpecifications([]);
            setPriceRange(realPriceRange as [number, number]);
          }}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Active Filters Display with Individual Removal */}
          {activeFiltersCount > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {selectedBrands.map(brand => (
                  <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                    {brand}
                    <button
                      onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {ratingFilter > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {ratingFilter}+ Stars
                    <button
                      onClick={() => setRatingFilter(0)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {availabilityFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categoryFilters?.availability?.find((a: any) => a.value === availabilityFilter)?.label || availabilityFilter}
                    <button
                      onClick={() => setAvailabilityFilter('all')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedSizes.map(size => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    Size: {size}
                    <button
                      onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedColors.map(color => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-1">
                    {color}
                    <button
                      onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {discountFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {discountFilter === '10_plus' ? '10% Off+' : 
                     discountFilter === '25_plus' ? '25% Off+' : 
                     discountFilter === '50_plus' ? '50% Off+' : discountFilter}
                    <button
                      onClick={() => setDiscountFilter('all')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Basic Filters - Always show if we have any filters */}
          <div className="space-y-3 mb-3">
            {/* Availability Filter using dynamic data */}
            {categoryFilters?.availability && categoryFilters.availability.length > 0 && (
              <div className="flex items-center">
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="All Items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  {filterCounts.availability.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Rating Filter - using dynamic data */}  
            {categoryFilters?.ratings && categoryFilters.ratings.length > 0 && (
            <div className="flex items-center">
              <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(parseInt(value))}>
                <SelectTrigger className="w-full h-9">
                  <div className="flex items-center gap-2">
                    {ratingFilter === 0 ? (
                      <>
                        <Star className="h-4 w-4" style={{ color: 'var(--primary-color)' }} />
                        <span>Any Rating</span>
                      </>
                    ) : (
                      <>
                        <div className="flex">
                          {[...Array(ratingFilter)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" style={{ color: 'var(--primary-color)' }} />
                          ))}
                        </div>
                        <span>{ratingFilter}+ Stars</span>
                      </>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 flex items-center justify-center text-sm" style={{ color: 'var(--primary-color)' }}>✓</span>
                      <span>Any Rating</span>
                    </div>
                  </SelectItem>
                  {filterCounts.ratings.map((rating: any) => (
                    <SelectItem key={rating.value} value={rating.value.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(rating.value)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" style={{ color: 'var(--primary-color)' }} />
                            ))}
                          </div>
                          <span>{rating.label}</span>
                        </div>
                        <span className="text-xs text-gray-500">({rating.count})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
            )}

            {/* Discount Filter */}
            <div className="flex items-center">
              <Select value={discountFilter} onValueChange={setDiscountFilter}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Any Discount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Discount</SelectItem>
                  <SelectItem value="10_plus">10% Off or More</SelectItem>
                  <SelectItem value="25_plus">25% Off or More</SelectItem>
                  <SelectItem value="50_plus">50% Off or More</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category-Specific Filters */}
          {hasCategoryFilters && (
            <div className="space-y-3 mb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              {/* Size Filters */}
              {categoryFilters.sizes.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.sizes.map((size: any) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedSizes.includes(size)) {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          } else {
                            setSelectedSizes([...selectedSizes, size]);
                          }
                        }}
                        className={`h-8 px-3 text-xs ${
                          selectedSizes.includes(size) 
                            ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white border-[var(--primary-color)]' 
                            : ''
                        }`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Filters */}
              {categoryFilters.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.colors.map((color: any) => (
                      <div
                        key={color}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          selectedColors.includes(color) 
                            ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800' 
                            : 'hover:scale-110'
                        }`}
                        style={selectedColors.includes(color) ? { 
                          '--tw-ring-color': 'var(--primary-color)',
                          '--tw-ring-opacity': '1'
                        } as React.CSSProperties : {}}
                        onClick={() => {
                          if (selectedColors.includes(color)) {
                            setSelectedColors(selectedColors.filter(c => c !== color));
                          } else {
                            setSelectedColors([...selectedColors, color]);
                          }
                        }}
                        title={color}
                      >
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                          style={{ 
                            backgroundColor: colorSwatches[color] || '#9CA3AF',
                            border: color === 'White' ? '2px solid #D1D5DB' : `2px solid ${colorSwatches[color] || '#9CA3AF'}`
                          }}
                        />
                        {selectedColors.includes(color) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: color === 'White' || color === 'Yellow' ? '#000' : '#fff'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Material Filters */}
              {categoryFilters.materials.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">Material</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.materials.map((material: any) => (
                      <Button
                        key={material}
                        variant={selectedMaterials.includes(material) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedMaterials.includes(material)) {
                            setSelectedMaterials(selectedMaterials.filter(m => m !== material));
                          } else {
                            setSelectedMaterials([...selectedMaterials, material]);
                          }
                        }}
                        className={`h-8 px-3 text-xs ${
                          selectedMaterials.includes(material) 
                            ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white border-[var(--primary-color)]' 
                            : ''
                        }`}
                      >
                        {material}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Filters */}
              {categoryFilters.specifications.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">Features</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.specifications.map((spec: any) => (
                      <Button
                        key={spec}
                        variant={selectedSpecifications.includes(spec) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedSpecifications.includes(spec)) {
                            setSelectedSpecifications(selectedSpecifications.filter(s => s !== spec));
                          } else {
                            setSelectedSpecifications([...selectedSpecifications, spec]);
                          }
                        }}
                        className={`h-8 px-3 text-xs ${
                          selectedSpecifications.includes(spec) 
                            ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white border-[var(--primary-color)]' 
                            : ''
                        }`}
                      >
                        {spec}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={realPriceRange[0]}
                  max={realPriceRange[1]}
                  step={Math.max(1, Math.floor((realPriceRange[1] - realPriceRange[0]) / 100))}
                  className="mb-2 cursor-pointer"
                  style={{
                    '--slider-thumb-size': '20px',
                    '--slider-track-height': '6px'
                  } as React.CSSProperties}
                />
              </div>
              
              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-900 dark:text-gray-100">Brands</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(availableBrands as string[]).map((brand: string) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <label htmlFor={brand} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* No Filters Message */}
          {!hasAnyFilters && !showAdvancedFilters && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">No specific filters available for this category</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(true)}
                className="mt-2 text-xs"
              >
                Show Price Range
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // SEO metadata
  const selectedCategoryName = (categories as any[]).find((c: any) => String(c.id) === String(selectedCategory))?.name || 'Categories';
  
  const seoTitle = `${selectedCategoryName} - Browse Products | Aveenix`;
  const seoDescription = `Browse ${filteredProducts.length}+ ${selectedCategoryName?.toLowerCase() || 'category'} products. Find quality items at competitive prices with fast shipping and excellent customer service.`;

  return (
    <MainEcommerceLayout>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={`${selectedCategoryName.toLowerCase()}, online shopping, products`}
        canonicalUrl={`https://aveenix.com/categories?category=${selectedCategory}`}
      />
      <OfflineIndicator />
      <ErrorBoundary>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-[1500px] mx-auto px-2 pt-0 pb-2">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg mb-3">
              <Home 
                className="h-4 w-4 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors" 
                onClick={() => {
                  selectCategory('electronics');
                  setSelectedSubcategory('');
                }}
              />
              <span 
                className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                onClick={() => {
                  selectCategory('electronics');
                  setSelectedSubcategory('');
                }}
              >
                Home
              </span>
              
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                {selectedCategoryName}
              </span>
            </div>

            <div className="flex gap-6">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                {/* Categories */}
                <Card className="mb-3">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        All Categories
                      </h3>
                      <button
                        onClick={() => {
                          if (expandedCategories.length > 0) {
                            // Collapse all subcategories
                            setExpandedCategories([]);
                            setAllSubcategoriesCollapsed(true);
                          } else {
                            // No subcategories are open, so this button doesn't need to do anything
                            setAllSubcategoriesCollapsed(false);
                          }
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title={expandedCategories.length > 0 ? "Collapse all subcategories" : "All subcategories collapsed"}
                      >
                        {expandedCategories.length > 0 ? (
                          <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-3"></div>
                    <div className="space-y-1">

                      {(categories as any[])
                        .filter((category: any) => category.name?.toLowerCase() !== 'uncategorized')
                        .map((category: any) => (
                        <div key={category.id}>
                          <Button
                            variant={selectedCategory === category.id ? 'default' : 'ghost'}
                            className={`w-full justify-between text-left h-8 ${
                              selectedCategory === category.id 
                                ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white' 
                                : ''
                            }`}
                            onClick={() => {
                              if (String(selectedCategory) === String(category.id)) {
                                // Toggle expansion on same category
                                setExpandedCategories(prev => (
                                  prev.includes(category.id)
                                    ? prev.filter(id => id !== category.id)
                                    : [...prev, category.id]
                                ));
                              } else {
                                selectCategory(String(category.id));
                                setExpandedCategories(prev => (
                                  prev.includes(category.id) ? prev : [...prev, category.id]
                                ));
                              }
                            }}
                          >
                            <div className="flex items-center">
                              {React.createElement(getIconByName(category.icon), { className: "w-4 h-4 mr-2" })}
                              {decodeHtmlEntities(category.name)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {(() => {
                                  const counted = (masterCategoryCounts as any[]).find((c: any) => String(c.id) === String(category.id));
                                  return counted?.productCount ?? category.productCount ?? 0;
                                })()}
                              </Badge>
                              {category.subcategories && category.subcategories.length > 0 && (
                                <span
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setExpandedCategories(prev => (
                                      prev.includes(category.id)
                                        ? prev.filter(id => id !== category.id)
                                        : [...prev, category.id]
                                    ));
                                  }}
                                  className="inline-flex items-center justify-center w-5 h-5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {expandedCategories.includes(category.id) ? 
                                    <ChevronUp className="h-3 w-3" /> : 
                                    <ChevronDown className="h-3 w-3" />}
                                </span>
                              )}
                            </div>
                          </Button>
                          
                          {/* Subcategories */}
                          {category.subcategories && category.subcategories.length > 0 && expandedCategories.includes(category.id) && (
                            <div className="ml-4 mt-1 space-y-1">
                              {category.subcategories.map((subcategory: any) => (
                                <Button
                                  key={subcategory.id}
                                  variant={selectedSubcategory === subcategory.name ? 'default' : 'ghost'}
                                  size="sm"
                                  className={`w-full justify-start text-left h-7 text-xs ${
                                    selectedSubcategory === subcategory.name 
                                      ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white' 
                                      : ''
                                  }`}
                                  onClick={() => {
                                    setSelectedSubcategory(subcategory.name);
                                    setSelectedCategory(String(category.id));
                                  }}
                                >
                                  {React.createElement(getIconByName(subcategory.icon), { className: "w-3 h-3 mr-2" })}
                                  {decodeHtmlEntities(subcategory.name)}
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    {(() => {
                                      const counted = (subcategoryCounts as any[]).find((s: any) => String(s.id) === String(subcategory.id));
                                      return counted?.productCount ?? subcategory.productCount ?? 0;
                                    })()}
                                  </Badge>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Filters */}
                <FilterPanel />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">


                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedCategoryName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredProducts.length} products found
                    </p>
                  </div>


                </div>

                {/* Filter Bar - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {/* Mobile: First row - Product count, sort, and filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      <span className="hidden sm:inline">Showing {Math.min(displayedProducts, filteredProducts.length)} of </span>
                      <span className="sm:hidden">{Math.min(displayedProducts, filteredProducts.length)}/</span>
                      {filteredProducts.length} products
                      <span className="hidden sm:inline"> matching your filters</span>
                    </span>
                    
                    <div className="flex gap-2 sm:gap-3 flex-1 sm:flex-none">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1 sm:w-48 min-w-0">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Most Relevant</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Top Rated</SelectItem>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="newest">Recently Added</SelectItem>
                          <SelectItem value="discount">Best Deals</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Mobile Filter Button - moved to toolbar */}
                      <Button
                        variant="outline"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="lg:hidden flex items-center justify-center gap-1 px-3 py-2 border-2 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] min-w-fit"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="hidden xs:inline">Filter</span>
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-1 bg-[var(--primary-color)] text-white text-xs px-1.5">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Mobile: Second row - View toggle buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex border rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        className={`rounded-none px-4 py-2 ${viewMode === 'grid' ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white border-[var(--primary-color)]' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3x3 className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline">Grid</span>
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        className={`rounded-none px-4 py-2 border-l ${viewMode === 'list' ? 'bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white border-[var(--primary-color)]' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline">List</span>
                      </Button>
                    </div>
                    
                    {/* Hide save/load buttons on mobile, show on desktop */}
                    <div className="hidden sm:flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      onClick={() => {
                        // Save current filter state to localStorage
                        const filterState = {
                          selectedCategory,
                          selectedSubcategory,
                          priceRange,
                          selectedBrands,
                          ratingFilter,
                          selectedSizes,
                          selectedColors,
                          selectedMaterials,
                          selectedSpecifications,
                          sortBy,
                          savedAt: new Date().toISOString(),
                          categoryName: (categories as any[]).find((c: any) => c.id === parseInt(selectedCategory))?.name || 'All Categories'
                        };
                        localStorage.setItem('savedFilters', JSON.stringify(filterState));
                        
                        // Show success notification
                        const notification = document.createElement('div');
                        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
                        notification.textContent = '✓ Filter settings saved successfully!';
                        document.body.appendChild(notification);
                        
                        // Remove notification after 3 seconds
                        setTimeout(() => {
                          notification.style.opacity = '0';
                          setTimeout(() => {
                            if (document.body.contains(notification)) {
                              document.body.removeChild(notification);
                            }
                          }, 300);
                        }, 3000);
                      }}
                    >
                      Save Filter
                    </Button>
                    
                    {localStorage.getItem('savedFilters') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        onClick={() => {
                          try {
                            const savedFilters = JSON.parse(localStorage.getItem('savedFilters') || '{}');
                            
                            // Apply saved filters
                            if (savedFilters.selectedCategory) setSelectedCategory(savedFilters.selectedCategory);
                            if (savedFilters.selectedSubcategory) setSelectedSubcategory(savedFilters.selectedSubcategory);
                            if (savedFilters.priceRange) setPriceRange(savedFilters.priceRange);
                            if (savedFilters.selectedBrands) setSelectedBrands(savedFilters.selectedBrands);
                            if (savedFilters.ratingFilter) setRatingFilter(savedFilters.ratingFilter);
                            if (savedFilters.selectedSizes) setSelectedSizes(savedFilters.selectedSizes);
                            if (savedFilters.selectedColors) setSelectedColors(savedFilters.selectedColors);
                            if (savedFilters.selectedMaterials) setSelectedMaterials(savedFilters.selectedMaterials);
                            if (savedFilters.selectedSpecifications) setSelectedSpecifications(savedFilters.selectedSpecifications);
                            if (savedFilters.sortBy) setSortBy(savedFilters.sortBy);
                            
                            // Show success notification
                            const notification = document.createElement('div');
                            notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
                            notification.textContent = `✓ Loaded filters from ${new Date(savedFilters.savedAt || Date.now()).toLocaleDateString()}`;
                            document.body.appendChild(notification);
                            
                            setTimeout(() => {
                              notification.style.opacity = '0';
                              setTimeout(() => {
                                if (document.body.contains(notification)) {
                                  document.body.removeChild(notification);
                                }
                              }, 300);
                            }, 3000);
                          } catch (error) {
                            console.error('Error loading saved filters:', error);
                          }
                        }}
                      >
                        Load Saved
                      </Button>
                    )}
                    
                    {activeFiltersCount > 0 && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      >
                        {activeFiltersCount} filters active
                      </Button>
                    )}
                    
                    {activeFiltersCount > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedCategory('electronics');
                          setSelectedSubcategory('');
                          setSelectedBrands([]);
                          setRatingFilter(0);
                          setSelectedSizes([]);
                          setSelectedColors([]);
                          setSelectedMaterials([]);
                          setSelectedSpecifications([]);
                          setPriceRange(realPriceRange as [number, number]);
                          setAvailabilityFilter('all');
                          setDiscountFilter('all');
                          setExpandedCategories([]);
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                {isSwitchingCategory ? (
                  <ProductGridSkeleton count={12} />
                ) : filteredProducts.length === 0 ? (
                  /* No Results State */
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                          <Filter className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Try adjusting your filters or search criteria to find what you're looking for.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Suggestions:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBrands([]);
                              setRatingFilter(0);
                              setAvailabilityFilter('all');
                              setDiscountFilter('all');
                            }}
                            className="text-xs"
                          >
                            Clear all filters
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCategory('electronics')}
                            className="text-xs"
                          >
                            Browse all Electronics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`grid gap-4 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' 
                        : 'grid-cols-1'
                    }`}>
                      {filteredProducts.slice(0, displayedProducts).map((product: any, index: number) => (
                        <LazyProductCard 
                          key={product.id} 
                          product={product} 
                          index={index}
                          viewMode={viewMode}
                          onQuickView={handleQuickView}
                        />
                      ))}
                    </div>

                    {/* Load More */}
                    {filteredProducts.length > displayedProducts && (
                      <div className="text-center mt-8">
                        <Button
                          onClick={loadMoreProducts}
                          disabled={isLoadingMore}
                          size="lg"
                          className="px-8"
                        >
                          {isLoadingMore ? 'Loading...' : `Load More (${filteredProducts.length - displayedProducts} remaining)`}
                        </Button>
                      </div>
                    )}

                    {/* Product Recommendations */}
                    <div className="mt-16 space-y-12">
                      <ProductRecommendations
                        categoryName={selectedCategory}
                        type="new-arrivals"
                        title="New Arrivals"
                        limit={6}
                      />
                      
                      <ProductRecommendations
                        categoryName={selectedCategory}
                        type="customers-also-viewed"
                        title="Customers Also Viewed"
                        limit={6}
                      />
                      
                      <ProductRecommendations
                        categoryName={selectedCategory}
                        type="best-sellers"
                        title="Best Sellers in This Category"
                        limit={6}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
      
      {/* QuickView Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={closeQuickView}
      />

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        activeFiltersCount={activeFiltersCount}
        onClearAll={() => {
          setSelectedCategory('electronics');
          setSelectedSubcategory('');
          setSelectedBrands([]);
          setRatingFilter(0);
          setSelectedSizes([]);
          setSelectedColors([]);
          setSelectedMaterials([]);
          setSelectedSpecifications([]);
          setPriceRange(realPriceRange as [number, number]);
          setAvailabilityFilter('all');
          setDiscountFilter('all');
          setExpandedCategories([]);
          setMobileFiltersOpen(false);
        }}
      >
        {/* Same filter content as desktop sidebar */}
        <div className="space-y-4">
          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Active Filters</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBrands.map(brand => (
                  <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                    {brand}
                    <button
                      onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {ratingFilter > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {ratingFilter}+ Stars
                    <button
                      onClick={() => setRatingFilter(0)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {availabilityFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categoryFilters?.availability?.find((a: any) => a.value === availabilityFilter)?.label || availabilityFilter}
                    <button
                      onClick={() => setAvailabilityFilter('all')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {discountFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {discountFilter === '10_plus' ? '10% Off+' : 
                     discountFilter === '25_plus' ? '25% Off+' : 
                     discountFilter === '50_plus' ? '50% Off+' : discountFilter}
                    <button
                      onClick={() => setDiscountFilter('all')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Mobile version of filters - simplified */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
                    {categoryFilters?.availability?.map((option: any) => (
                <button
                  key={option.value}
                  onClick={() => setAvailabilityFilter(
                    availabilityFilter === option.value ? 'all' : option.value
                  )}
                  className={`block w-full text-left px-3 py-2 text-sm border rounded mb-1 ${
                    availabilityFilter === option.value
                      ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
                    {categoryFilters?.ratings?.map((rating: any) => (
                <button
                  key={rating.value}
                  onClick={() => setRatingFilter(
                    ratingFilter === rating.value ? 0 : rating.value
                  )}
                  className={`block w-full text-left px-3 py-2 text-sm border rounded mb-1 ${
                    ratingFilter === rating.value
                      ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(rating.value)].map((_, i) => (
                        <div key={i} className="w-3 h-3 text-yellow-400">⭐</div>
                      ))}
                    </div>
                    <span>{rating.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Discount</label>
              {['10_plus', '25_plus', '50_plus'].map(discount => (
                <button
                  key={discount}
                  onClick={() => setDiscountFilter(
                    discountFilter === discount ? 'all' : discount
                  )}
                  className={`block w-full text-left px-3 py-2 text-sm border rounded mb-1 ${
                    discountFilter === discount
                      ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {discount === '10_plus' ? '10% Off or More' : 
                   discount === '25_plus' ? '25% Off or More' : 
                   '50% Off or More'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </MobileFilterModal>


    </MainEcommerceLayout>
  );
}