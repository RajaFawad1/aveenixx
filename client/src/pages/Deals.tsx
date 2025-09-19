import { useState, useEffect } from 'react';
import { 
  Clock, 
  Tag, 
  Star, 
  Heart, 
  ShoppingCart, 
  TrendingUp,
  Zap,
  Gift,
  Percent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  timeLeft: number; // in seconds
  soldCount: number;
  totalStock: number;
  dealType: 'flash' | 'daily' | 'weekly' | 'clearance';
  featured: boolean;
}

export default function Deals() {
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const deals: Deal[] = [
    {
      id: '1',
      title: 'Wireless Bluetooth Headphones Pro',
      description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
      originalPrice: 199.99,
      discountPrice: 89.99,
      discountPercent: 55,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 1247,
      timeLeft: 7200, // 2 hours
      soldCount: 234,
      totalStock: 500,
      dealType: 'flash',
      featured: true
    },
    {
      id: '2',
      title: 'Smart Home Security Camera Kit',
      description: '4-camera wireless security system with night vision and mobile app control.',
      originalPrice: 349.99,
      discountPrice: 199.99,
      discountPercent: 43,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      category: 'Home & Security',
      rating: 4.6,
      reviewCount: 892,
      timeLeft: 25200, // 7 hours
      soldCount: 156,
      totalStock: 300,
      dealType: 'daily',
      featured: true
    },
    {
      id: '3',
      title: 'Professional Chef Knife Set',
      description: '8-piece premium stainless steel knife set with wooden block and sharpener.',
      originalPrice: 159.99,
      discountPrice: 79.99,
      discountPercent: 50,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
      category: 'Kitchen',
      rating: 4.9,
      reviewCount: 2156,
      timeLeft: 43200, // 12 hours
      soldCount: 389,
      totalStock: 800,
      dealType: 'daily',
      featured: false
    },
    {
      id: '4',
      title: 'Ergonomic Office Chair with Lumbar Support',
      description: 'Breathable mesh office chair with adjustable height and armrests.',
      originalPrice: 299.99,
      discountPrice: 149.99,
      discountPercent: 50,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      category: 'Furniture',
      rating: 4.7,
      reviewCount: 743,
      timeLeft: 86400, // 24 hours
      soldCount: 98,
      totalStock: 200,
      dealType: 'weekly',
      featured: false
    },
    {
      id: '5',
      title: 'Fitness Tracker with Heart Rate Monitor',
      description: 'Advanced fitness tracker with GPS, sleep monitoring, and 7-day battery.',
      originalPrice: 129.99,
      discountPrice: 69.99,
      discountPercent: 46,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      category: 'Health & Fitness',
      rating: 4.5,
      reviewCount: 1834,
      timeLeft: 3600, // 1 hour
      soldCount: 445,
      totalStock: 600,
      dealType: 'flash',
      featured: true
    },
    {
      id: '6',
      title: 'Premium Cotton Bed Sheet Set',
      description: '1000 thread count Egyptian cotton sheet set with deep pocket fitted sheet.',
      originalPrice: 89.99,
      discountPrice: 39.99,
      discountPercent: 56,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop',
      category: 'Home & Garden',
      rating: 4.8,
      reviewCount: 987,
      timeLeft: 172800, // 48 hours
      soldCount: 267,
      totalStock: 400,
      dealType: 'clearance',
      featured: false
    }
  ];

  const categories = ['all', 'Electronics', 'Home & Security', 'Kitchen', 'Furniture', 'Health & Fitness', 'Home & Garden'];

  const filteredDeals = deals.filter(deal => 
    selectedCategory === 'all' || deal.category === selectedCategory
  );

  const flashDeals = deals.filter(deal => deal.dealType === 'flash');
  const featuredDeals = deals.filter(deal => deal.featured);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining: {[key: string]: number} = {};
      deals.forEach(deal => {
        const currentTime = timeRemaining[deal.id] || deal.timeLeft;
        newTimeRemaining[deal.id] = Math.max(0, currentTime - 1);
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, deals]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getTimeLeft = (dealId: string, originalTime: number) => {
    return timeRemaining[dealId] !== undefined ? timeRemaining[dealId] : originalTime;
  };

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'flash': return <Zap className="w-4 h-4" />;
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <TrendingUp className="w-4 h-4" />;
      case 'clearance': return <Tag className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getDealTypeBadge = (type: string) => {
    const colors = {
      flash: 'bg-red-100 text-red-800',
      daily: 'bg-blue-100 text-blue-800',
      weekly: 'bg-green-100 text-green-800',
      clearance: 'bg-purple-100 text-purple-800'
    };
    
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Percent className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">
              Deals of the Day
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover today's top offers and limited-time promotions. Save big on your favorite products!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50-70%</div>
                <div className="text-sm opacity-90">Maximum Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24H</div>
                <div className="text-sm opacity-90">Limited Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-sm opacity-90">Products on Sale</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Flash Deals */}
        {flashDeals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Zap className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Flash Deals
              </h2>
              <Badge className="ml-4 bg-red-100 text-red-800 animate-pulse">
                Limited Time
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashDeals.map((deal) => (
                <Card key={deal.id} className="hover:shadow-lg transition-shadow border-red-200 dark:border-red-700">
                  <div className="relative">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      Flash Deal
                    </Badge>
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                      -{deal.discountPercent}%
                    </Badge>
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTime(getTimeLeft(deal.id, deal.timeLeft))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {deal.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm">{deal.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({deal.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${deal.discountPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${deal.originalPrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {deal.soldCount}/{deal.totalStock} sold
                      </div>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(deal.soldCount / deal.totalStock) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Deals' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* All Deals */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            All Deals ({filteredDeals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className={`absolute top-3 left-3 ${getDealTypeBadge(deal.dealType)}`}>
                    {getDealTypeIcon(deal.dealType)}
                    <span className="ml-1 capitalize">{deal.dealType}</span>
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                    -{deal.discountPercent}%
                  </Badge>
                  {deal.featured && (
                    <Badge className="absolute bottom-3 left-3 bg-blue-600 text-white">
                      Featured
                    </Badge>
                  )}
                  {getTimeLeft(deal.id, deal.timeLeft) > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTime(getTimeLeft(deal.id, deal.timeLeft))}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {deal.description}
                  </p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{deal.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({deal.reviewCount})</span>
                    </div>
                    <Badge className="ml-auto text-xs">{deal.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${deal.discountPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${deal.originalPrice}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      Save ${(deal.originalPrice - deal.discountPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-purple-200 dark:border-purple-700">
          <CardContent className="p-8 text-center">
            <Gift className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Never Miss a Deal
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about flash sales, exclusive offers, and daily deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <Button>
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              Get 10% off your first order when you subscribe
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}