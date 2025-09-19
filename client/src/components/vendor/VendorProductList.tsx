import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Edit, Trash2, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getVendorProducts } from '@/lib/api';

export default function VendorProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const vendorProducts = await getVendorProducts();
        setProducts(vendorProducts);
      } catch (error) {
        console.error('Error fetching vendor products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-8 h-8" />
            My Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your product inventory
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                    <th className="p-4 font-semibold text-gray-900 dark:text-white">Product</th>
                    <th className="p-4 font-semibold text-gray-900 dark:text-white">Price</th>
                    <th className="p-4 font-semibold text-gray-900 dark:text-white">Stock</th>
                    <th className="p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-4 text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900 dark:text-white font-semibold">${product.price}</td>
                      <td className="p-4 text-gray-900 dark:text-white">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 20 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : product.stock > 10 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && products.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No products found. Add your first product to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}