import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLocalization } from '@/components/providers/LocalizationProvider';
import SimpleSearch from '@/components/SimpleSearch';
import DesktopColorPicker from '@/components/ui/DesktopColorPicker';
import ProductManagement from './ProductManagement';
import InventoryManagement from './InventoryManagement';
import SalesManagement from './SalesManagement';
import RewardsAndTasks from '@/components/RewardsAndTasks';
import MyOrders from './MyOrders';
import Wishlist from './Wishlist';
import Favourites from './Favourites';
import { ReviewManagement } from '@/components/admin/ReviewManagement';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Bot, 
  Wrench, 
  User, 
  Settings,
  Building,
  FileText,
  Shield,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Star,

  Users,
  BarChart3,
  Database,
  Globe,
  Activity,
  Zap,
  TrendingUp,
  Calendar,
  MessageSquare,
  DollarSign,
  Target,
  Briefcase,
  Home,
  Filter,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Check,
  Grid3X3,
  List,
  PieChart,
  LineChart,
  Eye,
  Maximize2,
  Menu,
  X,
  ChevronLeft,
  ChevronDown,
  Moon,
  Sun,
  Palette,
  Truck,
  RefreshCw,
  Download,
  Upload,
  Archive,
  AlertTriangle,
  ArrowLeft,
  MessageCircle,
  Plus,
  Brain,
  Wallet,
  Send,
  Paperclip,
  Phone,
  Mail,
  Video,
  Search,
  Calculator,
  Receipt,
  Building2,
  ImageIcon,
  Trash2,
  Book,
  History,
  HelpCircle,
  LogOut,
  Monitor,
  Smartphone,
  Lock,
  ChevronUp,
  Grid3x3,
  MoreHorizontal,
  Store,
  Save,
  UserCheck,
  Tablet,
  Cog,
  Tag,
  RotateCcw,
  Scale,
  HeartHandshake
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import HeaderUtility from '@/components/layout/HeaderUtility';
import RoleBasedDashboard from '@/components/dashboard/RoleBasedDashboard';

export default function EnterpriseDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { selectedCountry, setSelectedCountry, countries } = useLocalization();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<'superadmin' | 'admin' | 'vendor' | 'customer' | 'business'>('superadmin');

  // User profile and statistics queries
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/user/profile', user?.id],
    enabled: !!user?.id
  });

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/user/stats', user?.id],
    enabled: !!user?.id
  });
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedSubsections, setExpandedSubsections] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [activeMyAccountTab, setActiveMyAccountTab] = useState('profile');
  const [showOrdersReturnsDropdown, setShowOrdersReturnsDropdown] = useState(false);
  const [showMyFilesDropdown, setShowMyFilesDropdown] = useState(false);
  const [activeECommerceTab, setActiveECommerceTab] = useState('orders');
  const [activeDirectoryTab, setActiveDirectoryTab] = useState('listings');
  const [activeCustomAppsTab, setActiveCustomAppsTab] = useState('appointments');
  const [activeBusinessAppsTab, setActiveBusinessAppsTab] = useState('ai-assistant');
  const [activeVendorTab, setActiveVendorTab] = useState('analytics');
  const [activeSystemAdminTab, setActiveSystemAdminTab] = useState('products');
  const [selectedRoleView, setSelectedRoleView] = useState<string | null>(null);
  
  // State for navigation enhancements

  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [breadcrumbHistory, setBreadcrumbHistory] = useState<Array<{key: string, label: string}>>([
    { key: 'dashboard-module', label: 'Dashboard' }
  ]);
  const [navigationLoading, setNavigationLoading] = useState<Set<string>>(new Set());

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [widgetOrder, setWidgetOrder] = useState(['stats', 'charts', 'activity', 'notifications']);
  const [bulkActionType, setBulkActionType] = useState<'delete' | 'archive' | 'export' | null>(null);
  const [lazyLoadedData, setLazyLoadedData] = useState<Map<string, any>>(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());
  const [apiEndpoints, setApiEndpoints] = useState({
    webhooks: '/api/webhooks',
    export: '/api/export',
    import: '/api/import',
    analytics: '/api/analytics',
    notifications: '/api/notifications'
  });
  
  // Overview page state
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Missing state variables to fix errors
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [menuItems] = useState<any[]>([]);
  const [setActiveSection] = useState(() => (section: string) => {});
  
  // Compare functionality state - moved from renderCompare to fix hooks error
  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareProducts, setCompareProducts] = useState<any[]>([]);
  
  // Query for products used in compare functionality
  const { data: rawProducts = [] } = useQuery({
    queryKey: ['/api/products']
  });
  
  // Load compare list from localStorage - moved from renderCompare 
  useEffect(() => {
    const savedCompare = JSON.parse(localStorage.getItem('compareList') || '[]');
    setCompareList(savedCompare);
    
    if (savedCompare.length > 0 && rawProducts.length > 0) {
      const products = rawProducts.filter((product: any) => 
        savedCompare.includes(product.id)
      );
      setCompareProducts(products);
    }
  }, [rawProducts]);
  
  // Compare utility functions - moved from renderCompare
  const removeFromCompare = (productId: string) => {
    const newCompare = compareList.filter(id => id !== productId);
    setCompareList(newCompare);
    setCompareProducts(compareProducts.filter(item => item.id !== productId));
    localStorage.setItem('compareList', JSON.stringify(newCompare));
  };

  const clearCompare = () => {
    setCompareList([]);
    setCompareProducts([]);
    localStorage.setItem('compareList', JSON.stringify([]));
  };
  
  // Navigation enhancement functions

  
  const updateBreadcrumbs = (key: string, label: string) => {
    setBreadcrumbHistory(prev => {
      const newHistory = [...prev];
      const existingIndex = newHistory.findIndex(item => item.key === key);
      
      if (existingIndex !== -1) {
        // Remove items after the clicked breadcrumb
        return newHistory.slice(0, existingIndex + 1);
      } else {
        // Add new breadcrumb
        newHistory.push({ key, label });
        // Keep only last 4 breadcrumbs
        if (newHistory.length > 4) {
          return newHistory.slice(-4);
        }
        return newHistory;
      }
    });
  };
  
  const setNavigationLoadingState = (itemKey: string, isLoading: boolean) => {
    setNavigationLoading(prev => {
      const newLoading = new Set(prev);
      if (isLoading) {
        newLoading.add(itemKey);
      } else {
        newLoading.delete(itemKey);
      }
      return newLoading;
    });
  };
  
  // Theme state
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  
  const [dashboardData, setDashboardData] = useState<any>({
    stats: [],
    recentActivity: []
  });
  const [dataCache, setDataCache] = useState<Map<string, any>>(new Map());
  const [dataError, setDataError] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
  }>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  });

  // Layout classes based on selected layout
  const getLayoutClasses = () => {
    switch (dashboardLayout) {
      case 'compact':
        return {
          container: 'space-y-3',
          card: 'p-3',
          header: 'pb-2',
          content: 'space-y-2',
          text: 'text-sm',
          grid: 'grid-cols-2 md:grid-cols-4 gap-3',
          chart: 'h-48',
          stats: 'p-2',
          statsText: 'text-xs',
          statsValue: 'text-lg'
        };
      case 'expanded':
        return {
          container: 'space-y-8',
          card: 'p-8',
          header: 'pb-6',
          content: 'space-y-6',
          text: 'text-base',
          grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
          chart: 'h-96',
          stats: 'p-6',
          statsText: 'text-base',
          statsValue: 'text-3xl'
        };
      case 'minimal':
        return {
          container: 'space-y-2',
          card: 'p-2',
          header: 'pb-1',
          content: 'space-y-1',
          text: 'text-xs',
          grid: 'grid-cols-4 md:grid-cols-6 gap-2',
          chart: 'h-32',
          stats: 'p-1',
          statsText: 'text-xs',
          statsValue: 'text-sm'
        };
      default:
        return {
          container: 'space-y-6',
          card: 'p-6',
          header: 'pb-4',
          content: 'space-y-4',
          text: 'text-sm',
          grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
          chart: 'h-64',
          stats: 'p-4',
          statsText: 'text-sm',
          statsValue: 'text-2xl'
        };
    }
  };

  const layoutClasses = getLayoutClasses();



  // Color theme options
  const popularColors = [
    { name: 'Yellow', value: 'yellow', color: 'bg-yellow-500' },
    { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
    { name: 'Green', value: 'emerald', color: 'bg-emerald-500' },
    { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
    { name: 'Red', value: 'red', color: 'bg-red-500' },
    { name: 'Orange', value: 'orange', color: 'bg-orange-500' }
  ];

  const extendedColors = [
    { name: 'Teal', value: 'teal', color: 'bg-teal-500' },
    { name: 'Indigo', value: 'indigo', color: 'bg-indigo-500' },
    { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
    { name: 'Lime', value: 'lime', color: 'bg-lime-500' },
    { name: 'Cyan', value: 'cyan', color: 'bg-cyan-500' },
    { name: 'Amber', value: 'amber', color: 'bg-amber-500' },
    { name: 'Emerald', value: 'emerald', color: 'bg-emerald-500' },
    { name: 'Violet', value: 'violet', color: 'bg-violet-500' },
    { name: 'Rose', value: 'rose', color: 'bg-rose-500' },
    { name: 'Sky', value: 'sky', color: 'bg-sky-500' },
    { name: 'Fuchsia', value: 'fuchsia', color: 'bg-fuchsia-500' },
    { name: 'Slate', value: 'slate', color: 'bg-slate-500' }
  ];

  // Keyboard shortcuts and event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close dropdowns with Escape
      if (e.key === 'Escape') {
        setShowColorPicker(false);
        setShowUserDropdown(false);
        setShowHeaderDropdown(false);
        setShowNotifications(false);
      }
      
      // Keyboard shortcuts (Ctrl/Cmd + key)
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Focus navigation search
            const searchInput = document.querySelector('.navigation-search') as HTMLInputElement;
            if (searchInput) searchInput.focus();
            break;
          case 'n':
            e.preventDefault();
            setShowNotifications(!showNotifications);
            break;
          case 'r':
            e.preventDefault();
            // Refresh dashboard data
            window.location.reload();
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case '1':
            e.preventDefault();
            setActiveTab('overview');
            break;
          case '2':
            e.preventDefault();
            setActiveTab('analytics');
            break;
          case '3':
            e.preventDefault();
            setActiveTab('performance');
            break;
          case '?':
            e.preventDefault();
            setShowShortcuts(true);
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showColorPicker, showUserDropdown, showNotifications, sidebarCollapsed]);

  // Initialize dashboard data based on user role
  useEffect(() => {
    setDashboardData(getDashboardData());
  }, [userRole]);

  // Real-time data updates with customizable intervals
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Update dashboard data at customizable intervals
      setDashboardData(prev => ({
        ...prev,
        stats: prev.stats.map(stat => ({
          ...stat,
          value: stat.title === 'Active Users' ? 
            `${(Math.random() * 1000 + 12000).toFixed(0)}` : 
            stat.title === 'Total Revenue' ?
            `$${(Math.random() * 10000 + 50000).toFixed(0)}` :
            stat.value
        }))
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown && !(event.target as Element).closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
      if (showExportDropdown && !(event.target as Element).closest('.export-dropdown')) {
        setShowExportDropdown(false);
      }
      if (showProfileDropdown && !(event.target as Element).closest('.header-dropdown')) {
        setShowProfileDropdown(false);
      }
      if (showNotifications && !(event.target as Element).closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (showBulkActions && !(event.target as Element).closest('.bulk-actions')) {
        setShowBulkActions(false);
      }

    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown, showExportDropdown, showProfileDropdown, showBulkActions]);

  // Comprehensive navigation structure for AVEENIX platform
  const getNavigationSections = () => {
    // Get effective role for navigation filtering - use selectedRoleView when in role view mode
    const effectiveRole = selectedRoleView || userRole;
    const sections = [
      // Dashboard
      {
        id: 'main',
        label: 'Dashboard',
        icon: LayoutDashboard,
        key: 'dashboard-module',
        roles: ['superadmin', 'admin', 'vendor', 'business', 'customer']
      },

      // Business Apps
      {
        id: 'jarvis',
        label: 'Business Apps',
        icon: Bot,
        key: 'business-apps',
        roles: ['superadmin', 'admin', 'business', 'vendor']
      },

      // Custom Apps
      {
        id: 'workshop',
        label: 'Custom Apps',
        icon: Wrench,
        key: 'custom-apps',
        roles: ['superadmin', 'admin', 'business', 'vendor']
      },

      // Directory
      {
        id: 'directory',
        label: 'Directory',
        icon: Building,
        key: 'directory',
        roles: ['superadmin', 'admin', 'business', 'vendor']
      },

      // Vendor
      {
        id: 'vendor',
        label: 'Vendor',
        icon: Store,
        key: 'vendor',
        roles: ['superadmin', 'admin', 'vendor']
      },
      
      // My Account
      {
        id: 'account',
        label: 'My Account',
        icon: User,
        key: 'my-account',
        roles: ['all']
      },

      // Settings
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        key: 'settings',
        roles: ['all']
      },

      // System Administration
      {
        id: 'admin',
        label: 'System Administration',
        icon: Shield,
        key: 'system-administration',
        roles: ['superadmin', 'admin']
      },

      // E-Commerce
      {
        id: 'ecommerce',
        label: 'E-Commerce',
        icon: ShoppingCart,
        key: 'e-commerce',
        roles: ['superadmin', 'admin', 'vendor', 'business']
      },

    ];

    // Filter sections and items based on effective role (selectedRoleView or userRole)
    return sections.filter(section => {
      // Handle sections without items (like Dashboard)
      if (!section.items) {
        return section.roles && (section.roles.includes('all') || section.roles.includes(effectiveRole));
      }
      
      const filteredItems = section.items.filter((item: any) => 
        item.roles && (item.roles.includes('all') || item.roles.includes(effectiveRole))
      );
      
      // Debug logging for section visibility when in role view mode
      if (selectedRoleView && section.id === 'admin') {
        console.log('=== DEBUG ROLE VIEW FILTERING ===');
        console.log('Selected role view:', selectedRoleView);
        console.log('Effective role:', effectiveRole);
        console.log('Original user role:', userRole);
        console.log('Section roles:', section.roles);
        console.log('===================================');
      }
      
      // Only show section if user has access to at least one item
      if (filteredItems.length === 0) return false;
      
      // Additional section-level filtering based on effective role
      switch (effectiveRole) {
        case 'superadmin':
          return true; // SuperAdmin sees all sections including System Administration
        case 'admin':
          // Admin sees all sections EXCEPT System Administration
          return section.id !== 'admin';
        case 'vendor':
          return ['main', 'ecommerce', 'directory', 'vendor', 'account', 'settings'].includes(section.id);
        case 'customer':
          return ['main', 'ecommerce', 'account', 'settings'].includes(section.id);
        case 'business':
          return ['main', 'jarvis', 'workshop', 'ecommerce', 'directory', 'account', 'settings'].includes(section.id);
        default:
          return true;
      }
    }).map(section => ({
      ...section,
      items: section.items ? section.items.filter((item: any) => 
        item.roles && (item.roles.includes('all') || item.roles.includes(effectiveRole))
      ) : undefined
    }));
  };

  const navigationSections = getNavigationSections();
  
  // Update navigation sections when selectedRoleView changes
  useEffect(() => {
    // Force re-render of navigation when role view changes
    if (selectedRoleView) {
      console.log('Role view changed to:', selectedRoleView);
      console.log('Filtered navigation sections:', getNavigationSections().map(s => s.label));
    }
  }, [selectedRoleView]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSubsection = (subsectionId: string) => {
    setExpandedSubsections(prev => 
      prev.includes(subsectionId) 
        ? prev.filter(id => id !== subsectionId)
        : [...prev, subsectionId]
    );
  };

  const getRoleWelcomeMessage = () => {
    switch (userRole) {
      case 'superadmin':
        return 'System-wide control and monitoring. Manage all platform modules, users, and system configurations.';
      case 'admin':
        return 'Full administrative access to e-commerce operations, user management, and business analytics.';
      case 'vendor':
        return 'Manage your store, products, orders, and track your sales performance and payouts.';
      case 'customer':
        return 'Track your orders, manage your account, wishlist, and explore personalized recommendations.';
      case 'business':
        return 'Manage your business operations, services, appointments, customer records, and use our SaaS tools.';
      default:
        return 'Welcome back! Here\'s your dashboard overview.';
    }
  };

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    
    const measurePerformance = () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;
      
      setPerformanceMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(performance.now() - startTime),
        memoryUsage: Math.round(memoryUsage)
      });
    };
    
    // Measure performance after component mounts
    setTimeout(measurePerformance, 100);
  }, [userRole]);

  // Initialize dashboard data on component mount with caching and error handling
  useEffect(() => {
    const cacheKey = `dashboard_${userRole}`;
    const cachedData = dataCache.get(cacheKey);
    
    // Check if we have cached data that's less than 5 minutes old
    if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
      setDashboardData(cachedData.data);
      setDataError(null);
    } else {
      // Fetch fresh data with error handling
      try {
        setIsDataLoading(true);
        setDataError(null);
        
        const freshData = getDashboardData();
        setDashboardData(freshData);
        
        // Update cache
        const newCache = new Map(dataCache);
        newCache.set(cacheKey, {
          data: freshData,
          timestamp: Date.now()
        });
        setDataCache(newCache);
      } catch (error) {
        setDataError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard data error:', error);
      } finally {
        setIsDataLoading(false);
      }
    }
  }, [userRole]);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Search through dashboard data, menu items, and other content
    const results = [];
    
    // Search menu items
    menuItems.forEach(item => {
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'menu',
          title: item.name,
          description: `Navigate to ${item.name}`,
          action: () => setActiveSection(item.name)
        });
      }
    });

    // Search dashboard stats
    dashboardData.stats.forEach(stat => {
      if (stat.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'stat',
          title: stat.title,
          description: `${stat.value} (${stat.change})`,
          action: () => setActiveSection('Dashboard')
        });
      }
    });

    // Search recent activity
    dashboardData.recentActivity.forEach(activity => {
      if (activity.action.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'activity',
          title: activity.action,
          description: `${activity.time} by ${activity.user}`,
          action: () => setActiveSection('Dashboard')
        });
      }
    });

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Advanced filtering and sorting
  const applyFiltersAndSort = (data: any[]) => {
    let filtered = data;
    
    // Apply filters
    if (filterBy !== 'all') {
      filtered = data.filter(item => {
        switch(filterBy) {
          case 'recent':
            return new Date(item.date || item.time || Date.now()) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          case 'high-priority':
            return item.priority === 'high' || item.status === 'urgent';
          case 'completed':
            return item.status === 'completed' || item.status === 'success';
          case 'pending':
            return item.status === 'pending' || item.status === 'processing';
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'date':
          aValue = new Date(a.date || a.time || Date.now()).getTime();
          bValue = new Date(b.date || b.time || Date.now()).getTime();
          break;
        case 'name':
          aValue = (a.name || a.title || a.action || '').toLowerCase();
          bValue = (b.name || b.title || b.action || '').toLowerCase();
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  };

  // Responsive chart configuration
  const getChartConfig = () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      height: isMobile ? 200 : isTablet ? 250 : 300,
      fontSize: isMobile ? 10 : 12,
      showLegend: !isMobile,
      gridLines: !isMobile,
      tooltips: {
        enabled: true,
        mode: isMobile ? 'index' : 'point',
        intersect: false
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: !isMobile
          },
          ticks: {
            maxRotation: isMobile ? 45 : 0,
            font: {
              size: isMobile ? 10 : 12
            }
          }
        },
        y: {
          display: true,
          grid: {
            display: !isMobile
          },
          ticks: {
            font: {
              size: isMobile ? 10 : 12
            }
          }
        }
      }
    };
  };

  // Mobile navigation patterns
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [mobileNavCollapsed, setMobileNavCollapsed] = useState(true);
  
  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
    setMobileNavCollapsed(!mobileNavCollapsed);
  };

  // Mobile swipe navigation
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    if (isRightSwipe && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e: React.DragEvent, item: string) => {
    setIsDragging(true);
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const currentOrder = [...widgetOrder];
    const draggedIndex = currentOrder.indexOf(draggedItem);
    const targetIndex = currentOrder.indexOf(targetItem);

    // Reorder widgets
    currentOrder.splice(draggedIndex, 1);
    currentOrder.splice(targetIndex, 0, draggedItem);

    setWidgetOrder(currentOrder);
    setIsDragging(false);
    setDraggedItem(null);
  };

  // Bulk actions functionality
  const handleBulkAction = (action: 'delete' | 'archive' | 'export') => {
    setBulkActionType(action);
    
    switch(action) {
      case 'delete':
        // Handle bulk delete
        setSelectedItems([]);
        setShowBulkActions(false);
        break;
      case 'archive':
        // Handle bulk archive
        setSelectedItems([]);
        setShowBulkActions(false);
        break;
      case 'export':
        // Handle bulk export
        const exportData = {
          selectedItems,
          dashboardData,
          timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setSelectedItems([]);
        setShowBulkActions(false);
        break;
    }
  };

  // Enhanced keyboard shortcuts (Enhancement #8)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with inputs unless it's a global shortcut
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.ctrlKey || e.metaKey) {
          switch(e.key.toLowerCase()) {
            case 'k':
              e.preventDefault();
              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
                searchInput.select();
              }
              break;
          }
        }
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            // Focus search with selection
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            }
            break;
          case 'n':
            e.preventDefault();
            setShowNotifications(true);
            break;
          case 'r':
            e.preventDefault();
            window.location.reload();
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case 'e':
            e.preventDefault();
            setShowExportDropdown(!showExportDropdown);
            break;
          case 'f':
            e.preventDefault();
            setShowFilters(!showFilters);
            break;
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
            e.preventDefault();
            // Quick navigation shortcuts for common sections
            const commonSections = ['dashboard-module', 'product-management', 'inventory-management', 'sales-management', 'e-commerce'];
            const index = parseInt(e.key) - 1;
            if (commonSections[index]) {
              setActiveTab(commonSections[index]);
            }
            break;
          case '?':
            e.preventDefault();
            setShowShortcuts(true);
            break;
        }
      } else {
        switch (e.key) {
          case 'Escape':
            // Close all open dropdowns and modals
            setShowExportDropdown(false);
            setShowBulkActions(false);
            setShowSearchSuggestions(false);
            setShowNotifications(false);
            setShowShortcuts(false);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed, showExportDropdown, showFilters, showSearchSuggestions, showNotifications, showShortcuts, showBulkActions]);

  // Lazy loading functionality
  const lazyLoadData = async (dataType: string, params: any = {}) => {
    const cacheKey = `${dataType}_${JSON.stringify(params)}`;
    
    // Check if data is already loaded
    if (lazyLoadedData.has(cacheKey)) {
      return lazyLoadedData.get(cacheKey);
    }
    
    // Set loading state
    setLoadingStates(prev => new Map(prev).set(cacheKey, true));
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on type
      let data;
      switch(dataType) {
        case 'analytics':
          data = {
            pageViews: Math.floor(Math.random() * 10000),
            sessions: Math.floor(Math.random() * 5000),
            bounceRate: (Math.random() * 0.5 + 0.2).toFixed(2),
            avgSessionTime: '2:45'
          };
          break;
        case 'reports':
          data = Array.from({length: 50}, (_, i) => ({
            id: i + 1,
            title: `Report ${i + 1}`,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)]
          }));
          break;
        default:
          data = { message: 'Data loaded successfully' };
      }
      
      // Cache the data
      setLazyLoadedData(prev => new Map(prev).set(cacheKey, data));
      return data;
    } catch (error) {
      console.error(`Error loading ${dataType}:`, error);
      return null;
    } finally {
      setLoadingStates(prev => new Map(prev).set(cacheKey, false));
    }
  };

  // API integration functions
  const callExternalAPI = async (endpoint: string, data: any = {}) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      return { error: error.message };
    }
  };

  // Webhook support
  const registerWebhook = async (url: string, events: string[]) => {
    return await callExternalAPI(apiEndpoints.webhooks, {
      action: 'register',
      url,
      events
    });
  };

  // Data export functionality
  const exportDashboardData = async (format: 'json' | 'csv' | 'pdf' = 'json') => {
    const exportData = {
      dashboardData,
      userRole,
      timestamp: new Date().toISOString(),
      format
    };
    
    return await callExternalAPI(apiEndpoints.export, exportData);
  };

  // Export handler functions
  const handleExportPDF = () => {
    // Generate PDF export
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>AVEENIX Dashboard Export - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #f59e0b; }
            h2 { color: #666; margin-top: 30px; }
            .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #f59e0b; }
            .stat-label { color: #666; font-size: 14px; }
            .activity-item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .footer { margin-top: 40px; text-align: center; color: #999; }
          </style>
        </head>
        <body>
          <h1>AVEENIX Dashboard Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>User Role:</strong> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
          
          <h2>Dashboard Statistics</h2>
          <div class="stat-grid">
            ${dashboardData.stats?.map(stat => `
              <div class="stat-card">
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.title}</div>
              </div>
            `).join('') || '<p>No statistics available</p>'}
          </div>
          
          <h2>Recent Activity</h2>
          ${dashboardData.recentActivity?.map(activity => `
            <div class="activity-item">
              <strong>${activity.action}</strong><br>
              <small>${activity.user} • ${activity.time}</small>
            </div>
          `).join('') || '<p>No recent activity</p>'}
          
          <div class="footer">
            <p>AVEENIX Hub Dashboard Export | ${new Date().getFullYear()}</p>
          </div>
        </body>
      </html>
    `;
    
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    
    logUserAction('export_pdf', { timestamp: new Date().toISOString() });
  };

  const handleExportExcel = () => {
    // Generate CSV data for Excel
    const csvData = [];
    csvData.push(['AVEENIX Dashboard Export', '', '', '']);
    csvData.push(['Generated', new Date().toLocaleString(), '', '']);
    csvData.push(['User Role', userRole.charAt(0).toUpperCase() + userRole.slice(1), '', '']);
    csvData.push(['', '', '', '']);
    
    // Add statistics
    csvData.push(['Dashboard Statistics', '', '', '']);
    csvData.push(['Metric', 'Value', 'Change', 'Type']);
    if (dashboardData.stats) {
      dashboardData.stats.forEach(stat => {
        csvData.push([stat.title, stat.value, stat.change || '', stat.color || '']);
      });
    }
    
    csvData.push(['', '', '', '']);
    
    // Add recent activity
    csvData.push(['Recent Activity', '', '', '']);
    csvData.push(['Action', 'User', 'Time', 'Status']);
    if (dashboardData.recentActivity) {
      dashboardData.recentActivity.forEach(activity => {
        csvData.push([activity.action, activity.user, activity.time, activity.status || '']);
      });
    }
    
    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `aveenix-dashboard-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    logUserAction('export_excel', { timestamp: new Date().toISOString() });
  };

  const handleExportChart = () => {
    // Generate chart image export
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add title
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AVEENIX Dashboard Statistics', canvas.width / 2, 40);
    
    // Add subtitle
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, canvas.width / 2, 70);
    
    // Draw chart bars if stats available
    if (dashboardData.stats && dashboardData.stats.length > 0) {
      const barWidth = (canvas.width - 100) / dashboardData.stats.length;
      const maxHeight = 300;
      const baseY = 500;
      
      // Find max value for scaling
      const values = dashboardData.stats.map(stat => {
        const numValue = parseFloat(stat.value.replace(/[^0-9.-]/g, ''));
        return isNaN(numValue) ? 0 : numValue;
      });
      const maxValue = Math.max(...values, 1);
      
      dashboardData.stats.forEach((stat, index) => {
        const numValue = parseFloat(stat.value.replace(/[^0-9.-]/g, ''));
        const normalizedValue = isNaN(numValue) ? 0 : numValue;
        const barHeight = (normalizedValue / maxValue) * maxHeight;
        
        const x = 50 + index * barWidth + barWidth * 0.1;
        const barWidthActual = barWidth * 0.8;
        
        // Draw bar
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x, baseY - barHeight, barWidthActual, barHeight);
        
        // Add value label
        ctx.fillStyle = '#333333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(stat.value, x + barWidthActual / 2, baseY - barHeight - 10);
        
        // Add stat label
        ctx.font = '12px Arial';
        ctx.fillText(stat.title, x + barWidthActual / 2, baseY + 20);
      });
    }
    
    // Download chart
    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `aveenix-dashboard-chart-${new Date().toISOString().split('T')[0]}.png`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    logUserAction('export_chart', { timestamp: new Date().toISOString() });
  };

  // Data import functionality
  const importDashboardData = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(apiEndpoints.import, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Import failed');
      }
      
      const result = await response.json();
      // Refresh dashboard after import
      setDashboardData(prev => ({ ...prev, ...result.data }));
      return result;
    } catch (error) {
      console.error('Import error:', error);
      return { error: error.message };
    }
  };

  // Role-based access control
  const hasPermission = (action: string, resource: string) => {
    const permissions = {
      superadmin: ['*'],
      admin: ['read', 'write', 'export', 'analytics', 'user_management'],
      vendor: ['read', 'write', 'export', 'own_data'],
      customer: ['read', 'own_data'],
      business: ['read', 'write', 'analytics', 'own_data']
    };

    const userPermissions = permissions[userRole] || [];
    return userPermissions.includes('*') || userPermissions.includes(action) || 
           (action === 'read' && resource === 'own_data');
  };

  // Audit logging functionality
  const logUserAction = (action: string, details: any = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: 'current_user_id',
      userRole,
      action,
      details,
      sessionId: localStorage.getItem('session_id') || 'unknown',
      ipAddress: 'client_ip',
      userAgent: navigator.userAgent
    };

    // Store in local storage for demo (in production, send to server)
    const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    existingLogs.push(logEntry);
    
    // Keep only last 100 entries
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('audit_logs', JSON.stringify(existingLogs));
    
    // Also send to server in production
    // callExternalAPI('/api/audit-log', logEntry);
  };

  // Session management
  const extendSession = () => {
    const sessionData = {
      lastActivity: new Date().toISOString(),
      userRole,
      extendedAt: new Date().toISOString()
    };
    
    localStorage.setItem('session_data', JSON.stringify(sessionData));
    logUserAction('session_extended', sessionData);
  };

  // Auto-extend session on activity
  useEffect(() => {
    const handleActivity = () => {
      extendSession();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [userRole]);

  // Role-based dashboard data
  const getDashboardData = () => {
    switch (userRole) {
      case 'superadmin':
        return {
          stats: [
            { title: 'Total Users', value: '12,345', change: '+8%', icon: Users, color: 'blue' },
            { title: 'Active Modules', value: '8', change: '+2', icon: Building, color: 'green' },
            { title: 'System Uptime', value: '99.9%', change: '+0.1%', icon: Activity, color: 'purple' },
            { title: 'Database Size', value: '2.4 GB', change: '+15%', icon: Database, color: 'orange' }
          ],
          recentActivity: [
            { action: 'New module deployed', time: '5 minutes ago', user: 'System', status: 'success' },
            { action: 'Database backup completed', time: '1 hour ago', user: 'System', status: 'success' },
            { action: 'User admin-001 created', time: '2 hours ago', user: 'SuperAdmin', status: 'info' }
          ]
        };
      case 'admin':
        return {
          stats: [
            { title: 'Total Revenue', value: '$12,450', change: '+18%', icon: DollarSign, color: 'green' },
            { title: 'Active Users', value: '2,341', change: '+12%', icon: Users, color: 'blue' },
            { title: 'Orders', value: '89', change: '+5%', icon: ShoppingCart, color: 'purple' },
            { title: 'Conversion', value: '3.2%', change: '+0.8%', icon: TrendingUp, color: 'orange' }
          ],
          recentActivity: [
            { action: 'New order received', time: '2 minutes ago', user: 'John Doe', status: 'success' },
            { action: 'Product updated', time: '15 minutes ago', user: 'Jane Smith', status: 'info' },
            { action: 'Payment processed', time: '1 hour ago', user: 'Mike Johnson', status: 'success' }
          ]
        };
      case 'vendor':
        return {
          stats: [
            { title: 'My Revenue', value: '$3,240', change: '+22%', icon: DollarSign, color: 'green' },
            { title: 'Products Sold', value: '156', change: '+8%', icon: Package, color: 'blue' },
            { title: 'Pending Orders', value: '12', change: '+3', icon: ShoppingCart, color: 'orange' },
            { title: 'Store Rating', value: '4.8', change: '+0.2', icon: Star, color: 'purple' }
          ],
          recentActivity: [
            { action: 'Product "Wireless Headphones" sold', time: '5 minutes ago', user: 'Customer', status: 'success' },
            { action: 'Inventory updated', time: '30 minutes ago', user: 'You', status: 'info' },
            { action: 'New review received', time: '1 hour ago', user: 'Sarah Wilson', status: 'success' }
          ]
        };
      case 'customer':
        return {
          stats: [
            { title: 'Orders This Month', value: '8', change: '+2', icon: ShoppingCart, color: 'blue' },
            { title: 'Total Spent', value: '$1,234', change: '+15%', icon: DollarSign, color: 'green' },
            { title: 'Wishlist Items', value: '24', change: '+6', icon: Heart, color: 'purple' },
            { title: 'Loyalty Points', value: '1,850', change: '+150', icon: Star, color: 'orange' }
          ],
          recentActivity: [
            { action: 'Order #ORD-123 shipped', time: '1 hour ago', user: 'AVEENIX', status: 'success' },
            { action: 'Added item to wishlist', time: '3 hours ago', user: 'You', status: 'info' },
            { action: 'Payment successful', time: '1 day ago', user: 'You', status: 'success' }
          ]
        };
      case 'business':
        return {
          stats: [
            { title: 'Appointments Today', value: '12', change: '+3', icon: Calendar, color: 'blue' },
            { title: 'Revenue This Week', value: '$2,850', change: '+12%', icon: DollarSign, color: 'green' },
            { title: 'Active Customers', value: '89', change: '+5', icon: Users, color: 'purple' },
            { title: 'Service Rating', value: '4.9', change: '+0.1', icon: Star, color: 'orange' }
          ],
          recentActivity: [
            { action: 'Appointment completed', time: '30 minutes ago', user: 'John Smith', status: 'success' },
            { action: 'New booking received', time: '1 hour ago', user: 'Sarah Johnson', status: 'info' },
            { action: 'Invoice sent', time: '2 hours ago', user: 'Mike Wilson', status: 'success' }
          ]
        };
      default:
        return { stats: [], recentActivity: [] };
    }
  };



  const renderOverview = () => {
    return <RoleBasedDashboard />;
  };

  const renderAnalytics = () => {
    const getAnalyticsContent = () => {
      switch (userRole) {
        case 'customer':
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Shopping Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">$2,450</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">24</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Orders Placed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">$102</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Average Order</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300">Popular Category</h4>
                      <p className="text-blue-700 dark:text-blue-400">Electronics (40%)</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-300">Savings</h4>
                      <p className="text-green-700 dark:text-green-400">$324 saved this year</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-300">Loyalty Points</h4>
                      <p className="text-purple-700 dark:text-purple-400">2,450 points earned</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-300">Wishlist Items</h4>
                      <p className="text-orange-700 dark:text-orange-400">12 items saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        default:
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">68%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">$24K</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">1.2K</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">New Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
      }
    };
    
    return getAnalyticsContent();
  };

  const renderManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center">
              <Users className="w-6 h-6 mb-2" />
              User Management
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center">
              <Package className="w-6 h-6 mb-2" />
              Products
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center">
              <ShoppingCart className="w-6 h-6 mb-2" />
              Order Management
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center">
              <Settings className="w-6 h-6 mb-2" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAutoBlogs = () => (
    <div className="space-y-6">
      {/* Header Banner - Product Management Template with Purple Theme */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 border border-purple-200 dark:border-gray-600 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Auto Blogs</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Automated content generation and blog management with AI-powered workflows
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards - Horizontal Layout */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">12</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">8</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Pending</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">45</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Published</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">2.4k</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Views</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Archive className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">156</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Total Posts</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Management */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Tech Reviews Weekly',
                    status: 'active',
                    posts: 24,
                    frequency: 'Weekly',
                    lastPost: '2 hours ago'
                  },
                  {
                    name: 'Product Spotlights',
                    status: 'active', 
                    posts: 18,
                    frequency: 'Daily',
                    lastPost: '5 minutes ago'
                  },
                  {
                    name: 'Industry News Digest',
                    status: 'paused',
                    posts: 12,
                    frequency: 'Bi-daily',
                    lastPost: '1 day ago'
                  }
                ].map((campaign) => (
                  <div key={campaign.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {campaign.posts} posts • {campaign.frequency} • Last: {campaign.lastPost}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="bg-purple-100 text-purple-800">
                        {campaign.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: 'Top 10 Gaming Laptops for 2024',
                    category: 'Electronics',
                    status: 'published',
                    views: 1243,
                    published: '3 hours ago'
                  },
                  {
                    title: 'Sustainable Fashion: Eco-Friendly Clothing Brands',
                    category: 'Fashion',
                    status: 'published',
                    views: 856,
                    published: '1 day ago'
                  },
                  {
                    title: 'Smart Home Security Systems Comparison',
                    category: 'Home & Garden',
                    status: 'draft',
                    views: 0,
                    published: 'Draft'
                  }
                ].map((post) => (
                  <div key={post.title} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{post.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                        <span>•</span>
                        <span>{post.published}</span>
                      </div>
                    </div>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="bg-purple-100 text-purple-800">
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Views</span>
                  <span className="font-medium text-purple-600">2,458</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
                  <span className="font-medium text-purple-600">7.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Read Time</span>
                  <span className="font-medium text-purple-600">3m 24s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Social Shares</span>
                  <span className="font-medium text-purple-600">186</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                AI Content Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Ready to generate content for your next campaign. What topic would you like to explore?
                </p>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Campaign Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Posts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContentLibrary = () => (
    <div className="space-y-6">
      {/* Header Banner - Product Management Template with Purple Theme */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 border border-purple-200 dark:border-gray-600 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Library</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage content templates, media assets, and reusable components for your campaigns
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards - Horizontal Layout */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">48</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Templates</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">124</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Published</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">16</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Drafts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">892</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Media Files</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Download className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">3.2k</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Downloads</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Content Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Product Review Template',
                    category: 'Reviews',
                    usage: 45,
                    type: 'Article',
                    preview: 'Comprehensive product analysis with pros, cons, and ratings...'
                  },
                  {
                    name: 'Social Media Post',
                    category: 'Social',
                    usage: 128,
                    type: 'Short Form',
                    preview: 'Engaging social media content with hashtags and CTAs...'
                  },
                  {
                    name: 'Email Newsletter',
                    category: 'Email',
                    usage: 32,
                    type: 'Newsletter',
                    preview: 'Professional email template with product highlights...'
                  },
                  {
                    name: 'Comparison Guide',
                    category: 'Guides',
                    usage: 67,
                    type: 'Long Form',
                    preview: 'Side-by-side product comparison with detailed analysis...'
                  }
                ].map((template) => (
                  <div key={template.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.category} • {template.type}</p>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {template.usage} uses
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.preview}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Recent Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: 'Summer Fashion Trends 2024',
                    type: 'Article Template',
                    status: 'published',
                    updated: '2 hours ago',
                    downloads: 23
                  },
                  {
                    title: 'Tech Product Comparison Layout',
                    type: 'Comparison Guide',
                    status: 'draft',
                    updated: '1 day ago',
                    downloads: 0
                  },
                  {
                    title: 'Holiday Shopping Email',
                    type: 'Newsletter Template',
                    status: 'published',
                    updated: '3 days ago',
                    downloads: 47
                  }
                ].map((content) => (
                  <div key={content.title} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{content.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{content.type}</span>
                        <span>•</span>
                        <span>{content.downloads} downloads</span>
                        <span>•</span>
                        <span>{content.updated}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={content.status === 'published' ? 'default' : 'secondary'} className="bg-purple-100 text-purple-800">
                        {content.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Media Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                Media Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                    <span className="font-medium text-purple-600">2.4 GB / 10 GB</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Media
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-purple-600" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Product Reviews', count: 28 },
                  { name: 'Social Media', count: 45 },
                  { name: 'Email Templates', count: 18 },
                  { name: 'Comparison Guides', count: 22 },
                  { name: 'Landing Pages', count: 12 }
                ].map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                    <span className="text-sm text-gray-900 dark:text-white">{category.name}</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Library
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Library Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSeoTools = () => (
    <div className="space-y-6">
      {/* Header Banner - Product Management Template with Green/Teal Theme */}
      <div className="bg-gradient-to-r from-green-50 to-teal-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 border border-green-200 dark:border-gray-600 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Tools</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Optimize your website performance with comprehensive SEO analysis and monitoring tools
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Run SEO Audit
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards - Horizontal Layout */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">152</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Pages Analyzed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">347</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Keywords Tracked</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-600">23</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Issues Found</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Star className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">87</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">SEO Score</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">+24%</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Organic Traffic</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SEO Audit Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-green-600" />
                SEO Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">87</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall SEO Score</div>
                  <div className="text-xs text-green-600 mt-1">↗ +5 this week</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2.3s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Page Load Speed</div>
                  <div className="text-xs text-green-600 mt-1">↗ Improved</div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mobile Friendly</div>
                  <div className="text-xs text-green-600 mt-1">↗ Optimized</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Meta Tags</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All pages have proper meta descriptions</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Optimized</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Image Alt Tags</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">12 images missing alt attributes</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">Needs Fix</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">SSL Certificate</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Valid SSL certificate installed</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Secure</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Top Keywords Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { keyword: 'e-commerce platform', position: 3, change: '+2', volume: '12k', difficulty: 'Medium' },
                  { keyword: 'online marketplace', position: 7, change: '+1', volume: '8.5k', difficulty: 'High' },
                  { keyword: 'product management', position: 12, change: '-3', volume: '5.2k', difficulty: 'Low' },
                  { keyword: 'inventory system', position: 8, change: '+5', volume: '3.8k', difficulty: 'Medium' },
                  { keyword: 'business automation', position: 15, change: '0', volume: '2.1k', difficulty: 'High' }
                ].map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{keyword.keyword}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>Volume: {keyword.volume}</span>
                        <span>•</span>
                        <span>Difficulty: {keyword.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">#{keyword.position}</div>
                        <div className="text-xs text-gray-500">Position</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        keyword.change.startsWith('+') ? 'text-green-600' : 
                        keyword.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {keyword.change !== '0' ? keyword.change : '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-green-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Run SEO Audit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Check Site Health
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Keyword Research
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Audits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2 text-green-600" />
                Recent Audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Full Site Audit', date: '2 hours ago', score: 87, status: 'completed' },
                  { name: 'Mobile Optimization', date: '1 day ago', score: 92, status: 'completed' },
                  { name: 'Page Speed Test', date: '3 days ago', score: 78, status: 'completed' },
                  { name: 'Content Analysis', date: '1 week ago', score: 84, status: 'completed' }
                ].map((audit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{audit.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{audit.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${
                        audit.score >= 90 ? 'text-green-600' :
                        audit.score >= 70 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {audit.score}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SEO Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                SEO Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Technical SEO</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Content Quality</span>
                    <span className="font-medium text-amber-600">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Page Speed</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Mobile Friendly</span>
                    <span className="font-medium text-green-600">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        {/* Header Banner - Matching Product Management Style with Purple/Teal Theme */}
        <div className="bg-gradient-to-r from-purple-50 to-teal-100 dark:from-purple-900/20 dark:to-teal-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-600 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings Overview</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Configure your platform preferences and system settings
                </p>
              </div>
            </div>
          </div>


        </div>

        {/* Settings Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveSettingsTab('general')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSettingsTab === 'general'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                General Settings
              </div>
            </button>
            <button
              onClick={() => setActiveSettingsTab('language')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSettingsTab === 'language'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language & Region
              </div>
            </button>
            <button
              onClick={() => setActiveSettingsTab('notifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSettingsTab === 'notifications'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveSettingsTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSettingsTab === 'security'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveSettingsTab('sessions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSettingsTab === 'sessions'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Session & Device Management
              </div>
            </button>
          </nav>
        </div>

        {/* Settings Tab Content */}
        <div className="mt-6">
          {activeSettingsTab === 'general' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h3>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
              {/* General Settings Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Theme & Appearance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Theme Mode
                        </label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-2">
                            {theme === 'dark' ? (
                              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                          </div>
                          <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              theme === 'dark' 
                                ? 'bg-blue-600' 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Toggle between light and dark theme
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Color Theme
                        </label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              <Palette className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {colorTheme} Theme
                            </span>
                          </div>
                          <DesktopColorPicker />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Click the color picker to change your theme color
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Auto-refresh Interval
                        </label>
                        <select 
                          value={refreshInterval} 
                          onChange={(e) => setRefreshInterval(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="15000">15 seconds</option>
                          <option value="30000">30 seconds</option>
                          <option value="60000">1 minute</option>
                          <option value="300000">5 minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Animation Speed
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="slow">Slow</option>
                          <option value="normal">Normal</option>
                          <option value="fast">Fast</option>
                          <option value="none">No animations</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="enable-lazy" className="rounded" defaultChecked />
                        <label htmlFor="enable-lazy" className="text-sm text-gray-700 dark:text-gray-300">
                          Enable lazy loading
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="cache-data" className="rounded" defaultChecked />
                        <label htmlFor="cache-data" className="text-sm text-gray-700 dark:text-gray-300">
                          Cache data for faster loading
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dashboard Layout
                        </label>
                        <select 
                          value={dashboardLayout} 
                          onChange={(e) => setDashboardLayout(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="default">Default Layout</option>
                          <option value="compact">Compact Layout</option>
                          <option value="expanded">Expanded Layout</option>
                          <option value="minimal">Minimal Layout</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Items per Page
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="10">10 items</option>
                          <option value="25">25 items</option>
                          <option value="50">50 items</option>
                          <option value="100">100 items</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="collapse-sidebar" className="rounded" />
                        <label htmlFor="collapse-sidebar" className="text-sm text-gray-700 dark:text-gray-300">
                          Collapse sidebar by default
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="breadcrumb-nav" className="rounded" defaultChecked />
                        <label htmlFor="breadcrumb-nav" className="text-sm text-gray-700 dark:text-gray-300">
                          Show breadcrumb navigation
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="high-contrast" className="rounded" />
                        <label htmlFor="high-contrast" className="text-sm text-gray-700 dark:text-gray-300">
                          High contrast mode
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="large-text" className="rounded" />
                        <label htmlFor="large-text" className="text-sm text-gray-700 dark:text-gray-300">
                          Large text size
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="reduce-motion" className="rounded" />
                        <label htmlFor="reduce-motion" className="text-sm text-gray-700 dark:text-gray-300">
                          Reduce motion and animations
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="screen-reader" className="rounded" />
                        <label htmlFor="screen-reader" className="text-sm text-gray-700 dark:text-gray-300">
                          Screen reader optimizations
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSettingsTab === 'language' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Language & Region Settings</h3>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  Auto-Detect
                </Button>
              </div>
              {/* Language & Region Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Language Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Interface Language
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="en">English (US)</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="it">Italian</option>
                          <option value="pt">Portuguese</option>
                          <option value="zh">Chinese (Simplified)</option>
                          <option value="ja">Japanese</option>
                          <option value="ko">Korean</option>
                          <option value="ru">Russian</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Secondary Language
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="">None</option>
                          <option value="en">English (US)</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="auto-translate" className="rounded" />
                        <label htmlFor="auto-translate" className="text-sm text-gray-700 dark:text-gray-300">
                          Auto-translate content when available
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country/Region
                        </label>
                        <select 
                          value={selectedCountry?.code || ''} 
                          onChange={(e) => {
                            const country = countries.find(c => c.code === e.target.value);
                            setSelectedCountry(country || null);
                          }}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Time Zone
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                          <option value="UTC-7">Mountain Time (UTC-7)</option>
                          <option value="UTC-6">Central Time (UTC-6)</option>
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC+0">UTC (GMT)</option>
                          <option value="UTC+1">Central European Time (UTC+1)</option>
                          <option value="UTC+8">China Standard Time (UTC+8)</option>
                          <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date Format
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                          <option value="DD.MM.YYYY">DD.MM.YYYY (European)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Number Format
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="1,234.56">1,234.56 (US)</option>
                          <option value="1.234,56">1.234,56 (European)</option>
                          <option value="1 234,56">1 234,56 (French)</option>
                          <option value="1'234.56">1'234.56 (Swiss)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Currency
                        </label>
                        <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                          <option value="JPY">Japanese Yen (¥)</option>
                          <option value="CAD">Canadian Dollar (C$)</option>
                          <option value="AUD">Australian Dollar (A$)</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Keyboard & Input</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Keyboard Layout
                      </label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="qwerty">QWERTY (US)</option>
                        <option value="qwertz">QWERTZ (German)</option>
                        <option value="azerty">AZERTY (French)</option>
                        <option value="dvorak">Dvorak</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Input Method
                      </label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="standard">Standard</option>
                        <option value="ime">Input Method Editor (IME)</option>
                        <option value="phonetic">Phonetic</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spell-check" className="rounded" defaultChecked />
                      <label htmlFor="spell-check" className="text-sm text-gray-700 dark:text-gray-300">
                        Enable spell check
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="auto-correct" className="rounded" />
                      <label htmlFor="auto-correct" className="text-sm text-gray-700 dark:text-gray-300">
                        Auto-correct typos
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="voice-input" className="rounded" />
                      <label htmlFor="voice-input" className="text-sm text-gray-700 dark:text-gray-300">
                        Enable voice input
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSettingsTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
                <Button variant="outline" className="flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Test Notification
                </Button>
              </div>
              {/* Notifications Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Order Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Shipping, delivery, and order status changes</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Promotions & Deals</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Special offers and sales notifications</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">New Products</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Notifications about new arrivals</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Price Drops</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">When items in your wishlist go on sale</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Restock Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Notifications when out-of-stock items become available</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Review Reminders</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reminders to review your purchases</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Newsletter</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly newsletters with tips and updates</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      SMS Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Order Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Critical order status changes only</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Delivery Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">When your package is out for delivery</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Security Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account security and login notifications</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Flash Sales</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Time-limited deals and promotions</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Push Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Order Updates</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time order status changes</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Wishlist Updates</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Price changes and stock alerts</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Customer Support</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Messages from support team</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Product Recommendations</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Personalized product suggestions</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Order #ORD-2024-001 has been delivered</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Your package was delivered to 123 Main Street</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Flash Sale: 50% off Electronics</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Limited time offer on selected Electronics items</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 day ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Item back in stock: Wireless Headphones</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">An item from your wishlist is now available</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 days ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">New login detected: Chrome on Windows</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">We detected a new login from New York. If this wasn't you, please secure your account</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">3 days ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Notifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSettingsTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Security Settings</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-green-600 border-green-300">
                    <Shield className="w-4 h-4 mr-2" />
                    Status
                  </Button>
                </div>
              </div>
              {/* Security Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Password & Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Last changed 30 days ago</p>
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-300">
                        Change Password
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300">
                          Enable
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Backup Codes</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Recovery codes for account access</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-purple-600 border-purple-300">
                          View Codes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Account Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Verification</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">michael@example.com</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-full">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Phone Verification</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-full">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Account Recovery</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recovery email configured</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-300">
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Login Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Chrome on Windows</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">New York, NY • Current session</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-full">
                        Current
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">iPhone Safari</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">New York, NY • 1 day ago</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Nov 15, 2024 at 3:45 PM</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        Revoke
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Tablet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Firefox on MacOS</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Los Angeles, CA • 3 days ago</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Nov 13, 2024 at 10:22 AM</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        Revoke
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Profile Visibility</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your profile information</p>
                      </div>
                      <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Order History Privacy</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Keep your purchase history private</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Activity Tracking</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow tracking for personalized recommendations</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Data Sharing</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Share anonymous data to improve services</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-purple-500 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition-transform duration-200"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Download Account Data</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Export all your account data</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-orange-600 border-orange-300">
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSettingsTab === 'sessions' && renderSessionManagement()}
        </div>
      </div>
    );
  };

  const renderBusinessApps = () => {
    return (
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Optimized Compact Header Banner with Integrated Stats */}
        <div 
          className={`p-4 rounded-lg mb-3 theme-${colorTheme}`}
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--primary-color) 85%, transparent 15%), 
              color-mix(in srgb, var(--primary-color) 95%, #000 5%), 
              color-mix(in srgb, var(--primary-color) 90%, #fff 10%))`,
            color: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' ? '#000' : '#fff'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Business Apps</h1>
                <p 
                  className="text-sm mt-1"
                  style={{ opacity: 0.8 }}
                >
                  Manage your business operations with AI assistant, CRM, email marketing, and support tools
                </p>
              </div>
            </div>
            
            {/* Compact Inline Stats */}
            <div className="flex items-center space-x-3 text-xs">
              <div 
                className="flex items-center gap-1.5 px-2 py-1.5 rounded"
                style={{ backgroundColor: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)' }}
              >
                <Bot className="w-3 h-3" />
                <span className="font-medium">7</span>
                <span style={{ opacity: 0.95 }}>Active Apps</span>
              </div>
              <div 
                className="flex items-center gap-1.5 px-2 py-1.5 rounded"
                style={{ backgroundColor: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)' }}
              >
                <Users className="w-3 h-3" />
                <span className="font-medium">1,249</span>
                <span style={{ opacity: 0.95 }}>CRM Contacts</span>
              </div>
              <div 
                className="flex items-center gap-1.5 px-2 py-1.5 rounded"
                style={{ backgroundColor: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)' }}
              >
                <MessageSquare className="w-3 h-3" />
                <span className="font-medium">34</span>
                <span style={{ opacity: 0.95 }}>Email Campaigns</span>
              </div>
              <div 
                className="flex items-center gap-1.5 px-2 py-1.5 rounded"
                style={{ backgroundColor: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)' }}
              >
                <HelpCircle className="w-3 h-3" />
                <span className="font-medium">87</span>
                <span style={{ opacity: 0.95 }}>Support Tickets</span>
              </div>
              <div 
                className="flex items-center gap-1.5 px-2 py-1.5 rounded"
                style={{ backgroundColor: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)' }}
              >
                <DollarSign className="w-3 h-3" />
                <span className="font-medium">$42.8K</span>
                <span style={{ opacity: 0.95 }}>Monthly Revenue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-6 px-4">
              {[
                { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
                { id: 'crm', label: 'CRM', icon: Users },
                { id: 'email-marketing', label: 'Email Marketing', icon: MessageSquare },
                { id: 'helpdesk', label: 'Helpdesk', icon: HelpCircle },
                { id: 'invoicing', label: 'Invoicing', icon: FileText },
                { id: 'pos', label: 'POS System', icon: Target }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBusinessAppsTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeBusinessAppsTab === tab.id
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  style={activeBusinessAppsTab === tab.id ? {
                    borderBottomColor: 'var(--primary-color)',
                    color: 'var(--primary-color)'
                  } : {}}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content - Optimized spacing and layout */}
          <div className="p-4">
            {activeBusinessAppsTab === 'ai-assistant' && renderAIAssistant()}
            {activeBusinessAppsTab === 'calendar' && renderCalendar()}
            {activeBusinessAppsTab === 'crm' && renderCRM()}
            {activeBusinessAppsTab === 'email-marketing' && renderEmailMarketing()}
            {activeBusinessAppsTab === 'helpdesk' && renderHelpdesk()}
            {activeBusinessAppsTab === 'invoicing' && renderInvoicing()}
            {activeBusinessAppsTab === 'pos' && renderPOS()}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomApps = () => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Purple/Violet Gradient Header Banner */}
        <div className="bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-500 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Custom Apps</h1>
              <p className="text-purple-100 mt-2">Manage appointments, billing, services, workshop operations, and business records</p>
            </div>
          </div>
        </div>

        {/* Custom Apps Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Apps</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">5</p>
              </div>
              <Wrench className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">127</p>
              </div>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Service Revenue</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">$18.9K</p>
              </div>
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Service Requests</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">43</p>
              </div>
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Workshop Jobs</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">21</p>
              </div>
              <Wrench className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'billing', label: 'Billing', icon: DollarSign },
                { id: 'service-records', label: 'Service Records', icon: FileText },
                { id: 'services', label: 'Services', icon: Wrench },
                { id: 'workshop', label: 'Workshop', icon: Wrench }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCustomAppsTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeCustomAppsTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeCustomAppsTab === 'appointments' && renderAppointments()}
            {activeCustomAppsTab === 'billing' && renderBilling()}
            {activeCustomAppsTab === 'service-records' && renderServiceRecords()}
            {activeCustomAppsTab === 'services' && renderServices()}
            {activeCustomAppsTab === 'workshop' && <div className="text-center py-8 text-gray-500">Workshop feature coming soon...</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderDirectory = () => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Orange/Amber Gradient Header Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-500 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Directory</h1>
              <p className="text-orange-100 mt-2">Manage business listings, local partnerships, claims, and commission tracking</p>
            </div>
          </div>
        </div>

        {/* Directory Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">342</p>
              </div>
              <Building className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Claims</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">28</p>
              </div>
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Commission Earned</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">$3.2K</p>
              </div>
              <DollarSign className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Local Partners</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">158</p>
              </div>
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">+12%</p>
              </div>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'listings', label: 'Listings', icon: Building },
                { id: 'local-business', label: 'Local Businesses', icon: MapPin },
                { id: 'claims', label: 'Claims', icon: Star },
                { id: 'commission', label: 'Commission Tracking', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDirectoryTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeDirectoryTab === tab.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeDirectoryTab === 'listings' && renderListings()}
            {activeDirectoryTab === 'local-business' && renderLocalBusiness()}
            {activeDirectoryTab === 'claims' && renderClaims()}
            {activeDirectoryTab === 'commission' && renderCommission()}
          </div>
        </div>
      </div>
    );
  };

  const renderECommerce = () => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Green/Emerald Gradient Header Banner */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-500 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">E-Commerce</h1>
              <p className="text-green-100 mt-2">Manage your online store, orders, inventory, and customer experience</p>
            </div>
          </div>
        </div>

        {/* E-Commerce Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">156</p>
              </div>
              <ShoppingCart className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$24.5K</p>
              </div>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">387</p>
              </div>
              <Package className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">2,849</p>
              </div>
              <Users className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversion</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">3.2%</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'inventory', label: 'Inventory', icon: Archive },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'sales', label: 'Sales', icon: DollarSign },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'favourites', label: 'Favourites', icon: Heart },
                { id: 'wishlist', label: 'Wishlist', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveECommerceTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeECommerceTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeECommerceTab === 'orders' && renderOrders()}
            {activeECommerceTab === 'inventory' && renderInventoryManagement()}
            {activeECommerceTab === 'payments' && renderPayments()}
            {activeECommerceTab === 'sales' && renderSalesManagement()}
            {activeECommerceTab === 'reviews' && renderReviews()}
            {activeECommerceTab === 'favourites' && renderFavourites()}
            {activeECommerceTab === 'wishlist' && renderWishlist()}
          </div>
        </div>
      </div>
    );
  };

  const renderVendor = () => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Rose/Pink Gradient Header Banner */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-red-500 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
              <p className="text-rose-100 mt-2">Manage your vendor operations, track sales, and monitor customer analytics</p>
            </div>
          </div>
        </div>

        {/* Vendor Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-rose-200 dark:border-rose-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">247</p>
              </div>
              <Package className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-rose-200 dark:border-rose-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Sales</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">$18.4K</p>
              </div>
              <TrendingUp className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-rose-200 dark:border-rose-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Count</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">1,892</p>
              </div>
              <Users className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-rose-200 dark:border-rose-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payouts</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">$3.2K</p>
              </div>
              <DollarSign className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-rose-200 dark:border-rose-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analytics Score</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">8.7/10</p>
              </div>
              <BarChart3 className="w-5 h-5 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'payouts', label: 'Payouts', icon: DollarSign },
                { id: 'product-gallery', label: 'Product Gallery', icon: Grid3X3 },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'reports', label: 'Reports', icon: FileText },
                { id: 'upload-product', label: 'Upload Product', icon: Upload }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveVendorTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeVendorTab === tab.id
                      ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeVendorTab === 'analytics' && renderVendorAnalytics()}
            {activeVendorTab === 'customers' && renderVendorCustomers()}
            {activeVendorTab === 'orders' && renderVendorOrders()}
            {activeVendorTab === 'payouts' && renderVendorPayouts()}
            {activeVendorTab === 'product-gallery' && renderVendorProductGallery()}
            {activeVendorTab === 'products' && renderVendorProducts()}
            {activeVendorTab === 'reports' && renderVendorReports()}
            {activeVendorTab === 'upload-product' && renderVendorUploadProduct()}
          </div>
        </div>
      </div>
    );
  };

  // Vendor Tab Render Functions
  const renderVendorAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor Analytics</h3>
      <p className="text-gray-600 dark:text-gray-400">Track your vendor performance metrics and analytics.</p>
    </div>
  );

  const renderVendorCustomers = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Management</h3>
      <p className="text-gray-600 dark:text-gray-400">Manage your vendor customers and relationships.</p>
    </div>
  );

  const renderVendorOrders = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor Orders</h3>
      <p className="text-gray-600 dark:text-gray-400">View and manage orders from your vendor store.</p>
    </div>
  );

  const renderVendorPayouts = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payout Management</h3>
      <p className="text-gray-600 dark:text-gray-400">Track and manage your vendor payouts and earnings.</p>
    </div>
  );

  const renderVendorProductGallery = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Gallery</h3>
      <p className="text-gray-600 dark:text-gray-400">Showcase your products in an attractive gallery format.</p>
    </div>
  );

  const renderVendorProducts = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Management</h3>
      <p className="text-gray-600 dark:text-gray-400">Manage your vendor product catalog and inventory.</p>
    </div>
  );

  const renderVendorReports = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor Reports</h3>
      <p className="text-gray-600 dark:text-gray-400">Generate and view detailed vendor performance reports.</p>
    </div>
  );

  const renderVendorUploadProduct = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload New Product</h3>
      <p className="text-gray-600 dark:text-gray-400">Add new products to your vendor catalog.</p>
    </div>
  );

  const renderSystemAdministration = () => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Deep Indigo/Purple Gradient Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">System Administration</h1>
              <p className="text-indigo-100 mt-2">Manage platform settings, users, database, and system operations</p>
            </div>
          </div>
        </div>

        {/* System Admin Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">98.5%</p>
              </div>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2,847</p>
              </div>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Database Size</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2.4 GB</p>
              </div>
              <Database className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Security Score</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">9.2/10</p>
              </div>
              <Shield className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Modules</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12/15</p>
              </div>
              <Building className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'products', label: 'Products', icon: Package },
                { id: 'inventory', label: 'Inventory', icon: Archive },
                { id: 'sales', label: 'Sales', icon: DollarSign },
                { id: 'user-management', label: 'User Management', icon: Users },
                { id: 'platform-settings', label: 'Platform Settings', icon: Settings },
                { id: 'database', label: 'Database', icon: Database },
                { id: 'system-logs', label: 'System Logs', icon: Activity },
                { id: 'module-management', label: 'Module Management', icon: Building },
                { id: 'review-management', label: 'Review Management', icon: MessageSquare }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSystemAdminTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeSystemAdminTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeSystemAdminTab === 'products' && renderSystemAdminProducts()}
            {activeSystemAdminTab === 'inventory' && renderSystemAdminInventory()}
            {activeSystemAdminTab === 'sales' && renderSystemAdminSales()}
            {activeSystemAdminTab === 'user-management' && renderSystemAdminUserManagement()}
            {activeSystemAdminTab === 'platform-settings' && renderSystemAdminPlatformSettings()}
            {activeSystemAdminTab === 'database' && renderSystemAdminDatabase()}
            {activeSystemAdminTab === 'system-logs' && renderSystemAdminSystemLogs()}
            {activeSystemAdminTab === 'module-management' && renderSystemAdminModuleManagement()}
            {activeSystemAdminTab === 'review-management' && renderSystemAdminReviewManagement()}
          </div>
        </div>
      </div>
    );
  };

  // System Administration Tab Render Functions
  const renderSystemAdminProducts = () => (
    <div className="space-y-6">
      <ProductManagement />
    </div>
  );

  const renderSystemAdminInventory = () => (
    <div className="space-y-6">
      <InventoryManagement />
    </div>
  );

  const renderSystemAdminSales = () => (
    <div className="space-y-6">
      <SalesManagement />
    </div>
  );

  const renderSystemAdminUserManagement = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2,847</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">2,645</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">15</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Admin Users</div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">User Roles Overview</h4>
              {selectedRoleView && (
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    Role View: {selectedRoleView === 'superadmin' ? 'Super Admin' : selectedRoleView === 'admin' ? 'Admin' : selectedRoleView === 'vendor' ? 'Vendor' : 'Customer'}
                  </div>
                  <button 
                    onClick={() => setSelectedRoleView(null)}
                    className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Reset View
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedRoleView(selectedRoleView === 'superadmin' ? null : 'superadmin')}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left transition-all hover:border-indigo-300 hover:shadow-md ${
                  selectedRoleView === 'superadmin' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <h5 className="font-medium text-gray-900 dark:text-white">Super Admin</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full system access</p>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">5 users</div>
                {selectedRoleView === 'superadmin' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Sidebar Menu Access:</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-green-600 dark:text-green-400">✓ Dashboard</div>
                      <div className="text-green-600 dark:text-green-400">✓ Business Apps</div>
                      <div className="text-green-600 dark:text-green-400">✓ Custom Apps</div>
                      <div className="text-green-600 dark:text-green-400">✓ Directory</div>
                      <div className="text-green-600 dark:text-green-400">✓ E-Commerce</div>
                      <div className="text-green-600 dark:text-green-400">✓ Vendor</div>
                      <div className="text-green-600 dark:text-green-400">✓ My Account</div>
                      <div className="text-green-600 dark:text-green-400">✓ Settings</div>
                      <div className="text-green-600 dark:text-green-400">✓ System Administration</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic col-span-2">Super Admin sees all 9 menus - complete platform access</div>
                    </div>
                  </div>
                )}
              </button>
              <button 
                onClick={() => setSelectedRoleView(selectedRoleView === 'admin' ? null : 'admin')}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left transition-all hover:border-indigo-300 hover:shadow-md ${
                  selectedRoleView === 'admin' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <h5 className="font-medium text-gray-900 dark:text-white">Admin</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Limited admin access</p>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">10 users</div>
                {selectedRoleView === 'admin' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Sidebar Menu Access:</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-green-600 dark:text-green-400">✓ Dashboard</div>
                      <div className="text-green-600 dark:text-green-400">✓ Business Apps</div>
                      <div className="text-green-600 dark:text-green-400">✓ Custom Apps</div>
                      <div className="text-green-600 dark:text-green-400">✓ Directory</div>
                      <div className="text-green-600 dark:text-green-400">✓ E-Commerce</div>
                      <div className="text-green-600 dark:text-green-400">✓ Vendor</div>
                      <div className="text-green-600 dark:text-green-400">✓ My Account</div>
                      <div className="text-green-600 dark:text-green-400">✓ Settings</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic col-span-2">Admin role sees 8 menus (no System Administration access)</div>
                    </div>
                  </div>
                )}
              </button>
              <button 
                onClick={() => setSelectedRoleView(selectedRoleView === 'vendor' ? null : 'vendor')}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left transition-all hover:border-indigo-300 hover:shadow-md ${
                  selectedRoleView === 'vendor' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <h5 className="font-medium text-gray-900 dark:text-white">Vendor</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Product & order management</p>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">127 users</div>
                {selectedRoleView === 'vendor' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Sidebar Menu Access:</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-green-600 dark:text-green-400">✓ Dashboard</div>
                      <div className="text-green-600 dark:text-green-400">✓ Directory</div>
                      <div className="text-green-600 dark:text-green-400">✓ E-Commerce</div>
                      <div className="text-green-600 dark:text-green-400">✓ Vendor</div>
                      <div className="text-green-600 dark:text-green-400">✓ My Account</div>
                      <div className="text-green-600 dark:text-green-400">✓ Settings</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic col-span-2">Vendor role sees 6 menus focused on selling & account management</div>
                    </div>
                  </div>
                )}
              </button>
              <button 
                onClick={() => setSelectedRoleView(selectedRoleView === 'customer' ? null : 'customer')}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left transition-all hover:border-indigo-300 hover:shadow-md ${
                  selectedRoleView === 'customer' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <h5 className="font-medium text-gray-900 dark:text-white">Customer</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Basic user access</p>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">2,705 users</div>
                {selectedRoleView === 'customer' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Sidebar Menu Access:</div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="text-green-600 dark:text-green-400">✓ Dashboard</div>
                      <div className="text-green-600 dark:text-green-400">✓ E-Commerce</div>
                      <div className="text-green-600 dark:text-green-400">✓ My Account</div>
                      <div className="text-green-600 dark:text-green-400">✓ Settings</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">Customer role sees only 4 core shopping & account menus</div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Configuration & Permissions</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">Super Admin Role</h5>
                  <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                    Edit Permissions
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">System Administration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">User Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Product Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Financial Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Database Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Module Configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">API Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">All Sections</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">Admin Role</h5>
                  <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                    Edit Permissions
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Product Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Inventory Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Sales Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Basic User Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">System Administration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Database Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Financial Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Reporting Access</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">Vendor Role</h5>
                  <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                    Edit Permissions
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Own Products Only</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Order Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Vendor Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Analytics (Own Data)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">System Administration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">User Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Global Settings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Payout Management</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">Customer Role</h5>
                  <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                    Edit Permissions
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Shopping & Orders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Profile Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Customer Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Reward System</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Admin Functions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Product Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">System Settings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Support Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Assignment & Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">Assign User Role</h5>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Email</label>
                    <input type="email" placeholder="user@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Customer</option>
                      <option>Vendor</option>
                      <option>Admin</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                    Assign Role
                  </button>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-3">Recent Role Changes</h5>
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">john@example.com</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Customer → Vendor • 2 hours ago</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">sarah@example.com</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Admin → Super Admin • 1 day ago</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">mike@example.com</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Customer → Admin • 3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemAdminPlatformSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Platform Settings</h3>
        </div>
        
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform Name</label>
                <input type="text" value="AVEENIX Hub" className="w-full px-3 py-2 border border-gray-300 rounded-md" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Currency</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Integrations</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">WooCommerce</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Product import integration</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Stripe</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Payment processing</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">Pending</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Maintenance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Cache
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Database className="w-4 h-4 mr-2" />
                Backup Database
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                <Activity className="w-4 h-4 mr-2" />
                System Health Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemAdminDatabase = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Database Management</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.4 GB</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Database Size</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">386</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tables</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15ms</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">99.9%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Backups</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Daily Backup - Jan 13, 2025</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed at 2:00 AM</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">2.4 GB</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Daily Backup - Jan 12, 2025</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed at 2:00 AM</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">2.3 GB</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Operations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Database className="w-4 h-4 mr-2" />
                Create Backup
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Activity className="w-4 h-4 mr-2" />
                Performance Monitor
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Optimize Tables
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemAdminSystemLogs = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">System Logs</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">1,247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Info Logs Today</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">23</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Warnings Today</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Errors Today</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">45</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">API Calls/min</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h4>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>All Logs</option>
              <option>Errors Only</option>
              <option>Warnings Only</option>
              <option>Info Only</option>
            </select>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Product import completed successfully</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">5:17:32 AM - Import Manager</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">User authentication successful</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">5:16:45 AM - Auth System</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">High API rate detected</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">5:15:23 AM - Rate Limiter</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Database backup completed</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">2:00:15 AM - Database Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemAdminModuleManagement = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Module Management</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Modules</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Inactive Modules</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Updates Available</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Modules</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Modules</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">E-Commerce Module</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Product management, orders, payments</div>
                </div>
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Active</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Business Apps Suite</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">CRM, invoicing, calendar, helpdesk</div>
                </div>
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Active</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Custom Apps Workshop</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Service booking, billing, records</div>
                </div>
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Active</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Analytics & Reporting</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Advanced analytics and reporting tools</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">AI Assistant</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Intelligent automation and assistance</div>
                </div>
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Update Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemAdminReviewManagement = () => {
    return <ReviewManagement />;
  };

  // Order Tracking Component
  const renderOrderTracking = () => {
    const trackingData = [
      {
        id: "ORD-001",
        status: "Delivered",
        estimatedDelivery: "Dec 15, 2024",
        currentLocation: "Delivered to your address",
        trackingNumber: "1Z999E123456789",
        orderDate: "Dec 12, 2024",
        items: ["Wireless Headphones", "USB Cable"]
      },
      {
        id: "ORD-002", 
        status: "In Transit",
        estimatedDelivery: "Dec 18, 2024",
        currentLocation: "Memphis, TN Facility",
        trackingNumber: "1Z999E987654321",
        orderDate: "Dec 14, 2024",
        items: ["Smart Watch", "Charging Pad"]
      },
      {
        id: "ORD-003",
        status: "Processing",
        estimatedDelivery: "Dec 20, 2024", 
        currentLocation: "Preparing for shipment",
        trackingNumber: "Pending",
        orderDate: "Dec 16, 2024",
        items: ["Bluetooth Speaker"]
      }
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'In Transit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Truck className="h-6 w-6 mr-3 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Tracking</h2>
        </div>
        
        <div className="grid gap-6">
          {trackingData.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">Order {order.id}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Ordered: {order.orderDate}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Location</p>
                  <p className="font-medium">{order.currentLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery</p>
                  <p className="font-medium">{order.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tracking Number</p>
                  <p className="font-medium font-mono text-sm">{order.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Items</p>
                  <p className="font-medium">{order.items.join(", ")}</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                <Eye className="w-4 h-4 mr-2" />
                View Full Tracking Details
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Returns & Exchanges Component
  const renderReturnsExchanges = () => {
    const returnsData = [
      {
        id: "RET-001",
        orderNumber: "ORD-005",
        item: "Wireless Mouse",
        status: "Approved",
        reason: "Defective product",
        requestDate: "Dec 10, 2024",
        refundAmount: "$29.99"
      },
      {
        id: "RET-002", 
        orderNumber: "ORD-008",
        item: "Phone Case",
        status: "Processing",
        reason: "Wrong color received",
        requestDate: "Dec 13, 2024",
        refundAmount: "$15.99"
      }
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <RotateCcw className="h-6 w-6 mr-3 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Returns & Exchanges</h2>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Request Return
          </Button>
        </div>
        
        <div className="grid gap-6">
          {returnsData.map((returnItem) => (
            <Card key={returnItem.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">Return {returnItem.id}</h3>
                  <Badge className={getStatusColor(returnItem.status)}>
                    {returnItem.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Requested: {returnItem.requestDate}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Original Order</p>
                  <p className="font-medium">{returnItem.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Item</p>
                  <p className="font-medium">{returnItem.item}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reason</p>
                  <p className="font-medium">{returnItem.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Refund Amount</p>
                  <p className="font-medium text-green-600">{returnItem.refundAmount}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {returnItem.status === 'Processing' && (
                  <Button variant="outline" size="sm">
                    Cancel Request
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Compare Component - hooks moved to top level to fix React error
  const renderCompare = () => {

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Scale className="h-6 w-6 mr-3 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Products</h2>
          </div>
          {compareProducts.length > 0 && (
            <Button variant="outline" onClick={clearCompare}>
              Clear All
            </Button>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="text-center py-12">
            <Scale className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products to compare
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add products to your compare list to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-900 dark:text-white w-32">Feature</th>
                    {compareProducts.map((product) => (
                      <th key={product.id} className="text-left p-4 w-64">
                        <div className="space-y-2">
                          <img 
                            src={product.imageUrl || product.imageUrl2 || '/placeholder.jpg'} 
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded mx-auto"
                          />
                          <div className="text-sm font-medium">{product.name}</div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeFromCompare(product.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Price</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="text-lg font-bold text-green-600">
                          ${Number(product.price || 0).toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Rating</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{Number(product.rating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Category</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <Badge variant="secondary">{product.category || 'N/A'}</Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Stock Status</td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <Badge className={product.isInStock !== false ? 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }>
                          {product.isInStock !== false ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 You can compare up to 4 products at once. Add more products to your compare list from any product page.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Download Center Component  
  const renderDownloadCenter = () => {
    const downloadData = [
      {
        id: 1,
        type: "Invoice",
        filename: "Invoice-ORD-001.pdf",
        orderNumber: "ORD-001",
        date: "Dec 15, 2024",
        size: "245 KB"
      },
      {
        id: 2,
        type: "Receipt",
        filename: "Receipt-ORD-002.pdf", 
        orderNumber: "ORD-002",
        date: "Dec 14, 2024",
        size: "189 KB"
      },
      {
        id: 3,
        type: "Warranty",
        filename: "Warranty-WH-12345.pdf",
        orderNumber: "ORD-003",
        date: "Dec 12, 2024", 
        size: "356 KB"
      }
    ];

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'Invoice': return Receipt;
        case 'Receipt': return FileText;
        case 'Warranty': return Archive;
        default: return FileText;
      }
    };

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'Invoice': return 'text-green-600';
        case 'Receipt': return 'text-blue-600';
        case 'Warranty': return 'text-purple-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Download className="h-6 w-6 mr-3 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Download Center</h2>
        </div>
        
        <div className="grid gap-4">
          {downloadData.map((file) => {
            const IconComponent = getTypeIcon(file.type);
            return (
              <Card key={file.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <IconComponent className={`h-8 w-8 ${getTypeColor(file.type)}`} />
                    <div>
                      <h3 className="font-semibold">{file.filename}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {file.type} for {file.orderNumber} • {file.date} • {file.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 Documents are available for download up to 2 years from the order date. 
            Need an older document? Contact our support team.
          </p>
        </div>
      </div>
    );
  };

  const renderMyAccount = () => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Blue/Cyan Gradient Header Banner */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-blue-100 mt-2">Manage your personal information, preferences, and account settings</p>
            </div>
          </div>
        </div>

        {/* Account Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">23</p>
              </div>
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Account Age</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.5Y</p>
              </div>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reward Points</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,250</p>
              </div>
              <Star className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$2,145</p>
              </div>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Login</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Today</p>
              </div>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-wrap gap-x-8 gap-y-2 px-6">
              {/* Individual Tabs */}
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
                { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
                { id: 'rewards-tasks', label: 'Rewards & Tasks', icon: Target }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMyAccountTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeMyAccountTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
              
              {/* Orders & Returns Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowOrdersReturnsDropdown(!showOrdersReturnsDropdown)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    ['order-history', 'order-tracking', 'returns-exchanges'].includes(activeMyAccountTab)
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Orders & Returns</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showOrdersReturnsDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showOrdersReturnsDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    {[
                      { id: 'order-history', label: 'Order History', icon: History },
                      { id: 'order-tracking', label: 'Order Tracking', icon: Truck },
                      { id: 'returns-exchanges', label: 'Returns & Exchanges', icon: RotateCcw }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMyAccountTab(item.id);
                          setShowOrdersReturnsDropdown(false);
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md ${
                          activeMyAccountTab === item.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* My Files Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMyFilesDropdown(!showMyFilesDropdown)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    ['download-center', 'compare', 'favourites', 'wishlist'].includes(activeMyAccountTab)
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>My Files</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMyFilesDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showMyFilesDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    {[
                      { id: 'download-center', label: 'Downloads', icon: Download },
                      { id: 'compare', label: 'Compare', icon: Scale },
                      { id: 'favourites', label: 'Favourites', icon: Heart },
                      { id: 'wishlist', label: 'Wishlist', icon: Star }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMyAccountTab(item.id);
                          setShowMyFilesDropdown(false);
                        }}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md ${
                          activeMyAccountTab === item.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <item.icon 
                          className="w-5 h-5"
                          style={
                            item.id === 'favourites' ? { 
                              fill: 'currentColor', 
                              stroke: 'currentColor',
                              strokeWidth: '3'
                            } : {}
                          }
                        />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeMyAccountTab === 'profile' && renderProfile()}
            {activeMyAccountTab === 'addresses' && renderAddresses()}
            {activeMyAccountTab === 'payment-methods' && renderPaymentMethods()}
            {activeMyAccountTab === 'help-support' && renderHelpSupport()}
            {activeMyAccountTab === 'rewards-tasks' && renderRewardsAndTasks()}
            {activeMyAccountTab === 'order-history' && <MyOrders />}
            {activeMyAccountTab === 'order-tracking' && renderOrderTracking()}
            {activeMyAccountTab === 'returns-exchanges' && renderReturnsExchanges()}
            {activeMyAccountTab === 'download-center' && renderDownloadCenter()}
            {activeMyAccountTab === 'compare' && renderCompare()}
            {activeMyAccountTab === 'favourites' && <div className="max-w-none"><Favourites /></div>}
            {activeMyAccountTab === 'wishlist' && <div className="max-w-none"><Wishlist /></div>}
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardModule = () => {
    return <div className="p-6 text-center text-gray-500">Dashboard Module - Coming Soon</div>;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard-module': return renderDashboardModule();
      case 'overview': return renderDashboardModule();
      case 'analytics': return renderAnalytics();
      case 'performance': return renderPerformance();
      case 'orders': return renderOrders();
      case 'products': return renderProducts();
      case 'customers': return renderCustomers();
      case 'favourites': return renderFavourites();
      case 'wishlist': return renderWishlist();
      case 'reviews': return renderReviews();
      case 'payments': return renderPayments();
      case 'product-management': return renderProductManagement();
      case 'inventory-management': return renderInventoryManagement();
      case 'sales-management': return renderSalesManagement();
      case 'ai-assistant': return renderAIAssistant();
      case 'crm': return renderCRM();
      case 'invoicing': return renderInvoicing();
      case 'calendar': return renderCalendar();
      case 'email-marketing': return renderEmailMarketing();
      case 'helpdesk': return renderHelpdesk();
      case 'pos': return renderPOS();
      case 'services': return renderServices();
      case 'appointments': return renderAppointments();
      case 'service-records': return renderServiceRecords();
      case 'billing': return renderBilling();
      case 'listings': return renderListings();
      case 'local-business': return renderLocalBusiness();
      case 'claims': return renderClaims();
      case 'commission': return renderCommission();

      case 'business-apps': return renderBusinessApps();
      case 'custom-apps': return renderCustomApps();
      case 'directory': return renderDirectory();
      case 'e-commerce': return renderECommerce();
      case 'vendor': return renderVendor();
      case 'my-account': return renderMyAccount();
      case 'profile': return renderProfile();
      case 'addresses': return renderAddresses();
      case 'payment-methods': return renderPaymentMethods();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'system-admin': return renderSystemAdmin();
      // Sales Section
      case 'sales-analytics': return renderSalesAnalytics();
      case 'sales-targets': return renderSalesTargets();
      case 'customer-insights': return renderCustomerInsights();
      case 'performance-reports': return renderPerformanceReports();
      case 'revenue-tracking': return renderRevenueTracking();
      case 'database': return renderDatabase();
      case 'user-management': return renderUserManagement();
      case 'module-management': return renderModuleManagement();
      case 'system-logs': return renderSystemLogs();
      case 'platform-settings': return renderPlatformSettings();

      // Auto Blogs
      case 'auto-blogs': return renderAutoBlogs();
      // Content Library
      case 'content-library': return renderContentLibrary();
      // SEO Tools
      case 'seo-tools': return renderSeoTools();
      // Settings main view
      case 'settings': return renderSettings();
      case 'system-administration': return renderSystemAdministration();
      case 'help-support': return renderHelpSupport();
      case 'rewards-tasks': return renderRewardsAndTasks();
      default: return renderDashboardModule();
    }
  };

  // Enhanced render functions for key sections
  const renderPerformance = () => {
    const getPerformanceContent = () => {
      switch (userRole) {
        case 'customer':
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Personal Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">↑25%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">4.8★</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Review Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">92%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fast Checkout</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Review Activity</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Return Rate</span>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Loyalty Score</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        default:
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">↑15%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">92%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">4.2x</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ROI Improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
      }
    };
    
    return getPerformanceContent();
  };

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h2>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
            <option>All Orders</option>
            <option>Delivered</option>
            <option>Shipped</option>
            <option>Processing</option>
            <option>Cancelled</option>
          </select>
          <select className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Orders Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Transit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Processing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {[
          { 
            id: '#ORD-2024-001', 
            date: '2024-01-15', 
            items: 2, 
            total: '$299.99', 
            status: 'Delivered',
            statusColor: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400',
            trackingNumber: 'TRK123456789',
            deliveredDate: '2024-01-18',
            products: [
              { name: 'Wireless Headphones', price: '$199.99', qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
              { name: 'Phone Case', price: '$29.99', qty: 1, image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop' }
            ]
          },
          { 
            id: '#ORD-2024-002', 
            date: '2024-01-12', 
            items: 1, 
            total: '$149.50', 
            status: 'Shipped',
            statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400',
            trackingNumber: 'TRK987654321',
            estimatedDelivery: '2024-01-20',
            products: [
              { name: 'Smart Watch', price: '$149.50', qty: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' }
            ]
          },
          { 
            id: '#ORD-2024-003', 
            date: '2024-01-10', 
            items: 3, 
            total: '$189.97', 
            status: 'Processing',
            statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400',
            estimatedShipping: '2024-01-22',
            products: [
              { name: 'Bluetooth Speaker', price: '$79.99', qty: 1, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop' },
              { name: 'USB Cable', price: '$19.99', qty: 2, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop' }
            ]
          }
        ].map((order, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ordered on {order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{order.total}</p>
                  <Badge className={`text-xs ${order.statusColor}`}>{order.status}</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Order Status Timeline */}
              <div className="flex items-center space-x-2 text-sm">
                {order.status === 'Delivered' && (
                  <p className="text-green-600 dark:text-green-400">
                    <Package className="w-4 h-4 inline mr-1" />
                    Delivered on {order.deliveredDate}
                  </p>
                )}
                {order.status === 'Shipped' && (
                  <p className="text-blue-600 dark:text-blue-400">
                    <Truck className="w-4 h-4 inline mr-1" />
                    Estimated delivery: {order.estimatedDelivery}
                  </p>
                )}
                {order.status === 'Processing' && (
                  <p className="text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Estimated shipping: {order.estimatedShipping}
                  </p>
                )}
              </div>

              {/* Products */}
              <div className="space-y-2">
                {order.products.map((product, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {product.qty}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">{product.price}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {order.trackingNumber && (
                  <Button variant="outline" size="sm" className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Track Package
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  View Invoice
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reorder
                </Button>
                {order.status === 'Delivered' && (
                  <Button variant="outline" size="sm" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Return Items
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Get Help
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="w-full">
          Load More Orders
        </Button>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Wireless Headphones', price: '$89.99', stock: 45, sales: 156 },
              { name: 'Smart Watch', price: '$299.99', stock: 23, sales: 89 },
              { name: 'Bluetooth Speaker', price: '$59.99', stock: 67, sales: 234 }
            ].map((product, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.price}</p>
                <div className="flex justify-between text-xs">
                  <span>Stock: {product.stock}</span>
                  <span>Sales: {product.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAIAssistant = () => (
    <div className="space-y-3">
      {/* Jarvis AI Assistant Card - Enhanced Template Layout */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Bot 
              className="w-5 h-5 mr-2" 
              style={{ color: 'var(--primary-color)' }}
            />
            Jarvis AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Enhanced Welcome Message with Dynamic Theming */}
          <div 
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' 
                ? 'color-mix(in srgb, var(--primary-color) 8%, transparent 92%)'
                : 'color-mix(in srgb, var(--primary-color) 8%, transparent 92%)',
              borderColor: 'color-mix(in srgb, var(--primary-color) 20%, transparent 80%)'
            }}
          >
            <p 
              className="text-sm font-medium"
              style={{ 
                color: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' ? '#000' : 'inherit'
              }}
            >
              👋 Hello! I'm Jarvis, your AI business assistant. I can help you with analytics, customer insights, inventory management, and more.
            </p>
          </div>
          
          {/* Optimized Action Grid - Better Spacing and Visual Hierarchy */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="h-14 flex flex-col items-center justify-center gap-1 text-xs hover:shadow-md transition-all duration-200"
              style={{ 
                borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent 70%)', 
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent 95%)'
              }}
            >
              <div className="text-lg">📊</div>
              <span className="font-medium">Sales Analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 flex flex-col items-center justify-center gap-1 text-xs hover:shadow-md transition-all duration-200"
              style={{ 
                borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent 70%)', 
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent 95%)'
              }}
            >
              <div className="text-lg">👥</div>
              <span className="font-medium">Customer Insights</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 flex flex-col items-center justify-center gap-1 text-xs hover:shadow-md transition-all duration-200"
              style={{ 
                borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent 70%)', 
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent 95%)'
              }}
            >
              <div className="text-lg">📦</div>
              <span className="font-medium">Inventory Check</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 flex flex-col items-center justify-center gap-1 text-xs hover:shadow-md transition-all duration-200"
              style={{ 
                borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent 70%)', 
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent 95%)'
              }}
            >
              <div className="text-lg">💰</div>
              <span className="font-medium">Revenue Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 flex flex-col items-center justify-center gap-1 text-xs hover:shadow-md transition-all duration-200"
              style={{ 
                borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent 70%)', 
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent 95%)'
              }}
            >
              <div className="text-lg">⚠️</div>
              <span className="font-medium">Risk Analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 flex flex-col items-center justify-center gap-1 text-xs hover:shadow-md transition-all duration-200"
              style={{ 
                borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent 70%)', 
                backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent 95%)'
              }}
            >
              <div className="text-lg">🎯</div>
              <span className="font-medium">Goal Tracking</span>
            </Button>
          </div>

          {/* Performance Metrics - Better Integrated Bottom Stats */}
          <div 
            className="grid grid-cols-3 gap-4 p-3 rounded-lg"
            style={{
              backgroundColor: colorTheme === 'yellow' || colorTheme === 'lime' || colorTheme === 'amber' 
                ? 'color-mix(in srgb, var(--primary-color) 4%, transparent 96%)'
                : 'color-mix(in srgb, var(--primary-color) 4%, transparent 96%)'
            }}
          >
            <div className="text-center">
              <div 
                className="text-xl font-bold"
                style={{ color: 'var(--primary-color)' }}
              >
                24/7
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">AI Availability</div>
            </div>
            <div className="text-center">
              <div 
                className="text-xl font-bold"
                style={{ color: 'var(--primary-color)' }}
              >
                150+
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Business Functions</div>
            </div>
            <div className="text-center">
              <div 
                className="text-xl font-bold"
                style={{ color: 'var(--primary-color)' }}
              >
                99.9%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCRM = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Customer Relationship Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Recent Leads</h3>
              <div className="space-y-2">
                {['John Smith - Hot Lead', 'Sarah Johnson - Follow Up', 'Mike Wilson - Qualified'].map((lead, index) => (
                  <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    {lead}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Pipeline Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prospects</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Qualified</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Closed</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Placeholder render functions for other sections
  const renderCustomers = () => <div className="p-8 text-center text-gray-500">Customer management interface</div>;
  
  const renderProductManagement = () => <ProductManagement />;
  const renderInventoryManagement = () => <InventoryManagement />;
  const renderSalesManagement = () => <SalesManagement />;
  const renderRewardsAndTasks = () => <RewardsAndTasks />;
  
  const renderFavourites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Favourites</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Items you frequently purchase or access</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
            <option>All Items</option>
            <option>Recently Added</option>
            <option>Most Purchased</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
          <Button variant="outline" size="sm">
            <Grid3X3 className="w-4 h-4 mr-1" />
            Grid View
          </Button>
        </div>
      </div>

      {/* Favourites Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">18</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Favourites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>$2,847</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Times Repurchased</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Added This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Add All to Cart
        </Button>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <X className="w-4 h-4 mr-1" />
          Clear Favourites
        </Button>
      </div>

      {/* Favourites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            name: 'Premium Coffee Beans - Dark Roast',
            price: '$24.99',
            originalPrice: '$29.99',
            discount: '17% OFF',
            image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=300&fit=crop',
            rating: 4.8,
            reviews: 892,
            inStock: true,
            purchaseCount: 8,
            lastPurchased: '2 weeks ago',
            category: 'Food & Beverages'
          },
          {
            id: 2,
            name: 'Wireless Charging Station',
            price: '$49.99',
            originalPrice: '$69.99',
            discount: '29% OFF',
            image: 'https://images.unsplash.com/photo-1609592308106-6c21ed6c0ebd?w=300&h=300&fit=crop',
            rating: 4.6,
            reviews: 456,
            inStock: true,
            purchaseCount: 3,
            lastPurchased: '3 months ago',
            category: 'Electronics'
          },
          {
            id: 3,
            name: 'Organic Skincare Set',
            price: '$89.99',
            originalPrice: '$119.99',
            discount: '25% OFF',
            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
            rating: 4.9,
            reviews: 234,
            inStock: true,
            purchaseCount: 5,
            lastPurchased: '1 month ago',
            category: 'Beauty & Health'
          },
          {
            id: 4,
            name: 'Bluetooth Noise-Cancelling Headphones',
            price: '$159.99',
            originalPrice: '$199.99',
            discount: '20% OFF',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            rating: 4.7,
            reviews: 1243,
            inStock: true,
            purchaseCount: 2,
            lastPurchased: '6 months ago',
            category: 'Electronics'
          },
          {
            id: 5,
            name: 'Yoga Mat Premium',
            price: '$35.99',
            originalPrice: '$49.99',
            discount: '28% OFF',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
            rating: 4.5,
            reviews: 567,
            inStock: false,
            purchaseCount: 1,
            lastPurchased: '8 months ago',
            category: 'Sports & Fitness'
          },
          {
            id: 6,
            name: 'Smart Home Security Camera',
            price: '$129.99',
            originalPrice: '$179.99',
            discount: '28% OFF',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
            rating: 4.4,
            reviews: 789,
            inStock: true,
            purchaseCount: 1,
            lastPurchased: '4 months ago',
            category: 'Smart Home'
          }
        ].map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                {item.discount && (
                  <Badge 
                    className="absolute top-2 left-2 text-white"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    {item.discount}
                  </Badge>
                )}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.category}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(item.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {item.rating} ({item.reviews})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-gray-900 dark:text-white">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p>Purchased {item.purchaseCount} time{item.purchaseCount > 1 ? 's' : ''}</p>
                  <p>Last: {item.lastPurchased}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    disabled={!item.inStock}
                    style={{ 
                      backgroundColor: item.inStock ? 'var(--primary-color)' : undefined,
                      borderColor: item.inStock ? 'var(--primary-color)' : undefined
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {item.inStock ? 'Quick Buy' : 'Out of Stock'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h2>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
            <option>All Items</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
            <option>On Sale</option>
          </select>
          <Button variant="outline" size="sm">
            <Grid3X3 className="w-4 h-4 mr-1" />
            Grid View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            id: 1,
            name: 'Wireless Noise-Cancelling Headphones',
            price: '$199.99',
            originalPrice: '$249.99',
            discount: '20% OFF',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            rating: 4.5,
            reviews: 1234,
            inStock: true,
            addedDate: '2024-01-10'
          },
          {
            id: 2,
            name: 'Smart Watch Series 8',
            price: '$299.99',
            originalPrice: '$399.99',
            discount: '25% OFF',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            rating: 4.8,
            reviews: 856,
            inStock: true,
            addedDate: '2024-01-08'
          },
          {
            id: 3,
            name: 'Bluetooth Speaker Pro',
            price: '$79.99',
            originalPrice: '$99.99',
            discount: '20% OFF',
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
            rating: 4.3,
            reviews: 567,
            inStock: false,
            addedDate: '2024-01-05'
          },
          {
            id: 4,
            name: 'Gaming Mechanical Keyboard',
            price: '$129.99',
            originalPrice: '$159.99',
            discount: '19% OFF',
            image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
            rating: 4.6,
            reviews: 423,
            inStock: true,
            addedDate: '2024-01-03'
          },
          {
            id: 5,
            name: 'Wireless Charging Pad',
            price: '$39.99',
            originalPrice: '$49.99',
            discount: '20% OFF',
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
            rating: 4.2,
            reviews: 789,
            inStock: true,
            addedDate: '2024-01-01'
          },
          {
            id: 6,
            name: 'USB-C Hub Multi-Port',
            price: '$49.99',
            originalPrice: '$69.99',
            discount: '29% OFF',
            image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop',
            rating: 4.4,
            reviews: 234,
            inStock: true,
            addedDate: '2023-12-28'
          }
        ].map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
              {item.discount && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-500 text-white">
                    {item.discount}
                  </Badge>
                </div>
              )}
              {!item.inStock && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-gray-800">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {item.name}
                </h3>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.rating} ({item.reviews})
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {item.originalPrice}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Added {item.addedDate}</span>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>Saved</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    disabled={!item.inStock}
                    style={{
                      backgroundColor: item.inStock ? 'var(--primary-color)' : '',
                      borderColor: item.inStock ? 'var(--primary-color)' : '',
                      opacity: item.inStock ? 1 : 0.5
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!item.inStock}
                    className="px-3"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  disabled={!item.inStock}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Quick Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wishlist Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Items: <span className="font-semibold">6</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Value: <span className="font-semibold">$799.94</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add All to Cart
              </Button>
              <Button variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" />
                Clear Wishlist
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderReviews = () => <div className="p-8 text-center text-gray-500">Reviews and ratings</div>;
  const renderPayments = () => <div className="p-8 text-center text-gray-500">Payment processing</div>;
  const renderInvoicing = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoicing System</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Find Invoice
          </Button>
          <Button 
            className="flex items-center text-black hover:text-black" 
            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">$45,678</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">+12% this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">$8,420</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">5 invoices</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">$2,145</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">2 invoices</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$12,456</div>
            <div className="text-xs text-gray-500">23 invoices</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "INV-001", client: "Acme Corp", amount: "$2,500", status: "Paid", date: "2 days ago" },
              { id: "INV-002", client: "Tech Solutions", amount: "$1,800", status: "Sent", date: "3 days ago" },
              { id: "INV-003", client: "Marketing Plus", amount: "$3,200", status: "Overdue", date: "1 week ago" },
              { id: "INV-004", client: "Creative Studio", amount: "$950", status: "Draft", date: "2 weeks ago" }
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{invoice.id}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{invoice.client} • {invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">{invoice.amount}</div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : invoice.status === 'Sent'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : invoice.status === 'Overdue'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar & Scheduling</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "9:00 AM", title: "Team Meeting", type: "meeting", duration: "1 hour" },
                { time: "10:30 AM", title: "Client Call - Acme Corp", type: "call", duration: "30 min" },
                { time: "2:00 PM", title: "Product Review", type: "meeting", duration: "2 hours" },
                { time: "4:00 PM", title: "1-on-1 with Sarah", type: "personal", duration: "30 min" }
              ].map((event, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{event.time} • {event.duration}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">28</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Events this month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Meetings today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hours scheduled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Free hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEmailMarketing = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Marketing</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button 
            className="flex items-center text-black hover:text-black" 
            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12,456</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">+234 this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Rate</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">28.5%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">+2.1% improvement</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Click Rate</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.2%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">+0.8% improvement</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Campaigns Sent</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">47</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">This month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Summer Sale Newsletter", sent: "5,678", opened: "1,543", clicked: "245", date: "2 days ago", status: "Sent" },
              { name: "Product Launch Announcement", sent: "12,456", opened: "3,456", clicked: "567", date: "1 week ago", status: "Sent" },
              { name: "Weekly Tips & Tricks", sent: "8,901", opened: "2,234", clicked: "334", date: "2 weeks ago", status: "Sent" },
              { name: "Customer Survey", sent: "0", opened: "0", clicked: "0", date: "Draft", status: "Draft" }
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {campaign.status === 'Sent' ? (
                        <>Sent: {campaign.sent} • Opened: {campaign.opened} • Clicked: {campaign.clicked}</>
                      ) : (
                        <>Draft campaign</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{campaign.date}</div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'Sent' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHelpdesk = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Helpdesk System</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <div className="text-xs text-gray-500">+3 new today</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-xs text-gray-500">92% resolution rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.5h</div>
            <div className="text-xs text-gray-500">-30min vs yesterday</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">4.8★</div>
            <div className="text-xs text-gray-500">Based on 156 reviews</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "TKT-001", subject: "Login Issues", customer: "John Doe", priority: "High", status: "Open", time: "2 min ago" },
                { id: "TKT-002", subject: "Payment Problem", customer: "Jane Smith", priority: "Medium", status: "In Progress", time: "15 min ago" },
                { id: "TKT-003", subject: "Feature Request", customer: "Mike Johnson", priority: "Low", status: "Resolved", time: "1 hour ago" },
                { id: "TKT-004", subject: "Bug Report", customer: "Sarah Wilson", priority: "High", status: "Open", time: "2 hours ago" }
              ].map((ticket, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{ticket.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{ticket.subject} • {ticket.customer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.status === 'Open' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ticket.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Technical Issues", count: "12", percentage: "52%" },
                { name: "Billing Questions", count: "6", percentage: "26%" },
                { name: "Feature Requests", count: "3", percentage: "13%" },
                { name: "General Support", count: "2", percentage: "9%" }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{category.count} tickets</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{category.percentage}</div>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: category.percentage, 
                          backgroundColor: 'var(--primary-color)' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPOS = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Point of Sale System</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$3,456</div>
            <div className="text-xs text-gray-500">42 transactions</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$82.29</div>
            <div className="text-xs text-gray-500">+$5.40 vs yesterday</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-xs text-gray-500">+23 vs yesterday</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cash Drawer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$1,245</div>
            <div className="text-xs text-gray-500">Current balance</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "TXN-001", customer: "John Doe", amount: "$125.50", items: "3 items", time: "2 min ago", payment: "Card" },
                { id: "TXN-002", customer: "Jane Smith", amount: "$67.25", items: "2 items", time: "8 min ago", payment: "Cash" },
                { id: "TXN-003", customer: "Mike Johnson", amount: "$234.75", items: "5 items", time: "15 min ago", payment: "Card" },
                { id: "TXN-004", customer: "Sarah Wilson", amount: "$45.00", items: "1 item", time: "22 min ago", payment: "Mobile" }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{transaction.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.customer} • {transaction.items}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">{transaction.amount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.payment} • {transaction.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Premium Coffee", sold: "24", revenue: "$456", percentage: "85%" },
                { name: "Chocolate Croissant", sold: "18", revenue: "$234", percentage: "65%" },
                { name: "Breakfast Sandwich", sold: "15", revenue: "$345", percentage: "55%" },
                { name: "Green Tea", sold: "12", revenue: "$156", percentage: "45%" }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{product.sold} sold • {product.revenue}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: product.percentage }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Service Management</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Find Service
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            New Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-xs text-gray-500">+12 this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$23,450</div>
            <div className="text-xs text-gray-500">+8% growth</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4.8</div>
            <div className="text-xs text-gray-500">Based on 234 reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-xs text-gray-500">+2% improvement</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Oil Change", active: 45, revenue: "$8,900", rating: 4.9 },
              { name: "Brake Service", active: 23, revenue: "$6,200", rating: 4.7 },
              { name: "Tire Rotation", active: 34, revenue: "$3,400", rating: 4.8 },
              { name: "Engine Repair", active: 12, revenue: "$4,950", rating: 4.6 },
              { name: "AC Service", active: 28, revenue: "$5,600", rating: 4.8 },
              { name: "Transmission", active: 8, revenue: "$3,200", rating: 4.5 }
            ].map((service, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{service.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Active: {service.active} services</div>
                  <div>Revenue: {service.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appointment Scheduling</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-xs text-gray-500">3 pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">67</div>
            <div className="text-xs text-gray-500">+15% vs last week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">No-Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-xs text-gray-500">4.5% rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg. Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">45m</div>
            <div className="text-xs text-gray-500">Per appointment</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "9:00 AM", customer: "John Smith", service: "Oil Change", status: "Confirmed" },
                { time: "10:30 AM", customer: "Sarah Johnson", service: "Brake Inspection", status: "In Progress" },
                { time: "12:00 PM", customer: "Mike Davis", service: "Tire Rotation", status: "Pending" },
                { time: "2:00 PM", customer: "Lisa Wilson", service: "Engine Repair", status: "Confirmed" },
                { time: "3:30 PM", customer: "Tom Brown", service: "AC Service", status: "Confirmed" }
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{appointment.time}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{appointment.customer} • {appointment.service}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    appointment.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : appointment.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { service: "Oil Change", count: 25, percentage: "35%" },
                { service: "Brake Service", count: 18, percentage: "25%" },
                { service: "Tire Service", count: 15, percentage: "20%" },
                { service: "Engine Repair", count: 10, percentage: "15%" },
                { service: "Other", count: 4, percentage: "5%" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">{item.service}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: item.percentage }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderServiceRecords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Service Records</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Search Records
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Download className="w-4 h-4 mr-2" />
            Export Records
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2,456</div>
            <div className="text-xs text-gray-500">All time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">234</div>
            <div className="text-xs text-gray-500">+18% vs last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg. Service Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">2.5h</div>
            <div className="text-xs text-gray-500">Per service</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4.7</div>
            <div className="text-xs text-gray-500">Average rating</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Service Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "SR-001", customer: "John Smith", vehicle: "2020 Honda Civic", service: "Oil Change", date: "2 hours ago", status: "Completed", rating: 5 },
              { id: "SR-002", customer: "Sarah Johnson", vehicle: "2019 Toyota Camry", service: "Brake Inspection", date: "1 day ago", status: "Completed", rating: 4 },
              { id: "SR-003", customer: "Mike Davis", vehicle: "2021 Ford F-150", service: "Tire Rotation", date: "2 days ago", status: "Completed", rating: 5 },
              { id: "SR-004", customer: "Lisa Wilson", vehicle: "2018 BMW 3 Series", service: "Engine Repair", date: "3 days ago", status: "Completed", rating: 4 }
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{record.id}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{record.customer} • {record.vehicle}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{record.service} • {record.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < record.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {record.status}
                  </span>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Invoicing</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$45,890</div>
            <div className="text-xs text-gray-500">+12% vs last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$8,920</div>
            <div className="text-xs text-gray-500">7 invoices</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$2,340</div>
            <div className="text-xs text-gray-500">3 invoices</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-xs text-gray-500">+2% improvement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "INV-2025-001", customer: "John Smith", amount: "$450", service: "Oil Change + Inspection", status: "Paid", date: "2 days ago" },
                { id: "INV-2025-002", customer: "Sarah Johnson", service: "Brake Service", amount: "$680", status: "Sent", date: "3 days ago" },
                { id: "INV-2025-003", customer: "Mike Davis", service: "Engine Repair", amount: "$1,200", status: "Overdue", date: "1 week ago" },
                { id: "INV-2025-004", customer: "Lisa Wilson", service: "Tire Replacement", amount: "$340", status: "Draft", date: "Draft" }
              ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{invoice.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{invoice.customer} • {invoice.service}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">{invoice.amount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{invoice.date}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : invoice.status === 'Sent'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : invoice.status === 'Overdue'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { method: "Credit Card", amount: "$28,450", percentage: "62%" },
                { method: "Cash", amount: "$12,340", percentage: "27%" },
                { method: "Bank Transfer", amount: "$4,200", percentage: "9%" },
                { method: "Digital Wallet", amount: "$900", percentage: "2%" }
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{payment.method}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: payment.percentage }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{payment.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Directory Listings</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Search Listings
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-xs text-gray-500">+34 this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,156</div>
            <div className="text-xs text-gray-500">92.7% active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Verified Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">892</div>
            <div className="text-xs text-gray-500">71.5% verified</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$12,450</div>
            <div className="text-xs text-gray-500">+18% growth</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "TechCorp Solutions", category: "Technology", status: "Active", rating: 4.8, date: "2 hours ago" },
                { name: "Green Valley Restaurant", category: "Food & Dining", status: "Pending", rating: 4.6, date: "5 hours ago" },
                { name: "Elite Fitness Center", category: "Health & Fitness", status: "Active", rating: 4.9, date: "1 day ago" },
                { name: "Downtown Law Firm", category: "Legal Services", status: "Active", rating: 4.7, date: "2 days ago" }
              ].map((listing, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{listing.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{listing.category} • {listing.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{listing.rating}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      listing.status === 'Active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Technology", count: 234, percentage: "18.8%" },
                { name: "Food & Dining", count: 189, percentage: "15.2%" },
                { name: "Health & Fitness", count: 156, percentage: "12.5%" },
                { name: "Professional Services", count: 145, percentage: "11.6%" },
                { name: "Retail", count: 132, percentage: "10.6%" },
                { name: "Other", count: 391, percentage: "31.3%" }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{category.count} listings</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: category.percentage }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{category.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLocalBusiness = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Local Business Directory</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            View Map
          </Button>
          <Button 
            className="flex items-center text-black hover:text-black" 
            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Business
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Local Businesses</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">567</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">In your area</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Locations</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">432</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">76.2% verified</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">4.3</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Based on 1,234 reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">New This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">23</div>
            <div className="text-xs text-gray-500">+12 vs last week</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Local Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Mario's Italian Bistro", category: "Restaurant", location: "Downtown", rating: 4.7, distance: "0.3 miles", verified: true },
              { name: "Quick Fix Auto Repair", category: "Automotive", location: "Industrial District", rating: 4.5, distance: "1.2 miles", verified: true },
              { name: "Sunset Yoga Studio", category: "Health & Wellness", location: "Riverside", rating: 4.9, distance: "0.8 miles", verified: false },
              { name: "Tech Solutions Inc.", category: "Technology", location: "Business Park", rating: 4.6, distance: "2.1 miles", verified: true },
              { name: "Green Thumb Nursery", category: "Garden Center", location: "Suburban", rating: 4.4, distance: "1.5 miles", verified: false },
              { name: "Elite Hair Salon", category: "Beauty & Spa", location: "Shopping Center", rating: 4.8, distance: "0.6 miles", verified: true }
            ].map((business, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                      {business.name}
                      {business.verified && <CheckCircle className="w-4 h-4 ml-1 text-green-500" />}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{business.category} • {business.location}</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{business.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{business.distance}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Claims Management</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter Claims
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            New Claim
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">189</div>
            <div className="text-xs text-gray-500">All time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <div className="text-xs text-gray-500">Awaiting verification</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">145</div>
            <div className="text-xs text-gray-500">76.7% approval rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">21</div>
            <div className="text-xs text-gray-500">11.1% rejection rate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "CLM-001", business: "TechCorp Solutions", claimer: "John Smith", type: "Ownership", status: "Approved", date: "2 hours ago" },
              { id: "CLM-002", business: "Green Valley Restaurant", claimer: "Maria Garcia", type: "Management", status: "Pending", date: "5 hours ago" },
              { id: "CLM-003", business: "Elite Fitness Center", claimer: "Mike Johnson", type: "Ownership", status: "Under Review", date: "1 day ago" },
              { id: "CLM-004", business: "Downtown Law Firm", claimer: "Sarah Wilson", type: "Partner", status: "Approved", date: "2 days ago" },
              { id: "CLM-005", business: "Creative Studio", claimer: "David Lee", type: "Ownership", status: "Rejected", date: "3 days ago" }
            ].map((claim, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{claim.id}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{claim.business} • {claim.claimer}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{claim.type} claim • {claim.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    claim.status === 'Approved' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : claim.status === 'Pending' || claim.status === 'Under Review'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {claim.status}
                  </span>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCommission = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Commission Tracking</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <DollarSign className="w-4 h-4 mr-2" />
            Process Payouts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$23,456</div>
            <div className="text-xs text-gray-500">All time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$3,890</div>
            <div className="text-xs text-gray-500">+18% vs last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$1,245</div>
            <div className="text-xs text-gray-500">5 affiliates</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">4.2%</div>
            <div className="text-xs text-gray-500">+0.3% improvement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "TechCorp Solutions", referrals: 45, earnings: "$2,340", rate: "5.2%" },
                { name: "Green Valley Restaurant", referrals: 32, earnings: "$1,680", rate: "4.8%" },
                { name: "Elite Fitness Center", referrals: 28, earnings: "$1,456", rate: "4.3%" },
                { name: "Downtown Law Firm", referrals: 21, earnings: "$1,092", rate: "3.9%" },
                { name: "Creative Studio", referrals: 18, earnings: "$936", rate: "3.5%" }
              ].map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{performer.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{performer.referrals} referrals • {performer.rate} rate</div>
                    </div>
                  </div>
                  <div className="font-medium text-green-600">{performer.earnings}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: "TXN-001", affiliate: "TechCorp Solutions", amount: "$125", type: "Referral", date: "2 hours ago", status: "Completed" },
                { id: "TXN-002", affiliate: "Green Valley Restaurant", amount: "$78", type: "Bonus", date: "5 hours ago", status: "Pending" },
                { id: "TXN-003", affiliate: "Elite Fitness Center", amount: "$156", type: "Referral", date: "1 day ago", status: "Completed" },
                { id: "TXN-004", affiliate: "Downtown Law Firm", amount: "$89", type: "Referral", date: "2 days ago", status: "Completed" }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{transaction.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.affiliate} • {transaction.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{transaction.amount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  const renderAutoblog = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Auto Blog System</h2>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            New Blog
          </Button>
          <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
            <Bot className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Published Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">+12 this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Excellent rating</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">45.2K</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">+2.1K this month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "AI-Powered E-commerce Trends 2025", status: "Published", views: "1.2K", date: "2 hours ago" },
              { title: "Best Practices for SaaS Development", status: "Draft", views: "0", date: "1 day ago" },
              { title: "The Future of Business Automation", status: "Published", views: "3.4K", date: "3 days ago" },
              { title: "Customer Experience Optimization", status: "Published", views: "2.8K", date: "1 week ago" }
            ].map((post, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'Published' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {post.status}
                    </span>
                    <span>{post.views} views</span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSEO = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Tools & Analytics</h2>
        <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Search className="w-4 h-4 mr-2" />
          Run SEO Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Domain Authority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">72</div>
            <div className="text-xs text-gray-500">+5 this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Organic Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12.4K</div>
            <div className="text-xs text-gray-500">+18% growth</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Keywords Ranked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">145</div>
            <div className="text-xs text-gray-500">+12 new</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Backlinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">324</div>
            <div className="text-xs text-gray-500">+8 this week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { keyword: "saas platform", position: 3, traffic: "2.1K", change: "+2" },
                { keyword: "e-commerce solution", position: 7, traffic: "1.8K", change: "+1" },
                { keyword: "business automation", position: 12, traffic: "1.2K", change: "-1" },
                { keyword: "ai assistant", position: 15, traffic: "980", change: "+5" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.keyword}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.traffic} monthly searches</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">#{item.position}</div>
                    <div className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Page Speed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm text-green-600">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mobile Friendly</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm text-blue-600">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SSL Security</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm text-green-600">100%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SEO Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm text-purple-600">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>
        <Button variant="outline" className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          Preview Public Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                {profileLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {userProfile ? `${(userProfile as any)?.firstName || ''} ${(userProfile as any)?.lastName || ''}`.trim() || 'User' : (user as any)?.username || 'User'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Customer since {(userStats as any)?.accountAge || 'Recently'}
                    </p>
                    <Badge className="mt-2" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                      {(userProfile as any)?.emailVerified ? 'Verified Member' : 'Member'}
                    </Badge>
                  </>
                )}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {profileLoading ? (
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    <p>📧 {(userProfile as any)?.email || (user as any)?.email || 'No email provided'}</p>
                    <p>📱 {(userProfile as any)?.phone || 'No phone provided'}</p>
                    <p>📍 {(userProfile as any)?.city || (userProfile as any)?.country || 'Location not set'}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                {profileLoading ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ) : (
                  <input 
                    type="text" 
                    value={userProfile?.firstName || ''}
                    placeholder="Enter your first name"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                {profileLoading ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ) : (
                  <input 
                    type="text" 
                    value={userProfile?.lastName || ''}
                    placeholder="Enter your last name"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                {profileLoading ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ) : (
                  <input 
                    type="email" 
                    value={userProfile?.email || user?.email || ''}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                {profileLoading ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ) : (
                  <input 
                    type="tel" 
                    value={userProfile?.phone || ''}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                {profileLoading ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ) : (
                  <input 
                    type="date" 
                    value={userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0] : ''}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                {profileLoading ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ) : (
                  <select 
                    value={userProfile?.gender || ''}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              {profileLoading ? (
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : (
                <textarea 
                  rows={3}
                  placeholder="Tell us about yourself..."
                  value={userProfile?.bio || ''}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
              <Button variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats?.totalOrders || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${userStats?.totalSpent || '0.00'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats?.itemsPurchased || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Items Purchased</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats?.averageRating || '0.0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Rating Given</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Addresses</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
          <MapPin className="w-4 h-4 mr-1" />
          Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            id: 1,
            type: 'Home',
            name: 'John Doe',
            address: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States',
            phone: '+1 (555) 123-4567',
            isDefault: true
          },
          {
            id: 2,
            type: 'Work',
            name: 'John Doe',
            address: '456 Business Ave, Suite 200',
            city: 'New York',
            state: 'NY',
            zip: '10002',
            country: 'United States',
            phone: '+1 (555) 987-6543',
            isDefault: false
          },
          {
            id: 3,
            type: 'Other',
            name: 'Jane Doe',
            address: '789 Family Street',
            city: 'Brooklyn',
            state: 'NY',
            zip: '11201',
            country: 'United States',
            phone: '+1 (555) 456-7890',
            isDefault: false
          }
        ].map((address) => (
          <Card key={address.id} className="relative">
            {address.isDefault && (
              <div className="absolute top-3 right-3">
                <Badge style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                  Default
                </Badge>
              </div>
            )}
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {address.type}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {address.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.country}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.phone}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {!address.isDefault && (
                  <Button variant="outline" size="sm" className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Set as Default
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex items-center text-red-600 hover:text-red-700">
                  <X className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Address Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address Type
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                placeholder="Enter full name"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                placeholder="Enter street address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                placeholder="Enter city"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State/Province
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                placeholder="Enter state/province"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ZIP/Postal Code
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                placeholder="Enter ZIP code"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input 
                type="tel" 
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Set as default address
                </span>
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-2">
            <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Save Address
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Methods</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
          <Plus className="w-4 h-4 mr-1" />
          Add New Payment Method
        </Button>
      </div>

      {/* Saved Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Saved Cards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              id: 1,
              type: 'Visa',
              last4: '4242',
              expiry: '12/25',
              name: 'John Doe',
              isDefault: true,
              brand: 'visa'
            },
            {
              id: 2,
              type: 'Mastercard',
              last4: '5555',
              expiry: '08/26',
              name: 'John Doe',
              isDefault: false,
              brand: 'mastercard'
            },
            {
              id: 3,
              type: 'American Express',
              last4: '0005',
              expiry: '03/27',
              name: 'John Doe',
              isDefault: false,
              brand: 'amex'
            }
          ].map((card) => (
            <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {card.type} •••• {card.last4}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expires {card.expiry} • {card.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {card.isDefault && (
                  <Badge style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                    Default
                  </Badge>
                )}
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {!card.isDefault && (
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Set Default
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PayPal & Digital Wallets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            Digital Wallets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              id: 1,
              type: 'PayPal',
              email: 'john.doe@example.com',
              connected: true,
              isDefault: false
            },
            {
              id: 2,
              type: 'Apple Pay',
              device: 'iPhone 12 Pro',
              connected: true,
              isDefault: false
            },
            {
              id: 3,
              type: 'Google Pay',
              account: 'john.doe@gmail.com',
              connected: false,
              isDefault: false
            }
          ].map((wallet) => (
            <div key={wallet.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {wallet.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {wallet.email || wallet.device || wallet.account}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {wallet.connected ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Not Connected
                  </Badge>
                )}
                {wallet.connected && !wallet.isDefault && (
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Set Default
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  {wallet.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add New Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Method Type
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option>Credit/Debit Card</option>
                <option>PayPal</option>
                <option>Bank Account</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cardholder Name
                </label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CVV
                </label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Set as default payment method
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                <Plus className="w-4 h-4 mr-1" />
                Add Payment Method
              </Button>
              <Button variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Payment Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Purchase Protection</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">All transactions are protected by SSL encryption</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                <Shield className="w-3 h-3 mr-1" />
                Enabled
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Transaction Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of all payment activities</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <Button variant="outline" className="flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'order-updates', label: 'Order Updates', desc: 'Shipping, delivery, and order status changes', enabled: true },
              { id: 'promotions', label: 'Promotions & Deals', desc: 'Special offers and sales notifications', enabled: true },
              { id: 'new-products', label: 'New Products', desc: 'Notifications about new arrivals', enabled: false },
              { id: 'price-drops', label: 'Price Drops', desc: 'When items in your wishlist go on sale', enabled: true },
              { id: 'restock', label: 'Restock Alerts', desc: 'When out-of-stock items become available', enabled: true },
              { id: 'reviews', label: 'Review Reminders', desc: 'Reminders to review your purchases', enabled: false },
              { id: 'newsletters', label: 'Newsletter', desc: 'Weekly newsletter with tips and updates', enabled: true }
            ].map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{notification.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.desc}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    defaultChecked={notification.enabled}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              SMS Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'sms-orders', label: 'Order Updates', desc: 'Critical order status changes only', enabled: true },
              { id: 'sms-delivery', label: 'Delivery Notifications', desc: 'When your package is out for delivery', enabled: true },
              { id: 'sms-security', label: 'Security Alerts', desc: 'Account security and login notifications', enabled: true },
              { id: 'sms-promotions', label: 'Flash Sales', desc: 'Time-sensitive deals and promotions', enabled: false }
            ].map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{notification.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.desc}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    defaultChecked={notification.enabled}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'push-orders', label: 'Order Updates', desc: 'Real-time order status changes', enabled: true },
              { id: 'push-chat', label: 'Customer Support', desc: 'Messages from support team', enabled: true },
              { id: 'push-wishlist', label: 'Wishlist Updates', desc: 'Price changes and stock alerts', enabled: false },
              { id: 'push-recommendations', label: 'Product Recommendations', desc: 'Personalized product suggestions', enabled: false }
            ].map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{notification.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.desc}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    defaultChecked={notification.enabled}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                id: 1, 
                type: 'order', 
                title: 'Order #ORD-2024-001 has been delivered', 
                desc: 'Your package was delivered to 123 Main Street', 
                time: '2 hours ago',
                read: false
              },
              { 
                id: 2, 
                type: 'promotion', 
                title: 'Flash Sale: 50% off Electronics', 
                desc: 'Limited time offer on selected electronics items', 
                time: '4 hours ago',
                read: true
              },
              { 
                id: 3, 
                type: 'restock', 
                title: 'Item back in stock: Wireless Headphones', 
                desc: 'An item from your wishlist is now available', 
                time: '1 day ago',
                read: true
              },
              { 
                id: 4, 
                type: 'security', 
                title: 'New login detected', 
                desc: 'Someone signed in to your account from New York', 
                time: '2 days ago',
                read: true
              }
            ].map((notification) => (
              <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{notification.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.desc}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/notifications')}
            >
              View All Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password & Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Password & Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Password</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                    Enabled
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Backup Codes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recovery codes for account access</p>
                </div>
                <Button variant="outline" size="sm">
                  View Codes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Verification</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">john.doe@example.com</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                  Verified
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Phone Verification</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                  Verified
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Account Recovery</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recovery email configured</p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Login Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                id: 1, 
                device: 'Chrome on Windows', 
                location: 'New York, NY', 
                time: '2 hours ago', 
                current: true,
                ip: '192.168.1.100'
              },
              { 
                id: 2, 
                device: 'iPhone Safari', 
                location: 'New York, NY', 
                time: '1 day ago', 
                current: false,
                ip: '192.168.1.101'
              },
              { 
                id: 3, 
                device: 'Chrome on MacOS', 
                location: 'Brooklyn, NY', 
                time: '3 days ago', 
                current: false,
                ip: '192.168.1.102'
              },
              { 
                id: 4, 
                device: 'Firefox on Windows', 
                location: 'Manhattan, NY', 
                time: '1 week ago', 
                current: false,
                ip: '192.168.1.103'
              }
            ].map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    session.current ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.device}
                      {session.current && <span className="ml-2 text-xs text-green-600">(Current)</span>}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.location} • {session.time}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      IP: {session.ip}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <XCircle className="w-4 h-4 mr-1" />
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                id: 'profile-visibility', 
                label: 'Profile Visibility', 
                desc: 'Control who can see your profile information', 
                value: 'Private',
                enabled: false
              },
              { 
                id: 'order-history', 
                label: 'Order History Privacy', 
                desc: 'Keep your purchase history private', 
                value: 'Private',
                enabled: true
              },
              { 
                id: 'activity-tracking', 
                label: 'Activity Tracking', 
                desc: 'Allow tracking for personalized recommendations', 
                value: 'Enabled',
                enabled: true
              },
              { 
                id: 'data-sharing', 
                label: 'Data Sharing', 
                desc: 'Share anonymous data to improve services', 
                value: 'Disabled',
                enabled: false
              }
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{setting.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{setting.desc}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{setting.value}</span>
                  <input 
                    type="checkbox" 
                    defaultChecked={setting.enabled}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-medium text-red-900 dark:text-red-400">Download Account Data</p>
                <p className="text-sm text-red-700 dark:text-red-500">Export all your personal data</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-medium text-red-900 dark:text-red-400">Delete Account</p>
                <p className="text-sm text-red-700 dark:text-red-500">Permanently delete your account and all data</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );


  
  const renderHelpSupport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
          <Plus className="w-4 h-4 mr-1" />
          New Support Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Support Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Submit Support Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <input 
                type="text" 
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option>Order Issues</option>
                <option>Payment Problems</option>
                <option>Account Issues</option>
                <option>Technical Support</option>
                <option>Product Questions</option>
                <option>Returns & Refunds</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea 
                rows={4}
                placeholder="Please describe your issue in detail..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                <Send className="w-4 h-4 mr-1" />
                Submit Ticket
              </Button>
              <Button variant="outline">
                <Paperclip className="w-4 h-4 mr-1" />
                Attach Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with support agent', available: true },
              { icon: Phone, label: 'Phone Support', desc: 'Call us at 1-800-AVEENIX', available: true },
              { icon: Mail, label: 'Email Support', desc: 'Send us an email', available: true },
              { icon: Video, label: 'Video Call', desc: 'Schedule a video call', available: false },
              { icon: Book, label: 'Knowledge Base', desc: 'Browse help articles', available: true }
            ].map((action) => (
              <div key={action.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <action.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{action.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.desc}</p>
                  </div>
                </div>
                <Button 
                  variant={action.available ? "outline" : "ghost"} 
                  size="sm"
                  disabled={!action.available}
                >
                  {action.available ? 'Start' : 'Unavailable'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Support Ticket History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Support Ticket History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: 'TKT-2024-001',
                subject: 'Order delivery issue',
                status: 'resolved',
                priority: 'high',
                created: '2024-01-15',
                updated: '2024-01-16',
                category: 'Order Issues'
              },
              {
                id: 'TKT-2024-002',
                subject: 'Payment not processed',
                status: 'in-progress',
                priority: 'medium',
                created: '2024-01-10',
                updated: '2024-01-12',
                category: 'Payment Problems'
              },
              {
                id: 'TKT-2024-003',
                subject: 'Account login problems',
                status: 'pending',
                priority: 'low',
                created: '2024-01-08',
                updated: '2024-01-08',
                category: 'Account Issues'
              }
            ].map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{ticket.id}</span>
                    <Badge 
                      className={`${
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' :
                        ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                      }`}
                    >
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{ticket.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.category} • Created: {ticket.created} • Updated: {ticket.updated}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Tickets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                question: 'How do I track my order?',
                answer: 'You can track your order by going to My Orders section and clicking on the order details.'
              },
              {
                question: 'What is your return policy?',
                answer: 'We accept returns within 30 days of purchase. Items must be in original condition.'
              },
              {
                question: 'How do I change my shipping address?',
                answer: 'You can update your shipping address in the Addresses section of your account.'
              },
              {
                question: 'How do I cancel my order?',
                answer: 'Orders can be cancelled within 2 hours of placement. Contact support for assistance.'
              }
            ].map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-3 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-lg mt-1">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              <Book className="w-4 h-4 mr-1" />
              Browse Knowledge Base
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderSystemAdmin = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Administration</h2>
        <Badge className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">
          <Shield className="w-3 h-3 mr-1" />
          SuperAdmin Only
        </Badge>
      </div>

      {/* Role View Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Role View & Testing
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Switch between different user roles to test platform functionality and permissions
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Current Role:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You are currently viewing the platform as a {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
              </div>
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {userRole === 'superadmin' ? 'Superadmin' : 
                   userRole === 'admin' ? 'Admin' : 
                   userRole === 'business' ? 'Business' : 
                   userRole === 'vendor' ? 'Vendor' : 'Customer'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { 
                  role: 'superadmin', 
                  label: 'Superadmin', 
                  description: 'Full platform access, system management',
                  icon: Shield,
                  color: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                },
                { 
                  role: 'admin', 
                  label: 'Admin', 
                  description: 'Administrative access, user management',
                  icon: Settings,
                  color: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                },
                { 
                  role: 'business', 
                  label: 'Business', 
                  description: 'Business apps, CRM, invoicing tools',
                  icon: Briefcase,
                  color: 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400'
                },
                { 
                  role: 'vendor', 
                  label: 'Vendor', 
                  description: 'Marketplace seller, product management',
                  icon: Store,
                  color: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                },
                { 
                  role: 'customer', 
                  label: 'Customer', 
                  description: 'Standard user, shopping experience',
                  icon: User,
                  color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                }
              ].map((roleInfo) => (
                <div
                  key={roleInfo.role}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    userRole === roleInfo.role 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setUserRole(roleInfo.role as any)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${roleInfo.color}`}>
                      <roleInfo.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {roleInfo.label}
                        </h3>
                        {userRole === roleInfo.role && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {roleInfo.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Role Testing Mode
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Permissions: {userRole === 'superadmin' ? 'Full Access' : 
                              userRole === 'admin' ? 'Admin Access' : 
                              userRole === 'business' ? 'Business Apps' : 
                              userRole === 'vendor' ? 'Vendor Tools' : 'Customer View'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Management Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setActiveTab('user-management')}
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">User Management</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setActiveTab('module-management')}
            >
              <Package className="w-6 h-6" />
              <span className="text-sm">Module Management</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setActiveTab('system-logs')}
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">System Logs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setActiveTab('database')}
            >
              <Database className="w-6 h-6" />
              <span className="text-sm">Database Admin</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setActiveTab('platform-settings')}
            >
              <Settings className="w-6 h-6" />
              <span className="text-sm">Platform Settings</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => setActiveTab('session-management')}
            >
              <Lock className="w-6 h-6" />
              <span className="text-sm">Session Management</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Role Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Feature</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Superadmin</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Admin</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Business</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Vendor</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Customer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'System Administration', superadmin: true, admin: true, business: false, vendor: false, customer: false },
                  { feature: 'User Management', superadmin: true, admin: true, business: false, vendor: false, customer: false },
                  { feature: 'Business Apps (Jarvis)', superadmin: true, admin: true, business: true, vendor: false, customer: false },
                  { feature: 'E-Commerce Platform', superadmin: true, admin: true, business: false, vendor: true, customer: true },
                  { feature: 'Vendor Tools', superadmin: true, admin: true, business: false, vendor: true, customer: false },
                  { feature: 'Auto Blogs', superadmin: true, admin: true, business: false, vendor: false, customer: false },
                  { feature: 'Network Directory', superadmin: true, admin: true, business: true, vendor: false, customer: false },
                  { feature: 'Custom Apps', superadmin: true, admin: true, business: true, vendor: true, customer: true }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.superadmin ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.admin ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.business ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.vendor ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.customer ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderDatabase = () => <div className="p-8 text-center text-gray-500">Database management</div>;
  const renderUserManagement = () => <div className="p-8 text-center text-gray-500">User management system</div>;
  const renderModuleManagement = () => <div className="p-8 text-center text-gray-500">Module management</div>;
  const renderSystemLogs = () => <div className="p-8 text-center text-gray-500">System logs and monitoring</div>;
  const renderPlatformSettings = () => <div className="p-8 text-center text-gray-500">Platform configuration</div>;
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h2>
        <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme & Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme Mode
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    theme === 'dark' 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Toggle between light and dark theme
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Color Theme
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    <Palette className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {colorTheme} Theme
                  </span>
                </div>
                <DesktopColorPicker />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Click the color picker to change your theme color
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Display Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dashboard Layout
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="default">Default Layout</option>
                  <option value="compact">Compact Layout</option>
                  <option value="expanded">Expanded Layout</option>
                  <option value="minimal">Minimal Layout</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Items per Page
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="10">10 items</option>
                  <option value="25">25 items</option>
                  <option value="50">50 items</option>
                  <option value="100">100 items</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="sidebar-collapsed" className="rounded" />
                <label htmlFor="sidebar-collapsed" className="text-sm text-gray-700 dark:text-gray-300">
                  Collapse sidebar by default
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="show-breadcrumbs" className="rounded" defaultChecked />
                <label htmlFor="show-breadcrumbs" className="text-sm text-gray-700 dark:text-gray-300">
                  Show breadcrumb navigation
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Auto-refresh Interval
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="0">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Animation Speed
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="fast">Fast</option>
                  <option value="normal">Normal</option>
                  <option value="slow">Slow</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="lazy-loading" className="rounded" defaultChecked />
                <label htmlFor="lazy-loading" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable lazy loading
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cache-data" className="rounded" defaultChecked />
                <label htmlFor="cache-data" className="text-sm text-gray-700 dark:text-gray-300">
                  Cache data for faster loading
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="high-contrast" className="rounded" />
              <label htmlFor="high-contrast" className="text-sm text-gray-700 dark:text-gray-300">
                High contrast mode
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="large-text" className="rounded" />
              <label htmlFor="large-text" className="text-sm text-gray-700 dark:text-gray-300">
                Large text size
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="reduce-motion" className="rounded" />
              <label htmlFor="reduce-motion" className="text-sm text-gray-700 dark:text-gray-300">
                Reduce motion and animations
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="screen-reader" className="rounded" />
              <label htmlFor="screen-reader" className="text-sm text-gray-700 dark:text-gray-300">
                Screen reader optimizations
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const renderLanguage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Language & Region Settings</h2>
        <Button className="flex items-center" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Globe className="w-4 h-4 mr-2" />
          Auto-Detect
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interface Language
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese (Simplified)</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="ru">Russian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Language
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">None</option>
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-translate" className="rounded" />
                <label htmlFor="auto-translate" className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-translate content when available
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country/Region
                </label>
                <select 
                  value={selectedCountry?.code || ''} 
                  onChange={(e) => {
                    const country = countries.find(c => c.code === e.target.value);
                    setSelectedCountry(country || null);
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Zone
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC+0">UTC (GMT)</option>
                  <option value="UTC+1">Central European Time (UTC+1)</option>
                  <option value="UTC+8">China Standard Time (UTC+8)</option>
                  <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  <option value="DD.MM.YYYY">DD.MM.YYYY (European)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number Format
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="1,234.56">1,234.56 (US)</option>
                  <option value="1.234,56">1.234,56 (European)</option>
                  <option value="1 234,56">1 234,56 (French)</option>
                  <option value="1'234.56">1'234.56 (Swiss)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                  <option value="CAD">Canadian Dollar (C$)</option>
                  <option value="AUD">Australian Dollar (A$)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard & Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keyboard Layout
              </label>
              <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="qwerty">QWERTY (US)</option>
                <option value="qwertz">QWERTZ (German)</option>
                <option value="azerty">AZERTY (French)</option>
                <option value="dvorak">Dvorak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input Method
              </label>
              <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="standard">Standard</option>
                <option value="ime">Input Method Editor (IME)</option>
                <option value="phonetic">Phonetic</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="spell-check" className="rounded" defaultChecked />
              <label htmlFor="spell-check" className="text-sm text-gray-700 dark:text-gray-300">
                Enable spell check
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto-correct" className="rounded" />
              <label htmlFor="auto-correct" className="text-sm text-gray-700 dark:text-gray-300">
                Auto-correct typos
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="voice-input" className="rounded" />
              <label htmlFor="voice-input" className="text-sm text-gray-700 dark:text-gray-300">
                Enable voice input
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <Button variant="outline" className="flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Test Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'email-orders', label: 'Order Updates', description: 'New orders, status changes, payments' },
                { id: 'email-customers', label: 'Customer Messages', description: 'Support requests, feedback' },
                { id: 'email-marketing', label: 'Marketing Campaigns', description: 'Campaign performance, subscriber updates' },
                { id: 'email-system', label: 'System Alerts', description: 'Security, maintenance, errors' },
                { id: 'email-reports', label: 'Weekly Reports', description: 'Sales summaries, analytics' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'push-urgent', label: 'Urgent Alerts', description: 'Critical system issues, security alerts' },
                { id: 'push-orders', label: 'Order Notifications', description: 'New orders, payment confirmations' },
                { id: 'push-messages', label: 'Messages', description: 'Chat messages, support tickets' },
                { id: 'push-calendar', label: 'Calendar Reminders', description: 'Upcoming appointments, events' },
                { id: 'push-marketing', label: 'Marketing Updates', description: 'Campaign results, subscriber milestones' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiet Hours
              </label>
              <div className="flex items-center space-x-3">
                <input 
                  type="time" 
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  defaultValue="22:00"
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="time" 
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  defaultValue="08:00"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                No notifications during these hours (except urgent)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Frequency
              </label>
              <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="instant">Instant</option>
                <option value="digest-hourly">Hourly Digest</option>
                <option value="digest-daily">Daily Digest</option>
                <option value="digest-weekly">Weekly Digest</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekend Notifications
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="weekend-all" name="weekend" className="rounded" />
                  <label htmlFor="weekend-all" className="text-sm text-gray-700 dark:text-gray-300">
                    All notifications
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="weekend-urgent" name="weekend" className="rounded" defaultChecked />
                  <label htmlFor="weekend-urgent" className="text-sm text-gray-700 dark:text-gray-300">
                    Urgent only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="weekend-none" name="weekend" className="rounded" />
                  <label htmlFor="weekend-none" className="text-sm text-gray-700 dark:text-gray-300">
                    No notifications
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Sound
              </label>
              <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="default">Default</option>
                <option value="chime">Chime</option>
                <option value="bell">Bell</option>
                <option value="ding">Ding</option>
                <option value="none">Silent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Settings</h2>
        <Button variant="outline" className="flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Privacy Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'analytics', label: 'Usage Analytics', description: 'Help improve our service with usage data' },
                { id: 'performance', label: 'Performance Monitoring', description: 'Monitor app performance and errors' },
                { id: 'marketing', label: 'Marketing Insights', description: 'Personalized recommendations and offers' },
                { id: 'location', label: 'Location Services', description: 'Location-based features and services' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'profile-public', label: 'Public Profile', description: 'Make your profile visible to others' },
                { id: 'activity-status', label: 'Activity Status', description: 'Show when you\'re online or active' },
                { id: 'purchase-history', label: 'Purchase History', description: 'Allow others to see your purchases' },
                { id: 'reviews-public', label: 'Public Reviews', description: 'Make your reviews visible to all users' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">Download Your Data</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Get a copy of all your data in a portable format</div>
              </div>
              <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div>
                <div className="font-medium text-yellow-900 dark:text-yellow-100">Data Retention</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Automatically delete old data after 2 years</div>
              </div>
              <Button variant="outline" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div>
                <div className="font-medium text-red-900 dark:text-red-100">Delete Account</div>
                <div className="text-sm text-red-700 dark:text-red-300">Permanently delete your account and all data</div>
              </div>
              <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderSessionManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session & Device Management</h2>
        <Button 
          variant="outline" 
          className="text-red-600 hover:text-red-700"
          onClick={() => {
            // This would handle logout from all devices
            console.log('Logging out from all devices...');
          }}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout All Devices
        </Button>
      </div>

      {/* Current Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-400">Active Session</p>
                  <p className="text-sm text-green-700 dark:text-green-500">
                    Chrome on Windows • New York, NY • Started 3 hours ago
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    IP: 192.168.1.100 • Session ID: sess_abc123xyz
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                Current
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Session Duration</p>
                <p className="font-medium text-gray-900 dark:text-white">3 hours 24 minutes</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Activity</p>
                <p className="font-medium text-gray-900 dark:text-white">2 minutes ago</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Auto Logout</p>
                <p className="font-medium text-gray-900 dark:text-white">30 minutes inactive</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            All Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                id: 1, 
                device: 'Chrome on Windows', 
                location: 'New York, NY', 
                time: '3 hours ago', 
                current: true,
                ip: '192.168.1.100',
                sessionId: 'sess_abc123xyz'
              },
              { 
                id: 2, 
                device: 'iPhone Safari', 
                location: 'New York, NY', 
                time: '1 day ago', 
                current: false,
                ip: '192.168.1.101',
                sessionId: 'sess_def456uvw'
              },
              { 
                id: 3, 
                device: 'Chrome on MacOS', 
                location: 'Brooklyn, NY', 
                time: '3 days ago', 
                current: false,
                ip: '192.168.1.102',
                sessionId: 'sess_ghi789rst'
              }
            ].map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    session.current ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.device}
                      {session.current && <span className="ml-2 text-xs text-green-600">(This Device)</span>}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.location} • Last active: {session.time}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      IP: {session.ip} • Session: {session.sessionId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {session.current ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                      Current
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <XCircle className="w-4 h-4 mr-1" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Session Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-logout after inactivity</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically log out after 30 minutes of inactivity</p>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <select className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm">
                  <option value="15">15 minutes</option>
                  <option value="30" selected>30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Remember this device</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stay logged in for 30 days on this device</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Concurrent session limit</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Maximum number of active sessions</p>
              </div>
              <select className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm">
                <option value="1">1 session</option>
                <option value="3" selected>3 sessions</option>
                <option value="5">5 sessions</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Session notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about new login sessions</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anti-Phishing Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Anti-Phishing Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="font-medium text-blue-900 dark:text-blue-400">Your Anti-Phishing Code</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded border text-center">
                <code className="text-lg font-mono text-gray-900 dark:text-white">SECURE-2024</code>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-500 mt-2">
                This code will appear in all legitimate emails from us. Never trust emails without this code.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Generate New Code
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View in Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LogOut className="w-5 h-5 mr-2" />
            Logout Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Logout from this device</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">End current session on this device only</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setLocation('/logout'); }}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-medium text-red-900 dark:text-red-400">Logout from all devices</p>
                <p className="text-sm text-red-700 dark:text-red-500">End all active sessions across all devices</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => { setLocation('/logout'); }}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Error state component
  const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 mb-4">
          <AlertCircle className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <Button onClick={onRetry} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );

  // Loading state component
  const LoadingState = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );

  // Show error state if there's an error
  if (dataError) {
    return <ErrorState error={dataError} onRetry={() => window.location.reload()} />;
  }

  // Show loading state if data is loading
  if (isDataLoading) {
    return <LoadingState />;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header Utility Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900">
        <HeaderUtility />
      </div>
      
      <div className="flex flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden w-full max-w-[1500px] mx-auto">
        {/* Sidebar - Optimized for 1500px layout */}
      <div 
        className={`${sidebarCollapsed ? 'w-16' : 'w-60'} bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col 
        md:relative md:translate-x-0 z-30 flex-shrink-0
        ${!sidebarCollapsed ? 'block' : 'hidden md:block'}`}
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={!sidebarCollapsed}
      >
        {/* Sidebar Header - Enhanced for 1500px layout */}
        <div className={`h-16 ${sidebarCollapsed ? 'px-2' : 'px-6'} border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700`}>
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">AVEENIX</span>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400 leading-tight">Enterprise Hub</span>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="flex items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-all duration-200 group"
              aria-label="Expand sidebar"
              title="Click to expand sidebar (Ctrl+B)"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                A
              </div>
            </button>
          )}
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="p-2 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Collapse sidebar"
              title="Collapse sidebar (Ctrl+B)"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Current Role Display */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                userRole === 'superadmin' ? 'bg-red-500' :
                userRole === 'admin' ? 'bg-blue-500' :
                userRole === 'vendor' ? 'bg-green-500' :
                userRole === 'customer' ? 'bg-purple-500' :
                'bg-orange-500'
              }`} />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {userRole} Account
                </span>
                {userRole === 'superadmin' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Systems Control
                  </p>
                )}
                {userRole === 'admin' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Platform Management
                  </p>
                )}
                {userRole === 'vendor' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Sales & Products
                  </p>
                )}
                {userRole === 'customer' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Shopping & Orders
                  </p>
                )}
                {userRole === 'business' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Business Tools
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationSections.map((section) => (
              <div key={section.id} className="space-y-1">
                {/* Section Header with Enhanced Active States (Enhancement #3) */}
                <Button
                  variant={activeTab === section.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setNavigationLoadingState(section.key || section.id, true);
                    
                    setTimeout(() => {
                      // Handle sections with both key and items (like Settings)
                      if (section.key && section.items) {
                        setActiveTab(section.key);
                        updateBreadcrumbs(section.key, section.label);
                        toggleSection(section.id);
                      } else if (section.items) {
                        toggleSection(section.id);
                      } else if (section.key) {
                        setActiveTab(section.key);
                        updateBreadcrumbs(section.key, section.label);
                      }
                      setNavigationLoadingState(section.key || section.id, false);
                    }, 150);
                  }}
                  className={`w-full ${sidebarCollapsed ? 'px-2' : 'justify-between'} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group relative transition-all duration-200`}
                  style={activeTab === section.key ? { 
                    backgroundColor: 'var(--primary-color)', 
                    borderColor: 'var(--primary-color)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  } : {}}
                >
                  {/* Active indicator (Enhancement #3) */}
                  {activeTab === section.key && !sidebarCollapsed && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                  )}
                  
                  <div className="flex items-center">
                    {navigationLoading.has(section.key || section.id) ? (
                      <div className="w-4 h-4 mr-2 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <section.icon className="w-4 h-4 mr-2" />
                    )}
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{section.label}</span>
                    )}
                  </div>
                  
                  {!sidebarCollapsed && section.items && (
                    <ChevronDown className={`w-3 h-3 transition-transform ${
                      expandedSections.includes(section.id) ? 'transform rotate-180' : ''
                    }`} />
                  )}
                </Button>

                {/* Section Items with Enhanced Features */}
                {section.items ? 
                  (sidebarCollapsed || expandedSections.includes(section.id)) && (
                    <div className={`space-y-1 ${!sidebarCollapsed ? 'ml-4' : ''}`}>
                      {section.items.map((item) => (
                        <Button
                          key={item.key}
                          variant={activeTab === item.key ? "default" : "ghost"}
                          size="sm"
                          onClick={() => {
                            setNavigationLoadingState(item.key, true);
                            
                            setTimeout(() => {
                              // Handle vendor-specific navigation
                              if (item.key === 'products' && userRole === 'vendor') {
                                setLocation('/vendor/products');
                              } else if (item.key === 'upload-product') {
                                setLocation('/vendor/upload');
                              } else if (item.key === 'product-gallery') {
                                setLocation('/vendor/products/listing');
                              } else if (item.key === 'vendor-orders') {
                                setLocation('/vendor/orders');
                              } else if (item.key === 'vendor-analytics') {
                                setLocation('/vendor/analytics');
                              } else if (item.key === 'customers' && userRole === 'vendor') {
                                setLocation('/vendor/customers');
                              } else if (item.key === 'payouts') {
                                setLocation('/vendor/payouts');
                              } else if (item.key === 'reports') {
                                setLocation('/vendor/reports');
                              } else {
                                setActiveTab(item.key);
                              }
                              updateBreadcrumbs(item.key, item.label);
                              setNavigationLoadingState(item.key, false);
                            }, 150);
                          }}
                          className={`w-full ${sidebarCollapsed ? 'px-2' : 'justify-between'} text-sm group relative transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700`}
                          style={activeTab === item.key ? { 
                            backgroundColor: 'var(--primary-color)', 
                            borderColor: 'var(--primary-color)',
                            color: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          } : {}}
                        >
                          {/* Active indicator for sub-items (Enhancement #3) */}
                          {activeTab === item.key && !sidebarCollapsed && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white rounded-r-full" />
                          )}
                          
                          <div className="flex items-center">
                            {navigationLoading.has(item.key) ? (
                              <div className="w-3 h-3 mr-2 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <item.icon className="w-3 h-3 mr-2" />
                            )}
                            {!sidebarCollapsed && item.label}
                          </div>
                          

                        </Button>
                      ))}
                    </div>
                  ) : null}
                
                {/* Visual dividers between sections (Enhancement #2) */}
                {!sidebarCollapsed && (
                  <div className="my-2 border-t border-gray-200 dark:border-gray-700 opacity-50"></div>
                )}
              </div>
            ))}
          </div>
        </nav>


      </div>

      {/* Main Content */}
      {/* Mobile Sidebar Overlay (Enhancement #7) */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
          {/* Enhanced Top Header with Mobile Toggle - Optimized for 1500px */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between h-16 px-6 md:px-8">
            {/* Mobile Menu Button (Enhancement #7) */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="mr-2 p-2"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              {/* Enhanced Breadcrumbs (Enhancement #5) */}
              <nav className="flex items-center space-x-2 text-sm">
                <Home className="w-4 h-4 text-gray-500" />
                {breadcrumbHistory.map((breadcrumb, index) => (
                  <div key={breadcrumb.key} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                    <button
                      onClick={() => {
                        setActiveTab(breadcrumb.key);
                        setBreadcrumbHistory(prev => prev.slice(0, index + 1));
                      }}
                      className={`hover:text-primary transition-colors ${
                        index === breadcrumbHistory.length - 1 
                          ? 'text-gray-900 dark:text-white font-medium' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {breadcrumb.label}
                    </button>
                  </div>
                ))}
              </nav>
            </div>
            
            {/* Enhanced Universal Search Bar with Autocomplete (Enhancement #4) */}
            <div className="flex-1 max-w-lg mx-2 md:mx-4 relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length > 1) {
                      // Generate search suggestions based on navigation items
                      const suggestions = navigationSections
                        .flatMap(section => [
                          { key: section.key, label: section.label, type: 'section' },
                          ...(section.items || []).map(item => ({ 
                            key: item.key, 
                            label: item.label, 
                            type: 'item',
                            parent: section.label 
                          }))
                        ])
                        .filter(item => 
                          item.label.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          item.key?.toLowerCase().includes(e.target.value.toLowerCase())
                        )
                        .slice(0, 6);
                      
                      setSearchSuggestions(suggestions.map(s => `${s.label}${s.parent ? ` (${s.parent})` : ''}`));
                      setShowSearchSuggestions(suggestions.length > 0);
                    } else {
                      setShowSearchSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchQuery.length > 1 && searchSuggestions.length > 0) {
                      setShowSearchSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking
                    setTimeout(() => setShowSearchSuggestions(false), 200);
                  }}
                  className="w-full px-4 py-2 pl-10 pr-16 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Search navigation, data, or help..."
                  aria-label="Search navigation and data"
                  aria-describedby="search-help"
                  autoComplete="off"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                
                {/* Keyboard shortcut hint */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500">
                    Ctrl+K
                  </kbd>
                </div>
              </div>
              
              {/* Search Suggestions Dropdown (Enhancement #4) */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="py-2">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const suggestionText = suggestion.split(' (')[0];
                          const matchingSection = navigationSections.find(section => 
                            section.label === suggestionText || 
                            section.items?.some(item => item.label === suggestionText)
                          );
                          
                          if (matchingSection) {
                            const matchingItem = matchingSection.items?.find(item => item.label === suggestionText);
                            const targetKey = matchingItem?.key || matchingSection.key;
                            
                            if (targetKey) {
                              setActiveTab(targetKey);
                              updateBreadcrumbs(targetKey, suggestionText);
                            }
                          }
                          
                          setSearchQuery('');
                          setShowSearchSuggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <Search className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Action Buttons (Enhancement #6) */}
            <div className="flex items-center space-x-2 mr-4">
              {/* Enhanced Export Dropdown (Enhancement #6) */}
              <div className="relative export-dropdown">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center w-36 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  title="Export data (Ctrl+E)"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                  <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 rounded">
                    ⌘E
                  </kbd>
                </Button>
                
                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleExportPDF();
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">Export as PDF</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          handleExportExcel();
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Grid3X3 className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">Export as Excel</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          handleExportChart();
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">Export Chart</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
            
            {/* Right side elements */}
            <div className="flex items-center space-x-4">

              <div className="flex items-center space-x-2">
                
                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="relative bulk-actions">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="flex items-center"
                      style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                    >
                      <Grid3X3 className="w-4 h-4 mr-1" />
                      Bulk Actions ({selectedItems.length})
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                    
                    {showBulkActions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                        <div className="py-2">
                          <button
                            onClick={() => {
                              console.log('Bulk export selected items:', selectedItems);
                              setShowBulkActions(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Export Selected
                          </button>
                          <button
                            onClick={() => {
                              console.log('Bulk delete selected items:', selectedItems);
                              setSelectedItems([]);
                              setShowBulkActions(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X className="w-4 h-4 inline mr-2" />
                            Delete Selected
                          </button>
                          <button
                            onClick={() => {
                              console.log('Bulk archive selected items:', selectedItems);
                              setShowBulkActions(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Archive className="w-4 h-4 inline mr-2" />
                            Archive Selected
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItems([]);
                              setShowBulkActions(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Clear Selection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
              
              <div className="relative header-dropdown">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
                  </div>
                  <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Header Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setLocation('/');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      Back to Store
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setLocation('/logout');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

          {/* Enhanced Main Content Area - Optimized for 1500px layout */}
          <main 
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 md:p-8 w-full bg-gray-50 dark:bg-gray-900"
            role="main"
            aria-label="Dashboard content"
            tabIndex={-1}
          >
            <div className="max-w-[1200px] mx-auto h-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Footer - Full Width Across Screen */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between min-h-16 px-4 py-3 md:px-8 md:py-0 max-w-[1500px] mx-auto space-y-3 md:space-y-0">
          {/* Mobile: Copyright first, Desktop: Left side links */}
          <div className="order-2 md:order-1 flex flex-wrap items-center gap-4 md:gap-6">
            <button 
              onClick={() => setLocation('/legal')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
            >
              <FileText className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Legal Policy</span>
              <span className="sm:hidden">Legal</span>
            </button>
            <button 
              onClick={() => setLocation('/privacy')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
            >
              <Shield className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Privacy Policy</span>
              <span className="sm:hidden">Privacy</span>
            </button>
            <button 
              onClick={() => setLocation('/returns')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
            >
              <Package className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Returns Policy</span>
              <span className="sm:hidden">Returns</span>
            </button>
          </div>

          {/* Center - Copyright */}
          <div className="order-1 md:order-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium text-center">
            © 2025 AVEENIX. All rights reserved.
          </div>

          {/* Right side - More Legal Links */}
          <div className="order-3 flex flex-wrap items-center gap-4 md:gap-6">
            <button 
              onClick={() => setLocation('/security')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
            >
              <Shield className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Security Policy</span>
              <span className="sm:hidden">Security</span>
            </button>
            <button 
              onClick={() => setLocation('/seller')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
            >
              <User className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Seller Policy</span>
              <span className="sm:hidden">Seller</span>
            </button>
            <button 
              onClick={() => setLocation('/shipping')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
            >
              <Package className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Shipping Policy</span>
              <span className="sm:hidden">Shipping</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Help Modal (Enhancement #10) */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(false)}
                aria-label="Close shortcuts help"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Navigation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Search</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+K</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Toggle Sidebar</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+B</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Notifications</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+N</kbd>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Actions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Export</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+E</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Refresh</span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+R</kbd>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Access</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quick Navigation 1-5</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+1-5</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Close Dialogs</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Show This Help</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+?</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inventory Section Render Functions
  const renderStockManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Management</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)' }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Stock Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-xs text-gray-500">+23 this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">45</div>
            <div className="text-xs text-gray-500">Needs attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <div className="text-xs text-gray-500">Reorder required</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$248,576</div>
            <div className="text-xs text-gray-500">Current inventory</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: 'Electronics', stock: 456, lowStock: 12, outOfStock: 2 },
              { category: 'Clothing', stock: 324, lowStock: 8, outOfStock: 1 },
              { category: 'Books', stock: 267, lowStock: 15, outOfStock: 3 },
              { category: 'Home & Garden', stock: 200, lowStock: 10, outOfStock: 2 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{item.category}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.stock} items in stock
                  </div>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="text-orange-600">{item.lowStock} low stock</span>
                  <span className="text-red-600">{item.outOfStock} out of stock</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLowStockAlerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Low Stock Alerts</h2>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Wireless Headphones', sku: 'WH-001', current: 5, minimum: 20, status: 'critical' },
              { name: 'Smart Watch Pro', sku: 'SW-234', current: 12, minimum: 25, status: 'low' },
              { name: 'Bluetooth Speaker', sku: 'BS-456', current: 8, minimum: 15, status: 'low' },
              { name: 'Phone Case Set', sku: 'PC-789', current: 3, minimum: 30, status: 'critical' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${item.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`} />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">SKU: {item.sku}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.current} / {item.minimum}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current / Minimum</div>
                </div>
                <Button size="sm" style={{ backgroundColor: 'var(--primary-color)' }}>
                  Reorder
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReorderPoints = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reorder Points</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)' }}>
          <Plus className="w-4 h-4 mr-2" />
          Set Reorder Point
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Reorder Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Gaming Mouse', demand: 'High', leadTime: '7 days', suggestedOrder: 100, cost: '$2,500' },
              { name: 'USB Cables', demand: 'Medium', leadTime: '5 days', suggestedOrder: 250, cost: '$1,875' },
              { name: 'Screen Protectors', demand: 'High', leadTime: '10 days', suggestedOrder: 500, cost: '$3,750' }
            ].map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                  <Badge variant={item.demand === 'High' ? 'destructive' : 'secondary'}>
                    {item.demand} Demand
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Lead Time</div>
                    <div className="font-medium">{item.leadTime}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Suggested Order</div>
                    <div className="font-medium">{item.suggestedOrder} units</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Estimated Cost</div>
                    <div className="font-medium">{item.cost}</div>
                  </div>
                  <div>
                    <Button size="sm" variant="outline">
                      Create Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStockMovements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Movements</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button style={{ backgroundColor: 'var(--primary-color)' }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Movement
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'IN', product: 'Wireless Charger', quantity: 50, date: '2 hours ago', reference: 'PO-2024-001' },
              { type: 'OUT', product: 'Phone Case', quantity: 25, date: '4 hours ago', reference: 'SO-2024-156' },
              { type: 'IN', product: 'Bluetooth Earbuds', quantity: 100, date: '1 day ago', reference: 'PO-2024-002' },
              { type: 'OUT', product: 'Screen Protector', quantity: 75, date: '1 day ago', reference: 'SO-2024-157' }
            ].map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    movement.type === 'IN' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {movement.type === 'IN' ? (
                      <ArrowUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{movement.product}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {movement.type === 'IN' ? '+' : '-'}{movement.quantity} units • {movement.reference}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{movement.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWarehouses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Warehouse Management</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)' }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Main Warehouse', location: 'New York', capacity: '85%', products: 847 },
          { name: 'West Coast Hub', location: 'Los Angeles', capacity: '62%', products: 523 },
          { name: 'Distribution Center', location: 'Chicago', capacity: '91%', products: 692 }
        ].map((warehouse, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{warehouse.name}</span>
                <Badge>{warehouse.capacity}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{warehouse.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{warehouse.products} products</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Capacity</span>
                    <span>{warehouse.capacity}</span>
                  </div>
                  <Progress value={parseInt(warehouse.capacity)} className="h-2" />
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Sales Section Render Functions
  const renderSalesAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Analytics</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button style={{ backgroundColor: 'var(--primary-color)' }}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$156,750</div>
            <div className="text-xs text-gray-500">+12.5% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-xs text-gray-500">+8.3% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$125.80</div>
            <div className="text-xs text-gray-500">+3.7% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3.42%</div>
            <div className="text-xs text-gray-500">+0.8% vs last month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Performance by Product Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: 'Electronics', revenue: '$78,400', orders: 567, growth: '+15.2%' },
              { category: 'Clothing', revenue: '$45,320', orders: 423, growth: '+8.7%' },
              { category: 'Books', revenue: '$23,180', orders: 234, growth: '+5.3%' },
              { category: 'Home & Garden', revenue: '$19,850', orders: 156, growth: '+12.1%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.category}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.orders} orders</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">{item.revenue}</div>
                  <div className="text-sm text-green-600">{item.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSalesTargets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Targets</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)' }}>
          <Target className="w-4 h-4 mr-2" />
          Set New Target
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Monthly Revenue', target: '$200,000', current: '$156,750', progress: 78 },
          { title: 'Orders Target', target: '1,500', current: '1,247', progress: 83 },
          { title: 'New Customers', target: '250', current: '198', progress: 79 }
        ].map((target, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{target.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{target.progress}%</span>
                </div>
                <Progress value={target.progress} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current: {target.current}</span>
                  <span className="font-medium">Target: {target.target}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCustomerInsights = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Insights</h2>
        <Button variant="outline">
          <Users className="w-4 h-4 mr-2" />
          Customer Segments
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', orders: 23, spent: '$2,847', status: 'VIP' },
                { name: 'Mike Wilson', orders: 18, spent: '$2,156', status: 'Premium' },
                { name: 'Emily Davis', orders: 15, spent: '$1,923', status: 'Premium' },
                { name: 'John Smith', orders: 12, spent: '$1,567', status: 'Regular' }
              ].map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{customer.orders} orders • {customer.spent}</div>
                  </div>
                  <Badge variant={customer.status === 'VIP' ? 'destructive' : customer.status === 'Premium' ? 'default' : 'secondary'}>
                    {customer.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Repeat Purchase Rate</span>
                <span className="font-medium">68.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Time Between Orders</span>
                <span className="font-medium">23 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Lifetime Value</span>
                <span className="font-medium">$1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</span>
                <span className="font-medium text-red-600">12.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPerformanceReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Reports</h2>
        <Button style={{ backgroundColor: 'var(--primary-color)' }}>
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">This Month vs Last Month</span>
                <span className="text-green-600 font-medium">+12.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Quarter vs Last Quarter</span>
                <span className="text-green-600 font-medium">+8.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Year over Year</span>
                <span className="text-green-600 font-medium">+23.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Wireless Headphones', sales: '$12,450', trend: '+15%' },
                { name: 'Smart Watch', sales: '$9,870', trend: '+8%' },
                { name: 'Phone Case Set', sales: '$6,540', trend: '+22%' }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{product.sales}</div>
                  </div>
                  <span className="text-green-600 font-medium">{product.trend}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRevenueTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Tracking</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button style={{ backgroundColor: 'var(--primary-color)' }}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Forecast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$5,247</div>
            <div className="text-xs text-gray-500">23 orders completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$32,567</div>
            <div className="text-xs text-gray-500">156 orders completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$156,750</div>
            <div className="text-xs text-gray-500">1,247 orders completed</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { source: 'Direct Sales', amount: '$89,450', percentage: '57%' },
              { source: 'Marketplace', amount: '$45,230', percentage: '29%' },
              { source: 'Wholesale', amount: '$15,670', percentage: '10%' },
              { source: 'Affiliate', amount: '$6,400', percentage: '4%' }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{source.source}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{source.percentage} of total revenue</div>
                </div>
                <div className="font-medium text-gray-900 dark:text-white">{source.amount}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );