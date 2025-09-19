import { useState, useEffect } from "react";
import { ShoppingCart, Bell, GitCompare, X, Heart } from "lucide-react";
import { useLocation } from "wouter";
import MobileMenu from "./MobileMenu";
import CartDropdown from "../cart/CartDropdown";

import MobileBottomNav from "./MobileBottomNav";
import { useAuth } from "../providers/AuthProvider";

interface MobileOptimizedNavbarProps {
  subtitle?: string;
}

export default function MobileOptimizedNavbar({ subtitle = "Express" }: MobileOptimizedNavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [notificationCount] = useState(3);
  const [compareCount] = useState(2);
  const [cartItemCount] = useState(20);
  const [wishlistCount] = useState(5);
  const { user, isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();
  
  // Mock notifications
  const notifications = [
    { id: 1, title: "Order Shipped", message: "Your iPhone 15 Pro Max has shipped!", time: "2 min ago", type: "order" },
    { id: 2, title: "Flash Sale", message: "50% off Samsung Galaxy S24 - Limited time!", time: "1 hour ago", type: "sale" },
    { id: 3, title: "Back in Stock", message: "MacBook Pro M3 is available again", time: "3 hours ago", type: "stock" }
  ];
  

  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
      
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown') && !target.closest('.notification-trigger')) {
        setIsNotificationOpen(false);
      }

    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-800 px-4 py-4">
        <div className="mx-auto flex justify-between items-center max-w-full">
          <div className="flex items-center">
            <MobileMenu />
            <div 
              className="flex items-center ml-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setLocation('/')}
            >
              <span className="bg-red-500 text-white px-3 py-2 rounded mr-3 text-xl font-bold">A</span>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">AVEENIX</span>
                <div className="flex items-center space-x-2 -mt-1 self-end">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimized right side - Key actions only */}
          <div className="flex items-center space-x-3">
            {/* Notification icon with dropdown */}
            <div className="relative">
              <Bell 
                className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary-color transition-colors notification-trigger" 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              />
              {notificationCount > 0 && (
                <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {notificationCount}
                </span>
              )}
            </div>

            {/* Compare Products icon - Navigate to Compare page */}
            <div className="relative cursor-pointer" onClick={() => setLocation('/compare')}>
              <GitCompare 
                className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-primary-color transition-colors" 
              />
              {compareCount > 0 && (
                <span className="absolute -top-3 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {compareCount}
                </span>
              )}
            </div>

            {/* Wishlist Icon - Navigate to Wishlist page */}
            <div className="relative cursor-pointer" onClick={() => setLocation('/wishlist')}>
              <Heart 
                className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-primary-color transition-colors"
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-3 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* Cart Icon with item count - Click to open cart popup */}
            <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart 
                className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-primary-color transition-colors"
              />
              {cartItemCount > 0 && (
                <span className="absolute -top-3 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </div>
          </div>
        </div>


      </div>

      {/* Notification Dropdown */}
      {isNotificationOpen && (
        <div className="fixed top-[76px] right-4 z-[100] w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg notification-dropdown">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'order' ? 'bg-green-500' :
                    notification.type === 'sale' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-600">
            <button 
              onClick={() => {
                setLocation('/notifications');
                setIsNotificationOpen(false);
              }}
              className="w-full text-center text-sm text-primary-color hover:underline" 
              style={{ color: 'var(--primary-color)' }}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}

      {/* Mobile-optimized Cart Dropdown */}
      <CartDropdown 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  );
}