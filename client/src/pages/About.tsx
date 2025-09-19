import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield, 
  Heart, 
  Building, 
  TrendingUp, 
  Zap,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
  Info,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Top-Rated, Always",
      description: "We automatically source products rated 4 stars and above — so you're not guessing what's good. Then we handpick 2–3 trending products from every category."
    },
    {
      icon: Users,
      title: "Real Cashback on Every Purchase", 
      description: "Every time you shop, we share a portion of our affiliate or vendor commission with you — tracked transparently in your rewards dashboard."
    },
    {
      icon: Shield,
      title: "Support That Works Both Ways",
      description: "We reinvest a portion of sales into rewarding our trusted suppliers and small businesses — because better partnerships build better products."
    },
    {
      icon: Globe,
      title: "Sustainability, Built-In",
      description: "We prioritize eco-conscious vendors and encourage circular practices, from packaging to supply chain. Every action counts toward a greener future."
    }
  ];

  const stats = [
    { icon: Users, number: "500K+", label: "Active Users" },
    { icon: Globe, number: "50+", label: "Countries Served" },
    { icon: TrendingUp, number: "1M+", label: "Transactions" },
    { icon: Zap, number: "99.9%", label: "Uptime" }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to create a unified platform for businesses and consumers."
    },
    {
      year: "2021",
      title: "Platform Launch",
      description: "Launched our first e-commerce platform with basic marketplace functionality."
    },
    {
      year: "2022",
      title: "SaaS Integration",
      description: "Expanded to include comprehensive business management tools and analytics."
    },
    {
      year: "2023",
      title: "AI Implementation",
      description: "Introduced AI-powered features including Jarvis assistant and intelligent recommendations."
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Reached 50+ countries with localized services and multi-currency support."
    }
  ];

  const aboutUsSubNav = (
    <button className="flex items-center space-x-2 py-2 px-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap text-white">
      <Building2 className="w-4 h-4" />
      <span>About Us</span>
    </button>
  );

  return (
    <MainEcommerceLayout 
      subtitle="About" 
      showSearch={true}
      showEcommerceActions={false}
      showProductCategories={false} 
      customSubNavContent={aboutUsSubNav}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                  <Building className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                About Aveenix
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Shop Smarter. Earn More. Give Back.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-16">
          <div className="space-y-5">
            
            {/* Company Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
              <div className="space-y-5">
                <div className="flex items-center mb-4">
                  <Building className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Story</h2>
                </div>
                
                <section>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    At Aveenix, we're building more than just another online store — we're creating a smarter way to shop. Powered by automation, curated by insight, and driven by community values, Aveenix connects you with top-rated global products while rewarding every purchase you make.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our platform combines affiliate, dropshipping, branded, and multivendor models to offer a wide product range — from trending tech and everyday essentials to unique niche finds. We focus on what's popular, what's proven, and what gives back.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We believe shopping should do more than just fill your cart. At the heart of Aveenix is a simple idea: When we share the value we create, everyone wins — customers, sellers, and communities alike.
                  </p>
                </section>
              </div>
            </div>

            {/* Company Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Achievements</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-center mb-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Heart className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Mission & Values</h2>
                </div>
                
                <section>
                  <h3 className="text-lg font-semibold mb-3">Why Shop With Us?</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    By shopping at Aveenix, you're not just getting better products — you're joining a smarter, more meaningful way to shop. Let's build a platform that's good for people, good for business, and good for the planet.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Core Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.map((value, index) => {
                      const IconComponent = value.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{value.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{value.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>

            {/* Giving Back */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Heart className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Giving Back Matters</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      A percentage of profits goes to local community initiatives and children's charities like Starship.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Meaningful Impact</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      When you shop with us, you're helping more than just yourself — you're contributing to positive change.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cycle That Lifts Everyone</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our simple idea: when we share the value we create, everyone wins — customers, sellers, and communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Awards & Certifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Award className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Awards & Certifications</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">SOC 2 Certified</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Security Compliance</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">GDPR Compliant</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Data Protection</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Tech Innovation</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Industry Award 2024</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Best UX Design</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Platform Excellence</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Timeline & Technology Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Timeline */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Journey</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: 'var(--primary-color)' }}>
                            {milestone.year.slice(-2)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h3>
                            <span className="text-sm text-gray-500">({milestone.year})</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Zap className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Technology Stack</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                          R
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">React</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                          N
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Node.js</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                          AI
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">AI/ML</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                          ☁
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Cloud</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                          DB
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">PostgreSQL</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                          TS
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">TypeScript</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Built with modern, scalable technologies to ensure reliability, performance, and security across all platform modules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Award className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Why Choose Aveenix</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">All-in-One Platform</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Combine e-commerce, business management, and AI tools in one unified platform</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">AI-Powered Insights</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Leverage Jarvis AI for intelligent business automation and analytics</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Scalable Solutions</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Grow from startup to enterprise with our flexible platform architecture</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Global Reach</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Serve customers worldwide with multi-currency and localization support</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">24/7 Support</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Get help whenever you need it with our comprehensive support system</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Continuous Innovation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Stay ahead with regular updates and cutting-edge features</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Get in Touch</h2>
                </div>
                
                <section>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Ready to transform your business with Aveenix? We'd love to hear from you and discuss how our platform can help you achieve your goals.
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

                    {/* Contact Page */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                          <ArrowRight className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact Page</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Full contact options</p>
                      <Link href="/contact">
                        <Button className="w-full text-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
                          Visit Contact Page
                        </Button>
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}