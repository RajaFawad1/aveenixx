import MobileOptimizedNavbar from "@/components/layout/MobileOptimizedNavbar";
import StickyHeaderFull from "@/components/layout/StickyHeaderFull";
import StickyHeaderGeneric from "@/components/layout/StickyHeaderGeneric";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface MainEcommerceLayoutProps {
  children: React.ReactNode;
  layoutType?: 'full' | 'generic';
  showSearch?: boolean;
  showEcommerceActions?: boolean;
  showProductCategories?: boolean;
  subtitle?: string;
  customSubNavContent?: React.ReactNode;
}

export default function MainEcommerceLayout({ 
  children, 
  layoutType = 'full',
  showSearch = true, 
  showEcommerceActions = true, 
  showProductCategories = true,
  subtitle = "Express",
  customSubNavContent
}: MainEcommerceLayoutProps) {
  const isMobile = useIsMobile();
  const [isActualMobile, setIsActualMobile] = useState(false);
  const isFull = layoutType === 'full';

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
        <MobileOptimizedNavbar subtitle={subtitle} />
      ) : (
        <>
          {isFull ? (
            <StickyHeaderFull 
              showSearch={showSearch}
              showEcommerceActions={showEcommerceActions}
              showProductCategories={showProductCategories}
              subtitle={subtitle}
              customSubNavContent={customSubNavContent}
            />
          ) : (
            <StickyHeaderGeneric />
          )}
        </>
      )}
      
      {/* Main Content Area - full layout: 175px (all sections), generic layout: 80px (HeaderUtility only) */}
      <main className={`bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden ${
        isActualMobile 
          ? 'pt-[86px]' 
          : isFull 
            ? 'pt-[175px]' 
            : 'pt-[80px]'
      }`}>
        <div className={`mx-auto px-3 md:px-4 max-w-full md:max-w-[1500px] ${isActualMobile ? 'pb-3 py-3' : 'py-6'}`}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}