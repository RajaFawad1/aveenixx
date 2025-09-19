import { useState, useEffect } from "react";
import { ShoppingCart, Scale, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import MobileMenu from "./MobileMenu";
import CartDropdown from "../cart/CartDropdown";
import LoginModal from "../auth/LoginModal";
import { useAuth } from "../providers/AuthProvider";
import SimpleSearch from "../SimpleSearch";
import { useCart } from "@/contexts/CartContext";

interface MainNavbarProps {
  showSearch?: boolean;
  showEcommerceActions?: boolean;
  subtitle?: string;
}

export default function MainNavbar({ showSearch = true, showEcommerceActions = true, subtitle = "Express" }: MainNavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user, isLoggedIn } = useAuth();
  const { getTotalPrice, getTotalItems } = useCart();
  const [, navigate] = useLocation();

  // Load counts from localStorage
  useEffect(() => {
    const updateCounts = () => {
      // Compare count
      const savedCompareList = localStorage.getItem('compareList');
      if (savedCompareList) {
        const compareList = JSON.parse(savedCompareList);
        setCompareCount(compareList.length);
      } else {
        setCompareCount(0);
      }

      // Favourites count (stored as 'favorites')
      const savedFavouritesList = localStorage.getItem('favorites');
      if (savedFavouritesList) {
        const favouritesList = JSON.parse(savedFavouritesList);
        setFavouritesCount(favouritesList.length);
      } else {
        setFavouritesCount(0);
      }

      // Wishlist count
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist);
        setWishlistCount(wishlist.length);
      } else {
        setWishlistCount(0);
      }

    };

    updateCounts();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCounts);
    
    // Listen for custom events
    window.addEventListener('compareUpdated', updateCounts);
    window.addEventListener('favouritesUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);
    window.addEventListener('updateHeaderCounts', updateCounts);
    
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('compareUpdated', updateCounts);
      window.removeEventListener('favouritesUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
      window.removeEventListener('updateHeaderCounts', updateCounts);
    };
  }, []);

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="mx-auto flex justify-between items-center max-w-[1500px] px-4">
          <div className="flex items-center">
            <MobileMenu />
            <Link href="/" className="flex items-center ml-2 lg:ml-0 hover:opacity-80 transition-opacity cursor-pointer">
              <span className="bg-red-500 text-white px-3 py-2 rounded mr-3 text-xl lg:text-2xl font-bold">A</span>
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">AVEENIX</span>
                <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 -mt-1 self-end">{subtitle}</span>
              </div>
            </Link>
          </div>
          {showSearch && (
            <SimpleSearch 
              placeholder="Search products..."
              className="hidden md:flex flex-grow mx-4 max-w-2xl"
            />
          )}
          {showEcommerceActions ? (
            <div className="flex space-x-4 md:space-x-6 items-center text-gray-900 dark:text-white">
              <Link href="/compare" className="hidden md:flex transition-colors items-center hover-color-text text-sm font-normal relative">
                <Scale className="w-4 h-4 mr-2" />
                <span>Compare</span>
                {compareCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {compareCount}
                  </span>
                )}
              </Link>
              <Link href="/favourites" className="hidden md:flex transition-colors items-center hover-color-text text-sm font-normal relative">
                <i className="fas fa-heart mr-2 text-sm"></i>
                <span>Favourites</span>
                {favouritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {favouritesCount}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" className="hidden md:flex transition-colors items-center hover-color-text text-sm font-normal relative">
                <i className="far fa-star mr-2 text-sm"></i>
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/account");
                  } else {
                    setIsLoginOpen(true);
                  }
                }}
                className="transition-colors flex items-center hover-color-text text-sm font-normal"
              >
                {isLoggedIn ? (
                  <>
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-4 h-4 mr-2 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 mr-2" />
                    )}
                    <span className="hidden md:block">Hi, {user?.name}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden md:block">Login</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="transition-colors flex items-center hover-color-text text-sm font-normal ml-2 relative"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[10px]">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <span className="hidden md:block">Cart</span>
                <span className="ml-1 text-sm font-semibold hidden lg:inline">${getTotalPrice().toFixed(2)}</span>
              </button>
            </div>
          ) : (
            <div className="w-60"></div>
          )}
        </div>
      </div>

      {/* Cart Dropdown */}
      <CartDropdown 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}