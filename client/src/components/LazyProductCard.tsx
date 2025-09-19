import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductCard = lazy(() => import('@/components/ProductCard'));

interface LazyProductCardProps {
  product: any;
  index?: number;
  viewMode?: 'grid' | 'list';
  onQuickView?: (productId: string) => void;
}

export default function LazyProductCard({ product, index, viewMode, onQuickView }: LazyProductCardProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      }
    >
      <ProductCard 
        product={product} 
        onQuickView={onQuickView}
      />
    </Suspense>
  );
}