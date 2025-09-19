import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  Filter, 
  Check, 
  CheckCircle, 
  X, 
  ShoppingCart, 
  AlertTriangle, 
  Shield, 
  Star, 
  CreditCard, 
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'security' | 'system' | 'restock' | 'review' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
  important: boolean;
  actionable: boolean;
  category: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order #ORD-2024-001 Delivered',
    message: 'Your order containing Wireless Headphones has been successfully delivered to 123 Main Street.',
    time: '2 hours ago',
    read: false,
    important: true,
    actionable: true,
    category: 'Orders'
  },
  {
    id: '2',
    type: 'promotion',
    title: 'Flash Sale: 50% off Electronics',
    message: 'Limited time offer on selected electronics items. Sale ends in 6 hours!',
    time: '4 hours ago',
    read: false,
    important: false,
    actionable: true,
    category: 'Promotions'
  },
  {
    id: '3',
    type: 'restock',
    title: 'Item Back in Stock',
    message: 'Wireless Headphones from your wishlist is now available. Only 5 left in stock!',
    time: '1 day ago',
    read: true,
    important: false,
    actionable: true,
    category: 'Inventory'
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order':
      return ShoppingCart;
    case 'promotion':
      return Bell;
    case 'security':
      return Shield;
    case 'system':
      return Settings;
    case 'restock':
      return Bell;
    case 'review':
      return Star;
    case 'payment':
      return CheckCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'order':
      return 'bg-blue-500';
    case 'promotion':
      return 'bg-green-500';
    case 'security':
      return 'bg-red-500';
    case 'system':
      return 'bg-gray-500';
    case 'restock':
      return 'bg-purple-500';
    case 'review':
      return 'bg-yellow-500';
    case 'payment':
      return 'bg-emerald-500';
    default:
      return 'bg-blue-500';
  }
};

export default function Notifications() {
  const [priceNotificationIds, setPriceNotificationIds] = useState<string[]>([]);
  const [priceNotifications, setPriceNotifications] = useState<any[]>([]);

  // Fetch all products from API
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    select: (data: any[]) => data.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || undefined,
      image: product.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      category: product.category || 'Uncategorized'
    }))
  });

  // Load price notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('priceNotifications') || '[]');
    setPriceNotificationIds(savedNotifications);
    
    // Create notifications for products with price alerts
    if (savedNotifications.length > 0 && allProducts.length > 0) {
      const notifications = allProducts
        .filter(product => savedNotifications.includes(product.id))
        .map(product => ({
          id: `price-${product.id}`,
          type: 'restock' as const,
          title: `Price Alert: ${product.name}`,
          message: `Current price: $${product.price}. You'll be notified of any price changes.`,
          time: 'Just added',
          read: false,
          important: false,
          actionable: true,
          category: 'Price Alerts'
        }));
      
      setPriceNotifications(notifications);
    }
  }, [allProducts]);

  const removeNotification = (productId: string) => {
    const cleanId = productId.replace('price-', '');
    const newNotifications = priceNotificationIds.filter(id => id !== cleanId);
    setPriceNotificationIds(newNotifications);
    setPriceNotifications(priceNotifications.filter(notif => !notif.id.includes(cleanId)));
    localStorage.setItem('priceNotifications', JSON.stringify(newNotifications));
  };

  // Combine mock notifications with price notifications
  const allNotifications = [...mockNotifications, ...priceNotifications];
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications);

  useEffect(() => {
    setNotifications([...mockNotifications, ...priceNotifications]);
  }, [priceNotifications]);

  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((notification) => notification.type === filterType);
    }

    // Status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter((notification) => !notification.read);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter((notification) => notification.read);
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      } else if (sortBy === 'important') {
        return b.important ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [notifications, filterType, filterStatus, sortBy]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    if (id.startsWith('price-')) {
      removeNotification(id);
    } else {
      setNotifications(notifications.filter(notification => notification.id !== id));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MainEcommerceLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3" style={{ backgroundColor: 'var(--primary-color)' }}>
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with order status, promotions, and important updates
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <Button 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              style={{ 
                backgroundColor: unreadCount > 0 ? 'var(--primary-color)' : undefined,
                borderColor: unreadCount > 0 ? 'var(--primary-color)' : undefined
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredNotifications.length} of {notifications.length} notifications
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Type
                  </label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="order">Orders</SelectItem>
                      <SelectItem value="promotion">Promotions</SelectItem>
                      <SelectItem value="restock">Price Alerts</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Status
                  </label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Sort by
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="important">Important First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary-color)' }}></div>
            <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className={`transition-colors hover:shadow-lg ${
                    !notification.read ? 'border-l-4' : ''
                  }`}
                  style={!notification.read ? { borderLeftColor: 'var(--primary-color)' } : {}}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div 
                        className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-sm font-medium ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {notification.title}
                              {notification.important && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Important
                                </Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainEcommerceLayout>
  );
}