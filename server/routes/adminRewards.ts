import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { rewardsLedger, redemptions } from "@shared/schema";

const router = Router();

// Admin rewards summary
router.get('/rewards/summary', async (_req, res) => {
  try {
    // Get all rewards ledger entries
    const allRewards = await db.select().from(rewardsLedger);
    
    const total = allRewards.reduce((sum, r) => sum + (r.amountCents || 0), 0);
    const confirmed = allRewards
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);
    const redeemed = allRewards
      .filter(r => r.status === 'redeemed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    res.json({ 
      total, 
      confirmed, 
      redeemed, 
      outstanding: confirmed - redeemed 
    });
  } catch (error) {
    console.error('Error fetching admin rewards summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all redemption requests for admin
router.get('/redemptions', async (_req, res) => {
  try {
    const allRedemptions = await db
      .select()
      .from(redemptions)
      .orderBy(desc(redemptions.createdAt));

    res.json({ items: allRedemptions });
  } catch (error) {
    console.error('Error fetching admin redemptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve redemption request
router.post('/redemptions/:id/approve', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const [updated] = await db
      .update(redemptions)
      .set({ status: 'approved' })
      .where(eq(redemptions.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Redemption not found' });
    }

    res.json({ ok: true, redemption: updated });
  } catch (error) {
    console.error('Error approving redemption:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject redemption request
router.post('/redemptions/:id/reject', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const [updated] = await db
      .update(redemptions)
      .set({ status: 'rejected' })
      .where(eq(redemptions.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Redemption not found' });
    }

    res.json({ ok: true, redemption: updated });
  } catch (error) {
    console.error('Error rejecting redemption:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark redemption as paid
router.post('/redemptions/:id/mark-paid', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { providerRef } = req.body;
    
    const [updated] = await db
      .update(redemptions)
      .set({ 
        status: 'paid', 
        providerRef: providerRef || `manual-${Date.now()}`,
        processedAt: new Date()
      })
      .where(eq(redemptions.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Redemption not found' });
    }

    // Mark corresponding rewards as redeemed
    await db
      .insert(rewardsLedger)
      .values({
        userId: updated.userId,
        sourceType: 'redemption',
        productType: '',
        sourceId: `redemption-${updated.id}`,
        amountCents: -updated.amountCents,
        points: 0,
        status: 'redeemed'
      });

    res.json({ ok: true, redemption: updated });
  } catch (error) {
    console.error('Error marking redemption as paid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export rewards data as CSV
router.get('/rewards/export.csv', async (_req, res) => {
  try {
    const allRewards = await db.select().from(rewardsLedger);
    
    // Convert to CSV format
    const headers = ['id', 'userId', 'sourceType', 'productType', 'sourceId', 'amountCents', 'points', 'status', 'availableAt', 'createdAt'];
    const csvContent = [
      headers.join(','),
      ...allRewards.map(reward => 
        headers.map(header => {
          const value = reward[header as keyof typeof reward];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="rewards-ledger.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting rewards data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;