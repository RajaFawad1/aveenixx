import { Home, Search, Package, User, ShoppingBag, Grid3X3 } from "lucide-react";
import { useState } from "react";
import LoginModal from "../auth/LoginModal";
import OrdersModal from "../orders/OrdersModal";
import SearchModal from "../search/SearchModal";
import CategoriesModal from "../categories/CategoriesModal";
import { useAuth } from "../providers/AuthProvider";
import { useLocation } from "wouter";

export default function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();

  const handleAccountClick = () => {
    // Close mobile menu if open
    const mobileMenuOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (mobileMenuOverlay) {
      (mobileMenuOverlay as HTMLElement).click();
    }
    
    if (isLoggedIn) {
      setActiveTab('account');
      setLocation('/account');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleOrdersClick = () => {
    // Close mobile menu if open
    const mobileMenuOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (mobileMenuOverlay) {
      (mobileMenuOverlay as HTMLElement).click();
    }
    
    if (isLoggedIn) {
      setActiveTab('orders');
      setLocation('/account');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleHomeClick = () => {
    setActiveTab('home');
    // Close any open modals
    setIsLoginOpen(false);
    setIsOrdersOpen(false);
    setIsSearchOpen(false);
    setIsCategoriesOpen(false);
    // Close mobile menu if open by clicking the overlay
    const mobileMenuOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (mobileMenuOverlay) {
      (mobileMenuOverlay as HTMLElement).click();
    }
    // Navigate to home page
    setLocation('/');
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    // Close mobile menu if open
    const mobileMenuOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (mobileMenuOverlay) {
      (mobileMenuOverlay as HTMLElement).click();
    }
    
    setActiveTab('categories');
    setIsCategoriesOpen(true);
  };

  const handleSearchClick = () => {
    // Close mobile menu if open
    const mobileMenuOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (mobileMenuOverlay) {
      (mobileMenuOverlay as HTMLElement).click();
    }
    
    setActiveTab('search');
    setIsSearchOpen(true);
  };

  const handleShopClick = () => {
    // Close mobile menu if open
    const mobileMenuOverlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (mobileMenuOverlay) {
      (mobileMenuOverlay as HTMLElement).click();
    }
    
    setActiveTab('shop');
    setLocation('/shop');
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/', onClick: handleHomeClick },
    { id: 'categories', icon: Grid3X3, label: 'Categories', href: '/categories', onClick: handleCategoriesClick },
    { id: 'search', icon: Search, label: 'Search', href: '/search', onClick: handleSearchClick },
    { id: 'shop', icon: ShoppingBag, label: 'Shop', href: '/shop', onClick: handleShopClick },
    { id: 'account', icon: User, label: 'Account', href: '/account', onClick: handleAccountClick }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[110] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Top gradient line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary-color to-transparent opacity-50" 
           style={{ background: `linear-gradient(90deg, transparent, var(--primary-color), transparent)` }} />
      
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 min-w-[60px] active:scale-95 ${
                isActive 
                  ? 'text-primary-color bg-gray-50 dark:bg-gray-700' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              style={isActive ? { color: 'var(--primary-color)' } : {}}
            >
              <div className="relative">
                <IconComponent className={`w-5 h-5 transition-all duration-200 ${isActive ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 transition-all duration-200 ${isActive ? 'font-medium' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Bottom safe area for newer phones */}
      <div className="h-safe-bottom bg-white dark:bg-gray-800" />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      
      {/* Orders Modal */}
      <OrdersModal 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
      />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      {/* Categories Modal */}
      <CategoriesModal 
        isOpen={isCategoriesOpen} 
        onClose={() => setIsCategoriesOpen(false)} 
      />
    </div>
  );
}