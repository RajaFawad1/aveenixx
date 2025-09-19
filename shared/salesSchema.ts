import { pgTable, serial, varchar, text, integer, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const orderStatusEnum = pgEnum('order_status', ['created', 'processing', 'completed', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'captured', 'failed', 'refunded']);
export const fulfillmentStatusEnum = pgEnum('fulfillment_status', ['unfulfilled', 'shipped', 'delivered']);
export const returnStatusEnum = pgEnum('return_status', ['requested', 'approved', 'rejected', 'completed']);
export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'paypal', 'manual']);

// Orders table
export const orders = pgTable('sales_orders', {
  id: varchar('id', { length: 50 }).primaryKey(),
  userId: varchar('user_id', { length: 50 }).notNull(),
  status: orderStatusEnum('status').notNull().default('created'),
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
  fulfillmentStatus: fulfillmentStatusEnum('fulfillment_status').notNull().default('unfulfilled'),
  totals: jsonb('totals').notNull(), // Contains dropshipSubtotalCents, otherSubtotalCents, subtotalCents, discountCents, shippingCents, taxCents, totalCents
  voucherCents: integer('voucher_cents').default(0),
  shippingAddress: jsonb('shipping_address'),
  billingAddress: jsonb('billing_address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Order items table
export const orderItems = pgTable('sales_order_items', {
  id: varchar('id', { length: 50 }).primaryKey(),
  orderId: varchar('order_id', { length: 50 }).notNull().references(() => orders.id),
  sku: varchar('sku', { length: 100 }),
  title: varchar('title', { length: 255 }).notNull(),
  qty: integer('qty').notNull(),
  priceCents: integer('price_cents').notNull(),
  type: varchar('type', { length: 50 }).notNull().default('dropship'), // dropship, physical, digital, etc.
  lineTotalCents: integer('line_total_cents').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Payments table
export const payments = pgTable('sales_payments', {
  id: varchar('id', { length: 50 }).primaryKey(),
  orderId: varchar('order_id', { length: 50 }).notNull().references(() => orders.id),
  amountCents: integer('amount_cents').notNull(), // Can be negative for refunds
  method: paymentMethodEnum('method').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  externalId: varchar('external_id', { length: 255 }), // Stripe payment intent ID, PayPal transaction ID, etc.
  metadata: jsonb('metadata'), // Additional payment provider data
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Shipments table
export const shipments = pgTable('sales_shipments', {
  id: varchar('id', { length: 50 }).primaryKey(),
  orderId: varchar('order_id', { length: 50 }).notNull().references(() => orders.id),
  carrier: varchar('carrier', { length: 100 }).notNull(),
  tracking: varchar('tracking', { length: 255 }),
  shippedAt: timestamp('shipped_at').notNull().defaultNow(),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Returns/RMA table
export const returns = pgTable('sales_returns', {
  id: varchar('id', { length: 50 }).primaryKey(),
  orderId: varchar('order_id', { length: 50 }).notNull().references(() => orders.id),
  userId: varchar('user_id', { length: 50 }).notNull(),
  reason: text('reason'),
  lines: jsonb('lines'), // Items being returned
  status: returnStatusEnum('status').notNull().default('requested'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Order notes table (internal)
export const orderNotes = pgTable('sales_order_notes', {
  id: varchar('id', { length: 50 }).primaryKey(),
  orderId: varchar('order_id', { length: 50 }).notNull().references(() => orders.id),
  text: text('text').notNull(),
  createdBy: varchar('created_by', { length: 50 }), // Admin user ID
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Zod schemas for validation
export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const selectOrderItemSchema = createSelectSchema(orderItems);
export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
export const insertShipmentSchema = createInsertSchema(shipments);
export const selectShipmentSchema = createSelectSchema(shipments);
export const insertReturnSchema = createInsertSchema(returns);
export const selectReturnSchema = createSelectSchema(returns);
export const insertOrderNoteSchema = createInsertSchema(orderNotes);
export const selectOrderNoteSchema = createSelectSchema(orderNotes);

// TypeScript types
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;
export type Return = typeof returns.$inferSelect;
export type InsertReturn = typeof returns.$inferInsert;
export type OrderNote = typeof orderNotes.$inferSelect;
export type InsertOrderNote = typeof orderNotes.$inferInsert;