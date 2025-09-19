import { useState } from 'react';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Share2,
  Settings,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Globe,
  Bell
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield }
  ];

  const lastUpdated = "January 1, 2024";

  // Sub-navigation component
  const privacyNavigation = (
    <>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-2 px-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-black hover:text-white'
            }`}
          >
            <IconComponent className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </>
  );

  return (
    <MainEcommerceLayout 
      subtitle="Privacy Policy"
      showSearch={true}
      showEcommerceActions={false}
      showProductCategories={false}
      customSubNavContent={privacyNavigation}
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
                <Shield className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your data.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-white/20 rounded-full -translate-x-12 -translate-y-12 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/25 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-white/25 rounded-full animate-ping delay-700"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <div className="space-y-6">
          {/* Last Updated */}
          <div className="border-b pb-4" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" style={{ color: 'var(--primary-color)' }} />
              Last updated: {lastUpdated}
            </div>
          </div>

          {activeTab === 'privacy' && (
            <div className="space-y-8">
              {/* Privacy Policy Overview */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Policy Overview</h2>
                </div>
                <div className="space-y-6">
                  <section>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Aveenix ("we," "us," or "our") is committed to protecting your privacy and ensuring that your personal information is secure. This Privacy Policy outlines how we collect, use, store, and share your personal data when you use our website and services. By using our website, mobile application, and software-as-a-service products (collectively referred to as the "Services"), you consent to the practices described in this Privacy Policy.
                    </p>
                  </section>
                </div>
              </div>

              {/* Information We Collect */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Database className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We collect various types of personal information to provide our services and enhance your experience. This may include:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Personal Information:</strong> Your name, email address, shipping address, phone number, and payment details.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Account Information:</strong> Login credentials, purchase history, and saved preferences.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Transaction Information:</strong> Details of products purchased through our platform, including Affiliate Products, Dropshipping Products, and Multivendor Products.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Device & Usage Data:</strong> Your IP address, browser type, device information, and browsing patterns on our website.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Marketing Preferences:</strong> Information on subscriptions, newsletter preferences, and interaction with our marketing communications.
                    </li>
                  </ul>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Eye className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How We Use Your Information</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We use your personal data for the following purposes:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Order Processing and Fulfillment:</strong> To process and ship your orders for Affiliate Products, Dropshipping Products, and Multivendor Products.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Customer Support:</strong> To respond to inquiries, resolve issues, and provide assistance.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Personalization:</strong> To deliver personalized product recommendations and offers based on your browsing and purchasing history.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Communication:</strong> To send updates about your orders, promotional offers, and other service-related messages.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Compliance:</strong> To ensure security, prevent fraud, and comply with legal requirements.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sharing Your Information */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Share2 className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sharing Your Information</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We do not sell your personal data. However, we may share your information with:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Affiliate Partners:</strong> When you purchase an Affiliate Product, your data may be shared with the affiliate partner to complete the transaction and track sales.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Dropshipping Suppliers:</strong> If you purchase a Dropshipping Product, your data will be shared with the supplier to fulfill and ship your order.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Multivendor Sellers:</strong> When purchasing Multivendor Products, your details will be shared with the respective vendors for order fulfillment.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Service Providers:</strong> Payment processors, shipping companies, and IT providers who help facilitate transactions and services.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Legal Requirements:</strong> To comply with legal processes, prevent fraud, and protect our rights.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Advertising, Cookies, and Tracking Technologies */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Advertising, Cookies, and Tracking Technologies</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We use cookies and similar tracking technologies to enhance your experience on our website, including:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Cookies:</strong> These are small data files that help us understand how you use our website and provide personalized content. Cookies may be set by us or by third-party vendors.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Advertising:</strong> We may use your browsing and purchase data to deliver personalized ads and offers. You can manage your cookie preferences and opt out of targeted ads through your browser settings or your account preferences.
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    If you prefer not to have cookies collected, you can adjust your browser settings to block or delete them.
                  </p>
                </div>
              </div>

              {/* Data Security */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Lock className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Security</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    We use industry-standard security measures, including encryption protocols and secure payment gateways, to protect your personal data. However, no method of data transmission over the internet is 100% secure, and we cannot guarantee the absolute security of your information.
                  </p>
                </div>
              </div>

              {/* Community Questions & AI Processing */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Database className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Community Questions & AI Processing</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    Our platform offers two ways to get help: private AI assistance through Jarvis and public community engagement. Here's how your data is processed for each:
                  </p>
                  
                  {/* Private AI Flow */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Private AI Flow (Jarvis)
                    </h3>
                    <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Questions are encrypted end-to-end before being sent to our AI system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>AI processes using business intelligence while maintaining privacy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Responses are generated instantly and delivered privately to you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Conversations are stored securely in your encrypted user profile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Zero public visibility - your private questions remain confidential</span>
                      </li>
                    </ul>
                    <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-800 rounded text-sm font-medium text-purple-900 dark:text-purple-100">
                      ✓ 100% Private & Confidential - GDPR Compliant
                    </div>
                  </div>

                  {/* Public Community Flow */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Public Community Flow
                    </h3>
                    <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Questions are posted to our unified community hub</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Content is auto-shared across our 7 social media platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Community members respond on their preferred platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Responses are aggregated back to your dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Best solutions are highlighted and shared publicly for learning</span>
                      </li>
                    </ul>
                    <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      ✓ Maximum Reach & Collaboration - Public Knowledge Base
                    </div>
                  </div>

                  {/* Data Storage & Delivery */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Data Storage
                      </h4>
                      <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>• Private AI: Encrypted in your profile only</li>
                        <li>• Public: Stored in community knowledge base</li>
                        <li>• All data: GDPR compliant & user-controlled</li>
                        <li>• Retention: Based on your account preferences</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Answer Delivery
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>• Instant push notifications to your devices</li>
                        <li>• Email summaries of community responses</li>
                        <li>• Dashboard aggregation with quality scoring</li>
                        <li>• Mobile app alerts for urgent solutions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Privacy Rights */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Privacy Rights</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Access and Rectification:</strong> You can access and update your personal data.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Deletion:</strong> You may request that we delete your personal data under certain conditions.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Opt-Out of Marketing:</strong> You can unsubscribe from promotional emails and communications.
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <strong>Data Portability:</strong> You may request a copy of your personal data in a structured, commonly used format.
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    To exercise any of these rights, please contact us at privacy@aveenix.com.
                  </p>
                </div>
              </div>

              {/* Regional Privacy Rights */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Globe className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Regional Privacy Rights</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    If you're located in regions such as the European Union (EU) or California (USA), you may have additional rights under laws like the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). For more information, please refer to our dedicated GDPR and CCPA sections.
                  </p>
                </div>
              </div>

              {/* Children's Privacy */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Children's Privacy</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Our services are not intended for children under the age of 18. We do not knowingly collect or solicit personal information from children. If we learn that we have collected personal data from a child under 18, we will take steps to delete that information promptly.
                  </p>
                </div>
              </div>

              {/* Changes to This Policy */}
              <div className="border-b pb-6" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #e5e7eb)' }}>
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Changes to This Policy</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised date will be noted at the top of the policy. We encourage you to review this policy periodically for any updates.
                  </p>
                </div>
              </div>

              {/* Contact Us Options */}
              <div className="pb-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
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

                    {/* Technical Support */}
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
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Technical Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">For platform issues</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                        Technical assistance
                      </p>
                      <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Within 12 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainEcommerceLayout>
  );
}