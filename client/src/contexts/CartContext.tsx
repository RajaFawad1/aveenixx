import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  brand?: string;
  productType?: string; // For affiliate/dropship vs regular products
  affiliateUrl?: string; // For external redirect links
  sourcePlatform?: string; // For platform display (Amazon, AliExpress, etc.)
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart starts empty - items are loaded from API
const initialCartItems: CartItem[] = [];

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart items from API on mount - simplified for performance
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          
          // Simple, fast transformation - no complex async operations
          const cartItems = data.map((item: any) => ({
            id: item.id.toString(),
            name: item.name || 'Unknown Product',
            price: parseFloat(item.price || '0'),
            quantity: item.quantity || 1,
            image: item.image || '',
            sku: item.sku,
            brand: item.brand,
            productType: item.productType || 'regular',
            affiliateUrl: item.affiliateUrl || null,
            sourcePlatform: item.sourcePlatform || 'aveenix'
          }));
          
          setCartItems(cartItems);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        // Fall back to local storage if API fails
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Save to localStorage whenever cart changes (backup)
  useEffect(() => {
    if (!isLoading && cartItems.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const addToCart = async (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    // Immediate local update for instant UI response
    updateLocalCart(product, quantity);
    
    try {
      // Add to cart via API
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id, 
          quantity 
        })
      });

      if (response.ok) {
        // Refetch cart to get enriched data with affiliate metadata
        const cartResponse = await fetch('/api/cart');
        if (cartResponse.ok) {
          const data = await cartResponse.json();
          const cartItems = data.map((item: any) => ({
            id: item.id.toString(),
            name: item.name || 'Unknown Product',
            price: parseFloat(item.price || '0'),
            quantity: item.quantity || 1,
            image: item.image || '',
            sku: item.sku,
            brand: item.brand,
            productType: item.productType || 'regular',
            affiliateUrl: item.affiliateUrl || null,
            sourcePlatform: item.sourcePlatform || 'aveenix'
          }));
          setCartItems(cartItems);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateLocalCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Item already exists, update quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // New item, add to cart - ensure price is a number
        return [...prevItems, { 
          ...product, 
          quantity,
          price: typeof product.price === 'number' ? product.price : parseFloat(product.price.toString() || '0')
        }];
      }
    });
  };

  const removeFromCart = async (id: string) => {
    // Immediate local update for instant UI response
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    try {
      // Remove from cart via API
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refetch cart to ensure consistency
        const cartResponse = await fetch('/api/cart');
        if (cartResponse.ok) {
          const data = await cartResponse.json();
          const cartItems = data.map((item: any) => ({
            id: item.id.toString(),
            name: item.name || 'Unknown Product',
            price: parseFloat(item.price || '0'),
            quantity: item.quantity || 1,
            image: item.image || '',
            sku: item.sku,
            brand: item.brand,
            productType: item.productType || 'regular',
            affiliateUrl: item.affiliateUrl || null,
            sourcePlatform: item.sourcePlatform || 'aveenix'
          }));
          setCartItems(cartItems);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id);
      return;
    }
    
    // Immediate local update for instant UI response
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    try {
      // Background API call - no need to wait for response
      fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      }).catch(error => {
        console.error('Background cart sync failed:', error);
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}