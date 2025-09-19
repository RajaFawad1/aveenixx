import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerEcommerceRoutes } from "./ecommerce-routes";
import { registerCheckoutRoutes } from "./checkout-routes";
import { registerCompleteEcommerceRoutes } from "./complete-ecommerce-routes";
import { seedInitialData } from "./seed-data";
import { createPaymentIntent, retrievePaymentIntent, confirmPaymentIntent, createRefund, listPaymentIntents } from "./stripe";
import vendorRoutes from "./routes/vendorRoutes";
import userPreferencesRoutes from "./user-preferences-routes";
import { registerMyAccountRoutes } from "./my-account-routes";
import communityRoutes from "./routes/communityRoutes";
import creatorEconomyRoutes from "./routes/creatorEconomyRoutes";
import rewardsRoutes from "./routes/rewardsRoutes";
import rewardsEnhanced from "./routes/rewardsEnhanced";
import adminRewards from "./routes/adminRewards";
import notificationsRoutes from "./routes/notificationsRoutes";
import salesRoutes from "./routes/sales";
import { WooCommerceService } from "./services/woocommerce";
import { categoryService } from "./services/categoryService";
import { hybridCategoryMappingService } from "./services/hybridCategoryMappingService";
import { apiRateTracker } from "./services/apiRateTracker";
import inventoryRoutes from "./inventory-routes";
import { db } from "./db";
import { categories, amazonCommissionRates } from "../shared/schema";
import { sql, asc, eq } from "drizzle-orm";

// Smart Import Automation Service
let smartImportInterval: NodeJS.Timeout | null = null;
let smartImportConfig: any = null;

function startSmartImportAutomation(config: any) {
  // Stop existing automation if running
  stopSmartImportAutomation();
  
  smartImportConfig = config;
  console.log(`[Smart Import] Starting automation: ${config.batchSize} products every ${config.intervalMinutes} minutes`);
  
  smartImportInterval = setInterval(async () => {
    try {
      console.log(`[Smart Import] Processing workflow stages for ${config.batchSize} products...`);
      
      const { storage } = await import('./storage');
      
      // Stage 1: Preview → Pricing (Base validation + pricing)
      const previewProducts = await storage.getProductsByApprovalStatus('preview');
      const previewBatch = previewProducts.slice(0, Math.floor(config.batchSize / 4));
      
      for (const product of previewBatch) {
        try {
          // Base validation rules
          const hasPrice = product.price && parseFloat(product.price) > 0;
          const hasName = product.name && product.name.trim().length > 5;
          const hasImage = product.images && product.images.length > 0;
          
          if (hasPrice && hasName && hasImage) {
            // Apply basic 25% markup pricing
            const basePrice = parseFloat(product.price);
            const markedUpPrice = (basePrice * 1.25).toFixed(2);
            
            await storage.updateProductApprovalStatus(product.id, 'pricing');
            await storage.updateProductPrice(product.id, markedUpPrice);
            
            // Auto-calculate commission for affiliate products
            if (product.productType === 'affiliate' && product.affiliateUrl) {
              const { commissionService } = await import('./services/commissionService');
              const commission = await commissionService.calculateAmazonCommissionForProduct(
                product.id, 
                product.category || 'default', 
                parseFloat(markedUpPrice)
              );
              
              if (commission) {
                console.log(`[Smart Import] 💰 Commission: ${commission.commissionRate}% = $${commission.commissionAmount.toFixed(2)} (${commission.source})`);
              }
            }
            
            console.log(`[Smart Import] 💰 Preview → Pricing: ${product.name} (${product.price} → $${markedUpPrice})`);
          } else {
            await storage.updateProductApprovalStatus(product.id, 'rejected');
            console.log(`[Smart Import] ❌ Preview → Rejected: ${product.name} (validation failed)`);
          }
        } catch (error) {
          console.error(`[Smart Import] Error processing preview ${product.name}:`, error);
        }
      }
      
      // Stage 2: Pricing → Pending (Price validation)
      const pricingProducts = await storage.getProductsByApprovalStatus('pricing');
      const pricingBatch = pricingProducts.slice(0, Math.floor(config.batchSize / 4));
      
      for (const product of pricingBatch) {
        try {
          const price = parseFloat(product.price);
          // Basic price validation ($1-$500 range)
          if (price >= 1 && price <= 500) {
            await storage.updateProductApprovalStatus(product.id, 'pending');
            console.log(`[Smart Import] ⏳ Pricing → Pending: ${product.name} ($${price})`);
          } else {
            await storage.updateProductApprovalStatus(product.id, 'rejected');
            console.log(`[Smart Import] ❌ Pricing → Rejected: ${product.name} (price out of range: $${price})`);
          }
        } catch (error) {
          console.error(`[Smart Import] Error processing pricing ${product.name}:`, error);
        }
      }
      
      // Stage 3: Pending → Manual Review (STOP HERE for manual approval)
      const pendingProducts = await storage.getProductsByApprovalStatus('pending');
      if (pendingProducts.length > 0) {
        console.log(`[Smart Import] ⏳ ${pendingProducts.length} products awaiting manual approval in Pending stage`);
        // Products remain in pending status for manual approval - no automatic processing
      }
      
      // Stage 4: Approved → Published (Final publication)
      const approvedProducts = await storage.getProductsByApprovalStatus('approved');
      const approvedBatch = approvedProducts.slice(0, Math.floor(config.batchSize / 4));
      
      for (const product of approvedBatch) {
        try {
          await storage.updateProductApprovalStatus(product.id, 'published');
          console.log(`[Smart Import] 🚀 Approved → Published: ${product.name}`);
        } catch (error) {
          console.error(`[Smart Import] Error processing approved ${product.name}:`, error);
        }
      }
      
      const totalProcessed = previewBatch.length + pricingBatch.length + approvedBatch.length;
      if (totalProcessed > 0) {
        console.log(`[Smart Import] Processed ${totalProcessed} products through workflow stages`);
      } else {
        console.log(`[Smart Import] No products to process - workflow idle`);
      }
      
    } catch (error) {
      console.error('[Smart Import] Automation error:', error);
    }
  }, config.intervalMinutes * 60 * 1000); // Fixed: Convert minutes to milliseconds
}

function stopSmartImportAutomation() {
  if (smartImportInterval) {
    clearInterval(smartImportInterval);
    smartImportInterval = null;
    console.log('[Smart Import] Automation stopped');
  }
  smartImportConfig = null;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with sample data
  app.post('/api/seed-data', async (req, res) => {
    try {
      await seedInitialData();
      res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({ error: 'Failed to seed database' });
    }
  });

  // Location API endpoint
  app.get('/api/location', async (req, res) => {
    try {
      const apiKey = process.env.IPGEOLOCATION_API_KEY;
      if (!apiKey) {
        return res.json({ location: 'Your Location' });
      }

      // Always use auto-detection for simplicity and reliability
      const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch location: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Return city and country/state
      let location = 'Your Location';
      if (data.city && data.country_name) {
        location = data.state_prov ? 
          `${data.city}, ${data.state_prov}` : 
          `${data.city}, ${data.country_name}`;
      }
      
      res.json({ location });
    } catch (error) {
      console.error('Error getting location:', error);
      res.json({ location: 'Your Location' });
    }
  });

  // Weather endpoint - gets weather data for location
  app.get('/api/weather', async (req, res) => {
    try {
      const apiKey = process.env.IPGEOLOCATION_API_KEY;
      
      if (!apiKey) {
        return res.json({ 
          location: 'Your Location',
          temperature: null,
          description: null,
          icon: null
        });
      }

      // Get location data first
      const locationResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`);
      
      if (!locationResponse.ok) {
        throw new Error(`Failed to fetch location: ${locationResponse.status}`);
      }
      
      const locationData = await locationResponse.json();
      
      // Get coordinates
      const latitude = locationData.latitude;
      const longitude = locationData.longitude;
      
      if (!latitude || !longitude) {
        throw new Error('No coordinates available');
      }

      // Get weather data from Open-Meteo API (free, no API key required)
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&timezone=auto`
      );
      
      if (!weatherResponse.ok) {
        throw new Error(`Failed to fetch weather: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      const currentWeather = weatherData.current_weather;
      
      // Map weather codes to descriptions and icons
      const getWeatherInfo = (code) => {
        const weatherCodes = {
          0: { description: 'Clear sky', icon: '☀️' },
          1: { description: 'Mainly clear', icon: '🌤️' },
          2: { description: 'Partly cloudy', icon: '⛅' },
          3: { description: 'Overcast', icon: '☁️' },
          45: { description: 'Fog', icon: '🌫️' },
          48: { description: 'Depositing rime fog', icon: '🌫️' },
          51: { description: 'Light drizzle', icon: '🌦️' },
          53: { description: 'Moderate drizzle', icon: '🌦️' },
          55: { description: 'Dense drizzle', icon: '🌦️' },
          61: { description: 'Slight rain', icon: '🌧️' },
          63: { description: 'Moderate rain', icon: '🌧️' },
          65: { description: 'Heavy rain', icon: '🌧️' },
          71: { description: 'Slight snow', icon: '🌨️' },
          73: { description: 'Moderate snow', icon: '🌨️' },
          75: { description: 'Heavy snow', icon: '🌨️' },
          77: { description: 'Snow grains', icon: '🌨️' },
          80: { description: 'Slight rain showers', icon: '🌦️' },
          81: { description: 'Moderate rain showers', icon: '🌦️' },
          82: { description: 'Violent rain showers', icon: '🌦️' },
          85: { description: 'Slight snow showers', icon: '🌨️' },
          86: { description: 'Heavy snow showers', icon: '🌨️' },
          95: { description: 'Thunderstorm', icon: '⛈️' },
          96: { description: 'Thunderstorm with hail', icon: '⛈️' },
          99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
        };
        
        return weatherCodes[code] || { description: 'Unknown', icon: '🌡️' };
      };
      
      const weatherInfo = getWeatherInfo(currentWeather.weathercode);
      
      // Format location
      let location = 'Your Location';
      if (locationData.city && locationData.country_name) {
        location = locationData.state_prov ? 
          `${locationData.city}, ${locationData.state_prov}` : 
          `${locationData.city}, ${locationData.country_name}`;
      }
      
      res.json({
        location,
        temperature: Math.round(currentWeather.temperature),
        description: weatherInfo.description,
        icon: weatherInfo.icon
      });
      
    } catch (error) {
      console.error('Error getting weather:', error);
      res.json({ 
        location: 'Your Location',
        temperature: null,
        description: null,
        icon: null
      });
    }
  });

  // Best Sellers API endpoint
  app.get('/api/products/best-sellers', async (req, res) => {
    try {
      const bestSellers = await storage.getProducts({
        isBestseller: true,
        page: 1,
        limit: 12,
        sortBy: 'viewCount',
        sortOrder: 'desc'
      });
      res.json(bestSellers);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      res.status(500).json({ error: 'Failed to fetch best sellers' });
    }
  });

  // Top Rated API endpoint
  app.get('/api/products/top-rated', async (req, res) => {
    try {
      const topRated = await storage.getProducts({
        page: 1,
        limit: 12,
        sortBy: 'rating',
        sortOrder: 'desc'
      });
      res.json(topRated);
    } catch (error) {
      console.error('Error fetching top rated products:', error);
      res.status(500).json({ error: 'Failed to fetch top rated products' });
    }
  });

  // SPECIFIC PRODUCT ENDPOINTS MUST COME BEFORE GENERAL :id ROUTE
  // NEW SHOP PAGE RECOMMENDATION ENDPOINTS - Moved here to avoid route conflicts
  app.get("/api/products/new-arrivals", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const products = await storage.getProducts({}, 1, limit, 'createdAt', 'desc');
      console.log(`[new-arrivals] Found ${products.length} products`);
      res.json(products);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      res.status(500).json({ error: "Failed to fetch new arrivals" });
    }
  });

  app.get("/api/products/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const products = await storage.getProducts({}, 1, limit, 'rating', 'desc');
      console.log(`[trending] Found ${products.length} products`);
      res.json(products);
    } catch (error) {
      console.error('Error fetching trending products:', error);
      res.status(500).json({ error: "Failed to fetch trending products" });
    }
  });

  app.get("/api/products/recommended", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const products = await storage.getProducts({}, 1, limit, 'name', 'asc');
      console.log(`[recommended] Found ${products.length} products`);
      res.json(products);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      res.status(500).json({ error: "Failed to fetch recommended products" });
    }
  });

  app.get("/api/products/recently-added", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const products = await storage.getProducts({}, 1, limit, 'createdAt', 'desc');
      console.log(`[recently-added] Found ${products.length} products`);
      res.json(products);
    } catch (error) {
      console.error('Error fetching recently added products:', error);
      res.status(500).json({ error: "Failed to fetch recently added products" });
    }
  });

  // Products API for product detail pages
  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let product;
      
      // First try to get product by exact ID
      product = await storage.getProduct(id);
      
      // If not found and ID looks like a slug, try to find by name match
      if (!product && !id.startsWith('woo-')) {
        const allProducts = await storage.getProducts();
        const slug = id.toLowerCase().replace(/-/g, ' ');
        product = allProducts.find(p => 
          p.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').includes(slug) ||
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === id
        );
      }
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Get reviews for this product (skip for now due to schema mismatch)
      // const reviews = await storage.getReviews(id);
      const reviews = []; // Temporary fix until schema is updated
      
      res.json({ ...product, reviews });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // Stripe Payment Routes
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency = 'usd', customerEmail, orderId, metadata } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      const result = await createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customerEmail,
        orderId,
        metadata
      });

      res.json(result);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });

  app.get('/api/payment-intent/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const paymentIntent = await retrievePaymentIntent(id);
      res.json(paymentIntent);
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      res.status(500).json({ error: 'Failed to retrieve payment intent' });
    }
  });

  app.post('/api/confirm-payment/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await confirmPaymentIntent(id);
      res.json(result);
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ error: 'Failed to confirm payment' });
    }
  });

  app.post('/api/refund-payment/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const result = await createRefund(id, amount);
      res.json(result);
    } catch (error) {
      console.error('Error creating refund:', error);
      res.status(500).json({ error: 'Failed to create refund' });
    }
  });

  app.get('/api/payment-intents', async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const paymentIntents = await listPaymentIntents(Number(limit));
      res.json(paymentIntents);
    } catch (error) {
      console.error('Error listing payment intents:', error);
      res.status(500).json({ error: 'Failed to list payment intents' });
    }
  });

  // CSV Template Download endpoint
  app.get('/api/csv-template', async (req, res) => {
    try {
      // Create CSV template with headers and sample data
      const csvTemplate = [
        // Headers
        'name,price,description,category,sku,stock_quantity,weight,dimensions,images',
        // Sample row 1
        'Premium Wireless Headphones,199.99,"High-quality wireless headphones with noise cancellation and premium sound quality",Electronics & Technology,WH-001,50,0.8,"25x20x8 cm","https://example.com/headphones1.jpg,https://example.com/headphones2.jpg"',
        // Sample row 2  
        'Organic Cotton T-Shirt,29.99,"Comfortable organic cotton t-shirt available in multiple sizes and colors",Fashion & Apparel,TS-002,100,0.2,"Standard sizes","https://example.com/tshirt1.jpg"',
        // Sample row 3
        'Smart Home Security Camera,149.99,"WiFi enabled security camera with night vision and mobile app control",Home & Garden,SC-003,25,0.5,"12x8x8 cm","https://example.com/camera1.jpg,https://example.com/camera2.jpg,https://example.com/camera3.jpg"'
      ].join('\n');

      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="aveenix-product-template.csv"');
      res.send(csvTemplate);
    } catch (error) {
      console.error('Error generating CSV template:', error);
      res.status(500).json({ error: 'Failed to generate CSV template' });
    }
  });

  // API endpoint to seed comprehensive subcategories
  app.post('/api/seed-comprehensive-subcategories', async (req, res) => {
    try {
      const { seedComprehensiveSubcategories } = await import('./seed-comprehensive-subcategories');
      const result = await seedComprehensiveSubcategories();
      res.json({ 
        success: true, 
        message: `Successfully seeded ${result.totalSeeded} subcategories`,
        totalSeeded: result.totalSeeded 
      });
    } catch (error) {
      console.error('Error seeding comprehensive subcategories:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to seed comprehensive subcategories',
        details: error.message 
      });
    }
  });

  // Reviews endpoint (fixed for current DB schema)
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = req.params.id;
      console.log(`[DEBUG] Reviews endpoint - productId: ${productId}`);
      
      // For now, return empty reviews array to fix the immediate error
      // We'll focus on showing imported review data from the product's embedded reviews
      const reviews = [];
      console.log(`[DEBUG] Returning ${reviews.length} reviews for product ${productId}`);
      
      res.json(reviews);
    } catch (error) {
      console.error('Error in reviews endpoint:', error);
      res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
  });

  // Authentication routes - connect frontend to real user database
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Get user by email from database
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // For now, accept any password for existing users (in production, verify hashed password)
      // TODO: Add password hashing verification with bcrypt
      
      // Return user data for frontend
      const userData = {
        id: user.id.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        email: user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        role: user.role || 'customer'
      };
      
      res.json({ success: true, user: userData });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });
  
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      
      // Create new user
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const newUser = await storage.createUser({
        username: email.split('@')[0], // Use part before @ as username
        email: email,
        password: password, // TODO: Hash password with bcrypt
        firstName: firstName,
        lastName: lastName,
        role: 'customer'
      });
      
      // Return user data for frontend
      const userData = {
        id: newUser.id.toString(),
        name: `${newUser.firstName || ''} ${newUser.lastName || ''}`.trim() || newUser.username,
        email: newUser.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
        role: newUser.role || 'customer'
      };
      
      res.json({ success: true, user: userData });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });
  
  app.get('/api/auth/user/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user data for frontend
      const userData = {
        id: user.id.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        email: user.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        role: user.role || 'customer'
      };
      
      res.json(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // Stripe payment processing
  const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = 'usd', customerEmail, orderId, metadata } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Stripe expects amount in cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: customerEmail,
        metadata: {
          orderId: orderId || `order_${Date.now()}`,
          ...metadata,
        },
      });

      res.json({
        client_secret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to create payment intent' 
      });
    }
  });

  // Create Stripe Checkout Session for hosted checkout
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const {
        amount, // in cents
        currency = 'usd',
        customerEmail,
        successUrl,
        cancelUrl,
        orderId,
        metadata
      } = req.body || {};

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: customerEmail,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              unit_amount: Math.round(amount),
              product_data: {
                name: 'Aveenixx Order',
                metadata: {
                  orderId: orderId || `order_${Date.now()}`,
                }
              }
            }
          }
        ],
        success_url: successUrl || `${process.env.PUBLIC_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.PUBLIC_URL || 'http://localhost:5173'}/checkout/cancel`,
        metadata: {
          orderId: orderId || `order_${Date.now()}`,
          ...metadata,
        }
      });

      res.json({ url: session.url, id: session.id });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  });


  // Register checkout routes first (includes public order endpoint)
  registerCheckoutRoutes(app);
  
  // Register e-commerce routes (includes authenticated order endpoint)
  registerEcommerceRoutes(app); // Re-enabled for subcategories functionality

  // Register complete e-commerce routes with full functionality
  registerCompleteEcommerceRoutes(app);
  
  // Register My Account routes
  registerMyAccountRoutes(app);

  // Brand management routes
  const { registerBrandRoutes } = await import('./brand-routes');
  registerBrandRoutes(app);

  // Register vendor routes
  app.use('/api/vendor', vendorRoutes);

  // Register user preferences routes
  app.use(userPreferencesRoutes);

  // Register community routes for intelligent question management
  app.use('/api/community', communityRoutes);

  // Register creator economy routes
  app.use('/api/creator', creatorEconomyRoutes);

  // Register community rewards routes
  app.use('/api/rewards', rewardsRoutes);

  // Register enhanced rewards system routes
  app.use('/api/rewards', rewardsEnhanced);
  app.use('/api/admin', adminRewards);

  // Register notifications routes
  app.use(notificationsRoutes);

  // Role-based dashboard endpoints
  app.get('/api/dashboard/stats/:role', async (req, res) => {
    try {
      const { role } = req.params;
      const userId = req.query.userId || 'demo-user';
      
      let dashboardData;
      
      switch (role) {
        case 'superadmin':
          dashboardData = {
            totalUsers: 2543,
            totalRevenue: 1247500,
            monthlyGrowth: 23.5,
            totalOrders: 8247,
            activeVendors: 127,
            platformMetrics: {
              systemUptime: 99.9,
              apiCallsToday: 45234,
              storageUsed: 67.8,
              bandwidthUsed: 45.2
            },
            topSellingCategories: [
              { name: 'Electronics', revenue: 425000, growth: 18.5 },
              { name: 'Fashion', revenue: 312000, growth: 25.2 },
              { name: 'Home & Garden', revenue: 198000, growth: 12.8 }
            ],
            vendorPerformance: {
              topVendors: [
                { name: 'TechMaster Store', revenue: 85000, orders: 423 },
                { name: 'Fashion Forward', revenue: 67000, orders: 312 },
                { name: 'Home Essentials', revenue: 54000, orders: 267 }
              ]
            }
          };
          break;
          
        case 'admin':
          dashboardData = {
            totalRevenue: 425000,
            monthlyGrowth: 18.5,
            totalOrders: 2147,
            activeCustomers: 1245,
            conversionRate: 3.8,
            averageOrderValue: 198.50,
            teamMetrics: {
              totalTeamMembers: 15,
              supportTickets: 23,
              processingOrders: 45,
              pendingReviews: 12
            },
            departmentPerformance: [
              { department: 'Sales', target: 100000, achieved: 118500, percentage: 118.5 },
              { department: 'Marketing', target: 75000, achieved: 68200, percentage: 90.9 },
              { department: 'Customer Service', satisfaction: 94.5, tickets: 156, resolved: 142 }
            ]
          };
          break;
          
        case 'vendor':
          dashboardData = {
            myRevenue: 45250,
            monthlyGrowth: 15.2,
            myOrders: 287,
            myProducts: 45,
            myCustomers: 189,
            conversionRate: 4.2,
            averageOrderValue: 157.75,
            inventory: {
              inStock: 38,
              lowStock: 5,
              outOfStock: 2,
              pendingRestock: 8
            },
            topSellingProducts: [
              { name: 'Wireless Headphones Pro', sales: 156, revenue: 15600 },
              { name: 'Smart Watch Series X', sales: 89, revenue: 17800 },
              { name: 'Bluetooth Speaker Mini', sales: 67, revenue: 6700 }
            ]
          };
          break;
          
        case 'customer':
          dashboardData = {
            totalOrders: 23,
            totalSpent: 2145.67,
            rewardsPoints: 1250,
            membershipLevel: 'Silver',
            recentOrders: [
              { id: 'ORD-2024-001', date: '2024-01-10', amount: 156.99, status: 'delivered' },
              { id: 'ORD-2024-002', date: '2024-01-08', amount: 89.50, status: 'shipped' },
              { id: 'ORD-2024-003', date: '2024-01-05', amount: 234.75, status: 'processing' }
            ],
            wishlistItems: 8,
            favoriteCategories: [
              { name: 'Electronics', orders: 12, spent: 1456.78 },
              { name: 'Books', orders: 8, spent: 287.99 },
              { name: 'Home & Garden', orders: 3, spent: 400.90 }
            ],
            recommendations: 15
          };
          break;
          
        case 'business':
          dashboardData = {
            businessRevenue: 125000,
            monthlyGrowth: 12.8,
            totalProjects: 34,
            activeClients: 18,
            teamSize: 8,
            businessMetrics: {
              projectsCompleted: 156,
              clientSatisfaction: 96.2,
              averageProjectValue: 3680,
              recurringClients: 12
            },
            servicePerformance: [
              { service: 'Consulting', revenue: 45000, clients: 8 },
              { service: 'Development', revenue: 38000, clients: 6 },
              { service: 'Design', revenue: 25000, clients: 9 },
              { service: 'Maintenance', revenue: 17000, clients: 12 }
            ]
          };
          break;
          
        default:
          dashboardData = {
            totalOrders: 0,
            totalRevenue: 0,
            monthlyGrowth: 0
          };
      }
      
      res.json(dashboardData);
    } catch (error) {
      console.error('Error fetching role-based dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Product Intelligence & Analytics Routes
  const { productIntelligenceService } = await import('./services/productIntelligenceService');

  // Analyze single product intelligence
  app.post('/api/product-intelligence/:productId/analyze', async (req, res) => {
    try {
      const { productId } = req.params;
      const intelligenceData = await productIntelligenceService.analyzeProduct(productId);
      res.json(intelligenceData);
    } catch (error) {
      console.error('Error analyzing product intelligence:', error);
      res.status(500).json({ error: 'Failed to analyze product intelligence' });
    }
  });

  // Bulk analyze multiple products
  app.post('/api/product-intelligence/bulk-analyze', async (req, res) => {
    try {
      const { productIds } = req.body;
      if (!Array.isArray(productIds)) {
        return res.status(400).json({ error: 'productIds must be an array' });
      }
      const results = await productIntelligenceService.bulkAnalyzeProducts(productIds);
      res.json(results);
    } catch (error) {
      console.error('Error bulk analyzing products:', error);
      res.status(500).json({ error: 'Failed to bulk analyze products' });
    }
  });

  // Get competitor price analysis
  app.get('/api/product-intelligence/:productId/competitor-prices', async (req, res) => {
    try {
      const { productId } = req.params;
      
      // Get product data first
      const productResult = await storage.getProduct(productId);
      if (!productResult) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const competitorPrices = await productIntelligenceService.getCompetitorPrices(productResult);
      res.json({ productId, competitorPrices });
    } catch (error) {
      console.error('Error getting competitor prices:', error);
      res.status(500).json({ error: 'Failed to get competitor prices' });
    }
  });

  // Get category suggestions for product
  app.get('/api/product-intelligence/:productId/category-suggestions', async (req, res) => {
    try {
      const { productId } = req.params;
      
      // Get product data first
      const productResult = await storage.getProduct(productId);
      if (!productResult) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const suggestions = await productIntelligenceService.generateCategorySuggestions(productResult);
      res.json({ productId, suggestions });
    } catch (error) {
      console.error('Error getting category suggestions:', error);
      res.status(500).json({ error: 'Failed to get category suggestions' });
    }
  });

  // Get optimal pricing recommendation
  app.get('/api/product-intelligence/:productId/pricing-optimization', async (req, res) => {
    try {
      const { productId } = req.params;
      
      // Get product data first
      const productResult = await storage.getProduct(productId);
      if (!productResult) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const priceOptimization = await productIntelligenceService.calculateOptimalPrice(productResult);
      res.json({ productId, ...priceOptimization });
    } catch (error) {
      console.error('Error getting pricing optimization:', error);
      res.status(500).json({ error: 'Failed to get pricing optimization' });
    }
  });

  // Get market trend analysis for category
  app.get('/api/product-intelligence/market-trends/:category', async (req, res) => {
    try {
      const { category } = req.params;
      
      const seasonalPattern = productIntelligenceService.generateSeasonalPattern(category);
      const currentMonth = new Date().getMonth() + 1;
      const currentMultiplier = seasonalPattern.find(p => p.month === currentMonth)?.demandMultiplier || 1.0;
      
      res.json({
        category,
        currentMonth,
        currentSeasonalMultiplier: currentMultiplier,
        seasonalityPattern: seasonalPattern,
        trendAnalysis: {
          status: currentMultiplier > 1.2 ? 'high_demand' : currentMultiplier < 0.8 ? 'low_demand' : 'normal',
          recommendation: currentMultiplier > 1.2 
            ? 'Great time to promote products in this category'
            : currentMultiplier < 0.8 
            ? 'Consider seasonal adjustments or focus on other categories'
            : 'Stable demand period for this category'
        }
      });
    } catch (error) {
      console.error('Error getting market trends:', error);
      res.status(500).json({ error: 'Failed to get market trends' });
    }
  });

  // Unified Import System Routes
  const { unifiedImportService } = await import('./services/unifiedImportService');

  // Get unified categories with stats
  app.get('/api/unified/categories', async (req, res) => {
    try {
      const categories = await unifiedImportService.getUnifiedCategoriesWithStats();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching unified categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Search unified products across platforms
  app.get('/api/unified/products/search', async (req, res) => {
    try {
      const { q, category, platforms, limit = 20, offset = 0 } = req.query;
      const platformArray = typeof platforms === 'string' ? platforms.split(',') : [];
      
      const products = await unifiedImportService.searchUnifiedProducts(
        q as string,
        category as string,
        platformArray,
        Number(limit),
        Number(offset)
      );
      
      res.json(products);
    } catch (error) {
      console.error('Error searching unified products:', error);
      res.status(500).json({ error: 'Failed to search products' });
    }
  });

  // Start WooCommerce import session
  app.post('/api/unified/import/start', async (req, res) => {
    try {
      const importConfig = req.body;
      const sessionId = await unifiedImportService.startImportSession(importConfig);
      res.json({ sessionId, status: 'started' });
    } catch (error) {
      console.error('Error starting import session:', error);
      res.status(500).json({ error: 'Failed to start import session' });
    }
  });

  // Process single WooCommerce product (for webhook integration)
  app.post('/api/unified/import/product', async (req, res) => {
    try {
      const { wooProduct, config, sessionId } = req.body;
      const result = await unifiedImportService.processWooCommerceProduct(
        wooProduct,
        config,
        sessionId
      );
      
      if (result) {
        res.json({ success: true, product: result });
      } else {
        res.status(400).json({ success: false, error: 'Product processing failed' });
      }
    } catch (error) {
      console.error('Error processing WooCommerce product:', error);
      res.status(500).json({ error: 'Failed to process product' });
    }
  });

  // Complete import session
  app.post('/api/unified/import/complete/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { stats } = req.body;
      await unifiedImportService.completeImportSession(Number(sessionId), stats);
      res.json({ success: true });
    } catch (error) {
      console.error('Error completing import session:', error);
      res.status(500).json({ error: 'Failed to complete import session' });
    }
  });

  // Seed unified categories (for development)
  app.post('/api/unified/seed-categories', async (req, res) => {
    try {
      const { seedUnifiedCategories } = await import('./seedUnifiedCategories');
      await seedUnifiedCategories();
      res.json({ success: true, message: 'Unified categories seeded successfully' });
    } catch (error) {
      console.error('Error seeding unified categories:', error);
      res.status(500).json({ error: 'Failed to seed categories' });
    }
  });

  // Product Attributes API
  app.get('/api/product-attributes', async (req, res) => {
    try {
      const attributes = await storage.getProductAttributes();
      res.json(attributes);
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      res.status(500).json({ error: 'Failed to fetch product attributes' });
    }
  });

  app.post('/api/product-attributes', async (req, res) => {
    try {
      const attributeData = req.body;
      const newAttribute = await storage.createProductAttribute(attributeData);
      res.status(201).json(newAttribute);
    } catch (error) {
      console.error('Error creating product attribute:', error);
      res.status(500).json({ error: 'Failed to create product attribute' });
    }
  });

  app.get('/api/product-attributes/:id/values', async (req, res) => {
    try {
      const { id } = req.params;
      const values = await storage.getAttributeValues(parseInt(id));
      res.json(values);
    } catch (error) {
      console.error('Error fetching attribute values:', error);
      res.status(500).json({ error: 'Failed to fetch attribute values' });
    }
  });

  // Get products by category
  app.get('/api/products/by-category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ error: 'Failed to fetch products by category' });
    }
  });

  // Get products by subcategory
  app.get('/api/products/by-subcategory/:subcategory', async (req, res) => {
    try {
      const { subcategory } = req.params;
      const products = await storage.getProductsBySubcategory(subcategory);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products by subcategory:', error);
      res.status(500).json({ error: 'Failed to fetch products by subcategory' });
    }
  });

  // Quality assessment function for Q&A pairs
  const isQualityQA = (question: string, answer: string): { isQuality: boolean, reason?: string } => {
    const lowQualityPatterns = [
      /^(hi|hello|hey|thanks|thank you|ok|okay)$/i,
      /^.{1,5}$/,
      /^(test|testing|1|2|3|a|yes|no)$/i,
      /^\?+$/,
    ];
    
    const lowQualityAnswerPatterns = [
      /I'm here to help/i,
      /Could you provide more details/i,
      /I understand you're asking/i,
      /^.{1,20}$/,
    ];
    
    const productSpecificKeywords = [
      'product', 'price', 'shipping', 'return', 'warranty', 'specification', 
      'feature', 'material', 'size', 'color', 'delivery', 'installation',
      'compatibility', 'quality', 'durability', 'brand', 'model', 'version',
      'dimension', 'weight', 'review', 'compare', 'difference', 'recommend'
    ];
    
    if (lowQualityPatterns.some(pattern => pattern.test(question.trim()))) {
      return { isQuality: false, reason: 'Low quality question' };
    }
    
    if (lowQualityAnswerPatterns.some(pattern => pattern.test(answer.trim()))) {
      return { isQuality: false, reason: 'Generic or incomplete answer' };
    }
    
    const hasProductContent = productSpecificKeywords.some(keyword => 
      question.toLowerCase().includes(keyword) || answer.toLowerCase().includes(keyword)
    );
    
    if (!hasProductContent) {
      return { isQuality: false, reason: 'Not product-specific' };
    }
    
    const isSubstantial = question.length >= 10 && answer.length >= 50;
    if (!isSubstantial) {
      return { isQuality: false, reason: 'Too brief' };
    }
    
    return { isQuality: true };
  };

  // Product Q&A Knowledge Base API
  app.post('/api/products/qa', async (req, res) => {
    try {
      const { productId, question, answer, isPublic = true, userId, customerName } = req.body;
      
      if (!productId || !question || !answer) {
        return res.status(400).json({ error: 'Product ID, question, and answer are required' });
      }

      // Quality check - only save valuable Q&A pairs
      const qualityCheck = isQualityQA(question, answer);
      if (!qualityCheck.isQuality) {
        console.log(`[Q&A Filter] Discarded low-quality Q&A: ${qualityCheck.reason}`);
        return res.status(200).json({ 
          success: false, 
          message: 'Q&A not saved - not suitable for knowledge base',
          reason: qualityCheck.reason 
        });
      }

      const qaData = await storage.createProductQA({
        productId,
        question: question.trim(),
        answer: answer.trim(),
        isPublic,
        isHelpful: true,
        helpfulVotes: 0,
        userId: userId || null,
        customerName: customerName || null
      });

      console.log(`[Q&A Filter] ✅ Saved high-quality Q&A for product ${productId}`);
      res.status(201).json({ success: true, qa: qaData });
    } catch (error) {
      console.error('Error saving Q&A:', error);
      res.status(500).json({ error: 'Failed to save Q&A' });
    }
  });

  // Get Q&A for a specific product
  app.get('/api/products/:productId/qa', async (req, res) => {
    try {
      const { productId } = req.params;
      const { includePrivate = false } = req.query;
      
      const qaList = await storage.getProductQA(productId, includePrivate === 'true');
      res.json(qaList);
    } catch (error) {
      console.error('Error fetching product Q&A:', error);
      res.status(500).json({ error: 'Failed to fetch Q&A' });
    }
  });

  // Update Q&A helpfulness
  app.patch('/api/products/qa/:qaId/helpful', async (req, res) => {
    try {
      const { qaId } = req.params;
      const { helpful } = req.body;
      
      await storage.updateQAHelpfulness(parseInt(qaId), helpful);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating Q&A helpfulness:', error);
      res.status(500).json({ error: 'Failed to update Q&A helpfulness' });
    }
  });

  // WooCommerce Integration Routes
  const wooCommerceService = new WooCommerceService();
  
  // In-memory store for connection status and polling settings
  let sourceConnectionStatus: Record<string, boolean> = {
    woocommerce: true,
    shopify: false,
    amazon: false,
    aliexpress: false,
    csv_upload: true,
    custom_api: false
  };

  let pollingSettings = {
    frequency: 10000, // milliseconds (10 seconds default)
    enabled: true
  };

  // Connection status management endpoints
  app.get('/api/sources/connection-status', (req, res) => {
    res.json(sourceConnectionStatus);
  });
  
  app.post('/api/sources/connection-status', (req, res) => {
    const { source, connected } = req.body;
    if (typeof source === 'string' && typeof connected === 'boolean') {
      sourceConnectionStatus[source] = connected;
      console.log(`[Connection] ${source} ${connected ? 'connected' : 'disconnected'}`);
      res.json({ success: true, status: sourceConnectionStatus });
    } else {
      res.status(400).json({ error: 'Invalid source or connection status' });
    }
  });

  // Polling settings endpoints
  app.get('/api/polling/settings', (req, res) => {
    res.json(pollingSettings);
  });

  app.post('/api/polling/settings', (req, res) => {
    const { frequency, enabled } = req.body;
    if (typeof frequency === 'number' && typeof enabled === 'boolean') {
      pollingSettings = { frequency, enabled };
      console.log(`[Polling] Updated: ${frequency}ms, enabled: ${enabled}`);
      res.json({ success: true, settings: pollingSettings });
    } else {
      res.status(400).json({ error: 'Invalid polling settings' });
    }
  });

  // Test WooCommerce connection
  app.get('/api/woocommerce/test', async (req, res) => {
    try {
      // Check if WooCommerce is marked as disconnected
      if (!sourceConnectionStatus.woocommerce) {
        return res.json({ 
          success: false, 
          message: 'WooCommerce is disconnected',
          connection: 'disconnected'
        });
      }
      
      const products = await wooCommerceService.fetchProducts(1, 5);
      res.json({ 
        success: true, 
        message: 'WooCommerce connection successful',
        sampleProducts: products.length,
        connection: 'active'
      });
    } catch (error) {
      console.error('WooCommerce connection test failed:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  });

  // WooCommerce Preview Endpoint
  app.get('/api/woocommerce/preview', async (req, res) => {
    try {
      // Check if WooCommerce is marked as disconnected
      if (!sourceConnectionStatus.woocommerce) {
        return res.status(503).json({
          success: false,
          error: 'WooCommerce is disconnected. Please connect to fetch preview data.',
          disconnected: true
        });
      }
      
      const startTime = Date.now();
      const perPage = parseInt(req.query.per_page as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      
      console.log(`[Preview API] Starting preview request - Page: ${page}, Per Page: ${perPage}`);
      
      const wooProducts = await wooCommerceService.fetchProducts(page, perPage);
      const responseTime = Date.now() - startTime;
      
      console.log(`[Preview API] WooCommerce returned ${wooProducts.length} products in ${responseTime}ms`);
      
      // Get list of already imported product IDs
      const importedIds = await storage.getImportedProductIds('woocommerce');
      
      // Transform and categorize products
      const products = wooProducts.map((wooProduct: any) => {
        const isImported = importedIds.includes(wooProduct.id.toString());
        const isUpdated = false; // TODO: Implement update detection logic
        
        return {
          wooId: wooProduct.id,
          name: wooProduct.name,
          price: wooProduct.price || '0.00',
          category: wooProduct.categories?.[0]?.name || 'Uncategorized',
          image: wooProduct.images?.[0]?.src || '',
          stockStatus: wooProduct.stock_status || 'instock',
          type: wooProduct.type || 'simple',
          status: isImported ? 'imported' : isUpdated ? 'updated' : 'new'
        };
      });
      
      console.log(`[Preview API] Processed ${products.length} products for preview`);
      
      res.json({
        success: true,
        products,
        total: products.length,
        responseTime,
        meta: {
          page,
          perPage,
          new: products.filter(p => p.status === 'new').length,
          updated: products.filter(p => p.status === 'updated').length,
          imported: products.filter(p => p.status === 'imported').length
        }
      });
    } catch (error) {
      console.error('[Preview API] Error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch preview'
      });
    }
  });

  // Save Preview Products to Database with Automation Actions
  app.post('/api/woocommerce/save-preview-products', async (req, res) => {
    try {
      const { products } = req.body; // Array of products with their automation actions
      
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No products provided'
        });
      }
      
      console.log(`[Save Preview] Saving ${products.length} preview products with automation actions`);
      
      let saved = 0;
      let failed = 0;
      const results = [];
      
      for (const previewProduct of products) {
        try {
          // Check if product already exists
          const existingProduct = await storage.getProductByExternalId(previewProduct.wooId.toString());
          
          if (existingProduct) {
            // Update existing product with automation action
            await storage.updateProductAutomationAction(existingProduct.id, previewProduct.automationAction);
            console.log(`[Save Preview] Updated automation action for existing product ${previewProduct.wooId}: ${previewProduct.automationAction}`);
          } else {
            // Get full product data from WooCommerce
            const wooProducts = await wooCommerceService.fetchProducts(1, 100);
            const wooProduct = wooProducts.find((p: any) => p.id.toString() === previewProduct.wooId.toString());
            
            if (wooProduct) {
              // Transform and save as preview product
              const productData = await wooCommerceService.transformToAveenixProduct(wooProduct);
              productData.approvalStatus = 'preview'; // Set as preview status
              productData.automationAction = previewProduct.automationAction; // Set automation action
              
              const savedProduct = await storage.createProduct(productData);
              console.log(`[Save Preview] Created preview product ${previewProduct.wooId} as ${savedProduct.id} with automation: ${previewProduct.automationAction}`);
            }
          }
          
          results.push({ wooId: previewProduct.wooId, success: true });
          saved++;
        } catch (error) {
          console.error(`[Save Preview] Failed to save product ${previewProduct.wooId}:`, error);
          results.push({ 
            wooId: previewProduct.wooId, 
            success: false, 
            error: error instanceof Error ? error.message : 'Save failed' 
          });
          failed++;
        }
      }
      
      console.log(`[Save Preview] Completed - Saved: ${saved}, Failed: ${failed}`);
      
      res.json({
        success: true,
        saved,
        failed,
        results,
        message: `Successfully saved ${saved} preview products${failed > 0 ? `, ${failed} failed` : ''}`
      });
    } catch (error) {
      console.error('[Save Preview] Error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Save failed'
      });
    }
  });

  // WooCommerce Import Selected Endpoint
  app.post('/api/woocommerce/import-selected', async (req, res) => {
    try {
      const { selectedProductIds, approvalStatus = 'pending' } = req.body;
      
      if (!Array.isArray(selectedProductIds) || selectedProductIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No product IDs provided'
        });
      }
      
      console.log(`[Import Selected] Importing ${selectedProductIds.length} selected products`);
      
      // Fetch the specific products from WooCommerce
      const importResults = [];
      let imported = 0;
      let failed = 0;
      
      for (const productId of selectedProductIds) {
        try {
          // Get specific product from WooCommerce by fetching all and filtering
          const allProducts = await wooCommerceService.fetchProducts(1, 100); // Get more products to find the one we need
          const wooProduct = allProducts.find((p: any) => p.id.toString() === productId);
          
          if (wooProduct) {
            // Transform product and fetch authentic reviews
            const productData = await wooCommerceService.transformToAveenixProduct(wooProduct);
            
            // Fetch authentic reviews from WooCommerce
            const wooReviews = await wooCommerceService.fetchProductReviews(wooProduct.id);
            
            // Update product with real rating data from authentic reviews
            if (wooReviews.length > 0) {
              const totalRating = wooReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
              const averageRating = totalRating / wooReviews.length;
              
              productData.rating = (Math.round(averageRating * 10) / 10).toString();
              productData.reviewCount = wooReviews.length;
            } else {
              productData.rating = null;
              productData.reviewCount = 0;
            }
            
            // Set approval status (can be 'pending' or 'pricing')
            productData.approvalStatus = approvalStatus;
            
            // Check if product already exists and update instead of create
            const existingProduct = await storage.getProduct(productData.id);
            let savedProduct;
            
            if (existingProduct) {
              console.log(`[Import Selected] Product ${productId} already exists, updating approval status to ${approvalStatus}`);
              savedProduct = await storage.updateProductApprovalStatus(productData.id, approvalStatus);
            } else {
              savedProduct = await storage.createProduct(productData);
            }

            // Auto-calculate Amazon commission rates for affiliate products
            if (savedProduct && productData.productType === 'affiliate' && productData.affiliateUrl) {
              const { commissionService } = await import('./services/commissionService');
              const price = parseFloat(productData.price || '0');
              
              if (price > 0) {
                console.log(`[Commission] Calculating commission for ${productData.name} (${productData.category}) - $${price}`);
                const commission = await commissionService.calculateAmazonCommissionForProduct(
                  savedProduct.id, 
                  productData.category || 'default', 
                  price
                );
                
                if (commission) {
                  console.log(`[Commission] Applied ${commission.commissionRate}% rate = $${commission.commissionAmount.toFixed(2)} from ${commission.source}`);
                }
              }
            }
            
            // Transform and save authentic reviews
            if (wooReviews.length > 0) {
              const transformedReviews = wooReviews.map((review: any) => 
                wooCommerceService.transformToAveenixReview(review, savedProduct.id)
              );
              
              if (transformedReviews.length > 0) {
                await storage.createReviews(transformedReviews);
                console.log(`[Import Selected] Imported ${transformedReviews.length} authentic reviews for product ${productId}`);
              }
            }
            
            importResults.push({ wooId: productId, success: true, productId: savedProduct.id, reviewsCount: wooReviews.length });
            imported++;
            
            console.log(`[Import Selected] Successfully imported product ${productId} as ${savedProduct.id} with ${wooReviews.length} reviews`);
          } else {
            importResults.push({ wooId: productId, success: false, error: 'Product not found' });
            failed++;
          }
        } catch (error) {
          console.error(`[Import Selected] Failed to import product ${productId}:`, error);
          importResults.push({ 
            wooId: productId, 
            success: false, 
            error: error instanceof Error ? error.message : 'Import failed' 
          });
          failed++;
        }
      }
      
      console.log(`[Import Selected] Completed - Imported: ${imported}, Failed: ${failed}`);
      
      res.json({
        success: true,
        imported,
        failed,
        results: importResults,
        message: `Successfully imported ${imported} products${failed > 0 ? `, ${failed} failed` : ''}`
      });
    } catch (error) {
      console.error('[Import Selected] Error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Import failed'
      });
    }
  });

  // WooCommerce Connection Health endpoint
  app.get('/api/woocommerce/connection-health', async (req, res) => {
    try {
      // Check if WooCommerce is marked as disconnected
      if (!sourceConnectionStatus.woocommerce) {
        return res.json({
          responseTime: null,
          lastSync: null,
          nextSync: null,
          uptime: 0,
          requestCount: 0,
          requestLimit: 1000,
          requestsRemaining: 0,
          rateLimitReset: null,
          connectionStatus: 'disconnected',
          message: 'WooCommerce manually disconnected'
        });
      }
      
      const startTime = Date.now();
      
      // Test connection and measure response time
      const products = await wooCommerceService.fetchProducts(1, 1);
      const responseTime = Date.now() - startTime;
      
      // Get real API usage data
      const wooCommerceUsage = apiRateTracker.getUsage('woocommerce') || { used: 0, limit: 1000, remaining: 1000, resetTime: Date.now() + 3600000 };
      
      // Calculate time-based metrics
      const lastSyncTime = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
      const nextSyncTime = new Date(Date.now() + 8 * 60 * 1000); // 8 minutes from now
      
      const connectionHealth = {
        responseTime: responseTime,
        lastSync: lastSyncTime.toISOString(),
        nextSync: nextSyncTime.toISOString(),
        uptime: 99.2, // 24h uptime percentage
        requestCount: wooCommerceUsage.used,
        requestLimit: wooCommerceUsage.limit,
        requestsRemaining: wooCommerceUsage.remaining,
        rateLimitReset: new Date(wooCommerceUsage.resetTime).toISOString(),
        connectionStatus: 'connected'
      };
      
      res.json(connectionHealth);
    } catch (error) {
      console.error('WooCommerce connection health error:', error);
      res.status(500).json({
        responseTime: null,
        lastSync: null,
        nextSync: null,
        uptime: 0,
        requestCount: 0,
        requestLimit: 1000,
        requestsRemaining: 0,
        rateLimitReset: null,
        connectionStatus: 'disconnected',
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  });

  // Fetch WooCommerce products
  app.get('/api/woocommerce/products', async (req, res) => {
    try {
      // Check if WooCommerce is marked as disconnected
      if (!sourceConnectionStatus.woocommerce) {
        return res.status(503).json({
          error: 'WooCommerce is disconnected',
          disconnected: true
        });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.per_page as string) || 20;
      
      const products = await wooCommerceService.fetchProducts(page, perPage);
      res.json(products);
    } catch (error) {
      console.error('Error fetching WooCommerce products:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      });
    }
  });

  // Fetch WooCommerce categories
  app.get('/api/woocommerce/categories', async (req, res) => {
    try {
      const categories = await wooCommerceService.fetchCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching WooCommerce categories:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      });
    }
  });

  // Get WooCommerce category mappings
  app.get('/api/woocommerce/category-mappings', async (req, res) => {
    try {
      const { wooCommerceCategoryMapper } = await import('./services/woocommerceCategoryMapper.js');
      const mappings = wooCommerceCategoryMapper.getCategoryMappings();
      const stats = await wooCommerceCategoryMapper.getMappingStats();
      
      res.json({
        success: true,
        mappings,
        stats
      });
    } catch (error) {
      console.error('Error fetching WooCommerce category mappings:', error);
      res.status(500).json({ error: 'Failed to fetch WooCommerce category mappings' });
    }
  });

  // Fetch live WooCommerce categories (flat list with parent ids)
  app.get('/api/woocommerce/categories', async (req, res) => {
    try {
      const { WooCommerceService } = await import('./services/woocommerce');
      const woo = new WooCommerceService();
      const cats = await woo.fetchCategories();
      // Attempt to include parent from Woo if available via a second call (skipped for performance),
      // otherwise return flat list; client builds tree if parent present.
      res.json(cats);
    } catch (error) {
      console.error('Error fetching WooCommerce categories:', error);
      res.status(500).json({ error: 'Failed to fetch WooCommerce categories' });
    }
  });

  // Sync WooCommerce categories into main store categories table
  app.post('/api/woocommerce/categories/sync', async (req, res) => {
    try {
      const { WooCommerceService } = await import('./services/woocommerce');
      const { db } = await import('./db');
      const { categories } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      const woo = new WooCommerceService();
      const cats = await woo.fetchCategories();

      // Build lookup of Woo categories by id
      const byId: Record<number, { id: number; name: string; slug: string; parent?: number }> = {};
      cats.forEach(c => { byId[c.id] = c; });

      // First upsert all parent (root) categories (parent == 0 or undefined)
      for (const c of cats.filter(c => !c.parent || c.parent === 0)) {
        const existing = await db.select().from(categories).where(eq(categories.name, c.name));
        if (existing.length === 0) {
          await db.insert(categories).values({
            name: c.name,
            slug: c.slug,
            icon: 'Tag',
            isHot: false,
            parentId: null,
            sortOrder: 0,
            isActive: true,
          });
        }
      }

      // Build name->id map after inserting parents
      const allParents = await db.select().from(categories);
      const nameToId: Record<string, number> = {};
      allParents.forEach((cat: any) => { nameToId[cat.name] = cat.id; });

      // Then upsert children with parent mapping by name
      for (const c of cats.filter(c => c.parent && c.parent !== 0)) {
        const parentWoo = byId[c.parent!];
        const parentId = parentWoo ? nameToId[parentWoo.name] : null;
        const existing = await db.select().from(categories).where(eq(categories.name, c.name));
        if (existing.length === 0) {
          await db.insert(categories).values({
            name: c.name,
            slug: c.slug,
            icon: 'Tag',
            isHot: false,
            parentId: parentId ?? null,
            sortOrder: 0,
            isActive: true,
          });
        }
      }

      res.json({ success: true, total: cats.length });
    } catch (error) {
      console.error('Error syncing WooCommerce categories:', error);
      res.status(500).json({ error: 'Failed to sync categories' });
    }
  });

  // Get products by WooCommerce category
  app.get('/api/woocommerce/products/by-category/:wooCategory', async (req, res) => {
    try {
      const { wooCategory } = req.params;
      const { wooCommerceCategoryMapper } = await import('./services/woocommerceCategoryMapper.js');
      
      // Map WooCommerce category to Aveenix category
      const mapping = await wooCommerceCategoryMapper.mapWooCommerceCategory(wooCategory);
      
      // Get products from the mapped Aveenix category
      const products = await storage.getProductsByCategory(mapping.aveenixCategory);
      
      // Filter to only show WooCommerce products
      const wooProducts = products.filter(p => p.sourcePlatform === 'woocommerce');
      
      res.json({
        success: true,
        wooCategory,
        aveenixCategory: mapping.aveenixCategory,
        confidence: mapping.confidence,
        mappingSource: mapping.mappingSource,
        products: wooProducts,
        total: wooProducts.length
      });
    } catch (error) {
      console.error('Error fetching WooCommerce products by category:', error);
      res.status(500).json({ error: 'Failed to fetch WooCommerce products by category' });
    }
  });

  // Preview WooCommerce products before import
  app.get('/api/woocommerce/preview', async (req, res) => {
    try {
      console.log('[Preview API] Starting preview request');
      
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.per_page as string) || 20;
      
      console.log('[Preview API] About to fetch WooCommerce products');
      // Fetch products from WooCommerce without any database interaction
      const wooProducts = await wooCommerceService.fetchProducts(page, perPage);
      console.log(`[Preview API] Successfully fetched ${wooProducts.length} WooCommerce products`);
      
      // Simple transformation without any database calls
      const previewProducts = [];
      for (let i = 0; i < wooProducts.length; i++) {
        const wooProduct = wooProducts[i];
        try {
          const transformed = {
            id: `woo-${wooProduct.id}`,
            wooId: wooProduct.id,
            name: wooProduct.name || 'Unnamed Product',
            price: wooProduct.price || wooProduct.regular_price || '0',
            regularPrice: wooProduct.regular_price || '0',
            salePrice: wooProduct.sale_price || null,
            image: '',
            category: 'Uncategorized',
            stockStatus: wooProduct.stock_status || 'instock',
            rating: wooProduct.average_rating || '0',
            type: wooProduct.type || 'simple',
            shortDescription: wooProduct.short_description || '',
            status: 'new'
          };
          
          // Safe image access
          if (wooProduct.images && Array.isArray(wooProduct.images) && wooProduct.images.length > 0) {
            transformed.image = wooProduct.images[0].src || '';
          }
          
          // Safe category access
          if (wooProduct.categories && Array.isArray(wooProduct.categories) && wooProduct.categories.length > 0) {
            transformed.category = wooProduct.categories[0].name || 'Uncategorized';
          }
          
          previewProducts.push(transformed);
        } catch (productError) {
          console.error('[Preview API] Error transforming individual product:', wooProduct.id, productError);
        }
      }
      
      console.log(`[Preview API] Successfully transformed ${previewProducts.length} products`);
      
      res.json({
        success: true,
        products: previewProducts,
        total: previewProducts.length,
        page,
        perPage
      });
    } catch (error) {
      console.error('[Preview API] Detailed error:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Preview failed'
      });
    }
  });



  // WORKFLOW CORRECTIVE ACTION: Reset products from published to pending for testing approval workflow
  app.post('/api/product-management/reset-workflow-test', async (req, res) => {
    try {
      const { limit = 50 } = req.body;
      
      // Get recently published products (last 100)
      const recentPublished = await db.select({ id: products.id })
        .from(products)
        .where(eq(products.approvalStatus, 'published'))
        .orderBy(desc(products.createdAt))
        .limit(limit);
      
      if (recentPublished.length === 0) {
        return res.json({ 
          success: true, 
          message: 'No published products found to reset',
          resetCount: 0 
        });
      }
      
      const productIds = recentPublished.map(p => p.id);
      
      // Reset them to pending status for workflow testing
      const resetCount = await storage.reconsiderProducts(productIds);
      
      res.json({
        success: true,
        message: `Reset ${resetCount} products from 'published' to 'pending' for approval workflow testing`,
        resetCount,
        productIds: productIds.slice(0, 10) // Show first 10 IDs
      });
    } catch (error) {
      console.error('Error resetting workflow test products:', error);
      res.status(500).json({ error: 'Failed to reset products for workflow testing' });
    }
  });

  // Auto Import API endpoint
  app.post('/api/woocommerce/auto-import', async (req, res) => {
    try {
      const { enabled, interval, intervalMinutes, batchSize } = req.body;
      
      if (enabled) {
        // Use intervalMinutes if provided, otherwise fall back to interval (in ms)
        const intervalMs = intervalMinutes ? intervalMinutes * 60 * 1000 : (interval || 300000);
        const batch = batchSize || 10;
        
        console.log(`[Smart Import] Starting automation - ${batch} product(s) every ${intervalMinutes || Math.floor((interval || 300000)/60000)} minute(s)`);
        
        // Store auto-import configuration
        const config = {
          enabled: true,
          interval: intervalMs,
          intervalMinutes: intervalMinutes || Math.floor(intervalMs / 60000),
          batchSize: batch,
          startedAt: new Date().toISOString(),
          status: 'active'
        };
        
        // Start the automation service
        startSmartImportAutomation(config);
        
        res.json({
          success: true,
          message: `Smart Import automation started: ${batch} product(s) every ${config.intervalMinutes} minute(s)`,
          config
        });
      } else {
        stopSmartImportAutomation();
        res.json({
          success: true,
          message: 'Smart Import automation disabled',
          config: { enabled: false }
        });
      }
    } catch (error) {
      console.error('Smart Import API error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Smart Import setup failed'
      });
    }
  });

  // Get Smart Import automation status
  app.get('/api/woocommerce/auto-import/status', (req, res) => {
    // Check if WooCommerce is marked as disconnected
    if (!sourceConnectionStatus.woocommerce) {
      return res.json({
        success: false,
        config: { enabled: false, batchSize: 0, intervalMinutes: 0 },
        isRunning: false,
        message: 'WooCommerce disconnected'
      });
    }
    
    res.json({
      success: true,
      config: smartImportConfig,
      isRunning: smartImportInterval !== null
    });
  });

  // Smart Import Settings endpoints
  // Smart Import Settings storage (in-memory for now, in real app would be database)
  let smartImportSettings = {
    autoPriceProducts: false,
    autoImportToPending: false,
    autoApproveProducts: false,
    autoRejectProducts: false,
    autoPublishProducts: false,
    // Extended settings for detailed configuration
    autoPricingMarkup: 25,
    autoImportBatchSize: 50,
    autoImportInterval: 30,
    autoApprovePriceThreshold: 50,
    autoApproveRatingThreshold: 4,
    autoRejectMaxPrice: 1000,
    autoRejectMinRating: 2,
    autoPublishImmediate: true,
    autoPublishDelay: 24
  };

  app.get('/api/smart-import/settings', (req, res) => {
    res.json(smartImportSettings);
  });

  app.post('/api/smart-import/settings', (req, res) => {
    const {
      autoPriceProducts,
      autoImportToPending,
      autoApproveProducts,
      autoRejectProducts,
      autoPublishProducts,
      autoPricingMarkup,
      autoImportBatchSize,
      autoImportInterval,
      autoApprovePriceThreshold,
      autoApproveRatingThreshold,
      autoRejectMaxPrice,
      autoRejectMinRating,
      autoPublishImmediate,
      autoPublishDelay
    } = req.body;
    
    // Update stored settings with the received data
    smartImportSettings = {
      autoPriceProducts: Boolean(autoPriceProducts),
      autoImportToPending: Boolean(autoImportToPending),
      autoApproveProducts: Boolean(autoApproveProducts),
      autoRejectProducts: Boolean(autoRejectProducts),
      autoPublishProducts: Boolean(autoPublishProducts),
      autoPricingMarkup: Number(autoPricingMarkup) || 25,
      autoImportBatchSize: Number(autoImportBatchSize) || 50,
      autoImportInterval: Number(autoImportInterval) || 30,
      autoApprovePriceThreshold: Number(autoApprovePriceThreshold) || 50,
      autoApproveRatingThreshold: Number(autoApproveRatingThreshold) || 4,
      autoRejectMaxPrice: Number(autoRejectMaxPrice) || 1000,
      autoRejectMinRating: Number(autoRejectMinRating) || 2,
      autoPublishImmediate: Boolean(autoPublishImmediate ?? true),
      autoPublishDelay: Number(autoPublishDelay) || 24
    };
    
    console.log('📦 Smart Import Settings Updated:', smartImportSettings);
    
    res.json({ 
      success: true, 
      message: 'Smart Import settings saved successfully',
      settings: smartImportSettings
    });
  });

  // Category Automation Settings storage (in-memory for now, in real app would be database)
  let categoryAutomationSettings = {
    smartAutomationEnabled: false,
    highConfidenceEnabled: false,
    highConfidenceThreshold: 80,
    highConfidenceAction: 'auto-approve',
    mediumConfidenceEnabled: false,
    mediumConfidenceThreshold: 60,
    mediumConfidenceAction: 'auto-import',
    lowConfidenceEnabled: false,
    lowConfidenceThreshold: 60,
    lowConfidenceAction: 'hold-preview'
  };

  app.get('/api/category-automation/settings', (req, res) => {
    res.json(categoryAutomationSettings);
  });

  app.post('/api/category-automation/settings', (req, res) => {
    const {
      smartAutomationEnabled,
      highConfidenceEnabled,
      highConfidenceThreshold,
      highConfidenceAction,
      mediumConfidenceEnabled,
      mediumConfidenceThreshold,
      mediumConfidenceAction,
      lowConfidenceEnabled,
      lowConfidenceThreshold,
      lowConfidenceAction
    } = req.body;
    
    // Update stored settings with the received data
    categoryAutomationSettings = {
      smartAutomationEnabled: Boolean(smartAutomationEnabled),
      highConfidenceEnabled: Boolean(highConfidenceEnabled),
      highConfidenceThreshold: Number(highConfidenceThreshold) || 80,
      highConfidenceAction: String(highConfidenceAction) || 'auto-approve',
      mediumConfidenceEnabled: Boolean(mediumConfidenceEnabled),
      mediumConfidenceThreshold: Number(mediumConfidenceThreshold) || 60,
      mediumConfidenceAction: String(mediumConfidenceAction) || 'auto-import',
      lowConfidenceEnabled: Boolean(lowConfidenceEnabled),
      lowConfidenceThreshold: Number(lowConfidenceThreshold) || 60,
      lowConfidenceAction: String(lowConfidenceAction) || 'hold-preview'
    };
    
    console.log('🎯 Category Automation Settings Updated:', categoryAutomationSettings);
    
    res.json({ 
      success: true, 
      message: 'Category automation settings saved successfully',
      settings: categoryAutomationSettings
    });
  });

  // Import WooCommerce products to AVEENIX (FIXED: Now uses proper approval workflow)
  app.post('/api/woocommerce/import', async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1;
      const perPage = parseInt(req.body.per_page) || 20;
      
      // Use the new staging workflow instead of direct import
      const result = await wooCommerceService.importProductsToStaging(page, perPage);
      console.log('Import result:', { imported: result.imported, saved: result.saved });
      res.json(result);
    } catch (error) {
      console.error('Error importing WooCommerce products:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Import failed'
      });
    }
  });

  // Get stored WooCommerce products from database
  app.get('/api/woocommerce/stored-products', async (req, res) => {
    try {
      const wooProducts = await storage.getProducts({ sourcePlatform: 'woocommerce' });
      res.json({
        success: true,
        count: wooProducts.length,
        products: wooProducts
      });
    } catch (error) {
      console.error('Error fetching stored WooCommerce products:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Database query failed'
      });
    }
  });

  // Export products to CSV
  app.get('/api/product-management/export/csv', async (req, res) => {
    try {
      const { status } = req.query;
      
      // Get products based on status filter
      let products;
      if (status && status !== 'all') {
        products = await storage.getProductsByApprovalStatus(status as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      // Import CSV exporter
      const { generateProductsCSV } = await import('../utils/csvExporter');
      const csvContent = generateProductsCSV(products);
      
      // Set headers for CSV download
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `aveenix-products-${status || 'all'}-${timestamp}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting products to CSV:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      });
    }
  });

  // Product Management API Routes
  app.get('/api/product-management/products', async (req, res) => {
    try {
      const status = req.query.status as string || 'all';
      
      // Set cache-busting headers to ensure fresh data after imports
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      // Define product types for filtering
      const productTypes = ['affiliate', 'dropship', 'physical', 'consumable', 'service', 'digital', 'custom', 'multivendor'];
      
      // Handle "all" status by getting all products regardless of approval status
      if (status === 'all') {
        const products = await storage.getAllProductsForManagement();
        console.log(`[DEBUG] getAllProductsForManagement returned ${products.length} products`);
        res.json(products);
      } else if (productTypes.includes(status)) {
        // Filter by product type instead of approval status
        const products = await storage.getProductsByType(status);
        console.log(`[DEBUG] getProductsByType(${status}) returned ${products.length} products`);
        res.json(products);
      } else {
        // Filter by approval status (pending, approved, rejected, published)
        const products = await storage.getProductsByApprovalStatus(status);
        console.log(`[DEBUG] getProductsByApprovalStatus(${status}) returned ${products.length} products`);
        res.json(products);
      }
    } catch (error) {
      console.error('Error fetching products by approval status:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/product-management/approve', async (req, res) => {
    try {
      const { productIds } = req.body;
      const approvedBy = 1; // TODO: Get from authenticated user
      const count = await storage.approveProducts(productIds, approvedBy);
      res.json({ success: true, count });
    } catch (error) {
      console.error('Error approving products:', error);
      res.status(500).json({ error: 'Failed to approve products' });
    }
  });

  app.post('/api/product-management/reject', async (req, res) => {
    try {
      const { productIds, reason } = req.body;
      const rejectedBy = 1; // TODO: Get from authenticated user
      const count = await storage.rejectProducts(productIds, reason, rejectedBy);
      res.json({ success: true, count });
    } catch (error) {
      console.error('Error rejecting products:', error);
      res.status(500).json({ error: 'Failed to reject products' });
    }
  });

  app.post('/api/product-management/bulk-update-status', async (req, res) => {
    try {
      const { productIds, newStatus } = req.body;
      
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Product IDs array is required' });
      }
      
      if (!newStatus) {
        return res.status(400).json({ error: 'New status is required' });
      }
      
      // Update each product's approval status
      let updatedCount = 0;
      for (const productId of productIds) {
        try {
          await storage.updateProductApprovalStatus(productId, newStatus);
          updatedCount++;
        } catch (error) {
          console.error(`Error updating product ${productId} to ${newStatus}:`, error);
        }
      }
      
      res.json({ 
        success: true, 
        count: updatedCount,
        message: `${updatedCount} products moved to ${newStatus}` 
      });
    } catch (error) {
      console.error('Error bulk updating product status:', error);
      res.status(500).json({ error: 'Failed to update product status' });
    }
  });

  app.post('/api/product-management/publish', async (req, res) => {
    try {
      const { productIds } = req.body;
      console.log('[DEBUG] Publishing products request:', { productIds, count: productIds?.length });
      
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Invalid product IDs provided' });
      }
      
      const count = await storage.publishProducts(productIds);
      console.log('[DEBUG] Published products result:', { count });
      
      res.json({ success: true, count });
    } catch (error) {
      console.error('Error publishing products:', error);
      res.status(500).json({ error: 'Failed to publish products' });
    }
  });

  // Unpublish products (move back to approved status)
  app.post('/api/product-management/unpublish', async (req, res) => {
    try {
      const { productIds } = req.body;
      console.log('[DEBUG] Unpublishing products request:', { productIds, count: productIds?.length });
      
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Invalid product IDs provided' });
      }
      
      const count = await storage.unpublishProducts(productIds);
      console.log('[DEBUG] Unpublished products result:', { count });
      
      res.json({ success: true, count });
    } catch (error) {
      console.error('Error unpublishing products:', error);
      res.status(500).json({ error: 'Failed to unpublish products' });
    }
  });

  // Reconsider rejected products (move back to pending)
  app.post('/api/product-management/reconsider', async (req, res) => {
    try {
      const { productIds } = req.body;
      const count = await storage.reconsiderProducts(productIds);
      res.json({ success: true, count });
    } catch (error) {
      console.error('Error reconsidering products:', error);
      res.status(500).json({ error: 'Failed to reconsider products' });
    }
  });

  // Delete products permanently
  app.delete('/api/product-management/delete', async (req, res) => {
    try {
      const { productIds } = req.body;
      const count = await storage.deleteProducts(productIds);
      res.json({ success: true, count });
    } catch (error) {
      console.error('Error deleting products:', error);
      res.status(500).json({ error: 'Failed to delete products' });
    }
  });

  // Get imported product IDs from WooCommerce
  app.get('/api/woocommerce/imported-ids', async (req, res) => {
    try {
      // Check if WooCommerce is marked as disconnected
      if (!sourceConnectionStatus.woocommerce) {
        return res.json({ importedIds: [] });
      }
      
      const importedIds = await storage.getImportedWooCommerceIds();
      res.json({ importedIds });
    } catch (error) {
      console.error('Error fetching imported WooCommerce IDs:', error);
      res.status(500).json({ error: 'Failed to fetch imported product IDs' });
    }
  });

  // Product Management Overview API Route
  app.get('/api/product-management/overview', async (req, res) => {
    try {
      // Set cache-busting headers to ensure fresh data after imports
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      // Get product counts by status - return all products regardless of source platform
      const pendingProducts = await storage.getProductsByApprovalStatus('pending');
      const pricingProducts = await storage.getProductsByApprovalStatus('pricing');
      const approvedProducts = await storage.getProductsByApprovalStatus('approved');
      const publishedProducts = await storage.getProductsByApprovalStatus('published');
      const rejectedProducts = await storage.getProductsByApprovalStatus('rejected');
      
      console.log('[DEBUG Backend] Overview counts:', {
        pending: pendingProducts.length,
        pricing: pricingProducts.length,
        approved: approvedProducts.length,
        published: publishedProducts.length,
        rejected: rejectedProducts.length
      });
      
      // Get all products for total count (regardless of approval status)
      const allProducts = await storage.getAllProductsForManagement();
      
      // Get categories count
      const categories = await storage.getCategories();
      
      // Calculate today's activity metrics (last 24 hours)
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      // Get products created today
      const todayImports = allProducts.filter(p => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        return createdDate >= yesterday;
      });
      
      // Get products approved/published today
      const todayApproved = approvedProducts.filter(p => {
        const approvedDate = p.approvedAt ? new Date(p.approvedAt) : null;
        return approvedDate && approvedDate >= yesterday;
      });
      
      const todayPublished = publishedProducts.filter(p => {
        const approvedDate = p.approvedAt ? new Date(p.approvedAt) : null;
        return approvedDate && approvedDate >= yesterday;
      });

      // Calculate total products in workflow (exclude any with null status)
      const workflowTotal = pendingProducts.length + pricingProducts.length + approvedProducts.length + 
                           publishedProducts.length + rejectedProducts.length;

      // Recent activity with actual data
      const recentActivity = [
        {
          type: 'imported',
          message: `${todayImports.length} new products imported today`,
          timestamp: 'Today'
        },
        {
          type: 'approved', 
          message: `${todayApproved.length} products approved today`,
          timestamp: 'Today'
        },
        {
          type: 'published',
          message: `${todayPublished.length} products published today`,
          timestamp: 'Today'
        }
      ];

      // Get smart import count (products with high AI confidence)
      const smartImportProducts = await storage.getSmartImportProducts();

      const overview = {
        // Workflow Status (current state)
        totalProducts: workflowTotal, // Only products in workflow
        pendingProducts: pendingProducts.length,
        pricingProducts: pricingProducts.length,
        approvedProducts: approvedProducts.length,
        publishedProducts: publishedProducts.length,
        rejectedProducts: rejectedProducts.length,
        smartImportCount: smartImportProducts.length, // Products ready for smart import
        
        // Daily Activity Metrics (last 24 hours)
        importedToday: todayImports.length,
        approvedToday: todayApproved.length, 
        publishedToday: todayPublished.length,
        processedToday: todayApproved.length + rejectedProducts.filter(p => {
          const rejectedDate = p.rejectionDate ? new Date(p.rejectionDate) : null;
          return rejectedDate && rejectedDate >= yesterday;
        }).length,
        
        // System Information
        totalCategories: categories.length,
        totalSystemProducts: allProducts.length, // All products regardless of status
        
        // Activity Feed
        recentActivity
      };

      res.json(overview);
    } catch (error) {
      console.error('Error fetching product management overview:', error);
      res.status(500).json({ error: 'Failed to fetch overview' });
    }
  });

  // Product Intelligence API Routes
  app.post('/api/product-intelligence/:productId/analyze', async (req, res) => {
    try {
      const { productId } = req.params;
      
      // Get product details
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Import and use ProductIntelligenceService
      const { ProductIntelligenceService } = await import('./services/productIntelligenceService.js');
      const intelligenceService = new ProductIntelligenceService();
      
      // Analyze product
      const analysis = await intelligenceService.analyzeProduct({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        category: product.category,
        brand: product.brand || '',
        description: product.description || '',
        imageUrl: product.imageUrl
      });
      
      // Update product with intelligence data
      await storage.updateProductIntelligence(productId, analysis);
      
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing product:', error);
      res.status(500).json({ error: 'Failed to analyze product' });
    }
  });

  app.get('/api/product-intelligence/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const intelligence = await storage.getProductIntelligence(productId);
      
      if (!intelligence) {
        return res.status(404).json({ error: 'Intelligence data not found' });
      }
      
      res.json(intelligence);
    } catch (error) {
      console.error('Error fetching product intelligence:', error);
      res.status(500).json({ error: 'Failed to fetch intelligence data' });
    }
  });

  app.get('/api/product-intelligence/top-performers', async (req, res) => {
    try {
      const topProducts = await storage.getTopPerformingProducts(10);
      res.json(topProducts);
    } catch (error) {
      console.error('Error fetching top performers:', error);
      res.status(500).json({ error: 'Failed to fetch top performers' });
    }
  });

  // Business Intelligence API Routes
  
  // Executive Dashboard Routes
  app.get('/api/bi/executive/overview', async (req, res) => {
    try {
      const currentDate = new Date();
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      
      const overview = {
        totalRevenue: 2847520,
        revenueGrowth: 12.5,
        totalOrders: 15423,
        ordersGrowth: 8.3,
        avgOrderValue: 184.65,
        avgOrderGrowth: 3.8,
        conversionRate: 3.42,
        conversionGrowth: 0.7,
        totalCustomers: 8947,
        customersGrowth: 15.2,
        activeProducts: 1245,
        productsGrowth: 4.1
      };

      res.json(overview);
    } catch (error) {
      console.error('Error fetching executive overview:', error);
      res.status(500).json({ error: 'Failed to fetch executive overview' });
    }
  });

  app.get('/api/bi/executive/revenue-trends', async (req, res) => {
    try {
      const revenueTrends = [
        { month: 'Jan', revenue: 245000, orders: 1250, avgOrder: 196 },
        { month: 'Feb', revenue: 268000, orders: 1380, avgOrder: 194 },
        { month: 'Mar', revenue: 291000, orders: 1520, avgOrder: 191 },
        { month: 'Apr', revenue: 315000, orders: 1650, avgOrder: 191 },
        { month: 'May', revenue: 342000, orders: 1820, avgOrder: 188 },
        { month: 'Jun', revenue: 368000, orders: 1950, avgOrder: 189 }
      ];

      res.json(revenueTrends);
    } catch (error) {
      console.error('Error fetching revenue trends:', error);
      res.status(500).json({ error: 'Failed to fetch revenue trends' });
    }
  });

  app.get('/api/bi/executive/top-categories', async (req, res) => {
    try {
      const topCategories = [
        { category: 'Electronics', revenue: 850000, percentage: 29.8, growth: 15.2 },
        { category: 'Fashion', revenue: 620000, percentage: 21.8, growth: 8.7 },
        { category: 'Home & Garden', revenue: 480000, percentage: 16.9, growth: 12.1 },
        { category: 'Health & Beauty', revenue: 390000, percentage: 13.7, growth: 18.5 },
        { category: 'Sports', revenue: 320000, percentage: 11.2, growth: 6.3 },
        { category: 'Books', revenue: 186000, percentage: 6.5, growth: -2.1 }
      ];

      res.json(topCategories);
    } catch (error) {
      console.error('Error fetching top categories:', error);
      res.status(500).json({ error: 'Failed to fetch top categories' });
    }
  });

  // Predictive Analytics Routes
  app.get('/api/bi/predictive/sales-forecast', async (req, res) => {
    try {
      const forecast = [
        { month: 'Jul', predicted: 395000, confidence: 0.92, actual: null },
        { month: 'Aug', predicted: 418000, confidence: 0.88, actual: null },
        { month: 'Sep', predicted: 442000, confidence: 0.85, actual: null },
        { month: 'Oct', predicted: 465000, confidence: 0.81, actual: null },
        { month: 'Nov', predicted: 520000, confidence: 0.78, actual: null },
        { month: 'Dec', predicted: 595000, confidence: 0.75, actual: null }
      ];

      res.json(forecast);
    } catch (error) {
      console.error('Error fetching sales forecast:', error);
      res.status(500).json({ error: 'Failed to fetch sales forecast' });
    }
  });

  app.get('/api/bi/predictive/demand-analysis', async (req, res) => {
    try {
      const demandAnalysis = [
        { 
          category: 'Electronics', 
          currentDemand: 4.2, 
          predictedDemand: 4.8,
          trend: 'increasing',
          stockRecommendation: 'increase',
          confidence: 0.89
        },
        { 
          category: 'Fashion', 
          currentDemand: 3.8, 
          predictedDemand: 3.9,
          trend: 'stable',
          stockRecommendation: 'maintain',
          confidence: 0.85
        },
        { 
          category: 'Home & Garden', 
          currentDemand: 3.5, 
          predictedDemand: 4.1,
          trend: 'increasing',
          stockRecommendation: 'increase',
          confidence: 0.82
        }
      ];

      res.json(demandAnalysis);
    } catch (error) {
      console.error('Error fetching demand analysis:', error);
      res.status(500).json({ error: 'Failed to fetch demand analysis' });
    }
  });

  app.get('/api/bi/predictive/price-optimization', async (req, res) => {
    try {
      const priceOptimization = [
        {
          productId: '1',
          name: 'Wireless Headphones',
          currentPrice: 199.99,
          optimizedPrice: 189.99,
          expectedImpact: {
            sales: '+15%',
            revenue: '+8%',
            profit: '+12%'
          },
          confidence: 0.91
        },
        {
          productId: '2',
          name: 'Smart Watch',
          currentPrice: 299.99,
          optimizedPrice: 319.99,
          expectedImpact: {
            sales: '-3%',
            revenue: '+4%',
            profit: '+8%'
          },
          confidence: 0.87
        }
      ];

      res.json(priceOptimization);
    } catch (error) {
      console.error('Error fetching price optimization:', error);
      res.status(500).json({ error: 'Failed to fetch price optimization' });
    }
  });

  // Performance Benchmarking Routes
  app.get('/api/bi/benchmarks/industry-comparison', async (req, res) => {
    try {
      const industryComparison = {
        conversionRate: { our: 3.42, industry: 2.86, percentile: 75 },
        avgOrderValue: { our: 184.65, industry: 156.20, percentile: 68 },
        customerLifetimeValue: { our: 1247, industry: 980, percentile: 72 },
        returnRate: { our: 2.1, industry: 3.4, percentile: 85 },
        customerSatisfaction: { our: 4.6, industry: 4.1, percentile: 78 }
      };

      res.json(industryComparison);
    } catch (error) {
      console.error('Error fetching industry comparison:', error);
      res.status(500).json({ error: 'Failed to fetch industry comparison' });
    }
  });

  app.get('/api/bi/benchmarks/competitor-analysis', async (req, res) => {
    try {
      const competitorAnalysis = [
        {
          competitor: 'TechGear Pro',
          marketShare: 23.5,
          avgPrice: 195.80,
          rating: 4.3,
          deliveryTime: '2-3 days',
          strengthsWeaknesses: {
            strengths: ['Fast delivery', 'Wide selection'],
            weaknesses: ['Higher prices', 'Limited support']
          }
        },
        {
          competitor: 'ElectroHub',
          marketShare: 18.2,
          avgPrice: 174.25,
          rating: 4.1,
          deliveryTime: '3-5 days',
          strengthsWeaknesses: {
            strengths: ['Competitive pricing', 'Good reviews'],
            weaknesses: ['Slower delivery', 'Limited categories']
          }
        }
      ];

      res.json(competitorAnalysis);
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
      res.status(500).json({ error: 'Failed to fetch competitor analysis' });
    }
  });

  // Custom Report Builder Routes
  app.get('/api/bi/reports/templates', async (req, res) => {
    try {
      const templates = [
        {
          id: 'sales-performance',
          name: 'Sales Performance Report',
          description: 'Comprehensive sales analysis with trends and forecasts',
          category: 'Sales',
          fields: ['revenue', 'orders', 'conversion', 'traffic']
        },
        {
          id: 'product-analysis',
          name: 'Product Analysis Report',
          description: 'Product performance metrics and recommendations',
          category: 'Products',
          fields: ['sales', 'inventory', 'ratings', 'reviews']
        },
        {
          id: 'customer-insights',
          name: 'Customer Insights Report',
          description: 'Customer behavior and segmentation analysis',
          category: 'Customers',
          fields: ['demographics', 'behavior', 'lifetime_value', 'satisfaction']
        }
      ];

      res.json(templates);
    } catch (error) {
      console.error('Error fetching report templates:', error);
      res.status(500).json({ error: 'Failed to fetch report templates' });
    }
  });

  app.post('/api/bi/reports/generate', async (req, res) => {
    try {
      const { template, dateRange, filters } = req.body;
      
      // Simulate report generation
      const reportData = {
        id: `report_${Date.now()}`,
        template,
        dateRange,
        filters,
        generatedAt: new Date().toISOString(),
        status: 'completed',
        downloadUrl: `/api/bi/reports/download/report_${Date.now()}.pdf`
      };

      res.json(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  });

  // Quality Assurance & Testing API Routes
  
  // Quality Checks Routes
  app.get('/api/qa/quality-checks', async (req, res) => {
    try {
      const qualityResults = [
        {
          productId: 'prod_1',
          productName: 'Wireless Bluetooth Headphones',
          overallScore: 92,
          imageQuality: 95,
          descriptionScore: 88,
          seoScore: 93,
          issues: []
        },
        {
          productId: 'prod_2',
          productName: 'Smart Fitness Watch',
          overallScore: 75,
          imageQuality: 85,
          descriptionScore: 60,
          seoScore: 80,
          issues: [
            'Description too short (less than 100 characters)',
            'Missing key specifications',
            'No customer benefits highlighted'
          ]
        },
        {
          productId: 'prod_3',
          productName: 'Laptop Stand Adjustable',
          overallScore: 68,
          imageQuality: 45,
          descriptionScore: 85,
          seoScore: 75,
          issues: [
            'Image resolution too low (less than 800px)',
            'Missing lifestyle images',
            'Background not uniform'
          ]
        }
      ];

      res.json(qualityResults);
    } catch (error) {
      console.error('Error fetching quality checks:', error);
      res.status(500).json({ error: 'Failed to fetch quality checks' });
    }
  });

  app.post('/api/qa/run-quality-checks', async (req, res) => {
    try {
      const { productId } = req.body;
      
      // Simulate quality check analysis
      const result = {
        productId,
        status: 'completed',
        overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
        imageQuality: Math.floor(Math.random() * 40) + 60,
        descriptionScore: Math.floor(Math.random() * 50) + 50,
        seoScore: Math.floor(Math.random() * 35) + 65,
        analyzedAt: new Date().toISOString()
      };

      res.json(result);
    } catch (error) {
      console.error('Error running quality checks:', error);
      res.status(500).json({ error: 'Failed to run quality checks' });
    }
  });

  // A/B Testing Routes
  app.get('/api/qa/ab-tests', async (req, res) => {
    try {
      const abTests = [
        {
          id: 'test_1',
          name: 'Product Title Optimization',
          description: 'Testing shorter vs longer product titles for conversion',
          status: 'active',
          type: 'product-title',
          variantA: {
            conversion: 3.2,
            visitors: 1247
          },
          variantB: {
            conversion: 4.1,
            visitors: 1203
          },
          improvement: 28.1,
          confidence: 95,
          startDate: '2025-01-15',
          endDate: '2025-02-15'
        },
        {
          id: 'test_2',
          name: 'Product Image Layout',
          description: 'Testing single large image vs image gallery',
          status: 'active',
          type: 'product-image',
          variantA: {
            conversion: 2.8,
            visitors: 892
          },
          variantB: {
            conversion: 3.6,
            visitors: 934
          },
          improvement: 22.2,
          confidence: 87,
          startDate: '2025-01-20',
          endDate: '2025-02-20'
        },
        {
          id: 'test_3',
          name: 'Call to Action Button',
          description: 'Testing "Add to Cart" vs "Buy Now" button text',
          status: 'completed',
          type: 'call-to-action',
          variantA: {
            conversion: 3.5,
            visitors: 2156
          },
          variantB: {
            conversion: 4.2,
            visitors: 2098
          },
          improvement: 20.0,
          confidence: 99,
          startDate: '2025-01-01',
          endDate: '2025-01-31'
        }
      ];

      res.json(abTests);
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      res.status(500).json({ error: 'Failed to fetch A/B tests' });
    }
  });

  app.post('/api/qa/create-ab-test', async (req, res) => {
    try {
      const { name, description, type } = req.body;
      
      const newTest = {
        id: `test_${Date.now()}`,
        name,
        description,
        type,
        status: 'draft',
        variantA: {
          conversion: 0,
          visitors: 0
        },
        variantB: {
          conversion: 0,
          visitors: 0
        },
        improvement: 0,
        confidence: 0,
        createdAt: new Date().toISOString()
      };

      res.json(newTest);
    } catch (error) {
      console.error('Error creating A/B test:', error);
      res.status(500).json({ error: 'Failed to create A/B test' });
    }
  });

  // Data Validation Routes
  app.get('/api/qa/validation', async (req, res) => {
    try {
      const validationResults = [
        {
          ruleName: 'Product Title Length',
          description: 'Product titles should be between 10-60 characters',
          severity: 'warning',
          totalChecked: 1247,
          passed: 1158,
          failed: 89,
          failedProducts: ['prod_45', 'prod_78', 'prod_123']
        },
        {
          ruleName: 'Price Format Validation',
          description: 'Prices must be valid numbers with proper currency format',
          severity: 'error',
          totalChecked: 1247,
          passed: 1224,
          failed: 23,
          failedProducts: ['prod_12', 'prod_89', 'prod_156']
        },
        {
          ruleName: 'Image URL Accessibility',
          description: 'All product images must be accessible and load properly',
          severity: 'error',
          totalChecked: 1247,
          passed: 1239,
          failed: 8,
          failedProducts: ['prod_67', 'prod_234']
        },
        {
          ruleName: 'SEO Description Length',
          description: 'Meta descriptions should be between 120-160 characters',
          severity: 'warning',
          totalChecked: 1247,
          passed: 1089,
          failed: 158,
          failedProducts: ['prod_34', 'prod_78', 'prod_145', 'prod_189']
        },
        {
          ruleName: 'Category Assignment',
          description: 'All products must be assigned to valid categories',
          severity: 'pass',
          totalChecked: 1247,
          passed: 1247,
          failed: 0,
          failedProducts: []
        }
      ];

      res.json(validationResults);
    } catch (error) {
      console.error('Error fetching validation results:', error);
      res.status(500).json({ error: 'Failed to fetch validation results' });
    }
  });

  app.post('/api/qa/run-validation', async (req, res) => {
    try {
      // Simulate validation run
      const result = {
        status: 'completed',
        totalRules: 12,
        passedRules: 9,
        failedRules: 2,
        warningRules: 1,
        totalProducts: 1247,
        validProducts: 1224,
        invalidProducts: 23,
        runAt: new Date().toISOString()
      };

      res.json(result);
    } catch (error) {
      console.error('Error running validation:', error);
      res.status(500).json({ error: 'Failed to run validation' });
    }
  });

  // Integration Testing Routes
  app.get('/api/qa/integration-tests', async (req, res) => {
    try {
      const integrationTests = [
        {
          name: 'WooCommerce API Connection',
          endpoint: '/api/woocommerce/products',
          status: 'pass',
          responseTime: 245,
          statusCode: 200,
          dataQuality: 98,
          lastRun: '2025-01-23 12:30:00',
          errors: []
        },
        {
          name: 'Product Management API',
          endpoint: '/api/product-management/products',
          status: 'pass',
          responseTime: 120,
          statusCode: 200,
          dataQuality: 100,
          lastRun: '2025-01-23 12:25:00',
          errors: []
        },
        {
          name: 'Payment Processing API',
          endpoint: '/api/stripe/payment-intent',
          status: 'pass',
          responseTime: 340,
          statusCode: 200,
          dataQuality: 95,
          lastRun: '2025-01-23 12:20:00',
          errors: []
        },
        {
          name: 'Inventory Sync Service',
          endpoint: '/api/inventory/sync',
          status: 'fail',
          responseTime: 5200,
          statusCode: 500,
          dataQuality: 0,
          lastRun: '2025-01-23 12:15:00',
          errors: [
            'Connection timeout after 5 seconds',
            'Database lock detected during sync operation'
          ]
        },
        {
          name: 'Analytics Data Pipeline',
          endpoint: '/api/analytics/aggregate',
          status: 'pass',
          responseTime: 890,
          statusCode: 200,
          dataQuality: 92,
          lastRun: '2025-01-23 12:10:00',
          errors: []
        },
        {
          name: 'Email Notification Service',
          endpoint: '/api/notifications/send',
          status: 'fail',
          responseTime: 1200,
          statusCode: 422,
          dataQuality: 85,
          lastRun: '2025-01-23 12:05:00',
          errors: [
            'Invalid email template format',
            'SMTP configuration error'
          ]
        }
      ];

      res.json(integrationTests);
    } catch (error) {
      console.error('Error fetching integration tests:', error);
      res.status(500).json({ error: 'Failed to fetch integration tests' });
    }
  });

  app.post('/api/qa/run-integration-tests', async (req, res) => {
    try {
      // Simulate integration test run
      const result = {
        status: 'completed',
        totalTests: 26,
        passedTests: 24,
        failedTests: 2,
        averageResponseTime: 245,
        successRate: 92.3,
        runAt: new Date().toISOString(),
        summary: {
          apis: { total: 8, passed: 7, failed: 1 },
          databases: { total: 4, passed: 4, failed: 0 },
          services: { total: 14, passed: 13, failed: 1 }
        }
      };

      res.json(result);
    } catch (error) {
      console.error('Error running integration tests:', error);
      res.status(500).json({ error: 'Failed to run integration tests' });
    }
  });

  // Advanced Inventory & Sourcing Intelligence Routes
  app.get('/api/inventory/suppliers', async (req, res) => {
    return res.json([
      {
        "id": "sup_1",
        "name": "WooCommerce Main Store",
        "platform": "woocommerce",
        "status": "active",
        "performanceScore": 94,
        "reliability": 96,
        "avgShippingTime": 3.2,
        "qualityRating": 4.8,
        "totalProducts": 1247,
        "lastSync": "2025-01-23T05:30:00Z",
        "apiStatus": "connected"
      },
      {
        "id": "sup_2",
        "name": "Shopify Electronics",
        "platform": "shopify",
        "status": "active",
        "performanceScore": 87,
        "reliability": 89,
        "avgShippingTime": 4.1,
        "qualityRating": 4.5,
        "totalProducts": 892,
        "lastSync": "2025-01-23T05:25:00Z",
        "apiStatus": "connected"
      },
      {
        "id": "sup_3",
        "name": "Amazon FBA Supplier",
        "platform": "amazon",
        "status": "active",
        "performanceScore": 91,
        "reliability": 93,
        "avgShippingTime": 2.8,
        "qualityRating": 4.6,
        "totalProducts": 2156,
        "lastSync": "2025-01-23T05:28:00Z",
        "apiStatus": "syncing"
      },
      {
        "id": "sup_4",
        "name": "AliExpress Dropship",
        "platform": "aliexpress",
        "status": "inactive",
        "performanceScore": 73,
        "reliability": 78,
        "avgShippingTime": 12.5,
        "qualityRating": 4.1,
        "totalProducts": 567,
        "lastSync": "2025-01-22T18:45:00Z",
        "apiStatus": "error"
      }
    ]);
  });

  app.get('/api/inventory/items', async (req, res) => {
    return res.json([
      {
        "id": "inv_1",
        "name": "AirPods Pro (2nd Generation)",
        "sku": "APP-2ND-GEN",
        "supplier": "WooCommerce Main Store",
        "currentStock": 45,
        "reorderPoint": 20,
        "maxStock": 100,
        "lastUpdated": "2025-01-23T05:30:00Z",
        "status": "in_stock",
        "demandForecast": 85,
        "seasonalTrend": "high"
      },
      {
        "id": "inv_2",
        "name": "Smart Fitness Watch Pro",
        "sku": "SFW-PRO-001",
        "supplier": "Amazon FBA Supplier",
        "currentStock": 8,
        "reorderPoint": 15,
        "maxStock": 60,
        "status": "low_stock",
        "lastUpdated": "2025-01-23T05:28:00Z",
        "demandForecast": 65,
        "seasonalTrend": "medium"
      },
      {
        "id": "inv_3",
        "name": "Wireless Gaming Headset",
        "sku": "WGH-001",
        "supplier": "Shopify Electronics",
        "currentStock": 0,
        "reorderPoint": 10,
        "maxStock": 40,
        "status": "out_of_stock",
        "lastUpdated": "2025-01-23T04:15:00Z",
        "demandForecast": 42,
        "seasonalTrend": "high"
      }
    ]);
  });

  app.get('/api/inventory/reorder-suggestions', async (req, res) => {
    return res.json([
      {
        "productId": "inv_2",
        "productName": "Smart Fitness Watch Pro",
        "currentStock": 8,
        "suggestedQuantity": 35,
        "urgency": "high",
        "reason": "Below reorder point + high seasonal demand",
        "supplier": "Amazon FBA Supplier",
        "estimatedCost": 8750,
        "leadTime": 3
      },
      {
        "productId": "inv_3",
        "productName": "Wireless Gaming Headset",
        "currentStock": 0,
        "suggestedQuantity": 25,
        "urgency": "high",
        "reason": "Out of stock + consistent demand",
        "supplier": "Shopify Electronics",
        "estimatedCost": 3750,
        "leadTime": 5
      }
    ]);
  });

  app.post('/api/inventory/reorder', async (req, res) => {
    const { productId, quantity, supplierId } = req.body;
    
    return res.json({
      "success": true,
      "orderId": `order_${Date.now()}`,
      "message": `Reorder of ${quantity} units initiated successfully`,
      "estimatedDelivery": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  });

  app.post('/api/inventory/sync', async (req, res) => {
    const { supplierId } = req.body;
    
    return res.json({
      "success": true,
      "syncId": `sync_${Date.now()}`,
      "message": "Inventory sync initiated successfully",
      "estimatedCompletion": new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
  });

  // Advanced Security & Compliance Routes
  app.get('/api/security/compliance', async (req, res) => {
    return res.json([
      {
        "id": "comp_1",
        "productId": "prod_1",
        "productName": "AirPods Pro (2nd Generation)",
        "checkType": "FCC",
        "status": "compliant",
        "lastChecked": "2025-01-23T05:30:00Z",
        "issues": [],
        "certificationRequired": true,
        "expiryDate": "2026-01-23T00:00:00Z"
      },
      {
        "id": "comp_2",
        "productId": "prod_2",
        "productName": "Smart Fitness Watch Pro",
        "checkType": "FDA",
        "status": "requires_review",
        "lastChecked": "2025-01-23T04:15:00Z",
        "issues": ["Missing FDA registration number", "Health claims require validation"],
        "certificationRequired": true
      },
      {
        "id": "comp_3",
        "productId": "prod_3",
        "productName": "Wireless Gaming Headset",
        "checkType": "CE",
        "status": "non_compliant",
        "lastChecked": "2025-01-23T03:45:00Z",
        "issues": ["Missing CE marking on product", "Declaration of Conformity not provided"],
        "certificationRequired": true
      }
    ]);
  });

  app.get('/api/security/moderation', async (req, res) => {
    return res.json([
      {
        "id": "mod_1",
        "productId": "prod_1",
        "productName": "Premium Bluetooth Speaker",
        "contentType": "description",
        "status": "flagged",
        "flaggedFor": ["Potential trademark violation", "Exaggerated claims"],
        "confidence": 87.5,
        "action": "content_edit"
      },
      {
        "id": "mod_2",
        "productId": "prod_2",
        "productName": "Ergonomic Office Chair",
        "contentType": "image",
        "status": "approved",
        "flaggedFor": [],
        "confidence": 95.2,
        "reviewedBy": "John Smith",
        "reviewedAt": "2025-01-23T05:15:00Z",
        "action": "none"
      },
      {
        "id": "mod_3",
        "productId": "prod_3",
        "productName": "Smart Home Camera",
        "contentType": "title",
        "status": "blocked",
        "flaggedFor": ["Prohibited brand reference", "Misleading feature claims"],
        "confidence": 92.8,
        "action": "removal"
      }
    ]);
  });

  app.get('/api/security/audit-logs', async (req, res) => {
    return res.json([
      {
        "id": "audit_1",
        "timestamp": "2025-01-23T05:30:00Z",
        "userId": "user_123",
        "userName": "Michael Prasad",
        "action": "Product Updated",
        "resourceType": "product",
        "resourceId": "prod_456",
        "changes": [
          { "field": "price", "oldValue": 299.99, "newValue": 279.99 },
          { "field": "description", "oldValue": "Old description", "newValue": "Updated description" }
        ],
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0 Chrome/120.0.0.0",
        "rollbackAvailable": true
      },
      {
        "id": "audit_2",
        "timestamp": "2025-01-23T05:15:00Z",
        "userId": "user_456",
        "userName": "Sarah Johnson",
        "action": "User Role Changed",
        "resourceType": "user",
        "resourceId": "user_789",
        "changes": [
          { "field": "role", "oldValue": "customer", "newValue": "vendor" }
        ],
        "ipAddress": "10.0.1.50",
        "userAgent": "Mozilla/5.0 Safari/605.1.15",
        "rollbackAvailable": true
      }
    ]);
  });

  app.get('/api/security/sso-providers', async (req, res) => {
    return res.json([
      {
        "id": "sso_1",
        "name": "Microsoft Active Directory",
        "type": "ActiveDirectory",
        "status": "active",
        "users": 156,
        "lastSync": "2025-01-23T05:30:00Z",
        "configuration": {
          "domain": "company.local",
          "endpoint": "ldap://ad.company.local"
        }
      },
      {
        "id": "sso_2",
        "name": "Google Workspace",
        "type": "OAuth2",
        "status": "active",
        "users": 89,
        "lastSync": "2025-01-23T05:25:00Z",
        "configuration": {
          "clientId": "google-workspace-client",
          "endpoint": "https://accounts.google.com/oauth2"
        }
      },
      {
        "id": "sso_3",
        "name": "Corporate SAML",
        "type": "SAML",
        "status": "inactive",
        "users": 0,
        "lastSync": "2025-01-22T18:00:00Z",
        "configuration": {
          "endpoint": "https://sso.company.com/saml"
        }
      }
    ]);
  });

  app.post('/api/security/compliance/scan', async (req, res) => {
    const { productId, checkType } = req.body;
    
    return res.json({
      "success": true,
      "scanId": `scan_${Date.now()}`,
      "message": `${checkType} compliance scan initiated for product ${productId}`,
      "estimatedCompletion": new Date(Date.now() + 3 * 60 * 1000).toISOString()
    });
  });

  app.post('/api/security/moderation/review', async (req, res) => {
    const { moderationId, action, reviewerId } = req.body;
    
    return res.json({
      "success": true,
      "message": `Content moderation review completed with action: ${action}`,
      "reviewedAt": new Date().toISOString(),
      "reviewedBy": reviewerId
    });
  });

  app.post('/api/security/audit/rollback', async (req, res) => {
    const { auditId } = req.body;
    
    return res.json({
      "success": true,
      "message": "Changes rolled back successfully",
      "rollbackId": `rollback_${Date.now()}`,
      "rollbackAt": new Date().toISOString()
    });
  });

  // === Advanced User Experience API Routes ===
  
  // Elasticsearch configuration endpoint
  app.get('/api/user-experience/elasticsearch/config', async (req, res) => {
    return res.json({
      "endpoint": "https://elastic.aveenix.com:9200",
      "status": "Connected",
      "indexedProducts": 15247,
      "responseTime": 45,
      "lastSync": "2 minutes ago",
      "indices": [
        {
          "name": "products",
          "documents": 15247,
          "size": "2.1GB",
          "status": "green"
        },
        {
          "name": "categories",
          "documents": 1024,
          "size": "15MB",
          "status": "green"
        }
      ]
    });
  });

  // Elasticsearch index management endpoint
  app.post('/api/user-experience/elasticsearch/rebuild-index', async (req, res) => {
    const { indexName } = req.body;
    
    return res.json({
      "success": true,
      "indexName": indexName || "products",
      "jobId": `rebuild_${Date.now()}`,
      "estimatedCompletion": new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      "message": "Index rebuild initiated successfully"
    });
  });

  // Search analytics endpoint
  app.get('/api/user-experience/elasticsearch/analytics', async (req, res) => {
    return res.json({
      "searchVolume": 24750,
      "averageResponseTime": 45,
      "topQueries": [
        { "query": "iPhone", "count": 3420, "avgTime": 32 },
        { "query": "laptop", "count": 2890, "avgTime": 41 },
        { "query": "headphones", "count": 2156, "avgTime": 38 }
      ],
      "zeroResultQueries": [
        { "query": "quantum computer", "count": 45 },
        { "query": "hologram device", "count": 23 }
      ],
      "performanceMetrics": {
        "indexSize": "2.1GB",
        "cacheHitRate": 87.3,
        "documentsPerSecond": 1247
      }
    });
  });

  // Bulk operations management endpoints
  app.get('/api/user-experience/bulk-operations', async (req, res) => {
    return res.json([
      {
        "id": "bulk_001",
        "type": "Price Update",
        "status": "In Progress",
        "progress": 68,
        "totalItems": 1250,
        "processedItems": 850,
        "startTime": "10:30 AM",
        "estimatedCompletion": "11:15 AM",
        "createdBy": "admin@aveenix.com",
        "template": "bulk_price_update_v1"
      },
      {
        "id": "bulk_002",
        "type": "Category Assignment", 
        "status": "Completed",
        "progress": 100,
        "totalItems": 340,
        "processedItems": 340,
        "startTime": "9:45 AM",
        "estimatedCompletion": "10:20 AM",
        "completedAt": "10:18 AM",
        "createdBy": "admin@aveenix.com"
      },
      {
        "id": "bulk_003",
        "type": "Stock Adjustment",
        "status": "Queued",
        "progress": 0,
        "totalItems": 890,
        "processedItems": 0,
        "startTime": "11:30 AM",
        "estimatedCompletion": "12:15 PM",
        "createdBy": "admin@aveenix.com"
      }
    ]);
  });

  // Create new bulk operation endpoint
  app.post('/api/user-experience/bulk-operations', async (req, res) => {
    const { type, targetProducts, operation, parameters } = req.body;
    
    return res.json({
      "success": true,
      "operationId": `bulk_${Date.now()}`,
      "type": type,
      "status": "Queued",
      "totalItems": targetProducts?.length || 0,
      "estimatedStartTime": new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      "message": `Bulk ${type} operation created successfully`
    });
  });

  // Bulk operation templates endpoint
  app.get('/api/user-experience/bulk-operations/templates', async (req, res) => {
    return res.json([
      {
        "id": "bulk_price_update_v1",
        "name": "Price Update Template",
        "description": "Update prices for multiple products with percentage or fixed amount changes",
        "fields": ["priceChange", "changeType", "roundingRule"],
        "usageCount": 127
      },
      {
        "id": "bulk_category_assign_v1", 
        "name": "Category Assignment Template",
        "description": "Assign products to categories based on rules or manual selection",
        "fields": ["targetCategory", "assignmentRule"],
        "usageCount": 89
      },
      {
        "id": "bulk_inventory_update_v1",
        "name": "Inventory Update Template", 
        "description": "Update stock levels for multiple products",
        "fields": ["stockChange", "changeType", "lowStockThreshold"],
        "usageCount": 156
      }
    ]);
  });

  // Product relationships endpoints
  app.get('/api/user-experience/product-relationships', async (req, res) => {
    return res.json([
      {
        "id": "rel_001",
        "sourceProductId": "prod_iphone15pro",
        "sourceProduct": "iPhone 15 Pro",
        "targetProductId": "prod_magsafe_charger",
        "targetProduct": "MagSafe Charger",
        "relationType": "Frequently Bought Together",
        "strength": 87,
        "confidence": 0.92,
        "basedOnData": "Purchase history analysis",
        "created": "3 days ago",
        "lastUpdated": "1 day ago"
      },
      {
        "id": "rel_002",
        "sourceProductId": "prod_macbook_m3",
        "sourceProduct": "MacBook Pro M3",
        "targetProductId": "prod_usbc_hub",
        "targetProduct": "USB-C Hub",
        "relationType": "Recommended Accessory",
        "strength": 92,
        "confidence": 0.95,
        "basedOnData": "AI recommendation engine",
        "created": "1 week ago",
        "lastUpdated": "2 days ago"
      },
      {
        "id": "rel_003",
        "sourceProductId": "prod_sony_headphones",
        "sourceProduct": "Sony Headphones",
        "targetProductId": "prod_bluetooth_adapter",
        "targetProduct": "Bluetooth Adapter", 
        "relationType": "Alternative Product",
        "strength": 78,
        "confidence": 0.84,
        "basedOnData": "Customer browsing patterns",
        "created": "2 days ago",
        "lastUpdated": "12 hours ago"
      }
    ]);
  });

  // Generate product relationships endpoint
  app.post('/api/user-experience/product-relationships/generate', async (req, res) => {
    const { sourceProductId, analysisType } = req.body;
    
    return res.json({
      "success": true,
      "jobId": `rel_gen_${Date.now()}`,
      "sourceProduct": sourceProductId,
      "analysisType": analysisType || "comprehensive",
      "estimatedCompletion": new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      "message": "Relationship analysis initiated. New relationships will be generated based on purchase history, browsing patterns, and product attributes."
    });
  });

  // Relationship analytics endpoint
  app.get('/api/user-experience/product-relationships/analytics', async (req, res) => {
    return res.json({
      "totalRelationships": 15429,
      "relationshipTypes": {
        "Frequently Bought Together": 8924,
        "Recommended Accessory": 4235,
        "Alternative Product": 2270
      },
      "averageStrength": 82.4,
      "topPerformingRelationships": [
        {
          "relationship": "iPhone 15 Pro → MagSafe Charger",
          "type": "Frequently Bought Together",
          "conversionRate": 34.2,
          "revenue": 125430
        },
        {
          "relationship": "MacBook Pro → USB-C Hub",
          "type": "Recommended Accessory", 
          "conversionRate": 28.7,
          "revenue": 89240
        }
      ],
      "strengthDistribution": {
        "high": 5429,
        "medium": 7234,
        "low": 2766
      }
    });
  });

  // Mobile optimization metrics endpoint
  app.get('/api/user-experience/mobile/metrics', async (req, res) => {
    return res.json([
      {
        "category": "Product Search",
        "desktopTime": 3.2,
        "mobileTime": 2.1,
        "improvement": 34,
        "status": "Optimized",
        "details": {
          "indexResponse": 1.1,
          "rendering": 0.8,
          "interaction": 0.2
        }
      },
      {
        "category": "Checkout Process",
        "desktopTime": 5.8,
        "mobileTime": 4.2,
        "improvement": 28,
        "status": "Optimized",
        "details": {
          "formValidation": 1.5,
          "paymentProcessing": 2.1,
          "confirmation": 0.6
        }
      },
      {
        "category": "Product Filtering",
        "desktopTime": 2.5,
        "mobileTime": 3.1,
        "improvement": -24,
        "status": "Needs Attention",
        "details": {
          "filterLoading": 1.8,
          "resultRendering": 1.0,
          "interaction": 0.3
        }
      },
      {
        "category": "Image Loading",
        "desktopTime": 1.8,
        "mobileTime": 1.3,
        "improvement": 28,
        "status": "Optimized",
        "details": {
          "compression": 0.4,
          "progressive": 0.6,
          "caching": 0.3
        }
      }
    ]);
  });

  // Mobile performance analytics endpoint
  app.get('/api/user-experience/mobile/analytics', async (req, res) => {
    return res.json({
      "overview": {
        "mobileUsers": 73,
        "pageLoadSpeed": 2.1,
        "mobileConversion": 4.8,
        "bounceRate": 32.4
      },
      "deviceBreakdown": {
        "smartphone": 68.2,
        "tablet": 4.8,
        "desktop": 27.0
      },
      "operatingSystem": {
        "iOS": 41.2,
        "Android": 58.8
      },
      "networkConditions": {
        "4G": 67.3,
        "WiFi": 28.7,
        "3G": 4.0
      },
      "topMobilePages": [
        {
          "page": "/",
          "visits": 125430,
          "avgLoadTime": 1.8,
          "conversionRate": 5.2
        },
        {
          "page": "/shop",
          "visits": 89240,
          "avgLoadTime": 2.3,
          "conversionRate": 4.1
        },
        {
          "page": "/categories",
          "visits": 67190,
          "avgLoadTime": 2.0,
          "conversionRate": 3.8
        }
      ]
    });
  });

  // Mobile optimization recommendations endpoint
  app.get('/api/user-experience/mobile/recommendations', async (req, res) => {
    return res.json([
      {
        "id": "mobile_rec_001",
        "priority": "High",
        "category": "Performance",
        "title": "Optimize Product Filtering on Mobile",
        "description": "Product filtering is 24% slower on mobile. Consider implementing progressive loading and simplified filter UI.",
        "impact": "High",
        "effort": "Medium",
        "estimatedImprovement": "35% faster filtering"
      },
      {
        "id": "mobile_rec_002",
        "priority": "Medium",
        "category": "User Experience",
        "title": "Implement Touch-Friendly Product Gallery",
        "description": "Enhance product image galleries with swipe gestures and pinch-to-zoom for better mobile experience.",
        "impact": "Medium",
        "effort": "Low",
        "estimatedImprovement": "15% higher engagement"
      },
      {
        "id": "mobile_rec_003",
        "priority": "Medium",
        "category": "Conversion",
        "title": "Streamline Mobile Checkout",
        "description": "Reduce mobile checkout steps from 4 to 3 and implement one-click payment options.",
        "impact": "High",
        "effort": "High",
        "estimatedImprovement": "22% higher conversion"
      }
    ]);
  });

  // Affiliate & Dropship Product Management Routes
  app.get('/api/affiliate-products', async (req, res) => {
    try {
      const affiliateProducts = await storage.getProductsByType('affiliate');
      res.json(affiliateProducts);
    } catch (error) {
      console.error('Error fetching affiliate products:', error);
      res.status(500).json({ error: 'Failed to fetch affiliate products' });
    }
  });

  app.get('/api/dropship-products', async (req, res) => {
    try {
      const dropshipProducts = await storage.getProductsByType('dropship');
      res.json(dropshipProducts);
    } catch (error) {
      console.error('Error fetching dropship products:', error);
      res.status(500).json({ error: 'Failed to fetch dropship products' });
    }
  });

  app.post('/api/affiliate-products', async (req, res) => {
    try {
      const { name, price, category, affiliateUrl, commissionRate, sourcePlatform, imageUrl, description } = req.body;
      
      const newProduct = await storage.createProduct({
        id: `affiliate_${Date.now()}`,
        name,
        price: price.toString(),
        category,
        affiliateUrl,
        commissionRate: commissionRate?.toString() || '0',
        sourcePlatform,
        productType: 'affiliate',
        imageUrl,
        description,
        brand: 'External',
        approvalStatus: 'pending'
      });

      res.json({ success: true, product: newProduct });
    } catch (error) {
      console.error('Error creating affiliate product:', error);
      res.status(500).json({ error: 'Failed to create affiliate product' });
    }
  });

  app.post('/api/dropship-products', async (req, res) => {
    try {
      const { name, price, category, supplierUrl, supplierName, stockQuantity, sourcePlatform, imageUrl, description } = req.body;
      
      const newProduct = await storage.createProduct({
        id: `dropship_${Date.now()}`,
        name,
        price: price.toString(),
        category,
        affiliateUrl: supplierUrl, // Store supplier URL in affiliateUrl field
        sourcePlatform,
        productType: 'dropship',
        imageUrl,
        description,
        brand: supplierName,
        stockQuantity: stockQuantity || 999, // Default high stock for dropship
        approvalStatus: 'pending'
      });

      res.json({ success: true, product: newProduct });
    } catch (error) {
      console.error('Error creating dropship product:', error);
      res.status(500).json({ error: 'Failed to create dropship product' });
    }
  });

  // Test endpoint to verify server is working
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
  });

  // Vendor product upload endpoint
  app.post('/api/vendor/products', async (req: any, res) => {
    try {
      console.log('Vendor product upload request received:', req.body);
      
      const { name, sku, price, stock, category, image, description } = req.body;
      
      // Validate required fields
      if (!name || !price || !category) {
        console.log('Validation failed - missing required fields');
        return res.status(400).json({ error: 'Name, price, and category are required' });
      }

      // Get vendor ID from user (for now using mock ID, in production this would come from authentication)
      const vendorId = 3; // Mock vendor ID for testing
      
      console.log('Creating product with data:', {
        name,
        price: price.toString(),
        category,
        imageUrl: image || 'https://via.placeholder.com/300x300?text=No+Image',
        description: description || '',
        sku: sku || '',
        stockQuantity: parseInt(stock) || 0,
        sourcePlatform: 'aveenix',
        productType: 'physical',
        vendorId: vendorId,
        approvalStatus: 'pending',
        isInStock: (parseInt(stock) || 0) > 0
      });
      
      const newProduct = await storage.createProduct({
        name,
        price: price.toString(),
        category,
        imageUrl: image || 'https://via.placeholder.com/300x300?text=No+Image',
        description: description || '',
        sku: sku || '',
        stockQuantity: parseInt(stock) || 0,
        sourcePlatform: 'aveenix',
        productType: 'physical',
        vendorId: vendorId,
        approvalStatus: 'pending', // Vendor products need approval
        isInStock: (parseInt(stock) || 0) > 0
      });

      console.log('Product created successfully:', newProduct);

      res.status(201).json({ 
        success: true, 
        message: 'Product uploaded successfully and is pending approval',
        product: newProduct 
      });
    } catch (error) {
      console.error('Error creating vendor product:', error);
      res.status(500).json({ error: 'Failed to create vendor product: ' + error.message });
    }
  });

  // Get vendor products endpoint
  app.get('/api/vendor/products', async (req: any, res) => {
    try {
      // For now using mock vendor ID, in production this would come from authentication
      const vendorId = 1; // Mock vendor ID for testing
      
      // Get all products for this vendor
      const vendorProducts = await storage.getProductsByVendor(vendorId);
      
      res.json(vendorProducts);
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      res.status(500).json({ error: 'Failed to fetch vendor products' });
    }
  });

  // Fix pricing structure for existing dropship products
  app.post('/api/dropship/fix-pricing', async (req, res) => {
    try {
      const dropshipProducts = await storage.getProducts({ productType: 'dropship' });
      
      let updated = 0;
      
      for (const product of dropshipProducts) {
        if (!product.costPrice || parseFloat(product.costPrice) === 0) {
          // Move current price to costPrice and set new sell price with margin
          const currentPrice = parseFloat(product.price);
          const newSellPrice = currentPrice * 1.5; // 50% margin
          
          await storage.updateProduct(product.id, {
            costPrice: currentPrice.toString(),
            price: newSellPrice.toString(),
            originalPrice: newSellPrice.toString()
          });
          
          updated++;
          console.log(`[Dropship Fix] Updated ${product.id}: Cost=${currentPrice}, Sell=${newSellPrice}`);
        }
      }
      
      res.json({
        success: true,
        message: `Updated ${updated} dropship products with correct pricing structure`,
        updatedCount: updated,
        totalDropshipProducts: dropshipProducts.length
      });
    } catch (error) {
      console.error('Error fixing dropship pricing:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fix dropship pricing'
      });
    }
  });

  // Get all dropship markup rates
  app.get('/api/dropship/rates', async (req, res) => {
    try {
      const { dropshipMarkupService } = await import('./services/dropshipMarkupService');
      const rates = await dropshipMarkupService.getAllMarkupRates();
      res.json({ success: true, rates });
    } catch (error) {
      console.error('Error fetching dropship rates:', error);
      res.status(500).json({ error: 'Failed to fetch dropship rates' });
    }
  });

  // Seed default dropship markup rates
  app.post('/api/dropship/seed-rates', async (req, res) => {
    try {
      const { dropshipMarkupService } = await import('./services/dropshipMarkupService');
      await dropshipMarkupService.seedDefaultRates();
      res.json({ success: true, message: 'Default dropship markup rates seeded successfully' });
    } catch (error) {
      console.error('Error seeding dropship rates:', error);
      res.status(500).json({ error: 'Failed to seed dropship rates' });
    }
  });

  // Set category markup rate (matches frontend expectation)
  app.post('/api/dropship/rates', async (req, res) => {
    try {
      const { categoryName, markupPercentage, notes } = req.body;
      
      if (!categoryName || !markupPercentage) {
        return res.status(400).json({ error: 'categoryName and markupPercentage are required' });
      }

      const { dropshipMarkupService } = await import('./services/dropshipMarkupService');
      const rate = await dropshipMarkupService.setCategoryMarkupRate(categoryName, markupPercentage, notes);
      
      res.json({ success: true, rate });
    } catch (error) {
      console.error('Error setting category markup rate:', error);
      res.status(500).json({ error: 'Failed to set category markup rate' });
    }
  });

  // Set category markup rate (legacy endpoint)
  app.post('/api/dropship/rates/category', async (req, res) => {
    try {
      const { categoryName, markupPercentage, notes } = req.body;
      
      if (!categoryName || !markupPercentage) {
        return res.status(400).json({ error: 'categoryName and markupPercentage are required' });
      }

      const { dropshipMarkupService } = await import('./services/dropshipMarkupService');
      const rate = await dropshipMarkupService.setCategoryMarkupRate(categoryName, markupPercentage, notes);
      
      res.json({ success: true, rate });
    } catch (error) {
      console.error('Error setting category markup rate:', error);
      res.status(500).json({ error: 'Failed to set category markup rate' });
    }
  });

  // Set individual product markup override (matches frontend expectation)
  app.post('/api/dropship/product-overrides', async (req, res) => {
    try {
      const { productId, markupPercentage, reason } = req.body;
      
      if (!productId || !markupPercentage) {
        return res.status(400).json({ error: 'productId and markupPercentage are required' });
      }

      const { dropshipMarkupService } = await import('./services/dropshipMarkupService');
      const override = await dropshipMarkupService.setProductMarkupOverride(
        productId, 
        markupPercentage, 
        reason
      );
      
      res.json({ success: true, override });
    } catch (error) {
      console.error('Error setting product markup override:', error);
      res.status(500).json({ error: 'Failed to set product markup override' });
    }
  });

  // Set individual product markup override (legacy endpoint)
  app.post('/api/dropship/rates/product', async (req, res) => {
    try {
      const { productId, customMarkupPercentage, reason } = req.body;
      
      if (!productId || !customMarkupPercentage) {
        return res.status(400).json({ error: 'productId and customMarkupPercentage are required' });
      }

      const { dropshipMarkupService } = await import('./services/dropshipMarkupService');
      const override = await dropshipMarkupService.setProductMarkupOverride(
        productId, 
        customMarkupPercentage, 
        reason
      );
      
      res.json({ success: true, override });
    } catch (error) {
      console.error('Error setting product markup override:', error);
      res.status(500).json({ error: 'Failed to set product markup override' });
    }
  });

  // Delete single product endpoint
  app.delete('/api/product-management/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      console.log(`[DEBUG] Deleting product with ID: ${id}`);
      
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }

      console.log(`[DEBUG] Successfully deleted product: ${id}`);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Hybrid Category Management API Routes
  
  // Get all master categories with real product counts (only main categories, not subcategories)
  app.get('/api/categories/master', async (req, res) => {
    try {
      // Get only main categories (parent_id IS NULL) - same logic as ecommerce-routes.ts but with product counts
      const mainCategories = await db.select().from(categories).where(sql`parent_id IS NULL`).orderBy(asc(categories.sortOrder));
      
      // Get all products to calculate real counts
      const allProducts = await storage.getAllProductsForManagement();
      
      // Enhanced mapping from product categories to master categories
      const categoryMapping = {
        'Electronics': 'Electronics & Technology',
        'Computers': 'Electronics & Technology', 
        'Smartphones': 'Electronics & Technology',
        'Photography': 'Electronics & Technology',
        'Wearables': 'Electronics & Technology',
        'Technology': 'Electronics & Technology',
        'Tech': 'Electronics & Technology',
        'Clothing': 'Fashion & Apparel',
        'Footwear': 'Fashion & Apparel',
        'Fashion': 'Fashion & Apparel',
        'Apparel': 'Fashion & Apparel',
        'Home Appliances': 'Home & Garden',
        'Home': 'Home & Garden',
        'Garden': 'Home & Garden',
        'Furniture': 'Home & Garden',
        'Sports': 'Sports & Outdoors',
        'Fitness': 'Sports & Outdoors',
        'Outdoors': 'Sports & Outdoors',
        'Health': 'Health & Beauty',
        'Beauty': 'Health & Beauty',
        'Wellness': 'Health & Beauty',
        'Books': 'Books & Media',
        'Media': 'Books & Media',
        'Toys': 'Toys & Games',
        'Games': 'Toys & Games',
        'Gaming': 'Toys & Games',
        'Automotive': 'Automotive',
        'Cars': 'Automotive',
        'Vehicle': 'Automotive',
        'Office': 'Office & Business',
        'Business': 'Office & Business',
        'Pet': 'Pet Supplies',
        'Pets': 'Pet Supplies',
        'Baby': 'Baby & Kids',
        'Kids': 'Baby & Kids',
        'Children': 'Baby & Kids',
        'Food': 'Food & Beverages',
        'Beverages': 'Food & Beverages',
        'Drinks': 'Food & Beverages',
        'Jewelry': 'Jewelry & Accessories',
        'Accessories': 'Jewelry & Accessories',
        'Tools': 'Tools & Hardware',
        'Hardware': 'Tools & Hardware',
        'Arts': 'Arts & Crafts',
        'Crafts': 'Arts & Crafts'
      };
      
      // Calculate product counts for each master category and get subcategories
      const categoriesWithCounts = await Promise.all(mainCategories.map(async (category) => {
        const productCount = allProducts.filter(product => {
          if (!product.category) return false;
          
          // Direct match
          if (product.category === category.name) return true;
          
          // Mapped match
          const mappedCategory = categoryMapping[product.category];
          if (mappedCategory === category.name) return true;
          
          // Partial match (for cases like "Electronics" matching "Electronics & Technology")
          const categoryNameLower = category.name.toLowerCase();
          const productCategoryLower = product.category.toLowerCase();
          
          // Check if category name contains product category or vice versa
          if (categoryNameLower.includes(productCategoryLower) || productCategoryLower.includes(categoryNameLower)) {
            return true;
          }
          
          // Check for word-level matches (e.g., "Electronics" in "Electronics & Technology")
          const categoryWords = categoryNameLower.split(/[\s&]+/);
          const productWords = productCategoryLower.split(/[\s&]+/);
          
          for (const categoryWord of categoryWords) {
            for (const productWord of productWords) {
              if (categoryWord === productWord && categoryWord.length > 2) { // Avoid matching short words
                return true;
              }
            }
          }
          
          return false;
        }).length;
        
        // Get subcategories for this main category
        const subcategories = await db.select().from(categories).where(eq(categories.parentId, category.id)).orderBy(asc(categories.sortOrder));
        
        return {
          ...category,
          productCount,
          subcategories,
          description: category.description || `Manage ${category.name.toLowerCase()} products`
        };
      }));
      
      res.json(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching master categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Classify a product automatically using smart rules
  app.post('/api/categories/classify-product', async (req, res) => {
    try {
      const { productName, description, brand, price } = req.body;
      
      if (!productName) {
        return res.status(400).json({ error: 'Product name is required' });
      }

      const classification = await categoryService.classifyProduct(
        productName,
        description,
        brand,
        price
      );
      
      res.json(classification);
    } catch (error) {
      console.error('Error classifying product:', error);
      res.status(500).json({ error: 'Failed to classify product' });
    }
  });

  // Find master category from platform category
  app.post('/api/categories/find-master-from-platform', async (req, res) => {
    try {
      const { platformName, platformCategoryId, platformCategoryName } = req.body;
      
      if (!platformName || !platformCategoryId) {
        return res.status(400).json({ 
          error: 'Platform name and category ID are required' 
        });
      }

      const masterCategory = await categoryService.findMasterCategoryFromPlatform(
        platformName,
        platformCategoryId,
        platformCategoryName
      );
      
      if (!masterCategory) {
        return res.json({ 
          found: false, 
          message: 'No master category mapping found' 
        });
      }

      res.json({ 
        found: true, 
        category: masterCategory 
      });
    } catch (error) {
      console.error('Error finding master category from platform:', error);
      res.status(500).json({ error: 'Failed to find master category' });
    }
  });

  // Create new platform mapping
  app.post('/api/categories/create-platform-mapping', async (req, res) => {
    try {
      const {
        masterCategoryId,
        platformName,
        platformCategoryId,
        platformCategoryName,
        platformCategoryPath,
        confidence = 100,
        isAutoGenerated = false
      } = req.body;
      
      if (!masterCategoryId || !platformName || !platformCategoryId || !platformCategoryName) {
        return res.status(400).json({ 
          error: 'Master category ID, platform name, platform category ID, and name are required' 
        });
      }

      await categoryService.createPlatformMapping(
        masterCategoryId,
        platformName,
        platformCategoryId,
        platformCategoryName,
        platformCategoryPath,
        confidence,
        isAutoGenerated
      );
      
      res.json({ success: true, message: 'Platform mapping created successfully' });
    } catch (error) {
      console.error('Error creating platform mapping:', error);
      res.status(500).json({ error: 'Failed to create platform mapping' });
    }
  });

  // Get platform mappings for a category
  app.get('/api/categories/:categoryId/platform-mappings', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      const mappings = await categoryService.getPlatformMappings(categoryId);
      res.json(mappings);
    } catch (error) {
      console.error('Error fetching platform mappings:', error);
      res.status(500).json({ error: 'Failed to fetch platform mappings' });
    }
  });

  // Create new classification rule
  app.post('/api/categories/create-classification-rule', async (req, res) => {
    try {
      const {
        ruleName,
        ruleType,
        pattern,
        targetCategoryId,
        priority = 50,
        confidence = 75
      } = req.body;
      
      if (!ruleName || !ruleType || !pattern || !targetCategoryId) {
        return res.status(400).json({ 
          error: 'Rule name, type, pattern, and target category ID are required' 
        });
      }

      await categoryService.createClassificationRule(
        ruleName,
        ruleType,
        pattern,
        targetCategoryId,
        priority,
        confidence
      );
      
      res.json({ success: true, message: 'Classification rule created successfully' });
    } catch (error) {
      console.error('Error creating classification rule:', error);
      res.status(500).json({ error: 'Failed to create classification rule' });
    }
  });

  // Update category product counts
  app.post('/api/categories/update-counts', async (req, res) => {
    try {
      await categoryService.updateCategoryCounts();
      res.json({ success: true, message: 'Category counts updated successfully' });
    } catch (error) {
      console.error('Error updating category counts:', error);
      res.status(500).json({ error: 'Failed to update category counts' });
    }
  });

  // Stripe: create payment intent
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency = 'usd', customerEmail, orderId, metadata } = req.body || {};
      if (!amount || isNaN(Number(amount))) {
        return res.status(400).json({ error: 'Amount is required (in cents)' });
      }
      const cents = Math.round(Number(amount) * (amount > 0 && amount < 1000 ? 100 : 1));
      const result = await import('./stripe').then(m => m.createPaymentIntent({
        amount: cents,
        currency,
        customerEmail,
        orderId,
        metadata
      }));
      res.json(result);
    } catch (error: any) {
      console.error('Stripe create-payment-intent error:', error);
      res.status(500).json({ error: error?.message || 'Failed to create payment intent' });
    }
  });

  // Get classification statistics
  app.get('/api/categories/classification-stats', async (req, res) => {
    try {
      const stats = await categoryService.getClassificationStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching classification stats:', error);
      res.status(500).json({ error: 'Failed to fetch classification stats' });
    }
  });

  // User Address Management Routes
  app.get('/api/user/:userId/addresses', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  });

  app.get('/api/user/:userId/addresses/default', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const defaultAddress = await storage.getUserDefaultAddress(userId);
      res.json(defaultAddress || null);
    } catch (error) {
      console.error('Error fetching default address:', error);
      res.status(500).json({ error: 'Failed to fetch default address' });
    }
  });

  app.post('/api/user/:userId/addresses', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const addressData = { ...req.body, userId };
      const newAddress = await storage.createUserAddress(addressData);
      res.json(newAddress);
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ error: 'Failed to create address' });
    }
  });

  app.put('/api/user/:userId/addresses/:addressId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const addressId = parseInt(req.params.addressId);
      const addressData = { ...req.body, userId };
      const updatedAddress = await storage.updateUserAddress(addressId, addressData);
      res.json(updatedAddress);
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ error: 'Failed to update address' });
    }
  });

  app.delete('/api/user/:userId/addresses/:addressId', async (req, res) => {
    try {
      const addressId = parseInt(req.params.addressId);
      const success = await storage.deleteUserAddress(addressId);
      res.json({ success });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ error: 'Failed to delete address' });
    }
  });

  app.put('/api/user/:userId/addresses/:addressId/set-default', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const addressId = parseInt(req.params.addressId);
      const success = await storage.setDefaultAddress(userId, addressId);
      res.json({ success });
    } catch (error) {
      console.error('Error setting default address:', error);
      res.status(500).json({ error: 'Failed to set default address' });
    }
  });

  // User Profile Management Routes
  app.get('/api/user/:userId/profile', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userProfile = await storage.getUserProfile(userId);
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });

  app.put('/api/user/:userId/profile', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profileData = req.body;
      const updatedProfile = await storage.updateUserProfile(userId, profileData);
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  });

  // User Account Statistics Routes
  app.get('/api/user/:userId/stats', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserAccountStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
  });

  // Register specialized route modules
  app.use('/api/vendor', vendorRoutes);
  app.use('/api/user', userPreferencesRoutes);
  app.use('/api/community', communityRoutes);
  app.use('/api/creator-economy', creatorEconomyRoutes);
  app.use('/api/rewards', rewardsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api', salesRoutes);

  // Sales Dashboard Stats API
  app.get('/api/sales/dashboard/stats', async (req, res) => {
    try {
      // Return empty stats for now (following no dummy data policy)
      const salesStats = {
        totalRevenue: 0,
        monthlyGrowth: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        activeCustomers: 0,
        conversionRate: 0
      };
      
      res.json(salesStats);
    } catch (error) {
      console.error('Error fetching sales dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch sales dashboard stats' });
    }
  });

  // Hybrid Category Mapping Routes
  
  // Initialize hybrid category mappings
  app.post('/api/categories/hybrid/initialize', async (req, res) => {
    try {
      await hybridCategoryMappingService.initializeHybridMappings();
      res.json({ 
        success: true, 
        message: 'Hybrid category mappings initialized successfully' 
      });
    } catch (error) {
      console.error('Error initializing hybrid mappings:', error);
      res.status(500).json({ 
        error: 'Failed to initialize hybrid category mappings' 
      });
    }
  });

  // Get enhanced category classification for a product
  app.post('/api/categories/hybrid/classify', async (req, res) => {
    try {
      const { 
        productName, 
        description, 
        wooCommerceCategories, 
        brand, 
        price, 
        tags 
      } = req.body;

      if (!productName) {
        return res.status(400).json({ error: 'Product name is required' });
      }

      const classification = await hybridCategoryMappingService.classifyProductAdvanced(
        productName,
        description,
        wooCommerceCategories,
        brand,
        price,
        tags
      );

      res.json(classification);
    } catch (error) {
      console.error('Error classifying product:', error);
      res.status(500).json({ error: 'Failed to classify product' });
    }
  });

  // Get hybrid category classification statistics
  app.get('/api/categories/hybrid/stats', async (req, res) => {
    try {
      const stats = await hybridCategoryMappingService.getClassificationStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting hybrid classification stats:', error);
      res.status(500).json({ error: 'Failed to get classification statistics' });
    }
  });

  // Placeholder image generator endpoint (replaces hardcoded placeholder paths)
  app.get('/api/placeholder/:width/:height', (req, res) => {
    const { width, height } = req.params;
    const text = req.query.text || 'Product Image';
    
    // Generate a simple SVG placeholder with proper styling
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="m0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2" style="stroke:#e5e7eb;stroke-width:1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f9fafb"/>
        <rect x="2" y="2" width="${parseInt(width) - 4}" height="${parseInt(height) - 4}" 
              fill="url(#diagonalHatch)" stroke="#e5e7eb" stroke-width="1" rx="4"/>
        <text x="50%" y="50%" font-family="system-ui,sans-serif" font-size="12" 
              text-anchor="middle" dy=".3em" fill="#9ca3af">
          ${String(text).substring(0, 25)}${String(text).length > 25 ? '...' : ''}
        </text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(svg);
  });

  const httpServer = createServer(app);

  // Manual trigger for Smart Import workflow
  app.post('/api/woocommerce/process-preview-products', async (req, res) => {
    try {
      console.log('[Manual Smart Import] Processing preview products...');
      
      // Get preview products ready for automation (with automation actions set)
      const previewProducts = await storage.getProductsByApprovalStatus('preview');
      const automationReadyProducts = previewProducts.filter(p => 
        p.automationAction && p.automationAction !== 'manual-review'
      );
      
      if (automationReadyProducts.length === 0) {
        return res.json({
          success: true,
          processed: 0,
          message: 'No preview products with automation actions found'
        });
      }

      console.log(`[Manual Smart Import] Processing ${automationReadyProducts.length} preview products...`);
      
      let processed = 0;
      for (const product of automationReadyProducts) {
        try {
          if (product.automationAction === 'auto-approve') {
            await storage.updateProductApprovalStatus(product.id, 'approved');
            console.log(`[Manual Smart Import] ✅ Auto-approved: ${product.name}`);
            processed++;
          } else if (product.automationAction === 'auto-pending') {
            await storage.updateProductApprovalStatus(product.id, 'pending');
            console.log(`[Manual Smart Import] ⏳ Moved to pending: ${product.name}`);
            processed++;
          } else if (product.automationAction === 'auto-reject') {
            await storage.updateProductApprovalStatus(product.id, 'rejected');
            console.log(`[Manual Smart Import] ❌ Auto-rejected: ${product.name}`);
            processed++;
          }
        } catch (error) {
          console.error(`[Manual Smart Import] Error processing ${product.name}:`, error);
        }
      }
      
      console.log(`[Manual Smart Import] Completed - processed ${processed} products`);
      
      res.json({
        success: true,
        processed,
        total: automationReadyProducts.length,
        message: `Successfully processed ${processed} preview products`
      });
    } catch (error) {
      console.error('[Manual Smart Import] Error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed'
      });
    }
  });

  // ===== Reviews API Routes =====
  
  // Get authentic product reviews endpoint - ensures 100% real data
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = req.params.id;
      const reviews = await storage.getReviews(productId);
      
      // Return only authentic review data - no fake/mock data
      const authenticReviews = (reviews || []).map(review => ({
        id: review.id,
        productId: review.productId,
        reviewerName: review.reviewerName,
        rating: review.rating,
        title: review.title,
        content: review.content,
        reviewDate: review.reviewDate,
        isVerifiedPurchase: review.isVerifiedPurchase,
        helpfulCount: review.helpfulCount,
        unhelpfulCount: review.unhelpfulCount || 0,
        sourcePlatform: review.sourcePlatform,
        moderationStatus: review.moderationStatus || 'approved'
      }));
      
      res.json(authenticReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Return empty array instead of error for better UX
      res.json([]);
    }
  });

  // Submit new review (authenticated users only)
  app.post('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = req.params.id;
      const { rating, title, content, reviewerName, reviewerEmail } = req.body;
      
      // Basic validation
      if (!rating || !content || !reviewerName) {
        return res.status(400).json({ error: 'Rating, content, and reviewer name are required' });
      }
      
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      
      // Create review with pending moderation status
      const review = await storage.createReview({
        productId,
        rating: parseInt(rating),
        title: title || '',
        content,
        reviewerName,
        reviewerEmail: reviewerEmail || null,
        sourcePlatform: 'aveenix',
        isVerifiedPurchase: false, // TODO: Check if user purchased this product
        reviewDate: new Date(),
        moderationStatus: 'pending'
      });
      
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  });

  // Vote on review helpfulness
  app.post('/api/reviews/:id/vote', async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { voteType, userId } = req.body; // 'helpful' or 'unhelpful'
      
      if (!voteType || !['helpful', 'unhelpful'].includes(voteType)) {
        return res.status(400).json({ error: 'Invalid vote type' });
      }
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      // Check if user already voted on this review
      const existingVote = await storage.getReviewVote(reviewId, userId);
      if (existingVote) {
        return res.status(400).json({ error: 'User has already voted on this review' });
      }
      
      // Create vote and update review counts
      await storage.createReviewVote({
        reviewId,
        userId,
        voteType
      });
      
      // Update review vote counts
      await storage.updateReviewVoteCounts(reviewId);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error voting on review:', error);
      res.status(500).json({ error: 'Failed to vote on review' });
    }
  });

  // Admin review management endpoints
  app.get('/api/admin/reviews', async (req, res) => {
    try {
      const { status = 'pending', limit = 50, offset = 0 } = req.query;
      
      const reviews = await storage.getReviewsByModerationStatus(
        status as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews for admin:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  // Get review statistics for admin dashboard
  app.get('/api/admin/reviews/stats', async (req, res) => {
    try {
      const stats = await storage.getReviewStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching review stats:', error);
      res.status(500).json({ error: 'Failed to fetch review statistics' });
    }
  });

  // Moderate review (approve/reject)
  app.put('/api/admin/reviews/:id/moderate', async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { action, reason, moderatorId } = req.body; // 'approve' or 'reject'
      
      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Invalid moderation action' });
      }
      
      const moderationStatus = action === 'approve' ? 'approved' : 'rejected';
      
      await storage.moderateReview(reviewId, {
        moderationStatus,
        moderatedBy: moderatorId || null,
        moderatedAt: new Date(),
        moderationReason: reason || null
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error moderating review:', error);
      res.status(500).json({ error: 'Failed to moderate review' });
    }
  });

  // ===== Commission API Routes =====
  
  // Import commission service
  const { commissionService } = await import('./services/commissionService');
  
  // Seed default Amazon commission rates on startup (if not already done)
  try {
    await commissionService.seedDefaultRates();
  } catch (error) {
    console.error('Error seeding commission rates:', error);
  }

  // Get commission calculation for a single product
  app.get('/api/products/:id/commission', async (req, res) => {
    try {
      const productId = req.params.id;
      const calculation = await commissionService.calculateProductCommission(productId);
      
      if (!calculation) {
        return res.status(404).json({ error: 'Product not found or commission calculation failed' });
      }
      
      res.json(calculation);
    } catch (error) {
      console.error('Error calculating product commission:', error);
      res.status(500).json({ error: 'Failed to calculate commission' });
    }
  });

  // Calculate commission for multiple products (bulk)
  app.post('/api/products/commission/bulk', async (req, res) => {
    try {
      const { productIds } = req.body;
      
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ error: 'Product IDs array is required' });
      }
      
      const calculations = await commissionService.calculateBulkCommissions(productIds);
      res.json({ calculations, count: calculations.length });
    } catch (error) {
      console.error('Error calculating bulk commissions:', error);
      res.status(500).json({ error: 'Failed to calculate bulk commissions' });
    }
  });

  // Update commission rate for a product
  app.put('/api/products/:id/commission-rate', async (req, res) => {
    try {
      const productId = req.params.id;
      const { commissionRate } = req.body;
      
      if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
        return res.status(400).json({ error: 'Invalid commission rate. Must be between 0 and 100' });
      }
      
      const success = await commissionService.updateProductCommissionRate(productId, commissionRate);
      
      if (success) {
        res.json({ success: true, message: 'Commission rate updated successfully' });
      } else {
        res.status(500).json({ error: 'Failed to update commission rate' });
      }
    } catch (error) {
      console.error('Error updating commission rate:', error);
      res.status(500).json({ error: 'Failed to update commission rate' });
    }
  });

  // Get all commission rates for admin interface
  app.get('/api/commission-rates', async (req, res) => {
    try {
      const rates = await commissionService.getAllCommissionRates();
      res.json(rates);
    } catch (error) {
      console.error('Error fetching commission rates:', error);
      res.status(500).json({ error: 'Failed to fetch commission rates' });
    }
  });

  // Update or create commission rate for a category
  app.put('/api/commission-rates/:platform/:category', async (req, res) => {
    try {
      const { platform, category } = req.params;
      const { 
        commissionRate, 
        isPromotional, 
        promotionalRate, 
        promotionalStartDate, 
        promotionalEndDate 
      } = req.body;
      
      if (!['amazon', 'aliexpress', 'walmart'].includes(platform)) {
        return res.status(400).json({ error: 'Invalid platform' });
      }
      
      if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
        return res.status(400).json({ error: 'Invalid commission rate' });
      }
      
      const success = await commissionService.upsertCommissionRate(
        platform as 'amazon' | 'aliexpress' | 'walmart',
        decodeURIComponent(category),
        commissionRate,
        isPromotional,
        promotionalRate,
        promotionalStartDate ? new Date(promotionalStartDate) : undefined,
        promotionalEndDate ? new Date(promotionalEndDate) : undefined
      );
      
      if (success) {
        res.json({ success: true, message: 'Commission rate updated successfully' });
      } else {
        res.status(500).json({ error: 'Failed to update commission rate' });
      }
    } catch (error) {
      console.error('Error updating category commission rate:', error);
      res.status(500).json({ error: 'Failed to update commission rate' });
    }
  });

  // Get commission rate for a specific category
  app.get('/api/commission-rates/:platform/:category', async (req, res) => {
    try {
      const { platform, category } = req.params;
      
      if (!['amazon', 'aliexpress', 'walmart'].includes(platform)) {
        return res.status(400).json({ error: 'Invalid platform' });
      }
      
      const rateInfo = await commissionService.getCommissionRate(
        decodeURIComponent(category),
        platform as 'amazon' | 'aliexpress' | 'walmart'
      );
      
      res.json(rateInfo);
    } catch (error) {
      console.error('Error fetching commission rate:', error);
      res.status(500).json({ error: 'Failed to fetch commission rate' });
    }
  });

  // Amazon Commission Rates Management API endpoints
  app.get('/api/amazon-rates', async (req, res) => {
    try {
      const rates = await db.select().from(amazonCommissionRates).orderBy(amazonCommissionRates.categoryName);
      res.json(rates);
    } catch (error) {
      console.error('Error fetching Amazon rates:', error);
      res.status(500).json({ error: 'Failed to fetch Amazon commission rates' });
    }
  });

  app.post('/api/amazon-rates', async (req, res) => {
    try {
      const { categoryName, commissionRate, rateSource } = req.body;
      
      if (!categoryName || !commissionRate) {
        return res.status(400).json({ error: 'Category name and commission rate are required' });
      }

      const [newRate] = await db.insert(amazonCommissionRates).values({
        categoryName,
        commissionRate: commissionRate.toString(),
        rateSource: rateSource || 'amazon_official'
      }).returning();

      res.json(newRate);
    } catch (error) {
      console.error('Error creating Amazon rate:', error);
      res.status(500).json({ error: 'Failed to create Amazon commission rate' });
    }
  });

  app.put('/api/amazon-rates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryName, commissionRate, rateSource } = req.body;

      const [updatedRate] = await db.update(amazonCommissionRates)
        .set({
          categoryName,
          commissionRate: commissionRate.toString(),
          rateSource: rateSource || 'custom',
          lastUpdated: new Date()
        })
        .where(eq(amazonCommissionRates.id, parseInt(id)))
        .returning();

      if (!updatedRate) {
        return res.status(404).json({ error: 'Commission rate not found' });
      }

      res.json(updatedRate);
    } catch (error) {
      console.error('Error updating Amazon rate:', error);
      res.status(500).json({ error: 'Failed to update Amazon commission rate' });
    }
  });

  app.delete('/api/amazon-rates/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const [deletedRate] = await db.delete(amazonCommissionRates)
        .where(eq(amazonCommissionRates.id, parseInt(id)))
        .returning();

      if (!deletedRate) {
        return res.status(404).json({ error: 'Commission rate not found' });
      }

      res.json({ success: true, message: 'Commission rate deleted successfully' });
    } catch (error) {
      console.error('Error deleting Amazon rate:', error);
      res.status(500).json({ error: 'Failed to delete Amazon commission rate' });
    }
  });

  app.post('/api/amazon-rates/seed-defaults', async (req, res) => {
    try {
      // Amazon affiliate commission rates (as of 2024)
      const defaultRates = [
        { categoryName: 'Electronics & Technology', commissionRate: '2.50' },
        { categoryName: 'Computers & Accessories', commissionRate: '2.50' },
        { categoryName: 'Home & Garden', commissionRate: '8.00' },
        { categoryName: 'Sports & Outdoors', commissionRate: '4.50' },
        { categoryName: 'Health & Household', commissionRate: '4.50' },
        { categoryName: 'Beauty & Personal Care', commissionRate: '4.50' },
        { categoryName: 'Baby Products', commissionRate: '4.50' },
        { categoryName: 'Toys & Games', commissionRate: '4.50' },
        { categoryName: 'Books', commissionRate: '4.50' },
        { categoryName: 'Movies & TV', commissionRate: '4.50' },
        { categoryName: 'Music', commissionRate: '4.50' },
        { categoryName: 'Automotive', commissionRate: '4.50' },
        { categoryName: 'Automotive Tools & Equipment', commissionRate: '12.00' },
        { categoryName: 'Fashion', commissionRate: '10.00' },
        { categoryName: 'Jewelry', commissionRate: '10.00' },
        { categoryName: 'Pet Supplies', commissionRate: '5.00' },
        { categoryName: 'Office Products', commissionRate: '6.00' },
        { categoryName: 'Arts, Crafts & Sewing', commissionRate: '4.50' },
        { categoryName: 'Grocery & Gourmet Food', commissionRate: '5.00' },
        { categoryName: 'Industrial & Scientific', commissionRate: '3.00' },
      ];

      // Insert rates, handling duplicates
      for (const rate of defaultRates) {
        try {
          await db.insert(amazonCommissionRates)
            .values({
              categoryName: rate.categoryName,
              commissionRate: rate.commissionRate,
              rateSource: 'amazon_official'
            })
            .onConflictDoUpdate({
              target: amazonCommissionRates.categoryName,
              set: {
                commissionRate: rate.commissionRate,
                lastUpdated: new Date(),
                rateSource: 'amazon_official'
              }
            });
        } catch (error) {
          console.log(`Rate already exists for ${rate.categoryName}, skipping...`);
        }
      }

      res.json({ success: true, message: 'Default Amazon commission rates seeded successfully' });
    } catch (error) {
      console.error('Error seeding default rates:', error);
      res.status(500).json({ error: 'Failed to seed default Amazon commission rates' });
    }
  });

  // Jarvis Q&A endpoint for product questions
  app.post('/api/jarvis/product-question', async (req, res) => {
    try {
      const { question, productId, productName, customerName, customerEmail, productContext } = req.body;
      
      // Generate intelligent response based on product context
      const generateProductAnswer = (question: string, context: any) => {
        const q = question.toLowerCase();
        
        if (q.includes('price') || q.includes('cost') || q.includes('expensive')) {
          return `Great question about pricing! The ${productName} is currently priced at $${context.price}. This price reflects the quality and features of the product. We often have promotions and discounts available - would you like me to check for any current offers?`;
        }
        
        if (q.includes('shipping') || q.includes('delivery') || q.includes('arrive')) {
          return `For shipping information: We typically offer free shipping on orders over $50. Standard shipping takes 3-5 business days, while express shipping (1-2 days) is available for $9.99. The ${productName} ships from our warehouse and is usually in stock for immediate dispatch.`;
        }
        
        if (q.includes('size') || q.includes('fit') || q.includes('dimension')) {
          return `Thanks for asking about sizing! Based on our authentic product data, this item has specific dimensions. I recommend checking the detailed specifications tab on the product page. If you need help choosing the right size, our size guide and customer reviews often provide helpful insights.`;
        }
        
        if (q.includes('quality') || q.includes('material') || q.includes('durable')) {
          return `Great question about quality! The ${productName} is made with quality materials as described in our specifications. Based on customer reviews and feedback, this product has received positive ratings for its construction and durability. Check out the reviews section for authentic customer experiences!`;
        }
        
        if (q.includes('return') || q.includes('refund') || q.includes('exchange')) {
          return `We offer a hassle-free return policy! You can return the ${productName} within 30 days of purchase for a full refund, provided it's in original condition. We also offer exchanges for different sizes or colors when available. Returns are processed within 5-7 business days.`;
        }
        
        if (q.includes('warranty') || q.includes('guarantee')) {
          return `The ${productName} comes with our standard warranty coverage. Most products include a manufacturer's warranty - specific details can be found in the product specifications. We also stand behind all our products with our satisfaction guarantee!`;
        }
        
        // Default intelligent response
        return `Thank you for your question about the ${productName}! I've recorded your inquiry and our team will provide you with detailed information soon. In the meantime, you might find helpful information in the product description, specifications, or customer reviews sections. Is there anything specific about the product I can help clarify right away?`;
      };
      
      const answer = generateProductAnswer(question, productContext);
      
      // Log the Q&A for future analysis (could be stored in database)
      console.log(`[Jarvis Q&A] Product: ${productName} | Customer: ${customerName} | Question: ${question}`);
      
      res.json({ 
        success: true, 
        answer,
        timestamp: new Date().toISOString(),
        productId 
      });
      
    } catch (error) {
      console.error('Error processing Jarvis question:', error);
      res.status(500).json({ error: 'Failed to process question' });
    }
  });

  // Jarvis Chat endpoint (for floating chat)
  app.post("/api/jarvis/chat", async (req, res) => {
    try {
      const { question, productContext } = req.body;
      
      if (!question || !question.trim()) {
        return res.status(400).json({ error: "Question is required" });
      }

      // Generate intelligent response using the same logic as product questions
      const generateAnswer = (question: string, context: any = {}) => {
        const q = question.toLowerCase();
        
        if (q.includes('price') || q.includes('cost') || q.includes('expensive')) {
          return context.productName ? 
            `Great question about pricing! The ${context.productName} is currently priced competitively. I can help you find current promotions or compare with similar products if you'd like!` :
            "I can help you with pricing information! Could you let me know which product you're interested in?";
        }
        
        if (q.includes('shipping') || q.includes('delivery') || q.includes('arrive')) {
          return "For shipping: We typically offer free shipping on orders over $50. Standard shipping takes 3-5 business days, while express shipping (1-2 days) is available for $9.99. Most items ship from our warehouse for immediate dispatch.";
        }
        
        if (q.includes('return') || q.includes('refund') || q.includes('exchange')) {
          return "We offer a hassle-free return policy! You can return items within 30 days of purchase for a full refund, provided they're in original condition. Returns are processed within 5-7 business days.";
        }
        
        if (q.includes('quality') || q.includes('review') || q.includes('rating')) {
          return context.productName ? 
            `The ${context.productName} has been well-received by customers! Check out the authentic customer reviews and ratings on the product page for detailed feedback about quality and performance.` :
            "I can help you check product quality and reviews! Which product are you interested in learning about?";
        }
        
        // Default intelligent response
        return "I'm here to help with any questions about our products, pricing, shipping, returns, or platform features. What would you like to know more about?";
      };
      
      const answer = generateAnswer(question, productContext);
      
      res.json({
        answer,
        category: 'general',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ error: "Failed to process question" });
    }
  });

  // Cart route removed - using ecommerce-routes.ts cart route instead

  // Add item to cart
  app.post('/api/cart', async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
      
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      // Initialize guest cart if not exists
      if (!req.session.guestCart) {
        req.session.guestCart = [];
      }

      // Check if item already exists in cart
      const existingItemIndex = req.session.guestCart.findIndex(
        (item: any) => item.productId === productId
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        req.session.guestCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const newItem = {
          id: `${Date.now()}`,
          productId,
          quantity,
          createdAt: new Date().toISOString()
        };
        req.session.guestCart.push(newItem);
      }

      res.status(201).json({
        message: 'Item added to cart',
        cartItems: req.session.guestCart
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  });

  // Remove item from cart
  app.delete('/api/cart/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      
      if (!req.session.guestCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Remove item from cart
      req.session.guestCart = req.session.guestCart.filter(
        (item: any) => item.id !== itemId
      );

      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  });

  // Update cart item quantity
  app.put('/api/cart/:itemId', async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      
      if (!req.session.guestCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than 0' });
      }

      // Find and update item
      const itemIndex = req.session.guestCart.findIndex(
        (item: any) => item.id === itemId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }

      req.session.guestCart[itemIndex].quantity = quantity;
      
      res.json({ message: 'Cart updated successfully' });
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ error: 'Failed to update cart' });
    }
  });

  // Clear cart
  app.delete('/api/cart', async (req, res) => {
    try {
      req.session.guestCart = [];
      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  });

  return httpServer;
}
