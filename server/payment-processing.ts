import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: number;
  error?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: string;
}

export interface CreateOrderData {
  userId: number;
  items: OrderItem[];
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  couponCode?: string;
  discount?: string;
}

export class PaymentProcessor {
  async processPayment(paymentData: any): Promise<PaymentResult> {
    try {
      // Simulate payment processing
      if (paymentData.paymentMethod === 'card') {
        // Mock card payment processing
        const isSuccessful = Math.random() > 0.1; // 90% success rate
        
        if (isSuccessful) {
          return {
            success: true,
            paymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          };
        } else {
          return {
            success: false,
            error: 'Payment declined. Please try a different card.'
          };
        }
      }
      
      if (paymentData.paymentMethod === 'paypal') {
        // Mock PayPal payment processing
        return {
          success: true,
          paymentId: `pp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        };
      }
      
      return {
        success: false,
        error: 'Unsupported payment method'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<{ success: boolean; orderId?: number; error?: string }> {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Create order
      const order = await storage.createOrder({
        orderNumber,
        userId: orderData.userId,
        status: 'pending',
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        tax: orderData.tax,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'pending',
        shippingAddress: JSON.stringify(orderData.shippingAddress),
        billingAddress: JSON.stringify(orderData.billingAddress),
        couponCode: orderData.couponCode,
        discount: orderData.discount || "0.00"
      });

      // Create order items
      for (const item of orderData.items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }

      // Clear user's cart
      await storage.clearCart(orderData.userId);

      return { success: true, orderId: order.id };
    } catch (error) {
      console.error('Order creation failed:', error);
      return { success: false, error: 'Failed to create order' };
    }
  }

  async calculateShipping(address: any): Promise<{ cost: string; estimatedDays: number }> {
    // Mock shipping calculation
    const baseRate = 9.99;
    const isInternational = address.country !== 'USA';
    const cost = isInternational ? baseRate * 2 : baseRate;
    const estimatedDays = isInternational ? 10 : 5;
    
    return {
      cost: cost.toFixed(2),
      estimatedDays
    };
  }

  async calculateTax(subtotal: string, address: any): Promise<string> {
    // Mock tax calculation (8.5% for US orders)
    const taxRate = address.country === 'USA' ? 0.085 : 0;
    const tax = parseFloat(subtotal) * taxRate;
    return tax.toFixed(2);
  }

  async applyCoupon(code: string, subtotal: string): Promise<{ valid: boolean; discount?: string; error?: string }> {
    // Mock coupon validation
    const validCoupons = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'NEWUSER': 0.15,
      'WELCOME': 0.05
    };

    const coupon = validCoupons[code.toUpperCase() as keyof typeof validCoupons];
    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code' };
    }

    const discount = (parseFloat(subtotal) * coupon).toFixed(2);
    return { valid: true, discount };
  }
}

export const paymentProcessor = new PaymentProcessor();