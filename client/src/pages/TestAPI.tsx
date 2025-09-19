import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  brand: string;
  imageUrl: string;
  rating: string;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  discountPercentage: number;
}

export default function TestAPI() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@aveenix.com');
  const [password, setPassword] = useState('admin123');
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        setCurrentUser(data.user);
        setToken(data.token);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.firstName}!`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken('');
    setProducts([]);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products?limit=10');
      if (response.ok) {
        const data: Product[] = await response.json();
        setProducts(data);
        toast({
          title: "Products Loaded",
          description: `Fetched ${data.length} products successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login first to create products",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newProduct = {
        name: "Test Product",
        description: "This is a test product created via API",
        price: "99.99",
        originalPrice: "129.99",
        category: "Electronics",
        brand: "Test Brand",
        imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=500&h=500&fit=crop",
        rating: "4.5",
        reviewCount: 100,
        isNew: true,
        isBestseller: false,
        isOnSale: true,
        discountPercentage: 23
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Product Created",
          description: "Test product created successfully",
        });
        fetchProducts(); // Refresh products list
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to create product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Create product error:', error);
      toast({
        title: "Error",
        description: "An error occurred while creating product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testCart = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login first to test cart functionality",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Add item to cart
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: "prod_1",
          quantity: 2
        }),
      });

      if (response.ok) {
        toast({
          title: "Cart Test Successful",
          description: "Item added to cart successfully",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Cart Test Failed",
          description: errorData.error || "Failed to add item to cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Cart test error:', error);
      toast({
        title: "Error",
        description: "An error occurred during cart test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testOrderCalculation = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/orders/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            { productId: "prod_1", quantity: 1, price: "349.99" },
            { productId: "prod_2", quantity: 1, price: "1199.99" }
          ],
          shippingAddress: { country: "USA", state: "CA" },
          couponCode: "SAVE10"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Order Calculation Successful",
          description: `Total: $${data.total}, Shipping: $${data.shipping}, Tax: $${data.tax}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Order Calculation Failed",
          description: errorData.error || "Failed to calculate order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Order calculation error:', error);
      toast({
        title: "Error",
        description: "An error occurred during order calculation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testCouponCode = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/orders/apply-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: "SAVE20",
          subtotal: "100.00"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Coupon Applied Successfully",
          description: `Discount: $${data.discount}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Coupon Application Failed",
          description: errorData.error || "Failed to apply coupon",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Coupon test error:', error);
      toast({
        title: "Error",
        description: "An error occurred during coupon test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Orders Fetched Successfully",
          description: `Found ${data.length} orders`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to Fetch Orders",
          description: errorData.error || "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorAnalytics = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/vendors', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Vendor Analytics Fetched",
          description: `Total vendors: ${data.totalVendors}, Active: ${data.activeVendors}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to Fetch Vendor Analytics",
          description: errorData.error || "Failed to fetch vendor analytics",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Vendor analytics error:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching vendor analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testInventoryManagement = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/inventory/report', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Inventory Report Fetched",
          description: `Total products: ${data.totalProducts}, Low stock: ${data.lowStockItems}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to Fetch Inventory Report",
          description: errorData.error || "Failed to fetch inventory report",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Inventory management error:', error);
      toast({
        title: "Error",
        description: "An error occurred while testing inventory management",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesAnalytics = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/sales', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Sales Analytics Fetched",
          description: `Total revenue: $${data.totalRevenue}, Orders: ${data.totalOrders}`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to Fetch Sales Analytics",
          description: errorData.error || "Failed to fetch sales analytics",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sales analytics error:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching sales analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Testing Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Test the complete e-commerce backend functionality</p>
      </div>

      {currentUser ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {currentUser.firstName} {currentUser.lastName}</CardTitle>
            <CardDescription>
              <Badge variant="secondary">{currentUser.role}</Badge>
              <span className="ml-2">{currentUser.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Test the authentication system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Test accounts:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Admin: admin@aveenix.com / admin123</li>
                <li>Vendor: vendor@aveenix.com / vendor123</li>
                <li>Customer: customer@aveenix.com / customer123</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="cart">Cart</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Test product CRUD operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={fetchProducts} disabled={loading}>
                  {loading ? 'Loading...' : 'Fetch Products'}
                </Button>
                {currentUser?.role === 'admin' || currentUser?.role === 'vendor' ? (
                  <Button onClick={createProduct} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Test Product'}
                  </Button>
                ) : null}
              </div>

              {products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{product.brand}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">${product.price}</span>
                            {product.isOnSale && (
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {product.isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                            {product.isBestseller && <Badge variant="default" className="text-xs">Best Seller</Badge>}
                            {product.isOnSale && <Badge variant="destructive" className="text-xs">Sale</Badge>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-sm">⭐ {product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cart Testing</CardTitle>
              <CardDescription>Test cart functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testCart} disabled={loading || !currentUser}>
                {loading ? 'Testing...' : 'Test Add to Cart'}
              </Button>
              {!currentUser && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Please login to test cart functionality
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Test order functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <Button 
                  onClick={() => testOrderCalculation()} 
                  disabled={loading || !currentUser}
                  variant="outline"
                >
                  Test Order Calculation
                </Button>
                <Button 
                  onClick={() => testCouponCode()} 
                  disabled={loading || !currentUser}
                  variant="outline"
                >
                  Test Coupon Code
                </Button>
                <Button 
                  onClick={() => fetchUserOrders()} 
                  disabled={loading || !currentUser}
                  variant="outline"
                >
                  Fetch My Orders
                </Button>
              </div>
              {!currentUser && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please login to test order functionality
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
              <CardDescription>Test vendor functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <Button 
                  onClick={() => fetchVendorAnalytics()} 
                  disabled={loading || !currentUser || currentUser.role !== 'admin'}
                  variant="outline"
                >
                  Fetch Vendor Analytics
                </Button>
                <Button 
                  onClick={() => testInventoryManagement()} 
                  disabled={loading || !currentUser || !['admin', 'vendor'].includes(currentUser.role)}
                  variant="outline"
                >
                  Test Inventory Management
                </Button>
                <Button 
                  onClick={() => fetchSalesAnalytics()} 
                  disabled={loading || !currentUser || !['admin', 'vendor'].includes(currentUser.role)}
                  variant="outline"
                >
                  Fetch Sales Analytics
                </Button>
              </div>
              {!currentUser && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please login to test vendor functionality
                </p>
              )}
              {currentUser && !['admin', 'vendor'].includes(currentUser.role) && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admin or vendor role required for these features
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}