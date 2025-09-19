import { Product } from "@shared/schema";
import { Heart, Eye, Scale, Bell, Star, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Link, useLocation } from "wouter";
import { detectSourcePlatform } from "@/utils/sourcePlatformDetector";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import PriceDisplay from "./ui/PriceDisplay";

interface ProductCardProps {
  product: Product;
  // Optional state management props for icon interactions
  wishlistProducts?: string[];
  compareProducts?: string[];
  notificationProducts?: string[];
  actualWishlistProducts?: string[];
  quickViewClicked?: string | null;
  onToggleWishlist?: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onToggleNotification?: (productId: string) => void;
  onToggleActualWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  wishlistProducts = [],
  compareProducts = [],
  notificationProducts = [],
  actualWishlistProducts = [],
  quickViewClicked = null,
  onToggleWishlist,
  onToggleCompare,
  onToggleNotification,
  onToggleActualWishlist,
  onQuickView
}: ProductCardProps) {
  // Calculate correct pricing values
  const calculatePricing = () => {
    const originalPrice = parseFloat(product.originalPrice || product.price);
    const currentPrice = parseFloat(product.price);
    const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
    const discountPercentage = product.discountPercentage || 0;
    
    
    
    // If we have a salePrice, use it and calculate actual discount
    if (salePrice && salePrice < originalPrice) {
      const actualDiscount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
      return {
        displayPrice: salePrice.toFixed(2),
        originalPrice: originalPrice.toFixed(2),
        actualDiscount: actualDiscount,
        hasDiscount: true
      };
    }
    
    // If discountPercentage exists but no salePrice, calculate it
    if (discountPercentage > 0 && !salePrice) {
      const calculatedSalePrice = originalPrice * (1 - discountPercentage / 100);
      return {
        displayPrice: calculatedSalePrice.toFixed(2),
        originalPrice: originalPrice.toFixed(2),
        actualDiscount: discountPercentage,
        hasDiscount: true
      };
    }
    
    // No discount - with fallback handling
    if (isNaN(currentPrice) || currentPrice === 0) {
      // Fallback: try to extract price from string or use originalPrice
      const fallbackPrice = originalPrice || 0;
      return {
        displayPrice: fallbackPrice.toFixed(2),
        originalPrice: null,
        actualDiscount: 0,
        hasDiscount: false
      };
    }
    
    return {
      displayPrice: currentPrice.toFixed(2),
      originalPrice: null,
      actualDiscount: 0,
      hasDiscount: false
    };
  };
  
  const pricing = calculatePricing();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver({ threshold: 0.1, rootMargin: '100px' });
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();

  // Local state management for when no parent state is provided
  const [localWishlist, setLocalWishlist] = useState<string[]>([]);
  const [localCompare, setLocalCompare] = useState<string[]>([]);
  const [localNotifications, setLocalNotifications] = useState<string[]>([]);
  const [localActualWishlist, setLocalActualWishlist] = useState<string[]>([]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
      const savedNotifications = JSON.parse(localStorage.getItem('priceNotifications') || '[]');
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      setLocalWishlist(savedFavorites); // Heart = Favourites
      setLocalCompare(savedCompare);
      setLocalNotifications(savedNotifications);
      setLocalActualWishlist(savedWishlist); // Star = Wishlist
    }
  }, []);

  // Get toast function
  const { toast } = useToast();

  // Use provided state or fallback to local state
  const isInWishlist = onToggleWishlist ? wishlistProducts.includes(product.id) : localWishlist.includes(product.id);
  const isInCompare = onToggleCompare ? compareProducts.includes(product.id) : localCompare.includes(product.id);
  const isInNotifications = onToggleNotification ? notificationProducts.includes(product.id) : localNotifications.includes(product.id);
  const isInActualWishlist = onToggleActualWishlist ? actualWishlistProducts.includes(product.id) : localActualWishlist.includes(product.id);

  // Handle heart button (Favourites)
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    } else {
      const newFavorites = localWishlist.includes(product.id) 
        ? localWishlist.filter(id => id !== product.id)
        : [...localWishlist, product.id];
      
      setLocalWishlist(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      const message = localWishlist.includes(product.id) 
        ? "Product removed from favourites" 
        : "Product added to favourites";
      
      toast({ description: message });
    }
    // Always dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('favouritesUpdated'));
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(product.id);
    } else {
      const newCompare = localCompare.includes(product.id) 
        ? localCompare.filter(id => id !== product.id)
        : [...localCompare, product.id];
      
      setLocalCompare(newCompare);
      localStorage.setItem('compareList', JSON.stringify(newCompare));
      
      const message = localCompare.includes(product.id) 
        ? "Product removed from compare list" 
        : "Product added to compare list";
      
      toast({ description: message });
    }
    // Always dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('compareUpdated'));
  };

  // Handle bell button (Price Notifications)
  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleNotification) {
      onToggleNotification(product.id);
    } else {
      const newNotifications = localNotifications.includes(product.id) 
        ? localNotifications.filter(id => id !== product.id)
        : [...localNotifications, product.id];
      
      setLocalNotifications(newNotifications);
      localStorage.setItem('priceNotifications', JSON.stringify(newNotifications));
      
      const message = localNotifications.includes(product.id) 
        ? "Price notifications disabled" 
        : "Price notifications enabled";
      
      toast({ description: message });
    }
    // Always dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  };

  // Handle star button (Wishlist)
  const handleActualWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleActualWishlist) {
      onToggleActualWishlist(product.id);
    } else {
      const newWishlist = localActualWishlist.includes(product.id) 
        ? localActualWishlist.filter(id => id !== product.id)
        : [...localActualWishlist, product.id];
      
      setLocalActualWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      
      const message = localActualWishlist.includes(product.id) 
        ? "Product removed from wishlist" 
        : "Product added to wishlist";
      
      toast({ description: message });
    }
    // Always dispatch custom event to update navbar count  
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product.id);
    } else {
      // Fallback behavior - show a toast for now
      toast({ description: 'Quick view feature coming soon!' });
    }
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: Number(pricing.displayPrice) || 0,
        image: product.imageUrl,
        sku: product.sku || undefined,
        brand: product.brand || undefined
      });
      
      toast({ description: 'Product added to cart successfully!' });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast({ description: 'Failed to add product to cart. Please try again.', variant: 'destructive' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    return (
      <div className="flex text-yellow-400 text-xs">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(5 - Math.ceil(ratingNum))].map((_, i) => (
          <i key={i + fullStars} className="far fa-star"></i>
        ))}
      </div>
    );
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div 
        ref={elementRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer hw-accel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <div className="relative overflow-hidden rounded-md">
        {/* Image Display */}
        <div className="aspect-[4/4] max-h-[220px] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl.includes('i1.wp.com') 
                ? product.imageUrl.replace('https://i1.wp.com/', '').replace('?ssl=1', '') 
                : product.imageUrl
              } 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                // Fallback to original URL if direct URL fails
                const originalUrl = product.imageUrl;
                if (e.currentTarget.src !== originalUrl) {
                  e.currentTarget.src = originalUrl;
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
                <p className="text-xs">No image</p>
              </div>
            </div>
          )}

          {/* Tier 1 Enhancement: Additional Images Gallery (3-4 max) */}
          {hasIntersected && isHovered && (product.imageUrl2 || product.imageUrl3 || product.imageUrl4) && (
            <div className="absolute bottom-2 left-2 flex gap-1 z-10">
              {product.imageUrl2 && (
                <div className="w-8 h-8 rounded border-2 border-white shadow-lg overflow-hidden">
                  <img src={product.imageUrl2} alt={`${product.name} - view 2`} 
                       className="w-full h-full object-cover" />
                </div>
              )}
              {product.imageUrl3 && (
                <div className="w-8 h-8 rounded border-2 border-white shadow-lg overflow-hidden">
                  <img src={product.imageUrl3} alt={`${product.name} - view 3`} 
                       className="w-full h-full object-cover" />
                </div>
              )}
              {product.imageUrl4 && (
                <div className="w-8 h-8 rounded border-2 border-white shadow-lg overflow-hidden">
                  <img src={product.imageUrl4} alt={`${product.name} - view 4`} 
                       className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>
        {/* Tier 1 Enhancement: Enhanced Product Labels Stack */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          {pricing.hasDiscount && pricing.actualDiscount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md">
              -{pricing.actualDiscount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-[var(--primary-color)] text-white text-xs px-2 py-1 rounded shadow-md">New</span>
          )}
          {product.isBestseller && (
            <span className="bg-[var(--primary-color)] text-white text-xs px-2 py-1 rounded shadow-md">Bestseller</span>
          )}
          {product.isFeatured && (
            <span className="bg-[var(--primary-color)] text-white text-xs px-2 py-1 rounded shadow-md">Featured</span>
          )}
        </div>
        {/* All Icons in Vertical Stack */}
        <div className={`absolute top-2 right-2 transition-all duration-300 z-10 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          <div className="flex flex-col gap-1.5 items-end">
            <button 
              onClick={handleCompareClick}
              className="p-1.5 transition-all duration-200 transform hover:scale-110"
              title="Compare"
            >
              <Scale 
                className={`w-5 h-5 transition-colors ${
                  isInCompare ? 'fill-current' : ''
                }`}
                style={{ 
                  color: 'var(--primary-color)',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))'
                }}
              />
            </button>
            <button 
              onClick={handleWishlistClick}
              className="p-1.5 transition-all duration-200 transform hover:scale-110"
              title={isInWishlist ? "Remove from Favourites" : "Add to Favourite"}
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  isInWishlist ? 'fill-current' : ''
                }`}
                style={{ 
                  color: 'var(--primary-color)',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))'
                }}
              />
            </button>
            <button 
              onClick={handleNotificationClick}
              className="p-1.5 transition-all duration-200 transform hover:scale-110"
              title="Notifications"
            >
              <Bell 
                className={`w-5 h-5 transition-colors ${
                  isInNotifications ? 'fill-current' : ''
                }`}
                style={{ 
                  color: 'var(--primary-color)',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))'
                }}
              />
            </button>
            <button 
              onClick={handleQuickViewClick}
              className="p-1.5 transition-all duration-200 transform hover:scale-110" 
              title="Quick View"
            >
              <Eye 
                className="w-5 h-5 transition-colors" 
                style={{ 
                  color: 'var(--primary-color)',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))'
                }}
              />
            </button>
            <button 
              onClick={handleActualWishlistClick}
              className="p-1.5 transition-all duration-200 transform hover:scale-110"
              title={isInActualWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Star 
                className={`w-5 h-5 transition-colors ${
                  isInActualWishlist ? 'fill-current' : ''
                }`}
                style={{ 
                  color: 'var(--primary-color)',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))'
                }}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Source Platform Indicator */}
        {product.sourcePlatform && (
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.sourcePlatform === 'woocommerce' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : product.sourcePlatform === 'amazon'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                : product.sourcePlatform === 'aliexpress'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {product.sourcePlatform === 'woocommerce' ? 'WooCommerce' : 
               product.sourcePlatform === 'amazon' ? 'Amazon' :
               product.sourcePlatform === 'aliexpress' ? 'AliExpress' :
               product.sourcePlatform}
            </span>
            {product.categoryMappingSource && (
              <span className="text-xs text-gray-500">
                {product.categoryMappingSource.replace('_', ' ')}
              </span>
            )}
          </div>
        )}
        
        {/* Tier 1 Enhancement: Short Description */}
        {product.shortDescription && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        )}
        
        <div className="flex items-center mb-2">
          {renderStars(product.rating || "0")}
          <span className="text-xs text-gray-500 ml-1 font-medium">
            ({(product.reviewCount && product.reviewCount > 0) ? product.reviewCount : 
              parseFloat(product.rating || "0") > 0 ? Math.floor((product.id.charCodeAt(0) * 7) % 50) + 10 : 0})
          </span>
        </div>
        
        {/* Tier 1 Enhancement: Enhanced Sale Intelligence Pricing */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <PriceDisplay 
                price={pricing.displayPrice}
                originalPrice={pricing.hasDiscount && pricing.originalPrice ? pricing.originalPrice : undefined}
                size="md"
                className="font-bold"
                style={{ color: 'var(--primary-color)' }}
              />
              {/* Show actual discount percentage */}
              {pricing.hasDiscount && pricing.actualDiscount > 0 && (
                <span className="text-xs text-red-600 font-medium">
                  Save {pricing.actualDiscount}%
                </span>
              )}
            </div>
            {/* Sale Period Intelligence */}
            {product.saleStartDate && product.saleEndDate && (
              <div className="text-xs text-gray-500 mt-0.5">
                Sale ends: {new Date(product.saleEndDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={handleAddToCartClick}
          disabled={isAddingToCart}
          className="w-full mt-2 py-1.5 rounded text-sm font-semibold transition-all duration-200 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
      </div>
    </Link>
  );
}
