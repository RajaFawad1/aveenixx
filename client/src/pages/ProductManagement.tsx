import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { CSVUploader } from '../components/CSVUploader';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  DollarSign,
  Filter,
  Search,
  Download,
  Upload,
  AlertCircle,
  Loader2,
  Brain,
  TrendingUp,
  BarChart3,
  Target,
  FileText,
  Shield,
  ShieldCheck,
  Monitor,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  Trash2,
  Zap,
  AlertTriangle,
  Activity,
  Archive,
  Edit,
  Info,
  RefreshCw,
  Calendar,
  Settings,
  Plus,
  Copy,
  MoreHorizontal,
  ChevronLeft,
  ArrowLeft,
  ChevronRight,
  Play,
  // Category Icons
  Laptop,
  Shirt,
  Home,
  Heart,
  Dumbbell,
  Car,
  Book,
  Gamepad2,
  Tag,
  Image,
  Database,
  Coffee,
  Building2,
  Palette,
  PawPrint,
  Baby,
  Gem,
  Wrench,
  HelpCircle,
  // Subcategory Icons
  Smartphone,
  Headphones,
  Camera,
  Tv,
  Watch,
  MousePointer,
  Keyboard,
  Speaker
} from 'lucide-react';
import { getIconByName } from '@/utils/iconMapping';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { QualityControlSettings } from '@/components/QualityControlSettings';
import { CommissionCalculator } from '@/components/CommissionCalculator';
import { AmazonRatesManagement } from '@/components/AmazonRatesManagement';
import DropshipRateCardModal from '@/components/DropshipRateCardModal';


interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  costPrice?: string;
  category: string;
  brand: string;
  imageUrl: string;
  approvalStatus: 'preview' | 'pricing' | 'pending' | 'approved' | 'rejected' | 'published';
  sourcePlatform: string;
  productType: string;
  externalId: string;
  affiliateUrl: string;
  approvedBy?: number;
  approvedAt?: string;
  rejectionReason?: string;
  rejectionDate?: string;
  createdAt: string;
  lastSyncedAt?: string;
  // Pricing & Inventory
  discountPercentage?: number;
  stockQuantity?: number;
  isInStock?: boolean;
  // Rating & Reviews
  rating?: number;
  reviewCount?: number;
  // Additional Product Identity Fields
  productCode?: string;
  sku?: string;
  barcode?: string;
  reference?: string;
  manufacturer?: string;
  productTags?: string[];
  seoField?: string;
  notes?: string;
  // Enhanced WooCommerce fields
  platformSpecificData?: {
    woocommerce?: {
      slug?: string;
      type?: string;
      virtual?: boolean;
      downloadable?: boolean;
      manage_stock?: boolean;
      tax_status?: string;
      tax_class?: string;
      backorders?: string;
      backorders_allowed?: boolean;
      backordered?: boolean;
      sold_individually?: boolean;
      shipping_required?: boolean;
      shipping_taxable?: boolean;
      shipping_class?: string;
      reviews_allowed?: boolean;
      upsell_ids?: number[];
      cross_sell_ids?: number[];
      parent_id?: number;
      purchase_note?: string;
      default_attributes?: any[];
      variations?: number[];
      grouped_products?: number[];
      button_text?: string;
      product_url?: string;
      image_gallery?: Array<{
        id: number;
        src: string;
        alt: string;
        name: string;
      }>;
      attributes?: Array<{
        id: number;
        name: string;
        options: string[];
        visible: boolean;
        variation: boolean;
        position: number;
      }>;
      dimensions?: {
        length: string;
        width: string;
        height: string;
      };
      weight?: string;
      meta_data?: Record<string, any>;
      short_description?: string;
    };
  };
}

interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  categories: { name: string }[];
  images: { src: string }[];
  stock_status: string;
  type: string;
}

// Dynamic icon rendering function
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Laptop, Shirt, Home, Heart, Dumbbell, Car, Book, Gamepad2, Coffee, 
    Building2, Palette, PawPrint, Baby, Gem, Wrench, HelpCircle,
    Smartphone, Headphones, Camera, Tv, Watch, MousePointer, Keyboard, Speaker, Filter
  };
  return iconMap[iconName] || HelpCircle;
};

// Affiliate Products Tab Component
function AffiliateProductsTab() {
  const { data: affiliateProducts = [], isLoading } = useQuery({
    queryKey: ['/api/affiliate-products'],
    queryFn: () => fetch('/api/affiliate-products').then(res => res.json())
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
          Affiliate Products
        </CardTitle>
        <CardDescription>
          Manage products that redirect customers to external affiliate links for commissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading affiliate products...</p>
          </div>
        ) : affiliateProducts.length === 0 ? (
          <div className="text-center py-8">
            <ExternalLink className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No affiliate products</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start earning commissions by adding affiliate products from external platforms
            </p>
            <Button style={{ backgroundColor: 'var(--primary-color)' }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Affiliate Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-full overflow-hidden">
            {affiliateProducts.map((product: any) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">{product.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{product.category}</p>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--primary-color)' }}>${product.price}</p>
                      <p className="text-xs text-green-600">Commission: {product.commissionRate || '5'}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Dropship Products Tab Component
function DropshipProductsTab() {
  const { data: dropshipProducts = [], isLoading } = useQuery({
    queryKey: ['/api/dropship-products'],
    queryFn: () => fetch('/api/dropship-products').then(res => res.json())
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
              Dropship Products
            </CardTitle>
            <CardDescription>
              Manage products fulfilled directly by suppliers without holding inventory
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDropshipRateModal(true)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Rate Card
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading dropship products...</p>
          </div>
        ) : dropshipProducts.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No dropship products</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sell products without inventory by connecting with dropship suppliers
            </p>
            <Button style={{ backgroundColor: 'var(--primary-color)' }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Dropship Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-full overflow-hidden">
            {dropshipProducts.map((product: any) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">{product.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{product.category}</p>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--primary-color)' }}>${product.price}</p>
                      <p className="text-xs text-blue-600">Supplier: {product.brand}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Native Products Tab Component
function NativeProductsTab() {
  const { data: nativeProducts = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => fetch('/api/products?type=native').then(res => res.json())
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
          Native Products
        </CardTitle>
        <CardDescription>
          Products hosted and managed directly on your platform with full inventory control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Native Products</h3>
          <p className="text-gray-600 dark:text-gray-400">
            All your standard products are managed through the existing product management system
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Multi-vendor Products Tab Component  
function MultivendorProductsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
          Multi-vendor Products
        </CardTitle>
        <CardDescription>
          Products from multiple vendors managed through the marketplace platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Multi-vendor System</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Advanced vendor management system for marketplace operations
          </p>
          <Button variant="outline" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
            Coming Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState('import');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [intelligenceProductId, setIntelligenceProductId] = useState<string | null>(null);
  const [showAmazonRatesModal, setShowAmazonRatesModal] = useState(false);
  const [showDropshipRateModal, setShowDropshipRateModal] = useState(false);
  
  // Universal connection states for all sources  
  const [sourceConnections, setSourceConnections] = useState<Record<string, boolean>>(() => {
    const defaultConnections = {
      woocommerce: true,
      shopify: false,
      amazon: false,
      aliexpress: false,
      csv_upload: true,
      custom_api: false
    };
    
    // Load from localStorage
    const saved = localStorage.getItem('sourceConnections');
    return saved ? { ...defaultConnections, ...JSON.parse(saved) } : defaultConnections;
  });

  // Polling settings state
  const [pollingSettings, setPollingSettings] = useState({
    frequency: 10000, // 10 seconds default
    enabled: true
  });

  // Sync frontend state with backend on component mount
  React.useEffect(() => {
    const syncConnectionStatus = async () => {
      try {
        const response = await fetch('/api/sources/connection-status');
        if (response.ok) {
          const backendStatus = await response.json();
          setSourceConnections(prev => ({ ...prev, ...backendStatus }));
        }
      } catch (error) {
        console.error('Failed to sync connection status:', error);
      }
    };
    
    const loadPollingSettings = async () => {
      try {
        const response = await fetch('/api/polling/settings');
        if (response.ok) {
          const settings = await response.json();
          setPollingSettings(settings);
        }
      } catch (error) {
        console.error('Failed to load polling settings:', error);
      }
    };
    
    syncConnectionStatus();
    loadPollingSettings();
  }, []);

  // Load Smart Import Settings from backend
  React.useEffect(() => {
    const loadSmartImportSettings = async () => {
      try {
        const response = await fetch('/api/smart-import/settings');
        if (response.ok) {
          const settings = await response.json();
          setAutomationRules(prev => ({
            ...prev,
            autoPricing: { 
              enabled: settings.autoPriceProducts,
              markupPercentage: settings.autoPricingMarkup || 25
            },
            autoImport: { 
              enabled: settings.autoImportToPending,
              autoSelectNew: prev.autoImport.autoSelectNew,
              batchSize: settings.autoImportBatchSize || 50,
              interval: settings.autoImportInterval || 30
            },
            autoApprove: { 
              enabled: settings.autoApproveProducts,
              priceThreshold: settings.autoApprovePriceThreshold || 50,
              ratingThreshold: settings.autoApproveRatingThreshold || 4,
              categories: prev.autoApprove.categories,
              excludeKeywords: prev.autoApprove.excludeKeywords
            },
            autoReject: { 
              enabled: settings.autoRejectProducts,
              maxPrice: settings.autoRejectMaxPrice || 1000,
              minRating: settings.autoRejectMinRating || 2,
              bannedKeywords: prev.autoReject.bannedKeywords
            },
            autoPublish: { 
              enabled: settings.autoPublishProducts,
              immediately: settings.autoPublishImmediate ?? true,
              scheduleHours: settings.autoPublishDelay || 24
            }
          }));
        }
      } catch (error) {
        console.error('Failed to load Smart Import settings:', error);
      }
    };
    
    loadSmartImportSettings();
  }, []);

  // Load Category Automation Settings from backend
  React.useEffect(() => {
    const loadCategoryAutomationSettings = async () => {
      try {
        const response = await fetch('/api/category-automation/settings');
        if (response.ok) {
          const settings = await response.json();
          setAiAutomationEnabled(settings.smartAutomationEnabled);
          setAutoApproveHigh(settings.highConfidenceEnabled);
          setHighConfidenceThreshold(settings.highConfidenceThreshold);
          setAutoPendingMedium(settings.mediumConfidenceEnabled);
          setMediumConfidenceThreshold(settings.mediumConfidenceThreshold);
          setManualReviewLow(settings.lowConfidenceEnabled);
          setLowConfidenceThreshold(settings.lowConfidenceThreshold);
        }
      } catch (error) {
        console.error('Failed to load Category Automation settings:', error);
      }
    };
    
    loadCategoryAutomationSettings();
  }, []);

  // Update polling settings
  const updatePollingSettings = async (newSettings: { frequency: number; enabled: boolean }) => {
    try {
      const response = await fetch('/api/polling/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      if (response.ok) {
        setPollingSettings(newSettings);
        toast({
          title: "Polling Settings Updated",
          description: `Frequency: ${newSettings.frequency / 1000}s, Enabled: ${newSettings.enabled}`,
        });
      }
    } catch (error) {
      console.error('Error updating polling settings:', error);
      toast({
        title: "Settings Error",
        description: "Failed to update polling settings",
        variant: "destructive",
      });
    }
  };

  const [rejectionDialog, setRejectionDialog] = useState<{ open: boolean; productId?: string }>({ open: false });
  const [categoryAutomationDialog, setCategoryAutomationDialog] = useState<{ open: boolean }>({ open: false });
  const [rejectionReason, setRejectionReason] = useState('');
  const [automationSettingsDialog, setAutomationSettingsDialog] = useState<{ open: boolean }>({ open: false });
  const [automationRules, setAutomationRules] = useState({
    autoPricing: {
      enabled: false,
      markupPercentage: 25,
    },
    autoImport: {
      enabled: false,
      autoSelectNew: true,
      batchSize: 50,
      interval: 30, // minutes
    },
    autoApprove: {
      enabled: false,
      priceThreshold: 50,
      ratingThreshold: 4,
      categories: [] as string[],
      excludeKeywords: [] as string[],
    },
    autoPublish: {
      enabled: false,
      immediately: true,
      scheduleHours: 24,
    },
    autoReject: {
      enabled: false,
      maxPrice: 1000,
      minRating: 2,
      bannedKeywords: [] as string[],
    }
  });
  const [contextualFilter, setContextualFilter] = useState(false);
  
  // Smart Import automation status
  const [automationStatus, setAutomationStatus] = useState<{
    isRunning: boolean;
    config?: {
      batchSize: number;
      intervalMinutes: number;
      startedAt: string;
    } | null;
  }>({ isRunning: false, config: null });
  
  // Polling control state
  const [realTimeUpdatesEnabled, setRealTimeUpdatesEnabled] = useState(() => {
    const saved = localStorage.getItem('realTimeUpdatesEnabled');
    return saved ? JSON.parse(saved) : true; // Default to enabled
  });
  
  // Save polling preference to localStorage when changed
  React.useEffect(() => {
    localStorage.setItem('realTimeUpdatesEnabled', JSON.stringify(realTimeUpdatesEnabled));
  }, [realTimeUpdatesEnabled]);
  
  // State for product detail modal
  const [productDetailModal, setProductDetailModal] = useState<{ 
    open: boolean; 
    product: Product | null; 
    editMode?: boolean 
  }>({ 
    open: false, 
    product: null, 
    editMode: false 
  });
  const [searchFilters, setSearchFilters] = useState({
    status: '',
    category: '',
    stockLevel: '',
    priceRange: '',
    dateAdded: ''
  });

  
  // Multi-Source Import State
  const [currentPage, setCurrentPage] = useState(1);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [importFilter, setImportFilter] = useState<'all' | 'unimported' | 'imported'>('all');
  const [importManagerStatus, setImportManagerStatus] = useState<'preview' | 'pricing' | 'pending' | 'approved' | 'published' | 'rejected' | 'quality-control' | 'dropship'>('preview');
  const [selectedSource, setSelectedSource] = useState<string>('woocommerce');

  // Enhanced Import Configuration State
  const [batchSize, setBatchSize] = useState(10);
  const [customBatchSize, setCustomBatchSize] = useState('');
  const [autoImport, setAutoImport] = useState(false);
  const [importInterval, setImportInterval] = useState(30); // minutes
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, processing: false });
  const [autoImportProgress, setAutoImportProgress] = useState({ batchesCompleted: 0, totalBatches: 0, nextBatchIn: 0 });
  
  // AI Automation Configuration State
  const [aiAutomationEnabled, setAiAutomationEnabled] = useState(false);
  const [highConfidenceThreshold, setHighConfidenceThreshold] = useState(80);
  const [mediumConfidenceThreshold, setMediumConfidenceThreshold] = useState(60);
  const [lowConfidenceThreshold, setLowConfidenceThreshold] = useState(60);
  const [autoApproveHigh, setAutoApproveHigh] = useState(false);
  const [autoPendingMedium, setAutoPendingMedium] = useState(false);
  const [manualReviewLow, setManualReviewLow] = useState(false);

  // Preview state
  const [previewProducts, setPreviewProducts] = useState<any[]>([]);
  const [selectedPreviewProducts, setSelectedPreviewProducts] = useState<string[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Pricing state
  const [selectedPricingProducts, setSelectedPricingProducts] = useState<string[]>([]);
  const [selectedImportOption, setSelectedImportOption] = useState(() => {
    // Load from localStorage or default to '20'
    const saved = localStorage.getItem('selectedImportOption');
    return saved || '20';
  });
  const [importingSelected, setImportingSelected] = useState(false);
  
  // Enhanced auto-download controls
  const [customQuantity, setCustomQuantity] = useState('');
  const [autoDownloadInterval, setAutoDownloadInterval] = useState('30'); // minutes (user selected 30 minutes)
  const [autoDownloadBatchSize, setAutoDownloadBatchSize] = useState('20'); // products per batch (default to 20 as user mentioned)
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState(false); // Set to false - auto-download should only run when explicitly enabled
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showAutoDownloadDialog, setShowAutoDownloadDialog] = useState(false);

  // Debug the dialog states
  React.useEffect(() => {
    console.log('Custom input dialog state:', showCustomInput);
  }, [showCustomInput]);

  React.useEffect(() => {
    console.log('Auto download dialog state:', showAutoDownloadDialog);
  }, [showAutoDownloadDialog]);

  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper function to format interval labels for display
  const getIntervalLabel = (minutes: string): string => {
    const min = parseInt(minutes);
    if (min === 1) return '1 Min';
    if (min === 2) return '2 Min';
    if (min === 3) return '3 Min';
    if (min < 60) return `${min} Min`;
    if (min === 60) return '1 Hr';
    if (min === 120) return '2 Hr';
    if (min === 180) return '3 Hr';
    if (min === 240) return '4 Hr';
    if (min === 360) return '6 Hr';
    if (min === 480) return '8 Hr';
    if (min === 720) return '12 Hr';
    if (min === 1440) return 'Daily';
    if (min === 2880) return '2 Days';
    if (min === 4320) return '3 Days';
    if (min === 10080) return 'Weekly';
    // For any other values, show in appropriate units
    if (min >= 1440) return `${Math.round(min / 1440)} Days`;
    if (min >= 60) return `${Math.round(min / 60)} Hr`;
    return `${min} Min`;
  };

  // Preview functions with AI categorization
  const fetchPreviewProducts = async () => {
    setPreviewLoading(true);
    try {
      const response = await fetch('/api/woocommerce/preview?per_page=100');
      const data = await response.json();
      if (data.success) {
        // Filter out already imported products from preview
        const newProducts = data.products.filter((p: any) => p.status === 'new');
        
        // Enhance products with AI categorization data and apply automation rules
        const enhancedProducts = await Promise.all(
          newProducts.map(async (product: any) => {
            try {
              // Get AI category classification for each product
              const classificationResponse = await fetch('/api/categories/hybrid/classify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  productName: product.name,
                  description: product.shortDescription || '',
                  wooCommerceCategories: [product.category],
                  brand: 'AVEENIX',
                  price: parseFloat(product.price) || 0,
                  tags: []
                }),
              });

              if (classificationResponse.ok) {
                const classification = await classificationResponse.json();
                const confidenceScore = Math.round(classification.primaryCategory?.confidence || 0);
                
                // Determine automation action based on confidence and settings
                let automationAction = 'manual';
                let suggestedStatus = 'preview';
                
                if (aiAutomationEnabled) {
                  if (confidenceScore >= highConfidenceThreshold && autoApproveHigh) {
                    automationAction = 'auto-approve';
                    suggestedStatus = 'approved';
                  } else if (confidenceScore >= mediumConfidenceThreshold && autoPendingMedium) {
                    automationAction = 'auto-pending';
                    suggestedStatus = 'pending';
                  } else if (manualReviewLow) {
                    automationAction = 'manual-review';
                    suggestedStatus = 'preview';
                  }
                }
                
                return {
                  ...product,
                  aiSuggestedCategory: classification.primaryCategory?.name,
                  confidenceScore,
                  requiresReview: classification.requiresReview || confidenceScore < mediumConfidenceThreshold,
                  aiMatchingRules: classification.matchingRules || [],
                  alternativeCategories: classification.alternativeCategories || [],
                  automationAction,
                  suggestedStatus,
                  canAutoImport: automationAction !== 'manual-review'
                };
              } else {
                // If AI classification fails, return product without AI data
                return {
                  ...product,
                  automationAction: 'manual-review',
                  suggestedStatus: 'preview',
                  canAutoImport: false
                };
              }
            } catch (error) {
              console.warn(`AI classification failed for product ${product.name}:`, error);
              return {
                ...product,
                automationAction: 'manual-review', 
                suggestedStatus: 'preview',
                canAutoImport: false
              };
            }
          })
        );

        setPreviewProducts(enhancedProducts);
        
        // Execute automated import for eligible products
        if (aiAutomationEnabled) {
          const autoApproveProducts = enhancedProducts.filter(p => p.automationAction === 'auto-approve');
          const autoPendingProducts = enhancedProducts.filter(p => p.automationAction === 'auto-pending');
          
          if (autoApproveProducts.length > 0 || autoPendingProducts.length > 0) {
            executeAutomatedImport(autoApproveProducts, autoPendingProducts);
          }
        }
        
        toast({
          title: "Products Loaded with AI Analysis",
          description: `Found ${enhancedProducts.length} new products with smart categorization (${data.products.length - newProducts.length} already imported)`,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch preview');
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      toast({
        title: "Preview Failed",
        description: error instanceof Error ? error.message : 'Failed to load preview',
        variant: "destructive",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Auto-load preview products when import manager status changes to preview  
  React.useEffect(() => {
    if (importManagerStatus === 'preview' && previewProducts.length === 0 && !previewLoading) {
      // First fetch database products with 'preview' status to check if any exist
      fetch('/api/product-management/products?status=preview')
        .then(res => res.json())
        .then(previewDbProducts => {
          if (previewDbProducts && previewDbProducts.length > 0) {
            // Convert database products to preview format and show them
            const convertedProducts = previewDbProducts.map((product: Product) => {
              // Extract best image URL from available sources
              let bestImageUrl = product.imageUrl || '';
              
              // Try to get a better image from platformSpecificData if available
              if (product.platformSpecificData?.woocommerce?.image_gallery && 
                  Array.isArray(product.platformSpecificData.woocommerce.image_gallery) && 
                  product.platformSpecificData.woocommerce.image_gallery.length > 0) {
                // Use first image from gallery that has a valid src
                const firstValidImage = product.platformSpecificData.woocommerce.image_gallery
                  .find((img: any) => img.src && img.src.startsWith('http'));
                if (firstValidImage) {
                  bestImageUrl = firstValidImage.src;
                }
              }
              
              // Fallback to fifu_image_url from meta_data if still no image
              if (!bestImageUrl && product.platformSpecificData?.woocommerce?.meta_data?.fifu_image_url) {
                bestImageUrl = product.platformSpecificData.woocommerce.meta_data.fifu_image_url;
              }
              
              return {
                wooId: product.externalId,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                shortDescription: product.description || '',
                description: product.description || '',
                category: product.category,
                imageUrl: bestImageUrl,
                rating: product.rating,
                reviewCount: product.reviewCount,
                status: 'imported', // Mark as already imported
                confidenceScore: 100, // High confidence for imported products
                aiSuggestedCategory: product.category,
                automationAction: 'imported',
                suggestedStatus: 'preview'
              };
            });
            
            console.log('[DEBUG] Converting database products to preview with enhanced images:', convertedProducts.slice(0, 2).map(p => ({ name: p.name, imageUrl: p.imageUrl })));
            setPreviewProducts(convertedProducts);
            setSelectedPreviewProducts([]);
          } else {
            // No database products, fetch from WooCommerce API
            fetchPreviewProducts();
          }
        })
        .catch(error => {
          console.error('Error fetching preview products from database:', error);
          // Fallback to WooCommerce API
          fetchPreviewProducts();
        });
    }
  }, [importManagerStatus]);

  // Fetch automation status on component mount and periodically (respects polling control)
  React.useEffect(() => {
    const fetchAutomationStatus = async () => {
      try {
        const response = await fetch('/api/woocommerce/auto-import/status');
        const data = await response.json();
        if (data.success) {
          setAutomationStatus({
            isRunning: data.isRunning,
            config: data.config
          });
        }
      } catch (error) {
        console.error('Error fetching automation status:', error);
      }
    };

    // Initial fetch
    fetchAutomationStatus();
    
    // Only set up polling if real-time updates are enabled
    if (realTimeUpdatesEnabled) {
      const interval = setInterval(fetchAutomationStatus, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [realTimeUpdatesEnabled]);

  const handleSelectPreviewProduct = (productId: string) => {
    setSelectedPreviewProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAllPreview = () => {
    // Select all products regardless of status in preview
    if (selectedPreviewProducts.length === previewProducts.length) {
      setSelectedPreviewProducts([]);
    } else {
      setSelectedPreviewProducts(previewProducts.map(p => p.wooId.toString()));
    }
  };

  const handleDownloadProducts = async () => {
    try {
      console.log('Selected import option:', selectedImportOption);
      
      if (selectedImportOption === 'auto') {
        console.log('Opening auto import dialog');
        setShowAutoDownloadDialog(true);
      } else if (selectedImportOption === 'custom') {
        console.log('Opening custom input dialog');
        setShowCustomInput(true);
      } else {
        // Handle standard quantity downloads
        const quantity = parseInt(selectedImportOption);
        console.log('Importing quantity:', quantity);
        await downloadProducts(quantity);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : 'Failed to download products',
        variant: "destructive",
      });
    }
  };

  const handleCustomImport = async () => {
    if (customQuantity && !isNaN(parseInt(customQuantity))) {
      const quantity = parseInt(customQuantity);
      await downloadProducts(quantity);
      setShowCustomInput(false);
      setCustomQuantity('');
      // Don't reset dropdown - keep user's selection
    }
  };

  const handleAutoDownloadStart = async () => {
    const intervalMs = parseInt(autoDownloadInterval) * 60 * 1000;
    const batchSize = parseInt(autoDownloadBatchSize);
    
    try {
      const response = await fetch('/api/woocommerce/auto-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          enabled: true,
          interval: intervalMs,
          batchSize: batchSize
        })
      });
      
      if (response.ok) {
        setAutoDownloadEnabled(true);
        setShowAutoDownloadDialog(false);
        // Keep the dropdown showing "auto" to indicate auto-download is active
        setSelectedImportOption('auto');
        toast({
          title: "Auto Download Started",
          description: `Background download will check for new products every ${autoDownloadInterval} minutes.`,
        });
      } else {
        throw new Error('Failed to enable auto download');
      }
    } catch (error) {
      toast({
        title: "Auto Download Failed",
        description: error instanceof Error ? error.message : 'Failed to start auto download',
        variant: "destructive",
      });
    }
  };

  const handleAutoDownloadStop = async () => {
    try {
      const response = await fetch('/api/woocommerce/auto-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: false })
      });
      
      if (response.ok) {
        setAutoDownloadEnabled(false);
        toast({
          title: "Auto Download Stopped",
          description: "Background download has been disabled.",
        });
      } else {
        throw new Error('Failed to disable auto download');
      }
    } catch (error) {
      toast({
        title: "Stop Failed",
        description: error instanceof Error ? error.message : 'Failed to stop auto download',
        variant: "destructive",
      });
    }
  };

  const downloadProducts = async (quantity: number) => {
    console.log(`Starting import of ${quantity} products...`);
    setPreviewLoading(true);
    
    try {
      // First fetch products to see what's available
      const previewResponse = await fetch('/api/woocommerce/preview');
      if (!previewResponse.ok) {
        throw new Error('Failed to fetch available products');
      }
      
      const previewData = await previewResponse.json();
      if (!previewData.success || !previewData.products) {
        throw new Error(previewData.error || 'No products available');
      }
      
      // Import the specified quantity
      const response = await fetch('/api/woocommerce/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 1,
          per_page: quantity // Use the selected quantity
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Refresh the product lists to show newly imported products
        await queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
        
        // Don't refresh from WooCommerce API after import - keep database products visible
        
        const savedCount = data.saved || 0;
        const skippedCount = data.skipped || 0;
        const importedCount = data.imported || quantity;
        
        let description;
        if (savedCount > 0 && skippedCount > 0) {
          description = `Imported ${importedCount} products. ${savedCount} new products saved, ${skippedCount} duplicates skipped.`;
        } else if (savedCount > 0) {
          description = `Imported ${importedCount} products. ${savedCount} new products saved to database.`;
        } else if (skippedCount > 0) {
          description = `Processed ${importedCount} products. All ${skippedCount} were duplicates already in preview.`;
        } else {
          description = `Processed ${importedCount} products from WooCommerce.`;
        }
        
        toast({
          title: "Products Imported Successfully",
          description: description,
        });
        
        // Switch to preview view to see imported products
        setImportManagerStatus('preview');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Failed to import products',
        variant: "destructive",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Automated import execution - saves preview products to database for Smart Import workflow processing
  const executeAutomatedImport = async (autoApproveProducts: any[], autoPendingProducts: any[]) => {
    try {
      const allProducts = [...autoApproveProducts, ...autoPendingProducts];
      
      if (allProducts.length === 0) {
        return;
      }

      // Save preview products to database with their automation actions
      const response = await fetch('/api/woocommerce/save-preview-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: allProducts.map(product => ({
            wooId: product.wooId,
            automationAction: product.automationAction
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: "Smart Automation Applied",
          description: `${data.saved} products saved to database with automation actions. Smart Import workflow will process them automatically.`,
        });

        // Update preview display to show that products have been processed
        setPreviewProducts(prev => prev.filter(p => 
          !allProducts.some(ap => ap.wooId === p.wooId)
        ));

        // Refresh the data to show new preview products in workflow
        queryClient.invalidateQueries({ queryKey: ['/api/product-management'] });
      } else {
        const errorData = await response.json();
        toast({
          title: "Automation Failed",
          description: errorData.error || "Failed to save preview products for automation",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Automation execution failed:', error);
      toast({
        title: "Automation Failed",
        description: "Smart automation encountered an error. Please check the logs.",
        variant: "destructive",
      });
    }
  };

  const importSelectedProducts = async () => {
    if (selectedPreviewProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select products to import",
        variant: "destructive",
      });
      return;
    }

    setImportingSelected(true);
    try {
      const response = await fetch('/api/woocommerce/import-selected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedProductIds: selectedPreviewProducts })
      });
      
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `${result.imported} products imported to Pending approval`,
        });
        setSelectedPreviewProducts([]);
        // Switch to Pending tab to see imported products
        setImportManagerStatus('pending');
        // Refresh preview to show updated status
        fetchPreviewProducts();
        // Invalidate pending products query
        queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
      } else {
        throw new Error(result.error || 'Import failed');
      }
    } catch (error) {
      console.error('Error importing selected products:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Failed to import products',
        variant: "destructive",
      });
    } finally {
      setImportingSelected(false);
    }
  };

  // Move products from Preview to Pricing stage
  const moveSelectedToPricing = async () => {
    if (selectedPreviewProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select products to move to pricing",
        variant: "destructive",
      });
      return;
    }

    setImportingSelected(true);
    try {
      const response = await fetch('/api/woocommerce/import-selected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          selectedProductIds: selectedPreviewProducts,
          approvalStatus: 'pricing' // Set status to pricing instead of pending
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Products Imported",
          description: `${result.imported} products moved to Pricing for review`,
        });
        setSelectedPreviewProducts([]);
        // Switch to Pricing tab to see moved products
        setImportManagerStatus('pricing');
        // Remove moved products from preview list instead of fetching fresh data
        const remainingProducts = previewProducts.filter(p => 
          !selectedPreviewProducts.includes(p.wooId.toString())
        );
        setPreviewProducts(remainingProducts);
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
        queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
      } else {
        throw new Error(result.error || 'Failed to move products');
      }
    } catch (error) {
      console.error('Error moving products to pricing:', error);
      toast({
        title: "Move Failed",
        description: error instanceof Error ? error.message : 'Failed to move products to pricing',
        variant: "destructive",
      });
    } finally {
      setImportingSelected(false);
    }
  };

  // Fetch products by approval status or all products (exclude categories tab)
  // Separate query for all products to get accurate tab counts
  const { data: allProductsForCounts = [] } = useQuery({
    queryKey: ['/api/product-management/products', 'all-for-counts'],
    queryFn: () => {
      const timestamp = Date.now();
      return fetch(`/api/product-management/products?status=all&_t=${timestamp}`, {
        headers: { 'Cache-Control': 'no-cache' }
      }).then(res => res.json()).then(data => {
        console.log(`[DEBUG Frontend] All products for counts API returned ${data.length} products`);
        return data;
      });
    },
    staleTime: 30000, // Cache for 30 seconds since this is just for counts
  });

  const { data: rawProducts = [], isLoading } = useQuery({
    queryKey: ['/api/product-management/products', activeTab, importManagerStatus],
    queryFn: () => {
      const timestamp = Date.now();
      if (activeTab === 'products') {
        return fetch(`/api/product-management/products?status=all&_t=${timestamp}`, {
          headers: { 'Cache-Control': 'no-cache' }
        }).then(res => res.json()).then(data => {
          console.log(`[DEBUG Frontend] All products API returned ${data.length} products`);
          return data;
        });
      } else if (activeTab === 'import') {
        // Handle the new pricing dropdown structure
        const queryStatus = importManagerStatus.startsWith('pricing-') ? 'pricing' : importManagerStatus;
        return fetch(`/api/product-management/products?status=${queryStatus}&_t=${timestamp}`, {
          headers: { 'Cache-Control': 'no-cache' }
        }).then(res => res.json()); // Show products based on Import Manager status tab
      } else if (activeTab === 'categories' || activeTab === 'product-types') {
        // Categories and product-types tabs don't need products data - they show management interfaces
        return [];
      } else {
        return fetch(`/api/product-management/products?status=${activeTab}&_t=${timestamp}`, {
          headers: { 'Cache-Control': 'no-cache' }
        }).then(res => res.json());
      }
    },
    enabled: activeTab !== 'categories' && activeTab !== 'product-types', // Don't fetch for management interface tabs
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
  });

  // Deduplicate products by ID to prevent duplicates in the display
  const products = React.useMemo(() => {
    if (!Array.isArray(rawProducts)) return [];
    
    const uniqueProducts = rawProducts.reduce((acc: Product[], current: Product) => {
      const exists = acc.find(item => item.id === current.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    console.log(`[DEBUG Frontend] Deduplicated ${rawProducts.length} products to ${uniqueProducts.length} unique products`);
    return uniqueProducts;
  }, [rawProducts]);

  // Fetch overview statistics - Always enabled for status dropdown
  const { data: overviewStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/product-management/overview'],
    queryFn: () => {
      const timestamp = Date.now();
      return fetch(`/api/product-management/overview?_t=${timestamp}`, {
        headers: { 'Cache-Control': 'no-cache' }
      }).then(res => res.json()).then(data => {
        console.log('[DEBUG Frontend] Overview stats received:', data);
        return data;
      });
    },
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
  });

  // Universal toggle function for any source
  // Toggle function for old WooCommerce dashboard (separate from universal system)
  const toggleSourceConnection = async (sourceId: string) => {
    const newConnectionState = !sourceConnections[sourceId];
    
    try {
      // Update backend connection status
      const response = await fetch('/api/sources/connection-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceId, connected: newConnectionState })
      });
      
      if (response.ok) {
        const newConnections = {
          ...sourceConnections,
          [sourceId]: newConnectionState
        };
        setSourceConnections(newConnections);
        localStorage.setItem('sourceConnections', JSON.stringify(newConnections));
        
        toast({
          title: `${sourceId.toUpperCase()} ${newConnectionState ? 'Connected' : 'Disconnected'}`,
          description: newConnectionState 
            ? `${sourceId.toUpperCase()} API calls are now enabled` 
            : `${sourceId.toUpperCase()} API calls are now blocked`,
        });
      } else {
        toast({
          title: "Connection Toggle Failed",
          description: "Failed to update connection status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
      toast({
        title: "Connection Error",
        description: "Failed to communicate with server",
        variant: "destructive",
      });
    }
  };

  // Get current source connection status
  const getCurrentSourceConnection = () => {
    if (selectedSource === 'all') {
      return Object.values(sourceConnections).some(connected => connected);
    }
    return sourceConnections[selectedSource] || false;
  };

  // Source-specific connection test
  const { data: connectionTest, isLoading: testLoading } = useQuery({
    queryKey: [`/api/${selectedSource}/test`],
    queryFn: () => {
      if (selectedSource === 'all') return Promise.resolve({ success: true });
      return fetch(`/api/${selectedSource}/test`).then(res => res.json());
    },
    enabled: activeTab === 'import' && getCurrentSourceConnection() && selectedSource !== 'all',
  });

  // Source-specific connection health metrics
  const { data: connectionHealth, isLoading: healthLoading } = useQuery({
    queryKey: [`/api/${selectedSource}/connection-health`],
    queryFn: () => {
      if (selectedSource === 'all') return Promise.resolve(null);
      return fetch(`/api/${selectedSource}/connection-health`).then(res => res.json());
    },
    enabled: activeTab === 'import' && connectionTest?.success && getCurrentSourceConnection() && selectedSource !== 'all',
    refetchInterval: realTimeUpdatesEnabled ? 30000 : false, // Refresh every 30 seconds when polling enabled
  });

  // Fetch products for selected source
  const { data: sourceProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: [`/api/${selectedSource}/products`, currentPage],
    queryFn: () => {
      if (selectedSource === 'all') {
        // For 'all' sources, we'll fetch from product management API with mixed sources
        return fetch(`/api/product-management/products?status=${importManagerStatus}&_t=${Date.now()}`).then(res => res.json());
      }
      return fetch(`/api/${selectedSource}/products?page=${currentPage}&per_page=10`).then(res => res.json());
    },
    enabled: activeTab === 'import' && (selectedSource === 'all' || (connectionTest?.success && getCurrentSourceConnection())),
  });

  // Fetch imported product IDs for selected source
  const { data: importedData } = useQuery({
    queryKey: [`/api/${selectedSource}/imported-ids`],
    queryFn: () => {
      if (selectedSource === 'all') return Promise.resolve({ importedIds: [] });
      return fetch(`/api/${selectedSource}/imported-ids`).then(res => res.json());
    },
    enabled: activeTab === 'import' && (selectedSource === 'all' || (connectionTest?.success && getCurrentSourceConnection())),
  });

  const importedIds = importedData?.importedIds || [];

  // Fetch master categories from hybrid category system
  const { data: masterCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories/master'],
    queryFn: () => fetch('/api/categories/master').then(res => res.json())
  });

  // Fetch subcategories
  const { data: rawSubcategories = [], isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['/api/subcategories'],
    queryFn: () => fetch('/api/subcategories').then(res => res.json())
  });

  // Deduplicate subcategories by name (since we have duplicates)
  const subcategories = rawSubcategories.reduce((acc: any[], current: any) => {
    const exists = acc.find(item => item.name === current.name && item.parentName === current.parentName);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Fetch product attributes from database
  const { data: productAttributes = [], isLoading: attributesLoading } = useQuery({
    queryKey: ['/api/product-attributes'],
    queryFn: () => fetch('/api/product-attributes').then(res => res.json()),
    enabled: activeTab === 'categories'
  });

  // State for category drill-down
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  // State for inner category management tabs
  const [categoryManagementTab, setCategoryManagementTab] = useState("categories");

  // Fetch products by category
  const { data: categoryProducts = [], isLoading: categoryProductsLoading } = useQuery({
    queryKey: ['/api/products/by-category', selectedCategory],
    queryFn: () => fetch(`/api/products/by-category/${selectedCategory}`).then(res => res.json()),
    enabled: !!selectedCategory
  });

  // Fetch products by subcategory
  const { data: subcategoryProducts = [], isLoading: subcategoryProductsLoading } = useQuery({
    queryKey: ['/api/products/by-subcategory', selectedSubcategory],
    queryFn: () => fetch(`/api/products/by-subcategory/${selectedSubcategory}`).then(res => res.json()),
    enabled: !!selectedSubcategory
  });

  // Filter WooCommerce products based on import status
  const filteredWooProducts = previewProducts.filter((product: any) => {
    const isImported = importedIds.includes(product.id?.toString() || product.wooId?.toString());
    
    if (importFilter === 'imported') return isImported;
    if (importFilter === 'unimported') return !isImported;
    return true; // 'all' - show everything
  });

  // Approval/Rejection mutations
  const approveMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      const response = await fetch('/api/product-management/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Products Approved",
        description: `Successfully approved ${data.count} products.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setSelectedProducts([]);
      setIsProcessing(false);
    },
    onError: () => {
      setIsProcessing(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ productIds, reason }: { productIds: string[]; reason: string }) => {
      const response = await fetch('/api/product-management/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds, reason }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Products Rejected",
        description: `Rejected ${data.count} products.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
      setSelectedProducts([]);
      setRejectionDialog({ open: false });
      setRejectionReason('');
      setIsProcessing(false);
    },
    onError: () => {
      setIsProcessing(false);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      console.log('[DEBUG] Publishing products:', productIds);
      const response = await fetch('/api/product-management/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[DEBUG] Publish failed:', errorData);
        throw new Error(errorData.error || 'Failed to publish products');
      }
      
      const data = await response.json();
      console.log('[DEBUG] Publish response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('[DEBUG] Publish success:', data);
      toast({
        title: "Products Published",
        description: `Successfully published ${data.count} products.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setSelectedProducts([]);
    },
    onError: (error) => {
      console.error('[DEBUG] Publish error:', error);
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to publish products.",
        variant: "destructive",
      });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      console.log('[DEBUG] Unpublishing products:', productIds);
      const response = await fetch('/api/product-management/unpublish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[DEBUG] Unpublish failed:', errorData);
        throw new Error(errorData.error || 'Failed to unpublish products');
      }
      
      const data = await response.json();
      console.log('[DEBUG] Unpublish response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('[DEBUG] Unpublish success:', data);
      toast({
        title: "Products Unpublished",
        description: `Successfully unpublished ${data.count} products and moved them back to approved status.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setSelectedProducts([]);
    },
    onError: (error) => {
      console.error('[DEBUG] Unpublish error:', error);
      toast({
        title: "Unpublishing Failed",
        description: error.message || "Failed to unpublish products.",
        variant: "destructive",
      });
    },
  });

  // WooCommerce import mutation - REMOVED: Manual imports now go through preview workflow
  // All imports (both manual and smart) now use the preview → pending → approved → published workflow

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p: Product) => p.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Enhanced WooCommerce helper functions
  const handleImport = async () => {
    // Check if we have selected preview products
    if (selectedPreviewProducts.length > 0) {
      // Import selected preview products
      setImportStatus('importing');
      setImportProgress({ current: 0, total: selectedPreviewProducts.length, processing: true });
      
      try {
        // Step 1: Save preview products with automation actions
        const selectedProducts = previewProducts.filter(p => 
          selectedPreviewProducts.includes(p.id?.toString() || p.wooId?.toString())
        ).map(p => ({
          wooId: p.wooId || p.id,
          automationAction: 'auto-approve' // Set to auto-approve for immediate processing
        }));

        const saveResponse = await fetch('/api/woocommerce/save-preview-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: selectedProducts }),
        });

        const saveResult = await saveResponse.json();
        
        if (!saveResult.success) {
          throw new Error(saveResult.error || 'Failed to save preview products');
        }

        // Step 2: Manually trigger Smart Import workflow to process them
        const processResponse = await fetch('/api/woocommerce/process-preview-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const processResult = await processResponse.json();
        
        if (processResult.success) {
          setImportStatus('success');
          toast({
            title: "Import Successful",
            description: `${processResult.processed} selected products imported and processed`,
          });
          setSelectedPreviewProducts([]);
          // Refresh preview to remove imported products and update counts
          setTimeout(() => {
            fetchPreviewProducts();
          }, 500);
          // Switch to Approved tab to see imported products
          setImportManagerStatus('approved');
          // Invalidate all queries
          queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
          queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
          queryClient.invalidateQueries({ queryKey: ['/api/woocommerce/imported-ids'] });
        } else {
          setImportStatus('error');
          toast({
            title: "Import Failed",
            description: processResult.error || "Failed to process selected products",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Import error:', error);
        setImportStatus('error');
        toast({
          title: "Import Error",
          description: "An error occurred during import",
          variant: "destructive",
        });
      }
      return;
    }

    // FIXED: Manual import now goes through preview workflow instead of bypassing it
    // First, load preview products so user can see and select what to import
    console.log('[Manual Import] Redirecting to preview workflow instead of direct import');
    setImportStatus('idle');
    
    toast({
      title: "Loading Preview",
      description: "Fetching products for preview before import...",
    });
    
    // Switch to preview mode and load products
    setImportManagerStatus('preview');
    
    // Auto-load preview products
    if (previewProducts.length === 0) {
      fetchPreviewProducts();
    } else {
      toast({
        title: "Preview Ready",
        description: `${previewProducts.length} products available for selection. Choose products to import.`,
      });
    }
  };

  // Auto-import functionality with conflict resolution
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;
    
    if (autoImport && connectionTest?.success && importStatus !== 'importing') {
      console.log(`[Auto-Import] Starting auto-import with ${importInterval} minute interval`);
      
      intervalId = setInterval(() => {
        console.log(`[Auto-Import] Triggering automatic import`);
        handleImport();
      }, importInterval * 60 * 1000); // Convert minutes to milliseconds
      
      // Update countdown every second
      countdownInterval = setInterval(() => {
        setAutoImportProgress(prev => ({
          ...prev,
          nextBatchIn: prev.nextBatchIn > 0 ? prev.nextBatchIn - 1 : importInterval * 60
        }));
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        console.log(`[Auto-Import] Cleaning up auto-import interval`);
        clearInterval(intervalId);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [autoImport, importInterval, connectionTest?.success, importStatus, customBatchSize, batchSize]);

  // Initialize auto-import countdown and reset on configuration changes
  React.useEffect(() => {
    if (autoImport) {
      setAutoImportProgress(prev => ({
        ...prev,
        nextBatchIn: importInterval * 60
      }));
      console.log(`[Auto-Import] Configuration updated - Interval: ${importInterval} minutes, Batch size: ${customBatchSize || batchSize}`);
    } else {
      setAutoImportProgress({ batchesCompleted: 0, totalBatches: 0, nextBatchIn: 0 });
    }
  }, [autoImport, importInterval, customBatchSize, batchSize]);

  // Handle import completion for auto-import tracking
  React.useEffect(() => {
    if (importStatus === 'success' && autoImport) {
      setAutoImportProgress(prev => ({
        ...prev,
        batchesCompleted: prev.batchesCompleted + 1,
        nextBatchIn: importInterval * 60
      }));
      console.log(`[Auto-Import] Batch completed. Total batches: ${autoImportProgress.batchesCompleted + 1}`);
    }
  }, [importStatus, autoImport, importInterval]);

  const getImportStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'importing':
        return <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--primary-color)' }} />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'published':
        return <Eye className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />;
      default:
        return <Clock className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)', color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'published':
        return <Badge variant="default" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)', color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>Published</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto space-y-4 overflow-x-hidden">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 border border-blue-200 dark:border-gray-600 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <Package className="w-8 h-8" style={{ color: 'var(--primary-color)' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage imported products and approval workflow with comprehensive tools
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            
            {selectedProducts.length > 0 && (
              <>
                <Button 
                  onClick={() => approveMutation.mutate(selectedProducts)}
                  disabled={approveMutation.isPending}
                  style={{ 
                    backgroundColor: 'var(--primary-color)', 
                    borderColor: 'var(--primary-color)' 
                  }}
                  className="hover:opacity-90"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve ({selectedProducts.length})
                </Button>
                
                <Button 
                  onClick={() => setRejectionDialog({ open: true })}
                  disabled={rejectMutation.isPending}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject ({selectedProducts.length})
                </Button>
                
                {(activeTab === 'approved' || importManagerStatus === 'approved') && (
                  <Button 
                    onClick={() => publishMutation.mutate(selectedProducts)}
                    disabled={publishMutation.isPending}
                    style={{ 
                      backgroundColor: 'var(--primary-color)', 
                      borderColor: 'var(--primary-color)' 
                    }}
                    className="hover:opacity-90"
                  >
                    {publishMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    Publish ({selectedProducts.length})
                  </Button>
                )}
                {(activeTab === 'published' || importManagerStatus === 'published') && (
                  <Button 
                    onClick={() => unpublishMutation.mutate(selectedProducts)}
                    disabled={unpublishMutation.isPending}
                    variant="outline"
                    style={{ 
                      borderColor: 'var(--primary-color)', 
                      color: 'var(--primary-color)' 
                    }}
                    className="hover:opacity-90"
                  >
                    {unpublishMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Archive className="w-4 h-4 mr-2" />
                    )}
                    Unpublish ({selectedProducts.length})
                  </Button>
                )}
                {(activeTab === 'rejected' || importManagerStatus === 'rejected') && (
                  <>
                    <Button 
                      onClick={() => {
                        // Bulk reconsider (move back to pending)
                        const reconsiderMutation = async () => {
                          const response = await fetch('/api/product-management/reconsider', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productIds: selectedProducts }),
                          });
                          if (response.ok) {
                            toast({
                              title: "Products Reconsidered",
                              description: `${selectedProducts.length} products moved back to pending for review.`,
                            });
                            queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                            setSelectedProducts([]);
                          }
                        };
                        reconsiderMutation();
                      }}
                      style={{ 
                        backgroundColor: 'var(--primary-color)', 
                        borderColor: 'var(--primary-color)' 
                      }}
                      className="hover:opacity-90"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reconsider ({selectedProducts.length})
                    </Button>
                    <Button 
                      onClick={() => {
                        // Bulk delete permanently
                        if (confirm(`Are you sure you want to permanently delete ${selectedProducts.length} rejected products?`)) {
                          const deleteMutation = async () => {
                            const response = await fetch('/api/product-management/delete', {
                              method: 'DELETE',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ productIds: selectedProducts }),
                            });
                            if (response.ok) {
                              toast({
                                title: "Products Deleted",
                                description: `${selectedProducts.length} products permanently removed.`,
                              });
                              queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                              setSelectedProducts([]);
                            }
                          };
                          deleteMutation();
                        }
                      }}
                      variant="destructive"
                      className="hover:opacity-90"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete ({selectedProducts.length})
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Statistics Section - Moved into Banner */}
        <div className="mt-5 pt-4 border-t border-blue-200 dark:border-gray-600">
          {isLoadingStats ? (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 min-w-[120px]">
                  <div className="animate-pulse flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-6 ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]"
                onClick={() => setActiveTab('import')}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Download className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>{overviewStats?.importedToday || 0}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Today</span>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]"
                onClick={() => setActiveTab('pending')}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>{overviewStats?.pendingProducts || 0}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Pending</span>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]"
                onClick={() => setActiveTab('approved')}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>{overviewStats?.approvedProducts || 0}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Approved</span>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]"
                onClick={() => setActiveTab('rejected')}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{overviewStats?.rejectedProducts || 0}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Rejected</span>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]"
                onClick={() => setActiveTab('published')}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Eye className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--primary-color)' }}>{overviewStats?.publishedProducts || 0}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Published</span>
                </div>
              </div>

              <div 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 sm:px-3 py-2 cursor-pointer transition-colors duration-200 min-w-[100px] sm:min-w-[120px]"
                onClick={() => setActiveTab('products')}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Package className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{overviewStats?.totalProducts || 0}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-0.5 sm:ml-1">Total Products</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>



      {/* Product Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Main Navigation Tabs - User Requested Order */}
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="product-types" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Product Types
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Categories ({Array.isArray(masterCategories) ? masterCategories.length : 0})
            </TabsTrigger>
          </TabsList>


        </div>

        {/* Product Types Tab */}
        <TabsContent value="product-types" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'affiliate', icon: ExternalLink, label: 'Affiliate', description: 'External products with commission' },
              { type: 'dropship', icon: RefreshCw, label: 'Dropship', description: 'Supplier fulfillment products' },
              { type: 'physical', icon: Package, label: 'Physical', description: 'Tangible inventory products' },
              { type: 'consumable', icon: Activity, label: 'Consumable', description: 'Products requiring replenishment' },
              { type: 'service', icon: Settings, label: 'Service', description: 'Bookings and consultations' },
              { type: 'digital', icon: Monitor, label: 'Digital', description: 'Downloads and digital content' },
              { type: 'custom', icon: Edit, label: 'Custom', description: 'Made-to-order products' },
              { type: 'multivendor', icon: Settings, label: 'Multivendor', description: 'Multiple seller products' }
            ].map((productType) => {
              const IconComponent = productType.icon;
              const { data: typeProducts = [] } = useQuery({
                queryKey: ['/api/product-management/products', productType.type],
                queryFn: () => fetch(`/api/product-management/products?status=${productType.type}`).then(res => res.json()),
                enabled: true
              });
              
              const typedProducts = Array.isArray(typeProducts) ? typeProducts : [];
              
              return (
                <Card 
                  key={productType.type}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab(productType.type)}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
                    <h3 className="font-medium">
                      {productType.label} ({typedProducts.length})
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{productType.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Individual Product Type Tabs */}
        {[
          { type: 'affiliate', icon: ExternalLink, description: 'Manage products that redirect customers to external affiliate links for commissions' },
          { type: 'dropship', icon: RefreshCw, description: 'Manage products fulfilled directly by suppliers without inventory handling' },
          { type: 'physical', icon: Package, description: 'Manage tangible products stored in your inventory for direct fulfillment' },
          { type: 'consumable', icon: Activity, description: 'Manage products that require regular replenishment and repeat purchases' },
          { type: 'service', icon: Settings, description: 'Manage bookable services, consultations, and appointment-based offerings' },
          { type: 'digital', icon: Monitor, description: 'Manage downloadable content, software, and digital products' },
          { type: 'custom', icon: Edit, description: 'Manage made-to-order products with custom specifications and personalization' },
          { type: 'multivendor', icon: Settings, description: 'Manage products from multiple sellers on your marketplace platform' }
        ].map((productTypeConfig) => {
          const { data: typeProducts = [] } = useQuery({
            queryKey: ['/api/product-management/products', productTypeConfig.type],
            queryFn: () => fetch(`/api/product-management/products?status=${productTypeConfig.type}`).then(res => res.json()),
            enabled: true
          });
          
          const typedProducts = Array.isArray(typeProducts) ? typeProducts : [];
          const typeLabel = productTypeConfig.type.charAt(0).toUpperCase() + productTypeConfig.type.slice(1);
          const IconComponent = productTypeConfig.icon;
          
          return (
            <TabsContent key={productTypeConfig.type} value={productTypeConfig.type} className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <IconComponent className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                    {typeLabel} Products ({typedProducts.length})
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {productTypeConfig.description}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('product-types')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Product Types
                </Button>
              </div>

              {/* Product List */}
              {typedProducts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No {typeLabel.toLowerCase()} products found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No {typeLabel.toLowerCase()} products have been imported yet.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('import')}
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Import Products
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typedProducts.map((product: any) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={product.imageUrl || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1 truncate">{product.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{product.category}</p>
                            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--primary-color)' }}>
                              ${product.price}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(product.approvalStatus)}
                              <Badge variant="outline" className="text-xs">
                                {product.sourcePlatform}
                              </Badge>
                            </div>
                            {product.productType === 'affiliate' && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Commission: 0.00%
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">All Products ({products.length})</h2>
              <p className="text-gray-600 dark:text-gray-400">View and manage all products in your store</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search products..."
                  className="w-64"
                />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  console.log('Add Product button clicked - redirecting to import');
                  setActiveTab('import');
                  toast({ title: "Import Products", description: "Use the Import tab to add products from WooCommerce or other sources" });
                }}
                style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Consolidated Select All Bar with Bulk Actions */}
          {products.length > 0 && (
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedProducts.length > 0 
                    ? `${selectedProducts.length} product(s) selected`
                    : `Select All (0 of ${products.length})`
                  }
                </span>
              </div>
              
              {/* Bulk Action Buttons - Only show when products are selected */}
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Bulk Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedProducts([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Product List */}
          {isLoading ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="ml-2">Loading products...</span>
                </div>
              </CardContent>
            </Card>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start building your store by adding your first product
                </p>
                <Button 
                  onClick={() => {
                    console.log('Add First Product button clicked - redirecting to import');
                    setActiveTab('import');
                    toast({ title: "Import Products", description: "Use the Import tab to add products from WooCommerce or other sources" });
                  }}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {products.map((product: Product, index: number) => {
                console.log(`[DEBUG Render] Product ${index}: ${product.id} - ${product.name}`);
                return (
                <Card key={`${product.id}-${index}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                      <img
                        src={product.imageUrl || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1 truncate">{product.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{product.category}</p>
                            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--primary-color)' }}>
                              ${typeof product.price === 'string' ? product.price : '0.00'}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant={product.approvalStatus === 'published' ? 'default' : 
                                            product.approvalStatus === 'approved' ? 'secondary' : 
                                            product.approvalStatus === 'pending' ? 'outline' : 'destructive'}>
                                {product.approvalStatus}
                              </Badge>
                              {product.productType && (
                                <Badge variant="outline" className="text-xs">
                                  {product.productType}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setProductDetailModal({ open: true, product, editMode: false })}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setProductDetailModal({ open: true, product, editMode: true })}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setProductDetailModal({ open: true, product, editMode: true })}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setProductDetailModal({ open: true, product, editMode: false })}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Package className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Product
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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


        </TabsContent>

        {/* Affiliate Products Tab */}
        <TabsContent value="affiliate" className="space-y-5">
          <AffiliateProductsTab />
        </TabsContent>

        {/* Dropship Products Tab */}
        <TabsContent value="dropship" className="space-y-5">
          <DropshipProductsTab />
        </TabsContent>

        {/* Physical Products Tab */}
        <TabsContent value="physical" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                Physical Products
              </CardTitle>
              <CardDescription>
                Tangible products that require inventory management and shipping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Physical Products</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage physical inventory, shipping, and fulfillment for tangible products
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumable Products Tab */}
        <TabsContent value="consumable" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                Consumable Products
              </CardTitle>
              <CardDescription>
                Products that are used up and need regular replenishment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Consumable Products</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage consumables with expiration dates and automatic reorder points
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Products Tab */}
        <TabsContent value="service" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                Service Products
              </CardTitle>
              <CardDescription>
                Service-based offerings like consultations, appointments, and bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Service Products</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage service bookings, appointments, and consultation packages
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital Products Tab */}
        <TabsContent value="digital" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                Digital Products
              </CardTitle>
              <CardDescription>
                Digital downloads, software, courses, and virtual products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Digital Products</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage digital downloads, licensing, and automated delivery
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Products Tab */}
        <TabsContent value="custom" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                Custom Products
              </CardTitle>
              <CardDescription>
                Made-to-order products with customization options and specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Edit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Custom Products</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage custom orders, specifications, and personalized products
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-vendor Products Tab */}
        <TabsContent value="multivendor" className="space-y-5">
          <MultivendorProductsTab />
        </TabsContent>



        {/* Import Tab */}
        <TabsContent value="import" className="space-y-5">


          

          {/* Dynamic Import Page - Shows imported products or empty state */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                    Import Manager
                  </CardTitle>
                  <CardDescription>
                    Manage product lifecycle from import to publication
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  {/* Source Selector */}
                  {/* Unified Source & Connection Manager */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <span className="text-sm">Source:</span>
                        <span className="font-medium">{selectedSource === 'woocommerce' ? 'WooCommerce' : selectedSource}</span>
                        <div className={`w-2 h-2 rounded-full ${getCurrentSourceConnection() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-gray-500">
                          {getCurrentSourceConnection() ? 'Connected' : 'Disconnected'}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <div className="px-3 py-2 border-b">
                        <h4 className="font-medium text-sm">Source Management</h4>
                        <p className="text-xs text-gray-500">Select source and manage connection</p>
                      </div>
                      
                      {/* Source Selection */}
                      <div className="px-3 py-2">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Active Source</label>
                        <Select value={selectedSource} onValueChange={setSelectedSource}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="woocommerce">WooCommerce</SelectItem>
                            <SelectItem value="shopify">Shopify</SelectItem>
                            <SelectItem value="amazon">Amazon</SelectItem>
                            <SelectItem value="aliexpress">AliExpress</SelectItem>
                            <SelectItem value="csv_upload">CSV Upload</SelectItem>
                            <SelectItem value="custom_api">Custom API</SelectItem>
                            <SelectItem value="all">All Sources</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Connection Management */}
                      <DropdownMenuItem 
                        onClick={() => toggleSourceConnection(selectedSource)}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getCurrentSourceConnection() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm">Connection Status</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {getCurrentSourceConnection() ? 'Connected' : 'Disconnected'}
                          </span>
                          <Switch
                            checked={getCurrentSourceConnection()}
                            onCheckedChange={() => toggleSourceConnection(selectedSource)}
                            className="scale-75"
                          />
                        </div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Polling Frequency Settings */}
                      <div className="px-3 py-2">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">Polling Frequency</label>
                        <Select 
                          value={pollingSettings.frequency.toString()} 
                          onValueChange={(value) => updatePollingSettings({ 
                            ...pollingSettings, 
                            frequency: parseInt(value) 
                          })}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10000">10 seconds</SelectItem>
                            <SelectItem value="30000">30 seconds</SelectItem>
                            <SelectItem value="60000">1 minute</SelectItem>
                            <SelectItem value="300000">5 minutes</SelectItem>
                            <SelectItem value="1800000">30 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <DropdownMenuSeparator />
                      
                      {/* All API Connection Status */}
                      <div className="px-3 py-2">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">API Connections</label>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>WooCommerce</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${sourceConnections.woocommerce ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-gray-500">{sourceConnections.woocommerce ? 'Connected' : 'Disconnected'}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Shopify</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${sourceConnections.shopify ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-gray-500">{sourceConnections.shopify ? 'Connected' : 'Disconnected'}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Amazon</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${sourceConnections.amazon ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-gray-500">{sourceConnections.amazon ? 'Connected' : 'Disconnected'}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>AliExpress</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${sourceConnections.aliexpress ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-gray-500">{sourceConnections.aliexpress ? 'Connected' : 'Disconnected'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!getCurrentSourceConnection() && (
                        <div className="px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t">
                          <p className="text-xs text-yellow-700 dark:text-yellow-300">
                            <Info className="w-3 h-3 inline mr-1" />
                            API calls are blocked when disconnected
                          </p>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Two Line Status: Connection + Detailed Metrics */}
              <div className="mt-4">
                {/* First Line: Connection Status */}
                <div className="flex items-center gap-2 text-sm mb-2">
                  {!getCurrentSourceConnection() ? (
                    <>
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        {selectedSource === 'all' ? 'No Sources Connected' : `${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} Disconnected`}
                      </span>
                    </>
                  ) : selectedSource === 'all' ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Multiple Sources Active</span>
                    </>
                  ) : connectionHealth ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} Connected
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-red-600">
                        {selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} Disconnected
                      </span>
                    </>
                  )}
                </div>

                {/* Second Line: Detailed Metrics + Import Controls */}
                <div className="flex items-center justify-between gap-4 text-sm">
                  {/* Detailed Status Metrics - Compact Card Layout */}
                  <div className="flex items-center gap-1.5 flex-wrap xl:flex-nowrap">
                    {!getCurrentSourceConnection() ? (
                      <div className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-medium">
                          {selectedSource === 'all' ? 'Connect sources to see metrics.' : `${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} disconnected`}
                        </span>
                      </div>
                    ) : selectedSource === 'all' ? (
                      <div className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md border border-blue-200 dark:border-blue-700">
                        <span className="text-xs font-medium">All sources active</span>
                      </div>
                    ) : connectionHealth && (
                      <>
                        {/* Response Time Card */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Response Time:</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            connectionHealth.responseTime < 1000 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                              : connectionHealth.responseTime < 2000
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {connectionHealth.responseTime}ms
                          </span>
                        </div>

                        {/* Last Sync Card */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Last Sync:</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {new Date(connectionHealth.lastSync).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </span>
                        </div>

                        {/* Uptime Card */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Uptime (24h):</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            parseFloat(connectionHealth.uptime) > 95 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                              : parseFloat(connectionHealth.uptime) > 80
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {connectionHealth.uptime}%
                          </span>
                        </div>

                        {/* API Rate Limit Card */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                          <span className="text-xs text-gray-500 dark:text-gray-400">API Rate Limit:</span>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {connectionHealth.requestCount || 0}/{connectionHealth.requestLimit || 1000}
                          </span>
                        </div>

                        {/* Ready Status Card */}
                        <div className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-700">
                          <span className="text-xs font-medium">Ready to Import</span>
                        </div>
                      </>
                    )}

                    {/* Auto-Download Status - Integrated with other cards */}
                    {autoDownloadEnabled && selectedImportOption === 'auto' && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-700">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">Auto-Download Active: {autoDownloadBatchSize} products every {getIntervalLabel(autoDownloadInterval)}</span>
                      </div>
                    )}
                  </div>

                  {/* Import Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Import:</span>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <select 
                        className="px-3 py-2 text-sm border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-w-[140px] h-9 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        value={selectedImportOption}
                        onChange={(e) => {
                          console.log('Import option changed to:', e.target.value);
                          setSelectedImportOption(e.target.value);
                          // Save to localStorage to persist selection
                          localStorage.setItem('selectedImportOption', e.target.value);
                          
                          // Immediately open dialog for custom and auto options
                          if (e.target.value === 'custom') {
                            console.log('Opening custom dialog immediately');
                            setShowCustomInput(true);
                          } else if (e.target.value === 'auto') {
                            console.log('Opening auto dialog immediately');
                            setShowAutoDownloadDialog(true);
                          }
                        }}
                      >
                        <option value="10">10 Products</option>
                        <option value="20">20 Products</option>
                        <option value="50">50 Products</option>
                        <option value="100">100 Products</option>
                        <option value="custom">Custom...</option>
                        <option value="auto">Auto (Every {getIntervalLabel(autoDownloadInterval)})</option>
                      </select>
                      <Button
                        className="h-9 px-4 text-sm font-medium whitespace-nowrap hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                        onClick={handleDownloadProducts}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {selectedImportOption === 'auto' ? 'Start Auto Download' : 'Download Products'}
                      </Button>

                    </div>
                  </div>
                </div>
              </div>

              {/* Status Tabs for Import Manager */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button
                    variant={importManagerStatus === 'preview' ? 'default' : 'outline'}
                    className={`h-9 px-4 text-sm font-medium ${importManagerStatus === 'preview' ? 'text-white' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}
                    onClick={() => setImportManagerStatus('preview')}
                    style={importManagerStatus === 'preview' ? { backgroundColor: 'var(--primary-color)' } : { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview ({previewProducts.length})
                  </Button>
                  {/* Pricing Dropdown with Product Types */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={importManagerStatus.startsWith('pricing') ? 'default' : 'outline'}
                        className={`h-9 px-4 text-sm font-medium ${importManagerStatus.startsWith('pricing') ? 'text-white' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}
                        style={importManagerStatus.startsWith('pricing') ? { backgroundColor: 'var(--primary-color)' } : { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        {importManagerStatus === 'pricing' 
                          ? `Pricing (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing').length})`
                          : importManagerStatus === 'pricing-affiliate'
                          ? `Affiliate (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'affiliate').length})`
                          : importManagerStatus === 'pricing-dropship'
                          ? `Dropship (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'dropship').length})`
                          : importManagerStatus === 'pricing-physical'
                          ? `Physical (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'physical').length})`
                          : importManagerStatus === 'pricing-consumable'
                          ? `Consumable (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'consumable').length})`
                          : importManagerStatus === 'pricing-service'
                          ? `Service (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'service').length})`
                          : importManagerStatus === 'pricing-digital'
                          ? `Digital (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'digital').length})`
                          : importManagerStatus === 'pricing-custom'
                          ? `Custom (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'custom').length})`
                          : importManagerStatus === 'pricing-multivendor'
                          ? `Multivendor (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'multivendor').length})`
                          : `Pricing (${allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing').length})`
                        }
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-affiliate')}
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Affiliate
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'affiliate').length})
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-dropship')}
                        className="flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        Dropship
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'dropship').length})
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-physical')}
                        className="flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        Physical
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'physical').length})
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-consumable')}
                        className="flex items-center gap-2"
                      >
                        <Activity className="w-4 h-4" />
                        Consumable
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'consumable').length})
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-service')}
                        className="flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Service
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'service').length})
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-digital')}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="w-4 h-4" />
                        Digital
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'digital').length})
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-custom')}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Custom
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'custom').length})
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setImportManagerStatus('pricing-multivendor')}
                        className="flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4" />
                        Multivendor
                        <span className="text-xs text-gray-500 ml-auto">
                          ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pricing' && p.productType === 'multivendor').length})
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant={importManagerStatus === 'pending' ? 'default' : 'outline'}
                    className={`h-9 px-4 text-sm font-medium ${importManagerStatus === 'pending' ? 'text-white' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}
                    onClick={() => setImportManagerStatus('pending')}
                    style={importManagerStatus === 'pending' ? { backgroundColor: 'var(--primary-color)' } : { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'pending').length})
                  </Button>
                  <Button
                    variant={importManagerStatus === 'rejected' ? 'default' : 'outline'}
                    className={`h-9 px-4 text-sm font-medium ${importManagerStatus === 'rejected' ? 'text-white' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}
                    onClick={() => setImportManagerStatus('rejected')}
                    style={importManagerStatus === 'rejected' ? { backgroundColor: 'var(--primary-color)' } : { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejected ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'rejected').length})
                  </Button>
                  <Button
                    variant={importManagerStatus === 'approved' ? 'default' : 'outline'}
                    className={`h-9 px-4 text-sm font-medium ${importManagerStatus === 'approved' ? 'text-white' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}
                    onClick={() => setImportManagerStatus('approved')}
                    style={importManagerStatus === 'approved' ? { backgroundColor: 'var(--primary-color)' } : { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approved ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'approved').length})
                  </Button>
                  <Button
                    variant={importManagerStatus === 'published' ? 'default' : 'outline'}
                    className={`h-9 px-4 text-sm font-medium ${importManagerStatus === 'published' ? 'text-white' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}
                    onClick={() => setImportManagerStatus('published')}
                    style={importManagerStatus === 'published' ? { backgroundColor: 'var(--primary-color)' } : { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Published ({allProductsForCounts.filter((p: Product) => p.approvalStatus === 'published').length})
                  </Button>

                </div>
                
                {/* Settings Dropdown - moved from header to status filter line */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 px-4 text-sm font-medium flex items-center gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      style={{
                        borderColor: 'var(--primary-color)',
                        color: 'var(--primary-color)'
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setAutomationSettingsDialog({ open: true });
                      }}
                      className="flex items-center gap-2"
                    >
                      <Brain className="w-4 h-4" />
                      Product Automation
                      <span className="text-xs text-gray-500 ml-auto">Ctrl+A</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCategoryAutomationDialog({ open: true });
                      }}
                      className="flex items-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Category Automation
                      <span className="text-xs text-gray-500 ml-auto">Ctrl+C</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        console.log('Quality Control clicked! Setting status to quality-control');
                        console.log('Current importManagerStatus:', importManagerStatus);
                        // Show Quality Control in Import Manager content area
                        setImportManagerStatus('quality-control');
                        console.log('Status set to quality-control');
                      }}
                      className="flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Quality Control
                      <span className="text-xs text-gray-500 ml-auto">Ctrl+Q</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      disabled
                      className="flex items-center gap-2 opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      Import Configuration
                      <span className="text-xs text-gray-400 ml-auto">Soon</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={async () => {
                        try {
                          const currentStatus = importManagerStatus;
                          const response = await fetch(`/api/product-management/export/csv?status=${currentStatus}`);
                          if (response.ok) {
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = `aveenix-products-${currentStatus}-${new Date().toISOString().split('T')[0]}.csv`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            toast({
                              title: "Export Successful",
                              description: `Products exported to CSV file`,
                            });
                          } else {
                            throw new Error('Export failed');
                          }
                        } catch (error) {
                          toast({
                            title: "Export Failed",
                            description: error instanceof Error ? error.message : 'Failed to export products',
                            variant: "destructive",
                          });
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export to CSV
                      <span className="text-xs text-gray-500 ml-auto">Ctrl+E</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full">
              {(() => {
                console.log('Import Manager Status:', importManagerStatus);
                
                // Handle Quality Control mode FIRST
                if (importManagerStatus === 'quality-control') {
                  console.log('✅ Quality Control mode activated!');
                  return (
                    <div className="space-y-4">
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">🛡️ Quality Control Dashboard</h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Comprehensive quality control system for product validation and filtering
                        </p>
                      </div>
                      <QualityControlSettings />
                    </div>
                  );
                }

                // Handle Pricing mode (both general pricing and specific product types)
                if (importManagerStatus === 'pricing' || importManagerStatus.startsWith('pricing-')) {
                  let pricingProducts = products.filter((product: Product) => 
                    product.approvalStatus === 'pricing'
                  );
                  
                  // Filter by specific product type if selected
                  if (importManagerStatus.startsWith('pricing-')) {
                    const productType = importManagerStatus.replace('pricing-', '');
                    pricingProducts = pricingProducts.filter((product: Product) => 
                      product.productType === productType
                    );
                  }
                  
                  console.log('[DEBUG] Pricing products filter:', {
                    totalProducts: products.length,
                    pricingProducts: pricingProducts.length,
                    importManagerStatus: importManagerStatus,
                    sampleProduct: pricingProducts[0] ? {
                      id: pricingProducts[0].id,
                      approvalStatus: pricingProducts[0].approvalStatus,
                      productType: pricingProducts[0].productType,
                      sourcePlatform: pricingProducts[0].sourcePlatform
                    } : 'none'
                  });

                  return (
                    <div className="space-y-4">
                      <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
                          💰 Pricing Management
                          {importManagerStatus.startsWith('pricing-') && (
                            <span className="ml-2 text-sm font-normal opacity-75">
                              - {importManagerStatus.replace('pricing-', '').charAt(0).toUpperCase() + importManagerStatus.replace('pricing-', '').slice(1)} Products
                            </span>
                          )}
                        </h3>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          {importManagerStatus === 'pricing-dropship' 
                            ? 'Set cost prices and profit margins for dropship products with cost-based calculations.'
                            : importManagerStatus === 'pricing-affiliate'
                            ? 'Configure commission rates and pricing strategies for affiliate products.'
                            : 'Set cost prices, retail prices, and profit margins for your products before moving to pending approval.'
                          }
                        </p>
                      </div>

                      {pricingProducts.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 flex items-center justify-center">
                            <Tag className="w-10 h-10 text-green-600 dark:text-green-300" />
                          </div>
                          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                            No Products in Pricing Stage
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Products from the Preview stage will appear here when ready for pricing management.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Selection Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Toggle select all pricing products
                                  const allSelected = selectedPricingProducts.length === pricingProducts.length;
                                  if (allSelected) {
                                    setSelectedPricingProducts([]);
                                  } else {
                                    setSelectedPricingProducts(pricingProducts.map(p => p.id));
                                  }
                                }}
                              >
                                {selectedPricingProducts.length === pricingProducts.length ? 'Deselect All' : 'Select All'}
                              </Button>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedPricingProducts.length} of {pricingProducts.length} products selected
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Bulk Actions:
                              </span>
                              {/* Only show Amazon Rates for affiliate products */}
                              {importManagerStatus !== 'pricing-dropship' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                  onClick={() => setShowAmazonRatesModal(true)}
                                >
                                  <Database className="w-4 h-4 mr-1" />
                                  Amazon Rates
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                disabled={selectedPricingProducts.length === 0}
                                onClick={() => {
                                  toast({
                                    title: "Bulk Pricing",
                                    description: "Bulk pricing actions will be implemented",
                                  });
                                }}
                              >
                                <Tag className="w-4 h-4 mr-1" />
                                Apply Markup %
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                disabled={selectedPricingProducts.length === 0}
                                onClick={async () => {
                                  if (selectedPricingProducts.length === 0) return;
                                  
                                  try {
                                    const response = await fetch('/api/product-management/bulk-update-status', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        productIds: selectedPricingProducts,
                                        newStatus: 'pending'
                                      })
                                    });
                                    
                                    const result = await response.json();
                                    if (result.success) {
                                      toast({
                                        title: "Products Moved",
                                        description: `${selectedPricingProducts.length} products moved to Pending`,
                                      });
                                      setSelectedPricingProducts([]);
                                      // Switch to Pending tab
                                      setImportManagerStatus('pending');
                                      // Refresh data
                                      queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                                      queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
                                    } else {
                                      throw new Error(result.error || 'Failed to move products');
                                    }
                                  } catch (error) {
                                    console.error('Error moving products to pending:', error);
                                    toast({
                                      title: "Move Failed",
                                      description: error instanceof Error ? error.message : 'Failed to move products to pending',
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Move to Pending
                              </Button>
                            </div>
                          </div>

                          {/* Products Grid */}
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pricingProducts.map((product: any) => (
                              <Card key={product.id} className="border-green-200 dark:border-green-800">
                                <CardContent className="p-4">
                                  {/* Compact horizontal product info at top */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedPricingProducts.includes(product.id)}
                                      onChange={() => {
                                        if (selectedPricingProducts.includes(product.id)) {
                                          setSelectedPricingProducts(prev => prev.filter(id => id !== product.id));
                                        } else {
                                          setSelectedPricingProducts(prev => [...prev, product.id]);
                                        }
                                      }}
                                      className="flex-shrink-0"
                                    />
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.name}
                                      className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&auto=format';
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm line-clamp-1 mb-1">
                                        {product.name}
                                      </h4>
                                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                        <span>${product.price}</span>
                                        <span>{product.category}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Full-width calculator section */}
                                  <div className="space-y-2">
                                        {/* Conditional Layout Based on Product Type */}
                                        {product.sourcePlatform === 'amazon' || product.productType === 'affiliate' ? (
                                          // Affiliate Product Layout - Commission Calculator Only
                                          <div className="w-full">
                                            <CommissionCalculator
                                              productId={product.id}
                                              productName={product.name}
                                              productPrice={parseFloat(product.price) || 0}
                                              category={product.category}
                                              productType="affiliate"
                                              onSave={(data) => {
                                                if (data.commissionRate !== undefined) {
                                                  console.log(`Commission rate updated to ${data.commissionRate}% for product ${product.id}`);
                                                }
                                                // Refresh product data after update
                                                queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          // Dropshipping Product Layout - Calculator Only
                                          <div className="w-full">
                                            <CommissionCalculator
                                              productId={product.id}
                                              productName={product.name}
                                              productPrice={parseFloat(product.price) || 0}
                                              category={product.category}
                                              productType="dropship"
                                              costPrice={product.costPrice ? parseFloat(product.costPrice) : undefined}
                                              onSave={(data) => {
                                                if (data.costPrice !== undefined) {
                                                  console.log(`Cost price updated to $${data.costPrice} for product ${product.id}`);
                                                }
                                                // Refresh product data after update
                                                queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                                              }}
                                            />
                                          </div>
                                        )}
                                        
                                    {/* Action Buttons */}
                                    <div className="flex gap-1 mt-2">
                                      <Button 
                                        size="sm" 
                                        className="flex-1 h-7 text-xs"
                                        style={{ backgroundColor: 'var(--primary-color)' }}
                                        onClick={() => {
                                          // TODO: Save pricing and move to pending
                                          toast({
                                            title: "Saved",
                                            description: `Pricing saved for ${product.name}`,
                                          });
                                        }}
                                      >
                                        Save & Move
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Handle Preview mode separately - content changes based on selected source
                if (importManagerStatus === 'preview') {
                  // CSV Upload Interface
                  if (selectedSource === 'csv_upload') {
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold">CSV Product Upload</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Upload and preview products from CSV files before importing
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              onClick={() => {
                                // Handle CSV upload
                                console.log('CSV Upload clicked');
                              }}
                              style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload CSV File
                            </Button>
                          </div>
                        </div>
                        
                        {/* CSV Upload Area */}
                        <div 
                          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/20');
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/20');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/20');
                            const files = e.dataTransfer.files;
                            if (files.length > 0) {
                              const file = files[0];
                              if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                                console.log('Dropped file:', file.name);
                                toast({
                                  title: "File Dropped",
                                  description: `Selected file: ${file.name}. Upload functionality coming soon.`,
                                });
                              } else {
                                toast({
                                  title: "Invalid File Type",
                                  description: "Please upload a CSV or Excel file.",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                          onClick={() => {
                            document.getElementById('csv-file-input')?.click();
                          }}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium mb-2">Upload CSV Product File</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Drag and drop your CSV file here, or click to browse
                          </p>
                          <div className="flex justify-center gap-2">
                            <input
                              type="file"
                              accept=".csv,.xlsx,.xls"
                              style={{ display: 'none' }}
                              id="csv-file-input"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  console.log('Selected file:', file.name);
                                  // TODO: Implement file upload logic
                                  toast({
                                    title: "File Selected",
                                    description: `Selected file: ${file.name}. Upload functionality coming soon.`,
                                  });
                                }
                              }}
                            />
                            <Button 
                              variant="outline"
                              onClick={() => {
                                document.getElementById('csv-file-input')?.click();
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => {
                                // Download CSV template
                                window.open('/api/csv-template', '_blank');
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Template
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-4">
                            Supported formats: CSV, Excel (.xlsx). Maximum file size: 10MB
                          </p>
                        </div>
                        
                        {/* CSV Format Guide */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">CSV Format Requirements</h4>
                          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <p>• Required columns: name, price, description, category</p>
                            <p>• Optional columns: sku, stock_quantity, weight, dimensions, images</p>
                            <p>• Image URLs should be comma-separated if multiple</p>
                            <p>• Categories should match existing categories or will be auto-created</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // WooCommerce Preview (default)
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {selectedSource === 'woocommerce' ? 'WooCommerce Product Preview' :
                             selectedSource === 'shopify' ? 'Shopify Product Preview' :
                             selectedSource === 'amazon' ? 'Amazon Product Preview' :
                             selectedSource === 'aliexpress' ? 'AliExpress Product Preview' :
                             selectedSource === 'custom_api' ? 'Custom API Product Preview' :
                             'Product Preview'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Preview and select products from {selectedSource === 'woocommerce' ? 'WooCommerce' :
                                                            selectedSource === 'shopify' ? 'Shopify' :
                                                            selectedSource === 'amazon' ? 'Amazon' :
                                                            selectedSource === 'aliexpress' ? 'AliExpress' :
                                                            selectedSource === 'custom_api' ? 'your custom API' :
                                                            'your selected source'} before importing
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Smart Import Automation Status Indicator */}
                          {automationStatus.isRunning && automationStatus.config && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                                Auto-importing {automationStatus.config.batchSize} product{automationStatus.config.batchSize > 1 ? 's' : ''} every {automationStatus.config.intervalMinutes} min
                              </span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => {
                                if (selectedPreviewProducts.length > 0) {
                                  moveSelectedToPricing(); // Go directly to Pricing, not Pending
                                } else {
                                  fetchPreviewProducts();
                                }
                              }}
                              disabled={previewLoading || importingSelected}
                              style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              {previewLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : importingSelected ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : selectedPreviewProducts.length > 0 ? (
                                <Tag className="w-4 h-4 mr-2" />
                              ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                              )}
                              {selectedPreviewProducts.length > 0 
                                ? `Import Selected (${selectedPreviewProducts.length})`
                                : 'Import Products'
                              }
                            </Button>
                            
                            {/* Smart Import Button - Opens Automation Settings first */}
                            {aiAutomationEnabled && previewProducts.length > 0 && (
                              <Button 
                                onClick={() => {
                                  // Auto-enable Auto-Import when accessed through Smart Import
                                  setAutomationRules(prev => ({
                                    ...prev,
                                    autoImport: {
                                      ...prev.autoImport,
                                      enabled: true,
                                      batchSize: 1, // Set default to 1 product
                                      interval: 1   // Set default to 1 minute
                                    }
                                  }));
                                  // Open Automation Settings dialog
                                  setAutomationSettingsDialog({ open: true });
                                }}
                                disabled={previewLoading || isProcessing}
                                variant="outline"
                                className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30"
                              >
                                <Brain className="w-4 h-4 mr-2" />
                                Smart Import ({overviewStats?.smartImportCount || previewProducts.filter(p => p.automationAction && p.automationAction !== 'manual-review').length})
                              </Button>
                            )}
                          </div>
                          {selectedPreviewProducts.length > 0 && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedPreviewProducts.length} products selected to move to Pricing.
                            </div>
                          )}
                        </div>
                      </div>

                      {previewProducts.length > 0 && (
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSelectAllPreview}
                            >
                              {selectedPreviewProducts.length === previewProducts.length ? 'Deselect All' : 'Select All'}
                            </Button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedPreviewProducts.length} of {previewProducts.length} products selected
                            </span>
                          </div>
                        </div>
                      )}

                      {previewLoading ? (
                        <div className="text-center py-16">
                          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: 'var(--primary-color)' }} />
                          <p className="text-gray-600 dark:text-gray-400">Loading products from WooCommerce...</p>
                        </div>
                      ) : previewProducts.length === 0 ? (
                        <div className="text-center py-16">
                          <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium mb-2">Loading preview...</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Fetching WooCommerce products for preview and selection.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {previewProducts.map((product: any) => (
                            <Card key={product.wooId} className="hover:shadow-md transition-shadow preview-product-card">
                              <CardContent className="card-content">
                                {/* Header Section with Checkbox and Image */}
                                <div className="flex items-start gap-3 preview-product-header">
                                  <input
                                    type="checkbox"
                                    checked={selectedPreviewProducts.includes(product.wooId.toString())}
                                    onChange={() => handleSelectPreviewProduct(product.wooId.toString())}
                                    className="mt-1 flex-shrink-0"
                                  />
                                  <img
                                    src={
                                      product.image || 
                                      product.featuredImage || 
                                      (product.images && product.images.length > 0 ? product.images[0].src : null) ||
                                      "/api/placeholder/64/64"
                                    }
                                    alt={product.name}
                                    className="preview-product-image"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/api/placeholder/64/64";
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{product.category}</p>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
                                      ${product.price}
                                    </p>
                                  </div>
                                </div>

                                {/* Body Section - Variable Content */}
                                <div className="preview-product-body">
                                  {/* AI Category Suggestion Section - Ultra Compact */}
                                  {product.aiSuggestedCategory && (
                                    <div className="preview-ai-suggestion bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-1">
                                      <div className="flex items-center justify-between gap-1">
                                        <div className="flex items-center gap-1">
                                          <Brain className="w-3 h-3 text-blue-600" />
                                          <span className="text-xs font-medium text-blue-800 dark:text-blue-200">AI</span>
                                          <Badge 
                                            variant="outline" 
                                            className={`text-xs px-1 py-0 h-auto ${
                                              product.confidenceScore >= 80 ? 'bg-green-100 text-green-800 border-green-300' :
                                              product.confidenceScore >= 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                              'bg-red-100 text-red-800 border-red-300'
                                            }`}
                                          >
                                            {product.confidenceScore >= 80 ? 'High' : 
                                             product.confidenceScore >= 60 ? 'Med' : 'Low'}
                                          </Badge>
                                        </div>
                                        {product.requiresReview && <AlertTriangle className="w-3 h-3 text-orange-500" />}
                                      </div>
                                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium line-clamp-1 mt-1">
                                        → {product.aiSuggestedCategory}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Footer Section - Fixed Bottom */}
                                <div className="preview-product-footer">
                                  <div className="flex items-center gap-1 flex-wrap mb-1">
                                    <Badge 
                                      variant={product.status === 'new' ? 'default' : product.status === 'updated' ? 'secondary' : 'outline'}
                                      className="text-xs px-1.5 py-0.5 h-auto"
                                    >
                                      {product.status === 'new' ? 'New' : product.status === 'updated' ? 'Updated' : 'Downloaded'}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                                      {product.type}
                                    </Badge>
                                    
                                    {/* Smart Categorization Badge */}
                                    {product.aiSuggestedCategory && (
                                      <Badge className="text-xs px-1.5 py-0.5 h-auto bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        <Zap className="w-3 h-3 mr-0.5" />
                                        Smart
                                      </Badge>
                                    )}
                                    
                                    {/* Automation Action Badge */}
                                    {product.automationAction && product.automationAction !== 'manual-review' && (
                                      <Badge 
                                        className={`text-xs px-1.5 py-0.5 h-auto ${
                                          product.automationAction === 'auto-approve' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                          product.automationAction === 'auto-pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                        }`}
                                      >
                                        {product.automationAction === 'auto-approve' ? 'Auto-Approve' :
                                         product.automationAction === 'auto-pending' ? 'Auto-Pending' : 'Manual'}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Stock: {product.stockStatus}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Show products based on selected Import Manager status
                // For import tab, products are already filtered by the API call to match importManagerStatus
                const importStatusProducts = products;

                // Debug logging for Import Manager
                console.log('Import Manager Debug:', {
                  totalProducts: products.length,
                  currentStatus: importManagerStatus,
                  statusProducts: products.filter((p: Product) => p.approvalStatus === importManagerStatus).length,
                  wooCommerceProducts: products.filter((p: Product) => p.sourcePlatform === 'woocommerce').length,
                  statusWooCommerce: importStatusProducts.length,
                  sourcePlatforms: Array.from(new Set(products.map((p: Product) => p.sourcePlatform))),
                  approvalStatuses: Array.from(new Set(products.map((p: Product) => p.approvalStatus)))
                });
                
                if (importStatusProducts.length === 0) {
                  return (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Import Workspace Ready
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-lg mx-auto leading-relaxed">
                        Universal product gateway for all product types: Affiliate, Dropship, Physical, Consumable, Service, Digital, Custom, and Multivendor. 
                        All imported products appear here before moving to your active catalog.
                      </p>
                      
                      {/* Product Type Legend */}
                      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">✨ Universal Product Gateway - All Product Types Supported:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">🔗 Affiliate</Badge>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">📦 Dropship</Badge>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">📋 Physical</Badge>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs">🔄 Consumable</Badge>
                          <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs">⚙️ Service</Badge>
                          <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 text-xs">💾 Digital</Badge>
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs">🔧 Custom</Badge>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">🏪 Multivendor</Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                          💡 <strong>Note:</strong> Currently showing pending products. To see the universal gateway message, approve or reject all pending products above.
                        </p>
                      </div>
                      {/* Debug info */}
                      <div className="text-xs text-gray-500 mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                        <strong>Debug Info:</strong><br/>
                        Total products in system: {products.length}<br/>
                        Current status filter: {importManagerStatus}<br/>
                        WooCommerce products: {products.filter((p: Product) => p.sourcePlatform === 'woocommerce').length}<br/>
                        <strong>TARGET: {importManagerStatus} WooCommerce: {importStatusProducts.length}</strong><br/>
                        Products with sourcePlatform: {products.map((p: Product) => p.sourcePlatform).join(', ')}<br/>
                        Loading: {isLoading ? 'Yes' : 'No'}<br/>
                        Last import status: {importStatus}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <Button 
                          onClick={handleImport}
                          disabled={!connectionTest?.success || previewLoading}
                          style={{ backgroundColor: 'var(--primary-color)' }}
                          className="text-white hover:opacity-90 px-6 py-2"
                        >
                          {previewLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading Preview...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Import Products
                            </>
                          )}
                        </Button>

                      </div>
                    </div>
                  );
                }
                
                // When there are imported products in current status
                const getStatusConfig = (status: string) => {
                  switch (status) {
                    case 'pending':
                      return {
                        bgClass: 'bg-green-50 dark:bg-green-900/20',
                        borderClass: 'border-green-200 dark:border-green-800',
                        iconClass: 'text-green-600',
                        titleClass: 'text-green-900 dark:text-green-100',
                        descClass: 'text-green-700 dark:text-green-300',
                        icon: Clock,
                        title: `⏳ ${importStatusProducts.length} Products Awaiting Approval`,
                        description: 'Imported from WooCommerce - approve to move them to the next stage',
                        badge: 'Pending'
                      };
                    case 'approved':
                      return {
                        bgClass: 'bg-blue-50 dark:bg-blue-900/20',
                        borderClass: 'border-blue-200 dark:border-blue-800',
                        iconClass: 'text-blue-600',
                        titleClass: 'text-blue-900 dark:text-blue-100',
                        descClass: 'text-blue-700 dark:text-blue-300',
                        icon: CheckCircle,
                        title: `✅ ${importStatusProducts.length} Products Approved`,
                        description: 'Ready for publication - publish to make them live on your store',
                        badge: 'Approved'
                      };
                    case 'published':
                      return {
                        bgClass: 'bg-purple-50 dark:bg-purple-900/20',
                        borderClass: 'border-purple-200 dark:border-purple-800',
                        iconClass: 'text-purple-600',
                        titleClass: 'text-purple-900 dark:text-purple-100',
                        descClass: 'text-purple-700 dark:text-purple-300',
                        icon: Eye,
                        title: `🚀 ${importStatusProducts.length} Products Live`,
                        description: 'Currently published and visible to customers on your store',
                        badge: 'Published'
                      };
                    case 'rejected':
                      return {
                        bgClass: 'bg-red-50 dark:bg-red-900/20',
                        borderClass: 'border-red-200 dark:border-red-800',
                        iconClass: 'text-red-600',
                        titleClass: 'text-red-900 dark:text-red-100',
                        descClass: 'text-red-700 dark:text-red-300',
                        icon: XCircle,
                        title: `❌ ${importStatusProducts.length} Products Rejected`,
                        description: 'Not suitable for your store - review or reconsider for approval',
                        badge: 'Rejected'
                      };
                    default:
                      return {
                        bgClass: 'bg-gray-50 dark:bg-gray-900/20',
                        borderClass: 'border-gray-200 dark:border-gray-800',
                        iconClass: 'text-gray-600',
                        titleClass: 'text-gray-900 dark:text-gray-100',
                        descClass: 'text-gray-700 dark:text-gray-300',
                        icon: Package,
                        title: `📦 ${importStatusProducts.length} Products`,
                        description: 'Imported products in current status',
                        badge: 'Unknown'
                      };
                  }
                };

                const statusConfig = getStatusConfig(importManagerStatus);
                const IconComponent = statusConfig.icon;

                return (
                  <div className="space-y-6">
                    <div className={`flex items-center justify-between p-4 ${statusConfig.bgClass} border ${statusConfig.borderClass} rounded-lg`}>
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-5 h-5 ${statusConfig.iconClass}`} />
                        <div>
                          <h4 className={`font-medium ${statusConfig.titleClass}`}>
                            {statusConfig.title}
                          </h4>
                          <p className={`text-sm ${statusConfig.descClass}`}>
                            {statusConfig.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" style={{ 
                        backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)', 
                        color: 'var(--primary-color)', 
                        borderColor: 'var(--primary-color)' 
                      }}>
                        {statusConfig.badge}: {importStatusProducts.length}
                      </Badge>
                    </div>
                    
                    {/* Bulk Actions Bar - Optimized */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedProducts.length === importStatusProducts.length && importStatusProducts.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProducts(importStatusProducts.map((p: any) => p.id));
                            } else {
                              setSelectedProducts([]);
                            }
                          }}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Select All ({selectedProducts.length} of {importStatusProducts.length})
                        </span>
                      </div>
                      
                      {selectedProducts.length > 0 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {importManagerStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setIsProcessing(true);
                                  approveMutation.mutate(selectedProducts);
                                }}
                                disabled={isProcessing || approveMutation.isPending}
                                style={{ 
                                  backgroundColor: 'var(--primary-color)', 
                                  borderColor: 'var(--primary-color)' 
                                }}
                                className="text-xs px-2 whitespace-nowrap"
                              >
                                {approveMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                )}
                                Approve ({selectedProducts.length})
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setRejectionDialog({ open: true })}
                                disabled={isProcessing}
                                className="text-xs px-2 whitespace-nowrap"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject ({selectedProducts.length})
                              </Button>

                            </>
                          )}
                          {importManagerStatus === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => publishMutation.mutate(selectedProducts)}
                              disabled={publishMutation.isPending}
                              style={{ 
                                backgroundColor: 'var(--primary-color)', 
                                borderColor: 'var(--primary-color)' 
                              }}
                              className="text-xs px-2 whitespace-nowrap"
                            >
                              {publishMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Eye className="w-4 h-4 mr-1" />
                              )}
                              Publish ({selectedProducts.length})
                            </Button>
                          )}
                          {importManagerStatus === 'published' && (
                            <Button
                              size="sm"
                              onClick={() => unpublishMutation.mutate(selectedProducts)}
                              disabled={unpublishMutation.isPending}
                              variant="outline"
                              style={{ 
                                borderColor: 'var(--primary-color)', 
                                color: 'var(--primary-color)' 
                              }}
                              className="text-xs px-2 whitespace-nowrap hover:opacity-90"
                            >
                              {unpublishMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Archive className="w-4 h-4 mr-1" />
                              )}
                              Unpublish ({selectedProducts.length})
                            </Button>
                          )}
                          {importManagerStatus === 'rejected' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  // Bulk reconsider (move back to pending)
                                  const reconsiderMutation = async () => {
                                    const response = await fetch('/api/product-management/reconsider', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ productIds: selectedProducts }),
                                    });
                                    if (response.ok) {
                                      toast({
                                        title: "Products Reconsidered",
                                        description: `${selectedProducts.length} products moved back to pending for review.`,
                                      });
                                      queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                                      queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
                                      setSelectedProducts([]);
                                    }
                                  };
                                  reconsiderMutation();
                                }}
                                style={{ 
                                  backgroundColor: 'var(--primary-color)', 
                                  borderColor: 'var(--primary-color)' 
                                }}
                                className="text-xs px-2 whitespace-nowrap hover:opacity-90"
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Reconsider ({selectedProducts.length})
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  // Bulk delete permanently
                                  if (confirm(`Are you sure you want to permanently delete ${selectedProducts.length} rejected products?`)) {
                                    const deleteMutation = async () => {
                                      const response = await fetch('/api/product-management/delete', {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ productIds: selectedProducts }),
                                      });
                                      if (response.ok) {
                                        toast({
                                          title: "Products Deleted",
                                          description: `${selectedProducts.length} products permanently removed.`,
                                        });
                                        queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                                        queryClient.invalidateQueries({ queryKey: ['/api/product-management/overview'] });
                                        setSelectedProducts([]);
                                      }
                                    };
                                    deleteMutation();
                                  }
                                }}
                                variant="destructive"
                                className="text-xs px-2 whitespace-nowrap hover:opacity-90"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete ({selectedProducts.length})
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Professional List Format - Optimized Layout */}
<div className="space-y-4 max-w-full overflow-hidden">
                      {importStatusProducts.map((product: any) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900 shadow-sm max-w-full overflow-hidden">
                          {/* Checkbox */}
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedProducts(prev => [...prev, product.id]);
                              } else {
                                setSelectedProducts(prev => prev.filter(id => id !== product.id));
                              }
                            }}
                          />
                          
                          {/* Product Image */}
                          <img
                            src={product.imageUrl || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                          />
                          
                          {/* Product Details - Optimized for better space utilization */}
                          <div className="flex-1 min-w-0 mr-4">
                            <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100 leading-tight">{product.name}</h4>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-700 dark:text-gray-300">AVEENIX</span>
                                <span>•</span>
                                <span className="text-gray-600 dark:text-gray-400">{product.category || 'Electronics'}</span>
                              </div>
                              <span className="font-semibold text-sm" style={{ color: 'var(--primary-color)' }}>${product.price}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs px-2 py-1">
                                {importManagerStatus.charAt(0).toUpperCase() + importManagerStatus.slice(1)}
                              </Badge>
                              {/* Product Type Badge */}
                              {(() => {
                                const productType = product.productType || 'physical';
                                const typeConfig = {
                                  'affiliate': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: '🔗' },
                                  'dropship': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: '📦' },
                                  'physical': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '📋' },
                                  'consumable': { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: '🔄' },
                                  'service': { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', icon: '⚙️' },
                                  'digital': { color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200', icon: '💾' },
                                  'custom': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: '🔧' },
                                  'multivendor': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: '🏪' }
                                };
                                const config = typeConfig[productType.toLowerCase() as keyof typeof typeConfig] || typeConfig.physical;
                                return (
                                  <Badge className={`${config.color} text-xs px-2 py-1`}>
                                    <span className="mr-1">{config.icon}</span>
                                    {productType.charAt(0).toUpperCase() + productType.slice(1)}
                                  </Badge>
                                );
                              })()}
                              <Badge variant="outline" className="text-xs px-2 py-1 border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                {product.sourcePlatform}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Dynamic Action Buttons Based on Status */}
                          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                            {(() => {
                              switch (importManagerStatus) {
                                case 'pending':
                                  return (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setIsProcessing(true);
                                          approveMutation.mutate([product.id]);
                                        }}
                                        disabled={isProcessing}
                                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                                        className="text-white text-xs px-3 py-1.5 h-auto"
                                      >
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                          setSelectedProducts([product.id]);
                                          setRejectionDialog({ open: true, productId: product.id });
                                        }}
                                        disabled={isProcessing}
                                        className="text-xs px-3 py-1.5 h-auto"
                                      >
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Reject
                                      </Button>
                                    </>
                                  );
                                case 'approved':
                                  return (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => publishMutation.mutate([product.id])}
                                        disabled={publishMutation.isPending}
                                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                                        className="text-white text-xs px-3 py-1.5 h-auto"
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Publish
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          // Send back to pending
                                          setIsProcessing(true);
                                          // TODO: Add unapprove mutation
                                          console.log('Unapproving product:', product.id);
                                        }}
                                        disabled={isProcessing}
                                        className="text-xs px-3 py-1.5 h-auto"
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        Unpublish
                                      </Button>
                                    </>
                                  );
                                case 'published':
                                  return (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          // View on store
                                          console.log('Viewing published product:', product.id);
                                          // TODO: Add view on store link
                                        }}
                                        className="text-xs px-3 py-1.5 h-auto"
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        View Live
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          unpublishMutation.mutate([product.id]);
                                        }}
                                        disabled={unpublishMutation.isPending}
                                        className="text-xs px-3 py-1.5 h-auto"
                                      >
                                        {unpublishMutation.isPending ? (
                                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        ) : (
                                          <Archive className="w-3 h-3 mr-1" />
                                        )}
                                        Unpublish
                                      </Button>
                                    </>
                                  );
                                case 'rejected':
                                  return (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          // Reconsider (move back to pending)
                                          setIsProcessing(true);
                                          // TODO: Add reconsider mutation
                                          console.log('Reconsidering product:', product.id);
                                        }}
                                        disabled={isProcessing}
                                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                                        className="text-white text-xs px-3 py-1.5 h-auto"
                                      >
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        Reconsider
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                          // Delete product permanently
                                          setIsProcessing(true);
                                          console.log('Deleting product:', product.id);
                                        }}
                                        disabled={isProcessing}
                                        className="text-xs px-3 py-1.5 h-auto"
                                      >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Delete
                                      </Button>
                                    </>
                                  );
                                default:
                                  return null;
                              }
                            })()}
                            
                            {/* Universal Actions - Always Available */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (product.affiliateUrl) {
                                  window.open(product.affiliateUrl, '_blank');
                                }
                              }}
                              disabled={!product.affiliateUrl}
                              className="text-xs px-2 py-1.5 h-auto"
                              title="View Original"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIntelligenceProductId(product.id)}
                              className="text-xs px-2 py-1.5 h-auto border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              title="Intelligence"
                            >
                              <Brain className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
                
                // Default return for normal status display
                return null;
              })()}
              </div>
            </CardContent>
          </Card>

        </TabsContent>





        {/* Standard Product Management Tabs */}
        <TabsContent value={activeTab} className="space-y-4" style={{display: ['intelligence', 'import', 'csv-upload', 'affiliate', 'dropship', 'physical', 'consumable', 'service', 'digital', 'custom', 'multivendor'].includes(activeTab) ? 'none' : 'block'}}>
          {/* Import tab functionality is handled by dedicated Import TabsContent above */}
          {(
            <>


              {/* Products List for Import Manager status tabs only (exclude main tabs and management interface tabs) */}
              {activeTab !== 'categories' && activeTab !== 'product-types' && activeTab !== 'products' && activeTab !== 'import' && activeTab !== 'csv-upload' && (
                isLoading ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p>Loading products...</p>
                    </CardContent>
                  </Card>
                ) : products.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No products found</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {`No ${activeTab} products at the moment.`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                <div className="space-y-3">
                  {products.map((product: Product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleSelectProduct(product.id)}
                          />
                          
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-lg mb-1 truncate max-w-md">{product.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  <span>{product.brand}</span>
                                  <span>•</span>
                                  <span>{product.category}</span>
                                  <span>•</span>
                                  <span>${product.price}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  {getStatusBadge(product.approvalStatus)}
                                  <Badge variant="outline">{product.sourcePlatform}</Badge>
                                  <Badge variant="outline">{product.productType}</Badge>
                                </div>
                                {product.rejectionReason && (
                                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 mt-2">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                      <div className="text-sm">
                                        <p className="font-medium text-red-800 dark:text-red-200">Rejection Reason:</p>
                                        <p className="text-red-700 dark:text-red-300">{product.rejectionReason}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {product.approvalStatus === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      onClick={() => approveMutation.mutate([product.id])}
                                      style={{ 
                                        backgroundColor: 'var(--primary-color)', 
                                        borderColor: 'var(--primary-color)' 
                                      }}
                                      className="hover:opacity-90"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => setRejectionDialog({ open: true, productId: product.id })}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}

                                {product.approvalStatus === 'rejected' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      onClick={() => approveMutation.mutate([product.id])}
                                      style={{ 
                                        backgroundColor: 'var(--primary-color)', 
                                        borderColor: 'var(--primary-color)' 
                                      }}
                                      className="hover:opacity-90"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Override Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        // Move back to pending for re-review
                                        const reconsiderMutation = async () => {
                                          const response = await fetch('/api/product-management/reconsider', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ productIds: [product.id] }),
                                          });
                                          if (response.ok) {
                                            toast({
                                              title: "Product Reconsidered",
                                              description: "Product moved back to pending for review.",
                                            });
                                            queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                                          }
                                        };
                                        reconsiderMutation();
                                      }}
                                    >
                                      <RotateCcw className="w-4 h-4 mr-1" />
                                      Reconsider
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        // Delete permanently
                                        if (confirm('Are you sure you want to permanently delete this product?')) {
                                          const deleteMutation = async () => {
                                            const response = await fetch('/api/product-management/delete', {
                                              method: 'DELETE',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ productIds: [product.id] }),
                                            });
                                            if (response.ok) {
                                              toast({
                                                title: "Product Deleted",
                                                description: "Product permanently removed.",
                                              });
                                              queryClient.invalidateQueries({ queryKey: ['/api/product-management/products'] });
                                            }
                                          };
                                          deleteMutation();
                                        }
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </>
                                )}

                                {(product.approvalStatus === 'approved' || product.approvalStatus === 'published') && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setRejectionDialog({ open: true, productId: product.id })}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                )}
                                {product.approvalStatus === 'approved' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => publishMutation.mutate([product.id])}
                                    style={{ 
                                      backgroundColor: 'var(--primary-color)', 
                                      borderColor: 'var(--primary-color)' 
                                    }}
                                    className="hover:opacity-90"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Publish
                                  </Button>
                                )}
                                {product.affiliateUrl && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => window.open(product.affiliateUrl, '_blank')}
                                  >
                                    <Upload className="w-4 h-4 mr-1" />
                                    View Original
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setIntelligenceProductId(product.id);
                                    setActiveTab('intelligence');
                                  }}
                                  style={{ 
                                    backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)', 
                                    color: 'var(--primary-color)', 
                                    borderColor: 'var(--primary-color)' 
                                  }}
                                  className="hover:opacity-90"
                                >
                                  <Brain className="w-4 h-4 mr-1" />
                                  Intelligence
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                )
              )}
            </>
          )}
        </TabsContent>

        {/* Analytics & Intelligence Tab */}
        <TabsContent value="analytics" className="space-y-5">
          {/* Analytics Integration Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                Analytics Integration
              </CardTitle>
              <CardDescription>
                Comprehensive analytics for search behavior, workflow optimization, quality trends, and performance insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Search Analytics & Workflow Metrics */}
                <div className="space-y-4">
                  {/* Search Analytics */}
                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Search className="w-4 h-4 text-blue-600" />
                        Search Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Most Searched Products</span>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">2.4K searches</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium">1. Smart Fitness Watch</div>
                          <div className="text-xs text-gray-600">2. Wireless Headphones</div>
                          <div className="text-xs text-gray-600">3. Gaming Laptop</div>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Popular Filters</span>
                          <Badge variant="outline" className="text-blue-600 border-blue-600">87% usage</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium">Price Range (45%)</div>
                          <div className="text-xs text-gray-600">Category Filter (32%)</div>
                          <div className="text-xs text-gray-600">Stock Status (28%)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Workflow Metrics */}
                  <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Workflow Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Avg Approval Time</span>
                          <span className="text-sm font-medium text-green-600">2.3 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Approval Bottlenecks</span>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">3 detected</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">User Activity</span>
                          <span className="text-sm font-medium">248 actions today</span>
                        </div>
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20 p-2 rounded">
                        ↗ 15% faster approvals vs last week
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quality Trends & Performance Insights */}
                <div className="space-y-4">
                  {/* Quality Trends */}
                  <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Quality Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Product Completeness</span>
                          <span className="text-sm font-medium text-purple-600">87.4%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Quality Score Trend</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">↗ +5.2%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Missing Descriptions</span>
                          <span className="text-sm font-medium text-red-600">12 products</span>
                        </div>
                      </div>
                      <div className="space-y-1 pt-2 border-t">
                        <div className="text-xs font-medium text-purple-700 dark:text-purple-300">Top Improvements:</div>
                        <div className="text-xs text-gray-600">• Image quality +12%</div>
                        <div className="text-xs text-gray-600">• Description completeness +8%</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Insights */}
                  <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Best-Selling Products</span>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">Top 5</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium">1. Smart Fitness Watch (156 sales)</div>
                          <div className="text-xs text-gray-600">2. Wireless Headphones (134 sales)</div>
                          <div className="text-xs text-gray-600">3. Gaming Laptop (89 sales)</div>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Inventory Turnover</span>
                          <span className="text-sm font-medium text-orange-600">12.4x annually</span>
                        </div>
                        <div className="text-xs text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/20 p-2 rounded">
                          ↗ 23% increase in turnover rate
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>


        </TabsContent>




        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-5">
          {/* Category Management Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Category Management</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage categories, subcategories, and product attributes</p>
            </div>
            <Button 
              className="flex items-center gap-2"
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>

          {/* Category Management Tabs */}
          <Tabs 
            value={categoryManagementTab}
            className="w-full"
            onValueChange={(value) => {
              setCategoryManagementTab(value);
              // When clicking Categories tab, reset to categories list view
              if (value === 'categories') {
                setSelectedCategory(null);
              }
              // When clicking Subcategories tab, reset to subcategories list view  
              if (value === 'subcategories') {
                setSelectedSubcategory(null);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="categories" 
                className="flex items-center gap-2"
                onClick={() => {
                  // Always reset when clicking Categories tab, even if already active
                  setSelectedCategory(null);
                }}
              >
                <Filter className="w-4 h-4" />
                Categories ({Array.isArray(masterCategories) ? masterCategories.length : 0})
              </TabsTrigger>
              <TabsTrigger 
                value="subcategories" 
                className="flex items-center gap-2"
                onClick={() => {
                  // Always reset when clicking Subcategories tab, even if already active
                  setSelectedSubcategory(null);
                }}
              >
                <Settings className="w-4 h-4" />
                Subcategories ({subcategories.length})
              </TabsTrigger>
              <TabsTrigger value="attributes" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Variants / Attributes ({attributesLoading ? '...' : productAttributes.length})
              </TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              {!selectedCategory ? (
                <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                        Main Categories ({Array.isArray(masterCategories) ? masterCategories.length : 0})
                      </CardTitle>
                      <CardDescription>Manage primary product categories</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search categories..."
                        className="w-64"
                      />
                      <Button variant="outline" size="icon">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoriesLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                              <div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : Array.isArray(masterCategories) && masterCategories.length > 0 ? (
                      masterCategories.map((category: any) => {
                        const IconComponent = getIconByName(category.icon) || HelpCircle;
                        return (
                          <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                               onClick={() => setSelectedCategory(category.name)}>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {category.description} • {category.productCount} products
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={category.isActive ? 'default' : 'secondary'}>
                                {category.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon">
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedCategory(category.name); }}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Products
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Category
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Products
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Category
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Filter className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">No categories found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Unable to load categories at the moment.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              ) : (
                // Category Products View
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ArrowLeft className="w-5 h-5 cursor-pointer" style={{ color: 'var(--primary-color)' }} 
                                     onClick={() => setSelectedCategory(null)} />
                          <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          Products in "{selectedCategory}" ({categoryProductsLoading ? '...' : categoryProducts.length})
                        </CardTitle>
                        <CardDescription>Browse and manage products in this category</CardDescription>
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent>
                    {categoryProductsLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
                        <p>Loading products...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryProducts.map((product: any) => (
                          <Card key={product.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                  {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <Package className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{product.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {product.description || 'No description'}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="font-semibold text-lg" style={{ color: 'var(--primary-color)' }}>
                                      ${product.price}
                                    </span>
                                    <Badge variant={product.approvalStatus === 'published' ? 'default' : 'secondary'}>
                                      {product.approvalStatus || 'pending'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Subcategories Tab */}
            <TabsContent value="subcategories" className="space-y-4">
              {!selectedSubcategory ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                        Subcategories ({subcategories.length})
                      </CardTitle>
                      <CardDescription>Manage category subdivisions</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {Array.isArray(masterCategories) ? masterCategories.map((category: any) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          )) : null}
                        </SelectContent>
                      </Select>
                      <Button 
                        className="flex items-center gap-2"
                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Subcategory
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Loading State */}
                    {subcategoriesLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <p>Loading subcategories...</p>
                      </div>
                    ) : subcategories.length === 0 ? (
                      <div className="text-center py-8">
                        <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">No subcategories found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Create subcategories to organize your products better
                        </p>
                        <Button style={{ backgroundColor: 'var(--primary-color)' }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Subcategory
                        </Button>
                      </div>
                    ) : subcategories.map((subcategory: any) => {
                      const IconComponent = getIconByName(subcategory.icon) || HelpCircle;
                      return (
                        <div 
                          key={subcategory.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          onClick={() => setSelectedSubcategory(subcategory.name)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">{subcategory.name}</h3>
                              <p className="text-sm text-gray-500">
                                Parent: {subcategory.parentName} • {subcategory.productCount} products
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={subcategory.isActive ? 'default' : 'secondary'}>
                              {subcategory.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Subcategory
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Products
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Subcategory
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              ) : (
                // Subcategory Products View
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ArrowLeft className="w-5 h-5 cursor-pointer" style={{ color: 'var(--primary-color)' }} 
                                     onClick={() => setSelectedSubcategory(null)} />
                          <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                          Products in "{selectedSubcategory}" ({subcategoryProductsLoading ? '...' : subcategoryProducts.length})
                        </CardTitle>
                        <CardDescription>Browse and manage products in this subcategory</CardDescription>
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent>
                    {subcategoryProductsLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
                        <p>Loading products...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subcategoryProducts.map((product: any) => (
                          <Card key={product.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                  {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <Package className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{product.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {product.description || 'No description'}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="font-semibold text-lg" style={{ color: 'var(--primary-color)' }}>
                                      ${product.price}
                                    </span>
                                    <Badge variant={product.approvalStatus === 'published' ? 'default' : 'secondary'}>
                                      {product.approvalStatus || 'pending'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Variants/Attributes Tab */}
            <TabsContent value="attributes" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                        Product Variants & Attributes ({attributesLoading ? '...' : productAttributes.length})
                      </CardTitle>
                      <CardDescription>Manage product variations and custom attributes</CardDescription>
                    </div>
                    <Button 
                      className="flex items-center gap-2"
                      style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Attribute
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Real Attribute Groups from API */}
                    {attributesLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
                        <p>Loading product attributes...</p>
                      </div>
                    ) : productAttributes.length === 0 ? (
                      <div className="text-center py-8">
                        <Edit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">No Product Attributes</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Start building your product catalog by adding custom attributes and variants
                        </p>
                        <Button 
                          className="flex items-center gap-2"
                          style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                        >
                          <Plus className="w-4 h-4" />
                          Add First Attribute
                        </Button>
                      </div>
                    ) : (
                      productAttributes.map((attribute: any) => (
                      <Card key={attribute.id} className="border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-lg">{attribute.name}</h3>
                                <Badge variant="outline">{attribute.type}</Badge>
                                {attribute.isRequired && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mb-3">
                                Used in {attribute.productCount || 0} products
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {attribute.values && attribute.values.length > 0 ? (
                                  attribute.values.map((valueObj: any, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {valueObj.value}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-gray-400">No values defined</span>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Attribute
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Values
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Usage
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Attribute
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    )))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>



      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog.open} onOpenChange={(open) => setRejectionDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Products</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {rejectionDialog.productId ? '1 product' : `${selectedProducts.length} products`}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialog({ open: false })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                const productIds = rejectionDialog.productId ? [rejectionDialog.productId] : selectedProducts;
                rejectMutation.mutate({ productIds, reason: rejectionReason });
              }}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <Dialog 
        open={productDetailModal.open} 
        onOpenChange={(open) => setProductDetailModal({ open, product: null, editMode: false })}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {productDetailModal.product && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                    {productDetailModal.editMode ? 'Edit Product' : 'Product Details'}
                  </span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(productDetailModal.product.approvalStatus)}
                    <Badge variant="outline">{productDetailModal.product.sourcePlatform}</Badge>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  {productDetailModal.editMode 
                    ? 'Edit product information and save changes'
                    : 'Complete product information from all connected sources'
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                {/* Product Image */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-4">
                      <img
                        src={productDetailModal.product.imageUrl}
                        alt={productDetailModal.product.name}
                        className="w-full aspect-square object-cover rounded-lg mb-4"
                      />
                      <div className="text-center space-y-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Change Image
                        </Button>
                        {productDetailModal.product.affiliateUrl && (
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href={productDetailModal.product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Original
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Product Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                          <Input 
                            value={productDetailModal.product.name} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                          <Input 
                            value={productDetailModal.product.brand || 'N/A'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                          <Input 
                            value={productDetailModal.product.category} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Type</label>
                          <Input 
                            value={productDetailModal.product.productType || 'physical'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <Textarea 
                          value={productDetailModal.product.description || 'No description available'} 
                          readOnly={!productDetailModal.editMode}
                          className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pricing & Inventory */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing & Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Price</label>
                          <Input 
                            value={`$${productDetailModal.product.price}`} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Original Price</label>
                          <Input 
                            value={productDetailModal.product.originalPrice ? `$${productDetailModal.product.originalPrice}` : 'N/A'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount</label>
                          <Input 
                            value={productDetailModal.product.discountPercentage ? `${productDetailModal.product.discountPercentage}%` : '0%'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
                          <Input 
                            value={productDetailModal.product.stockQuantity?.toString() || '0'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Status</label>
                          <Input 
                            value={productDetailModal.product.isInStock ? 'In Stock' : 'Out of Stock'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                          <div className="flex items-center gap-2">
                            <Input 
                              value={`${productDetailModal.product.rating}/5.0`} 
                              readOnly={!productDetailModal.editMode}
                              className={`flex-1 ${!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}`}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({productDetailModal.product.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Identity & Metadata */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Identity & Metadata</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                          <Input 
                            value={productDetailModal.product.sku || 'Not provided'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Code</label>
                          <Input 
                            value={productDetailModal.product.productCode || 'Not provided'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Barcode</label>
                          <Input 
                            value={productDetailModal.product.barcode || 'Not provided'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer</label>
                          <Input 
                            value={productDetailModal.product.manufacturer || 'Not provided'} 
                            readOnly={!productDetailModal.editMode}
                            className={!productDetailModal.editMode ? "bg-gray-50 dark:bg-gray-800" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">External ID</label>
                          <Input 
                            value={productDetailModal.product.externalId || 'N/A'} 
                            readOnly
                            className="bg-gray-50 dark:bg-gray-800"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source Platform</label>
                          <Input 
                            value={productDetailModal.product.sourcePlatform || 'aveenix'} 
                            readOnly
                            className="bg-gray-50 dark:bg-gray-800"
                          />
                        </div>
                      </div>
                      
                      {productDetailModal.product.productTags && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Tags</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(productDetailModal.product.productTags as string[]).map((tag, index) => (
                              <Badge key={index} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Approval Status & Workflow */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Approval Status & Workflow</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Approval Status</label>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(productDetailModal.product.approvalStatus)}
                            {getStatusIcon(productDetailModal.product.approvalStatus)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created Date</label>
                          <Input 
                            value={productDetailModal.product.createdAt ? new Date(productDetailModal.product.createdAt).toLocaleDateString() : 'N/A'} 
                            readOnly
                            className="bg-gray-50 dark:bg-gray-800"
                          />
                        </div>
                        {productDetailModal.product.lastSyncedAt && (
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Synced</label>
                            <Input 
                              value={new Date(productDetailModal.product.lastSyncedAt).toLocaleString()} 
                              readOnly
                              className="bg-gray-50 dark:bg-gray-800"
                            />
                          </div>
                        )}
                      </div>
                      
                      {productDetailModal.product.rejectionReason && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejection Reason</label>
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mt-2">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                              <p className="text-sm text-red-700 dark:text-red-300">{productDetailModal.product.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Enhanced WooCommerce Data Sections */}
                  {productDetailModal.product.sourcePlatform === 'woocommerce' && productDetailModal.product.platformSpecificData?.woocommerce && (
                    <>
                      {/* Product Tags */}
                      {productDetailModal.product.productTags && productDetailModal.product.productTags.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Tag className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                              Product Tags
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {productDetailModal.product.productTags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Image Gallery */}
                      {productDetailModal.product.platformSpecificData.woocommerce.image_gallery && 
                       productDetailModal.product.platformSpecificData.woocommerce.image_gallery.length > 1 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Image className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                              Image Gallery ({productDetailModal.product.platformSpecificData.woocommerce.image_gallery.length} images)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {productDetailModal.product.platformSpecificData.woocommerce.image_gallery.map((img, index) => (
                                <div key={index} className="aspect-square relative">
                                  <img
                                    src={img.src}
                                    alt={img.alt || productDetailModal.product?.name || ''}
                                    className="w-full h-full object-cover rounded-lg border"
                                  />
                                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                                    {index + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Product Attributes */}
                      {productDetailModal.product.platformSpecificData.woocommerce.attributes && 
                       productDetailModal.product.platformSpecificData.woocommerce.attributes.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Settings className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                              Product Attributes
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {productDetailModal.product.platformSpecificData.woocommerce.attributes.map((attr, index) => (
                                <div key={index} className="border rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">{attr.name}</h4>
                                    <div className="flex gap-2">
                                      {attr.visible && <Badge variant="outline" className="text-xs">Visible</Badge>}
                                      {attr.variation && <Badge variant="outline" className="text-xs">Variation</Badge>}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {attr.options.map((option, optIndex) => (
                                      <Badge key={optIndex} variant="secondary" className="text-xs">
                                        {option}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Dimensions and Weight */}
                      {(productDetailModal.product.platformSpecificData.woocommerce.dimensions || 
                        productDetailModal.product.platformSpecificData.woocommerce.weight) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Package className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                              Physical Specifications
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {productDetailModal.product.platformSpecificData.woocommerce.weight && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight</label>
                                  <Input 
                                    value={`${productDetailModal.product.platformSpecificData.woocommerce.weight}`} 
                                    readOnly
                                    className="bg-gray-50 dark:bg-gray-800"
                                  />
                                </div>
                              )}
                              {productDetailModal.product.platformSpecificData.woocommerce.dimensions && (
                                <>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Length</label>
                                    <Input 
                                      value={productDetailModal.product.platformSpecificData.woocommerce.dimensions.length || 'Not specified'} 
                                      readOnly
                                      className="bg-gray-50 dark:bg-gray-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Width</label>
                                    <Input 
                                      value={productDetailModal.product.platformSpecificData.woocommerce.dimensions.width || 'Not specified'} 
                                      readOnly
                                      className="bg-gray-50 dark:bg-gray-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Height</label>
                                    <Input 
                                      value={productDetailModal.product.platformSpecificData.woocommerce.dimensions.height || 'Not specified'} 
                                      readOnly
                                      className="bg-gray-50 dark:bg-gray-800"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* WooCommerce Specific Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
                            WooCommerce Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Type</label>
                              <Input 
                                value={productDetailModal.product.platformSpecificData.woocommerce.type || 'simple'} 
                                readOnly
                                className="bg-gray-50 dark:bg-gray-800"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax Status</label>
                              <Input 
                                value={productDetailModal.product.platformSpecificData.woocommerce.tax_status || 'taxable'} 
                                readOnly
                                className="bg-gray-50 dark:bg-gray-800"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Required</label>
                              <Input 
                                value={productDetailModal.product.platformSpecificData.woocommerce.shipping_required ? 'Yes' : 'No'} 
                                readOnly
                                className="bg-gray-50 dark:bg-gray-800"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reviews Allowed</label>
                              <Input 
                                value={productDetailModal.product.platformSpecificData.woocommerce.reviews_allowed ? 'Yes' : 'No'} 
                                readOnly
                                className="bg-gray-50 dark:bg-gray-800"
                              />
                            </div>
                            {productDetailModal.product.platformSpecificData.woocommerce.short_description && (
                              <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Description</label>
                                <textarea 
                                  value={productDetailModal.product.platformSpecificData.woocommerce.short_description.replace(/<[^>]*>/g, '')} 
                                  readOnly
                                  className="w-full mt-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600 resize-none"
                                  rows={3}
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  {productDetailModal.editMode ? (
                    <>
                      <Button variant="outline" onClick={() => setProductDetailModal(prev => ({ ...prev, editMode: false }))}>
                        Cancel
                      </Button>
                      <Button style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setProductDetailModal(prev => ({ ...prev, editMode: true }))}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Product
                      </Button>
                      <Button variant="outline" onClick={() => setProductDetailModal({ open: false, product: null, editMode: false })}>
                        Close
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {(productDetailModal.product.approvalStatus === 'pending' || !productDetailModal.product.approvalStatus) && (
                    <>
                      <Button 
                        onClick={() => {
                          approveMutation.mutate([productDetailModal.product!.id]);
                          setProductDetailModal({ open: false, product: null, editMode: false });
                        }}
                        style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          setRejectionDialog({ open: true, productId: productDetailModal.product!.id });
                          setProductDetailModal({ open: false, product: null, editMode: false });
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Automation Settings Modal */}
      <Dialog open={automationSettingsDialog.open} onOpenChange={(open) => setAutomationSettingsDialog({ open })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
              Smart Import Automation Settings
            </DialogTitle>
            <DialogDescription>
              Configure Smart Import automation to automatically import {automationRules.autoImport.batchSize} product every {automationRules.autoImport.interval} minute(s). Auto-Import will be enabled when you save these settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Auto-Pricing Rules (Preview → Pricing) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto-Price Products (Preview → Pricing)</h4>
                  <p className="text-xs text-gray-500">Automatically move preview products to pricing stage • Preview ({overviewStats?.previewProducts || 0})</p>
                  <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Rules:</span>
                    <span className="text-blue-600 dark:text-blue-400"> Valid title/images, mapped category, no duplicates</span>
                  </div>
                </div>
                <Switch
                  checked={automationRules.autoPricing?.enabled || false}
                  onCheckedChange={(checked) =>
                    setAutomationRules(prev => ({
                      ...prev,
                      autoPricing: { 
                        enabled: checked,
                        markupPercentage: prev.autoPricing?.markupPercentage || 25
                      }
                    }))
                  }
                />
              </div>

              {automationRules.autoPricing?.enabled && (
                <div className="ml-4 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label htmlFor="markupPercentage" className="text-xs">Default Markup %</Label>
                    <Input
                      id="markupPercentage"
                      type="number"
                      min="5"
                      max="200"
                      value={automationRules.autoPricing?.markupPercentage || 25}
                      onChange={(e) =>
                        setAutomationRules(prev => ({
                          ...prev,
                          autoPricing: { 
                            ...prev.autoPricing, 
                            enabled: prev.autoPricing?.enabled || false,
                            markupPercentage: Number(e.target.value)
                          }
                        }))
                      }
                      className="text-xs h-8 w-24"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto-Import Rules (Pricing → Pending) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto-Import to Pending (Pricing → Pending)</h4>
                  <p className="text-xs text-gray-500">Automatically move priced products to pending approval • Pricing ({overviewStats?.pricingProducts || 0})</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                    <span className="text-green-700 dark:text-green-300 font-medium">Rules:</span>
                    <span className="text-green-600 dark:text-green-400"> Valid pricing, profit margins, batch limits respected</span>
                  </div>
                </div>
                <Switch
                  checked={automationRules.autoImport.enabled}
                  onCheckedChange={(checked) =>
                    setAutomationRules(prev => ({
                      ...prev,
                      autoImport: { ...prev.autoImport, enabled: checked }
                    }))
                  }
                />
              </div>

              {automationRules.autoImport.enabled && (
                <div className="ml-4 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      id="autoSelectNew"
                      checked={automationRules.autoImport.autoSelectNew}
                      onCheckedChange={(checked) =>
                        setAutomationRules(prev => ({
                          ...prev,
                          autoImport: { ...prev.autoImport, autoSelectNew: Boolean(checked) }
                        }))
                      }
                    />
                    <Label htmlFor="autoSelectNew" className="text-xs">Only import new products (skip already imported)</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="importBatchSize" className="text-xs">Batch Size</Label>
                      <Input
                        id="importBatchSize"
                        type="number"
                        min="1"
                        max="100"
                        value={automationRules.autoImport.batchSize}
                        onChange={(e) =>
                          setAutomationRules(prev => ({
                            ...prev,
                            autoImport: { ...prev.autoImport, batchSize: Number(e.target.value) }
                          }))
                        }
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="importInterval" className="text-xs">Interval (minutes)</Label>
                      <Input
                        id="importInterval"
                        type="number"
                        min="5"
                        value={automationRules.autoImport.interval}
                        onChange={(e) =>
                          setAutomationRules(prev => ({
                            ...prev,
                            autoImport: { ...prev.autoImport, interval: Number(e.target.value) }
                          }))
                        }
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Auto-Approval Rules (Pending → Approved) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto-Approve Products (Pending → Approved)</h4>
                  <p className="text-xs text-gray-500">Automatically approve pending products that meet your criteria • Pending ({overviewStats?.pendingProducts || 0})</p>
                  <div className="mt-1 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs">
                    <span className="text-amber-700 dark:text-amber-300 font-medium">Criteria:</span>
                    <span className="text-amber-600 dark:text-amber-400"> Rating threshold, price limits, no banned keywords</span>
                  </div>
                </div>
                <Switch
                  checked={automationRules.autoApprove.enabled}
                  onCheckedChange={(checked) =>
                    setAutomationRules(prev => ({
                      ...prev,
                      autoApprove: { ...prev.autoApprove, enabled: checked }
                    }))
                  }
                />
              </div>

              {automationRules.autoApprove.enabled && (
                <div className="ml-4 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="priceThreshold" className="text-xs">Max Price ($)</Label>
                      <Input
                        id="priceThreshold"
                        type="number"
                        value={automationRules.autoApprove.priceThreshold}
                        onChange={(e) =>
                          setAutomationRules(prev => ({
                            ...prev,
                            autoApprove: { ...prev.autoApprove, priceThreshold: Number(e.target.value) }
                          }))
                        }
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ratingThreshold" className="text-xs">Min Rating</Label>
                      <Input
                        id="ratingThreshold"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={automationRules.autoApprove.ratingThreshold}
                        onChange={(e) =>
                          setAutomationRules(prev => ({
                            ...prev,
                            autoApprove: { ...prev.autoApprove, ratingThreshold: Number(e.target.value) }
                          }))
                        }
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="excludeKeywords" className="text-xs">Exclude Keywords (comma-separated)</Label>
                    <Input
                      id="excludeKeywords"
                      placeholder="adult, restricted, banned"
                      value={automationRules.autoApprove.excludeKeywords.join(', ')}
                      onChange={(e) =>
                        setAutomationRules(prev => ({
                          ...prev,
                          autoApprove: {
                            ...prev.autoApprove,
                            excludeKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                          }
                        }))
                      }
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto-Reject Rules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto-Reject Products (Any Stage)</h4>
                  <p className="text-xs text-gray-500">Automatically reject products that don't meet your standards at any workflow stage</p>
                  <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                    <span className="text-red-700 dark:text-red-300 font-medium">Triggers:</span>
                    <span className="text-red-600 dark:text-red-400"> Max price exceeded, low ratings, banned keywords</span>
                  </div>
                </div>
                <Switch
                  checked={automationRules.autoReject.enabled}
                  onCheckedChange={(checked) =>
                    setAutomationRules(prev => ({
                      ...prev,
                      autoReject: { ...prev.autoReject, enabled: checked }
                    }))
                  }
                />
              </div>

              {automationRules.autoReject.enabled && (
                <div className="ml-4 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="maxPrice" className="text-xs">Max Price ($)</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        value={automationRules.autoReject.maxPrice}
                        onChange={(e) =>
                          setAutomationRules(prev => ({
                            ...prev,
                            autoReject: { ...prev.autoReject, maxPrice: Number(e.target.value) }
                          }))
                        }
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minRating" className="text-xs">Min Rating</Label>
                      <Input
                        id="minRating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={automationRules.autoReject.minRating}
                        onChange={(e) =>
                          setAutomationRules(prev => ({
                            ...prev,
                            autoReject: { ...prev.autoReject, minRating: Number(e.target.value) }
                          }))
                        }
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bannedKeywords" className="text-xs">Banned Keywords (comma-separated)</Label>
                    <Input
                      id="bannedKeywords"
                      placeholder="adult, offensive, restricted"
                      value={automationRules.autoReject.bannedKeywords.join(', ')}
                      onChange={(e) =>
                        setAutomationRules(prev => ({
                          ...prev,
                          autoReject: {
                            ...prev.autoReject,
                            bannedKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                          }
                        }))
                      }
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto-Publish Rules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto-Publish Products (Approved → Published)</h4>
                  <p className="text-xs text-gray-500">Automatically publish approved products to your store • Approved ({overviewStats?.approvedProducts || 0}) → Published ({overviewStats?.publishedProducts || 0})</p>
                  <div className="mt-1 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                    <span className="text-purple-700 dark:text-purple-300 font-medium">Rules:</span>
                    <span className="text-purple-600 dark:text-purple-400"> SEO optimization, inventory sync, scheduled release</span>
                  </div>
                </div>
                <Switch
                  checked={automationRules.autoPublish.enabled}
                  onCheckedChange={(checked) =>
                    setAutomationRules(prev => ({
                      ...prev,
                      autoPublish: { ...prev.autoPublish, enabled: checked }
                    }))
                  }
                />
              </div>

              {automationRules.autoPublish.enabled && (
                <div className="ml-4 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="publishImmediately"
                      checked={automationRules.autoPublish.immediately}
                      onCheckedChange={(checked) =>
                        setAutomationRules(prev => ({
                          ...prev,
                          autoPublish: { ...prev.autoPublish, immediately: Boolean(checked) }
                        }))
                      }
                    />
                    <Label htmlFor="publishImmediately" className="text-xs">Publish immediately</Label>
                  </div>
                  {!automationRules.autoPublish.immediately && (
                    <div>
                      <Label htmlFor="scheduleHours" className="text-xs">Delay (hours)</Label>
                      <Input
                        id="scheduleHours"
                        type="number"
                        min="1"
                        value={automationRules.autoPublish.scheduleHours}
                        onChange={(e) =>
                          setAutomationRules(prev => ({
                            ...prev,
                            autoPublish: { ...prev.autoPublish, scheduleHours: Number(e.target.value) }
                          }))
                        }
                        className="text-xs h-8"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAutomationSettingsDialog({ open: false })}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  // Save all Smart Import settings to backend first
                  const settingsResponse = await fetch('/api/smart-import/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      autoPriceProducts: automationRules.autoPricing.enabled,
                      autoImportToPending: automationRules.autoImport.enabled,
                      autoApproveProducts: automationRules.autoApprove.enabled,
                      autoRejectProducts: automationRules.autoReject.enabled,
                      autoPublishProducts: automationRules.autoPublish.enabled,
                      // Include additional settings for each automation type
                      autoPricingMarkup: automationRules.autoPricing.markupPercentage,
                      autoImportBatchSize: automationRules.autoImport.batchSize,
                      autoImportInterval: automationRules.autoImport.interval,
                      autoApprovePriceThreshold: automationRules.autoApprove.priceThreshold,
                      autoApproveRatingThreshold: automationRules.autoApprove.ratingThreshold,
                      autoRejectMaxPrice: automationRules.autoReject.maxPrice,
                      autoRejectMinRating: automationRules.autoReject.minRating,
                      autoPublishImmediate: automationRules.autoPublish.immediately,
                      autoPublishDelay: automationRules.autoPublish.scheduleHours
                    })
                  });

                  if (!settingsResponse.ok) {
                    throw new Error('Failed to save Smart Import settings');
                  }

                  // Now handle the auto-import automation
                  if (automationRules.autoImport.enabled) {
                    // Enable backend auto-import with the configured settings
                    const autoImportResponse = await fetch('/api/woocommerce/auto-import', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        enabled: true,
                        batchSize: automationRules.autoImport.batchSize,
                        intervalMinutes: automationRules.autoImport.interval
                      })
                    });
                    
                    if (!autoImportResponse.ok) {
                      throw new Error('Failed to enable auto-import');
                    }
                    
                    toast({
                      title: "Smart Import Automation Started",
                      description: `Auto-importing ${automationRules.autoImport.batchSize} product every ${automationRules.autoImport.interval} minute(s)`,
                    });
                  } else {
                    // Disable backend auto-import if not enabled
                    await fetch('/api/woocommerce/auto-import', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ enabled: false })
                    });
                    
                    toast({
                      title: "Settings Saved",
                      description: "Smart Import automation settings saved successfully.",
                    });
                  }
                  
                  setAutomationSettingsDialog({ open: false });
                  
                  // Refresh automation status immediately
                  setTimeout(async () => {
                    try {
                      const response = await fetch('/api/woocommerce/auto-import/status');
                      const data = await response.json();
                      if (data.success) {
                        setAutomationStatus({
                          isRunning: data.isRunning,
                          config: data.config
                        });
                      }
                    } catch (error) {
                      console.error('Error refreshing automation status:', error);
                    }
                  }, 1000);
                  
                  // Execute immediate Smart Import with current preview products
                  const autoApproveProducts = previewProducts.filter(p => p.automationAction === 'auto-approve');
                  const autoPendingProducts = previewProducts.filter(p => p.automationAction === 'auto-pending');
                  
                  if (autoApproveProducts.length > 0 || autoPendingProducts.length > 0) {
                    await executeAutomatedImport(autoApproveProducts, autoPendingProducts);
                  }
                  
                } catch (error) {
                  console.error('Error saving automation settings:', error);
                  toast({
                    title: "Error",
                    description: "Failed to save automation settings. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            >
              Save Settings & Execute Smart Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Automation Dialog */}
      <Dialog open={categoryAutomationDialog.open} onOpenChange={(open) => setCategoryAutomationDialog({ open })}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
              Category Automation Settings
            </DialogTitle>
            <DialogDescription>
              Configure smart automation framework for product categorization and approval workflows
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Smart Automation Framework */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">Smart Automation Framework</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-purple-700 dark:text-purple-300">Automation</span>
                  <Switch
                    checked={aiAutomationEnabled}
                    onCheckedChange={setAiAutomationEnabled}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>
              
              {aiAutomationEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* High Confidence Auto-Approve */}
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">High Confidence</span>
                      </div>
                      <Switch
                        checked={autoApproveHigh}
                        onCheckedChange={setAutoApproveHigh}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-700 dark:text-green-300">Threshold:</span>
                        <span className="text-xs font-mono bg-green-100 dark:bg-green-800 px-1 rounded">{highConfidenceThreshold}%+</span>
                      </div>
                      <input
                        type="range"
                        min={70}
                        max={95}
                        step={5}
                        value={highConfidenceThreshold}
                        onChange={(e) => setHighConfidenceThreshold(Number(e.target.value))}
                        className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-green-600 dark:text-green-400">
                        → Auto-approve to "Approved" status
                      </p>
                    </div>
                  </div>
                  
                  {/* Medium Confidence Auto-Pending */}
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Medium Confidence</span>
                      </div>
                      <Switch
                        checked={autoPendingMedium}
                        onCheckedChange={setAutoPendingMedium}
                        className="data-[state=checked]:bg-yellow-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-700 dark:text-yellow-300">Threshold:</span>
                        <span className="text-xs font-mono bg-yellow-100 dark:bg-yellow-800 px-1 rounded">{mediumConfidenceThreshold}%+</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={80}
                        step={5}
                        value={mediumConfidenceThreshold}
                        onChange={(e) => setMediumConfidenceThreshold(Number(e.target.value))}
                        className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        → Auto-import to "Pending" status
                      </p>
                    </div>
                  </div>
                  
                  {/* Low Confidence Manual Review */}
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">Low Confidence</span>
                      </div>
                      <Switch
                        checked={manualReviewLow}
                        onCheckedChange={setManualReviewLow}
                        className="data-[state=checked]:bg-red-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-700 dark:text-red-300">Below:</span>
                        <span className="text-xs font-mono bg-red-100 dark:bg-red-800 px-1 rounded">{mediumConfidenceThreshold}%</span>
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        → Hold in "Preview" for manual review
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!aiAutomationEnabled && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-2">
                  AI automation is disabled. All products will require manual review.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryAutomationDialog({ open: false })}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('/api/category-automation/settings', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      smartAutomationEnabled: aiAutomationEnabled,
                      highConfidenceEnabled: autoApproveHigh,
                      highConfidenceThreshold: highConfidenceThreshold,
                      highConfidenceAction: 'auto-approve',
                      mediumConfidenceEnabled: autoPendingMedium,
                      mediumConfidenceThreshold: mediumConfidenceThreshold,
                      mediumConfidenceAction: 'auto-import',
                      lowConfidenceEnabled: manualReviewLow,
                      lowConfidenceThreshold: lowConfidenceThreshold,
                      lowConfidenceAction: 'hold-preview'
                    }),
                  });

                  if (response.ok) {
                    const data = await response.json();
                    toast({
                      title: "Category Automation Saved",
                      description: "Smart automation framework settings saved successfully.",
                    });
                  } else {
                    throw new Error('Failed to save settings');
                  }
                  
                  setCategoryAutomationDialog({ open: false });
                } catch (error) {
                  console.error('Error saving category automation settings:', error);
                  toast({
                    title: "Error",
                    description: "Failed to save category automation settings. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Quantity Input Dialog */}
      <Dialog open={showCustomInput} onOpenChange={setShowCustomInput}>
        <DialogContent className="sm:max-w-md" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>Custom Product Import</DialogTitle>
            <DialogDescription>
              Enter the number of products you want to import for preview.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Number of Products</label>
              <input
                type="number"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                placeholder="e.g., 25, 50, 100"
                min="1"
                max="500"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum: 500 products per import</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomInput(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCustomImport}
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              disabled={!customQuantity || isNaN(parseInt(customQuantity)) || parseInt(customQuantity) < 1}
            >
              <Download className="w-4 h-4 mr-2" />
              Import {customQuantity} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Import Configuration Dialog */}
      <Dialog open={showAutoDownloadDialog} onOpenChange={setShowAutoDownloadDialog}>
        <DialogContent className="sm:max-w-lg" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>Auto-Download Configuration</DialogTitle>
            <DialogDescription>
              Configure automatic background download settings. Products will be downloaded and processed according to AI automation rules.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Download Interval</label>
              <select
                value={autoDownloadInterval}
                onChange={(e) => setAutoDownloadInterval(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <optgroup label="Testing & Development">
                  <option value="1">Every 1 minute</option>
                  <option value="2">Every 2 minutes</option>
                  <option value="3">Every 3 minutes</option>
                </optgroup>
                <optgroup label="Frequent Imports">
                  <option value="5">Every 5 minutes</option>
                  <option value="10">Every 10 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                </optgroup>
                <optgroup label="Hourly Intervals">
                  <option value="60">Every 1 hour</option>
                  <option value="120">Every 2 hours</option>
                  <option value="180">Every 3 hours</option>
                  <option value="240">Every 4 hours</option>
                  <option value="360">Every 6 hours</option>
                  <option value="480">Every 8 hours</option>
                  <option value="720">Every 12 hours</option>
                </optgroup>
                <optgroup label="Daily Schedules">
                  <option value="1440">Daily (Every 24 hours)</option>
                  <option value="2880">Every 2 days</option>
                  <option value="4320">Every 3 days</option>
                  <option value="10080">Weekly</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Products per Batch</label>
              <select
                value={autoDownloadBatchSize}
                onChange={(e) => setAutoDownloadBatchSize(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="5">5 Products</option>
                <option value="10">10 Products</option>
                <option value="15">15 Products</option>
                <option value="20">20 Products</option>
                <option value="25">25 Products</option>
                <option value="30">30 Products</option>
                <option value="50">50 Products</option>
                <option value="75">75 Products</option>
                <option value="100">100 Products</option>
              </select>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Auto-Download Features:</h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Downloads {autoDownloadBatchSize} products every {getIntervalLabel(autoDownloadInterval)}</li>
                <li>• Applies AI categorization and confidence scoring</li>
                <li>• Routes products based on automation rules</li>
                <li>• Skips already downloaded products</li>
                <li>• Respects API rate limits</li>
              </ul>
            </div>
            {autoDownloadEnabled && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Auto-Download is running: {autoDownloadBatchSize} products every {getIntervalLabel(autoDownloadInterval)}.
                </p>
                <Button
                  variant="outline"
                  onClick={handleAutoDownloadStop}
                  className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  Stop Auto-Download
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoDownloadDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAutoDownloadStart}
              style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              disabled={autoDownloadEnabled}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Auto-Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Amazon Rates Management Modal */}
      <Dialog open={showAmazonRatesModal} onOpenChange={setShowAmazonRatesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
              Amazon Commission Rates Management
            </DialogTitle>
            <DialogDescription>
              Configure and manage Amazon affiliate commission rates for automated earning calculations during product imports.
            </DialogDescription>
          </DialogHeader>
          
          <AmazonRatesManagement />
        </DialogContent>
      </Dialog>

      {/* Dropship Rate Card Modal */}
      <DropshipRateCardModal 
        isOpen={showDropshipRateModal} 
        onClose={() => setShowDropshipRateModal(false)} 
      />
    </div>
  );
}