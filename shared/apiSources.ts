// Universal API Sources Configuration
export interface APISource {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ecommerce' | 'marketplace' | 'wholesale' | 'file' | 'custom';
  requiresAuth: boolean;
  authFields?: {
    name: string;
    label: string;
    type: 'text' | 'password' | 'url' | 'select';
    placeholder?: string;
    required: boolean;
    options?: string[];
  }[];
  endpoints: {
    test: string;
    products: string;
    health: string;
    import?: string;
  };
  productMapping: {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    image?: string;
    stock?: string;
  };
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  features: {
    realTimeSync: boolean;
    bulkImport: boolean;
    categoryMapping: boolean;
    inventoryTracking: boolean;
  };
}

// Predefined API Sources Configuration
export const API_SOURCES: Record<string, APISource> = {
  woocommerce: {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Connect to your WooCommerce store for product import',
    icon: 'ExternalLink',
    category: 'ecommerce',
    requiresAuth: true,
    authFields: [
      { name: 'url', label: 'Store URL', type: 'url', placeholder: 'https://yourstore.com', required: true },
      { name: 'consumerKey', label: 'Consumer Key', type: 'text', required: true },
      { name: 'consumerSecret', label: 'Consumer Secret', type: 'password', required: true }
    ],
    endpoints: {
      test: '/api/woocommerce/test',
      products: '/api/woocommerce/products',
      health: '/api/woocommerce/connection-health',
      import: '/api/woocommerce/import'
    },
    productMapping: {
      id: 'id',
      name: 'name',
      description: 'description',
      price: 'price',
      category: 'categories[0].name',
      image: 'images[0].src',
      stock: 'stock_quantity'
    },
    rateLimits: {
      requestsPerMinute: 60,
      requestsPerHour: 1000
    },
    features: {
      realTimeSync: true,
      bulkImport: true,
      categoryMapping: true,
      inventoryTracking: true
    }
  },

  shopify: {
    id: 'shopify',
    name: 'Shopify',
    description: 'Connect to your Shopify store for product synchronization',
    icon: 'ShoppingBag',
    category: 'ecommerce',
    requiresAuth: true,
    authFields: [
      { name: 'shop', label: 'Shop Domain', type: 'text', placeholder: 'yourshop.myshopify.com', required: true },
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true }
    ],
    endpoints: {
      test: '/api/shopify/test',
      products: '/api/shopify/products',
      health: '/api/shopify/connection-health',
      import: '/api/shopify/import'
    },
    productMapping: {
      id: 'id',
      name: 'title',
      description: 'body_html',
      price: 'variants[0].price',
      category: 'product_type',
      image: 'images[0].src',
      stock: 'variants[0].inventory_quantity'
    },
    rateLimits: {
      requestsPerMinute: 40,
      requestsPerHour: 1000
    },
    features: {
      realTimeSync: true,
      bulkImport: true,
      categoryMapping: true,
      inventoryTracking: true
    }
  },

  amazon: {
    id: 'amazon',
    name: 'Amazon',
    description: 'Import products from Amazon Product Advertising API',
    icon: 'Package',
    category: 'marketplace',
    requiresAuth: true,
    authFields: [
      { name: 'accessKey', label: 'Access Key ID', type: 'text', required: true },
      { name: 'secretKey', label: 'Secret Access Key', type: 'password', required: true },
      { name: 'associateTag', label: 'Associate Tag', type: 'text', required: true },
      { name: 'marketplace', label: 'Marketplace', type: 'select', required: true, options: ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'CA', 'JP'] }
    ],
    endpoints: {
      test: '/api/amazon/test',
      products: '/api/amazon/products',
      health: '/api/amazon/connection-health',
      import: '/api/amazon/import'
    },
    productMapping: {
      id: 'ASIN',
      name: 'ItemInfo.Title.DisplayValue',
      description: 'ItemInfo.Features.DisplayValues',
      price: 'Offers.Listings[0].Price.DisplayAmount',
      category: 'BrowseNodeInfo.BrowseNodes[0].DisplayName',
      image: 'Images.Primary.Large.URL',
      stock: 'Offers.Listings[0].Availability.Type'
    },
    rateLimits: {
      requestsPerMinute: 8,
      requestsPerHour: 8640
    },
    features: {
      realTimeSync: false,
      bulkImport: true,
      categoryMapping: true,
      inventoryTracking: false
    }
  },

  aliexpress: {
    id: 'aliexpress',
    name: 'AliExpress',
    description: 'Import dropshipping products from AliExpress',
    icon: 'Globe',
    category: 'wholesale',
    requiresAuth: true,
    authFields: [
      { name: 'appKey', label: 'App Key', type: 'text', required: true },
      { name: 'appSecret', label: 'App Secret', type: 'password', required: true },
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true }
    ],
    endpoints: {
      test: '/api/aliexpress/test',
      products: '/api/aliexpress/products',
      health: '/api/aliexpress/connection-health',
      import: '/api/aliexpress/import'
    },
    productMapping: {
      id: 'product_id',
      name: 'product_title',
      description: 'product_detail_url',
      price: 'target_sale_price',
      category: 'category_name',
      image: 'product_main_image_url',
      stock: 'product_quantity'
    },
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 10000
    },
    features: {
      realTimeSync: false,
      bulkImport: true,
      categoryMapping: true,
      inventoryTracking: true
    }
  },

  csv_upload: {
    id: 'csv_upload',
    name: 'CSV File Upload',
    description: 'Upload products from CSV/Excel files with custom field mapping',
    icon: 'Upload',
    category: 'file',
    requiresAuth: false,
    endpoints: {
      test: '/api/csv/validate',
      products: '/api/csv/preview',
      health: '/api/csv/status',
      import: '/api/csv/import'
    },
    productMapping: {
      id: 'id',
      name: 'name',
      description: 'description',
      price: 'price',
      category: 'category',
      image: 'image_url',
      stock: 'stock'
    },
    features: {
      realTimeSync: false,
      bulkImport: true,
      categoryMapping: true,
      inventoryTracking: true
    }
  },

  custom_api: {
    id: 'custom_api',
    name: 'Custom API',
    description: 'Connect to any REST API with custom endpoint configuration',
    icon: 'Settings',
    category: 'custom',
    requiresAuth: true,
    authFields: [
      { name: 'baseUrl', label: 'Base URL', type: 'url', placeholder: 'https://api.example.com', required: true },
      { name: 'authMethod', label: 'Auth Method', type: 'select', required: true, options: ['API Key', 'Bearer Token', 'Basic Auth', 'OAuth2'] },
      { name: 'authValue', label: 'Auth Value', type: 'password', required: true },
      { name: 'productsEndpoint', label: 'Products Endpoint', type: 'text', placeholder: '/products', required: true }
    ],
    endpoints: {
      test: '/api/custom/test',
      products: '/api/custom/products',
      health: '/api/custom/connection-health',
      import: '/api/custom/import'
    },
    productMapping: {
      id: 'id',
      name: 'name',
      description: 'description',
      price: 'price',
      category: 'category',
      image: 'image',
      stock: 'stock'
    },
    features: {
      realTimeSync: false,
      bulkImport: true,
      categoryMapping: true,
      inventoryTracking: false
    }
  }
};

// Helper function to get source by ID
export const getAPISource = (id: string): APISource | undefined => {
  return API_SOURCES[id];
};

// Helper function to get all sources by category
export const getAPISourcesByCategory = (category: string): APISource[] => {
  return Object.values(API_SOURCES).filter(source => source.category === category);
};

// Helper function to get all source IDs
export const getAllSourceIds = (): string[] => {
  return Object.keys(API_SOURCES);
};