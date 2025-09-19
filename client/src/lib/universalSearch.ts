import { Package, ShoppingCart, Users, FileText, MapPin, Store, Receipt, MessageSquare, BookOpen, Settings } from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'order' | 'user' | 'page' | 'content' | 'vendor' | 'location' | 'faq';
  category: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: number;
  metadata?: {
    price?: string;
    status?: string;
    rating?: number;
    date?: string;
    location?: string;
  };
}

export interface SearchCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const searchCategories: SearchCategory[] = [
  {
    id: 'products',
    name: 'Products',
    icon: Package,
    color: 'text-blue-600'
  },
  {
    id: 'orders',
    name: 'Orders',
    icon: ShoppingCart,
    color: 'text-green-600'
  },
  {
    id: 'vendors',
    name: 'Vendors',
    icon: Store,
    color: 'text-purple-600'
  },
  {
    id: 'users',
    name: 'Users',
    icon: Users,
    color: 'text-orange-600'
  },
  {
    id: 'pages',
    name: 'Pages',
    icon: FileText,
    color: 'text-indigo-600'
  },
  {
    id: 'content',
    name: 'Content',
    icon: BookOpen,
    color: 'text-teal-600'
  }
];

// Mock search data - in production, this would come from APIs
const mockSearchData: SearchResult[] = [
  // Products
  {
    id: 'prod-1',
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    type: 'product',
    category: 'Electronics',
    url: '/product/wireless-bluetooth-headphones',
    icon: Package,
    priority: 10,
    metadata: { price: '$89.99', rating: 4.5 }
  },
  {
    id: 'prod-2',
    title: 'Smart Home Hub',
    description: 'Control your smart devices with voice commands and mobile app',
    type: 'product',
    category: 'Smart Home',
    url: '/product/smart-home-hub',
    icon: Package,
    priority: 9,
    metadata: { price: '$149.99', rating: 4.8 }
  },
  {
    id: 'prod-3',
    title: 'Organic Coffee Beans',
    description: 'Fair trade organic coffee beans from Colombia, medium roast',
    type: 'product',
    category: 'Food & Beverage',
    url: '/product/organic-coffee-beans',
    icon: Package,
    priority: 8,
    metadata: { price: '$24.99', rating: 4.3 }
  },
  
  // Orders
  {
    id: 'order-1',
    title: 'Order #ORD-2025-001',
    description: 'Wireless Bluetooth Headphones - Delivered',
    type: 'order',
    category: 'Recent Orders',
    url: '/account?section=orders&order=ORD-2025-001',
    icon: ShoppingCart,
    priority: 9,
    metadata: { status: 'Delivered', date: '2025-01-15' }
  },
  {
    id: 'order-2',
    title: 'Order #ORD-2025-002',
    description: 'Smart Home Hub - In Transit',
    type: 'order',
    category: 'Active Orders',
    url: '/account?section=orders&order=ORD-2025-002',
    icon: ShoppingCart,
    priority: 8,
    metadata: { status: 'In Transit', date: '2025-01-18' }
  },
  
  // Vendors
  {
    id: 'vendor-1',
    title: 'TechGear Pro',
    description: 'Premium electronics and accessories with 5-star rating',
    type: 'vendor',
    category: 'Electronics Vendor',
    url: '/sellers/techgear-pro',
    icon: Store,
    priority: 8,
    metadata: { rating: 4.9, location: 'San Francisco, CA' }
  },
  {
    id: 'vendor-2',
    title: 'Artisan Coffee Co.',
    description: 'Specialty coffee roaster with organic and fair trade options',
    type: 'vendor',
    category: 'Food & Beverage Vendor',
    url: '/sellers/artisan-coffee-co',
    icon: Store,
    priority: 7,
    metadata: { rating: 4.7, location: 'Seattle, WA' }
  },
  
  // Pages
  {
    id: 'page-1',
    title: 'Account Dashboard',
    description: 'Manage your orders, wishlist, and account settings',
    type: 'page',
    category: 'Account',
    url: '/account',
    icon: Settings,
    priority: 7
  },
  {
    id: 'page-2',
    title: 'Compare Products',
    description: 'Side-by-side product comparison tool',
    type: 'page',
    category: 'Shopping Tools',
    url: '/compare',
    icon: FileText,
    priority: 6
  },
  {
    id: 'page-3',
    title: 'Store Locator',
    description: 'Find AVEENIX stores and pickup locations near you',
    type: 'page',
    category: 'Store Information',
    url: '/store-locator',
    icon: MapPin,
    priority: 6
  },
  {
    id: 'page-4',
    title: 'Shipping Information',
    description: 'Delivery options, tracking, and shipping policies',
    type: 'page',
    category: 'Support',
    url: '/shipping',
    icon: FileText,
    priority: 5
  },
  
  // Content & FAQ
  {
    id: 'faq-1',
    title: 'How to track my order?',
    description: 'Step-by-step guide to tracking your order status and delivery',
    type: 'faq',
    category: 'Order Support',
    url: '/contact#faq',
    icon: MessageSquare,
    priority: 8
  },
  {
    id: 'faq-2',
    title: 'Return Policy Guidelines',
    description: 'Learn about our 30-day return policy and refund process',
    type: 'faq',
    category: 'Returns & Refunds',
    url: '/returns',
    icon: MessageSquare,
    priority: 7
  },
  {
    id: 'content-1',
    title: 'About AVEENIX',
    description: 'Learn about our mission, values, and company history',
    type: 'content',
    category: 'Company Info',
    url: '/about',
    icon: BookOpen,
    priority: 6
  }
];

export interface SearchFilters {
  priceRange?: { min: number; max: number };
  categories?: string[];
  dateRange?: { start: Date; end: Date };
  rating?: number;
  inStock?: boolean;
  availability?: 'in-stock' | 'out-of-stock' | 'pre-order' | 'all';
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popularity';
  location?: string;
  brand?: string[];
  discount?: boolean;
  freeShipping?: boolean;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularTerms: string[];
  searchTrends: { term: string; count: number; change: number }[];
  avgResultsPerSearch: number;
  clickThroughRate: number;
}

export class UniversalSearchService {
  private static instance: UniversalSearchService;
  private searchData: SearchResult[] = mockSearchData;
  private productData: SearchResult[] = [];
  private recentSearches: string[] = [];
  private popularSearches: string[] = ['wireless headphones', 'laptop deals', 'bluetooth speaker', 'smart watch', 'gaming mouse'];
  private searchAnalytics: SearchAnalytics = {
    totalSearches: 15420,
    popularTerms: ['headphones', 'laptop', 'phone', 'tablet', 'watch'],
    searchTrends: [
      { term: 'headphones', count: 1250, change: 15 },
      { term: 'laptop deals', count: 980, change: 8 },
      { term: 'smart watch', count: 720, change: -5 },
      { term: 'gaming', count: 650, change: 22 },
      { term: 'bluetooth', count: 540, change: 12 }
    ],
    avgResultsPerSearch: 8.5,
    clickThroughRate: 0.68
  };
  
  static getInstance(): UniversalSearchService {
    if (!this.instance) {
      this.instance = new UniversalSearchService();
      this.instance.loadProductData();
    }
    return this.instance;
  }

  // Load real product data from API
  private async loadProductData() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        console.error('Product API returned:', response.status, response.statusText);
        return;
      }
      
      const products = await response.json();
      console.log('Loaded products for search:', products.length);
      
      this.productData = products.map((product: any) => {
        try {
          return {
            id: `product-${product.id}`,
            title: product.name || 'Untitled Product',
            description: product.description || product.shortDescription || `${product.brand || 'Product'} - ${product.category || 'Category'}`,
            type: 'product' as const,
            category: product.category || 'Uncategorized',
            url: `/product/${product.id}`,
            icon: Package,
            priority: 10,
            metadata: {
              price: product.price ? `$${parseFloat(product.price).toFixed(2)}` : undefined,
              rating: product.rating || undefined,
              status: (product.stockQuantity > 0 || product.isInStock) ? 'In Stock' : 'Out of Stock'
            }
          };
        } catch (error) {
          console.error('Error mapping product:', product.id, error);
          return null;
        }
      }).filter(Boolean);
      
      console.log('Search service loaded', this.productData.length, 'products');
    } catch (error) {
      console.error('Failed to load product data for search:', error);
    }
  }
  
  search(query: string, filters?: {
    types?: string[];
    categories?: string[];
    limit?: number;
  }): SearchResult[] {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    this.addToRecentSearches(query);
    
    // Combine mock data with real product data
    const allData = [...this.searchData, ...this.productData];
    
    let results = allData.filter(item => {
      // Text matching
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = item.description.toLowerCase().includes(searchTerm);
      const categoryMatch = item.category.toLowerCase().includes(searchTerm);
      
      const textMatch = titleMatch || descriptionMatch || categoryMatch;
      
      // Filter by types if specified
      if (filters?.types && filters.types.length > 0) {
        const typeMatch = filters.types.includes(item.type);
        return textMatch && typeMatch;
      }
      
      // Filter by categories if specified
      if (filters?.categories && filters.categories.length > 0) {
        const categoryMatch = filters.categories.includes(item.category);
        return textMatch && categoryMatch;
      }
      
      return textMatch;
    });
    
    // Sort by priority and relevance
    results.sort((a, b) => {
      // Prioritize exact title matches
      const aExactTitle = a.title.toLowerCase() === searchTerm;
      const bExactTitle = b.title.toLowerCase() === searchTerm;
      if (aExactTitle && !bExactTitle) return -1;
      if (!aExactTitle && bExactTitle) return 1;
      
      // Then by priority
      return b.priority - a.priority;
    });
    
    // Limit results if specified
    if (filters?.limit) {
      results = results.slice(0, filters.limit);
    }
    
    return results;
  }
  
  getSearchSuggestions(query: string): string[] {
    if (!query.trim()) return this.getPopularSearches();
    
    const searchTerm = query.toLowerCase();
    const suggestions = new Set<string>();
    
    // Add title-based suggestions
    this.searchData.forEach(item => {
      const words = item.title.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.includes(searchTerm) && word.length > 2) {
          suggestions.add(word);
        }
      });
      
      // Add full title if it starts with search term
      if (item.title.toLowerCase().startsWith(searchTerm)) {
        suggestions.add(item.title);
      }
    });
    
    return Array.from(suggestions).slice(0, 8);
  }
  
  getPopularSearches(): string[] {
    return [
      'wireless headphones',
      'smart home',
      'coffee',
      'track order',
      'return policy',
      'shipping info',
      'account settings'
    ];
  }
  
  getRecentSearches(): string[] {
    return this.recentSearches.slice(0, 5);
  }
  
  private addToRecentSearches(query: string): void {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(item => item !== cleanQuery);
    
    // Add to beginning
    this.recentSearches.unshift(cleanQuery);
    
    // Keep only last 10 searches
    this.recentSearches = this.recentSearches.slice(0, 10);
    
    // Store in localStorage
    try {
      localStorage.setItem('aveenix_recent_searches', JSON.stringify(this.recentSearches));
    } catch (error) {
      console.warn('Could not save recent searches to localStorage:', error);
    }
  }
  
  loadRecentSearches(): void {
    try {
      const stored = localStorage.getItem('aveenix_recent_searches');
      if (stored) {
        this.recentSearches = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not load recent searches from localStorage:', error);
      this.recentSearches = [];
    }
  }
  
  clearRecentSearches(): void {
    this.recentSearches = [];
    try {
      localStorage.removeItem('aveenix_recent_searches');
    } catch (error) {
      console.warn('Could not clear recent searches from localStorage:', error);
    }
  }
  
  getCategoryResults(categoryId: string): SearchResult[] {
    const categoryTypeMap: { [key: string]: string[] } = {
      'products': ['product'],
      'orders': ['order'],
      'vendors': ['vendor'],
      'users': ['user'],
      'pages': ['page'],
      'content': ['content', 'faq']
    };
    
    const types = categoryTypeMap[categoryId] || [];
    const allData = [...this.searchData, ...this.productData];
    return allData
      .filter(item => types.includes(item.type))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);
  }

  // Public method to refresh product data
  async refreshProductData() {
    await this.loadProductData();
  }

  // Debug method to check loaded product count
  getProductCount(): number {
    return this.productData.length;
  }

  // Advanced Search Features
  getSearchAnalytics(): SearchAnalytics {
    return this.searchAnalytics;
  }

  getAISuggestions(query: string): string[] {
    if (!query.trim()) return [];
    
    // AI-powered suggestions based on context and user behavior
    const aiSuggestions = [
      `${query} with free shipping`,
      `best ${query} under $100`,
      `${query} reviews and ratings`,
      `${query} vs alternatives`,
      `${query} deals and discounts`
    ];
    
    return aiSuggestions.slice(0, 3);
  }

  // Voice Search Support
  async processVoiceSearch(audioBlob: Blob): Promise<string> {
    // In production, this would use Speech-to-Text API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('wireless headphones'); // Mock voice recognition
      }, 1000);
    });
  }

  // Image/Barcode Search Support
  async processImageSearch(imageFile: File): Promise<SearchResult[]> {
    // In production, this would use image recognition API
    return new Promise((resolve) => {
      setTimeout(() => {
        const imageResults = this.searchData.filter(item => 
          item.type === 'product' && item.title.toLowerCase().includes('headphones')
        );
        resolve(imageResults.slice(0, 3));
      }, 1500);
    });
  }

  async processBarcodeSearch(imageFile: File): Promise<SearchResult[]> {
    // In production, this would use barcode scanning API
    return new Promise((resolve) => {
      setTimeout(() => {
        const barcodeResults = this.searchData.filter(item => 
          item.type === 'product'
        );
        resolve(barcodeResults.slice(0, 1));
      }, 1200);
    });
  }

  // Advanced Filters
  searchWithFilters(query: string, filters: SearchFilters): SearchResult[] {
    let results = this.search(query);
    
    // Apply price filter
    if (filters.priceRange) {
      results = results.filter(item => {
        if (item.metadata?.price) {
          const price = parseFloat(item.metadata.price.replace('$', ''));
          return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
        }
        return true;
      });
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(item => 
        filters.categories!.includes(item.category)
      );
    }

    // Apply rating filter
    if (filters.rating) {
      results = results.filter(item => 
        item.metadata?.rating && item.metadata.rating >= filters.rating!
      );
    }

    return results;
  }

  // Analytics and Tracking
  trackSearchClick(searchTerm: string, resultId: string, position: number): void {
    // Track click-through analytics
    console.log(`Search click: "${searchTerm}" -> ${resultId} at position ${position}`);
  }

  getSearchTrends(): Array<{ term: string; count: number; change: number }> {
    return this.searchAnalytics.searchTrends;
  }

  // Real-time Autocomplete
  getAutocomplete(query: string): string[] {
    if (!query.trim()) return [];
    
    const queryLower = query.toLowerCase();
    const autocompletes = new Set<string>();
    
    // Product-based autocomplete with real products
    const allData = [...this.searchData, ...this.productData];
    allData
      .filter(item => item.type === 'product')
      .forEach(item => {
        const words = [item.title, item.description, item.category].join(' ').toLowerCase();
        const wordsList = words.split(' ');
        
        wordsList.forEach(word => {
          if (word.startsWith(queryLower) && word.length > queryLower.length) {
            autocompletes.add(word);
          }
        });
        
        // Add full title if it starts with query
        if (item.title.toLowerCase().startsWith(queryLower)) {
          autocompletes.add(item.title);
        }
      });

    // Add common search patterns
    const patterns = [
      `${query} deals`,
      `${query} reviews`,
      `${query} price`,
      `${query} comparison`,
      `best ${query}`,
      `cheap ${query}`,
      `${query} for sale`
    ];
    
    patterns.forEach(pattern => autocompletes.add(pattern));
    
    return Array.from(autocompletes).slice(0, 8);
  }

  // Enhanced AI Contextual Recommendations
  getContextualRecommendations(query: string, userContext?: {
    recentSearches?: string[];
    purchaseHistory?: string[];
    preferences?: string[];
    location?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  }): string[] {
    const recommendations = new Set<string>();
    const queryLower = query.toLowerCase();
    
    // Context-based recommendations
    if (userContext) {
      // Time-based recommendations
      if (userContext.timeOfDay === 'morning') {
        recommendations.add(`${query} breakfast`);
        recommendations.add(`${query} coffee`);
      } else if (userContext.timeOfDay === 'evening') {
        recommendations.add(`${query} dinner`);
        recommendations.add(`${query} entertainment`);
      }
      
      // Location-based recommendations
      if (userContext.location) {
        recommendations.add(`${query} near ${userContext.location}`);
        recommendations.add(`${query} delivery ${userContext.location}`);
      }
      
      // Purchase history based
      if (userContext.purchaseHistory) {
        userContext.purchaseHistory.forEach(item => {
          if (item.toLowerCase().includes(queryLower)) {
            recommendations.add(`${query} like ${item}`);
            recommendations.add(`${query} similar to ${item}`);
          }
        });
      }
    }
    
    // Category-specific intelligent suggestions
    const categoryKeywords = {
      electronics: ['warranty', 'specs', 'comparison', 'reviews', 'latest model'],
      clothing: ['size guide', 'reviews', 'style', 'color options', 'on sale'],
      food: ['nutrition', 'ingredients', 'organic', 'gluten free', 'fresh'],
      books: ['author', 'reviews', 'similar books', 'bestseller', 'genre'],
      home: ['dimensions', 'assembly', 'reviews', 'warranty', 'installation']
    };
    
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (queryLower.includes(category)) {
        keywords.forEach(keyword => {
          recommendations.add(`${query} ${keyword}`);
        });
      }
    });
    
    // Intent-based recommendations
    const intents = {
      buy: ['best price', 'deals', 'discount', 'coupon', 'sale'],
      compare: ['vs', 'comparison', 'reviews', 'pros and cons', 'alternatives'],
      learn: ['how to', 'tutorial', 'guide', 'tips', 'instructions'],
      local: ['near me', 'store hours', 'directions', 'pickup', 'delivery']
    };
    
    Object.entries(intents).forEach(([intent, suggestions]) => {
      if (queryLower.includes(intent)) {
        suggestions.forEach(suggestion => {
          recommendations.add(`${query} ${suggestion}`);
        });
      }
    });
    
    return Array.from(recommendations).slice(0, 6);
  }

  // Advanced Multi-Criteria Search with Instant Results
  searchAdvanced(query: string, filters: SearchFilters = {}, options: {
    limit?: number;
    offset?: number;
    realTime?: boolean;
  } = {}): {
    results: SearchResult[];
    total: number;
    facets: {
      categories: { name: string; count: number }[];
      priceRanges: { min: number; max: number; count: number }[];
      ratings: { rating: number; count: number }[];
      brands: { name: string; count: number }[];
    };
    suggestions: string[];
  } {
    let results = this.search(query, {
      types: filters.categories,
      limit: options.limit || 50
    });

    // Apply advanced filters
    if (filters.priceRange) {
      results = results.filter(item => {
        if (item.metadata?.price) {
          const price = parseFloat(item.metadata.price.replace('$', ''));
          return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
        }
        return true;
      });
    }

    if (filters.rating) {
      results = results.filter(item => 
        item.metadata?.rating && item.metadata.rating >= filters.rating!
      );
    }

    if (filters.availability) {
      results = results.filter(item => {
        if (filters.availability === 'in-stock') return !item.metadata?.status || item.metadata.status !== 'Out of Stock';
        if (filters.availability === 'out-of-stock') return item.metadata?.status === 'Out of Stock';
        return true;
      });
    }

    if (filters.discount) {
      results = results.filter(item => 
        item.metadata?.price && item.metadata.price.includes('$') && item.description.toLowerCase().includes('sale')
      );
    }

    if (filters.freeShipping) {
      results = results.filter(item => 
        item.description.toLowerCase().includes('free shipping')
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      results = this.sortResults(results, filters.sortBy);
    }

    // Generate facets for filtering UI
    const facets = this.generateFacets(results);
    
    // Generate smart suggestions based on results
    const suggestions = this.getContextualRecommendations(query, {
      recentSearches: this.getRecentSearches(),
      timeOfDay: this.getTimeOfDay()
    });

    return {
      results: results.slice(options.offset || 0, (options.offset || 0) + (options.limit || 20)),
      total: results.length,
      facets,
      suggestions
    };
  }

  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    switch (sortBy) {
      case 'price-low':
        return results.sort((a, b) => {
          const priceA = parseFloat(a.metadata?.price?.replace('$', '') || '0');
          const priceB = parseFloat(b.metadata?.price?.replace('$', '') || '0');
          return priceA - priceB;
        });
      case 'price-high':
        return results.sort((a, b) => {
          const priceA = parseFloat(a.metadata?.price?.replace('$', '') || '0');
          const priceB = parseFloat(b.metadata?.price?.replace('$', '') || '0');
          return priceB - priceA;
        });
      case 'rating':
        return results.sort((a, b) => (b.metadata?.rating || 0) - (a.metadata?.rating || 0));
      case 'popularity':
        return results.sort((a, b) => b.priority - a.priority);
      case 'newest':
        return results.sort((a, b) => {
          const dateA = new Date(a.metadata?.date || '2024-01-01');
          const dateB = new Date(b.metadata?.date || '2024-01-01');
          return dateB.getTime() - dateA.getTime();
        });
      default: // relevance
        return results.sort((a, b) => b.priority - a.priority);
    }
  }

  private generateFacets(results: SearchResult[]) {
    const categories = new Map<string, number>();
    const brands = new Map<string, number>();
    const ratings = new Map<number, number>();
    const priceRanges = [
      { min: 0, max: 50, count: 0 },
      { min: 50, max: 100, count: 0 },
      { min: 100, max: 250, count: 0 },
      { min: 250, max: 500, count: 0 },
      { min: 500, max: 999999, count: 0 }
    ];

    results.forEach(result => {
      // Categories
      categories.set(result.category, (categories.get(result.category) || 0) + 1);
      
      // Brands (extract from title)
      const brand = result.title.split(' ')[0];
      brands.set(brand, (brands.get(brand) || 0) + 1);
      
      // Ratings
      if (result.metadata?.rating) {
        const rating = Math.floor(result.metadata.rating);
        ratings.set(rating, (ratings.get(rating) || 0) + 1);
      }
      
      // Price ranges
      if (result.metadata?.price) {
        const price = parseFloat(result.metadata.price.replace('$', ''));
        priceRanges.forEach(range => {
          if (price >= range.min && price <= range.max) {
            range.count++;
          }
        });
      }
    });

    return {
      categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
      brands: Array.from(brands.entries()).map(([name, count]) => ({ name, count })),
      ratings: Array.from(ratings.entries()).map(([rating, count]) => ({ rating, count })),
      priceRanges: priceRanges.filter(range => range.count > 0)
    };
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }
}