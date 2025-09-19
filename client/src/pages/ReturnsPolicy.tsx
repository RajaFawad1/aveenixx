import { 
  RotateCcw, 
  Package, 
  CreditCard, 
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Settings,
  ShoppingCart,
  Users,
  AlertTriangle
} from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function ReturnsPolicy() {
  const lastUpdated = "January 1, 2024";

  // Sub-navigation component
  const returnsNavigation = (
    <>
      <button
        className="flex items-center space-x-2 py-2 px-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap text-white"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Returns Policy</span>
      </button>
    </>
  );

  return (
    <MainEcommerceLayout 
      subtitle="Returns Policy"
      showSearch={true}
      showEcommerceActions={false}
      showProductCategories={false}
      customSubNavContent={returnsNavigation}
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 8%, transparent)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r" style={{ background: `linear-gradient(to right, color-mix(in srgb, var(--primary-color) 5%, transparent), color-mix(in srgb, var(--primary-color) 10%, transparent))` }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full backdrop-blur-sm border" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 15%, rgba(255, 255, 255, 0.1))', borderColor: 'color-mix(in srgb, var(--primary-color) 30%, rgba(255, 255, 255, 0.3))' }}>
                <RotateCcw className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Returns & Exchange Policy
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              At Aveenix Express, we're committed to ensuring your satisfaction with every purchase. Our returns policy offers peace of mind and clarity for all product categories.
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

          {/* Order Cancellations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Cancellations</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Pre-Shipment Cancellations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Orders can be canceled at any point prior to shipment. To make changes or cancel an order, please contact us within 12 hours of placing it.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Post-Shipment Cancellations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Once packaging and shipping have commenced, cancellations are not possible.
                </p>
              </section>
            </div>
          </div>

          {/* Eligibility for Returns */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Eligibility for Returns</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">General Conditions</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Items can be returned within 15 days of receiving the order
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Products must be unused, undamaged, and in original packaging
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Certain items may not be eligible: perishable goods, personalized products, digital downloads
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Product Category-Specific Returns */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Category-Specific Return Details</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Affiliate Products</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>How to Return:</strong> Affiliate products are sold through external platforms (e.g., Amazon). To return these products, please follow the return process of the primary seller as indicated on your order confirmation.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Order Status:</strong> Once you complete the purchase on Aveenix, the transaction will be completed on the affiliate platform's site. You will receive instructions to return products directly through their return process.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Refunds:</strong> Returns and refunds for affiliate products are subject to the policies of the third-party affiliate partner.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Dropshipping Products</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>How to Return:</strong> If your order is a drop shipped product, please contact the seller directly through your Aveenix account to initiate the return. If you're unable to resolve the issue with the seller, you can escalate the request to Aveenix customer support for further assistance.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Order Status:</strong> Dropshipping products are fulfilled directly by the supplier. The seller will be responsible for the return process and ensuring a refund is processed.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Refunds:</strong> Returns will be processed after the product is returned and inspected by the supplier. Refunds may take up to 15 days after the returned product is received.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Branded Products (Aveenix-branded)</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>How to Return:</strong> For products sold directly under the Aveenix brand, you can initiate returns by contacting Aveenix customer support directly via your Aveenix account.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Order Status:</strong> Branded products are managed and fulfilled by Aveenix, so the entire return process will be handled within Aveenix systems.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Refunds:</strong> Refunds will be issued to the original payment method within 15 days after the returned product is received and inspected.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Multi Vendor Products</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>How to Return:</strong> If you purchased a product from one of our third-party vendors, you will need to reach out to the vendor directly through your Aveenix account. Each vendor may have its own return policy, but our support team is here to assist if needed.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Order Status:</strong> Multivendor products are shipped and fulfilled by the vendor. Returns for these items must follow the return guidelines of the respective vendor.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Refunds:</strong> Once the vendor processes the return, a refund will be issued. Please allow up to 15 days for the return and inspection process.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Refund Process for All Categories</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Review and Approval</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our team will review your return request and provide instructions on how to return the item.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Processing Time</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Refunds are typically processed within 15 days after the returned item is received and inspected.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Refund Method</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Refunds will be issued to the original payment method or as store credit, depending on your preference.
                </p>
              </section>
            </div>
          </div>

          {/* Shipping Costs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Truck className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Shipping Costs</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Return Shipping</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You may be responsible for paying return shipping costs unless the return is due to a defect or an error on our part.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Prepaid Return Labels</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  In some cases, Aveenix may provide a prepaid return shipping label for returns related to dropshipping or Aveenix-branded products.
                </p>
              </section>
            </div>
          </div>

          {/* Defective or Incorrect Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Defective or Incorrect Items</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">How to Return</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you receive a defective or incorrect item, please contact us immediately. We will arrange for a replacement or a full refund, including return shipping costs, if applicable.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Product Category-Specific Defects</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    <span><strong>Affiliate Products:</strong> Follow the return procedure provided by the affiliate seller</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    <span><strong>Dropshipping Products:</strong> Contact the dropshipping supplier for returns or request assistance through Aveenix customer support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    <span><strong>Branded Products:</strong> Directly contact Aveenix for quick resolution</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    <span><strong>Multi Vendor Products:</strong> Contact the respective vendor to resolve the issue</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <RefreshCw className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Exchanges</h2>
              </div>
              
              <section>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you wish to exchange a product for a different size or for any other reason, please contact us first. We'll guide you through the process and ensure that the exchange is handled promptly. Please do not send your product back until you have received confirmation from Aveenix.
                </p>
              </section>
            </div>
          </div>

          {/* Exceptional Circumstances */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Exceptional Circumstances</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Wrong Address</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If your order didn't arrive because of an incorrect shipping address entered by you, we cannot issue a refund or re-shipment.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Exceptional Circumstances Beyond Our Control</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  In the event of shipping delays due to customs clearance issues, natural disasters, or other external factors, we will work with you to find a resolution. You may submit a refund request 15 days after the guaranteed delivery period of 45 days has expired.
                </p>
              </section>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
              </div>
              
              <section>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  For any questions or assistance, our customer support team is available to help. Contact us through your Aveenix Express account or email us directly.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Email Support */}
                <div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-opacity-50 text-center"
                  style={{ 
                    borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                  }}
                  onClick={() => window.location.href = '/contact'}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Email Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get help via email</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                    Contact us by email
                  </p>
                  <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Within 24 hours
                  </div>
                </div>

                {/* Phone Support */}
                <div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-opacity-50 text-center"
                  style={{ 
                    borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                  }}
                  onClick={() => window.location.href = '/contact'}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Phone Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Speak with our team</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                    Call us directly
                  </p>
                  <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Mon-Fri 9AM-6PM EST
                  </div>
                </div>

                {/* Live Chat */}
                <div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-opacity-50 text-center"
                  style={{ 
                    borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                  }}
                  onClick={() => window.location.href = '/contact'}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-current rounded" style={{ color: 'var(--primary-color)' }}></div>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Live Chat</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Chat with support</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                    Available on our platform
                  </p>
                  <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Real-time assistance
                  </div>
                </div>

                {/* Account Dashboard */}
                <div 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-opacity-50 text-center"
                  style={{ 
                    borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                  }}
                  onClick={() => window.location.href = '/account'}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Settings className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Account Dashboard</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage your returns</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                    My Account
                  </p>
                  <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    24/7 access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}