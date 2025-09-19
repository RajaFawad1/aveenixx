import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Eye,
  Users,
  Clock,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import VendorLayout from "@/components/vendor/VendorLayout";

export default function VendorOverview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,426",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Products",
      value: "47",
      change: "+3",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Total Orders",
      value: "1,284",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-purple-600"
    },
    {
      title: "Store Views",
      value: "3,421",
      change: "+15.3%",
      icon: Eye,
      color: "text-orange-600"
    }
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      product: "Wireless Headphones",
      amount: "$89.99",
      status: "Delivered",
      date: "2 hours ago"
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      product: "Smart Watch",
      amount: "$199.99",
      status: "Processing",
      date: "4 hours ago"
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      product: "Bluetooth Speaker",
      amount: "$45.99",
      status: "Shipped",
      date: "1 day ago"
    }
  ];

  const topProducts = [
    {
      name: "Wireless Headphones",
      sales: 45,
      revenue: "$4,049.55",
      rating: 4.8
    },
    {
      name: "Smart Watch",
      sales: 32,
      revenue: "$6,399.68",
      rating: 4.6
    },
    {
      name: "Bluetooth Speaker",
      sales: 28,
      revenue: "$1,287.72",
      rating: 4.9
    }
  ];

  return (
    <VendorLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 font-medium mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.customer} • {order.product}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Top Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.sales} sales
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {product.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Package className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900 dark:text-blue-100">Add Product</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Create new listing</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-900 dark:text-green-100">View Orders</p>
                <p className="text-sm text-green-600 dark:text-green-400">Manage orders</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <Users className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-purple-900 dark:text-purple-100">Customers</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">View customer data</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
    </VendorLayout>
  );
}