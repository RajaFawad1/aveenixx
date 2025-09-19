import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  X, 
  Star, 
  ShoppingCart, 
  Heart, 
  BarChart3,
  Share2,
  Filter,
  ArrowLeft,
  Scale
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  features: {
    [key: string]: string | number | boolean;
  };
  specifications: {
    [key: string]: string | number;
  };
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  shippingInfo: string;
}

export default function Compare() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [compareList, setCompareList] = useState<string[]>([]);
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch all products from API for search
  const { data: rawProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products']
  });

  // Memoize the transformed products to prevent infinite re-renders
  const allProducts = useMemo(() => {
    return (rawProducts as any[]).map((product: any) => {
      // Fix pricing logic - use the correct current price vs original price
      const originalPrice = Number(product.originalPrice) || Number(product.price) || 0;
      const salePrice = Number(product.salePrice) || undefined;
      const currentPrice = salePrice || Number(product.price) || 0;
      
      return {
        id: product.id,
        name: product.name,
        brand: product.brand || 'Unknown Brand',
        price: currentPrice, // Current selling price (could be sale price)
        originalPrice: originalPrice, // Regular price for comparison
        rating: Number(product.rating) || 0,
        reviewCount: Number(product.reviewCount) || 0,
        image: product.imageUrl || product.imageUrl2 || product.imageUrl3 || product.imageUrl4,
        category: product.category || 'Uncategorized',
        features: product.features || {},
        specifications: product.specifications || {},
        availability: (product.isInStock ? 'in-stock' : 'out-of-stock') as 'in-stock' | 'low-stock' | 'out-of-stock',
        shippingInfo: product.shippingInfo || 'Standard shipping available'
      };
    });
  }, [rawProducts]);

  // Load compare list from localStorage on mount
  useEffect(() => {
    console.log('🔍 Compare page: Loading from localStorage...');
    const savedList = localStorage.getItem('compareList');
    console.log('🔍 Compare page: savedList from localStorage:', savedList);
    
    if (savedList) {
      try {
        const compareIds = JSON.parse(savedList);
        console.log('🔍 Compare page: parsed compareIds:', compareIds);
        setCompareList(compareIds);
        
        // Find products that match the saved IDs
        if (allProducts.length > 0 && compareIds.length > 0) {
          console.log('🔍 Compare page: allProducts available:', allProducts.length);
          console.log('🔍 Compare page: first 10 product IDs:', allProducts.slice(0, 10).map((p: any) => p.id));
          console.log('🔍 Compare page: compareIds we are looking for:', compareIds);
          console.log('🔍 Compare page: checking if any IDs match...');
          compareIds.forEach((id: string) => {
            const found = allProducts.find((p: any) => p.id === id);
            console.log(`🔍 Looking for ID '${id}': ${found ? 'FOUND' : 'NOT FOUND'}`);
          });
          
          const productsToCompare = allProducts.filter((product: any) => 
            compareIds.includes(product.id)
          );
          console.log('🔍 Compare page: Found', productsToCompare.length, 'products to compare from', compareIds.length, 'saved IDs');
          console.log('🔍 Compare page: matched products:', productsToCompare.map((p: any) => ({ id: p.id, name: p.name })));
          setSelectedProducts(productsToCompare);
        } else {
          console.log('🔍 Compare page: allProducts.length:', allProducts.length, 'compareIds.length:', compareIds.length);
        }
      } catch (error) {
        console.error('Error parsing compareList from localStorage:', error);
        localStorage.removeItem('compareList');
      }
    } else {
      console.log('🔍 Compare page: No compareList in localStorage');
    }
  }, [allProducts]);

  // Load immediately when both products and localStorage are available
  useEffect(() => {
    const savedList = localStorage.getItem('compareList');
    console.log('Compare page: checking localStorage...', savedList ? `Found ${JSON.parse(savedList).length} items` : 'No items found');
    
    if (savedList && allProducts.length > 0) {
      try {
        const compareIds = JSON.parse(savedList);
        if (compareIds.length > 0) {
          const productsToCompare = allProducts.filter((product: any) => 
            compareIds.includes(product.id)
          );
          console.log('Compare page: Loading', productsToCompare.length, 'products from', compareIds.length, 'saved IDs');
          console.log('Available products:', allProducts.length);
          console.log('Saved IDs:', compareIds);
          console.log('Found products:', productsToCompare.map((p: any) => ({ id: p.id, name: p.name })));
          
          setSelectedProducts(productsToCompare);
          setCompareList(compareIds);
        }
      } catch (error) {
        console.error('Error loading compare list:', error);
      }
    }
  }, [allProducts.length]); // Trigger when products are loaded

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedProducts.some(selected => selected.id === product.id)
  );

  const addProduct = (product: Product) => {
    const newSelectedProducts = [...selectedProducts, product];
    setSelectedProducts(newSelectedProducts);
    
    const newCompareList = [...compareList, product.id];
    setCompareList(newCompareList);
    localStorage.setItem('compareList', JSON.stringify(newCompareList));
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('compareUpdated'));
  };

  const removeProduct = (productId: string) => {
    const newSelectedProducts = selectedProducts.filter(p => p.id !== productId);
    setSelectedProducts(newSelectedProducts);
    
    const newCompareList = compareList.filter(id => id !== productId);
    setCompareList(newCompareList);
    localStorage.setItem('compareList', JSON.stringify(newCompareList));
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('compareUpdated'));
  };

  const clearAll = () => {
    setSelectedProducts([]);
    setCompareList([]);
    localStorage.removeItem('compareList');
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('compareUpdated'));
  };

  const getAllSpecifications = () => {
    const allSpecs = new Set<string>();
    selectedProducts.forEach(product => {
      Object.keys(product.specifications).forEach(spec => allSpecs.add(spec));
      Object.keys(product.features).forEach(feature => allSpecs.add(feature));
    });
    return Array.from(allSpecs);
  };

  // Chunk products into groups of 6
  const chunkProducts = (products: Product[], chunkSize: number = 6) => {
    const chunks = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      chunks.push(products.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const productChunks = chunkProducts(selectedProducts, 6);

  return (
    <MainEcommerceLayout subtitle="Compare">
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 15%, transparent) 0%, color-mix(in srgb, var(--primary-color) 8%, transparent) 50%, color-mix(in srgb, var(--primary-color) 12%, transparent) 100%)'
          }}></div>
          
          <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full backdrop-blur-sm border" style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, white)',
                  borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                }}>
                  <Scale className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Compare Products
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Compare products' features, pricing, and specifications side-by-side. Add as many products as you need to make informed decisions.
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-bounce delay-500" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full animate-ping delay-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Products</h1>
              <p className="text-gray-600 dark:text-gray-400">Compare features, pricing, and specifications side-by-side</p>
            </div>
          </div>
          
        </div>

        {/* Summary Stats */}
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{selectedProducts.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Products to Compare</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                ${selectedProducts.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>{selectedProducts.filter(item => item.availability === 'in-stock').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Stock</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>{selectedProducts.filter(item => item.originalPrice && item.originalPrice > item.price).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">On Sale</div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
              onClick={async () => {
                if (selectedProducts.length === 0) return;
                
                try {
                  // Add all comparison items to cart
                  for (const product of selectedProducts) {
                    await addToCart({
                      id: product.id,
                      name: product.name,
                      price: Number(product.price) || 0,
                      image: product.image,
                      sku: product.id,
                      brand: product.brand
                    });
                  }
                  
                  toast({ 
                    description: `Successfully added ${selectedProducts.length} items to cart!` 
                  });
                } catch (error) {
                  console.error('Error adding all items to cart:', error);
                  toast({ 
                    description: 'Failed to add some items to cart. Please try again.', 
                    variant: 'destructive' 
                  });
                }
              }}
              disabled={selectedProducts.length === 0}
            >
              Add All to Cart
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={clearAll}
            >
              <Scale className="w-4 h-4 mr-2" />
              Clear Comparison
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedProducts.length} items
            </span>
          </div>
        </div>



        {/* Comparison Grids */}
        {selectedProducts.length > 0 && (
          <div className="space-y-6">
            {productChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="space-y-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                {productChunks.length > 1 && (
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <Scale className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                      Comparison Group {chunkIndex + 1}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({chunk.length} products)
                    </span>
                  </div>
                )}
                
                {/* Product Images Row */}
                <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${chunk.length}, 1fr)` }}>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center">
                    <span className="font-medium text-sm">Products</span>
                  </div>
                  {chunk.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border p-3 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-sm">📦</div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-sm">📦</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-xs text-gray-900 dark:text-white line-clamp-2 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison Rows */}
                <div className="space-y-2">
                  {/* Price */}
                  <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${chunk.length}, 1fr)` }}>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center">
                      <span className="font-medium text-sm">Price</span>
                    </div>
                    {chunk.map((product) => (
                      <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border p-3 text-center">
                        <p className="text-lg font-bold" style={{ color: 'var(--primary-color)' }}>
                          ${product.price.toFixed(2)}
                        </p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-xs text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${chunk.length}, 1fr)` }}>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center">
                      <span className="font-medium text-sm">Rating</span>
                    </div>
                    {chunk.map((product) => (
                      <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">({product.reviewCount})</p>
                      </div>
                    ))}
                  </div>

                  {/* Availability */}
                  <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${chunk.length}, 1fr)` }}>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center">
                      <span className="font-medium text-sm">Availability</span>
                    </div>
                    {chunk.map((product) => (
                      <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border p-3 text-center">
                        <Badge 
                          variant={product.availability === 'in-stock' ? 'default' : 
                                 product.availability === 'low-stock' ? 'secondary' : 'destructive'}
                          className={`text-xs ${
                            product.availability === 'in-stock' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            product.availability === 'low-stock' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                        >
                          {product.availability === 'in-stock' ? 'In Stock' :
                           product.availability === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="grid gap-3" style={{ gridTemplateColumns: `200px repeat(${chunk.length}, 1fr)` }}>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center">
                      <span className="font-medium text-sm">Actions</span>
                    </div>
                    {chunk.map((product) => (
                      <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border p-3">
                        <div className="space-y-1">
                          <Button 
                            size="sm" 
                            className="w-full h-7 text-xs text-white"
                            style={{ 
                              backgroundColor: 'var(--primary-color)',
                              '--tw-bg-opacity': '1'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--primary-color-dark)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                            }}
                            disabled={product.availability === 'out-of-stock'}
                            onClick={async () => {
                              try {
                                await addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  sku: product.id,
                                  brand: product.brand
                                });
                                toast({
                                  description: `${product.name} added to cart!`
                                });
                              } catch (error) {
                                console.error('Error adding to cart:', error);
                                toast({
                                  description: 'Failed to add item to cart. Please try again.',
                                  variant: 'destructive'
                                });
                              }
                            }}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-7 text-xs text-pink-600 hover:text-pink-700 border-pink-300 hover:border-pink-400"
                            onClick={() => {
                              const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                              const isInFavorites = favorites.includes(product.id);
                              
                              if (isInFavorites) {
                                // Remove from favorites
                                const newFavorites = favorites.filter((id: string) => id !== product.id);
                                localStorage.setItem('favorites', JSON.stringify(newFavorites));
                                toast({
                                  description: `${product.name} removed from favourites!`
                                });
                              } else {
                                // Add to favorites
                                const newFavorites = [...favorites, product.id];
                                localStorage.setItem('favorites', JSON.stringify(newFavorites));
                                toast({
                                  description: `${product.name} added to favourites!`
                                });
                              }
                              
                              // Dispatch custom event to update navbar count
                              window.dispatchEvent(new CustomEvent('favoritesUpdated'));
                            }}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            Favourites
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-7 text-xs"
                            onClick={() => {
                              const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                              const isInWishlist = wishlist.includes(product.id);
                              
                              if (isInWishlist) {
                                // Remove from wishlist
                                const newWishlist = wishlist.filter((id: string) => id !== product.id);
                                localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                                toast({
                                  description: `${product.name} removed from wishlist!`
                                });
                              } else {
                                // Add to wishlist
                                const newWishlist = [...wishlist, product.id];
                                localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                                toast({
                                  description: `${product.name} added to wishlist!`
                                });
                              }
                              
                              // Dispatch custom event to update navbar count
                              window.dispatchEvent(new CustomEvent('wishlistUpdated'));
                            }}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Wishlist
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {selectedProducts.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Scale className="h-16 w-16 mx-auto mb-4" style={{ color: 'color-mix(in srgb, var(--primary-color) 40%, #9CA3AF)' }} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Start Comparing Products
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-md mx-auto">
              Search and add products to compare their features, pricing, and specifications side-by-side.
            </p>
            <Button size="sm" disabled>
              <Plus className="h-3 w-3 mr-1" />
              Add Products
            </Button>
          </div>
        )}
        </div>
      </div>
    </MainEcommerceLayout>
  );
}