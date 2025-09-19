import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { 
  ShoppingBag,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Grid3X3
} from "lucide-react";
import { getIconByName } from '@/utils/iconMapping';
import { decodeHtmlEntities } from '@/lib/utils';

interface SubNavbarProps {
  showProductCategories?: boolean;
  customContent?: React.ReactNode;
  isCategoriesOpen?: boolean;
  setIsCategoriesOpen?: (open: boolean) => void;
}

export default function SubNavbar({ showProductCategories = true, customContent, isCategoriesOpen = false, setIsCategoriesOpen = () => {} }: SubNavbarProps) {
  const [location] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Hide "All Categories" button when on categories page
  const isOnCategoriesPage = location.startsWith('/categories');
  
  // State for tracking hovered category for subcategory display
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);

  // Fetch real categories with subcategories from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories/master'],
    queryFn: async () => {
      const response = await fetch('/api/categories/master');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const checkOverflow = () => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
    const overflow = scrollWidth > clientWidth;
    setHasOverflow(overflow);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  const scrollToDirection = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    checkOverflow();
    const handleResize = () => checkOverflow();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const handleScroll = () => checkOverflow();
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="hidden md:block py-3 relative" style={{ backgroundColor: 'var(--primary-color)' }}>
      <div className={`mx-auto flex items-center text-sm font-medium overflow-visible text-black max-w-[1500px] px-4 min-h-[2rem] ${customContent ? 'justify-start' : 'justify-between'}`}>
        {customContent ? (
          customContent
        ) : showProductCategories && (
          <>
            {/* Left side - Categories Menu - Hidden on categories page */}
            {!isOnCategoriesPage && (
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center justify-between hover:text-white transition-all duration-300 whitespace-nowrap px-4 py-1.5 transform hover:scale-105 rounded w-56"
                >
                  <div className="flex items-center">
                    <Menu className="w-4 h-4 mr-2" />
                    <span className="text-sm">All Categories</span>
                  </div>
                  {isCategoriesOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Categories Dropdown */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full shadow-2xl rounded-xl border-2 z-50 animate-slide-in dropdown-enhanced overflow-hidden" style={{ borderColor: 'var(--primary-color)' }}>
                    <div className="bg-white dark:bg-gray-800">
                      <div className="px-4 py-3 text-xs font-semibold text-white uppercase tracking-wide border-b flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Grid3X3 className="w-3 h-3 mr-2" />
                        Browse Categories
                      </div>
                      <div className="pb-2">
                        {categoriesLoading ? (
                          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            Loading categories...
                          </div>
                        ) : (
                          categories.slice(0, 10).map((category: any, index: number) => {
                            const IconComponent = getIconByName(category.icon);
                            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                            
                            // Debug: Log category data to check subcategories
                            if (index === 0) {
                              console.log('Sample category data:', category);
                              console.log('Has subcategories:', hasSubcategories);
                              console.log('Subcategories array:', category.subcategories);
                            }
                            
                            return (
                              <div key={category.id} className="relative">
                                <Link
                                  href={`/categories?category=${category.id}`}
                                  className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 animate-stagger-in opacity-0"
                                  style={{
                                    '--hover-bg': 'var(--primary-color)',
                                    animationDelay: `${index * 50}ms`,
                                    animationFillMode: 'forwards'
                                  } as React.CSSProperties}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                    if (hasSubcategories) {
                                      console.log('Setting hovered category:', category.id, category.name);
                                      setHoveredCategoryId(category.id);
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    // Don't immediately hide - let the popup handle it
                                  }}
                                >
                                  <div className="flex items-center">
                                    <IconComponent className="w-4 h-4 mr-3" />
                                    <span>{decodeHtmlEntities(category.name)}</span>
                                  </div>
                                  {hasSubcategories && (
                                    <ChevronRight className="w-3 h-3 ml-2 opacity-60" />
                                  )}
                                </Link>
                                
                                {/* Subcategories Popup */}
                                {hasSubcategories && hoveredCategoryId === category.id && (
                                  <div
                                    className="absolute left-full top-0 ml-1 w-64 bg-white dark:bg-gray-800 border-2 rounded-lg shadow-xl animate-slide-in"
                                    style={{ 
                                      borderColor: 'var(--primary-color)',
                                      zIndex: 9999,
                                      position: 'fixed' // Try fixed positioning
                                    }}
                                    onMouseEnter={() => {
                                      console.log('Mouse entered subcategory popup');
                                      setHoveredCategoryId(category.id);
                                    }}
                                    onMouseLeave={() => {
                                      console.log('Mouse left subcategory popup');
                                      setHoveredCategoryId(null);
                                    }}
                                  >
                                    <div className="px-3 py-2 text-xs font-semibold text-white uppercase tracking-wide border-b" style={{ backgroundColor: 'var(--primary-color)' }}>
                                      {category.name} Categories
                                    </div>
                                    <div className="max-h-80 overflow-y-auto py-1">
                                      {category.subcategories.slice(0, 12).map((subcategory: any, subIndex: number) => {
                                        const SubIconComponent = getIconByName(subcategory.icon);
                                        return (
                                          <Link
                                            key={subcategory.id}
                                            href={`/categories?subcategory=${subcategory.id}`}
                                            className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-white transition-all duration-200"
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                          >
                                            <SubIconComponent className="w-3 h-3 mr-2 flex-shrink-0" />
                                            <span className="text-xs flex-grow">{decodeHtmlEntities(subcategory.name)}</span>
                                            {subcategory.productCount > 0 && (
                                              <span className="text-xs text-gray-400 ml-auto">({subcategory.productCount})</span>
                                            )}
                                          </Link>
                                        );
                                      })}
                                      {category.subcategories.length > 12 && (
                                        <div className="px-3 py-2 text-xs text-gray-500 border-t">
                                          +{category.subcategories.length - 12} more categories
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                        <div className="border-t mt-2 -mx-2">
                          <a
                            href="/categories"
                            className="block py-3 text-sm font-medium text-gray-900 dark:text-white hover:text-white transition-all duration-300 animate-stagger-in opacity-0"
                            style={{
                              animationDelay: '500ms',
                              animationFillMode: 'forwards',
                              paddingLeft: '1.5rem',
                              paddingRight: '1.5rem'
                            } as React.CSSProperties}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '';
                            }}
                          >
                            View All Categories →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Left Scroll Button */}
            {hasOverflow && canScrollLeft && (
              <button
                onClick={() => scrollToDirection('left')}
                className="flex-shrink-0 p-1 hover:bg-black/10 rounded-full transition-all duration-200 mr-2"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Center - Main Categories removed as requested; keep Shop link only */}
            <div 
              ref={scrollRef}
              className="flex space-x-2 md:space-x-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory flex-1 px-2 md:px-0 select-none cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <Link href="/shop" className="flex items-center hover:text-white transition-all duration-300 whitespace-nowrap px-2 py-1.5 transform hover:scale-105 snap-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 mr-1.5" /> 
                <span className="text-sm">Shop</span>
              </Link>
            </div>

            {/* Right Scroll Button */}
            {hasOverflow && canScrollRight && (
              <button
                onClick={() => scrollToDirection('right')}
                className="flex-shrink-0 p-1 hover:bg-black/10 rounded-full transition-all duration-200 ml-2"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

          </>
        )}
      </div>
    </div>
  );
}
