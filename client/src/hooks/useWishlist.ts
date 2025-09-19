import { useState, useEffect } from 'react';
// import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  discount?: number;
  dateAdded: string;
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('aveenix-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aveenix-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = async (item: WishlistItem) => {
    setIsLoading(true);
    
    try {
      // Check if item already exists
      const existingItem = wishlistItems.find(wishlistItem => wishlistItem.id === item.id);
      
      if (existingItem) {
        console.log('Item already in wishlist');
        return;
      }

      // Add item to wishlist
      setWishlistItems(prev => [...prev, item]);
      
      console.log(`Added ${item.name} to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    setIsLoading(true);
    
    try {
      const itemToRemove = wishlistItems.find(item => item.id === itemId);
      
      if (!itemToRemove) {
        console.log('Item not found in wishlist');
        return;
      }

      // Remove item from wishlist
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      
      console.log(`Removed ${itemToRemove.name} from wishlist`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (itemId: string): boolean => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const clearWishlist = async () => {
    setIsLoading(true);
    
    try {
      setWishlistItems([]);
      
      console.log('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWishlistCount = (): number => {
    return wishlistItems.length;
  };

  const getWishlistTotal = (): number => {
    return wishlistItems.reduce((total, item) => total + item.price, 0);
  };

  const moveToCart = async (itemId: string) => {
    setIsLoading(true);
    
    try {
      const item = wishlistItems.find(wishlistItem => wishlistItem.id === itemId);
      
      if (!item) {
        console.log('Item not found in wishlist');
        return;
      }

      // Remove from wishlist
      setWishlistItems(prev => prev.filter(wishlistItem => wishlistItem.id !== itemId));
      
      // Add to cart (this would typically call a cart service)
      // For now, we'll just show a success message
      console.log(`Moved ${item.name} to cart`);
    } catch (error) {
      console.error('Error moving to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    getWishlistTotal,
    moveToCart
  };
}