import { 
  Truck, 
  Package, 
  Globe, 
  Clock, 
  MapPin,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Settings,
  Zap,
  Shield,
  CreditCard
} from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function ShippingInfo() {
  const lastUpdated = "January 1, 2024";

  // Sub-navigation component
  const shippingNavigation = (
    <>
      <button
        className="flex items-center space-x-2 py-2 px-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap text-white"
      >
        <Truck className="w-4 h-4" />
        <span>Shipping Information</span>
      </button>
    </>
  );

  return (
    <MainEcommerceLayout 
      subtitle="Shipping Policy"
      showSearch={true}
      showEcommerceActions={false}
      showProductCategories={false}
      customSubNavContent={shippingNavigation}
    >
      {/* Hero Section */}
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 15%, transparent) 0%, color-mix(in srgb, var(--primary-color) 8%, transparent) 50%, color-mix(in srgb, var(--primary-color) 12%, transparent) 100%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full backdrop-blur-sm border" style={{
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, white)',
                borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
              }}>
                <Truck className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Shipping & Delivery Information
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive shipping policies, delivery options, tracking information, and international shipping details for your orders.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-bounce delay-500" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full animate-ping delay-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <div className="space-y-6">
          {/* Last Updated */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" style={{ color: 'var(--primary-color)' }} />
              Last updated: {lastUpdated}
            </div>
          </div>

          {/* Shipping Policy */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Truck className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Policy</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Shipping and Delivery Policy</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We are committed to delivering your purchases in a timely and reliable manner. Our shipping options are designed to meet your needs, depending on whether your order is from an Affiliate, Dropshipping, Branded, or Multivendor product.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Order Processing Time</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Orders are typically processed within 1-2 business days. During peak periods, processing may take up to 3 business days. Affiliate and Dropshipping products are processed by our suppliers, so processing times may vary based on their warehouse. Branded products are processed directly from Aveenix's warehouse. Multi Vendor products may require different processing times depending on the vendor's location and processing times.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You will receive a confirmation email with tracking information once your order has shipped.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Shipping Coverage</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    All 50 US states and Washington D.C.
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    US territories including Puerto Rico and Guam
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    International shipping to over 200 countries
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Military APO/FPO addresses
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Shipping Options */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Options</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Shipping Methods and Costs</h3>
                
                <div className="space-y-6">
                  {/* Affiliate Products */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Affiliate Products</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Truck className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Free Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Available for selected products via ePacket (China) or USPS (USA)</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Standard Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">7-10 business days • Based on weight and destination</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Zap className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Expedited Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">3-5 business days • Additional charges apply</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Globe className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">International Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Ship to 200+ countries • Calculated at checkout</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropshipping Products */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Dropshipping Products</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Truck className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Free Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Select products via ePacket (China) or EMS</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Standard Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">12-15 business days • Based on destination and size</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Zap className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Expedited Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">7-10 business days • Additional charges apply</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Globe className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">International Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Available to 200+ countries • Calculated at checkout</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Branded Products */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400">Branded Products</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Truck className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Free Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">From Aveenix warehouse in USA and authorized regions</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Standard Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">5-7 business days • Based on weight, size, and destination</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Zap className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Expedited Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">2-3 business days • Additional charges apply</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Globe className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">International Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Available worldwide • Calculated at checkout</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi Vendor Products */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Multi Vendor Products</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Truck className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Free Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Select items from different sellers • Methods vary by vendor</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Standard Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">7-14 business days • Depends on vendor location</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Zap className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Expedited Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">3-5 business days • Based on vendor availability</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                            <Globe className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">International Shipping</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Ship to 200+ countries • Each vendor's policy applies</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Tracking</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Order Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Once your order has shipped, you will receive an email with tracking details. You can track your order status and view estimated delivery times through our Order Tracking page.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Tracking Features</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Real-time package location updates
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Estimated delivery date and time
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Email notifications with tracking updates
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Delivery confirmation with signature
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Shipping Rates and Restrictions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Rates & Restrictions</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Shipping Rates</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  While we offer free shipping for certain shipping methods, additional charges may apply for expedited shipping or when products are shipped directly from suppliers. Shipping rates are determined based on the size, weight, and destination of your order. These charges will be displayed at checkout before completing your purchase.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Shipping Restrictions</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We currently ship to over 200 countries, but some locations may not be eligible for shipping. If your location falls into one of these areas, we will contact you directly to discuss alternative solutions. Affiliate and Dropshipping products may have specific restrictions depending on the supplier's policy.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Some remote areas may have limited shipping options
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Certain products may have shipping restrictions
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    International shipping may have customs delays
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Customs and Duties */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Globe className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customs and Duties</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">International Orders</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  For international orders, customs duties, taxes, and fees may apply depending on the destination country's regulations. These charges are the responsibility of the recipient and are not included in the shipping cost at checkout. By purchasing from Aveenix, you consent to the possibility of customs fees when your package arrives in your country.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Customs duties are separate from shipping costs
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Fees vary by country and product type
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Customer is responsible for all customs charges
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Customs declarations are automatically handled
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Contact Us */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
              </div>
              
              <section>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  If you have questions about shipping or need help with your order, please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Email Support */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Email Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get help via email</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Contact us by email
                    </p>
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Within 24 hours
                    </div>
                  </div>

                  {/* Phone Support */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Phone className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Phone Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Speak with our team</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Call us directly
                    </p>
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Mon-Fri 9AM-6PM EST
                    </div>
                  </div>

                  {/* Live Chat */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-current rounded" style={{ color: 'var(--primary-color)' }}></div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Live Chat</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Chat with support</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Available on our platform
                    </p>
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Real-time assistance
                    </div>
                  </div>

                  {/* Technical Support */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Settings className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Technical Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">For platform issues</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Technical assistance
                    </p>
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Within 12 hours
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}