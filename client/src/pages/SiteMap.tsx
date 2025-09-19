import { Home, Package, Users, Store, MapPin, Search, FileText, Phone, Shield, HelpCircle, CreditCard, Truck, RotateCcw, Gift, Heart, TrendingUp, User, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

interface SiteMapSection {
  title: string;
  icon: any;
  links: {
    name: string;
    path: string;
    description: string;
  }[];
}

export default function SiteMap() {
  const siteMapSections: SiteMapSection[] = [
    {
      title: 'Main Pages',
      icon: Home,
      links: [
        { name: 'Home', path: '/', description: 'Main homepage with featured products' },
        { name: 'Shop', path: '/shop', description: 'Browse all products and categories' },
        { name: 'Categories', path: '/categories', description: 'Product categories and filters' },
        { name: 'Search', path: '/search', description: 'Search products and sellers' },
        { name: 'About Us', path: '/about', description: 'Learn about Aveenix' },
        { name: 'Contact', path: '/contact', description: 'Get in touch with our team' }
      ]
    },
    {
      title: 'Products & Shopping',
      icon: Package,
      links: [
        { name: 'Product Details', path: '/product/[id]', description: 'Individual product pages' },
        { name: 'Shopping Cart', path: '/cart', description: 'Review items before checkout' },
        { name: 'Checkout', path: '/checkout', description: 'Complete your purchase' },
        { name: 'Compare Products', path: '/compare', description: 'Compare multiple products' },
        { name: 'Wishlist', path: '/wishlist', description: 'Save products for later' },
        { name: 'Brands', path: '/brands', description: 'Browse by brand' },
        { name: 'Deals', path: '/deals', description: 'Special offers and discounts' },
        { name: 'Gift Cards', path: '/gift-cards', description: 'Purchase gift cards' }
      ]
    },
    {
      title: 'Account & Orders',
      icon: User,
      links: [
        { name: 'My Account', path: '/account', description: 'Account dashboard' },
        { name: 'My Orders', path: '/my-orders', description: 'View order history and status' },
        { name: 'Track Order', path: '/track-order', description: 'Track your shipments' },
        { name: 'Profile Settings', path: '/account/profile', description: 'Manage your profile' },
        { name: 'Address Book', path: '/account/addresses', description: 'Manage shipping addresses' },
        { name: 'Payment Methods', path: '/account/payments', description: 'Manage payment methods' },
        { name: 'Notifications', path: '/notifications', description: 'View notifications' }
      ]
    },
    {
      title: 'Sellers & Marketplace',
      icon: Store,
      links: [
        { name: 'Our Sellers', path: '/sellers', description: 'Browse marketplace sellers' },
        { name: 'Become a Seller', path: '/seller/register', description: 'Join our marketplace' },
        { name: 'Seller Dashboard', path: '/seller/dashboard', description: 'Seller management tools' },
        { name: 'Store Locator', path: '/store-locator', description: 'Find physical store locations' }
      ]
    },
    {
      title: 'Customer Service',
      icon: HelpCircle,
      links: [
        { name: 'Help Center', path: '/help', description: 'Frequently asked questions' },
        { name: 'Customer Support', path: '/support', description: 'Contact customer service' },
        { name: 'Live Chat', path: '/chat', description: 'Chat with support agents' },
        { name: 'Report an Issue', path: '/report', description: 'Report problems or concerns' }
      ]
    },
    {
      title: 'Legal & Policies',
      icon: Shield,
      links: [
        { name: 'Privacy Policy', path: '/privacy', description: 'How we protect your privacy' },
        { name: 'Terms of Service', path: '/legal', description: 'Terms and conditions' },
        { name: 'Returns Policy', path: '/returns', description: 'Return and refund policy' },
        { name: 'Shipping Policy', path: '/shipping', description: 'Shipping information' },
        { name: 'Security Policy', path: '/security', description: 'Platform security measures' },
        { name: 'Seller Policy', path: '/seller', description: 'Marketplace seller guidelines' }
      ]
    },
    {
      title: 'Company Information',
      icon: FileText,
      links: [
        { name: 'Site Map', path: '/sitemap', description: 'This page - complete site structure' },
        { name: 'Careers', path: '/careers', description: 'Job opportunities' },
        { name: 'Press', path: '/press', description: 'Media and press releases' },
        { name: 'Investors', path: '/investors', description: 'Investor information' },
        { name: 'Sustainability', path: '/sustainability', description: 'Environmental initiatives' }
      ]
    }
  ];

  return (
    <MainEcommerceLayout subtitle="Site Map">
      {/* Hero Section */}
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 15%, transparent) 0%, color-mix(in srgb, var(--primary-color) 8%, transparent) 50%, color-mix(in srgb, var(--primary-color) 12%, transparent) 100%)'
          }}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full backdrop-blur-sm border" style={{
                  backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, white)',
                  borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                }}>
                  <MapPin className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">Site Map</h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Explore our complete website structure and find exactly what you're looking for.
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-bounce delay-500" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full animate-ping delay-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
        </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 text-center">
            <div className="flex justify-center mb-3">
              <Home className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">40+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Pages</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-center mb-3">
              <Package className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Main Categories</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-center mb-3">
              <Store className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Products</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Sellers</div>
          </div>
        </div>

        {/* Site Map Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {siteMapSections.map((section, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-5">
                <div className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <Link key={linkIndex} href={link.path}>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {link.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {link.description}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Use our search feature or contact our customer support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <button className="px-6 py-3 rounded-lg font-medium text-white transition-colors" style={{ backgroundColor: 'var(--primary-color)' }}>
                Search Site
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Most Popular Pages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/shop">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-center mb-4">
                  <Package className="w-12 h-12" style={{ color: 'var(--primary-color)' }} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Shop</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Browse our complete product catalog
                </p>
              </div>
            </Link>

            <Link href="/my-orders">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-center mb-4">
                  <Truck className="w-12 h-12" style={{ color: 'var(--primary-color)' }} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">My Orders</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Track your orders and delivery status
                </p>
              </div>
            </Link>

            <Link href="/sellers">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-center mb-4">
                  <Store className="w-12 h-12" style={{ color: 'var(--primary-color)' }} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sellers</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Discover trusted marketplace sellers
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}