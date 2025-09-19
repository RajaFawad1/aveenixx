import { Link, useLocation } from "wouter";
import { useAuth } from "@/components/providers/AuthProvider";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Settings,
  FileText,
  Upload,
  Grid3X3
} from "lucide-react";

const sidebarItems = [
  {
    label: "Overview",
    href: "/vendor",
    icon: LayoutDashboard
  },
  {
    label: "Products",
    href: "/vendor/products",
    icon: Package
  },
  {
    label: "Upload Product",
    href: "/vendor/upload",
    icon: Upload
  },
  {
    label: "Product Gallery",
    href: "/vendor/products/listing",
    icon: Grid3X3
  },
  {
    label: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart
  },
  {
    label: "Reports",
    href: "/vendor/reports",
    icon: FileText
  },
  {
    label: "Settings",
    href: "/vendor/settings",
    icon: Settings
  }
];

export default function VendorSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendor Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your store
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
              (item.href !== "/vendor" && location.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <div className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Products</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">47</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Orders Today</span>
            <span className="text-sm font-medium text-green-600">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
            <span className="text-sm font-medium text-blue-600">$2,450</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}