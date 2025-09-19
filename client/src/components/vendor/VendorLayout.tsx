import MainEcommerceLayout from "@/components/layout/MainEcommerceLayout";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import { useLocation } from "wouter";

interface VendorLayoutProps {
  children: React.ReactNode;
  showProductGallerySidebar?: boolean;
  productGallerySidebarProps?: any;
}

export default function VendorLayout({ 
  children, 
  showProductGallerySidebar = false,
  productGallerySidebarProps 
}: VendorLayoutProps) {
  const [location] = useLocation();
  const isProductGallery = location === '/vendor/products/listing';

  return (
    <MainEcommerceLayout subtitle="Vendor" customSubNavContent={null}>
      <div className="min-h-[70vh] bg-transparent">
        {isProductGallery && showProductGallerySidebar ? (
          // Product Gallery Layout with side menu
          <div className="flex gap-6">
            <div className="lg:sticky lg:top-[180px] h-full">
              <VendorSidebar />
            </div>
            <div className="flex-1 flex gap-6">
              {productGallerySidebarProps && (
                <div className="w-80 flex-shrink-0">
                  {productGallerySidebarProps}
                </div>
              )}
              <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                {children}
              </div>
            </div>
          </div>
        ) : (
          // Default Layout
          <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-6">
            <div className="lg:sticky lg:top-[180px] h-full">
              <VendorSidebar />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              {children}
            </div>
          </div>
        )}
      </div>
    </MainEcommerceLayout>
  );
}


