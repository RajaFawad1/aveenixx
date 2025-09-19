import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-square relative">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        {/* Brand */}
        <Skeleton className="h-3 w-16" />
        
        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Button */}
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}