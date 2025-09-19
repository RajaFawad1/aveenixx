import { Router } from "express";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { db } from "../db";
import { 
  communityRewards, 
  referralTracking, 
  communityActivities, 
  challengeParticipation,
  creatorProfiles,
  users,
  // Enhanced rewards system tables
  rewardsLedger,
  vouchers,
  giftCards,
  tasks,
  userTasks,
  redemptions,
  type InsertCommunityReward,
  type InsertReferralTracking,
  type InsertCommunityActivity,
  type InsertChallengeParticipation,
  type InsertRewardsLedger,
  type InsertVoucher,
  type InsertGiftCard,
  type InsertTask,
  type InsertUserTask,
  type InsertRedemption
} from "@shared/schema";
import { eq, desc, sum, count, and } from "drizzle-orm";

const router = Router();

// Get user's reward dashboard
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get total earnings from rewards
    const totalRewards = await db
      .select({ total: sum(communityRewards.amount) })
      .from(communityRewards)
      .where(and(
        eq(communityRewards.userId, userId),
        eq(communityRewards.status, 'approved')
      ));

    // Get available credits
    const totalCredits = await db
      .select({ total: sum(communityRewards.credits) })
      .from(communityRewards)
      .where(and(
        eq(communityRewards.userId, userId),
        eq(communityRewards.status, 'approved')
      ));

    // Get recent activities
    const recentActivities = await db
      .select()
      .from(communityActivities)
      .where(eq(communityActivities.userId, userId))
      .orderBy(desc(communityActivities.createdAt))
      .limit(10);

    // Get referral stats
    const referralStats = await db
      .select({
        totalReferrals: count(referralTracking.id),
        totalEarnings: sum(referralTracking.commissionsEarned)
      })
      .from(referralTracking)
      .where(eq(referralTracking.referrerId, userId));

    // Get recent rewards
    const recentRewards = await db
      .select()
      .from(communityRewards)
      .where(eq(communityRewards.userId, userId))
      .orderBy(desc(communityRewards.createdAt))
      .limit(10);

    // Calculate community level based on total points
    const totalPoints = recentActivities.reduce((sum, activity) => sum + (activity.points || 0), 0);
    let communityLevel = "rookie";
    if (totalPoints >= 5000) communityLevel = "champion";
    else if (totalPoints >= 1500) communityLevel = "expert";
    else if (totalPoints >= 500) communityLevel = "contributor";
    else if (totalPoints >= 100) communityLevel = "helper";

    res.json({
      totalEarnings: parseFloat(totalRewards[0]?.total || "0"),
      availableCredits: parseInt(totalCredits[0]?.total || "0"),
      currentLevel: communityLevel,
      totalPoints,
      referralStats: {
        totalReferrals: referralStats[0]?.totalReferrals || 0,
        totalEarnings: parseFloat(referralStats[0]?.totalEarnings || "0")
      },
      recentActivities,
      recentRewards
    });
  } catch (error) {
    console.error('Error fetching reward dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch reward dashboard' });
  }
});

// Award points for community activity
router.post('/award-points', async (req, res) => {
  try {
    const { userId, activityType, targetId, points, metadata } = req.body;
    
    const activity: InsertCommunityActivity = {
      id: `ca_${createId()}`,
      userId,
      activityType,
      targetId,
      points,
      metadata
    };
    
    await db.insert(communityActivities).values(activity);

    // Check if this activity should trigger a reward
    let rewardAmount = 0;
    let rewardType = "";
    
    switch (activityType) {
      case 'question_asked':
        if (points >= 80) {
          rewardAmount = 10;
          rewardType = 'quality_question_bonus';
        } else if (points >= 60) {
          rewardAmount = 5;
          rewardType = 'good_question_bonus';
        } else if (points >= 40) {
          rewardAmount = 2;
          rewardType = 'question_bonus';
        }
        break;
      case 'solution_provided':
        if (points >= 90) {
          rewardAmount = 25;
          rewardType = 'excellent_solution_bonus';
        } else if (points >= 70) {
          rewardAmount = 15;
          rewardType = 'good_solution_bonus';
        } else if (points >= 50) {
          rewardAmount = 8;
          rewardType = 'solution_bonus';
        }
        break;
      case 'review_given':
        rewardAmount = Math.min(points * 0.1, 2);
        rewardType = 'review_reward';
        break;
      case 'helpful_vote':
        rewardAmount = 0.5;
        rewardType = 'helpful_vote_reward';
        break;
    }

    // Award the monetary reward if applicable
    if (rewardAmount > 0) {
      const reward: InsertCommunityReward = {
        id: `cr_${createId()}`,
        userId,
        rewardType,
        amount: rewardAmount.toString(),
        credits: Math.floor(rewardAmount * 2), // 2 credits per dollar
        sourceId: activity.id,
        description: `${activityType} reward - ${points} quality points`,
        status: 'approved'
      };
      
      await db.insert(communityRewards).values(reward);
    }

    res.json({ 
      activity, 
      reward: rewardAmount > 0 ? { amount: rewardAmount, type: rewardType } : null 
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ error: 'Failed to award points' });
  }
});

// Create referral tracking
router.post('/referrals', async (req, res) => {
  try {
    const { referrerId, referredUserId, referralCode } = req.body;
    
    const referral: InsertReferralTracking = {
      id: `rt_${createId()}`,
      referrerId,
      referredId: referredUserId,
      referralCode,
      status: 'pending'
    };
    
    await db.insert(referralTracking).values(referral);
    res.json(referral);
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Failed to create referral tracking' });
  }
});

// Complete referral (when referred user becomes active)
router.patch('/referrals/:referralId/complete', async (req, res) => {
  try {
    const { referralId } = req.params;
    
    const referral = await db
      .select()
      .from(referralTracking)
      .where(eq(referralTracking.id, referralId))
      .limit(1);
    
    if (!referral.length) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    // Update referral status
    await db
      .update(referralTracking)
      .set({ 
        status: 'completed', 
        completedAt: new Date(),
        commissionsEarned: "25" // $25 referral bonus
      })
      .where(eq(referralTracking.id, referralId));

    // Award referral commission to referrer
    const reward: InsertCommunityReward = {
      id: `cr_${createId()}`,
      userId: referral[0].referrerId,
      rewardType: 'referral_commission',
      amount: "25",
      credits: 50,
      sourceId: referralId,
      description: 'Successful referral bonus',
      status: 'approved'
    };
    
    await db.insert(communityRewards).values(reward);

    res.json({ message: 'Referral completed successfully' });
  } catch (error) {
    console.error('Error completing referral:', error);
    res.status(500).json({ error: 'Failed to complete referral' });
  }
});

// Get active challenges
router.get('/challenges/active', async (req, res) => {
  try {
    const currentChallenges = [
      {
        id: 'ch_beauty_jan_2025',
        title: 'January Beauty Solutions Challenge',
        description: 'Share your best skincare routines and beauty tips',
        category: 'Beauty & Skincare',
        prizePools: {
          first: 500,
          second: 300,
          third: 200,
          participation: 50 // For all qualifying entries
        },
        totalPrize: 1000,
        deadline: new Date('2025-01-31'),
        startDate: new Date('2025-01-01'),
        requirements: [
          'Original skincare routine or beauty tip',
          'Before/after photos or video demonstration',
          'Detailed step-by-step instructions',
          'Product recommendations with honest reviews'
        ],
        participants: await db
          .select({ count: count(challengeParticipation.id) })
          .from(challengeParticipation)
          .where(eq(challengeParticipation.challengeId, 'ch_beauty_jan_2025'))
          .then(result => result[0]?.count || 0),
        status: 'active'
      },
      {
        id: 'ch_budget_cooking_jan_2025',
        title: 'Budget Cooking Champions',
        description: 'Create delicious meals under $10 per serving for families',
        category: 'Food & Cooking',
        prizePools: {
          first: 300,
          second: 150,
          third: 100,
          participation: 25
        },
        totalPrize: 575,
        deadline: new Date('2025-01-25'),
        startDate: new Date('2025-01-01'),
        requirements: [
          'Complete recipe with ingredient costs',
          'Serving size must be family-friendly (4+ people)',
          'Total cost under $10 per serving',
          'Video or photo of cooking process',
          'Nutritional information preferred'
        ],
        participants: await db
          .select({ count: count(challengeParticipation.id) })
          .from(challengeParticipation)
          .where(eq(challengeParticipation.challengeId, 'ch_budget_cooking_jan_2025'))
          .then(result => result[0]?.count || 0),
        status: 'active'
      },
      {
        id: 'ch_tech_help_jan_2025',
        title: 'Tech Problem Solvers',
        description: 'Help solve the most challenging tech support questions',
        category: 'Technology',
        prizePools: {
          first: 400,
          second: 250,
          third: 150,
          participation: 35
        },
        totalPrize: 835,
        deadline: new Date('2025-01-28'),
        startDate: new Date('2025-01-01'),
        requirements: [
          'Clear step-by-step solution guide',
          'Screenshots or video walkthrough',
          'Works across multiple devices/systems',
          'Easy to follow for non-technical users',
          'Include troubleshooting tips'
        ],
        participants: await db
          .select({ count: count(challengeParticipation.id) })
          .from(challengeParticipation)
          .where(eq(challengeParticipation.challengeId, 'ch_tech_help_jan_2025'))
          .then(result => result[0]?.count || 0),
        status: 'active'
      }
    ];

    res.json(currentChallenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Join a challenge
router.post('/challenges/:challengeId/join', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.body;
    
    const participation: InsertChallengeParticipation = {
      id: `cp_${createId()}`,
      userId,
      challengeId,
      status: 'participating'
    };
    
    await db.insert(challengeParticipation).values(participation);
    res.json({ message: 'Successfully joined challenge', participation });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
});

// Get earning opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = {
      questionAskers: [
        {
          title: 'Quality Question Bonus',
          reward: '$2-10',
          description: 'Earn credits for asking detailed, helpful questions that generate community engagement',
          requirements: [
            'Include clear context and background information',
            'Explain what you have already tried',
            'Specify exactly what kind of solution you need',
            'Add relevant tags and category'
          ],
          payoutCriteria: {
            basic: { points: 40, reward: 2 },
            good: { points: 60, reward: 5 },
            excellent: { points: 80, reward: 10 }
          }
        },
        {
          title: 'Trending Question Royalties',
          reward: '5% ongoing',
          description: 'When your question generates monetized solutions, earn ongoing royalties',
          requirements: [
            'Question must receive 100+ views',
            'Must have 5+ quality solutions',
            'Solutions must generate revenue for creators',
            'Question must maintain community engagement over time'
          ],
          payoutCriteria: {
            percentage: 5,
            minimumViews: 100,
            minimumSolutions: 5
          }
        }
      ],
      reviewersEarn: [
        {
          title: 'Solution Review Rewards',
          reward: '$0.50-2',
          description: 'Get paid for rating and writing helpful reviews on community solutions',
          requirements: [
            'Write detailed reviews with specific feedback',
            'Include photos or screenshots when testing solutions',
            'Rate accuracy, helpfulness, and ease of implementation',
            'Follow community review guidelines'
          ],
          payoutCriteria: {
            basic: { wordCount: 50, reward: 0.5 },
            detailed: { wordCount: 150, reward: 1 },
            comprehensive: { wordCount: 300, withMedia: true, reward: 2 }
          }
        },
        {
          title: 'Early Prediction Bonus',
          reward: '$10-50',
          description: 'Early upvoting solutions that become trending earns prediction bonuses',
          requirements: [
            'Vote within first 48 hours of solution posting',
            'Solution must reach top 10 trending in category',
            'Maintain positive community standing',
            'Vote must be genuine assessment of quality'
          ],
          payoutCriteria: {
            topRank: { rank: 3, reward: 50 },
            featured: { rank: 10, reward: 25 },
            trending: { views: 1000, reward: 10 }
          }
        }
      ],
      ambassadors: [
        {
          title: 'Regional Ambassador Income',
          reward: '$100-500/month',
          description: 'Part-time income for growing and managing local community chapters',
          requirements: [
            'Apply for ambassador role with community portfolio',
            'Manage and grow local community to 50+ active members',
            'Organize virtual or in-person community events',
            'Moderate local discussions and resolve conflicts',
            'Report monthly on community growth and engagement'
          ],
          responsibilities: [
            'Weekly community engagement and support',
            'Monthly local community events',
            'New member onboarding and mentoring',
            'Content curation for regional interests',
            'Partnership development with local creators'
          ]
        }
      ]
    };

    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch earning opportunities' });
  }
});

// Enhanced Rewards & Tasks System API Endpoints

// Helper function to calculate user's rewards balance
async function getUserRewardsBalance(userId: string) {
  try {
    // Get total from rewards ledger
    const ledgerBalance = await db
      .select({ total: sum(rewardsLedger.amountCents) })
      .from(rewardsLedger)
      .where(and(
        eq(rewardsLedger.userId, userId),
        eq(rewardsLedger.status, 'confirmed')
      ));

    // Get total redeemed amount
    const redemptionsTotal = await db
      .select({ total: sum(redemptions.amountCents) })
      .from(redemptions)
      .where(and(
        eq(redemptions.userId, userId),
        eq(redemptions.status, 'paid')
      ));

    const confirmed = parseInt(ledgerBalance[0]?.total || "0");
    const redeemed = parseInt(redemptionsTotal[0]?.total || "0");
    const available = confirmed - redeemed;

    return { confirmed, redeemed, available };
  } catch (error) {
    console.error('Error calculating rewards balance:', error);
    return { confirmed: 0, redeemed: 0, available: 0 };
  }
}

// Get user's rewards summary
router.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user'; // Get from auth
    
    const balance = await getUserRewardsBalance(userId);
    
    res.json(balance);
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ error: 'Failed to fetch rewards summary' });
  }
});

// Create voucher from user's balance
router.post('/me/vouchers', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    const { amountCents } = req.body;
    
    if (!amountCents || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const balance = await getUserRewardsBalance(userId);
    
    if (balance.available < amountCents) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate unique voucher code
    const voucherCode = `VCH${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const voucher: InsertVoucher = {
      code: voucherCode,
      userId,
      amountCents,
      status: 'active'
    };

    await db.insert(vouchers).values(voucher);

    // Create redemption record
    const redemption: InsertRedemption = {
      userId,
      type: 'voucher',
      amountCents,
      feeCents: 0,
      target: JSON.stringify({ voucherCode }),
      status: 'paid',
      provider: 'internal'
    };

    await db.insert(redemptions).values(redemption);

    res.json({ voucher, message: 'Voucher created successfully' });
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ error: 'Failed to create voucher' });
  }
});

// Create redemption request (cash-out or gift card)
router.post('/me/redemptions', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'demo-user';
    const { type, amountCents, target } = req.body;
    
    if (!type || !amountCents || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid redemption request' });
    }

    const balance = await getUserRewardsBalance(userId);
    
    if (balance.available < amountCents) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Calculate fees for cash-outs
    let feeCents = 0;
    if (type === 'cash') {
      feeCents = Math.max(100, Math.floor(amountCents * 0.03)); // $1 min or 3%
    }

    const redemption: InsertRedemption = {
      userId,
      type,
      amountCents,
      feeCents,
      target: JSON.stringify(target),
      status: 'requested',
      provider: type === 'cash' ? 'paypal' : 'internal'
    };

    const [newRedemption] = await db.insert(redemptions).values(redemption).returning();

    res.json({ redemption: newRedemption, message: 'Redemption request created' });
  } catch (error) {
    console.error('Error creating redemption:', error);
    res.status(500).json({ error: 'Failed to create redemption request' });
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
      .orderBy(desc(redemptions.createdAt));

    res.json({ items: userRedemptions });
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ error: 'Failed to fetch redemptions' });
  }
});

// Admin: Get rewards system summary
router.get('/admin/summary', async (req, res) => {
  try {
    // Total rewards distributed
    const totalDistributed = await db
      .select({ total: sum(rewardsLedger.amountCents) })
      .from(rewardsLedger)
      .where(eq(rewardsLedger.status, 'confirmed'));

    // Total redemptions paid
    const totalRedeemed = await db
      .select({ total: sum(redemptions.amountCents) })
      .from(redemptions)
      .where(eq(redemptions.status, 'paid'));

    // Pending redemptions
    const pendingRedemptions = await db
      .select({ total: sum(redemptions.amountCents), count: count() })
      .from(redemptions)
      .where(eq(redemptions.status, 'requested'));

    // Active vouchers
    const activeVouchers = await db
      .select({ total: sum(vouchers.amountCents), count: count() })
      .from(vouchers)
      .where(eq(vouchers.status, 'active'));

    res.json({
      totalDistributed: parseInt(totalDistributed[0]?.total || "0"),
      totalRedeemed: parseInt(totalRedeemed[0]?.total || "0"),
      pendingRedemptions: pendingRedemptions[0]?.count || 0,
      activeVouchers: activeVouchers[0]?.count || 0,
      customerParticipation: 67, // Mock data - can be calculated based on actual user base
      averageRewardValue: Math.floor((parseInt(totalDistributed[0]?.total || "0")) / Math.max(1, (pendingRedemptions[0]?.count || 1)))
    });
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    res.status(500).json({ error: 'Failed to fetch admin summary' });
  }
});

// Admin: Get all redemptions
router.get('/admin/redemptions', async (req, res) => {
  try {
    const allRedemptions = await db
      .select()
      .from(redemptions)
      .orderBy(desc(redemptions.createdAt));

    res.json({ items: allRedemptions });
  } catch (error) {
    console.error('Error fetching admin redemptions:', error);
    res.status(500).json({ error: 'Failed to fetch redemptions' });
  }
});

// Admin: Get pending redemptions
router.get('/admin/redemptions/pending', async (req, res) => {
  try {
    const pendingRedemptions = await db
      .select()
      .from(redemptions)
      .where(eq(redemptions.status, 'requested'))
      .orderBy(desc(redemptions.createdAt));

    res.json(pendingRedemptions);
  } catch (error) {
    console.error('Error fetching pending redemptions:', error);
    res.status(500).json({ error: 'Failed to fetch pending redemptions' });
  }
});

// Admin: Get recent activity
router.get('/admin/activity/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    const recentActivity = await db
      .select()
      .from(rewardsLedger)
      .orderBy(desc(rewardsLedger.createdAt))
      .limit(limit);

    res.json(recentActivity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Admin: Approve redemption
router.post('/admin/redemptions/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db
      .update(redemptions)
      .set({ status: 'approved', processedAt: new Date() })
      .where(eq(redemptions.id, parseInt(id)));

    res.json({ message: 'Redemption approved' });
  } catch (error) {
    console.error('Error approving redemption:', error);
    res.status(500).json({ error: 'Failed to approve redemption' });
  }
});

// Admin: Reject redemption
router.post('/admin/redemptions/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db
      .update(redemptions)
      .set({ status: 'rejected', processedAt: new Date() })
      .where(eq(redemptions.id, parseInt(id)));

    res.json({ message: 'Redemption rejected' });
  } catch (error) {
    console.error('Error rejecting redemption:', error);
    res.status(500).json({ error: 'Failed to reject redemption' });
  }
});

// Admin: Mark redemption as paid
router.post('/admin/redemptions/:id/mark-paid', async (req, res) => {
  try {
    const { id } = req.params;
    const { providerRef } = req.body;
    
    await db
      .update(redemptions)
      .set({ 
        status: 'paid', 
        providerRef,
        processedAt: new Date() 
      })
      .where(eq(redemptions.id, parseInt(id)));

    res.json({ message: 'Redemption marked as paid' });
  } catch (error) {
    console.error('Error marking redemption as paid:', error);
    res.status(500).json({ error: 'Failed to mark redemption as paid' });
  }
});

// Award rewards for affiliate/dropship sales
router.post('/award-sale-reward', async (req, res) => {
  try {
    const { userId, sourceType, sourceId, amountCents, points = 0 } = req.body;
    
    const reward: InsertRewardsLedger = {
      userId,
      sourceType, // 'affiliate' or 'dropship'
      sourceId,
      amountCents,
      points,
      status: 'confirmed'
    };
    
    await db.insert(rewardsLedger).values(reward);
    
    res.json({ reward, message: 'Sale reward awarded' });
  } catch (error) {
    console.error('Error awarding sale reward:', error);
    res.status(500).json({ error: 'Failed to award sale reward' });
  }
});

// Demo endpoint to seed test rewards data
router.post('/demo/seed-rewards', async (req, res) => {
  try {
    const userId = 'demo-user';
    
    // Create some sample rewards
    const sampleRewards: InsertRewardsLedger[] = [
      {
        userId,
        sourceType: 'affiliate',
        sourceId: 'amazon-sale-001',
        amountCents: 250, // $2.50
        points: 0,
        status: 'confirmed'
      },
      {
        userId,
        sourceType: 'dropship',
        sourceId: 'dropship-sale-002',
        amountCents: 500, // $5.00
        points: 0,
        status: 'confirmed'
      },
      {
        userId,
        sourceType: 'affiliate',
        sourceId: 'amazon-sale-003',
        amountCents: 175, // $1.75
        points: 0,
        status: 'confirmed'
      },
      {
        userId,
        sourceType: 'task',
        sourceId: 'newsletter-signup',
        amountCents: 200, // $2.00
        points: 50,
        status: 'confirmed'
      }
    ];
    
    await db.insert(rewardsLedger).values(sampleRewards);
    
    res.json({ 
      message: 'Demo rewards seeded successfully',
      totalAmount: sampleRewards.reduce((sum, r) => sum + r.amountCents, 0),
      count: sampleRewards.length
    });
  } catch (error) {
    console.error('Error seeding demo rewards:', error);
    res.status(500).json({ error: 'Failed to seed demo rewards' });
  }
});

export default router;