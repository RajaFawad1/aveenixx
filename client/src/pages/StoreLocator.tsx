import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Search, Filter, Star, Car, Truck, Store as StoreIcon, Mail } from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  type: 'flagship' | 'pickup' | 'partner';
  distance?: number;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function StoreLocator() {
  const [storeTypeFilter, setStoreTypeFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Mock store data - in real app, this would come from API
  const stores: Store[] = [
    {
      id: '1',
      name: 'Aveenix Flagship Store Auckland',
      address: '123 Queen Street',
      city: 'Auckland',
      region: 'Auckland',
      phone: '+64 9 123 4567',
      email: 'auckland@aveenix.com',
      hours: {
        weekdays: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: '10:00 AM - 5:00 PM'
      },
      services: ['Product Showcase', 'Customer Service', 'Returns & Exchanges', 'Tech Support', 'Same-day Pickup'],
      type: 'flagship',
      distance: 2.3,
      rating: 4.8,
      coordinates: { lat: -36.8485, lng: 174.7633 }
    },
    {
      id: '2',
      name: 'Aveenix Wellington Central',
      address: '456 Lambton Quay',
      city: 'Wellington',
      region: 'Wellington',
      phone: '+64 4 567 8901',
      email: 'wellington@aveenix.com',
      hours: {
        weekdays: '8:30 AM - 7:30 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: '10:00 AM - 4:00 PM'
      },
      services: ['Product Showcase', 'Customer Service', 'Returns & Exchanges', 'Same-day Pickup'],
      type: 'flagship',
      distance: 5.7,
      rating: 4.7,
      coordinates: { lat: -41.2865, lng: 174.7762 }
    },
    {
      id: '3',
      name: 'Aveenix Pickup Point - Christchurch',
      address: '789 High Street',
      city: 'Christchurch',
      region: 'Canterbury',
      phone: '+64 3 789 0123',
      email: 'christchurch@aveenix.com',
      hours: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 5:00 PM',
        sunday: 'Closed'
      },
      services: ['Order Pickup', 'Returns & Exchanges', 'Customer Service'],
      type: 'pickup',
      distance: 12.4,
      rating: 4.5,
      coordinates: { lat: -43.5321, lng: 172.6362 }
    },
    {
      id: '4',
      name: 'Hamilton Partner Store',
      address: '321 Victoria Street',
      city: 'Hamilton',
      region: 'Waikato',
      phone: '+64 7 321 6540',
      email: 'hamilton@aveenix.com',
      hours: {
        weekdays: '9:00 AM - 7:00 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: '10:00 AM - 4:00 PM'
      },
      services: ['Order Pickup', 'Returns & Exchanges'],
      type: 'partner',
      distance: 8.1,
      rating: 4.3,
      coordinates: { lat: -37.7879, lng: 175.2793 }
    },
    {
      id: '5',
      name: 'Aveenix Pickup Point - Tauranga',
      address: '654 Cameron Road',
      city: 'Tauranga',
      region: 'Bay of Plenty',
      phone: '+64 7 654 9870',
      email: 'tauranga@aveenix.com',
      hours: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 5:00 PM',
        sunday: 'Closed'
      },
      services: ['Order Pickup', 'Returns & Exchanges', 'Customer Service'],
      type: 'pickup',
      distance: 15.2,
      rating: 4.6,
      coordinates: { lat: -37.6878, lng: 176.1651 }
    },
    {
      id: '6',
      name: 'Dunedin Partner Store',
      address: '987 George Street',
      city: 'Dunedin',
      region: 'Otago',
      phone: '+64 3 987 6543',
      email: 'dunedin@aveenix.com',
      hours: {
        weekdays: '8:30 AM - 6:30 PM',
        saturday: '9:00 AM - 5:00 PM',
        sunday: '10:00 AM - 3:00 PM'
      },
      services: ['Order Pickup', 'Returns & Exchanges'],
      type: 'partner',
      distance: 22.8,
      rating: 4.4,
      coordinates: { lat: -45.8788, lng: 170.5028 }
    }
  ];

  const getStoreTypeLabel = (type: string) => {
    switch (type) {
      case 'flagship': return 'Flagship Store';
      case 'pickup': return 'Pickup Point';
      case 'partner': return 'Partner Store';
      default: return 'Store';
    }
  };

  const getStoreTypeColor = (type: string) => {
    switch (type) {
      case 'flagship': return 'bg-purple-100 text-purple-800';
      case 'pickup': return 'bg-blue-100 text-blue-800';
      case 'partner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesType = storeTypeFilter === 'all' || store.type === storeTypeFilter;
    
    const matchesService = serviceFilter === 'all' || 
      store.services.some(service => service.toLowerCase().includes(serviceFilter.toLowerCase()));
    
    return matchesType && matchesService;
  });

  return (
    <MainEcommerceLayout subtitle="Store Locator">
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
                  <MapPin className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">Store Locator</h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Find an Aveenix store near you for pickup, returns, and in-person support across New Zealand.
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
        {/* Store Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StoreIcon className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stores.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Locations</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stores.filter(s => s.type === 'flagship').length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Flagship Stores</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Truck className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stores.filter(s => s.type === 'pickup').length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Pickup Points</div>
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
                  {(stores.reduce((sum, store) => sum + store.rating, 0) / stores.length).toFixed(1)}
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
              <Select value={storeTypeFilter} onValueChange={setStoreTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Store Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Store Types</SelectItem>
                  <SelectItem value="flagship">Flagship Stores</SelectItem>
                  <SelectItem value="pickup">Pickup Points</SelectItem>
                  <SelectItem value="partner">Partner Stores</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="pickup">Order Pickup</SelectItem>
                  <SelectItem value="returns">Returns & Exchanges</SelectItem>
                  <SelectItem value="support">Customer Service</SelectItem>
                  <SelectItem value="tech">Tech Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Interactive Map</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Interactive store map would be displayed here with real locations and directions.
              </p>
            </div>
          </div>
        </div>

        {/* Store Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Store Locations ({filteredStores.length})
            </h2>
            <Button variant="outline" className="flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span>Use Current Location</span>
            </Button>
          </div>

          {filteredStores.map((store) => (
            <Card key={store.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{store.name}</CardTitle>
                      <Badge className={getStoreTypeColor(store.type)}>
                        {getStoreTypeLabel(store.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{store.address}, {store.city}</span>
                      </div>
                      {store.distance && (
                        <div className="flex items-center space-x-1">
                          <Car className="w-4 h-4" />
                          <span>{store.distance} km away</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{store.rating}</span>
                    </div>
                    <Button size="sm" style={{ backgroundColor: 'var(--primary-color)' }}>
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{store.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{store.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Opening Hours</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <div>Mon-Fri: {store.hours.weekdays}</div>
                          <div>Saturday: {store.hours.saturday}</div>
                          <div>Sunday: {store.hours.sunday}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Available Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {store.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Store
                  </Button>
                  <Button variant="outline" size="sm">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    View Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stores found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search location or filter criteria to find stores in your area.
            </p>
          </div>
        )}
      </div>
    </MainEcommerceLayout>
  );
}