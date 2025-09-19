import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, FileText, Shield, Lock, Store, Map, ScrollText, CheckCircle, Loader2, Users, MapPin, Package, User, UserCircle, Bell, Headphones, ShoppingBag, LogOut, Globe, Languages, DollarSign, Settings, Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { legalPolicies } from '@/lib/policies';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/components/providers/AuthProvider';
import LoginModal from '../auth/LoginModal';
import OrdersModal from '../orders/OrdersModal';

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const { colorTheme, theme, setTheme, setColorTheme } = useTheme();
  const [location, setLocation] = useLocation();
  
  // Real authentication state
  const { isLoggedIn, user, logout } = useAuth();
  
  // Mock language/country data
  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
  ];
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  ];
  
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  
  // remove mock logout
  
  const closeMenu = () => {
    setOpenSections({});
  };

  // Force CSS variable refresh when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const currentClass = `theme-${colorTheme}`;
    root.classList.remove(currentClass);
    requestAnimationFrame(() => {
      root.classList.add(currentClass);
    });
  }, [colorTheme]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle newsletter signup
  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setEmailError('');
    
    // Validate email
    if (!newsletterEmail.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(newsletterEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setNewsletterStatus('loading');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setNewsletterStatus('success');
      setNewsletterEmail('');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setNewsletterStatus('idle');
      }, 3000);
    } catch (error) {
      setNewsletterStatus('error');
      setEmailError('Failed to subscribe. Please try again.');
    }
  };
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      {/* Newsletter Section */}
      <div className="text-gray-900 dark:text-white py-3" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="mx-auto px-4 max-w-full md:max-w-1500">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <span className="font-bold text-lg ml-2 text-gray-900 dark:text-white">AVEENIX</span>
              <i className="fas fa-envelope text-base ml-3 text-gray-900 dark:text-white"></i>
            </div>
            <div className="text-center mb-3">
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">Sign up to Newsletter</span>
                <span className="mx-1 text-gray-900 dark:text-white">and receive</span>
                <span className="font-bold text-gray-900 dark:text-white" style={{ textDecoration: 'underline', textDecorationColor: 'var(--primary-color)' }}>$20 coupon</span>
              </div>
              <div className="text-sm text-gray-900 dark:text-white">for first shopping</div>
            </div>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <div className="flex rounded-full bg-white dark:bg-gray-700 shadow-lg overflow-hidden">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={newsletterStatus === 'loading'}
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className={`px-5 py-2.5 text-sm rounded-full font-semibold whitespace-nowrap transition-all duration-200 flex items-center ${
                    newsletterStatus === 'success' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-black text-white hover:text-[var(--hover-color)]'
                  }`}
                >
                  {newsletterStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : newsletterStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Success!
                    </>
                  ) : (
                    'Get it Now'
                  )}
                </button>
              </div>
              {emailError && (
                <p className="text-red-500 text-xs text-center">{emailError}</p>
              )}
            </form>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">AVEENIX</span>
              <i className="fas fa-envelope text-base ml-4 text-gray-900 dark:text-white"></i>
              <span className="font-medium text-base text-gray-900 dark:text-white">Sign up to Newsletter</span>
              <span className="text-base text-gray-900 dark:text-white">...and receive</span>
              <span className="font-bold text-base text-gray-900 dark:text-white" style={{ textDecoration: 'underline', textDecorationColor: 'var(--primary-color)' }}>$20 coupon</span>
              <span className="text-base text-gray-900 dark:text-white">for first shopping</span>
            </div>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col">
              <div className="flex rounded-full bg-white dark:bg-gray-700 shadow-lg overflow-hidden">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 w-52 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={newsletterStatus === 'loading'}
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className={`px-5 py-2.5 text-sm rounded-full font-semibold whitespace-nowrap transition-all duration-200 flex items-center ${
                    newsletterStatus === 'success' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-black text-white hover:text-[var(--hover-color)]'
                  }`}
                >
                  {newsletterStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : newsletterStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Success!
                    </>
                  ) : (
                    'Get it Now'
                  )}
                </button>
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-6">
        <div className="mx-auto px-4 max-w-full md:max-w-1500">
          {/* Mobile Accordion Layout */}
          <div className="block md:hidden space-y-3">
            {/* Company Accordion */}
            <div>
              <button
                onClick={() => toggleSection('company')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left font-semibold text-white rounded-lg transition-all duration-200 hover-color-bg ${
                  openSections.company ? '' : 'bg-gray-800 dark:bg-gray-800'
                }`}
                style={openSections.company ? { backgroundColor: 'var(--primary-color)' } : { backgroundColor: '' }}
              >
                <span>Company</span>
                {openSections.company ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
              </button>
              {openSections.company && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4">
                  <ul className="space-y-3">
                    <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>About Us</Link></li>
                    <li><Link href="/community" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Community</Link></li>
                    <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Contact</Link></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Services Accordion */}
            <div>
              <button
                onClick={() => toggleSection('services')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left font-semibold text-white rounded-lg transition-all duration-200 hover-color-bg ${
                  openSections.services ? '' : 'bg-gray-800 dark:bg-gray-800'
                }`}
                style={openSections.services ? { backgroundColor: 'var(--primary-color)' } : { backgroundColor: '' }}
              >
                <span>Services</span>
                {openSections.services ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
              </button>
              {openSections.services && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4">
                  <ul className="space-y-3">
                    <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Business</a></li>
                    <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Digital</a></li>
                    <li><a href="https://www.aveenixdomains.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Domains</a></li>
                    <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Hosting</a></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Support Accordion */}
            <div>
              <button
                onClick={() => toggleSection('support')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left font-semibold text-white rounded-lg transition-all duration-200 hover-color-bg ${
                  openSections.support ? '' : 'bg-gray-800 dark:bg-gray-800'
                }`}
                style={openSections.support ? { backgroundColor: 'var(--primary-color)' } : { backgroundColor: '' }}
              >
                <span>Support</span>
                {openSections.support ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
              </button>
              {openSections.support && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4">
                  <ul className="space-y-3">
                    <li><button onClick={() => { setIsOrdersOpen(true); closeMenu(); }} className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm w-full text-left"><span className="hover-color-text mr-2">»</span>My Orders</button></li>
                    <li><Link href="/shop" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm" onClick={closeMenu}><span className="hover-color-text mr-2">»</span>Sellers</Link></li>
                    <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Site Map</a></li>
                    <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span>Store Locator</a></li>
                    <li><Link href="/track-order" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm" onClick={closeMenu}><span className="hover-color-text mr-2">»</span>Track Order</Link></li>
                  </ul>
                </div>
              )}
            </div>


            {/* Account Accordion */}
            <div>
              <button
                onClick={() => toggleSection('account')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left font-semibold text-white rounded-lg transition-all duration-200 hover-color-bg ${
                  openSections.account ? '' : 'bg-gray-800 dark:bg-gray-800'
                }`}
                style={openSections.account ? { backgroundColor: 'var(--primary-color)' } : { backgroundColor: '' }}
              >
                <span>Account</span>
                {openSections.account ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
              </button>
              {openSections.account && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4">
                  <div className="space-y-3">
                    {isLoggedIn ? (
                      <>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 py-1.5 px-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="w-4 h-4 mr-2 rounded-full"
                            />
                          ) : (
                            <UserCircle className="w-4 h-4 mr-2 theme-color" />
                          )}
                          <span className="flex-1 font-medium">Welcome, {user?.name}!</span>
                        </div>
                        <button 
                          onClick={() => { setLocation('/account'); closeMenu(); }}
                          className="flex items-center text-gray-600 dark:text-gray-300 hover-theme-color transition-colors py-1.5 px-2 rounded-lg w-full text-left text-sm"
                        >
                          <User className="w-4 h-4 mr-2 theme-color" />
                          <span className="flex-1">My Account</span>
                        </button>
                        <button 
                          onClick={logout}
                          className="flex items-center text-gray-600 dark:text-gray-300 hover-theme-color transition-colors py-1.5 px-2 rounded-lg w-full text-left text-sm"
                        >
                          <LogOut className="w-4 h-4 mr-2 theme-color" />
                          <span className="flex-1">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setIsLoginOpen(true); closeMenu(); }}
                          className="flex items-center text-gray-600 dark:text-gray-300 hover-theme-color transition-colors py-1.5 px-2 rounded-lg w-full text-left text-sm"
                        >
                          <User className="w-4 h-4 mr-2 theme-color" />
                          <span className="flex-1">Login</span>
                        </button>
                        <button 
                          onClick={() => { setIsLoginOpen(true); closeMenu(); }}
                          className="flex items-center text-gray-600 dark:text-gray-300 hover-theme-color transition-colors py-1.5 px-2 rounded-lg w-full text-left text-sm"
                        >
                          <UserCircle className="w-4 h-4 mr-2 theme-color" />
                          <span className="flex-1">My Account</span>
                        </button>
                        <button 
                          onClick={() => { setLocation('/contact'); closeMenu(); }}
                          className="flex items-center text-gray-600 dark:text-gray-300 hover-theme-color transition-colors py-1.5 px-2 rounded-lg w-full text-left text-sm"
                        >
                          <Headphones className="w-4 h-4 mr-2 theme-color" />
                          <span className="flex-1">Contact</span>
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => { setLocation('/notifications'); closeMenu(); }}
                      className="flex items-center text-gray-600 dark:text-gray-300 hover-theme-color transition-colors py-1.5 px-2 rounded-lg w-full text-left text-sm"
                    >
                      <Bell className="w-4 h-4 mr-2 theme-color" />
                      <span className="flex-1">Notifications</span>
                    </button>

                  </div>
                </div>
              )}
            </div>



            {/* Legal Accordion */}
            <div>
              <button
                onClick={() => toggleSection('legal')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left font-semibold text-white rounded-lg transition-all duration-200 hover-color-bg ${
                  openSections.legal ? '' : 'bg-gray-800 dark:bg-gray-800'
                }`}
                style={openSections.legal ? { backgroundColor: 'var(--primary-color)' } : { backgroundColor: '' }}
              >
                <span>Legal</span>
                {openSections.legal ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
              </button>
              {openSections.legal && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4">
                  <ul className="space-y-3">
                    {legalPolicies.map((policy) => {
                      const IconComponent = policy.icon;
                      return (
                        <li key={policy.id}>
                          <Link 
                            href={policy.href} 
                            className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"
                            onClick={closeMenu}
                          >
                            <IconComponent className="w-4 h-4 mr-2 theme-color" />
                            <span className="flex-1">{policy.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Settings Accordion */}
            <div>
              <button
                onClick={() => toggleSection('settings')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left font-semibold text-white rounded-lg transition-all duration-200 hover-color-bg ${
                  openSections.settings ? '' : 'bg-gray-800 dark:bg-gray-800'
                }`}
                style={openSections.settings ? { backgroundColor: 'var(--primary-color)' } : { backgroundColor: '' }}
              >
                <span>Settings</span>
                {openSections.settings ? <ChevronDown size={16} className="text-white" /> : <ChevronRight size={16} className="text-white" />}
              </button>
              {openSections.settings && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4">
                  <div className="space-y-3">
                    {/* Country Selector */}
                    <div className="py-1.5 px-2 rounded-lg transition-all duration-200">
                      <button 
                        onClick={() => toggleSection('countrySelector')}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 theme-color" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Country</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{selectedCountry.flag}</span>
                          <span className="text-sm text-gray-500">{selectedCountry.code}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openSections.countrySelector ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      
                      {openSections.countrySelector && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-gray-600 max-h-40 overflow-y-auto">
                          <div className="space-y-1">
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                onClick={() => {
                                  setSelectedCountry(country);
                                  toggleSection('countrySelector');
                                }}
                                className={`w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                  selectedCountry.code === country.code ? 'bg-gray-100 dark:bg-gray-700' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-2.5">
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{country.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">{country.code}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Language Selector */}
                    <div className="py-1.5 px-2 rounded-lg transition-all duration-200">
                      <button 
                        onClick={() => toggleSection('languageSelector')}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center">
                          <Languages className="w-4 h-4 mr-2 theme-color" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Language</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{selectedLanguage.flag}</span>
                          <span className="text-sm text-gray-500">{selectedLanguage.name}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openSections.languageSelector ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      
                      {openSections.languageSelector && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-gray-600 max-h-40 overflow-y-auto">
                          <div className="space-y-1">
                            {languages.map((language) => (
                              <button
                                key={language.code}
                                onClick={() => {
                                  setSelectedLanguage(language);
                                  toggleSection('languageSelector');
                                }}
                                className={`w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                  selectedLanguage.code === language.code ? 'bg-gray-100 dark:bg-gray-700' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-2.5">
                                  <span className="text-lg">{language.flag}</span>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{language.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">{language.code}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Currency Selector */}
                    <div className="py-1.5 px-2 rounded-lg transition-all duration-200">
                      <button 
                        onClick={() => toggleSection('currencySelector')}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 theme-color" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Currency</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">USD</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openSections.currencySelector ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      
                      {openSections.currencySelector && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-gray-600">
                          <div className="space-y-1">
                            {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'].map((currency) => (
                              <button
                                key={currency}
                                onClick={() => {
                                  toggleSection('currencySelector');
                                }}
                                className="w-full flex items-center p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <span className="text-sm text-gray-700 dark:text-gray-300">{currency}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Dark Mode Toggle */}
                    <div className="py-1.5 px-2 rounded-lg transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {theme === 'dark' ? (
                            <Moon className="w-4 h-4 mr-2 theme-color" />
                          ) : (
                            <Sun className="w-4 h-4 mr-2 theme-color" />
                          )}
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Dark Mode</span>
                        </div>
                        <button
                          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            theme === 'dark' 
                              ? 'bg-gray-600 focus:ring-gray-500' 
                              : 'bg-gray-200 focus:ring-gray-400'
                          }`}
                          style={theme === 'dark' ? { backgroundColor: 'var(--primary-color)' } : {}}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                              theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    {/* Color Theme Selector */}
                    <div className="py-1.5 px-2 rounded-lg transition-all duration-200">
                      <button 
                        onClick={() => toggleSection('colorThemeSelector')}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center">
                          <Palette className="w-4 h-4 mr-2 theme-color" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">Color Theme</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                          />
                          <span className="text-sm text-gray-500 capitalize">{colorTheme}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openSections.colorThemeSelector ? 'rotate-180' : ''}`} />
                        </div>
                      </button>
                      
                      {openSections.colorThemeSelector && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-gray-600">
                          {/* Popular Colors */}
                          <div className="mb-4">
                            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Popular</h4>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { value: 'yellow', name: 'Yellow', color: 'hsl(43, 96%, 56%)' },
                                { value: 'blue', name: 'Blue', color: 'hsl(217, 91%, 60%)' },
                                { value: 'green', name: 'Green', color: 'hsl(160, 84%, 39%)' },
                                { value: 'purple', name: 'Purple', color: 'hsl(262, 83%, 58%)' },
                                { value: 'red', name: 'Red', color: 'hsl(0, 84%, 60%)' },
                                { value: 'orange', name: 'Orange', color: 'hsl(21, 90%, 48%)' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setColorTheme(option.value as any);
                                    toggleSection('colorThemeSelector');
                                  }}
                                  className={`group flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                                    colorTheme === option.value ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-blue-400' : ''
                                  }`}
                                >
                                  <div 
                                    className="w-10 h-10 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200 flex items-center justify-center"
                                    style={{ backgroundColor: option.color }}
                                  >
                                    <Palette className="w-4 h-4 text-white opacity-90" />
                                  </div>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                                    {option.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Extended Palette */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Extended Palette</h4>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { value: 'teal', name: 'Teal', color: 'hsl(173, 58%, 39%)' },
                                { value: 'indigo', name: 'Indigo', color: 'hsl(231, 48%, 48%)' },
                                { value: 'pink', name: 'Pink', color: 'hsl(328, 85%, 70%)' },
                                { value: 'lime', name: 'Lime', color: 'hsl(84, 81%, 44%)' },
                                { value: 'cyan', name: 'Cyan', color: 'hsl(188, 78%, 41%)' },
                                { value: 'amber', name: 'Amber', color: 'hsl(43, 96%, 56%)' },
                                { value: 'emerald', name: 'Emerald', color: 'hsl(160, 84%, 39%)' },
                                { value: 'violet', name: 'Violet', color: 'hsl(258, 90%, 66%)' },
                                { value: 'rose', name: 'Rose', color: 'hsl(330, 81%, 60%)' },
                                { value: 'sky', name: 'Sky', color: 'hsl(200, 98%, 39%)' },
                                { value: 'fuchsia', name: 'Fuchsia', color: 'hsl(292, 84%, 61%)' },
                                { value: 'slate', name: 'Slate', color: 'hsl(215, 16%, 47%)' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setColorTheme(option.value as any);
                                    toggleSection('colorThemeSelector');
                                  }}
                                  className={`group flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                                    colorTheme === option.value ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-blue-400' : ''
                                  }`}
                                >
                                  <div 
                                    className="w-10 h-10 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200 flex items-center justify-center"
                                    style={{ backgroundColor: option.color }}
                                  >
                                    <Palette className="w-4 h-4 text-white opacity-90" />
                                  </div>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                                    {option.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {/* Company */}
            <div>
              <h3 className="text-base font-bold underline mb-4 text-gray-800 dark:text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">About Us</span></Link></li>
                <li><Link href="/community" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Community</span></Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Contact</span></Link></li>
              </ul>
            </div>

            {/* Services Column 1 */}
            <div>
              <h3 className="text-base font-bold underline mb-4 text-gray-800 dark:text-white">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Business</span></a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Digital</span></a></li>
                <li><a href="https://www.aveenixdomains.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Domains</span></a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Hosting</span></a></li>
              </ul>
            </div>

            {/* Services Column 2 */}
            <div>
              <h3 className="text-base font-bold underline mb-4 text-gray-800 dark:text-white">Services</h3>
              <ul className="space-y-2">
                <li><Link href="/account" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">My Account</span></Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Contact</span></Link></li>
                <li><Link href="/returns" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Returns/Exchange</span></Link></li>
                <li><a href="/contact#faq" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">FAQs</span></a></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Product Support</span></Link></li>
              </ul>
            </div>

            {/* Services Column 3 */}
            <div>
              <h3 className="text-base font-bold underline mb-4 text-gray-800 dark:text-white">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">My Account</span></a></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Contact</span></Link></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Returns/Exchange</span></a></li>
                <li><a href="/contact#faq" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">FAQs</span></a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Product Support</span></a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-base font-bold underline mb-4 text-gray-800 dark:text-white">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/my-orders" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">My Orders</span></Link></li>
                <li><Link href="/sellers" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Sellers</span></Link></li>
                <li><Link href="/sitemap" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Site Map</span></Link></li>
                <li><Link href="/store-locator" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Store Locator</span></Link></li>
                <li><Link href="/track-order" className="text-gray-600 dark:text-gray-300 hover-theme-color transition-colors flex items-center text-sm"><span className="hover-color-text mr-2">»</span><span className="hover:underline">Track Order</span></Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media & App Store */}
          <div className="mt-4 pt-3">
            <div className="flex flex-col md:flex-row justify-between items-center">
              
              {/* Social Media Icons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-3 md:mb-0">
                <a href="#" className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-pink-600 dark:hover:bg-pink-500 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-red-600 dark:hover:bg-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-blue-400 dark:hover:bg-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-red-600 dark:hover:bg-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>

              {/* App Store Badges - Mobile: Vertical Stack, Desktop: Horizontal */}
              <div className="flex flex-col md:flex-row justify-center md:justify-end gap-1.5 w-full md:w-auto mx-auto md:mx-0 mb-3 md:mb-0">
                <a href="#" className="bg-black text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 border border-gray-600 dark:border-gray-500 hover:border-[var(--hover-color)] hover:shadow-lg hover:shadow-[var(--hover-color)]/20 transition-all duration-200 w-full md:w-auto md:min-w-[140px] hover:text-[var(--hover-color)] transform hover:scale-105">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                  <span className="text-sm font-medium whitespace-nowrap">Download on App Store</span>
                </a>
                <a href="#" className="bg-black text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 border border-gray-600 dark:border-gray-500 hover:border-[var(--hover-color)] hover:shadow-lg hover:shadow-[var(--hover-color)]/20 transition-all duration-200 w-full md:w-auto md:min-w-[140px] hover:text-[var(--hover-color)] transform hover:scale-105">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <span className="text-sm font-medium whitespace-nowrap">Get it on Google Play</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 py-3">
        <div className="mx-auto px-4 max-w-full md:max-w-1500">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="hidden md:flex space-x-6 mb-1 md:mb-0">
              {legalPolicies.slice(0, 3).map((policy) => {
                const IconComponent = policy.icon;
                return (
                  <Link 
                    key={policy.id}
                    href={policy.href} 
                    className="text-gray-600 dark:text-gray-400 hover-theme-color transition-colors flex items-center"
                  >
                    <IconComponent className="w-4 h-4 mr-1" />
                    {policy.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center w-full md:w-auto">
              <p className="text-gray-600 dark:text-gray-400">
                © 2025 AVEENIX. All rights reserved.
              </p>
            </div>
            
            <div className="hidden md:flex space-x-6 mt-4 md:mt-0">
              {legalPolicies.slice(3, 6).map((policy) => {
                const IconComponent = policy.icon;
                return (
                  <Link 
                    key={policy.id}
                    href={policy.href} 
                    className="text-gray-600 dark:text-gray-400 hover-theme-color transition-colors flex items-center"
                  >
                    <IconComponent className="w-4 h-4 mr-1" />
                    {policy.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      
      {/* Orders Modal */}
      <OrdersModal 
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </footer>
  );
}
