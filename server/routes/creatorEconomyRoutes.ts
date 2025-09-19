import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { 
  creatorProfiles, 
  creatorSolutions
} from "@shared/schema";
import { communityQuestions } from "@shared/schema";
import { eq, desc, and, sum, count, avg } from "drizzle-orm";

const router = Router();

// Creator Profile Management
router.post("/profiles", async (req, res) => {
  try {
    const profileSchema = z.object({
      userId: z.string(),
      displayName: z.string().max(100),
      bio: z.string().optional(),
      profileImageUrl: z.string().optional(),
      socialLinks: z.object({
        tiktok: z.string().optional(),
        youtube: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        website: z.string().optional(),
      }).optional(),
      expertiseTags: z.array(z.string()).optional(),
    });

    const data = profileSchema.parse(req.body);
    
    // Generate creator ID
    const creatorId = `cr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const [profile] = await db.insert(creatorProfiles).values({
      id: creatorId,
      ...data,
    }).returning();

    res.json({ success: true, profile });
  } catch (error) {
    console.error("Error creating creator profile:", error);
    res.status(400).json({ error: "Failed to create creator profile" });
  }
});

router.get("/profiles/:creatorId", async (req, res) => {
  try {
    const { creatorId } = req.params;
    
    const [profile] = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.id, creatorId));
    
    if (!profile) {
      return res.status(404).json({ error: "Creator profile not found" });
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching creator profile:", error);
    res.status(500).json({ error: "Failed to fetch creator profile" });
  }
});

// Submit Creator Solution
router.post("/solutions", async (req, res) => {
  try {
    const solutionSchema = z.object({
      questionId: z.string(),
      creatorId: z.string(),
      solutionTitle: z.string().max(200),
      solutionContent: z.string(),
      solutionType: z.enum(["video", "article", "tutorial", "recipe", "guide", "code"]),
      mediaUrls: z.object({
        mainVideo: z.string().optional(),
        images: z.array(z.string()).optional(),
        attachments: z.array(z.string()).optional(),
        codeSnippets: z.array(z.string()).optional(),
      }).optional(),
      monetizationLinks: z.object({
        affiliateLinks: z.array(z.object({
          platform: z.string(),
          url: z.string(),
          description: z.string(),
          commission: z.number(),
        })).optional(),
        directSales: z.array(z.object({
          platform: z.string(),
          url: z.string(),
          price: z.number(),
          description: z.string(),
        })).optional(),
        sponsoredContent: z.array(z.object({
          brand: z.string(),
          url: z.string(),
          description: z.string(),
          fee: z.number(),
        })).optional(),
      }).optional(),
    });

    const data = solutionSchema.parse(req.body);
    
    // Generate solution ID
    const solutionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const [solution] = await db.insert(creatorSolutions).values({
      id: solutionId,
      ...data,
    }).returning();

    // Update creator profile stats
    await db
      .update(creatorProfiles)
      .set({ 
        totalSolutions: db.raw("total_solutions + 1"),
        updatedAt: new Date() 
      })
      .where(eq(creatorProfiles.id, data.creatorId));

    res.json({ success: true, solution });
  } catch (error) {
    console.error("Error creating solution:", error);
    res.status(400).json({ error: "Failed to create solution" });
  }
});

// Get solutions for a question
router.get("/questions/:questionId/solutions", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { limit = 10, sortBy = "rating" } = req.query;

    let orderBy;
    switch (sortBy) {
      case "newest":
        orderBy = desc(creatorSolutions.createdAt);
        break;
      case "views":
        orderBy = desc(creatorSolutions.views);
        break;
      case "revenue":
        orderBy = desc(creatorSolutions.revenue);
        break;
      default:
        orderBy = desc(creatorSolutions.rating);
    }

    const solutions = await db
      .select({
        solution: creatorSolutions,
        creator: creatorProfiles,
      })
      .from(creatorSolutions)
      .leftJoin(creatorProfiles, eq(creatorSolutions.creatorId, creatorProfiles.id))
      .where(eq(creatorSolutions.questionId, questionId))
      .orderBy(orderBy)
      .limit(Number(limit));

    res.json({ success: true, solutions });
  } catch (error) {
    console.error("Error fetching solutions:", error);
    res.status(500).json({ error: "Failed to fetch solutions" });
  }
});

// Track solution interactions (views, clicks, etc.)
router.post("/solutions/:solutionId/track", async (req, res) => {
  try {
    const { solutionId } = req.params;
    const { action } = req.body; // "view" | "like" | "save" | "click_through"

    const updateField = action === "view" ? "views" : 
                       action === "like" ? "likes" :
                       action === "save" ? "saves" :
                       action === "click_through" ? "click_throughs" : null;

    if (!updateField) {
      return res.status(400).json({ error: "Invalid action" });
    }

    await db
      .update(creatorSolutions)
      .set({ 
        [updateField]: db.raw(`${updateField} + 1`),
        updatedAt: new Date()
      })
      .where(eq(creatorSolutions.id, solutionId));

    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking solution interaction:", error);
    res.status(500).json({ error: "Failed to track interaction" });
  }
});

// Simplified revenue tracking for now (can be expanded later)
router.post("/revenue", async (req, res) => {
  try {
    const { creatorId, amount, sourcePlatform } = req.body;
    
    // Update creator total earnings
    const [updatedCreator] = await db
      .update(creatorProfiles)
      .set({ 
        totalEarnings: db.raw(`total_earnings + ${amount}`),
        updatedAt: new Date()
      })
      .where(eq(creatorProfiles.id, creatorId))
      .returning();

    res.json({ success: true, updatedCreator });
  } catch (error) {
    console.error("Error recording revenue:", error);
    res.status(400).json({ error: "Failed to record revenue" });
  }
});

// Get creator analytics
router.get("/creators/:creatorId/analytics", async (req, res) => {
  try {
    const { creatorId } = req.params;

    // Get creator stats
    const [creator] = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.id, creatorId));

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    // Get top solutions
    const topSolutions = await db
      .select()
      .from(creatorSolutions)
      .where(eq(creatorSolutions.creatorId, creatorId))
      .orderBy(desc(creatorSolutions.revenue))
      .limit(5);

    res.json({ 
      success: true, 
      creator, 
      topSolutions 
    });
  } catch (error) {
    console.error("Error fetching creator analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get platform revenue stats (simplified)
router.get("/platform-revenue", async (req, res) => {
  try {
    // Get top earning creators
    const topCreators = await db
      .select()
      .from(creatorProfiles)
      .orderBy(desc(creatorProfiles.totalEarnings))
      .limit(10);

    res.json({ 
      success: true, 
      topCreators 
    });
  } catch (error) {
    console.error("Error fetching platform revenue:", error);
    res.status(500).json({ error: "Failed to fetch platform revenue" });
  }
});

export default router;