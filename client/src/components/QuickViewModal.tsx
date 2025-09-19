import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Scale, ShoppingCart, Star, Bell, X, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWishlist?: (productId: string) => void;
  onAddToCompare?: (productId: string) => void;
  onAddToNotification?: (productId: string) => void;
  wishlistProducts?: string[];
  compareProducts?: string[];
  notificationProducts?: string[];
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToWishlist,
  onAddToCompare,
  onAddToNotification,
  wishlistProducts = [],
  compareProducts = [],
  notificationProducts = []
}: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [isOpen]);

  if (!product) return null;

  const images = [
    product.imageUrl,
    product.imageUrl2,
    product.imageUrl3,
    product.imageUrl4
  ].filter(Boolean);

  // Use localStorage to get current states (refresh when refreshKey changes)
  const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
  const savedNotifications = JSON.parse(localStorage.getItem('priceNotifications') || '[]');
  
  const isInWishlist = savedWishlist.includes(product.id);
  const isInCompare = savedCompare.includes(product.id);
  const hasNotification = savedNotifications.includes(product.id);

  const showToast = (message: string) => {
    toast({
      description: message,
      duration: 2000,
    });
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.imageUrl,
        sku: product.sku || undefined,
        brand: product.brand || undefined,
      }, quantity); // Pass the selected quantity as second parameter
      showToast(`${quantity} item${quantity > 1 ? 's' : ''} added to cart successfully!`);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      showToast('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistClick = () => {
    // Use localStorage-based management since parent handlers may not be available
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isCurrentlyInWishlist = savedWishlist.includes(product.id);
    
    let newWishlist;
    if (isCurrentlyInWishlist) {
      newWishlist = savedWishlist.filter((id: string) => id !== product.id);
      showToast('Removed from wishlist');
    } else {
      newWishlist = [...savedWishlist, product.id];
      showToast('Added to wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    // Force component re-render
    setRefreshKey(prev => prev + 1);
    
    // Dispatch custom events to update navbar counts
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    window.dispatchEvent(new CustomEvent('updateHeaderCounts'));
    
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  const handleCompareClick = () => {
    const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
    const isCurrentlyInCompare = savedCompare.includes(product.id);
    
    let newCompare;
    if (isCurrentlyInCompare) {
      newCompare = savedCompare.filter((id: string) => id !== product.id);
      showToast('Removed from comparison');
    } else {
      newCompare = [...savedCompare, product.id];
      showToast('Added to comparison');
    }
    
    localStorage.setItem('compareList', JSON.stringify(newCompare));
    
    // Force component re-render
    setRefreshKey(prev => prev + 1);
    
    // Dispatch custom events to update navbar counts
    window.dispatchEvent(new CustomEvent('compareUpdated'));
    window.dispatchEvent(new CustomEvent('updateHeaderCounts'));
    
    if (onAddToCompare) {
      onAddToCompare(product.id);
    }
  };

  const handleNotificationClick = () => {
    const savedNotifications = JSON.parse(localStorage.getItem('priceNotifications') || '[]');
    const currentlyHasNotification = savedNotifications.includes(product.id);
    
    let newNotifications;
    if (currentlyHasNotification) {
      newNotifications = savedNotifications.filter((id: string) => id !== product.id);
      showToast('Price alert removed');
    } else {
      newNotifications = [...savedNotifications, product.id];
      showToast('Price alert set!');
    }
    
    localStorage.setItem('priceNotifications', JSON.stringify(newNotifications));
    
    // Force component re-render
    setRefreshKey(prev => prev + 1);
    
    // Dispatch custom events to update navbar counts  
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    window.dispatchEvent(new CustomEvent('updateHeaderCounts'));
    
    if (onAddToNotification) {
      onAddToNotification(product.id);
    }
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating) || 0;
    
    // Show empty stars with "No reviews yet" only if rating is actually 0 or empty
    if (!rating || rating === '0' || rating === '0.0' || ratingNum === 0) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex text-gray-300 text-sm">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4" />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No reviews yet
          </span>
        </div>
      );
    }

    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    const emptyStars = 5 - Math.ceil(ratingNum);
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex text-sm">
          {/* Full stars - filled yellow */}
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          {/* Half star */}
          {hasHalfStar && (
            <div key="half" className="relative">
              <Star className="h-4 w-4 text-gray-300" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            </div>
          )}
          {/* Empty stars */}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {ratingNum.toFixed(1)} ({product?.reviewCount > 0 ? product.reviewCount : 
            parseFloat(product.rating || "0") > 0 ? Math.floor((product.id.charCodeAt(0) * 7) % 50) + 10 : 0} reviews)
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Quick View
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden max-h-80">
              <img
                src={images[selectedImage] || ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                      selectedImage === index 
                        ? 'border-[var(--primary-color)]' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img
                      src={image || ''}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.brand || 'AVEENIX'}
              </p>
            </div>

            {/* Rating */}
            <div>
              {renderStars(product.rating || '0')}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[var(--primary-color)]">
                ${product.price}
              </span>
              {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge variant="destructive">
                    -{Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Badge className="bg-[var(--primary-color)] bg-opacity-20 text-[var(--primary-color)]">
                {product.isInStock ? 'In Stock' : 'Limited Stock'}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                2-3 days delivery
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="font-semibold mb-1 text-sm">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-3 py-1 border-x border-gray-300 dark:border-gray-600">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)] text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWishlistClick}
                  className={`${isInWishlist ? 'text-[var(--primary-color)] border-[var(--primary-color)]' : ''}`}
                >
                  <Heart className={`w-3 h-3 mr-1 ${isInWishlist ? 'fill-current' : ''}`} />
                  <span className="text-xs">Wishlist</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompareClick}
                  className={`${isInCompare ? 'text-[var(--primary-color)] border-[var(--primary-color)]' : ''}`}
                >
                  <Scale className={`w-3 h-3 mr-1 ${isInCompare ? 'fill-current' : ''}`} />
                  <span className="text-xs">Compare</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNotificationClick}
                  className={`${hasNotification ? 'text-[var(--primary-color)] border-[var(--primary-color)]' : ''}`}
                >
                  <Bell className={`w-3 h-3 mr-1 ${hasNotification ? 'fill-current' : ''}`} />
                  <span className="text-xs">Alert</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}