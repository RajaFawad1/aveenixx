import { mockProducts, recentProducts, recentlyViewedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";

// Reusable section header component
const SectionHeader = ({ title, viewAllLink = "#" }: { title: string; viewAllLink?: string }) => (
  <div className="flex justify-between items-center mb-6">
    <div className="relative">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-3">{title}</h2>
      <div className="absolute bottom-0 left-0 w-full h-1 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
    </div>
    <a href={viewAllLink} className="hover-color-text text-sm font-medium">View All →</a>
  </div>
);

// Reusable product grid component
const ProductSection = ({ 
  title, 
  products, 
  isMobile, 
  itemCount = 5,
  viewAllLink = "#"
}: { 
  title: string; 
  products: any[]; 
  isMobile: boolean; 
  itemCount?: number; 
  viewAllLink?: string;
}) => (
  <section>
    <SectionHeader title={title} viewAllLink={viewAllLink} />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
      {products.slice(0, isMobile ? 4 : itemCount).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

export default function ProductGrid() {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 md:space-y-8">
      <ProductSection title="Laptops" products={recentProducts} isMobile={isMobile} viewAllLink="/categories/electronics" />
      <ProductSection title="Clothing" products={mockProducts} isMobile={isMobile} viewAllLink="/categories/clothing" />
      <ProductSection title="Recommended" products={mockProducts} isMobile={isMobile} viewAllLink="/categories/all" />
      <ProductSection title="Recently Viewed" products={recentlyViewedProducts} isMobile={isMobile} viewAllLink="/categories/all" />
    </div>
  );
}
