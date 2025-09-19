import { Router } from 'express';
import { z } from 'zod';
import { questionClassifier } from '../services/questionClassificationService';
import { db } from '../db';
import { communityQuestions, communityAnswers, knowledgeBase, searchAnalytics } from '../schemas/communitySchema';
import { eq, desc, and, or, like, sql, gte } from 'drizzle-orm';

const router = Router();

// Question submission endpoint
router.post('/questions', async (req, res) => {
  try {
    const { question, userId, context } = req.body;
    
    if (!question || !userId) {
      return res.status(400).json({ error: 'Question and userId are required' });
    }

    // Classify the question using our intelligent system
    const classification = questionClassifier.classifyQuestion(question, context);
    
    // Generate question ID
    const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate expiry date based on retention period
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + classification.retentionPeriod);

    // Create question entry based on storage level
    const questionData = {
      id: questionId,
      userId,
      questionText: question,
      category: classification.category,
      subcategory: classification.subcategory,
      tags: classification.tags,
      problemSolvingScore: classification.problemSolvingScore,
      businessValue: classification.businessValue,
      communityImpact: classification.communityImpact,
      searchability: classification.searchability,
      complexity: classification.complexity,
      storageLevel: classification.storageLevel,
      retentionPeriod: classification.retentionPeriod,
      indexPriority: classification.indexPriority,
      isActive: true,
      isSolved: false,
      externalLinks: {},
      platformPosts: {},
      totalResponses: 0,
      totalViews: 0,
      totalEngagement: 0,
      expiresAt,
    };

    // Store in database
    const [createdQuestion] = await db.insert(communityQuestions).values(questionData).returning();

    // If high-value question, prepare for social media posting
    if (classification.storageLevel === 'full' && classification.problemSolvingScore > 60) {
      // TODO: Queue for social media posting
      // await socialMediaService.queuePost(questionId, question, classification.tags);
    }

    res.json({
      success: true,
      questionId,
      classification: {
        storageLevel: classification.storageLevel,
        category: classification.category,
        problemSolvingScore: classification.problemSolvingScore,
        reason: classification.reason
      },
      question: createdQuestion
    });

  } catch (error) {
    console.error('Error creating community question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Get questions with intelligent filtering
router.get('/questions', async (req, res) => {
  try {
    const {
      category,
      storageLevel,
      minScore = 0,
      complexity,
      solved,
      limit = 20,
      offset = 0,
      sortBy = 'created_at'
    } = req.query;

    // Build dynamic query conditions
    const conditions = [
      eq(communityQuestions.isActive, true)
    ];

    if (category) conditions.push(eq(communityQuestions.category, category as string));
    if (storageLevel) conditions.push(eq(communityQuestions.storageLevel, storageLevel as string));
    if (complexity) conditions.push(eq(communityQuestions.complexity, complexity as string));
    if (solved !== undefined) conditions.push(eq(communityQuestions.isSolved, solved === 'true'));
    if (minScore) conditions.push(gte(communityQuestions.problemSolvingScore, parseInt(minScore as string)));

    // Execute query with sorting
    const questions = await db
      .select()
      .from(communityQuestions)
      .where(and(...conditions))
      .orderBy(sortBy === 'score' ? desc(communityQuestions.problemSolvingScore) : desc(communityQuestions.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({
      success: true,
      questions,
      total: questions.length,
      filters: { category, storageLevel, minScore, complexity, solved }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get specific question with answers
router.get('/questions/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { includeAnswers = true } = req.query;

    // Get question
    const [question] = await db
      .select()
      .from(communityQuestions)
      .where(eq(communityQuestions.id, questionId));

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Increment view count
    await db
      .update(communityQuestions)
      .set({ 
        totalViews: sql`${communityQuestions.totalViews} + 1`,
        updatedAt: new Date()
      })
      .where(eq(communityQuestions.id, questionId));

    let answers = [];
    if (includeAnswers === 'true') {
      // Get answers sorted by engagement
      answers = await db
        .select()
        .from(communityAnswers)
        .where(eq(communityAnswers.questionId, questionId))
        .orderBy(desc(communityAnswers.engagementScore));
    }

    res.json({
      success: true,
      question: { ...question, totalViews: question.totalViews + 1 },
      answers,
      answerCount: answers.length
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Submit answer to a question
router.post('/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answerText, platform, authorName, authorHandle, externalContent } = req.body;

    if (!answerText || !platform) {
      return res.status(400).json({ error: 'Answer text and platform are required' });
    }

    // Check if question exists and is active
    const [question] = await db
      .select()
      .from(communityQuestions)
      .where(and(eq(communityQuestions.id, questionId), eq(communityQuestions.isActive, true)));

    if (!question) {
      return res.status(404).json({ error: 'Question not found or inactive' });
    }

    // Generate answer ID
    const answerId = `a_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create answer summary (first 500 chars)
    const answerSummary = answerText.length > 500 ? answerText.substring(0, 500) + '...' : answerText;

    // Classify answer type based on content
    const answerType = classifyAnswerType(answerText);
    const technicalLevel = determineTechnicalLevel(answerText);

    const answerData = {
      id: answerId,
      questionId,
      answerText,
      answerSummary,
      platform,
      authorName: authorName || 'Anonymous',
      authorHandle: authorHandle || '',
      authorReputation: 0,
      externalContent: externalContent || { originalPostUrl: '' },
      upvotes: 0,
      downvotes: 0,
      engagementScore: 0,
      isVerified: false,
      isBestAnswer: false,
      answerType,
      technicalLevel,
    };

    // Insert answer
    const [createdAnswer] = await db.insert(communityAnswers).values(answerData).returning();

    // Update question response count
    await db
      .update(communityQuestions)
      .set({ 
        totalResponses: sql`${communityQuestions.totalResponses} + 1`,
        updatedAt: new Date()
      })
      .where(eq(communityQuestions.id, questionId));

    res.json({
      success: true,
      answerId,
      answer: createdAnswer
    });

  } catch (error) {
    console.error('Error creating answer:', error);
    res.status(500).json({ error: 'Failed to create answer' });
  }
});

// Search knowledge base with intelligent ranking
router.get('/knowledge-search', async (req, res) => {
  try {
    const { q: searchQuery, limit = 10, category, difficulty } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Log search analytics
    const searchId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.insert(searchAnalytics).values({
      id: searchId,
      searchQuery: searchQuery as string,
      resultsFound: 0, // Will update after search
      searchDate: new Date()
    });

    // Search knowledge base with text similarity
    let searchConditions = [
      or(
        like(knowledgeBase.title, `%${searchQuery}%`),
        like(knowledgeBase.processedAnswer, `%${searchQuery}%`),
        sql`${knowledgeBase.searchKeywords} @> ${JSON.stringify([searchQuery])}`
      )
    ];

    if (category) searchConditions.push(eq(knowledgeBase.difficultyLevel, category as string));
    if (difficulty) searchConditions.push(eq(knowledgeBase.difficultyLevel, difficulty as string));

    const results = await db
      .select()
      .from(knowledgeBase)
      .where(and(...searchConditions))
      .orderBy(desc(knowledgeBase.confidenceScore), desc(knowledgeBase.usageCount))
      .limit(parseInt(limit as string));

    // Update search analytics
    await db
      .update(searchAnalytics)
      .set({ resultsFound: results.length })
      .where(eq(searchAnalytics.id, searchId));

    // Increment usage count for returned results
    if (results.length > 0) {
      const resultIds = results.map(r => r.id);
      await db
        .update(knowledgeBase)
        .set({ usageCount: sql`${knowledgeBase.usageCount} + 1` })
        .where(sql`${knowledgeBase.id} = ANY(${resultIds})`);
    }

    res.json({
      success: true,
      results: results.map(result => ({
        ...result,
        // Provide quick solution first, link to full content
        preview: result.quickSolution || result.processedAnswer.substring(0, 200) + '...',
        fullContentAvailable: true
      })),
      total: results.length,
      searchQuery
    });

  } catch (error) {
    console.error('Error searching knowledge base:', error);
    res.status(500).json({ error: 'Failed to search knowledge base' });
  }
});

// Get question categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await db
      .select({
        category: communityQuestions.category,
        count: sql<number>`count(*)`,
        avgScore: sql<number>`avg(${communityQuestions.problemSolvingScore})`,
        highValueCount: sql<number>`sum(case when ${communityQuestions.storageLevel} = 'full' then 1 else 0 end)`
      })
      .from(communityQuestions)
      .where(eq(communityQuestions.isActive, true))
      .groupBy(communityQuestions.category)
      .orderBy(desc(sql`count(*)`));

    res.json({
      success: true,
      categories: categories.map(cat => ({
        name: cat.category,
        questionCount: cat.count,
        averageScore: Math.round(cat.avgScore || 0),
        highValueQuestions: cat.highValueCount
      }))
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Cleanup expired questions (maintenance endpoint)
router.post('/cleanup-expired', async (req, res) => {
  try {
    const now = new Date();
    
    // Get expired questions
    const expiredQuestions = await db
      .select({ id: communityQuestions.id, storageLevel: communityQuestions.storageLevel })
      .from(communityQuestions)
      .where(and(
        eq(communityQuestions.isActive, true),
        gte(now, communityQuestions.expiresAt)
      ));

    let deletedCount = 0;
    let archivedCount = 0;

    for (const question of expiredQuestions) {
      if (question.storageLevel === 'discard') {
        // Completely delete low-value content
        await db.delete(communityQuestions).where(eq(communityQuestions.id, question.id));
        await db.delete(communityAnswers).where(eq(communityAnswers.questionId, question.id));
        deletedCount++;
      } else {
        // Archive other content (mark as inactive)
        await db
          .update(communityQuestions)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(communityQuestions.id, question.id));
        archivedCount++;
      }
    }

    res.json({
      success: true,
      deleted: deletedCount,
      archived: archivedCount,
      total: expiredQuestions.length
    });

  } catch (error) {
    console.error('Error cleaning up expired questions:', error);
    res.status(500).json({ error: 'Failed to cleanup expired questions' });
  }
});

// Helper functions
function classifyAnswerType(answerText: string): 'solution' | 'explanation' | 'resource' | 'opinion' {
  const text = answerText.toLowerCase();
  
  if (text.includes('try this') || text.includes('solution') || text.includes('fix') || text.includes('here\'s how')) {
    return 'solution';
  }
  if (text.includes('because') || text.includes('reason') || text.includes('explanation')) {
    return 'explanation';
  }
  if (text.includes('link') || text.includes('documentation') || text.includes('tutorial') || text.includes('resource')) {
    return 'resource';
  }
  return 'opinion';
}

function determineTechnicalLevel(answerText: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const technicalTerms = (answerText.match(/\b(api|database|server|configuration|integration|architecture|algorithm|framework|optimization|infrastructure)\b/gi) || []).length;
  const codeBlocks = (answerText.match(/```|`[^`]+`/g) || []).length;
  
  if (technicalTerms >= 5 || codeBlocks >= 3) return 'expert';
  if (technicalTerms >= 3 || codeBlocks >= 2) return 'advanced';
  if (technicalTerms >= 1 || codeBlocks >= 1) return 'intermediate';
  return 'beginner';
}

export default router;