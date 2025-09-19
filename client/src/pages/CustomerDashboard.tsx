import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, User, MapPin, CreditCard, Heart, Bell, LogOut, Award, Package, Star, Plus, Edit2, Trash2, Home, Building, Truck } from "lucide-react";
import MyOrders from "@/pages/MyOrders";
import Addresses from "@/pages/Addresses";
import Wishlist from "@/pages/Wishlist";
import Notifications from "@/pages/Notifications";
import RewardsAndTasks from "@/components/RewardsAndTasks";
import CustomerLayout from "@/components/customer/CustomerLayout";
import TrackOrder from "@/pages/TrackOrder";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function CustomerDashboard() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);

  // Determine active section from URL path
  const path = location || "/account";
  const section = (() => {
    if (path.startsWith("/account/orders")) return "orders";
    if (path.startsWith("/account/track-orders")) return "track-orders";
    if (path.startsWith("/account/addresses")) return "addresses";
    if (path.startsWith("/account/wishlist")) return "wishlist";
    if (path.startsWith("/account/rewards")) return "rewards";
    if (path.startsWith("/account/notifications")) return "notifications";
    if (path.startsWith("/account/payments")) return "payments";
    return "overview";
  })();

  // Fetch user data and statistics
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/my-account/order-tracking'],
    queryFn: async () => {
      const response = await fetch('/api/my-account/order-tracking');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    },
  });

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: [`/api/user/${user?.id}/addresses`],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/user/${user?.id}/addresses`);
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      return response.json();
    },
  });

  // Load wishlist count from localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistCount(savedWishlist.length);
    
    const handleWishlistUpdate = () => {
      const updatedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(updatedWishlist.length);
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  // Calculate statistics
  const totalOrders = orders.length;
  const openOrders = orders.filter((order: any) => 
    ['pending', 'processing', 'shipped', 'in_transit'].includes(order.status)
  ).length;
  const completedOrders = orders.filter((order: any) => 
    ['delivered', 'confirmed'].includes(order.status)
  ).length;

  // Fetch rewards data
  const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
    queryKey: ['/api/rewards/me'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/rewards/me');
        if (!response.ok) {
          throw new Error('Failed to fetch rewards');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching rewards:', error);
        return { available: 0, confirmed: 0, redeemed: 0 };
      }
    },
  });

  const NavButton = ({
    active,
    onClick,
    icon: Icon,
    label,
  }: { active: boolean; onClick: () => void; icon: any; label: string }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  const renderContent = () => {
    switch (section) {
      case "orders":
        return (
          <div className="space-y-6">
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</div>
                  <p className="text-xs text-gray-500">All time orders</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Open Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{openOrders}</div>
                  <p className="text-xs text-gray-500">In progress</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Wishlist Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{wishlistCount}</div>
                  <p className="text-xs text-gray-500">Saved items</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Addresses
                  </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold text-green-600">{addresses.length}</div>
                  <p className="text-xs text-gray-500">Saved addresses</p>
                  </CardContent>
                </Card>
            </div>

            {/* Orders List */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
                  <CardTitle className="text-lg">My Orders</CardTitle>
                  </div>
                  <Badge variant="outline">{totalOrders} orders</Badge>
                </div>
                <CardDescription>View and track all your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <MyOrders />
              </CardContent>
            </Card>
          </div>
        );
      case "addresses":
        return <Addresses />;
      case "wishlist":
        return <div className="max-w-none"><Wishlist /></div>;
      case "rewards":
        return <RewardsAndTasks />;
      case "track-orders":
        return <TrackOrder />;
      case "notifications":
        return <Notifications />;
      case "payments":
        return (
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 dark:text-gray-300">Coming soon.</div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Enhanced Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</div>
                  <p className="text-xs text-gray-500">All time orders</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Wishlist Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{wishlistCount}</div>
                  <p className="text-xs text-gray-500">Saved items</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{addresses.length}</div>
                  <p className="text-xs text-gray-500">Saved addresses</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Rewards
                  </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">Active</div>
                  <p className="text-xs text-gray-500">Earn & redeem</p>
                </CardContent>
              </Card>
             </div>

             {/* Rewards Tracking Section */}
             <Card className="border border-gray-200 dark:border-gray-700">
               <CardHeader className="pb-2">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center">
                     <Award className="h-5 w-5 mr-2 text-yellow-600" />
                     <CardTitle className="text-lg">Rewards Tracking</CardTitle>
                   </div>
                   <Button variant="outline" size="sm" onClick={() => setLocation('/account/rewards')}>
                     Manage Rewards
                   </Button>
                 </div>
                 <CardDescription>Track your earned rewards and redemption history</CardDescription>
               </CardHeader>
               <CardContent>
                 {rewardsLoading ? (
                   <div className="flex items-center justify-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                         ${((rewardsData?.available || 0) / 100).toFixed(2)}
                       </div>
                       <div className="text-sm text-yellow-600 dark:text-yellow-400">Available Balance</div>
                     </div>
                     <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                         ${((rewardsData?.confirmed || 0) / 100).toFixed(2)}
                       </div>
                       <div className="text-sm text-green-600 dark:text-green-400">Total Earned</div>
                     </div>
                     <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                       <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                         ${((rewardsData?.redeemed || 0) / 100).toFixed(2)}
                       </div>
                       <div className="text-sm text-blue-600 dark:text-blue-400">Total Redeemed</div>
                     </div>
                   </div>
                 )}
               </CardContent>
             </Card>

             {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => setLocation('/account/orders')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">View Orders</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{totalOrders} orders total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => setLocation('/account/wishlist')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">My Wishlist</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{wishlistCount} saved items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => setLocation('/account/addresses')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Manage Addresses</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{addresses.length} saved addresses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => setLocation('/account/rewards')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Rewards & Tasks</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Earn and redeem rewards</p>
                    </div>
                  </div>
                  </CardContent>
                </Card>
            </div>

            {/* Recent Orders Preview */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setLocation('/account/orders')}>
                    View All
                  </Button>
                </div>
                <CardDescription>Your recent orders and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <MyOrders />
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <CustomerLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
          <User className="h-6 w-6 mr-3 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Account</h1>
        </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name || 'Customer'}!
          </div>
        </div>
        

        {renderContent()}
      </div>
    </CustomerLayout>
  );
}


