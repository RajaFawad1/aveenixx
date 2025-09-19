import { Router } from "express";
import { z } from "zod";
import { eq, desc, sum, count, and } from "drizzle-orm";
import { db } from "../db";
import { 
  rewardsLedger, 
  vouchers, 
  redemptions,
  users,
  type InsertRewardsLedger,
  type InsertVoucher,
  type InsertRedemption
} from "@shared/schema";

const router = Router();

// Enhanced rewards calculation functions
type ProductType = "affiliate" | "dropship" | "physical" | "consumable" | "service" | "digital" | "custom" | "multivendor";

interface RewardInput {
  productType: ProductType;
  marginCents?: number;
  salePriceCents?: number;
  costCents?: number;
  paymentFeeCents?: number;
  shippingSubsidyCents?: number;
  commissionCents?: number;
  promoMultiplier?: number;
}

interface RewardOutput {
  netMarginCents: number;
  customerRewardCents: number;
  applied: {
    tierPercent: number;
    minApplied: boolean;
    maxApplied: boolean;
    promoMultiplier: number;
    operatingBufferCents: number;
  };
}

const OPERATING_BUFFER_CENTS = parseInt(process.env.REWARDS_OPERATING_BUFFER_CENTS || "100", 10);
const MIN_REWARD_PER_ORDER_CENTS = parseInt(process.env.REWARDS_MIN_PER_ORDER_CENTS || "25", 10);
const MAX_REWARD_PER_ORDER_CENTS = parseInt(process.env.REWARDS_MAX_PER_ORDER_CENTS || "1000", 10);

const DEFAULT_TIERS = [
  { min: 25,   max: 500,   percent: 15 },
  { min: 501,  max: 1500,  percent: 20 },
  { min: 1501, max: 3000,  percent: 25 },
  { min: 3001, max: null,  percent: 15 },
];

function coolingOffDaysFor(pt: ProductType): number {
  const map: Record<ProductType, number> = {
    affiliate: parseInt(process.env.REWARDS_COOLDOWN_DAYS_AFFILIATE || "30", 10),
    dropship:  parseInt(process.env.REWARDS_COOLDOWN_DAYS_DROPSHIP  || "7", 10),
    physical:  parseInt(process.env.REWARDS_COOLDOWN_DAYS_PHYSICAL  || "7", 10),
    consumable:parseInt(process.env.REWARDS_COOLDOWN_DAYS_CONSUMABLE|| "7", 10),
    service:   parseInt(process.env.REWARDS_COOLDOWN_DAYS_SERVICE   || "7", 10),
    digital:   parseInt(process.env.REWARDS_COOLDOWN_DAYS_DIGITAL   || "0", 10),
    custom:    parseInt(process.env.REWARDS_COOLDOWN_DAYS_CUSTOM    || "7", 10),
    multivendor:parseInt(process.env.REWARDS_COOLDOWN_DAYS_MULTIVENDOR|| "7", 10),
  };
  return map[pt];
}

function calculateReward(input: RewardInput): RewardOutput {
  // Calculate net margin
  let netMargin = 0;
  if (typeof input.marginCents === "number") {
    netMargin = Math.max(0, Math.floor(input.marginCents));
  } else if (input.productType === "affiliate") {
    netMargin = Math.max(0, Math.floor(input.commissionCents ?? 0));
  } else {
    const sale = input.salePriceCents ?? 0;
    const cost = input.costCents ?? 0;
    const fee = input.paymentFeeCents ?? 0;
    const sub = input.shippingSubsidyCents ?? 0;
    netMargin = Math.max(0, Math.floor(sale - cost - fee - sub));
  }

  const marginAfterBuffer = Math.max(0, netMargin - OPERATING_BUFFER_CENTS);
  
  // Pick tier percentage
  let tierPercent = 10;
  for (const tier of DEFAULT_TIERS) {
    const withinLower = marginAfterBuffer >= tier.min;
    const withinUpper = tier.max === null ? true : marginAfterBuffer <= tier.max;
    if (withinLower && withinUpper) {
      tierPercent = tier.percent;
      break;
    }
  }

  // Calculate raw reward
  let raw = Math.floor((marginAfterBuffer * tierPercent) / 100);
  const promo = Math.max(0, input.promoMultiplier ?? 1);
  raw = Math.floor(raw * promo);

  // Apply limits
  const minApplied = raw < MIN_REWARD_PER_ORDER_CENTS;
  const maxApplied = raw > MAX_REWARD_PER_ORDER_CENTS;
  let reward = raw;
  if (minApplied) reward = MIN_REWARD_PER_ORDER_CENTS;
  if (maxApplied) reward = MAX_REWARD_PER_ORDER_CENTS;
  reward = Math.min(reward, marginAfterBuffer);

  return {
    netMarginCents: netMargin,
    customerRewardCents: reward,
    applied: {
      tierPercent,
      minApplied,
      maxApplied,
      promoMultiplier: promo,
      operatingBufferCents: OPERATING_BUFFER_CENTS,
    },
  };
}

// Get user's enhanced reward summary
router.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    
    // Get all rewards for user
    const userRewards = await db
      .select()
      .from(rewardsLedger)
      .where(eq(rewardsLedger.userId, userId))
      .orderBy(desc(rewardsLedger.createdAt));

    // Calculate totals
    const confirmed = userRewards
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    const redeemed = userRewards
      .filter(r => r.status === 'redeemed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    const pending = userRewards
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    res.json({
      userId,
      confirmed,
      redeemed,
      pending,
      available: confirmed - redeemed,
      entries: userRewards.slice(0, 100)
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create voucher from rewards balance
router.post('/me/vouchers', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    const { amountCents } = req.body;
    
    if (!amountCents || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check available balance
    const userRewards = await db
      .select()
      .from(rewardsLedger)
      .where(eq(rewardsLedger.userId, userId));

    const confirmed = userRewards
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    const redeemed = userRewards
      .filter(r => r.status === 'redeemed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    const available = confirmed - redeemed;

    if (amountCents > available) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create voucher code
    const code = `VCHR_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Create voucher record
    const [voucher] = await db
      .insert(vouchers)
      .values({
        code,
        userId,
        amountCents,
        status: 'active'
      })
      .returning();

    // Create redemption record
    await db
      .insert(redemptions)
      .values({
        userId,
        type: 'voucher',
        amountCents,
        feeCents: 0,
        currency: 'USD',
        target: JSON.stringify({}),
        status: 'paid',
        provider: 'internal'
      });

    // Mark rewards as redeemed
    await db
      .insert(rewardsLedger)
      .values({
        userId,
        sourceType: 'redemption',
        productType: '',
        sourceId: code,
        amountCents: -amountCents,
        points: 0,
        status: 'redeemed'
      });

    res.json({ code, amountCents });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create redemption request
router.post('/me/redemptions', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    const { type, amountCents, target } = req.body;

    if (!['cash', 'giftcard'].includes(type)) {
      return res.status(400).json({ error: 'Invalid redemption type' });
    }

    if (!amountCents || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check available balance
    const userRewards = await db
      .select()
      .from(rewardsLedger)
      .where(eq(rewardsLedger.userId, userId));

    const confirmed = userRewards
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    const redeemed = userRewards
      .filter(r => r.status === 'redeemed')
      .reduce((sum, r) => sum + (r.amountCents || 0), 0);

    const available = confirmed - redeemed;

    if (amountCents > available) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Calculate fee (2% for cash redemptions)
    const feeCents = type === 'cash' ? Math.ceil(amountCents * 0.02) : 0;

    // Create redemption record
    const [redemption] = await db
      .insert(redemptions)
      .values({
        userId,
        type,
        amountCents,
        feeCents,
        currency: 'USD',
        target: JSON.stringify(target || {}),
        status: 'requested',
        provider: type === 'cash' ? 'paypal' : 'internal'
      })
      .returning();

    res.json({ ok: true, redemption });
  } catch (error) {
    console.error('Error creating redemption:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's redemption history
router.get('/me/redemptions', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    
    const userRedemptions = await db
      .select()
      .from(redemptions)
      .where(eq(redemptions.userId, userId))
      .orderBy(desc(redemptions.createdAt))
      .limit(100);

    res.json({ items: userRedemptions });
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Events endpoint for reward tracking
router.post('/events', async (req, res) => {
  try {
    const { eventKey, userId, payload = {}, productType, calc = {}, promoMultiplier } = req.body;
    
    if (!eventKey || !userId) {
      return res.status(400).json({ error: 'eventKey and userId required' });
    }

    // Calculate reward
    const result = calculateReward({ 
      productType: productType || 'dropship', 
      promoMultiplier, 
      ...calc 
    });

    // Determine cooling off period
    const days = coolingOffDaysFor(productType || 'dropship');
    const status = days > 0 ? 'pending' : 'confirmed';
    const availableAt = days > 0 ? new Date(Date.now() + days * 24 * 3600 * 1000) : null;

    // Create reward ledger entry
    const [reward] = await db
      .insert(rewardsLedger)
      .values({
        userId,
        sourceType: productType === 'affiliate' ? 'affiliate' : productType || 'dropship',
        productType: productType || 'dropship',
        sourceId: payload.orderId || payload.reference || '',
        amountCents: result.customerRewardCents,
        points: 0,
        status,
        availableAt,
        metadata: JSON.stringify({
          eventKey, 
          calc, 
          promoMultiplier,
          netMarginCents: result.netMarginCents,
          applied: result.applied
        })
      })
      .returning();

    res.json({ ok: true, reward });
  } catch (error) {
    console.error('Error processing reward event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;