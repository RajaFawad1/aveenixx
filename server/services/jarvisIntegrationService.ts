import { db } from '../db';
import { knowledgeBase } from '../schemas/communitySchema';
import { desc, or, like } from 'drizzle-orm';

/**
 * JarvisIntegrationService - Helps Jarvis access community knowledge
 * 
 * IMPORTANT: Jarvis conversations are PRIVATE and NOT stored in community system
 * This service only provides community knowledge lookup to enhance Jarvis responses
 */
export class JarvisIntegrationService {

  /**
   * Search existing community knowledge to assist Jarvis responses
   */
  async searchCommunityKnowledge(query: string, limit: number = 5): Promise<any[]> {
    try {
      // Search knowledge base for relevant entries
      const results = await db
        .select()
        .from(knowledgeBase)
        .where(
          or(
            like(knowledgeBase.title, `%${query}%`),
            like(knowledgeBase.processedAnswer, `%${query}%`),
            like(knowledgeBase.quickSolution, `%${query}%`)
          )
        )
        .orderBy(desc(knowledgeBase.confidenceScore), desc(knowledgeBase.usageCount))
        .limit(limit);

      return results.map(result => ({
        id: result.id,
        title: result.title,
        solution: result.quickSolution || result.processedAnswer.substring(0, 200) + '...',
        confidence: result.confidenceScore,
        category: result.difficultyLevel,
        keywords: result.searchKeywords
      }));

    } catch (error) {
      console.error('Error searching community knowledge:', error);
      return [];
    }
  }

  /**
   * Get related community discussions for a topic
   */
  async getRelatedDiscussions(category: string, tags: string[], limit: number = 3): Promise<any[]> {
    try {
      // Find related questions in the same category
      const relatedQuestions = await db
        .select({
          id: communityQuestions.id,
          questionText: communityQuestions.questionText,
          category: communityQuestions.category,
          isSolved: communityQuestions.isSolved,
          totalResponses: communityQuestions.totalResponses,
          problemSolvingScore: communityQuestions.problemSolvingScore
        })
        .from(communityQuestions)
        .where(
          and(
            eq(communityQuestions.category, category),
            eq(communityQuestions.isActive, true)
          )
        )
        .orderBy(desc(communityQuestions.problemSolvingScore))
        .limit(limit);

      return relatedQuestions;

    } catch (error) {
      console.error('Error fetching related discussions:', error);
      return [];
    }
  }

  /**
   * Get community insights to help enhance Jarvis responses (without storing private conversations)
   */
  async getCommunityInsights(topic: string): Promise<{ hasPublicDiscussions: boolean; insightCount: number }> {
    try {
      // Check if there are public discussions on this topic
      const results = await db
        .select()
        .from(knowledgeBase)
        .where(
          or(
            like(knowledgeBase.title, `%${topic}%`),
            like(knowledgeBase.processedAnswer, `%${topic}%`)
          )
        )
        .limit(1);

      return {
        hasPublicDiscussions: results.length > 0,
        insightCount: results.length
      };
    } catch (error) {
      console.error('Error getting community insights:', error);
      return { hasPublicDiscussions: false, insightCount: 0 };
    }
  }
}

export const jarvisIntegration = new JarvisIntegrationService();