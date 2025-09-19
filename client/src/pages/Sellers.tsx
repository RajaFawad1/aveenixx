import { useState } from 'react';
import { Store, Star, MapPin, Users, Package, TrendingUp, Filter, Search, Phone, Mail, Globe, CheckCircle } from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Seller {
  id: string;
  name: string;
  description: string;
  location: string;
  logo: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  followers: number;
  joinedDate: string;
  verified: boolean;
  categories: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  featured: boolean;
}

export default function Sellers() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Mock sellers data - in real app, this would come from API
  const sellers: Seller[] = [
    {
      id: '1',
      name: 'TechnoMax Electronics',
      description: 'Premium electronics retailer specializing in latest gadgets and smart home devices.',
      location: 'Auckland, New Zealand',
      logo: '/api/placeholder/100/100',
      rating: 4.8,
      reviewCount: 2847,
      productCount: 456,
      followers: 12580,
      joinedDate: '2020-03-15',
      verified: true,
      categories: ['Electronics', 'Smart Home', 'Gadgets'],
      contact: {
        phone: '+64 9 123 4567',
        email: 'info@technomax.co.nz',
        website: 'www.technomax.co.nz'
      },
      featured: true
    },
    {
      id: '2',
      name: 'EcoLiving Store',
      description: 'Sustainable products for environmentally conscious consumers.',
      location: 'Wellington, New Zealand',
      logo: '/api/placeholder/100/100',
      rating: 4.9,
      reviewCount: 1923,
      productCount: 234,
      followers: 8450,
      joinedDate: '2021-07-22',
      verified: true,
      categories: ['Home & Garden', 'Eco-Friendly', 'Lifestyle'],
      contact: {
        phone: '+64 4 567 8901',
        email: 'hello@ecoliving.co.nz',
        website: 'www.ecoliving.co.nz'
      },
      featured: true
    },
    {
      id: '3',
      name: 'Fashion Forward',
      description: 'Trendy clothing and accessories for all ages.',
      location: 'Christchurch, New Zealand',
      logo: '/api/placeholder/100/100',
      rating: 4.6,
      reviewCount: 3156,
      productCount: 789,
      followers: 15230,
      joinedDate: '2019-11-08',
      verified: true,
      categories: ['Fashion', 'Accessories', 'Clothing'],
      contact: {
        phone: '+64 3 789 0123',
        email: 'contact@fashionforward.co.nz'
      },
      featured: false
    },
    {
      id: '4',
      name: 'Kiwi Sports Gear',
      description: 'Quality sports equipment and outdoor adventure gear.',
      location: 'Hamilton, New Zealand',
      logo: '/api/placeholder/100/100',
      rating: 4.7,
      reviewCount: 1567,
      productCount: 345,
      followers: 9870,
      joinedDate: '2020-09-12',
      verified: true,
      categories: ['Sports', 'Outdoor', 'Fitness'],
      contact: {
        phone: '+64 7 456 7890',
        email: 'info@kiwisports.co.nz',
        website: 'www.kiwisports.co.nz'
      },
      featured: false
    },
    {
      id: '5',
      name: 'Artisan Crafts NZ',
      description: 'Handmade crafts and unique artisan products from local creators.',
      location: 'Dunedin, New Zealand',
      logo: '/api/placeholder/100/100',
      rating: 4.9,
      reviewCount: 892,
      productCount: 156,
      followers: 5420,
      joinedDate: '2021-01-30',
      verified: false,
      categories: ['Handmade', 'Crafts', 'Art'],
      contact: {
        email: 'hello@artisancrafts.co.nz'
      },
      featured: false
    },
    {
      id: '6',
      name: 'Digital Solutions Hub',
      description: 'Software, apps, and digital services for modern businesses.',
      location: 'Auckland, New Zealand',
      logo: '/api/placeholder/100/100',
      rating: 4.8,
      reviewCount: 1234,
      productCount: 67,
      followers: 7890,
      joinedDate: '2022-05-18',
      verified: true,
      categories: ['Software', 'Digital Services', 'Technology'],
      contact: {
        phone: '+64 9 234 5678',
        email: 'support@digitalsolutions.co.nz',
        website: 'www.digitalsolutions.co.nz'
      },
      featured: true
    }
  ];

  const categories = ['All Categories', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Handmade', 'Software'];
  const locations = ['All Locations', 'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin'];

  const filteredSellers = sellers.filter(seller => {
    const matchesCategory = categoryFilter === 'all' || seller.categories.some(cat => 
      cat.toLowerCase().includes(categoryFilter.toLowerCase())
    );
    const matchesLocation = locationFilter === 'all' || seller.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRating = ratingFilter === 'all' || seller.rating >= parseFloat(ratingFilter);
    
    return matchesCategory && matchesLocation && matchesRating;
  });

  const featuredSellers = filteredSellers.filter(seller => seller.featured);
  const regularSellers = filteredSellers.filter(seller => !seller.featured);

  return (
    <MainEcommerceLayout subtitle="Sellers">
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
                  <Store className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">Our Sellers</h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Discover trusted sellers from around New Zealand offering quality products and exceptional service.
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-16 translate-y-16 animate-pulse delay-1000" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full animate-bounce delay-500" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full animate-ping delay-700" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}></div>
        </div>

      <div className="container mx-auto px-4 py-6">
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Sellers</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{sellers.filter(s => s.verified).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Verified Sellers</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sellers.reduce((sum, seller) => sum + seller.productCount, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Products</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(sellers.reduce((sum, seller) => sum + seller.rating, 0) / sellers.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.slice(1).map(location => (
                    <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Sellers */}
        {featuredSellers.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Sellers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSellers.map((seller) => (
                <Card key={seller.id} className="border-2 border-yellow-200 dark:border-yellow-600">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{seller.name}</CardTitle>
                          {seller.verified && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span>{seller.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {seller.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{seller.rating}</span>
                        <span className="text-gray-500">({seller.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>{seller.productCount} products</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-4">
                      {seller.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2 w-full">
                      <Button className="flex-1" style={{ backgroundColor: 'var(--primary-color)' }}>
                        Visit Store
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Follow
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Sellers */}
        {regularSellers.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <Store className="w-5 h-5 mr-2" style={{ color: 'var(--primary-color)' }} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Sellers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularSellers.map((seller) => (
                <Card key={seller.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{seller.name}</CardTitle>
                          {seller.verified && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span>{seller.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {seller.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{seller.rating}</span>
                        <span className="text-gray-500">({seller.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>{seller.productCount} products</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-4">
                      {seller.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2 w-full">
                      <Button className="flex-1" style={{ backgroundColor: 'var(--primary-color)' }}>
                        Visit Store
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Follow
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sellers found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filter criteria to find sellers.
            </p>
          </div>
        )}
      </div>
    </MainEcommerceLayout>
  );
}