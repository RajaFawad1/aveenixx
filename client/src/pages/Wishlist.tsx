import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, 
  X,
  Star,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import ProductCard from '@/components/ProductCard';


export default function Wishlist() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState<string>('all');
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch all products from API
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
      
      // Return the original product with minimal modifications
      return {
        ...product, // Keep all original fields including imageUrl, imageUrl2, etc.
        price: currentPrice, // Override with calculated price
        originalPrice: originalPrice // Override with calculated original price
      };
    });
  }, [rawProducts]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    console.log('❤️ Wishlist page: Loading from localStorage...');
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const favoritesData = JSON.parse(localStorage.getItem('favorites') || '[]');
    console.log('❤️ DEBUGGING - Wishlist IDs from localStorage:', savedWishlist);
    console.log('❤️ DEBUGGING - Favorites IDs from localStorage (should be different):', favoritesData);
    console.log('❤️ DEBUGGING - Are they the same?', JSON.stringify(savedWishlist) === JSON.stringify(favoritesData));
    setWishlistIds(savedWishlist);
    
    // If we have wishlist items in localStorage, load them into wishlistItems
    if (savedWishlist.length > 0 && allProducts.length > 0) {
      console.log('❤️ Total products available for wishlist matching:', allProducts.length);
      console.log('❤️ First 10 product IDs available:', allProducts.slice(0, 10).map((p: any) => p.id));
      console.log('❤️ Wishlist IDs we are looking for:', savedWishlist);
      console.log('❤️ Checking if any IDs match...');
      savedWishlist.forEach((id: string) => {
        const found = allProducts.find((p: any) => p.id === id);
        console.log(`❤️ Looking for ID '${id}': ${found ? 'FOUND' : 'NOT FOUND'}`);
      });
      const wishProducts = allProducts.filter((product: any) => 
        savedWishlist.includes(product.id)
      );
      console.log('❤️ Wishlist products found:', wishProducts.length);
      console.log('❤️ Wishlist products:', wishProducts.map((p: any) => ({ id: p.id, name: p.name })));
      setWishlistItems(wishProducts);
    } else if (savedWishlist.length > 0) {
      console.log('❤️ Have wishlist IDs but no products loaded yet, allProducts.length:', allProducts.length);
    } else {
      console.log('❤️ No wishlist items in localStorage');
    }
  }, [allProducts]);

  // Apply sorting/filtering based on filterMode
  const sortedWishlistItems = useMemo(() => {
    let items = [...wishlistItems];
    
    switch (filterMode) {
      case 'recent':
        // Sort by product ID (assuming higher ID = more recent)
        return items.sort((a, b) => b.id.localeCompare(a.id));
      case 'popular':
        // Sort by rating or random order for "popularity"
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'price-low':
        return items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      case 'price-high':
        return items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      default:
        return items;
    }
  }, [wishlistItems, filterMode]);

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlistIds.filter(id => id !== productId);
    setWishlistIds(newWishlist);
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  return (
    <MainEcommerceLayout subtitle="Wishlist">
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
                  <Star className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                My Wishlist
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Save items for later and track price changes. Create lists for different occasions and monitor price drops.
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
              <p className="text-gray-600 dark:text-gray-400">Save items for later and track price changes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="recent">Recently Added</option>
              <option value="popular">Most Purchased</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
          </div>
        </div>


        {/* Bulk Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline"
              style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
              onClick={async () => {
                if (sortedWishlistItems.length === 0) return;
                
                try {
                  // Add all wishlist items to cart
                  for (const product of sortedWishlistItems) {
                    await addToCart({
                      id: product.id,
                      name: product.name,
                      price: Number(product.price) || 0,
                      image: product.imageUrl,
                      sku: product.sku || undefined,
                      brand: product.brand || undefined
                    });
                  }
                  
                  toast({ 
                    description: `Successfully added ${sortedWishlistItems.length} items to cart!` 
                  });
                } catch (error) {
                  console.error('Error adding all items to cart:', error);
                  toast({ 
                    description: 'Failed to add some items to cart. Please try again.', 
                    variant: 'destructive' 
                  });
                }
              }}
              disabled={sortedWishlistItems.length === 0}
            >
              Add All to Cart
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={() => {
                setWishlistIds([]);
                setWishlistItems([]);
                localStorage.setItem('wishlist', JSON.stringify([]));
                window.dispatchEvent(new CustomEvent('wishlistUpdated'));
              }}
            >
              <Star className="w-4 h-4 mr-2" />
              Clear Wishlist
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {sortedWishlistItems.length} items
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{sortedWishlistItems.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Wishlist</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>
                ${sortedWishlistItems.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>{sortedWishlistItems.filter(item => item.isInStock !== false).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Stock</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>{sortedWishlistItems.filter(item => item.salePrice || item.discountPercentage).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">On Sale</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-color)' }}></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedWishlistItems.length === 0 && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add products to your wishlist by clicking the star icon on product cards
            </p>
            <Link href="/">
              <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                Start Shopping
              </Button>
            </Link>
          </div>
        )}

        {/* Wishlist Grid/List */}
        {!isLoading && sortedWishlistItems.length > 0 && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" 
            : "space-y-4"}>
            {sortedWishlistItems.map((product) => (
              <div key={product.id} className={viewMode === 'grid' 
                ? "relative group" 
                : "relative group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow"}>
                {viewMode === 'list' ? (
                  // List View Layout
                  <>
                    <div className="flex-shrink-0 w-24 h-24">
                      <img 
                        src={product.imageUrl || product.image || '/placeholder.jpg'} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{product.brand || 'No brand'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>
                          ${Number(product.price || 0).toFixed(2)}
                        </span>
                        {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ${Number(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                        onClick={async () => {
                          await addToCart({
                            id: product.id,
                            name: product.name,
                            price: Number(product.price) || 0,
                            image: product.imageUrl,
                            sku: product.sku || undefined,
                            brand: product.brand || undefined
                          });
                          toast({ description: 'Added to cart!' });
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </>
                ) : (
                  // Grid View Layout (existing ProductCard)
                  <ProductCard 
                    product={product} 
                    wishlistProducts={wishlistIds}
                    onToggleWishlist={removeFromWishlist}
                  />
                )}
                
                {/* Individual Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className={viewMode === 'grid' 
                    ? "absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 z-20"
                    : "absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 z-20"}
                  title="Remove from wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </MainEcommerceLayout>
  );
}