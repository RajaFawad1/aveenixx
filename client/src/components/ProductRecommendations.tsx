import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Product } from "@shared/schema";

interface ProductRecommendationsProps {
  categoryName: string;
  type: 'new-arrivals' | 'best-sellers' | 'customers-also-viewed';
  title: string;
  limit?: number;
}

export function ProductRecommendations({ 
  categoryName, 
  type, 
  title, 
  limit = 6 
}: ProductRecommendationsProps) {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/categories', categoryName, type, { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${encodeURIComponent(categoryName)}/${type}?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }
      return response.json();
    },
    enabled: !!categoryName,
  });

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't show section if no products or error
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}