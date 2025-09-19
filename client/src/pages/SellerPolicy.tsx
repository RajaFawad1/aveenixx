import { 
  Store, 
  Package, 
  CreditCard, 
  Users, 
  TrendingUp,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Settings,
  Award,
  Shield,
  AlertTriangle,
  Truck
} from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function SellerPolicy() {
  const lastUpdated = "January 1, 2024";

  // Sub-navigation component
  const sellerNavigation = (
    <>
      <button
        className="flex items-center space-x-2 py-2 px-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap text-white"
      >
        <Store className="w-4 h-4" />
        <span>Seller Policy</span>
      </button>
    </>
  );

  return (
    <MainEcommerceLayout 
      subtitle="Seller Policy"
      showSearch={true}
      showEcommerceActions={false}
      showProductCategories={false}
      customSubNavContent={sellerNavigation}
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
                <Store className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Seller Guidelines & Policies
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive guidelines for marketplace sellers including registration, product listing, fees, and performance requirements.
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

          {/* Seller Guidelines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Store className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Seller Guidelines</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Guide for New Sellers on Aveenix</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Welcome to Aveenix! As a new seller, you'll have access to powerful tools to build and grow your business on our marketplace. This comprehensive guide will walk you through everything you need to know to get started and succeed on our platform.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Seller Requirements</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Valid business registration and tax identification
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Compliance with all applicable laws and regulations
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Commitment to providing excellent customer service
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Agreement to follow all marketplace policies and guidelines
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Seller Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                        <Award className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Seller Success Program</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Access tools and resources to grow your business</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                        <Shield className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Seller Protection</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive protection for eligible transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Registration Process */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Registration Process</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Create Your Aveenix Account</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Sign Up: Register for a new seller account on Aveenix by visiting the Seller Registration page. Provide essential details such as your company name, contact information, and tax ID number.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Set Up Your Store on Aveenix</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Store Name and Branding: Choose a unique store name and upload your logo
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Customize your store's design using Aveenix's branding tools
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Enter business hours, return policies, and shipping information
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Business registration documents
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Tax identification number
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Bank account information for payments
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Verification Process</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Once you submit your registration, our team will review your application within 1-2 business days. You'll receive email notifications about the status of your application and any additional information needed.
                </p>
              </section>
            </div>
          </div>

          {/* Product Listing */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Product Listing</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">List Your Products</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create detailed product listings with high-quality images, clear descriptions, and accurate pricing. Include relevant shipping fees and any promotional offers to attract buyers.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Product Listing Options</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Product Listings: Create detailed listings with high-quality images and descriptions
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Auction Listings: Set fair start price, reserve price, and finish time
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Buy Now Option: Enable immediate purchases for fixed prices
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Mobile Management: Use Aveenix mobile apps to manage listings on the go
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Prohibited Items</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Certain items are prohibited from sale on our marketplace, including counterfeit goods, dangerous items, regulated substances, and items that violate intellectual property rights.
                </p>
              </section>
            </div>
          </div>

          {/* Fees & Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Fees & Payments</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Fee Structure</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our fee structure is transparent and competitive. We charge a small percentage of each sale to cover platform costs, payment processing, and customer support.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Payment Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Standard Payments</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Bi-weekly payments for established sellers</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Express Payments</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Daily payments for qualifying sellers</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Fee Categories</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <div className="w-4 h-4 mr-2 mt-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    Referral fees (varies by category)
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 mr-2 mt-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    Closing fees (per item sold)
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 mr-2 mt-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    Monthly subscription fees (for professional sellers)
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 mr-2 mt-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    Storage fees (for fulfillment services)
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Performance Standards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Standards</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We track several key performance indicators to ensure sellers maintain high standards of service. These metrics help us identify top-performing sellers and provide coaching for improvement.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Order Defect Rate</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Target: Less than 1%</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Late Shipment Rate</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Target: Less than 4%</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Customer Service Rating</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Target: 4.5 stars or higher</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Response Time</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Target: Within 24 hours</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Performance Improvement</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sellers who don't meet performance standards will receive coaching and support to improve. Persistent performance issues may result in account restrictions or suspension.
                </p>
              </section>
            </div>
          </div>

          {/* Contact Us Options */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  If you have questions about seller policies or need support with your seller account, please contact us:
                </p>
                
                {/* Contact Method Tiles */}
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

                  {/* Seller Support */}
                  <div 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-opacity-50 text-center"
                    style={{ 
                      borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                    }}
                    onClick={() => window.location.href = '/contact'}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Settings className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Seller Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Specialized seller help</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                      Seller success team
                    </p>
                    <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Business hours
                    </div>
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