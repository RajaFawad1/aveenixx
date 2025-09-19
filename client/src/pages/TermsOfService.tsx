import { 
  Scale, 
  Shield, 
  FileText, 
  User, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Settings,
  Gavel,
  Building,
  ShieldCheck,
  Gift,
  Cookie,
  Link
} from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import { useState } from 'react';

export default function TermsOfService() {
  const lastUpdated = "January 1, 2024";
  const [activeTab, setActiveTab] = useState('terms');

  // Sub-navigation component
  const termsNavigation = (
    <>
      {[
        { id: 'terms', label: 'Terms of Service', icon: Scale },
        { id: 'affiliate-disclaimer', label: 'Affiliate Disclaimer', icon: Link },
        { id: 'buyer-protection', label: 'Buyer Protection', icon: ShieldCheck },
        { id: 'cashback-program', label: 'Cashback Program', icon: Gift }
      ].map((tab) => {
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
      subtitle="Legal Policy"
      showSearch={true}
      showEcommerceActions={false}
      showProductCategories={false}
      customSubNavContent={termsNavigation}
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
                {activeTab === 'terms' && <Scale className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />}
                {activeTab === 'affiliate-disclaimer' && <Link className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />}
                {activeTab === 'buyer-protection' && <ShieldCheck className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />}
                {activeTab === 'cashback-program' && <Gift className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {activeTab === 'terms' && 'Terms of Service'}
              {activeTab === 'affiliate-disclaimer' && 'Affiliate Disclaimer'}
              {activeTab === 'buyer-protection' && 'Buyer Protection'}
              {activeTab === 'cashback-program' && 'Cashback Program'}
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {activeTab === 'terms' && 'Comprehensive terms and conditions governing your use of our services, including Buyer Protection and Cashback Program policies.'}
              {activeTab === 'affiliate-disclaimer' && 'Transparency is core to our operations. Learn about our affiliate partnerships and how we earn commissions to support our services.'}
              {activeTab === 'buyer-protection' && 'Your satisfaction and security are our top priority. Our comprehensive Buyer Protection Program ensures safe, secure, and hassle-free shopping experience.'}
              {activeTab === 'cashback-program' && 'Earn cashback on every purchase with our rewards program. Join thousands of satisfied customers earning rewards on their purchases.'}
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

          {/* Terms of Service Tab */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              {/* Terms of Service */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Scale className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Terms of Service Agreement</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Agreement Overview</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      These Terms of Service ("Terms") govern your use of the Aveenix platform and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Service Description</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      These Terms and Conditions ("Terms") govern your use of the Aveenix website, mobile application, and software-as-a-service products (collectively referred to as the "Services"). By accessing and using our Services, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use our Services.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Use of Services</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You may use our Services only for lawful purposes and in accordance with these Terms. Any activity that violates federal, state, local, or international laws, or is otherwise prohibited, is strictly prohibited.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Accounts and Registration</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      To access certain features, you may be required to create an account. When registering, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials, and you agree to notify us immediately of any unauthorized access or breach of security.
                    </p>
                  </section>
                </div>
              </div>

              {/* Payment and Fees */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment and Fees</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Payment Terms</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      By purchasing products or services through our Services, you agree to pay all applicable fees and charges. Payments will be processed by third-party payment processors such as PayPal and Stripe, and may include service fees depending on your selected payment method.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      For Affiliate, Dropshipping, Branded, and Multi Vendor products, payment processing is handled by the respective suppliers or third parties. You may be subject to additional charges as outlined by these vendors.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Payment Disputes and Chargebacks</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      In the event of a chargeback or payment dispute, Aveenix reserves the right to suspend your account until the issue is resolved. If the chargeback is deemed unjustified, you may be held liable for fees and costs incurred.
                    </p>
                  </section>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Intellectual Property</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Ownership</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      All content on our Services, including but not limited to software, text, images, audio, and video, is owned by Aveenix or its licensors and is protected by intellectual property laws. Unauthorized copying, distribution, or modification of any content is prohibited unless expressly authorized in writing.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">User Content</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      If you upload, submit, or share content on our platform (such as product reviews, comments, etc.), you retain ownership of your content. However, you grant Aveenix a non-exclusive, transferable, sub-licensable, royalty-free license to use, modify, and distribute your content in connection with our Services and business.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You warrant that your content does not infringe on any third-party rights, is lawful, and does not contain harmful or offensive material.
                    </p>
                  </section>
                </div>
              </div>

              {/* Prohibited Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Prohibited Activities</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Restricted Activities</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You agree not to use the Services for the following activities:
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Engaging in fraudulent, unlawful, or harmful activities
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Impersonating any person or entity
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Uploading or submitting illegal, defamatory, or harmful content
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Violating the intellectual property rights of others
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Introducing harmful malware or malicious content
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Disrupting or interfering with the operation of the Services
                      </li>
                    </ul>
                  </section>
                </div>
              </div>

              {/* Third-Party Services */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Building className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Third-Party Services</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">External Services</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our platform may include links to third-party websites or services, such as Affiliate links, Dropshipping suppliers, or Multi Vendor vendors. These third parties have their own Terms and Conditions, which you should review before engaging with them. Aveenix is not responsible for the content or practices of these third-party services.
                    </p>
                  </section>
                </div>
              </div>

              {/* Returns and Refunds */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Gift className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Returns and Refunds Policy</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Return Policy</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We offer a Returns and Refunds Policy for all eligible products. Please review the policy for detailed instructions regarding returns, refunds, and exchanges.
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Affiliate Products:</strong> Products linked through our Affiliate Program are subject to the return policies of the respective affiliate partner
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Dropshipping:</strong> Returns for dropshipping products may be subject to the supplier's return policy, which may differ from ours
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Branded Products:</strong> Returns for branded products are governed by the manufacturer's policy
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Multi Vendor Products:</strong> Each vendor in our multi vendor marketplace may have its own return policy, which will be available for review at checkout
                      </li>
                    </ul>
                  </section>
                </div>
              </div>

              {/* Liability and Termination */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Gavel className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Liability and Termination</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      To the fullest extent permitted by law, Aveenix will not be liable for any indirect, incidental, or consequential damages arising from your use or inability to use the Services, including but not limited to product availability, delays, or third-party services.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      In the case of Affiliate and Dropshipping products, Aveenix is not responsible for issues related to product quality, delivery, or any other issue stemming from third-party suppliers.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Termination</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Aveenix reserves the right to terminate or suspend your access to our Services for any reason, including breach of these Terms. If your account is terminated, you may not be entitled to any refunds.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Force Majeure</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Aveenix will not be held liable for failure or delay in fulfilling orders or performing any obligation due to causes beyond our control, including natural disasters, pandemics, labor strikes, or government actions.
                    </p>
                  </section>
                </div>
              </div>

              {/* Cookie Policy */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Cookie className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cookie Policy</h2>
                  </div>
                  
                  <section>
                    <h3 className="text-lg font-semibold mb-3">What Are Cookies</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better user experience by remembering your preferences and analyzing how you use our platform.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Types of Cookies We Use</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Essential Cookies:</strong> Required for basic site functionality including login, shopping cart, and security features
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Performance Cookies:</strong> Help us analyze site performance and usage patterns to improve our services
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Preference Cookies:</strong> Remember your settings, language preferences, and customization choices
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track marketing campaign effectiveness
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Managing Your Cookie Preferences</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You have full control over how cookies are used on our platform. You can manage your preferences through:
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Your browser settings to block or allow cookies
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Our cookie preference center to customize your experience
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        Account settings to manage personalization preferences
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Note: Essential cookies cannot be disabled as they're required for basic site functionality and security.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Subscription Terms (If Applicable)</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      If you subscribe to any recurring services (e.g., SaaS), you agree to pay for your subscription on a recurring basis. You may cancel your subscription at any time, but no refunds will be issued for partial periods. Please refer to our Subscription Policy for details.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Changes to the Terms</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Aveenix reserves the right to modify or revise these Terms at any time. Any changes will be posted on this page, and we will notify users of significant changes via email or website notification. You agree to review these Terms regularly to stay informed of updates.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Dispute Resolution and Governing Law</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Any disputes arising from the use of our Services will be governed by the laws of New Zealand. All disputes will be resolved through binding arbitration, unless otherwise specified.
                    </p>
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
                      If you have questions about these Terms of Service or need legal assistance, please contact us:
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

                      {/* Legal Support */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                            <Scale className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Legal Support</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">For legal inquiries</p>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                          Legal assistance
                        </p>
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Within 48 hours
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Affiliate Disclaimer Tab */}
          {activeTab === 'affiliate-disclaimer' && (
            <div className="space-y-6">
              {/* Affiliate Disclaimer */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Link className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Affiliate Disclaimer</h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    At Aveenix Express, transparency is a core part of how we operate. Some of the links on our website are affiliate links, which means we may earn a small commission if you click through and make a purchase — at no additional cost to you.
                  </p>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Our Product Selection</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We only feature products and services that meet our quality standards and are likely to bring value to our audience. Many of these products are selected based on real user reviews and performance data.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Cashback Benefits</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      When you shop through our affiliate links, you may also qualify for cashback through our Cashback Program, where we share a portion of our earned commissions directly with you. For full details, please see our Cashback Terms of Use.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Supporting Our Mission</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Your support not only helps us maintain and improve Aveenix Express, but also contributes to our wider mission of supporting small businesses, funding local projects, and giving back to children's charities like Starship.
                    </p>
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
                      If you have questions about our affiliate partnerships or need more information, please contact us:
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
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick response time</p>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                          Send us an email
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

                      {/* Affiliate Team */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                            <Link className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Affiliate Team</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Partnership inquiries</p>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                          Partnership support
                        </p>
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Within 48 hours
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Buyer Protection Tab */}
          {activeTab === 'buyer-protection' && (
            <div className="space-y-6">
              {/* Buyer Protection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <ShieldCheck className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aveenix Express Buyer Protection Program</h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your satisfaction and security are our top priority at Aveenix Express. Our Buyer Protection Program is designed to ensure your shopping experience is safe, secure, and hassle-free. Here's how we protect you:
                  </p>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Secure Transactions</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We use advanced encryption and trusted payment gateways to ensure your financial information is safe throughout the checkout process.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Order Tracking</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Stay in the loop! Track your order in real-time and receive status updates until it arrives at your door.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Refund Guarantee</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      If your order doesn't arrive, is defective, or doesn't match the description, you can request a full refund. We will review your request and resolve it within 30 days of delivery, alongside your statutory rights under applicable consumer laws.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Easy Returns</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Not satisfied with your purchase? Initiate a return easily and get either a replacement or a refund — whichever you prefer.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Dispute Resolution</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      If issues arise with your order, our dedicated customer support team is here to help. If direct resolution with the seller isn't possible, open a dispute within 15 days of delivery. We'll work with you and the seller to resolve the matter quickly.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Product Quality Assurance</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We only feature quality-assured products. If anything doesn't meet your expectations, reach out to us — we'll resolve the issue promptly.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Privacy Protection</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Your personal information is safe with us. We adhere to strict privacy policies to ensure your data is always protected.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Cashback Eligibility</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Purchases made through our Cashback Program may offer you cashback, which you can redeem for future purchases or credits. Refer to our Cashback Terms of Use for more details on how returns or disputes may affect cashback eligibility.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our support team is here for you. If you need assistance with your order or have any questions about the Buyer Protection Program, we're just a message away.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Your Trust is Our Priority</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      At Aveenix Express, we're committed to providing a secure, transparent, and reliable shopping experience. We value your trust and are here to ensure your complete satisfaction.
                    </p>
                  </section>
                </div>
              </div>

              {/* Contact Us */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  If you have buyer protection concerns or questions about our protection program, please contact us:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Get help via email</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Contact us by email
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Within 24 hours
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Speak with our team</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Call us directly
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Mon-Fri 9AM-6PM EST
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Chat with support</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Available on our platform
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Real-time assistance
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Buyer Protection Team</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Protection concerns</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Report protection issues
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      24/7 monitoring
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cashback Program Tab */}
          {activeTab === 'cashback-program' && (
            <div className="space-y-6">
              {/* Cashback Program */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Gift className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Aveenix Cashback Program</h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Welcome to Aveenix! By participating in our Cashback Program, you agree to the following terms and conditions. Please read them carefully.
                  </p>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Eligibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <p className="text-gray-600 dark:text-gray-300">To be eligible for cashback, you must be a registered user of Aveenix.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <p className="text-gray-600 dark:text-gray-300">Cashback is only available for purchases made through valid affiliate links provided by Aveenix.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <p className="text-gray-600 dark:text-gray-300">Cashback is not available for purchases made with gift cards, coupons, or other discounts unless explicitly stated.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <p className="text-gray-600 dark:text-gray-300">You must be in good standing with Aveenix, and your account should not be involved in any fraudulent activities.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Qualifying Purchases</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Only purchases that result in a successful sale and are not returned, canceled, or refunded will be considered qualifying purchases. The transaction must be completed through a valid affiliate link provided by Aveenix. Certain product categories or specific items may be excluded from the cashback program.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Affiliate Products</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Cashback applies to purchases made through Aveenix's affiliate links.</p>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Dropshipping Products</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Cashback may apply to dropshipping products, subject to the policies of the individual suppliers.</p>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Branded Products</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Some branded items may be excluded due to manufacturer restrictions.</p>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Multi Vendor Products</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Each vendor may have their own cashback eligibility criteria, listed at checkout.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Cashback Calculation</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      The cashback amount is based on a portion of the commission earned from the sale of the qualifying product. The exact percentage varies depending on factors like retailer, product category, and promotional terms. Aveenix reserves the right to adjust the cashback percentage at any time.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Cashback Processing</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Cashback will be processed within 30-60 days from the date of the qualifying purchase. This period allows for verification of the sale and completion of any return or refund windows. If there are delays beyond this timeframe, Aveenix will notify you via email or your account dashboard.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Use and Withdrawal of Cashback</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <p className="text-gray-600 dark:text-gray-300"><strong>Use of Cashback:</strong> Cashback can be used toward future purchases on Aveenix.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <p className="text-gray-600 dark:text-gray-300"><strong>Withdrawal of Cashback:</strong> Cashback can also be withdrawn to your bank account. You must provide valid bank account details in your Aveenix account settings.</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                        <p className="text-gray-600 dark:text-gray-300">For security purposes, the redemption of cashback is limited to NZD$300 per 24-hour period.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Fraudulent Activity</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Aveenix reserves the right to monitor all transactions and suspend or terminate accounts involved in fraudulent activities. This includes multiple account abuse, false transactions, or any manipulation of the Cashback Program. If fraudulent activity is detected, Aveenix may forfeit all cashback and close the involved accounts.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Changes to the Cashback Program</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Aveenix reserves the right to modify, suspend, or terminate the Cashback Program at any time. Any changes to the program will be effective immediately upon posting on the Aveenix website or upon communication through email or your account dashboard.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Responsibility and Account Maintenance</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You are responsible for regularly checking your account to ensure cashback has been properly credited. Any discrepancies or missing cashback must be reported to Aveenix within 30 days of the qualifying transaction date.
                    </p>
                  </section>
                </div>
              </div>

              {/* Contact Us */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  If you have any questions or concerns regarding the Cashback Program, please contact our customer support team:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Get help via email</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Contact us by email
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Within 24 hours
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Speak with our team</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Call us directly
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Mon-Fri 9AM-6PM EST
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Chat with support</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Available on our platform
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      Real-time assistance
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cashback Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Cashback inquiries</p>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                      Cashback assistance
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      24/7 monitoring
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