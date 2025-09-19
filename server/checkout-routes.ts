import type { Express } from "express";
import { orders, orderItems, addresses, promoCodes } from "@shared/schema";
import { storage } from "./storage";
import { z } from "zod";

// Validation schemas
const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1)
  }),
  paymentMethod: z.object({
    type: z.enum(['card', 'paypal', 'apple', 'google']),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    nameOnCard: z.string().optional()
  }),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  promoCode: z.string().optional(),
  isGuest: z.boolean(),
  guestInfo: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1)
  }).optional()
});

const promoCodeSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0)
});

// In-memory order storage (in production, this would be a database)
const orderStorage = new Map<string, any>();

export function registerCheckoutRoutes(app: Express) {
  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      
      // Generate order number
      const orderNumber = `AVX-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Extract data with proper fallbacks
      const pricing = orderData.pricing || orderData.summary || {};
      const customerInfo = orderData.customerInfo || {};
      const guestInfo = orderData.guestInfo || customerInfo;
      
      // Create comprehensive order object
      const order = {
        id: orderNumber,
        orderNumber,
        status: 'confirmed',
        paymentStatus: 'paid',
        items: orderData.items || [],
        shippingAddress: orderData.shippingAddress || customerInfo.shippingAddress,
        shippingMethod: orderData.shippingMethod,
        paymentMethod: orderData.paymentMethod,
        pricing: {
          subtotal: pricing.subtotal || 0,
          shippingCost: pricing.shippingCost || pricing.shipping || 0,
          tax: pricing.tax || 0,
          total: pricing.total || 0
        },
        // Legacy fields for backward compatibility
        subtotal: pricing.subtotal || 0,
        shippingCost: pricing.shippingCost || pricing.shipping || 0,
        tax: pricing.tax || 0,
        total: pricing.total || 0,
        createdAt: new Date().toISOString(),
        estimatedDelivery: getEstimatedDelivery(orderData.shippingMethod),
        guestInfo: guestInfo.email ? guestInfo : null,
        customer: guestInfo.email ? { email: guestInfo.email, name: guestInfo.name } : null,
        payment: orderData.payment || { method: orderData.paymentMethod, status: 'paid' },
        shipping: orderData.shipping || { method: orderData.shippingMethod, cost: pricing.shippingCost || 0 }
      };
      
      // Store order in memory and database
      orderStorage.set(orderNumber, order);
      
      // Also store in database for order tracking
      try {
        const { salesAdapter } = await import('./db/salesAdapter');
        const { uid, now } = await import('@/shared/utils');
        
        // Create order in sales schema
        const dbOrderData = {
          id: orderNumber,
          userId: '1', // For demo purposes - in production, get from auth
          status: 'created' as const,
          paymentStatus: 'paid' as const,
          fulfillmentStatus: 'unfulfilled' as const,
          totals: {
            dropshipSubtotalCents: Math.round((pricing.subtotal || 0) * 100),
            otherSubtotalCents: 0,
            subtotalCents: Math.round((pricing.subtotal || 0) * 100),
            discountCents: Math.round((pricing.discountAmount || 0) * 100),
            shippingCents: Math.round((pricing.shippingCost || 0) * 100),
            taxCents: Math.round((pricing.tax || 0) * 100),
            totalCents: Math.round((pricing.total || 0) * 100)
          },
          voucherCents: 0,
          shippingAddress: order.shippingAddress,
          billingAddress: order.shippingAddress, // Use same address for demo
          createdAt: now(),
          updatedAt: now()
        };
        
        await salesAdapter.createOrder(dbOrderData);
        
        // Create order items
        for (const item of order.items || []) {
          const itemData = {
            id: uid('ITM'),
            orderId: orderNumber,
            sku: item.id || item.productId || 'SKU-' + Math.random().toString(36).substr(2, 9),
            title: item.name || item.title || 'Product',
            qty: item.quantity || 1,
            priceCents: Math.round((item.price || 0) * 100),
            type: 'dropship' as const,
            lineTotalCents: Math.round((item.price || 0) * (item.quantity || 1) * 100),
            createdAt: now()
          };
          await salesAdapter.createOrderItem(itemData);
        }
        
        // Also create order in main orders table for customer dashboard
        const mainOrderData = {
          orderNumber: orderNumber,
          userId: 1, // For demo purposes - in production, get from auth
          status: 'confirmed' as const,
          paymentStatus: 'paid' as const,
          subtotal: (pricing.subtotal || 0).toString(),
          discountAmount: (pricing.discountAmount || 0).toString(),
          shippingAmount: (pricing.shippingCost || 0).toString(),
          taxAmount: (pricing.tax || 0).toString(),
          totalAmount: (pricing.total || 0).toString(),
          shippingAddressId: 1, // For demo - would need to create address first
          billingAddressId: 1, // For demo - would need to create address first
          shippingMethod: orderData.shippingMethod || 'standard',
          trackingNumber: null,
          notes: null
        };
        
        const mainOrder = await storage.createOrder(mainOrderData);
        
        // Create order items in main table
        for (const item of order.items || []) {
          await storage.createOrderItem({
            orderId: mainOrder.id,
            productId: parseInt(item.id || item.productId || '1'), // Convert to number for main table
            quantity: item.quantity || 1,
            unitPrice: (item.price || 0).toString(),
            totalPrice: ((item.price || 0) * (item.quantity || 1)).toString(),
            productName: item.name || item.title || 'Product',
            productImage: item.image || ''
          });
        }
        
        console.log(`📦 Order ${orderNumber} stored in both sales and main database tables`);
      } catch (dbError) {
        console.error('Failed to store order in database:', dbError);
        // Continue with memory storage even if DB storage fails
      }
      
      console.log(`📦 Order ${orderNumber} created and stored with ${order.items.length} items`);
      
      res.json({
        success: true,
        orderId: orderNumber,
        order
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(400).json({ 
        success: false, 
        message: "Failed to create order" 
      });
    }
  });

  // Apply promo code
  app.post("/api/checkout/promo-code", async (req, res) => {
    try {
      const { code, subtotal } = promoCodeSchema.parse(req.body);
      
      // Mock promo code validation
      const promoCodes: Record<string, { type: 'percentage' | 'fixed', value: number, minimumAmount?: number }> = {
        'SAVE20': { type: 'percentage', value: 20, minimumAmount: 50 },
        'FIRST10': { type: 'fixed', value: 10 },
        'WELCOME15': { type: 'percentage', value: 15, minimumAmount: 30 },
        'FREESHIP': { type: 'percentage', value: 0, minimumAmount: 0 } // Special case for free shipping
      };
      
      const promoCode = promoCodes[code.toUpperCase()];
      
      if (!promoCode) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid promo code" 
        });
      }
      
      if (promoCode.minimumAmount && subtotal < promoCode.minimumAmount) {
        return res.status(400).json({ 
          success: false, 
          message: `Minimum order amount of $${promoCode.minimumAmount} required` 
        });
      }
      
      let discountAmount = 0;
      if (promoCode.type === 'percentage') {
        discountAmount = subtotal * (promoCode.value / 100);
      } else {
        discountAmount = promoCode.value;
      }
      
      res.json({
        success: true,
        discount: {
          code: code.toUpperCase(),
          type: promoCode.type,
          value: promoCode.value,
          amount: discountAmount
        }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid request data" 
      });
    }
  });

  // Calculate shipping
  app.post("/api/checkout/shipping", async (req, res) => {
    try {
      const { method, subtotal } = req.body;
      
      const shippingRates = {
        standard: { price: 9.99, time: "5-7 business days" },
        express: { price: 19.99, time: "2-3 business days" },
        overnight: { price: 29.99, time: "1 business day" }
      };
      
      const rate = shippingRates[method as keyof typeof shippingRates];
      
      if (!rate) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid shipping method" 
        });
      }
      
      // Free shipping for orders over $50 with standard shipping
      const shippingCost = (subtotal > 50 && method === 'standard') ? 0 : rate.price;
      
      res.json({
        success: true,
        shipping: {
          method,
          cost: shippingCost,
          time: rate.time
        }
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid request data" 
      });
    }
  });

  // Process checkout
  app.post("/api/checkout/process", async (req, res) => {
    try {
      const checkoutData = checkoutSchema.parse(req.body);
      
      // Generate order number
      const orderNumber = `AVX-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Calculate totals
      const subtotal = checkoutData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      
      // Calculate shipping
      const shippingRates = {
        standard: subtotal > 50 ? 0 : 9.99,
        express: 19.99,
        overnight: 29.99
      };
      const shippingCost = shippingRates[checkoutData.shippingMethod];
      
      // Calculate promo discount
      let discountAmount = 0;
      if (checkoutData.promoCode) {
        const promoCodes: Record<string, { type: 'percentage' | 'fixed', value: number }> = {
          'SAVE20': { type: 'percentage', value: 20 },
          'FIRST10': { type: 'fixed', value: 10 },
          'WELCOME15': { type: 'percentage', value: 15 },
          'FREESHIP': { type: 'percentage', value: 0 }
        };
        
        const promoCode = promoCodes[checkoutData.promoCode.toUpperCase()];
        if (promoCode) {
          if (promoCode.type === 'percentage') {
            discountAmount = subtotal * (promoCode.value / 100);
          } else {
            discountAmount = promoCode.value;
          }
        }
      }
      
      const total = subtotal + tax + shippingCost - discountAmount;
      
      // Mock order creation (in a real app, this would save to database)
      const order = {
        id: orderNumber,
        orderNumber,
        status: 'confirmed',
        paymentStatus: 'paid',
        items: checkoutData.items,
        shippingAddress: checkoutData.shippingAddress,
        shippingMethod: checkoutData.shippingMethod,
        paymentMethod: checkoutData.paymentMethod,
        subtotal,
        shippingCost,
        tax,
        discountAmount,
        total,
        createdAt: new Date().toISOString(),
        estimatedDelivery: getEstimatedDelivery(checkoutData.shippingMethod)
      };
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(400).json({ 
        success: false, 
        message: "Failed to process checkout" 
      });
    }
  });

  // Get order details
  app.get("/api/orders/:orderNumber", async (req, res) => {
    try {
      const { orderNumber } = req.params;
      
      // Retrieve order from storage
      const storedOrder = orderStorage.get(orderNumber);
      
      if (!storedOrder) {
        // Fallback to mock data for demo orders like "test123"
        if (orderNumber === 'test123') {
          const mockOrder = {
            id: orderNumber,
            orderNumber,
            status: 'confirmed',
            paymentStatus: 'paid',
            createdAt: new Date().toISOString(),
            items: [
              {
                id: "1",
                productId: "prod_15",
                name: "AirPods Pro (2nd Generation)",
                price: 249.99,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop",
                brand: "Apple"
              }
            ],
            shippingAddress: {
              fullName: "John Doe",
              address: "123 Main Street",
              city: "Anytown",
              state: "CA",
              zipCode: "12345",
              phone: "(555) 123-4567"
            },
            shippingMethod: "standard",
            paymentMethod: "card",
            pricing: {
              subtotal: 249.99,
              shippingCost: 0,
              tax: 20.00,
              total: 269.99
            },
            // Legacy fields
            subtotal: 249.99,
            shippingCost: 0,
            tax: 20.00,
            total: 269.99,
            estimatedDelivery: getEstimatedDelivery("standard"),
            guestInfo: { email: "test@example.com" }
          };
          return res.json({ success: true, order: mockOrder });
        }
        
        return res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }
      
      console.log(`📋 Retrieved order ${orderNumber} with ${storedOrder.items.length} items`);
      
      res.json({ success: true, order: storedOrder });
    } catch (error) {
      console.error('Order retrieval error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve order" 
      });
    }
  });
}

function getEstimatedDelivery(shippingMethod: string): string {
  const today = new Date();
  let deliveryDays = 5; // Default to standard shipping
  
  switch (shippingMethod) {
    case 'express':
      deliveryDays = 2;
      break;
    case 'overnight':
      deliveryDays = 1;
      break;
    case 'standard':
    default:
      deliveryDays = 5;
      break;
  }
  
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryDays);
  
  const endDate = new Date(deliveryDate);
  endDate.setDate(deliveryDate.getDate() + 2);
  
  return `${deliveryDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  })}-${endDate.getDate()}, ${deliveryDate.getFullYear()}`;
}