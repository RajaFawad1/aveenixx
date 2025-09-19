import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  Shield,
  Database,
  Mail,
  Store
} from 'lucide-react';

export default function AdminSidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'User Management', href: '/admin/users' },
    { icon: Store, label: 'Vendors', href: '/admin/vendors' },
    { icon: ShoppingCart, label: 'E-commerce', href: '/admin/ecommerce' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Shield, label: 'Security', href: '/admin/security' },
    { icon: Database, label: 'Database', href: '/admin/database' },
    { icon: Mail, label: 'Email Settings', href: '/admin/email' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 h-screen">
      <nav className="mt-6">
        <div className="px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}