import { useState } from "react";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye, 
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VendorLayout from "@/components/vendor/VendorLayout";

export default function VendorOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const orders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      products: [
        { name: "Wireless Headphones", quantity: 1, price: 89.99 }
      ],
      total: 89.99,
      status: "Delivered",
      date: "2025-01-13",
      shippingAddress: "123 Main St, New York, NY 10001"
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      products: [
        { name: "Smart Watch", quantity: 1, price: 199.99 },
        { name: "Charging Cable", quantity: 1, price: 19.99 }
      ],
      total: 219.98,
      status: "Processing",
      date: "2025-01-13",
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90210"
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      email: "mike@example.com",
      products: [
        { name: "Bluetooth Speaker", quantity: 2, price: 45.99 }
      ],
      total: 91.98,
      status: "Shipped",
      date: "2025-01-12",
      shippingAddress: "789 Pine Rd, Chicago, IL 60601"
    },
    {
      id: "#ORD-004",
      customer: "Sarah Wilson",
      email: "sarah@example.com",
      products: [
        { name: "Wireless Charging Pad", quantity: 1, price: 29.99 }
      ],
      total: 29.99,
      status: "Pending",
      date: "2025-01-12",
      shippingAddress: "321 Elm St, Miami, FL 33101"
    },
    {
      id: "#ORD-005",
      customer: "David Brown",
      email: "david@example.com",
      products: [
        { name: "USB-C Hub", quantity: 1, price: 59.99 }
      ],
      total: 59.99,
      status: "Cancelled",
      date: "2025-01-11",
      shippingAddress: "654 Maple Dr, Seattle, WA 98101"
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Shipped":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "Processing":
        return <Package className="w-4 h-4 text-yellow-600" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "Cancelled":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <VendorLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your customer orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Orders
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,284</div>
            <p className="text-xs text-green-600 font-medium">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending
            </CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
            <p className="text-xs text-orange-600 font-medium">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Processing
            </CardTitle>
            <Package className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">15</div>
            <p className="text-xs text-yellow-600 font-medium">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Shipped
            </CardTitle>
            <Truck className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">23</div>
            <p className="text-xs text-blue-600 font-medium">In transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Delivered
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,238</div>
            <p className="text-xs text-green-600 font-medium">96% completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle>Recent Orders</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer} • {order.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {product.name} × {product.quantity}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Order Date:</span> {new Date(order.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Button>
                    {order.status === "Pending" && (
                      <Button size="sm" className="flex items-center space-x-1">
                        <Package className="w-4 h-4" />
                        <span>Process</span>
                      </Button>
                    )}
                    {order.status === "Processing" && (
                      <Button size="sm" className="flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>Ship</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </VendorLayout>
  );
}