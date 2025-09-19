import { useState, useEffect } from "react";
import { X, Menu, ChevronDown, ChevronRight, Globe, Languages, DollarSign, Moon, Palette, Store, MapPin, Package, ShoppingBag, UserCircle, LogOut, Headphones, User, Bell } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "../providers/ThemeProvider";
import { useAuth } from "../providers/AuthProvider";
import { useLocalization } from "../providers/LocalizationProvider";
import { featuredProducts, bestSellerProducts, hotProducts, flashSaleProducts } from "@/lib/products";
import { legalPolicies } from "@/lib/policies";
import StoreLocatorModal from "../services/StoreLocatorModal";
import CustomerSupportModal from "../services/CustomerSupportModal";

export default function MobileMenu() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const { selectedCountry, selectedLanguage, selectedCurrency, setSelectedCountry, setSelectedLanguage, setSelectedCurrency, countries, languages, currencies } = useLocalization();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [isCustomerSupportOpen, setIsCustomerSupportOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  const openMenu = () => {
    setIsOpen(true);
    document.body.classList.add('menu-open');
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeMenu = () => {
    setIsAnimating(false);
    document.body.classList.remove('menu-open');
    setTimeout(() => setIsOpen(false), 300);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);





  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={openMenu}
        className="lg:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-60 z-[90] transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMenu}
            style={{ touchAction: 'none' }}
          />
          
          {/* Menu Panel */}
          <div className={`fixed left-0 top-0 h-full w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col z-[100] transform transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ touchAction: 'pan-y' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center">
                <span className="bg-red-500 text-white px-2 py-1 rounded mr-2 font-bold text-xl">A</span>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">AVEENIX</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 self-end">Express</span>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-2 pb-20">
                {/* Product Sections */}
                <div className="space-y-2">
                  {/* Best Sellers */}
                  <div>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-1.5 text-white mb-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-sm">🏆 Best Sellers</h4>
                        <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-medium">Popular</div>
                      </div>
                      <p className="text-xs opacity-90">Top-rated customer favorites!</p>
                    </div>
                    <div className="space-y-1">
                      {bestSellerProducts.slice(0, 5).map((product, index) => (
                        <a key={product.id} href="#" className="flex items-center space-x-2 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-7 h-7 object-cover rounded-md bg-gray-200 dark:bg-gray-600"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h5>
                            <p className="text-xs font-semibold theme-color">
                              ${product.price}
                            </p>
                          </div>
                          <span className="text-xs font-medium theme-color">#{index + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Featured Products */}
                  <div>
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-1.5 text-white mb-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-sm">⭐ Featured Products</h4>
                        <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-medium">Curated</div>
                      </div>
                      <p className="text-xs opacity-90">Hand-picked by our experts!</p>
                    </div>
                    <div className="space-y-1">
                      {featuredProducts.slice(0, 5).map((product) => (
                        <a key={product.id} href="#" className="flex items-center space-x-2 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-7 h-7 object-cover rounded-md bg-gray-200 dark:bg-gray-600"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h5>
                            <p className="text-xs font-semibold theme-color">
                              ${product.price}
                            </p>
                          </div>
                          <span className="text-xs font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded">NEW</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Hot Products */}
                  <div>
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-1.5 text-white mb-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-sm">🔥 Hot Products</h4>
                        <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-medium animate-pulse">Trending</div>
                      </div>
                      <p className="text-xs opacity-90">Most popular items right now!</p>
                    </div>
                    <div className="space-y-1">
                      {hotProducts.slice(0, 5).map((product) => (
                        <a key={product.id} href="#" className="flex items-center space-x-2 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-7 h-7 object-cover rounded-md bg-gray-200 dark:bg-gray-600"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h5>
                            <p className="text-xs font-semibold theme-color">
                              ${product.price}
                            </p>
                          </div>
                          <span className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-medium">HOT</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Flash Sale */}
                  <div>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-1.5 text-white mb-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-sm">⚡ Flash Sale</h4>
                        <div className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">
                          23:45:12
                        </div>
                      </div>
                      <p className="text-xs opacity-90">Limited time offers - Don't miss out!</p>
                    </div>
                    <div className="space-y-1">
                      {flashSaleProducts.slice(0, 5).map((product) => (
                        <a key={product.id} href="#" className="flex items-center space-x-2 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-7 h-7 object-cover rounded-md bg-gray-200 dark:bg-gray-600"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h5>
                            <div className="flex items-center space-x-1">
                              <p className="text-xs font-semibold theme-color">
                                ${product.price}
                              </p>
                              <span className="text-xs text-gray-500 line-through">
                                ${(parseFloat(product.price) * 1.5).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-medium">-33%</span>
                        </a>
                      ))}
                    </div>
                  </div>








              </div>
            </div>
          </div>

          </div>
        </div>
      )}
      
      {/* Services Modals */}
      <StoreLocatorModal 
        isOpen={isStoreLocatorOpen} 
        onClose={() => setIsStoreLocatorOpen(false)} 
      />
      <CustomerSupportModal 
        isOpen={isCustomerSupportOpen} 
        onClose={() => setIsCustomerSupportOpen(false)} 
      />
    </>
  );
}