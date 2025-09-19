import MobileOptimizedNavbar from "@/components/layout/MobileOptimizedNavbar";
import HeaderUtility from "@/components/layout/HeaderUtility";
import MainNavbar from "@/components/layout/MainNavbar";
import SubNavbar from "@/components/layout/SubNavbar";
import Footer from "@/components/layout/Footer";

import ProductCard from "@/components/ProductCard";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";
import AdvertisingTiles from "@/components/home/AdvertisingTiles";
import TrustBadges from "@/components/home/TrustBadges";
import QuickViewModal from "@/components/QuickViewModal";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Zap, Shirt, Home, Star, TrendingUp, Sparkles, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Reusable section header component
const SectionHeader = ({ title, icon: Icon, viewAllLink = "#" }: { title: string; icon: any; viewAllLink?: string }) => (
  <div className="flex justify-between items-center mb-6">
    <div className="relative flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-1">{title}</h2>
        <div className="w-16 h-1 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
      </div>
    </div>
    <a href={viewAllLink} className="hover-color-text text-sm font-medium">View All →</a>
  </div>
);

// Category-based product section component
const CategoryProductSection = ({ 
  title, 
  icon, 
  categorySlug, 
  isMobile, 
  viewAllLink,
  wishlistProducts,
  compareProducts,
  notificationProducts,
  actualWishlistProducts,
  onToggleWishlist,
  onToggleCompare,
  onToggleNotification,
  onToggleActualWishlist,
  onQuickView
}: { 
  title: string; 
  icon: any; 
  categorySlug: string; 
  isMobile: boolean; 
  viewAllLink: string;
  wishlistProducts: string[];
  compareProducts: string[];
  notificationProducts: string[];
  actualWishlistProducts: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onToggleNotification: (productId: string) => void;
  onToggleActualWishlist: (productId: string) => void;
  onQuickView: (productId: string) => void;
}) => {
  // Fetch products for specific category
  const { data: categoryProducts = [], isLoading } = useQuery({
    queryKey: [`/api/products/category/${categorySlug}`],
    queryFn: async () => {
      const response = await fetch(`/api/products?category=${categorySlug}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch category products');
      return response.json();
    },
  });

  return (
    <section>
      <SectionHeader title={title} icon={icon} viewAllLink={viewAllLink} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {categoryProducts.slice(0, isMobile ? 4 : 6).map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product}
              wishlistProducts={wishlistProducts}
              compareProducts={compareProducts}
              notificationProducts={notificationProducts}
              actualWishlistProducts={actualWishlistProducts}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onToggleNotification={onToggleNotification}
              onToggleActualWishlist={onToggleActualWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Special product section component (Best Sellers, Trending, etc.)
const ProductSection = ({ 
  title, 
  icon, 
  queryParams, 
  isMobile, 
  viewAllLink,
  wishlistProducts,
  compareProducts,
  notificationProducts,
  actualWishlistProducts,
  onToggleWishlist,
  onToggleCompare,
  onToggleNotification,
  onToggleActualWishlist,
  onQuickView
}: { 
  title: string; 
  icon: any; 
  queryParams: string; 
  isMobile: boolean; 
  viewAllLink: string;
  wishlistProducts: string[];
  compareProducts: string[];
  notificationProducts: string[];
  actualWishlistProducts: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onToggleNotification: (productId: string) => void;
  onToggleActualWishlist: (productId: string) => void;
  onQuickView: (productId: string) => void;
}) => {
  // Fetch products based on query parameters
  const { data: sectionProducts = [], isLoading } = useQuery({
    queryKey: [`/api/products/special/${queryParams}`],
    queryFn: async () => {
      const response = await fetch(`/api/products?${queryParams}&limit=10`);
      if (!response.ok) throw new Error(`Failed to fetch ${title} products`);
      return response.json();
    },
  });

  return (
    <section>
      <SectionHeader title={title} icon={icon} viewAllLink={viewAllLink} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {sectionProducts.slice(0, isMobile ? 4 : 6).map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product}
              wishlistProducts={wishlistProducts}
              compareProducts={compareProducts}
              notificationProducts={notificationProducts}
              actualWishlistProducts={actualWishlistProducts}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onToggleNotification={onToggleNotification}
              onToggleActualWishlist={onToggleActualWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Trending Products Section using dedicated API
const TrendingProductsSection = ({ 
  title, 
  icon, 
  isMobile, 
  viewAllLink,
  wishlistProducts,
  compareProducts,
  notificationProducts,
  actualWishlistProducts,
  onToggleWishlist,
  onToggleCompare,
  onToggleNotification,
  onToggleActualWishlist,
  onQuickView
}: { 
  title: string; 
  icon: any; 
  isMobile: boolean; 
  viewAllLink: string;
  wishlistProducts: string[];
  compareProducts: string[];
  notificationProducts: string[];
  actualWishlistProducts: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onToggleNotification: (productId: string) => void;
  onToggleActualWishlist: (productId: string) => void;
  onQuickView: (productId: string) => void;
}) => {
  const { data: trendingProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products/trending'],
    queryFn: async () => {
      const response = await fetch('/api/products/trending');
      if (!response.ok) throw new Error('Failed to fetch trending products');
      return response.json();
    },
  });

  return (
    <section>
      <SectionHeader title={title} icon={icon} viewAllLink={viewAllLink} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {trendingProducts.slice(0, isMobile ? 4 : 6).map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product}
              wishlistProducts={wishlistProducts}
              compareProducts={compareProducts}
              notificationProducts={notificationProducts}
              actualWishlistProducts={actualWishlistProducts}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onToggleNotification={onToggleNotification}
              onToggleActualWishlist={onToggleActualWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// New Arrivals Section using dedicated API
const NewArrivalsSection = ({ 
  title, 
  icon, 
  isMobile, 
  viewAllLink,
  wishlistProducts,
  compareProducts,
  notificationProducts,
  actualWishlistProducts,
  onToggleWishlist,
  onToggleCompare,
  onToggleNotification,
  onToggleActualWishlist,
  onQuickView
}: { 
  title: string; 
  icon: any; 
  isMobile: boolean; 
  viewAllLink: string;
  wishlistProducts: string[];
  compareProducts: string[];
  notificationProducts: string[];
  actualWishlistProducts: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onToggleNotification: (productId: string) => void;
  onToggleActualWishlist: (productId: string) => void;
  onQuickView: (productId: string) => void;
}) => {
  const { data: newArrivals = [], isLoading } = useQuery({
    queryKey: ['/api/products/new-arrivals'],
    queryFn: async () => {
      const response = await fetch('/api/products/new-arrivals');
      if (!response.ok) throw new Error('Failed to fetch new arrivals');
      return response.json();
    },
  });

  return (
    <section>
      <SectionHeader title={title} icon={icon} viewAllLink={viewAllLink} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {newArrivals.slice(0, isMobile ? 4 : 6).map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product}
              wishlistProducts={wishlistProducts}
              compareProducts={compareProducts}
              notificationProducts={notificationProducts}
              actualWishlistProducts={actualWishlistProducts}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onToggleNotification={onToggleNotification}
              onToggleActualWishlist={onToggleActualWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Recently Viewed Section with real browsing history
const RecentlyViewedSection = ({ 
  title, 
  icon, 
  isMobile, 
  viewAllLink,
  wishlistProducts,
  compareProducts,
  notificationProducts,
  actualWishlistProducts,
  onToggleWishlist,
  onToggleCompare,
  onToggleNotification,
  onToggleActualWishlist,
  onQuickView
}: { 
  title: string; 
  icon: any; 
  isMobile: boolean; 
  viewAllLink: string;
  wishlistProducts: string[];
  compareProducts: string[];
  notificationProducts: string[];
  actualWishlistProducts: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onToggleNotification: (productId: string) => void;
  onToggleActualWishlist: (productId: string) => void;
  onQuickView: (productId: string) => void;
}) => {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  
  // Get recently viewed product IDs from localStorage
  useEffect(() => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewedIds(recentlyViewed.slice(0, 10)); // Limit to last 10 viewed products
  }, []);

  // Fetch products for recently viewed IDs
  const { data: recentlyViewedProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products/recently-viewed', recentlyViewedIds],
    queryFn: async () => {
      if (recentlyViewedIds.length === 0) return [];
      
      // Fetch products by IDs
      const promises = recentlyViewedIds.map(async (id) => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (response.ok) {
            return await response.json();
          }
          return null;
        } catch {
          return null;
        }
      });
      
      const products = await Promise.all(promises);
      return products.filter(product => product !== null);
    },
    enabled: recentlyViewedIds.length > 0,
  });

  // Don't show section if no recently viewed products
  if (recentlyViewedIds.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader title={title} icon={icon} viewAllLink={viewAllLink} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {[...Array(Math.min(recentlyViewedIds.length, 6))].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {recentlyViewedProducts.slice(0, isMobile ? 4 : 6).map((product: any) => (
            <ProductCard 
              key={product.id} 
              product={product}
              wishlistProducts={wishlistProducts}
              compareProducts={compareProducts}
              notificationProducts={notificationProducts}
              actualWishlistProducts={actualWishlistProducts}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onToggleNotification={onToggleNotification}
              onToggleActualWishlist={onToggleActualWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default function HomePage() {
  const isMobile = useIsMobile();
  const [isActualMobile, setIsActualMobile] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { toast } = useToast();
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // State management for ProductCard icons
  const [wishlistProducts, setWishlistProducts] = useState<string[]>([]);
  const [compareProducts, setCompareProducts] = useState<string[]>([]);
  const [notificationProducts, setNotificationProducts] = useState<string[]>([]);
  const [actualWishlistProducts, setActualWishlistProducts] = useState<string[]>([]);

  // Handler functions for ProductCard interactions
  const toggleWishlist = (productId: string) => {
    const newWishlistProducts = wishlistProducts.includes(productId) 
      ? wishlistProducts.filter(id => id !== productId)
      : [...wishlistProducts, productId];
    
    setWishlistProducts(newWishlistProducts);
    // Update localStorage so navbar can read the correct count
    localStorage.setItem('favorites', JSON.stringify(newWishlistProducts));
    // Dispatch custom event for navbar count update
    window.dispatchEvent(new CustomEvent('favouritesUpdated'));
  };

  const toggleCompare = (productId: string) => {
    const isCurrentlyInCompare = compareProducts.includes(productId);
    const newCompareProducts = isCurrentlyInCompare 
      ? compareProducts.filter(id => id !== productId)
      : [...compareProducts, productId];
    
    setCompareProducts(newCompareProducts);
    // Update localStorage so navbar can read the correct count
    localStorage.setItem('compareList', JSON.stringify(newCompareProducts));
    // Dispatch custom event for navbar count update
    window.dispatchEvent(new CustomEvent('compareUpdated'));
    
    // Show toast feedback
    const message = isCurrentlyInCompare 
      ? "Product removed from compare list" 
      : "Product added to compare list";
    
    toast({ description: message });
  };

  const toggleNotification = (productId: string) => {
    const isCurrentlyEnabled = notificationProducts.includes(productId);
    const newNotificationProducts = isCurrentlyEnabled 
      ? notificationProducts.filter(id => id !== productId)
      : [...notificationProducts, productId];
    
    setNotificationProducts(newNotificationProducts);
    // Update localStorage so navbar can read the correct count
    localStorage.setItem('priceNotifications', JSON.stringify(newNotificationProducts));
    // Dispatch custom event for navbar count update
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    
    // Show toast feedback
    toast({
      description: isCurrentlyEnabled 
        ? "Price notifications disabled" 
        : "You'll be notified about price changes",
    });
  };

  const toggleActualWishlist = (productId: string) => {
    const newActualWishlistProducts = actualWishlistProducts.includes(productId) 
      ? actualWishlistProducts.filter(id => id !== productId)
      : [...actualWishlistProducts, productId];
    
    setActualWishlistProducts(newActualWishlistProducts);
    // Update localStorage so navbar can read the correct count
    localStorage.setItem('wishlist', JSON.stringify(newActualWishlistProducts));
    // Dispatch custom event for navbar count update
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  const handleQuickView = (productId: string) => {
    const product = recentProducts.find((p: any) => p.id === productId) ||
                   categories.find((cat: any) => 
                     cat.products?.some((p: any) => p.id === productId)
                   )?.products?.find((p: any) => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Fetch real products from API for Recently Added section
  const { data: recentProducts = [], isLoading: isLoadingRecent } = useQuery({
    queryKey: ['/api/products/recently-added'],
    queryFn: async () => {
      const response = await fetch('/api/products/recently-added');
      if (!response.ok) throw new Error('Failed to fetch recently added products');
      return response.json();
    },
  });

  // Fetch real categories from API
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsActualMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile or Desktop Navigation */}
      {isActualMobile ? (
        <MobileOptimizedNavbar />
      ) : (
        <>
          <div className="sticky top-0 z-40 bg-white dark:bg-gray-900">
            <HeaderUtility />
            <MainNavbar />
            <SubNavbar 
              isCategoriesOpen={isCategoriesOpen} 
              setIsCategoriesOpen={setIsCategoriesOpen} 
            />
          </div>
        </>
      )}
      
      <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
        {/* Main Content */}
        <div className={`mx-auto px-3 md:px-4 py-3 md:py-6 max-w-full md:max-w-1500 ${isActualMobile ? 'pt-[86px] pb-20' : ''}`}>
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
            <main className="flex-1 space-y-5 md:space-y-6 w-full lg:w-auto">
              <HeroBannerCarousel isCategoriesOpen={isCategoriesOpen} />
              
              <div className="-mt-4 md:-mt-6">
                <AdvertisingTiles />
              </div>
              
              <TrustBadges />
              
              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>
              
              {/* Recently Added Section */}
              <section>
                <SectionHeader title="Recently Added" icon={Zap} viewAllLink="/shop" />
                {isLoadingRecent ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                    {recentProducts.slice(0, isMobile ? 4 : 6).map((product: any) => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        wishlistProducts={wishlistProducts}
                        compareProducts={compareProducts}
                        notificationProducts={notificationProducts}
                        actualWishlistProducts={actualWishlistProducts}
                        onToggleWishlist={toggleWishlist}
                        onToggleCompare={toggleCompare}
                        onToggleNotification={toggleNotification}
                        onToggleActualWishlist={toggleActualWishlist}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              {/* Best Sellers Section */}
              <ProductSection 
                title="⭐ Best Sellers"
                icon={Star}
                queryParams="isBestseller=true&sortBy=salesCount&sortOrder=desc"
                isMobile={isMobile}
                viewAllLink="/shop?filter=bestsellers"
                wishlistProducts={wishlistProducts}
                compareProducts={compareProducts}
                notificationProducts={notificationProducts}
                actualWishlistProducts={actualWishlistProducts}
                onToggleWishlist={toggleWishlist}
                onToggleCompare={toggleCompare}
                onToggleNotification={toggleNotification}
                onToggleActualWishlist={toggleActualWishlist}
                onQuickView={handleQuickView}
              />

              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              {/* Trending Now Section */}
              <TrendingProductsSection 
                title="🔥 Trending Now"
                icon={TrendingUp}
                isMobile={isMobile}
                viewAllLink="/shop?filter=trending"
                wishlistProducts={wishlistProducts}
                compareProducts={compareProducts}
                notificationProducts={notificationProducts}
                actualWishlistProducts={actualWishlistProducts}
                onToggleWishlist={toggleWishlist}
                onToggleCompare={toggleCompare}
                onToggleNotification={toggleNotification}
                onToggleActualWishlist={toggleActualWishlist}
                onQuickView={handleQuickView}
              />

              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              {/* Category-Based Product Sections */}
              <CategoryProductSection 
                title="Electronics & Technology"
                icon={Zap}
                categorySlug="electronics-technology"
                isMobile={isMobile}
                viewAllLink="/category/electronics-technology"
                wishlistProducts={wishlistProducts}
                compareProducts={compareProducts}
                notificationProducts={notificationProducts}
                actualWishlistProducts={actualWishlistProducts}
                onToggleWishlist={toggleWishlist}
                onToggleCompare={toggleCompare}
                onToggleNotification={toggleNotification}
                onToggleActualWishlist={toggleActualWishlist}
                onQuickView={handleQuickView}
              />
              
              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              <CategoryProductSection 
                title="Fashion & Apparel"
                icon={Shirt}
                categorySlug="fashion-apparel"
                isMobile={isMobile}
                viewAllLink="/category/fashion-apparel"
                wishlistProducts={wishlistProducts}
                compareProducts={compareProducts}
                notificationProducts={notificationProducts}
                actualWishlistProducts={actualWishlistProducts}
                onToggleWishlist={toggleWishlist}
                onToggleCompare={toggleCompare}
                onToggleNotification={toggleNotification}
                onToggleActualWishlist={toggleActualWishlist}
                onQuickView={handleQuickView}
              />
              
              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              <CategoryProductSection 
                title="Home & Garden"
                icon={Home}
                categorySlug="home-garden"
                isMobile={isMobile}
                viewAllLink="/category/home-garden"
                wishlistProducts={wishlistProducts}
                compareProducts={compareProducts}
                notificationProducts={notificationProducts}
                actualWishlistProducts={actualWishlistProducts}
                onToggleWishlist={toggleWishlist}
                onToggleCompare={toggleCompare}
                onToggleNotification={toggleNotification}
                onToggleActualWishlist={toggleActualWishlist}
                onQuickView={handleQuickView}
              />

              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              {/* New Arrivals Section */}
              <NewArrivalsSection 
                title="✨ New Arrivals"
                icon={Sparkles}
                isMobile={isMobile}
                viewAllLink="/shop?filter=new-arrivals"
                wishlistProducts={wishlistProducts}
                compareProducts={compareProducts}
                notificationProducts={notificationProducts}
                actualWishlistProducts={actualWishlistProducts}
                onToggleWishlist={toggleWishlist}
                onToggleCompare={toggleCompare}
                onToggleNotification={toggleNotification}
                onToggleActualWishlist={toggleActualWishlist}
                onQuickView={handleQuickView}
              />

              {/* Section Divider */}
              <div className="flex items-center my-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                <div className="px-4">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              </div>

              {/* Recently Viewed Section */}
              <RecentlyViewedSection 
                title="👀 Recently Viewed"
                icon={Eye}
                isMobile={isMobile}
                viewAllLink="/shop?filter=recently-viewed"
                wishlistProducts={wishlistProducts}
                compareProducts={compareProducts}
                notificationProducts={notificationProducts}
                actualWishlistProducts={actualWishlistProducts}
                onToggleWishlist={toggleWishlist}
                onToggleCompare={toggleCompare}
                onToggleNotification={toggleNotification}
                onToggleActualWishlist={toggleActualWishlist}
                onQuickView={handleQuickView}
              />
            </main>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={closeQuickView}
        />
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}