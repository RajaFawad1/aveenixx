import { useState } from 'react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimpleSearch from '@/components/SimpleSearch';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  User, 
  Heart, 
  Share2, 
  Eye,
  TrendingUp,
  Award,
  Coffee,
  Lightbulb,
  Rocket,
  Target,
  Zap,
  Globe,
  Star,
  Plus,
  Filter,
  Clock,
  ChevronDown,
  Layers,
  BarChart3,
  Trophy,
  Code,
  Smartphone,
  Shield,
  ShoppingCart,
  Puzzle,
  HelpCircle,
  Gift,
  CreditCard,
  CheckCircle,
  Database,
  Bell,
  ExternalLink
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  image: string;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  solved: boolean;
  tags: string[];
}

export default function Community() {
  const [activeTab, setActiveTab] = useState('blog');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);


  // Banner configurations for each tab - Contact page style
  const getBannerConfig = (tab: string) => {
    switch (tab) {
      case 'blog':
        return {
          title: 'Blog Posts',
          subtitle: 'Stay informed with the latest Aveenix platform developments, industry trends, and expert insights',
          icon: BookOpen
        };
      case 'community':
        return {
          title: 'Community',
          subtitle: 'Connect with fellow users, share experiences, and get help from our vibrant community',
          icon: Users
        };
      case 'discussions':
        return {
          title: 'Discussions',
          subtitle: 'Ask questions, share solutions, and collaborate on technical challenges with experts',
          icon: MessageSquare
        };
      default:
        return {
          title: 'Blog & Community',
          subtitle: 'Insights, discussions, and community collaboration',
          icon: BookOpen
        };
    }
  };

  const renderBanner = () => {
    const config = getBannerConfig(activeTab);
    const IconComponent = config.icon;
    
    return (
      <div className="relative bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 15%, transparent) 0%, color-mix(in srgb, var(--primary-color) 8%, transparent) 50%, color-mix(in srgb, var(--primary-color) 12%, transparent) 100%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 rounded-full backdrop-blur-sm border" style={{
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, white)',
                borderColor: 'color-mix(in srgb, var(--primary-color) 20%, #d1d5db)'
              }}>
                <IconComponent className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              {config.title}
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-bounce delay-500" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full animate-ping delay-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
      </div>
    );
  };

  // Mock blog posts data focused on Aveenix platform themes
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Building the Future of Unified SaaS + E-Commerce Platforms',
      excerpt: 'Explore how Aveenix Hub is revolutionizing business operations by combining e-commerce, business SaaS, and AI tools in one comprehensive platform.',
      content: 'The future of business platforms lies in unification...',
      author: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40',
        role: 'Platform Architect'
      },
      category: 'Platform Updates',
      tags: ['SaaS', 'E-Commerce', 'Platform Strategy'],
      publishedAt: '2024-07-18',
      readTime: 8,
      views: 2847,
      likes: 156,
      comments: 23,
      featured: true,
      image: '/api/placeholder/600/300'
    },
    {
      id: '2',
      title: 'Maximizing ROI with Jarvis AI Business Suite',
      excerpt: 'Learn how businesses are achieving 40% efficiency gains using Jarvis AI for CRM, invoicing, and analytics automation.',
      content: 'AI-powered business automation is no longer a luxury...',
      author: {
        name: 'Marcus Thompson',
        avatar: '/api/placeholder/40/40',
        role: 'AI Solutions Expert'
      },
      category: 'Business Intelligence',
      tags: ['AI', 'ROI', 'Automation', 'Business Intelligence'],
      publishedAt: '2024-07-17',
      readTime: 6,
      views: 1923,
      likes: 98,
      comments: 17,
      featured: true,
      image: '/api/placeholder/600/300'
    },
    {
      id: '3',
      title: 'E-Commerce Success: From Zero to Six Figures with Aveenix',
      excerpt: 'Real success stories from vendors who built thriving marketplace businesses using Aveenix\'s comprehensive e-commerce tools.',
      content: 'Starting an e-commerce business has never been easier...',
      author: {
        name: 'Emily Rodriguez',
        avatar: '/api/placeholder/40/40',
        role: 'E-Commerce Strategist'
      },
      category: 'Success Stories',
      tags: ['E-Commerce', 'Vendor Success', 'Marketplace'],
      publishedAt: '2024-07-16',
      readTime: 5,
      views: 3156,
      likes: 203,
      comments: 34,
      featured: false,
      image: '/api/placeholder/600/300'
    },
    {
      id: '4',
      title: 'Modular Architecture: Why Odoo-Style Platforms Win',
      excerpt: 'Deep dive into the architectural advantages of modular platform design and how it benefits growing businesses.',
      content: 'Modular architecture provides unprecedented flexibility...',
      author: {
        name: 'David Kumar',
        avatar: '/api/placeholder/40/40',
        role: 'Technical Lead'
      },
      category: 'Technical Insights',
      tags: ['Architecture', 'Scalability', 'Development'],
      publishedAt: '2024-07-15',
      readTime: 10,
      views: 1567,
      likes: 87,
      comments: 12,
      featured: false,
      image: '/api/placeholder/600/300'
    },
    {
      id: '5',
      title: 'Customer Portal Revolution: Unified Experience Across All Modules',
      excerpt: 'How the universal customer portal creates seamless experiences whether customers are shopping, managing services, or accessing support.',
      content: 'Customer experience consistency across multiple business modules...',
      author: {
        name: 'Lisa Wang',
        avatar: '/api/placeholder/40/40',
        role: 'UX Director'
      },
      category: 'User Experience',
      tags: ['Customer Portal', 'UX', 'Integration'],
      publishedAt: '2024-07-14',
      readTime: 7,
      views: 2234,
      likes: 134,
      comments: 19,
      featured: false,
      image: '/api/placeholder/600/300'
    },
    {
      id: '6',
      title: 'Security First: Enterprise-Grade Protection for Growing Businesses',
      excerpt: 'Understanding Aveenix\'s multi-layered security approach that protects your business data while maintaining user-friendly interfaces.',
      content: 'Security doesn\'t have to compromise usability...',
      author: {
        name: 'Robert Kim',
        avatar: '/api/placeholder/40/40',
        role: 'Security Engineer'
      },
      category: 'Security',
      tags: ['Security', 'Enterprise', 'Data Protection'],
      publishedAt: '2024-07-13',
      readTime: 9,
      views: 1789,
      likes: 76,
      comments: 8,
      featured: false,
      image: '/api/placeholder/600/300'
    }
  ];

  // Mock community posts data
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      title: 'Best practices for setting up multi-vendor marketplace?',
      content: 'I\'m planning to launch a marketplace with 50+ vendors. What are the key configuration steps in Aveenix to ensure smooth operations?',
      author: {
        name: 'Jennifer Adams',
        avatar: '/api/placeholder/40/40',
        reputation: 487
      },
      category: 'E-Commerce',
      replies: 12,
      views: 234,
      lastActivity: '2 hours ago',
      solved: true,
      tags: ['Marketplace', 'Vendors', 'Setup']
    },
    {
      id: '2',
      title: 'Jarvis AI Analytics integration with external CRM?',
      content: 'Has anyone successfully integrated Jarvis AI with Salesforce? Looking for documentation or examples.',
      author: {
        name: 'Michael Brown',
        avatar: '/api/placeholder/40/40',
        reputation: 623
      },
      category: 'Integration',
      replies: 8,
      views: 156,
      lastActivity: '4 hours ago',
      solved: false,
      tags: ['Jarvis AI', 'CRM', 'Integration']
    },
    {
      id: '3',
      title: 'Custom domain setup for automotive workshop module',
      content: 'Need help configuring custom domain for the workshop booking system. DNS settings seem correct but still getting errors.',
      author: {
        name: 'Carlos Rodriguez',
        avatar: '/api/placeholder/40/40',
        reputation: 298
      },
      category: 'Technical Support',
      replies: 15,
      views: 387,
      lastActivity: '1 day ago',
      solved: true,
      tags: ['Custom Domain', 'Workshop', 'DNS']
    },
    {
      id: '4',
      title: 'Feature Request: Bulk product import via CSV',
      content: 'Would love to see CSV import functionality for products. Currently managing 1000+ products and manual entry is time-consuming.',
      author: {
        name: 'Emma Wilson',
        avatar: '/api/placeholder/40/40',
        reputation: 445
      },
      category: 'Feature Requests',
      replies: 23,
      views: 567,
      lastActivity: '2 days ago',
      solved: false,
      tags: ['CSV Import', 'Products', 'Feature Request']
    },
    {
      id: '5',
      title: 'Payment gateway configuration for New Zealand businesses',
      content: 'What payment gateways work best for NZ-based businesses? Looking for recommendations and setup guides.',
      author: {
        name: 'Sophie Taylor',
        avatar: '/api/placeholder/40/40',
        reputation: 356
      },
      category: 'Payments',
      replies: 19,
      views: 445,
      lastActivity: '3 days ago',
      solved: true,
      tags: ['Payments', 'New Zealand', 'Setup']
    }
  ];

  const categories = [
    { name: 'Platform Updates', icon: TrendingUp },
    { name: 'Business Intelligence', icon: BarChart3 }, 
    { name: 'Success Stories', icon: Trophy },
    { name: 'Technical Insights', icon: Code },
    { name: 'User Experience', icon: Smartphone },
    { name: 'Security', icon: Shield },
    { name: 'E-Commerce', icon: ShoppingCart },
    { name: 'Integration', icon: Puzzle },
    { name: 'Technical Support', icon: HelpCircle },
    { name: 'Feature Requests', icon: Gift },
    { name: 'Payments', icon: CreditCard }
  ];

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesCategory;
  });

  const filteredCommunityPosts = communityPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      console.log('Creating community post:', newPost);
      setNewPost({ title: '', content: '' });
      setShowCreatePost(false);
    }
  };



  const blogNavigation = (
    <>
      {[
        { id: 'blog', label: 'Blog Posts', icon: BookOpen },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'discussions', label: 'Discussions', icon: MessageSquare }
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
      subtitle="Community"
      customSubNavContent={blogNavigation}
    >
      {/* Dynamic Banner based on active tab */}
      {renderBanner()}

      {/* Action Buttons Section - Mobile Only */}
      <div className="lg:hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all duration-200 flex-1 min-w-0 ${
                activeTab === 'blog'
                  ? 'text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:shadow-md border border-gray-200 dark:border-gray-600'
              }`}
              style={
                activeTab === 'blog'
                  ? { backgroundColor: 'var(--primary-color)' }
                  : {}
              }
            >
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Blog</span>
            </button>
            
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all duration-200 flex-1 min-w-0 ${
                activeTab === 'community'
                  ? 'text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:shadow-md border border-gray-200 dark:border-gray-600'
              }`}
              style={
                activeTab === 'community'
                  ? { backgroundColor: 'var(--primary-color)' }
                  : {}
              }
            >
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Community</span>
            </button>
            
            <button
              onClick={() => setActiveTab('discussions')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg font-semibold text-xs transition-all duration-200 flex-1 min-w-0 ${
                activeTab === 'discussions'
                  ? 'text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:shadow-md border border-gray-200 dark:border-gray-600'
              }`}
              style={
                activeTab === 'discussions'
                  ? { backgroundColor: 'var(--primary-color)' }
                  : {}
              }
            >
              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Discussions</span>
            </button>
          </div>
        </div>
      </div>



      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-1/4 space-y-5">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-5">
              <button
                onClick={() => {
                  setCategoriesExpanded(!categoriesExpanded);
                  setSelectedCategory('all');
                }}
                className="flex items-center justify-between w-full mb-4 py-1.5 px-2 rounded-lg text-lg font-bold transition-all duration-200 text-white"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 flex-shrink-0" />
                  <span>All Categories</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-white ${categoriesExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesExpanded && (
                <div className="space-y-1">
                  {categories.map(category => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.name;
                    
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full text-left py-1.5 px-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 ${
                          isSelected
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        style={
                          isSelected
                            ? { backgroundColor: 'var(--primary-color)' }
                            : {}
                        }
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span>{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
              <div className="space-y-3">
                {blogPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex space-x-3">
                    <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{post.readTime} min read</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['SaaS', 'E-Commerce', 'AI', 'Business', 'Platform', 'Integration', 'Analytics', 'Security'].map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>


          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Unified Community Hub - Problem Solving Made Simple */}
            <Card className="mb-6 border dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                  Get Help Your Way - Private AI or Community
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose how to get help: Ask Jarvis AI privately for sensitive questions, or post to our unified community for broader insights.
                </p>
              </CardHeader>
              <CardContent>
                {/* Universal Search - Contextual Help Search */}
                <div className="mb-4">
                  <SimpleSearch 
                    className="w-full"
                    placeholder="Search for help topics..."
                  />
                </div>

                {/* Help Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Private Jarvis AI Option */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AI</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Ask Jarvis AI - Private</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Get instant AI assistance privately. Perfect for sensitive business questions or personal guidance.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <div>✓ Completely private conversation</div>
                      <div>✓ Instant AI-powered responses</div>
                      <div>✓ Business intelligence & analysis</div>
                      <div>✓ No public visibility</div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('openJarvisChat', { 
                          detail: { question: '' } 
                        }));
                      }}
                    >
                      Ask Jarvis Privately
                    </Button>
                  </div>

                  {/* Public Community Option */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Ask Community - Public</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          Get help from our 14,269 members across all platforms. Great for collaboration and diverse perspectives.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <div>✓ Reaches 14,269 followers</div>
                      <div>✓ Multiple expert perspectives</div>
                      <div>✓ Public visibility for learning</div>
                      <div>✓ Cross-platform community help</div>
                    </div>
                    <Button size="sm" className="w-full text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                      Ask Community Publicly
                    </Button>
                  </div>
                </div>

                {/* Privacy & Data Processing Link */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          Privacy & Data Processing
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Learn how your questions are processed, stored, and protected
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('/privacy', '_blank')}
                      className="flex items-center gap-2 text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Recent Community Solutions */}
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                    Recent Solutions from Our Unified Community
                  </h4>
                  <div className="space-y-2">
                    {[
                      { problem: 'How to integrate payment gateway?', solver: '@TechExpert_LI', platform: 'LinkedIn', time: '2h ago' },
                      { problem: 'Best practices for customer retention?', solver: '@BusinessPro_FB', platform: 'Facebook', time: '4h ago' },
                      { problem: 'Mobile app UI/UX feedback needed', solver: '@DesignGuru_IG', platform: 'Instagram', time: '6h ago' }
                    ].map((solution, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-600">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{solution.problem}</span>
                          <span className="text-xs text-gray-500">{solution.time}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Solved by {solution.solver} via {solution.platform}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AVEENIX Social Media Growth Hub */}
            <Card className="mb-6 border dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                  Follow Like & Share AVEENIX, and Lets grow together
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect with AVEENIX on social media and help us grow! Engage with our content, share your thoughts, and be part of our expanding community.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {[
                    { platform: 'Twitter/X', handle: '@AVEENIX', followers: '2.3K', icon: '🐦', color: '#1DA1F2', engagement: '+15%' },
                    { platform: 'LinkedIn', handle: 'AVEENIX', followers: '1.8K', icon: '💼', color: '#0077B5', engagement: '+22%' },
                    { platform: 'Instagram', handle: '@aveenix_official', followers: '4.1K', icon: '📸', color: '#E4405F', engagement: '+18%' },
                    { platform: 'YouTube', handle: 'AVEENIX Hub', followers: '892', icon: '📺', color: '#FF0000', engagement: '+12%' },
                    { platform: 'Facebook', handle: 'AVEENIX', followers: '3.2K', icon: '👥', color: '#1877F2', engagement: '+20%' },
                    { platform: 'Pinterest', handle: 'aveenix_pins', followers: '1.5K', icon: '📌', color: '#E60023', engagement: '+8%' },
                    { platform: 'TikTok', handle: '@aveenix_official', followers: '687', icon: '🎵', color: '#000000', engagement: '+35%' }
                  ].map((social) => (
                    <div key={social.platform} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{social.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{social.platform}</h4>
                            <p className="text-xs text-gray-500">{social.handle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm" style={{ color: social.color }}>{social.followers}</p>
                          <p className="text-xs text-green-600">{social.engagement}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full text-white" 
                        style={{ backgroundColor: social.color }}
                      >
                        Follow & Engage
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Social Growth Challenge */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                    Community Growth Challenge
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Help us reach 20K followers across all 7 platforms! Share our content, tag friends, and earn community points.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                      <span>Goal: 20,000 total followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>Progress: 14,269 (71.3%)</span>
                    </div>
                  </div>
                </div>

                {/* Quick Social Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { action: 'Share AVEENIX Post', points: '+10 pts', icon: Share2 },
                    { action: 'Tag @AVEENIX', points: '+15 pts', icon: Users },
                    { action: 'Create UGC', points: '+25 pts', icon: Plus },
                    { action: 'Refer Friend', points: '+50 pts', icon: Heart }
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Button key={item.action} variant="outline" className="h-auto p-3 flex-col items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <div className="text-center">
                          <div className="text-xs font-medium">{item.action}</div>
                          <div className="text-xs" style={{ color: 'var(--primary-color)' }}>
                            {item.points}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Create Post Modal */}
            {showCreatePost && (
              <Card className="mb-6 border dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                    <span>Create Community Post</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="border-gray-300 dark:border-gray-600"
                    />
                    <Textarea
                      placeholder="Share your question, insight, or experience..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      rows={4}
                      className="border-gray-300 dark:border-gray-600"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost} className="text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                        Post to Community
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 flex items-center space-x-2">
                      <Star className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                      <span>Featured Articles</span>
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {featuredPosts.map((post) => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border dark:border-gray-700">
                          <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Badge className="absolute top-4 left-4 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
                              Featured
                            </Badge>
                          </div>
                          <CardContent className="p-5">
                            <div className="flex items-center space-x-2 mb-3">
                              <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime} min read</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{post.author.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{post.views}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{post.comments}</span>
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {/* All Blog Posts */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                    <span>Latest Posts</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredBlogPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border dark:border-gray-700">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{post.readTime} min read</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                              </div>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{post.likes}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{post.comments}</span>
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Users className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                <span>Community Discussions</span>
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {filteredCommunityPosts.length} discussions
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCommunityPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow border dark:border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="outline" className="border-gray-300 dark:border-gray-600">{post.category}</Badge>
                          {post.solved && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">
                              <Award className="w-3 h-3 mr-1" />
                              Solved
                            </Badge>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                            </div>
                            <span className="font-medium">{post.author.name}</span>
                            <span>•</span>
                            <span>{post.author.reputation} reputation</span>
                          </div>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.replies} replies</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.lastActivity}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <MessageSquare className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                <span>Technical Discussions</span>
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {filteredCommunityPosts.filter(post => post.category === 'Technical' || post.category === 'Development').length} technical posts
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCommunityPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow border dark:border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="outline" className="border-gray-300 dark:border-gray-600">{post.category}</Badge>
                          {post.solved && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">
                              <Award className="w-3 h-3 mr-1" />
                              Solved
                            </Badge>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                            </div>
                            <span className="font-medium">{post.author.name}</span>
                            <span>•</span>
                            <span>{post.author.reputation} reputation</span>
                          </div>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.replies} replies</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.lastActivity}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'blog' && filteredBlogPosts.length === 0) || 
          ((activeTab === 'community' || activeTab === 'discussions') && filteredCommunityPosts.length === 0)) && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              {activeTab === 'blog' ? (
                <BookOpen className="w-16 h-16 text-gray-400" />
              ) : (
                <Users className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {activeTab === 'blog' ? 'blog posts' : 'discussions'} found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}
          </div>
        </div>
      </div>


    </MainEcommerceLayout>
  );
}