interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <SkeletonLoader className="w-full h-48" />
      </div>
      <div className="p-3">
        <SkeletonLoader className="h-4 w-3/4 mb-2" />
        <SkeletonLoader className="h-3 w-1/2 mb-2" />
        <div className="flex items-center justify-between mb-2">
          <SkeletonLoader className="h-5 w-20" />
          <SkeletonLoader className="h-3 w-16" />
        </div>
        <SkeletonLoader className="h-8 w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Categories skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <SkeletonLoader className="h-6 w-32 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader key={index} className="h-4 w-full" />
          ))}
        </div>
      </div>
      
      {/* Products skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <SkeletonLoader className="h-6 w-24 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <SkeletonLoader className="w-16 h-16 rounded" />
              <div className="flex-1">
                <SkeletonLoader className="h-4 w-full mb-1" />
                <SkeletonLoader className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}