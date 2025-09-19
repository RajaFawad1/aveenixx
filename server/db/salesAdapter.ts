// Sales module database adapter for Aveenix
// Integrates with existing Drizzle ORM setup
import { db } from '../db';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { 
  orders, 
  orderItems, 
  payments, 
  shipments, 
  returns, 
  orderNotes,
  type Order,
  type OrderItem,
  type Payment,
  type Shipment,
  type Return,
  type OrderNote
} from '../../shared/salesSchema';

export class SalesAdapter {
  // Orders
  async createOrder(orderData: any) {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async createOrderItem(itemData: any) {
    const [item] = await db.insert(orderItems).values(itemData).returning();
    return item;
  }

  async getAllOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getUserOrders(userId: string) {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(orderId: string) {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order || null;
  }

  async getOrderItems(orderId: string) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async updateOrder(orderId: string, updates: any) {
    const [updated] = await db.update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return updated;
  }

  // Payments
  async createPayment(paymentData: any) {
    const [payment] = await db.insert(payments).values(paymentData).returning();
    return payment;
  }

  async getOrderPayments(orderId: string) {
    return await db.select().from(payments).where(eq(payments.orderId, orderId));
  }

  // Shipments
  async createShipment(shipmentData: any) {
    const [shipment] = await db.insert(shipments).values(shipmentData).returning();
    return shipment;
  }

  async getOrderShipments(orderId: string) {
    return await db.select().from(shipments).where(eq(shipments.orderId, orderId));
  }

  // Returns
  async createReturn(returnData: any) {
    const [returnRecord] = await db.insert(returns).values(returnData).returning();
    return returnRecord;
  }

  async getAllReturns() {
    return await db.select().from(returns).orderBy(desc(returns.createdAt));
  }

  async getReturn(returnId: string) {
    const [returnRecord] = await db.select().from(returns).where(eq(returns.id, returnId));
    return returnRecord || null;
  }

  async updateReturn(returnId: string, updates: any) {
    const [updated] = await db.update(returns)
      .set(updates)
      .where(eq(returns.id, returnId))
      .returning();
    return updated;
  }

  // Notes
  async createOrderNote(noteData: any) {
    const [note] = await db.insert(orderNotes).values(noteData).returning();
    return note;
  }

  async getOrderNotes(orderId: string) {
    return await db.select().from(orderNotes).where(eq(orderNotes.orderId, orderId));
  }

  // Sales Analytics
  async getSalesMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const metricsQuery = await db
      .select({
        totalRevenueCents: sql<number>`COALESCE(SUM((totals->>'totalCents')::integer), 0)`,
        totalOrders: sql<number>`COUNT(*)`,
        activeCustomers: sql<number>`COUNT(DISTINCT user_id)`
      })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo));

    const metrics = metricsQuery[0];
    const avgOrderCents = metrics.totalOrders > 0 ? Math.round(metrics.totalRevenueCents / metrics.totalOrders) : 0;

    return {
      totalRevenueCents: metrics.totalRevenueCents,
      totalOrders: metrics.totalOrders,
      avgOrderCents,
      activeCustomers: metrics.activeCustomers,
      conversionRate: 0 // Placeholder until visits are tracked
    };
  }

  async getDailyRevenue() {
    const dailyRevenue = await db
      .select({
        date: sql<string>`DATE(created_at)`,
        cents: sql<number>`COALESCE(SUM((totals->>'totalCents')::integer), 0)`
      })
      .from(orders)
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at)`);

    return { rows: dailyRevenue };
  }
}

export const salesAdapter = new SalesAdapter();