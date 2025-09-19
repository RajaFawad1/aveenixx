import { Router } from 'express';
import { z } from 'zod';
import { salesAdapter } from '../db/salesAdapter';
import { uid, now, calculateCartTotals } from '../lib/salesUtils';
import { insertOrderSchema, insertOrderItemSchema, insertPaymentSchema, insertShipmentSchema, insertReturnSchema, insertOrderNoteSchema } from '../../shared/salesSchema';

const router = Router();

// Validation schemas
const createOrderSchema = z.object({
  userId: z.string().default('demo-user'),
  lines: z.array(z.object({
    sku: z.string().optional(),
    title: z.string(),
    qty: z.number().positive(),
    priceCents: z.number().min(0),
    type: z.string().optional()
  })).default([]),
  voucherCents: z.number().min(0).default(0),
  shippingAddress: z.object({}).optional(),
  billingAddress: z.object({}).optional()
});

const shipOrderSchema = z.object({
  carrier: z.string().default('Manual'),
  tracking: z.string().default('')
});

const refundOrderSchema = z.object({
  amountCents: z.number().positive()
});

const addNoteSchema = z.object({
  text: z.string().min(1)
});

const createReturnSchema = z.object({
  orderId: z.string(),
  userId: z.string().default('demo-user'),
  reason: z.string().default('No reason provided'),
  lines: z.array(z.any()).default([])
});

// Orders endpoints
router.post('/orders', async (req, res) => {
  try {
    const { userId, lines, voucherCents, shippingAddress, billingAddress } = createOrderSchema.parse(req.body);
    const totals = calculateCartTotals(lines, voucherCents);
    const orderId = uid('ORD');
    
    const orderData = {
      id: orderId,
      userId,
      status: 'created' as const,
      paymentStatus: 'pending' as const,
      fulfillmentStatus: 'unfulfilled' as const,
      totals,
      voucherCents,
      shippingAddress,
      billingAddress,
      createdAt: now(),
      updatedAt: now()
    };

    const order = await salesAdapter.createOrder(orderData);

    // Create order items
    for (const line of lines) {
      const itemData = {
        id: uid('ITM'),
        orderId,
        sku: line.sku,
        title: line.title,
        qty: line.qty,
        priceCents: line.priceCents,
        type: line.type || 'dropship',
        lineTotalCents: line.qty * line.priceCents,
        createdAt: now()
      };
      await salesAdapter.createOrderItem(itemData);
    }

    res.json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

router.get('/orders', async (_req, res) => {
  try {
    const orders = await salesAdapter.getAllOrders();
    res.json({ items: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/orders/me', async (req, res) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || 'demo-user';
    const orders = await salesAdapter.getUserOrders(userId);
    res.json({ items: orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await salesAdapter.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items, payments, shipments, notes] = await Promise.all([
      salesAdapter.getOrderItems(orderId),
      salesAdapter.getOrderPayments(orderId),
      salesAdapter.getOrderShipments(orderId),
      salesAdapter.getOrderNotes(orderId)
    ]);

    res.json({ order, items, payments, shipments, notes });
  } catch (error) {
    console.error('Get order detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/orders/:id/capture', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await salesAdapter.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create payment record
    const paymentData = {
      id: uid('PAY'),
      orderId,
      amountCents: (order.totals as any).totalCents,
      method: 'stripe' as const,
      status: 'captured',
      createdAt: now()
    };
    await salesAdapter.createPayment(paymentData);

    // Update order status
    await salesAdapter.updateOrder(orderId, {
      status: 'processing',
      paymentStatus: 'captured'
    });

    res.json({ ok: true });
  } catch (error) {
    console.error('Capture payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/orders/:id/ship', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { carrier, tracking } = shipOrderSchema.parse(req.body);

    const shipmentData = {
      id: uid('SHP'),
      orderId,
      carrier,
      tracking,
      shippedAt: now(),
      createdAt: now()
    };
    await salesAdapter.createShipment(shipmentData);

    await salesAdapter.updateOrder(orderId, {
      fulfillmentStatus: 'shipped'
    });

    res.json({ ok: true });
  } catch (error) {
    console.error('Ship order error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

router.post('/orders/:id/complete', async (req, res) => {
  try {
    const orderId = req.params.id;
    await salesAdapter.updateOrder(orderId, { status: 'completed' });
    res.json({ ok: true });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/orders/:id/refund', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { amountCents } = refundOrderSchema.parse(req.body);

    const paymentData = {
      id: uid('RFND'),
      orderId,
      amountCents: -Math.abs(amountCents),
      method: 'stripe' as const,
      status: 'refunded',
      createdAt: now()
    };
    await salesAdapter.createPayment(paymentData);

    res.json({ ok: true });
  } catch (error) {
    console.error('Refund order error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

router.post('/orders/:id/notes', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { text } = addNoteSchema.parse(req.body);

    const noteData = {
      id: uid('NOTE'),
      orderId,
      text,
      createdBy: 'admin', // TODO: Get from authenticated user
      createdAt: now()
    };
    await salesAdapter.createOrderNote(noteData);

    res.json({ ok: true });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

// Returns endpoints
router.post('/returns', async (req, res) => {
  try {
    const { orderId, userId, reason, lines } = createReturnSchema.parse(req.body);
    
    const returnData = {
      id: uid('RMA'),
      orderId,
      userId,
      reason,
      lines,
      status: 'requested' as const,
      createdAt: now()
    };
    const returnRecord = await salesAdapter.createReturn(returnData);

    res.json({ id: returnRecord.id });
  } catch (error) {
    console.error('Create return error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
  }
});

router.get('/returns', async (_req, res) => {
  try {
    const returns = await salesAdapter.getAllReturns();
    res.json({ items: returns });
  } catch (error) {
    console.error('Get returns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/returns/:id/approve', async (req, res) => {
  try {
    const returnId = req.params.id;
    await salesAdapter.updateReturn(returnId, { 
      status: 'approved',
      processedAt: now()
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Approve return error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/returns/:id/reject', async (req, res) => {
  try {
    const returnId = req.params.id;
    await salesAdapter.updateReturn(returnId, { 
      status: 'rejected',
      processedAt: now()
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Reject return error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/returns/:id/complete', async (req, res) => {
  try {
    const returnId = req.params.id;
    await salesAdapter.updateReturn(returnId, { 
      status: 'completed',
      processedAt: now()
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Complete return error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sales analytics endpoints
router.get('/sales/metrics', async (_req, res) => {
  try {
    const metrics = await salesAdapter.getSalesMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Get sales metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/sales/report/daily', async (_req, res) => {
  try {
    const dailyReport = await salesAdapter.getDailyRevenue();
    res.json(dailyReport);
  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;