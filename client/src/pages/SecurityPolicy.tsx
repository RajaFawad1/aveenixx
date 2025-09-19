import { 
  Shield, 
  Lock, 
  Database,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Settings,
  Key,
  Server,
  Eye,
  UserCheck
} from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function SecurityPolicy() {
  const lastUpdated = "January 1, 2024";

  // Sub-navigation component
  const securityNavigation = (
    <>
      <button
        className="flex items-center space-x-2 py-2 px-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap text-white"
      >
        <Shield className="w-4 h-4" />
        <span>Security Policy</span>
      </button>
    </>
  );

  return (
    <MainEcommerceLayout 
      subtitle="Security Policy"
      showSearch={true}
      showEcommerceActions={false}
      showProductCategories={false}
      customSubNavContent={securityNavigation}
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
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Security & Data Protection
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive security framework protects your data with industry-leading encryption, access controls, and compliance standards.
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

          {/* Security Framework */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security Framework</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Security and Privacy</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  At Aveenix, we take the security and privacy of your personal information very seriously. To protect your data, we employ robust encryption measures. When you provide your personal information online, it is encrypted before being transmitted over the internet between your browser and our server. This encryption ensures that your data remains unreadable to any third party that may attempt to intercept or access it during transit.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  To further enhance the security of your information, we use a 128-bit Secure Socket Layer (SSL) connection for transmitting encrypted data. Our SSL connection is verified by a signed certificate from PayPal, certifying our authenticity and ensuring the integrity of your information.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Our Security Principles</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Zero-trust security model with continuous verification
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    End-to-end encryption for all data transmission
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Regular security audits and penetration testing
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    24/7 security monitoring and threat detection
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Security Technologies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                        <Lock className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">SSL/TLS Encryption</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">256-bit encryption for all data transmission</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                        <Key className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Multi-layer account protection</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Database className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Protection</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Data Encryption</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  All sensitive data is encrypted both in transit and at rest using AES-256 encryption. Our encryption keys are managed through secure key management systems with regular rotation schedules.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Data Storage</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your data is stored in secure, geographically distributed data centers with redundant backups. We maintain strict access controls and audit logs for all data access activities.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Data Retention</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We retain personal data only as long as necessary for the purposes outlined in our Privacy Policy. Data is securely deleted according to our retention schedules and legal requirements.
                </p>
              </section>
            </div>
          </div>

          {/* Access Control */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <UserCheck className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Access Control</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Authentication Requirements</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Strong authentication is required for all user accounts. We support multi-factor authentication and encourage users to enable additional security measures for enhanced protection.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Role-Based Access</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Access to systems and data is granted based on the principle of least privilege. Users receive only the minimum access necessary to perform their functions.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Account Security</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Password strength requirements and regular updates
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Account lockout protection against brute force attacks
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Session timeout and automatic logout features
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                    Suspicious activity monitoring and alerts
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Incident Response */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Incident Response</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Security Incident Handling</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We maintain a comprehensive incident response plan to quickly identify, contain, and resolve security incidents. Our security team is available 24/7 to respond to potential threats.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Notification Process</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  In the event of a security incident that may affect your data, we will notify affected users within 72 hours and provide clear information about the incident and steps being taken to resolve it.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Continuous Improvement</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We regularly review and update our security measures based on emerging threats, industry best practices, and lessons learned from incident responses.
                </p>
              </section>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Lock className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
              </div>
              
              <section>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  At Aveenix, we offer a variety of payment methods to ensure a convenient, secure, and seamless shopping experience. We accept payments through PayPal, Stripe, and major credit cards (Visa, MasterCard, Discover, and American Express). Additionally, we accept cash payments, cheque payments, and internet banking.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Credit Card Payments via PayPal</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  For credit card payments, we utilize PayPal, an internationally recognized and secure payment system. When you select PayPal, you will be directed to PayPal's secure website to enter your payment details. This ensures your credit card information remains safe, as Aveenix never stores or directly handles your credit card numbers.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  With PayPal, you also have the option to pay using your debit card or e-check (via your bank account), allowing for secure transfers and protecting your credit card details.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-3">How to Pay with PayPal:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Review your items in your shopping cart and proceed to checkout.</li>
                    <li>Choose PayPal as your payment method.</li>
                    <li>You will be redirected to PayPal's website.</li>
                    <li>Sign in to your PayPal account or create a new one if you don't have one.</li>
                    <li>Follow PayPal's on-screen instructions to complete your payment.</li>
                    <li>Once your transaction is accepted, you will be redirected back to the Aveenix website, where you will receive an order confirmation.</li>
                  </ol>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Credit Card Payments via Stripe</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We also offer secure payment processing through Stripe, another trusted and reliable payment gateway. When you select Stripe, your credit card information is encrypted and processed securely, in compliance with the highest data security standards.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-3">How to Pay with Stripe:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Review your items in your shopping cart and proceed to checkout.</li>
                    <li>Choose Stripe as your payment method.</li>
                    <li>Enter your credit card details directly on our website.</li>
                    <li>Your payment will be securely processed through Stripe's encrypted system.</li>
                    <li>Once your transaction is accepted, you will receive an order confirmation.</li>
                  </ol>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Why Choose PayPal or Stripe?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Both PayPal and Stripe offer traceable and secure transactions, providing you with added peace of mind. You can check the status of your payment at any time through your PayPal or Stripe account, ensuring transparency and an extra layer of security.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We prioritize your security and aim to provide a safe and easy checkout process. Thank you for choosing Aveenix!
                </p>
              </section>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Details</h2>
              </div>
              
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Name</h4>
                      <p className="text-gray-900 dark:text-white font-medium">AVEENIX GLOBAL LTD</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">NZBN</h4>
                      <p className="text-gray-900 dark:text-white font-medium">9429051284299</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">GST Number</h4>
                      <p className="text-gray-900 dark:text-white font-medium">139-002-016</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Incorporation Date</h4>
                      <p className="text-gray-900 dark:text-white font-medium">27th April 2023</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Number</h4>
                      <p className="text-gray-900 dark:text-white font-medium">02-1244-0211757-000</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Options</h4>
                      <p className="text-gray-900 dark:text-white font-medium">Credit Card / Internet Payments / Paypal / Stripe</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Compliance</h2>
              </div>
              
              <section>
                <h3 className="text-lg font-semibold mb-3">Regulatory Compliance</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We maintain compliance with applicable data protection regulations including GDPR, CCPA, and other regional privacy laws. Our compliance program includes regular audits and updates to policies and procedures.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We understand you may have questions or concerns about how we protect your personal information. Therefore, we encourage you to review our Terms and Conditions and Privacy Policy, which provide detailed information on our data protection procedures.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  If you have any questions or concerns about our payment methods or security measures, please do not hesitate to contact us. We are always available to provide you with additional information and assistance. Thank you for shopping with Aveenix!
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Industry Standards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">SOC 2 Type II</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Certified for security, availability, and confidentiality</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">ISO 27001</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Information security management system certification</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">PCI DSS</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Payment card industry data security standard</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">GDPR</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">General data protection regulation compliance</p>
                  </div>
                </div>
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
                  If you have security concerns or questions about our security practices, please contact us:
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

                  {/* Security Team */}
                  <div 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-opacity-50 text-center"
                    style={{ 
                      borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
                    }}
                    onClick={() => window.location.href = '/contact'}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Security Team</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Security concerns</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                      Report security issues
                    </p>
                    <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      24/7 monitoring
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