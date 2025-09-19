import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'notification' | 'page' | 'help';
  url?: string;
  action?: () => void;
  icon?: string;
  category?: string;
  relevance?: number;
}

export const useUniversalSearch = () => {
  const [query, setQuery] = useState('');
  const [location] = useLocation();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Mock data for demonstration - in real app, this would come from API
  const mockProducts = [
    { id: 'prod_1', name: 'iPhone 15 Pro', description: 'Latest iPhone with A17 Pro chip', category: 'Electronics', icon: '📱' },
    { id: 'prod_2', name: 'MacBook Air M3', description: 'Powerful laptop with M3 processor', category: 'Computers', icon: '💻' },
    { id: 'prod_3', name: 'AirPods Pro 2', description: 'Wireless earbuds with active noise cancellation', category: 'Audio', icon: '🎧' },
    { id: 'prod_4', name: 'Samsung Galaxy S24', description: 'Latest Samsung flagship smartphone', category: 'Electronics', icon: '📱' },
    { id: 'prod_5', name: 'iPad Pro', description: 'Professional tablet with M2 chip', category: 'Tablets', icon: '📱' },
  ];

  const mockNotifications = [
    { id: 'notif_1', title: 'Order Shipped', description: 'Your order #12345 has been shipped', icon: '📦' },
    { id: 'notif_2', title: 'Payment Received', description: 'Payment for order #12346 received', icon: '💳' },
    { id: 'notif_3', title: 'New Review', description: 'New review received for iPhone 15 Pro', icon: '⭐' },
    { id: 'notif_4', title: 'Price Drop Alert', description: 'Price dropped for MacBook Air M3', icon: '💰' },
  ];

  const mockPages = [
    { id: 'page_1', title: 'Home', description: 'Main homepage', url: '/', icon: '🏠' },
    { id: 'page_2', title: 'Products', description: 'Browse all products', url: '/products', icon: '🛍️' },
    { id: 'page_3', title: 'Account Dashboard', description: 'Manage your account', url: '/account', icon: '👤' },
    { id: 'page_4', title: 'Cart', description: 'Shopping cart', url: '/cart', icon: '🛒' },
    { id: 'page_5', title: 'Wishlist', description: 'Saved items', url: '/wishlist', icon: '❤️' },
    { id: 'page_6', title: 'Orders', description: 'Order history', url: '/orders', icon: '📋' },
    { id: 'page_7', title: 'Settings', description: 'Account settings', url: '/settings', icon: '⚙️' },
  ];

  const mockHelp = [
    { id: 'help_1', title: 'How to place an order', description: 'Step-by-step guide to ordering', icon: '❓' },
    { id: 'help_2', title: 'Return policy', description: 'Information about returns', icon: '↩️' },
    { id: 'help_3', title: 'Shipping information', description: 'Delivery times and costs', icon: '🚚' },
    { id: 'help_4', title: 'Payment methods', description: 'Accepted payment options', icon: '💳' },
  ];

  // Filter and search logic
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search products
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(lowerQuery) || 
          product.description.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: product.id,
          title: product.name,
          description: product.description,
          type: 'product',
          url: `/products/${product.id}`,
          icon: product.icon,
          category: product.category,
          relevance: product.name.toLowerCase().includes(lowerQuery) ? 10 : 5
        });
      }
    });

    // Search notifications (context-aware - show more on notifications page)
    const showMoreNotifications = location.includes('/notifications') || location.includes('/account');
    const notificationLimit = showMoreNotifications ? mockNotifications.length : 2;
    
    mockNotifications.slice(0, notificationLimit).forEach(notification => {
      if (notification.title.toLowerCase().includes(lowerQuery) || 
          notification.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: notification.id,
          title: notification.title,
          description: notification.description,
          type: 'notification',
          action: () => console.log(`Open notification: ${notification.title}`),
          icon: notification.icon,
          relevance: 8
        });
      }
    });

    // Search pages
    mockPages.forEach(page => {
      if (page.title.toLowerCase().includes(lowerQuery) || 
          page.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: page.id,
          title: page.title,
          description: page.description,
          type: 'page',
          url: page.url,
          icon: page.icon,
          relevance: 6
        });
      }
    });

    // Search help
    mockHelp.forEach(help => {
      if (help.title.toLowerCase().includes(lowerQuery) || 
          help.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: help.id,
          title: help.title,
          description: help.description,
          type: 'help',
          action: () => console.log(`Open help: ${help.title}`),
          icon: help.icon,
          relevance: 4
        });
      }
    });

    // Sort by relevance and return top 20 results
    return results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0)).slice(0, 20);
  }, [query, location]);

  // Update results when query changes
  useEffect(() => {
    setSearchResults(filteredResults);
  }, [filteredResults]);

  // Helper functions
  const getResultsByType = (type: string) => {
    return searchResults.filter(result => result.type === type);
  };

  const getResultCounts = () => {
    const counts = {
      total: searchResults.length,
      products: 0,
      notifications: 0,
      pages: 0,
      help: 0
    };

    searchResults.forEach(result => {
      switch (result.type) {
        case 'product':
          counts.products++;
          break;
        case 'notification':
          counts.notifications++;
          break;
        case 'page':
          counts.pages++;
          break;
        case 'help':
          counts.help++;
          break;
      }
    });

    return counts;
  };

  return {
    query,
    setQuery,
    searchResults,
    getResultsByType,
    getResultCounts,
    isSearching: query.trim().length > 0
  };
};