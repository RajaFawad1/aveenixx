import { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Headphones,
  Send,
  Globe,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Zap,
  Shield,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  TrendingUp,
  Calendar,
  Play,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ticketingService } from '@/lib/customerSupport';
import { faqData, faqCategories, getFAQsByCategory } from '@/lib/faqData';
import { contactMethods, offices, businessHours } from '@/lib/contactData';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
  counter: number;
}

function StatCard({ icon: Icon, value, suffix, label, color, counter }: StatCardProps) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {counter}{suffix}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</div>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeFAQCategory, setActiveFAQCategory] = useState('all');
  const [hoveredOffice, setHoveredOffice] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [supportAvailable, setSupportAvailable] = useState(true);

  // Handle #faq fragment in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#faq') {
      setActiveTab('faq');
    }
  }, []);

  // Load draft on component mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate support availability check
  useEffect(() => {
    const checkSupportAvailability = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // Business hours: Mon-Fri 8-18, Sat 10-16, Sun closed
      const isBusinessHours = (day >= 1 && day <= 5 && hour >= 8 && hour < 18) ||
                             (day === 6 && hour >= 10 && hour < 16);
      
      setSupportAvailable(isBusinessHours);
    };
    
    checkSupportAvailability();
    const interval = setInterval(checkSupportAvailability, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Filter FAQs based on search and category
  const filteredFAQs = getFAQsByCategory(activeFAQCategory).filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-save draft after 1 second delay
    setTimeout(() => {
      saveDraft();
    }, 1000);
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (formData.message && formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    if (formData.category === 'urgent' && !formData.phone.trim()) {
      errors.phone = 'Phone number is required for urgent support';
    }
    if (formData.phone && !/^\+?[\d\s\-\(\)\.]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveDraft = () => {
    if (formData.name || formData.email || formData.subject || formData.message) {
      localStorage.setItem('contactFormDraft', JSON.stringify(formData));
      setIsDraftSaved(true);
      setLastSavedTime(new Date());
      setTimeout(() => setIsDraftSaved(false), 2000);
    }
  };

  const loadDraft = () => {
    const saved = localStorage.getItem('contactFormDraft');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setFormData(parsedData);
      setLastSavedTime(new Date());
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('contactFormDraft');
    setLastSavedTime(null);
  };

  const handleLiveChatClick = () => {
    // Always trigger the Jarvis chat popup - AI is always available
    window.dispatchEvent(new CustomEvent('openJarvisChat', { 
      detail: { question: 'I need support assistance' } 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create support ticket from contact form
      const ticketData = {
        title: formData.subject,
        description: formData.message,
        priority: (formData.category === 'urgent' ? 'urgent' : 
                  formData.category === 'technical' ? 'high' : 'medium') as 'urgent' | 'high' | 'medium' | 'low',
        category: formData.category,
        customer: {
          id: 'contact-form',
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        tags: ['contact-form', formData.category],
        status: 'open' as 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
      };

      // Create ticket via API
      const ticket = await ticketingService.createTicket(ticketData);
      
      console.log('Support ticket created:', ticket);
      
      // Success state
      setShowSuccessMessage(true);
      clearDraft();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general',
        phone: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Interactive handler functions
  const handlePhoneClick = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmailClick = (email: string) => {
    setActiveTab('form');
  };

  const handleMapClick = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const handleScheduleCall = () => {
    setFormData(prev => ({ ...prev, category: 'schedule-call', subject: 'Schedule a Call Request' }));
    setActiveTab('form');
  };

  const handleRequestDemo = () => {
    setFormData(prev => ({ ...prev, category: 'demo-request', subject: 'Demo Request' }));
    setActiveTab('form');
  };

  const handleGetQuote = () => {
    setFormData(prev => ({ ...prev, category: 'quote-request', subject: 'Quote Request' }));
    setActiveTab('form');
  };

  const handleReportIssue = () => {
    setFormData(prev => ({ ...prev, category: 'technical', subject: 'Issue Report' }));
    setActiveTab('form');
  };



  // Counter animation hooks - moved to top level to avoid conditional hook calls
  const useCounterAnimation = (targetValue: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (activeTab === 'contact') {
        setCount(0); // Reset count when switching to contact tab
        const increment = targetValue / (duration / 50);
        let currentValue = 0;
        
        countRef.current = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            setCount(targetValue);
            if (countRef.current) clearInterval(countRef.current);
          } else {
            setCount(Math.floor(currentValue));
          }
        }, 50);
      } else {
        setCount(targetValue); // Show final value when not on contact tab
      }

      return () => {
        if (countRef.current) clearInterval(countRef.current);
      };
    }, [activeTab, targetValue, duration]);

    return count;
  };

  // Call all counter animations at the top level
  const customerCounter = useCounterAnimation(50, 2000);
  const responseTimeCounter = useCounterAnimation(2, 1500);
  const satisfactionCounter = useCounterAnimation(99, 2500);
  const supportCounter = useCounterAnimation(24, 1800);

  const contactNavigation = (
    <>
      {[
        { id: 'contact', label: 'Contact & Offices', icon: Phone },
        { id: 'form', label: 'Send Message', icon: Send },
        { id: 'faq', label: 'FAQ', icon: MessageSquare }
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
      showSearch={true} 
      showEcommerceActions={false} 
      showProductCategories={false}
      subtitle="Contact"
      customSubNavContent={contactNavigation}
    >
      
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
                {activeTab === 'contact' && <MessageSquare className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />}
                {activeTab === 'form' && <Send className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />}
                {activeTab === 'faq' && <HelpCircle className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              {activeTab === 'contact' && "We're Here to Help"}
              {activeTab === 'form' && "Send Message"}
              {activeTab === 'faq' && "FAQ"}
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {activeTab === 'contact' && "Get instant support from our expert team. We're available 24/7 to assist you with any questions or concerns."}
              {activeTab === 'form' && "Have a question or need assistance? Send us a message and we'll get back to you as soon as possible."}
              {activeTab === 'faq' && "Find answers to commonly asked questions about our services, policies, and support options."}
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-bounce delay-500" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full animate-ping delay-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
      </div>

      {/* Mobile Navigation Buttons - Only visible on mobile */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => setActiveTab('contact')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 text-sm font-semibold transition-all duration-200 rounded-lg ${
                activeTab === 'contact'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={activeTab === 'contact' ? { backgroundColor: 'var(--primary-color)' } : {}}
            >
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Button>
            
            <Button 
              onClick={() => setActiveTab('form')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 text-sm font-semibold transition-all duration-200 rounded-lg ${
                activeTab === 'form'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={activeTab === 'form' ? { backgroundColor: 'var(--primary-color)' } : {}}
            >
              <Send className="w-4 h-4" />
              <span>Message</span>
            </Button>
            
            <Button 
              onClick={() => setActiveTab('faq')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 text-sm font-semibold transition-all duration-200 rounded-lg ${
                activeTab === 'faq'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={activeTab === 'faq' ? { backgroundColor: 'var(--primary-color)' } : {}}
            >
              <MessageSquare className="w-4 h-4" />
              <span>FAQ</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-8">
        {/* Contact & Offices Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            {/* Our Office Location & Business Hours */}
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white">
                Our Office Location & Business Hours
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl">
                {/* Office Location */}
                {offices.map((office, index) => (
                  <Card 
                    key={index} 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 bg-white dark:bg-gray-800"
                    style={{ 
                      borderColor: hoveredOffice === office.city 
                        ? 'var(--primary-color)' 
                        : 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)',
                      transform: hoveredOffice === office.city ? 'scale(1.02)' : 'scale(1)'
                    }}
                    onMouseEnter={() => setHoveredOffice(office.city)}
                    onMouseLeave={() => setHoveredOffice(null)}
                  >
                    <CardHeader className="rounded-t-lg py-3 px-4" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}>
                      <CardTitle className="flex items-center text-lg">
                        <MapPin className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                        {office.city}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">Address</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">{office.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">Phone</p>
                          <button 
                            onClick={() => handlePhoneClick(office.phone)}
                            className="text-xs hover:underline cursor-pointer transition-colors"
                            style={{ color: 'var(--primary-color)' }}
                          >
                            {office.phone}
                          </button>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <Button 
                          className="w-full h-9 text-white hover:opacity-90 transition-opacity" 
                          style={{ backgroundColor: 'var(--primary-color)' }}
                          onClick={() => setActiveTab('form')}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                        <Button 
                          className="w-full h-9" 
                          variant="outline"
                          onClick={() => handleMapClick(office.address)}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          View on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Business Hours Card */}
                <Card className="border-2" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)' }}>
                  <CardHeader className="rounded-t-lg py-3 px-4" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Monday - Friday</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{businessHours.weekdays}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Saturday</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{businessHours.saturday}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Sunday</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{businessHours.sunday}</span>
                      </div>
                      
                      {/* Live Chat Button */}
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                        <Button 
                          className="w-full text-white hover:opacity-90 transition-opacity h-9"
                          style={{ backgroundColor: 'var(--primary-color)' }}
                          onClick={handleLiveChatClick}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {supportAvailable ? 'Start Live Chat' : 'Leave Message'}
                        </Button>
                      </div>
                      
                      <div className="rounded-lg p-4 mt-4" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}>
                        <div className="flex items-center justify-between" style={{ color: 'var(--primary-color)' }}>
                          <div className="flex items-center">
                            <Globe className="w-5 h-5 mr-3" />
                            <span className="font-medium">{businessHours.onlineSupport}</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${supportAvailable ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                            <span className="text-sm">
                              {supportAvailable ? 'Available Now' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="border-2" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)' }}>
                  <CardHeader className="rounded-t-lg py-3 px-4" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}>
                    <CardTitle className="flex items-center text-lg">
                      <Zap className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Button 
                        className="w-full justify-start text-white hover:opacity-90 transition-opacity h-9"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                        onClick={handleScheduleCall}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule a Call
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start hover:bg-opacity-10 h-9"
                        style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                        onClick={handleRequestDemo}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Request Demo
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start hover:bg-opacity-10 h-9"
                        style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                        onClick={handleGetQuote}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Get Quote
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start hover:bg-opacity-10 h-9"
                        style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                        onClick={handleReportIssue}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Report Issue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats Section */}
            <div className="rounded-xl p-6 border" style={{ 
              backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)',
              borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
            }}>
              <div className="text-center mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Why Choose Our Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We're committed to providing exceptional customer service
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard 
                  icon={Users} 
                  value={50000} 
                  suffix="K+" 
                  label="Happy Customers" 
                  color="blue"
                  counter={customerCounter}
                />
                <StatCard 
                  icon={Zap} 
                  value={2} 
                  suffix=" min" 
                  label="Avg Response Time" 
                  color="green"
                  counter={responseTimeCounter}
                />
                <StatCard 
                  icon={Award} 
                  value={99} 
                  suffix="%" 
                  label="Satisfaction Rate" 
                  color="purple"
                  counter={satisfactionCounter}
                />
                <StatCard 
                  icon={Shield} 
                  value={24} 
                  suffix="/7" 
                  label="Support Available" 
                  color="orange"
                  counter={supportCounter}
                />
              </div>
            </div>

            {/* Contact Methods Grid */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Choose Your Preferred Contact Method
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                  We offer multiple ways to connect with our support team. Select the method that works best for you.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  
                  const handleMethodClick = () => {
                    switch(method.title) {
                      case 'Email Support':
                        setActiveTab('form');
                        break;
                      case 'Phone Support':
                        window.open(`tel:${method.contact}`, '_blank');
                        break;
                      case 'Live Chat':
                        handleLiveChatClick();
                        break;
                      case 'Help Center':
                        setActiveTab('faq');
                        break;
                      default:
                        console.log('Contact method clicked:', method.title);
                    }
                  };
                  
                  return (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 bg-white dark:bg-gray-800" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)' }} onClick={handleMethodClick}>
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                          {method.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {method.description}
                        </p>
                        <Button 
                          className="w-full mb-3 text-white hover:opacity-90 transition-opacity text-sm py-2" 
                          style={{ backgroundColor: 'var(--primary-color)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMethodClick();
                          }}
                        >
                          {method.contact}
                        </Button>
                        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {method.response}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Contact Form Tab */}
        {activeTab === 'form' && (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-2 bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}>
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--primary-color)' }}>
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  Send us a Message
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {/* Success Message */}
                {showSuccessMessage && (
                  <div className="mb-5 p-4 rounded-lg border-2 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">Message Sent Successfully!</p>
                        <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                          Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Draft Status */}
                {lastSavedTime && !showSuccessMessage && (
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Draft saved at {lastSavedTime.toLocaleTimeString()}
                    </span>
                    {isDraftSaved && (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Auto-saved
                      </span>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`mt-2 h-12 ${formErrors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`mt-2 h-12 ${formErrors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email address"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-base font-medium">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-2 block w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      style={{ 
                        '--tw-ring-color': 'var(--primary-color)',
                        'borderColor': 'var(--primary-color)' 
                      } as React.CSSProperties}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="schedule-call">Schedule a Call</option>
                      <option value="demo-request">Request Demo</option>
                      <option value="quote-request">Get Quote</option>
                      <option value="technical">Report Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="sales">Sales Question</option>
                      <option value="urgent">Urgent Support</option>
                    </select>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formData.category === 'urgent' && '⚡ Urgent: 2-4 hours response time'}
                      {formData.category === 'schedule-call' && '📞 Schedule Call: We will contact you within 4 hours to arrange a call'}
                      {formData.category === 'demo-request' && '🎯 Demo Request: We will schedule your demo within 24 hours'}
                      {formData.category === 'quote-request' && '💰 Quote Request: Custom pricing within 24 hours'}
                      {formData.category === 'technical' && '🔧 Issue Report: 2-4 hours response time for technical issues'}
                      {formData.category === 'billing' && '💳 Billing: 8-24 hours response time'}
                      {formData.category === 'sales' && '💼 Sales: 2-6 hours response time'}
                      {formData.category === 'general' && '📧 General: 24 hours response time'}
                    </p>
                  </div>

                  {/* Conditional Phone Number for Urgent Support and Schedule Call */}
                  {(formData.category === 'urgent' || formData.category === 'schedule-call') && (
                    <div>
                      <Label htmlFor="phone" className="text-base font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        required={formData.category === 'urgent' || formData.category === 'schedule-call'}
                        className={`mt-2 h-12 ${formErrors.phone ? 'border-red-500' : ''}`}
                        placeholder={formData.category === 'schedule-call' ? 'Enter your phone number for the scheduled call' : 'Enter your phone number for urgent support'}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                        {formData.category === 'schedule-call' ? 
                          '📞 We will call you at this number to schedule your consultation' : 
                          '📞 For urgent support, we may call you directly to resolve the issue faster'
                        }
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="subject" className="text-base font-medium">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`mt-2 h-12 ${formErrors.subject ? 'border-red-500' : ''}`}
                      placeholder="Brief description of your inquiry"
                    />
                    {formErrors.subject && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-base font-medium">
                      Message
                      <span className="text-sm text-gray-500 ml-2">
                        ({formData.message.length}/1000 characters)
                      </span>
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={8}
                      maxLength={1000}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className={`mt-2 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${formErrors.message ? 'border-red-500' : ''}`}
                      style={{ 
                        '--tw-ring-color': 'var(--primary-color)',
                        'borderColor': formErrors.message ? '#ef4444' : 'var(--primary-color)' 
                      } as React.CSSProperties}
                      placeholder="Please describe your inquiry in detail..."
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  {/* File Attachment */}
                  {(formData.category === 'support' || formData.category === 'urgent') && (
                    <div>
                      <Label htmlFor="attachment" className="text-base font-medium">
                        Attachment <span className="text-gray-500">(Optional)</span>
                      </Label>
                      <input
                        id="attachment"
                        name="attachment"
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx"
                        className="mt-2 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:cursor-pointer hover:file:opacity-80"
                        style={{ 
                          '--file-bg': 'var(--primary-color)'
                        } as React.CSSProperties}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        📎 Attach screenshots, error logs, or documents to help us understand your issue better
                      </p>
                    </div>
                  )}

                  {/* Quick Help Section */}
                  {formData.category !== 'general' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Quick Help</h4>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        {formData.category === 'urgent' && (
                          <div>
                            <p>• Have you tried restarting the application?</p>
                            <p>• Check our <a href="/faq" className="underline">FAQ section</a> for common urgent issues</p>
                            <p>• Include error messages or screenshots if possible</p>
                          </div>
                        )}
                        {formData.category === 'support' && (
                          <div>
                            <p>• Describe the steps you took before the issue occurred</p>
                            <p>• Include your browser version and operating system</p>
                            <p>• Mention if this is a recurring issue</p>
                          </div>
                        )}
                        {formData.category === 'billing' && (
                          <div>
                            <p>• Have your account details and invoice numbers ready</p>
                            <p>• Check your payment method is up to date</p>
                            <p>• Review our <a href="/billing-help" className="underline">billing help center</a></p>
                          </div>
                        )}
                        {formData.category === 'sales' && (
                          <div>
                            <p>• Let us know your business size and requirements</p>
                            <p>• Mention your timeline for implementation</p>
                            <p>• Check our <a href="/pricing" className="underline">pricing page</a> for quick answers</p>
                          </div>
                        )}
                        {formData.category === 'demo' && (
                          <div>
                            <p>• Specify which features you're most interested in</p>
                            <p>• Let us know your preferred demo date/time</p>
                            <p>• Mention your team size and use case</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Status Indicators */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${supportAvailable ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                        <span>{supportAvailable ? 'Support Available' : 'Outside Business Hours'}</span>
                      </div>
                    </div>
                    {!isOnline && (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        Message will be sent when connection is restored
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isOnline}
                    className="w-full h-12 text-lg font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Message...
                      </>
                    ) : !isOnline ? (
                      <>
                        <AlertCircle className="w-5 h-5 mr-3" />
                        Connection Required
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                  <HelpCircle className="w-7 h-7" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions about Aveenix. Can't find what you're looking for? Contact our support team.
              </p>
            </div>

            {/* FAQ Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2"
                  style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
                />
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeFAQCategory === category.id ? "default" : "outline"}
                    onClick={() => setActiveFAQCategory(category.id)}
                    className="mb-2 h-9"
                    style={{
                      backgroundColor: activeFAQCategory === category.id ? 'var(--primary-color)' : 'transparent',
                      borderColor: 'var(--primary-color)',
                      color: activeFAQCategory === category.id ? 'white' : 'var(--primary-color)'
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto space-y-3">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="transition-colors hover:border-opacity-50 bg-white dark:bg-gray-800" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)' }}>
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm md:text-base font-medium text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.helpful && (
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {faq.helpful} people found this helpful
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No FAQs found matching your search.</p>
              </div>
            )}

            {/* Contact Support CTA */}
            <div className="rounded-xl p-8 text-center max-w-2xl mx-auto" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}>
              <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our support team is here to help. Contact us for personalized assistance with your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setActiveTab('contact')}
                  className="text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button 
                  onClick={() => setActiveTab('form')}
                  variant="outline"
                  style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Email Us Directly
                </Button>
              </div>
            </div>
          </div>
        )}


      </div>
    </MainEcommerceLayout>
  );
}