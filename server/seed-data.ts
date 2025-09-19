import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { seedNotifications } from "./seed-notifications";
import { uid, now } from "./lib/salesUtils";

async function seedSampleOrders() {
  try {
    console.log("📦 Seeding sample orders...");
    
    const { salesAdapter } = await import('./db/salesAdapter');
    
    // Create sample orders for user ID 1 (customer)
    const sampleOrders = [
      {
        id: 'AVX-2024-ABC123DEF',
        userId: '1',
        status: 'created' as const,
        paymentStatus: 'paid' as const,
        fulfillmentStatus: 'unfulfilled' as const,
        totals: {
          dropshipSubtotalCents: 29999, // $299.99
          otherSubtotalCents: 0,
          subtotalCents: 29999,
          discountCents: 0,
          shippingCents: 999, // $9.99
          taxCents: 2400, // $24.00
          totalCents: 33398 // $333.98
        },
        voucherCents: 0,
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          phone: '(555) 123-4567'
        },
        billingAddress: {
          fullName: 'John Doe',
          address: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          phone: '(555) 123-4567'
        },
        createdAt: now(),
        updatedAt: now()
      },
      {
        id: 'AVX-2024-XYZ789GHI',
        userId: '1',
        status: 'created' as const,
        paymentStatus: 'paid' as const,
        fulfillmentStatus: 'unfulfilled' as const,
        totals: {
          dropshipSubtotalCents: 14999, // $149.99
          otherSubtotalCents: 0,
          subtotalCents: 14999,
          discountCents: 1500, // $15.00 discount
          shippingCents: 0, // Free shipping
          taxCents: 1200, // $12.00
          totalCents: 14699 // $146.99
        },
        voucherCents: 0,
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          phone: '(555) 123-4567'
        },
        billingAddress: {
          fullName: 'John Doe',
          address: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          phone: '(555) 123-4567'
        },
        createdAt: now(),
        updatedAt: now()
      }
    ];
    
    // Create orders
    for (const orderData of sampleOrders) {
      await salesAdapter.createOrder(orderData);
      
      // Create sample order items
      const orderItems = [
        {
          id: uid('ITM'),
          orderId: orderData.id,
          sku: 'SKU-001',
          title: 'Wireless Bluetooth Headphones',
          qty: 1,
          priceCents: orderData.totals.subtotalCents,
          type: 'dropship' as const,
          lineTotalCents: orderData.totals.subtotalCents,
          createdAt: now()
        }
      ];
      
      for (const item of orderItems) {
        await salesAdapter.createOrderItem(item);
      }
    }
    
    console.log(`✅ Seeded ${sampleOrders.length} sample orders`);
  } catch (error) {
    console.error('Error seeding sample orders:', error);
  }
}

export async function seedInitialData() {
  try {
    console.log("Seeding initial data...");
    
    // Create initial categories
    const categories = [
      { name: "Electronics", slug: "electronics", icon: "📱", isHot: true, sortOrder: 1 },
      { name: "Computers", slug: "computers", icon: "💻", isHot: false, sortOrder: 2 },
      { name: "Smartphones", slug: "smartphones", icon: "📱", isHot: true, sortOrder: 3 },
      { name: "Footwear", slug: "footwear", icon: "👟", isHot: false, sortOrder: 4 },
      { name: "Photography", slug: "photography", icon: "📸", isHot: false, sortOrder: 5 },
      { name: "Clothing", slug: "clothing", icon: "👕", isHot: true, sortOrder: 6 },
      { name: "Wearables", slug: "wearables", icon: "⌚", isHot: true, sortOrder: 7 },
      { name: "Home Appliances", slug: "home-appliances", icon: "🏠", isHot: false, sortOrder: 8 },
      { name: "Books", slug: "books", icon: "📚", isHot: false, sortOrder: 9 },
      { name: "Health & Beauty", slug: "health-beauty", icon: "💄", isHot: false, sortOrder: 10 },
    ];

    for (const category of categories) {
      await storage.createCategory(category);
    }

    // Create initial products
    const products = [
      {
        id: "prod_1",
        name: "Sony WH-1000XM4 Wireless Headphones",
        description: "Industry-leading noise canceling with Dual Noise Sensor technology",
        price: "349.99",
        originalPrice: "399.99",
        category: "Electronics",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop",
        rating: "4.5",
        reviewCount: 1234,
        isNew: false,
        isBestseller: true,
        isOnSale: true,
        discountPercentage: 13
      },
      {
        id: "prod_2",
        name: "Apple MacBook Air M2",
        description: "Supercharged by M2 chip with 8-core CPU and 8-core GPU",
        price: "1199.99",
        originalPrice: "1299.99",
        category: "Computers",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
        rating: "4.8",
        reviewCount: 2156,
        isNew: true,
        isBestseller: false,
        isOnSale: true,
        discountPercentage: 8
      },
      {
        id: "prod_3",
        name: "Samsung Galaxy S23 Ultra",
        description: "The ultimate Android smartphone with S Pen and 200MP camera",
        price: "1199.99",
        originalPrice: "1399.99",
        category: "Smartphones",
        brand: "Samsung",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
        rating: "4.6",
        reviewCount: 987,
        isNew: true,
        isBestseller: true,
        isOnSale: true,
        discountPercentage: 14
      },
      {
        id: "prod_4",
        name: "Nike Air Max 270",
        description: "Lifestyle running shoes with Max Air unit for all-day comfort",
        price: "150.00",
        originalPrice: "180.00",
        category: "Footwear",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        rating: "4.3",
        reviewCount: 654,
        isNew: false,
        isBestseller: false,
        isOnSale: true,
        discountPercentage: 17
      },
      {
        id: "prod_5",
        name: "Dell XPS 13 Plus",
        description: "Premium ultrabook with 12th Gen Intel Core processors",
        price: "1299.99",
        originalPrice: "1499.99",
        category: "Computers",
        brand: "Dell",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
        rating: "4.4",
        reviewCount: 432,
        isNew: false,
        isBestseller: false,
        isOnSale: true,
        discountPercentage: 13
      },
      {
        id: "prod_6",
        name: "Adidas Ultraboost 22",
        description: "Energy-returning running shoes with Primeknit upper",
        price: "190.00",
        originalPrice: "200.00",
        category: "Footwear",
        brand: "Adidas",
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
        rating: "4.7",
        reviewCount: 823,
        isNew: true,
        isBestseller: true,
        isOnSale: false,
        discountPercentage: 0
      },
      {
        id: "prod_7",
        name: "Canon EOS R5",
        description: "Professional mirrorless camera with 45MP full-frame sensor",
        price: "3899.99",
        originalPrice: "4199.99",
        category: "Photography",
        brand: "Canon",
        imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
        rating: "4.9",
        reviewCount: 156,
        isNew: false,
        isBestseller: false,
        isOnSale: true,
        discountPercentage: 7
      },
      {
        id: "prod_8",
        name: "Levi's 501 Original Jeans",
        description: "The original straight fit jeans with button fly",
        price: "89.95",
        originalPrice: "99.95",
        category: "Clothing",
        brand: "Levi's",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
        rating: "4.2",
        reviewCount: 2341,
        isNew: false,
        isBestseller: true,
        isOnSale: false,
        discountPercentage: 0
      },
      {
        id: "prod_9",
        name: "Apple Watch Series 9",
        description: "The most advanced Apple Watch with S9 chip and double tap gesture",
        price: "399.99",
        originalPrice: "449.99",
        category: "Wearables",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
        rating: "4.6",
        reviewCount: 1567,
        isNew: true,
        isBestseller: true,
        isOnSale: true,
        discountPercentage: 11
      },
      {
        id: "prod_10",
        name: "Dyson V15 Detect",
        description: "Cordless vacuum with laser dust detection and powerful suction",
        price: "749.99",
        originalPrice: "899.99",
        category: "Home Appliances",
        brand: "Dyson",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        rating: "4.5",
        reviewCount: 789,
        isNew: false,
        isBestseller: false,
        isOnSale: true,
        discountPercentage: 17
      },
      {
        id: "prod_11",
        name: "iPhone 15 Pro",
        description: "The most advanced iPhone with titanium design and A17 Pro chip",
        price: "999.99",
        originalPrice: "1099.99",
        category: "Smartphones",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
        rating: "4.8",
        reviewCount: 3456,
        isNew: true,
        isBestseller: true,
        isOnSale: true,
        discountPercentage: 9
      },
      {
        id: "prod_12",
        name: "PlayStation 5",
        description: "Next-generation gaming console with 4K graphics and lightning-fast SSD",
        price: "499.99",
        originalPrice: "599.99",
        category: "Electronics",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
        rating: "4.7",
        reviewCount: 2789,
        isNew: false,
        isBestseller: true,
        isOnSale: true,
        discountPercentage: 17
      },
      {
        id: "prod_13",
        name: "Microsoft Surface Pro 9",
        description: "2-in-1 laptop and tablet with touchscreen and Surface Pen support",
        price: "1099.99",
        originalPrice: "1299.99",
        category: "Computers",
        brand: "Microsoft",
        imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop",
        rating: "4.4",
        reviewCount: 1234,
        isNew: true,
        isBestseller: false,
        isOnSale: true,
        discountPercentage: 15
      },
      {
        id: "prod_14",
        name: "Bose QuietComfort 45",
        description: "Premium noise-cancelling headphones with superior sound quality",
        price: "329.99",
        originalPrice: "379.99",
        category: "Electronics",
        brand: "Bose",
        imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop",
        rating: "4.6",
        reviewCount: 1876,
        isNew: false,
        isBestseller: true,
        isOnSale: true,
        discountPercentage: 13
      },
      {
        id: "prod_15",
        name: "AirPods Pro (2nd Generation)",
        description: "Active noise cancellation with transparency mode and spatial audio",
        price: "249.99",
        originalPrice: "279.99",
        category: "Electronics",
        brand: "Apple",
        imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop",
        rating: "4.7",
        reviewCount: 4567,
        isNew: true,
        isBestseller: true,
        isOnSale: true,
        discountPercentage: 11
      }
    ];

    for (const product of products) {
      await storage.createProduct(product);
    }

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    await storage.createUser({
      username: "admin",
      email: "admin@aveenix.com",
      password: adminPassword,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      phone: "+1234567890",
      isActive: true
    });

    // Create vendor user
    const vendorPassword = await bcrypt.hash("vendor123", 10);
    const vendorUser = await storage.createUser({
      username: "vendor",
      email: "vendor@aveenix.com",
      password: vendorPassword,
      role: "vendor",
      firstName: "Vendor",
      lastName: "User",
      phone: "+1234567891",
      isActive: true
    });

    // Create vendor profile
    await storage.createVendor({
      userId: vendorUser.id,
      businessName: "AVEENIX Electronics Store",
      businessType: "Electronics Retailer",
      businessDescription: "Premium electronics and tech accessories",
      contactName: "Vendor User",
      email: "vendor@aveenix.com",
      phone: "+1234567891",
      address: "123 Tech Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA",
      taxId: "123456789",
      website: "https://aveenix.com",
      status: "approved",
      commissionRate: "15.00",
      isActive: true
    });

    // Create customer user
    const customerPassword = await bcrypt.hash("customer123", 10);
    await storage.createUser({
      username: "customer",
      email: "customer@aveenix.com",
      password: customerPassword,
      role: "customer",
      firstName: "Customer",
      lastName: "User",
      phone: "+1234567892",
      isActive: true
    });

    // Seed notifications
    await seedNotifications();

    // Seed sample orders for testing
    await seedSampleOrders();

    console.log("Initial data seeded successfully!");
    console.log("Login credentials:");
    console.log("Admin: admin@aveenix.com / admin123");
    console.log("Vendor: vendor@aveenix.com / vendor123");
    console.log("Customer: customer@aveenix.com / customer123");
    
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}