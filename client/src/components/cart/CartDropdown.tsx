import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart, Heart } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';

// CartItem interface is now imported from context

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setLocation] = useLocation();
  const { cartItems, isLoading, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();

  // Add body scroll lock effects and animation timing
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  // Using cart functions from context

  const moveToWishlist = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      // In a real app, this would save to wishlist
      console.log('Moving to wishlist:', item);
      removeFromCart(id);
    }
  };

  const handleProceedToCheckout = () => {
    onClose();
    setLocation('/cart');
  };

  const handleViewCart = () => {
    onClose();
    setLocation('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
    setLocation('/');
  };

  // Subtotal already calculated above

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-[110] transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />
      
      {/* Cart Dropdown */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md sm:w-80 bg-white dark:bg-gray-800 shadow-2xl z-[120] transform transition-transform duration-300 ease-out flex flex-col ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ touchAction: 'pan-y' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center">
            <span className="bg-red-500 text-white px-2.5 py-1.5 rounded mr-2.5 text-xl font-bold">A</span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">AVEENIX</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 self-end">Cart</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary-color transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0) > 99 ? '99+' : cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">${(typeof subtotal === 'number' ? subtotal : parseFloat(subtotal || '0')).toFixed(2)}</span>
            <button 
              onClick={onClose}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Banner */}
        {cartItems.length > 0 && subtotal < 50 && (
          <div className="mx-3 mt-3 p-2.5 bg-green-600 rounded-lg text-white text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Add ${(50 - (typeof subtotal === 'number' ? subtotal : parseFloat(subtotal || '0'))).toFixed(2)} more for FREE shipping!</span>
              <div className="w-12 bg-white/20 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto pb-4" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start space-x-2.5">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-md bg-gray-200 dark:bg-gray-600 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold theme-color">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || '0').toFixed(2)}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        ${((typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium min-w-[1.5rem] text-center bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs font-medium text-white rounded transition-colors"
                          style={{ backgroundColor: 'var(--primary-color)' }}
                          title="Add to Cart"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => moveToWishlist(item.id)}
                          className="p-1 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded transition-colors"
                          title="Save for later"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <div className="p-3 space-y-2">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span className="font-medium text-gray-900 dark:text-white">${(typeof subtotal === 'number' ? subtotal : parseFloat(subtotal || '0')).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-lg font-bold theme-color">${(typeof subtotal === 'number' ? subtotal : parseFloat(subtotal || '0')).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full py-2.5 text-white rounded-lg font-semibold transition-colors text-sm hover:opacity-90"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Proceed to Checkout
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={handleViewCart}
                  className="flex-1 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  View Cart
                </button>
                <button 
                  onClick={handleContinueShopping}
                  className="flex-1 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 p-2 border-t dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            © 2025 AVEENIX. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}