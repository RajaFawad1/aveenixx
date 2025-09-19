import { useState } from 'react';
import { Search, Filter, Star, TrendingUp, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  products: number;
  rating: number;
  followers: number;
  featured: boolean;
  trending: boolean;
  verified: boolean;
}

export default function Brands() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const brands: Brand[] = [
    {
      id: '1',
      name: 'TechPro',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      description: 'Premium electronics and technology solutions for professionals and enthusiasts.',
      category: 'Electronics',
      products: 156,
      rating: 4.8,
      followers: 12500,
      featured: true,
      trending: true,
      verified: true
    },
    {
      id: '2',
      name: 'ComfortHome',
      logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
      description: 'Modern furniture and home decor for comfortable living spaces.',
      category: 'Home & Garden',
      products: 243,
      rating: 4.7,
      followers: 8900,
      featured: true,
      trending: false,
      verified: true
    },
    {
      id: '3',
      name: 'ActiveLife',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
      description: 'Sports equipment and activewear for healthy, active lifestyles.',
      category: 'Sports & Fitness',
      products: 189,
      rating: 4.6,
      followers: 15200,
      featured: false,
      trending: true,
      verified: true
    },
    {
      id: '4',
      name: 'StyleForward',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
      description: 'Contemporary fashion and accessories for the modern wardrobe.',
      category: 'Fashion',
      products: 312,
      rating: 4.5,
      followers: 22100,
      featured: true,
      trending: false,
      verified: true
    },
    {
      id: '5',
      name: 'PureBeauty',
      logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
      description: 'Natural beauty products and skincare solutions for all skin types.',
      category: 'Beauty & Health',
      products: 97,
      rating: 4.9,
      followers: 18700,
      featured: false,
      trending: true,
      verified: true
    },
    {
      id: '6',
      name: 'KitchenMaster',
      logo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
      description: 'Professional kitchen appliances and cookware for culinary excellence.',
      category: 'Kitchen',
      products: 134,
      rating: 4.7,
      followers: 9800,
      featured: false,
      trending: false,
      verified: true
    },
    {
      id: '7',
      name: 'BookWise',
      logo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop',
      description: 'Educational books and learning materials for all ages and interests.',
      category: 'Books & Education',
      products: 567,
      rating: 4.8,
      followers: 14300,
      featured: true,
      trending: false,
      verified: true
    },
    {
      id: '8',
      name: 'PlayTime',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
      description: 'Educational toys and games for creative play and development.',
      category: 'Toys & Games',
      products: 298,
      rating: 4.6,
      followers: 11200,
      featured: false,
      trending: true,
      verified: true
    }
  ];

  const categories = [
    'all',
    'Electronics',
    'Home & Garden',
    'Sports & Fitness',
    'Fashion',
    'Beauty & Health',
    'Kitchen',
    'Books & Education',
    'Toys & Games'
  ];

  const filteredBrands = brands
    .filter(brand => {
      const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           brand.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'products':
          return b.products - a.products;
        case 'followers':
          return b.followers - a.followers;
        default:
          return 0;
      }
    });

  const featuredBrands = brands.filter(brand => brand.featured);
  const trendingBrands = brands.filter(brand => brand.trending);

  return (
    <MainEcommerceLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto text-blue-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Brand
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover your favorite brands and explore new ones. Browse products from trusted manufacturers and verified sellers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="products">Sort by Products</option>
                <option value="followers">Sort by Followers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Featured Brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBrands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                      />
                      {brand.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {brand.products} products
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{brand.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{brand.followers.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Trending Brands */}
        {trendingBrands.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              Trending Brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingBrands.slice(0, 4).map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 dark:border-green-700">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                      />
                      <Badge className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs">
                        Trending
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {brand.category}
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{brand.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{brand.followers.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Brands */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            All Brands ({filteredBrands.length})
          </h2>
          
          {filteredBrands.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No brands found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        {brand.verified && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {brand.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {brand.trending && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {brand.featured && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {brand.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-600 dark:text-gray-400">
                            {brand.category}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="font-medium">{brand.rating}</span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {brand.products} products
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Brand Partnership CTA */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700">
            <CardContent className="p-8 text-center">
              <Award className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Partner with Aveenix
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Are you a brand looking to reach new customers? Join our marketplace and connect with millions of shoppers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  Become a Partner
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </MainEcommerceLayout>
  );
}