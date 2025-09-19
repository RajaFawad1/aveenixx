import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productCategory?: string;
  productRating?: number;
  productReviewCount?: number;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export default function WishlistButton({
  productId,
  productName,
  productPrice,
  productImage,
  productCategory = 'General',
  productRating = 0,
  productReviewCount = 0,
  className = '',
  variant = 'ghost',
  size = 'icon',
  showText = false
}: WishlistButtonProps) {
  const { 
    isInWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    isLoading 
  } = useWishlist();
  
  const [isAnimating, setIsAnimating] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleToggleWishlist = async () => {
    if (isLoading) return;

    setIsAnimating(true);
    
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          category: productCategory,
          rating: productRating,
          reviewCount: productReviewCount,
          inStock: true,
          dateAdded: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} transition-all duration-200 ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}
      onClick={handleToggleWishlist}
      disabled={isLoading}
    >
      <Heart
        className={`w-4 h-4 transition-colors duration-200 ${showText ? 'mr-2' : ''}`}
        style={{ 
          color: inWishlist ? 'var(--primary-color)' : '#9ca3af',
          fill: inWishlist ? 'var(--primary-color)' : 'none'
        }}
      />
      {showText && (
        <span className="text-sm">
          {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}