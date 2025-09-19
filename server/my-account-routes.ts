import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";

export function registerMyAccountRoutes(app: Express) {
  
  // Get user's orders from main orders table
  app.get("/api/my-account/orders", async (req, res) => {
    try {
      // For now, use a demo user ID - will be replaced with actual auth later
      const userId = 1;
      const orders = await storage.getOrders(userId);
      
      // Transform data for frontend
      const formattedOrders = orders.map(order => {
        return {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          total: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(parseFloat(order.totalAmount)),
          subtotal: parseFloat(order.subtotal),
          shippingAmount: parseFloat(order.shippingAmount),
          taxAmount: parseFloat(order.taxAmount),
          discountAmount: parseFloat(order.discountAmount),
          shippingMethod: order.shippingMethod,
          trackingNumber: order.trackingNumber,
          notes: order.notes
        };
      });
      
      res.json(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  
  // Get user's orders with tracking information
  app.get("/api/my-account/order-tracking", async (req, res) => {
    try {
      // For now, use a demo user ID - will be replaced with actual auth later
      const userId = 1;
      const ordersWithTracking = await storage.getUserOrdersWithTracking(userId);
      
      // Transform data for frontend
      const formattedOrders = ordersWithTracking.map(order => {
        // Format total from cents to currency
        const totalCents = order.totals?.totalCents || 0;
        const formattedTotal = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(totalCents / 100);
        
        return {
          id: order.orderId,
          orderNumber: order.orderId,
          status: order.orderStatus,
          createdAt: order.orderCreatedAt,
          total: formattedTotal,
          shippingAddress: order.shippingAddress,
          tracking: order.tracking ? {
            carrier: order.carrier,
            trackingNumber: order.tracking,
            shippedAt: order.shippedAt,
            deliveredAt: order.deliveredAt,
            status: order.deliveredAt ? 'delivered' : 'in_transit'
          } : null
        };
      });
      
      res.json(formattedOrders);
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      res.status(500).json({ error: "Failed to fetch order tracking" });
    }
  });

  // Get shipment details for a specific order
  app.get("/api/my-account/orders/:orderId/shipments", async (req, res) => {
    try {
      const { orderId } = req.params;
      const shipments = await storage.getOrderShipments(orderId);
      
      res.json(shipments);
    } catch (error) {
      console.error('Error fetching order shipments:', error);
      res.status(500).json({ error: "Failed to fetch order shipments" });
    }
  });

  // ===== RETURNS & EXCHANGES ROUTES =====
  
  // Get user's returns
  app.get("/api/my-account/returns", async (req, res) => {
    try {
      // For now, use a demo user ID - will be replaced with actual auth later
      const userId = 1;
      const returns = await storage.getUserReturns(userId);
      
      // Transform data for frontend
      const formattedReturns = returns.map(ret => ({
        id: ret.id,
        orderId: ret.orderId,
        reason: ret.reason,
        status: ret.status,
        requestedAt: ret.createdAt,
        processedAt: ret.processedAt,
        items: ret.lines || []
      }));
      
      res.json(formattedReturns);
    } catch (error) {
      console.error('Error fetching returns:', error);
      res.status(500).json({ error: "Failed to fetch returns" });
    }
  });

  // Create a new return request
  app.post("/api/my-account/returns", async (req, res) => {
    try {
      const returnRequestSchema = z.object({
        orderId: z.string(),
        reason: z.string(),
        items: z.array(z.object({
          productId: z.string(),
          quantity: z.number(),
          reason: z.string().optional()
        }))
      });

      const returnData = returnRequestSchema.parse(req.body);
      // For now, use a demo user ID - will be replaced with actual auth later
      const userId = 1;

      const newReturn = await storage.createReturn({
        id: `ret_${Date.now()}`, // Generate unique ID
        orderId: returnData.orderId,
        userId: userId.toString(),
        reason: returnData.reason,
        lines: returnData.items,
        status: 'requested'
      });

      res.status(201).json({
        id: newReturn.id,
        orderId: newReturn.orderId,
        status: newReturn.status,
        requestedAt: newReturn.createdAt,
        message: "Return request submitted successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid return data", details: error.errors });
      }
      console.error('Error creating return:', error);
      res.status(500).json({ error: "Failed to create return request" });
    }
  });

  // Update return status (admin only)
  app.put("/api/my-account/returns/:returnId/status", async (req, res) => {
    try {
      const { returnId } = req.params;
      const { status } = req.body;

      const updatedReturn = await storage.updateReturnStatus(returnId, status);
      
      if (!updatedReturn) {
        return res.status(404).json({ error: "Return not found" });
      }

      res.json({
        id: updatedReturn.id,
        status: updatedReturn.status,
        processedAt: updatedReturn.processedAt
      });
    } catch (error) {
      console.error('Error updating return status:', error);
      res.status(500).json({ error: "Failed to update return status" });
    }
  });

  // ===== DOWNLOADS ROUTES =====
  
  // Get user's downloads
  app.get("/api/my-account/downloads", async (req, res) => {
    try {
      // For now, use a demo user ID - will be replaced with actual auth later
      const userId = 1;
      const downloads = await storage.getUserDownloads(userId);
      
      res.json(downloads);
    } catch (error) {
      console.error('Error fetching downloads:', error);
      res.status(500).json({ error: "Failed to fetch downloads" });
    }
  });

  // ===== PAYMENT METHODS ROUTES =====
  
  // Get user's payment methods
  app.get("/api/my-account/payment-methods", async (req, res) => {
    try {
      // For now, use a demo user ID - will be replaced with actual auth later
      const userId = 1;
      const paymentMethods = await storage.getUserPaymentMethods(userId);
      
      res.json(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  });

}