import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { getVendorProducts } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import VendorLayout from "@/components/vendor/VendorLayout";
import ProductGallerySidebar from "@/components/vendor/ProductGallerySidebar";

export default function VendorProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('date-desc');

  useEffect(() => {
    getVendorProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(product => product.approvalStatus === filters.status);
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'date-desc':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'date-asc':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters, sort]);

  const sidebarProps = (
    <ProductGallerySidebar
      onFilterChange={setFilters}
      onViewChange={setView}
      onSortChange={setSort}
      currentFilters={filters}
      currentView={view}
      currentSort={sort}
    />
  );

  return (
    <VendorLayout 
      showProductGallerySidebar={true}
      productGallerySidebarProps={sidebarProps}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Product Gallery
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse and manage your product inventory
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
          </div>
        </div>

        {/* Product Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {products.length === 0 
                ? "No products uploaded yet." 
                : "No products match your current filters."
              }
            </p>
          </div>
        ) : (
          <div className={
            view === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className={view === 'list' ? 'flex items-center space-x-4 p-4 border rounded-lg' : 'relative'}>
                {view === 'grid' ? (
                  <>
                    <ProductCard product={product} />
                    {/* Approval Status Badge */}
                    <div className="absolute top-2 right-2">
                      {product.approvalStatus === 'approved' && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      )}
                      {product.approvalStatus === 'pending' && (
                        <Badge variant="secondary" className="bg-yellow-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {product.approvalStatus === 'rejected' && (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  // List view
                  <>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">${product.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {product.approvalStatus === 'approved' && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      )}
                      {product.approvalStatus === 'pending' && (
                        <Badge variant="secondary" className="bg-yellow-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {product.approvalStatus === 'rejected' && (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
}