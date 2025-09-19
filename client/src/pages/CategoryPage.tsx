import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, Grid, List, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import MainEcommerceLayout from "@/components/layout/MainEcommerceLayout";
import ProductCard from "@/components/ProductCard";
import { Product } from "@shared/schema";

interface LocalProduct extends Product {
  badge?: string;
  category: string;
  brand: string;
  inStock: boolean;
}

// Using only real approved products from API - no mock data

const categories = [
  { id: "electronics", name: "Electronics", count: 156 },
  { id: "clothing", name: "Clothing", count: 234 },
  { id: "home-kitchen", name: "Home & Kitchen", count: 89 },
  { id: "sports-outdoors", name: "Sports & Outdoors", count: 67 },
  { id: "furniture", name: "Furniture", count: 45 },
  { id: "books", name: "Books", count: 123 }
];

const brands = [
  { id: "techsound", name: "TechSound", count: 23 },
  { id: "fittech", name: "FitTech", count: 45 },
  { id: "comfortseating", name: "ComfortSeating", count: 12 },
  { id: "brewmaster", name: "BrewMaster", count: 8 },
  { id: "ecowear", name: "EcoWear", count: 34 }
];

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  // Fetch products from backend - use category-specific endpoint if available
  const { data: apiProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: categorySlug ? [`/api/products/by-category/${categorySlug}`] : ['/api/products'],
    enabled: true
  });

  // Fetch categories from backend
  const { data: apiCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    enabled: true
  });

  // Combine API data with mock data for comprehensive display
  const allProducts = Array.isArray(apiProducts) ? apiProducts : [];
  const allCategories = [...(Array.isArray(apiCategories) ? apiCategories.map((cat: any) => ({
    id: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
    name: cat.name,
    count: cat.productCount || 0
  })) : []), ...categories];

  const currentCategory = allCategories.find(cat => cat.id === categorySlug);
  const categoryName = currentCategory?.name || "All Products";

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter((product: any) => {
    // Category filtering - handle both direct category match and WooCommerce category mapping
    if (categorySlug && categorySlug !== "all") {
      const productCategorySlug = product.category?.toLowerCase().replace(/\s+/g, '-');
      const isCategoryMatch = productCategorySlug === categorySlug;
      
      // For WooCommerce products, also check if any WooCommerce category matches
      const isWooCategoryMatch = product.sourcePlatform === 'woocommerce' && 
        product.wooCommerceCategories?.some((cat: any) => 
          cat.name?.toLowerCase().replace(/\s+/g, '-') === categorySlug ||
          cat.slug === categorySlug
        );
      
      if (!isCategoryMatch && !isWooCategoryMatch) {
        return false;
      }
    }
    
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand?.toLowerCase() || '')) {
      return false;
    }
    if (product.price < priceRange.min || product.price > priceRange.max) {
      return false;
    }
    if (showOnlyInStock && !product.inStock) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "newest":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });



  return (
    <MainEcommerceLayout>
      <div className="min-h-screen bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="max-w-full md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categoryName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {sortedProducts.length} products found
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
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
                
                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-full md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                
                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {allCategories.slice(0, 10).map(category => (
                      <div key={category.id} className="flex items-center justify-between">
                        <Link
                          href={`/category/${category.id}`}
                          className={`text-sm hover:text-yellow-600 ${
                            categorySlug === category.id ? 'text-yellow-600 font-medium' : ''
                          }`}
                        >
                          {category.name}
                        </Link>
                        <span className="text-xs text-gray-500">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Brands */}
                <div>
                  <h4 className="font-medium mb-3">Brands</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand.id}
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand.id]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand.id));
                            }
                          }}
                        />
                        <Label
                          htmlFor={brand.id}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {brand.name}
                        </Label>
                        <span className="text-xs text-gray-500">({brand.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* In Stock Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={showOnlyInStock}
                    onCheckedChange={(checked) => setShowOnlyInStock(checked as boolean)}
                  />
                  <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                    In Stock Only
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              {productsLoading || categoriesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedBrands([]);
                      setShowOnlyInStock(false);
                      setPriceRange({ min: 0, max: 500 });
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}>
                  {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {sortedProducts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="default" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}