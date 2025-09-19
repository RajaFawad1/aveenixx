import { questionClassifier } from '../services/questionClassificationService';

/**
 * Examples demonstrating the intelligent question management system
 * This shows how different questions get classified and stored efficiently
 */

console.log('=== INTELLIGENT QUESTION MANAGEMENT SYSTEM DEMO ===\n');

// Example 1: High-value business question
const businessQuestion = "How to integrate Stripe payment gateway with my e-commerce platform to handle recurring subscriptions and failed payments?";
const businessResult = questionClassifier.classifyQuestion(businessQuestion);

console.log('📋 BUSINESS QUESTION:', businessQuestion);
console.log('📊 Classification Result:');
console.log(`   • Problem Solving Score: ${businessResult.problemSolvingScore}/100`);
console.log(`   • Business Value: ${businessResult.businessValue}/100`);
console.log(`   • Community Impact: ${businessResult.communityImpact}/100`);
console.log(`   • Storage Level: ${businessResult.storageLevel.toUpperCase()}`);
console.log(`   • Retention Period: ${businessResult.retentionPeriod} days`);
console.log(`   • Category: ${businessResult.category}`);
console.log(`   • Complexity: ${businessResult.complexity}`);
console.log(`   • Reason: ${businessResult.reason}`);
console.log('');

// Example 2: Low-value personal question
const personalQuestion = "What's your favorite ice cream flavor and why?";
const personalResult = questionClassifier.classifyQuestion(personalQuestion);

console.log('🍦 PERSONAL QUESTION:', personalQuestion);
console.log('📊 Classification Result:');
console.log(`   • Problem Solving Score: ${personalResult.problemSolvingScore}/100`);
console.log(`   • Business Value: ${personalResult.businessValue}/100`);
console.log(`   • Community Impact: ${personalResult.communityImpact}/100`);
console.log(`   • Storage Level: ${personalResult.storageLevel.toUpperCase()}`);
console.log(`   • Retention Period: ${personalResult.retentionPeriod} days`);
console.log(`   • Category: ${personalResult.category}`);
console.log(`   • Complexity: ${personalResult.complexity}`);
console.log(`   • Reason: ${personalResult.reason}`);
console.log('');

// Example 3: Technical troubleshooting question
const technicalQuestion = "My API is returning 500 errors when processing large file uploads. How can I optimize the server configuration to handle files up to 100MB?";
const technicalResult = questionClassifier.classifyQuestion(technicalQuestion);

console.log('🔧 TECHNICAL QUESTION:', technicalQuestion);
console.log('📊 Classification Result:');
console.log(`   • Problem Solving Score: ${technicalResult.problemSolvingScore}/100`);
console.log(`   • Business Value: ${technicalResult.businessValue}/100`);
console.log(`   • Community Impact: ${technicalResult.communityImpact}/100`);
console.log(`   • Storage Level: ${technicalResult.storageLevel.toUpperCase()}`);
console.log(`   • Retention Period: ${technicalResult.retentionPeriod} days`);
console.log(`   • Category: ${technicalResult.category}`);
console.log(`   • Complexity: ${technicalResult.complexity}`);
console.log(`   • Reason: ${technicalResult.reason}`);
console.log('');

// Example 4: Hair loss question - Health category with extended retention
const hairQuestion = "What are the best natural remedies for hair loss and how long does it take to see results?";
const hairResult = questionClassifier.classifyQuestion(hairQuestion);

console.log('💇‍♂️ HAIR LOSS QUESTION (Health Category):', hairQuestion);
console.log('📊 Classification Result:');
console.log(`   • Problem Solving Score: ${hairResult.problemSolvingScore}/100`);
console.log(`   • Business Value: ${hairResult.businessValue}/100`);
console.log(`   • Community Impact: ${hairResult.communityImpact}/100`);
console.log(`   • Storage Level: ${hairResult.storageLevel.toUpperCase()}`);
console.log(`   • Retention Period: ${hairResult.retentionPeriod} days (${Math.round(hairResult.retentionPeriod/365*10)/10} years)`);
console.log(`   • Category: ${hairResult.category}`);
console.log(`   • Complexity: ${hairResult.complexity}`);
console.log(`   • Reason: ${hairResult.reason}`);
console.log('');

// Example 5: Mental health question - Special retention category
const mentalHealthQuestion = "How can I manage work stress and anxiety naturally without medication?";
const mentalHealthResult = questionClassifier.classifyQuestion(mentalHealthQuestion);

console.log('🧠 MENTAL HEALTH QUESTION (Special Retention):', mentalHealthQuestion);
console.log('📊 Classification Result:');
console.log(`   • Problem Solving Score: ${mentalHealthResult.problemSolvingScore}/100`);
console.log(`   • Business Value: ${mentalHealthResult.businessValue}/100`);
console.log(`   • Community Impact: ${mentalHealthResult.communityImpact}/100`);
console.log(`   • Storage Level: ${mentalHealthResult.storageLevel.toUpperCase()}`);
console.log(`   • Retention Period: ${mentalHealthResult.retentionPeriod} days (${Math.round(mentalHealthResult.retentionPeriod/365*10)/10} years)`);
console.log(`   • Category: ${mentalHealthResult.category}`);
console.log(`   • Complexity: ${mentalHealthResult.complexity}`);
console.log(`   • Reason: ${mentalHealthResult.reason}`);
console.log('');

console.log('=== STORAGE STRATEGY SUMMARY ===');
console.log(`
🗄️  FULL STORAGE (High Value - 2 years retention):
   ✓ Business/technical questions with problem-solving potential
   ✓ Rich metadata, full text search, cross-platform distribution
   ✓ Example: Stripe integration, API troubleshooting

📋 SUMMARY STORAGE (Medium Value - 1 year retention):
   ✓ Moderately useful questions with some community value
   ✓ Text summary stored, media/images linked externally
   ✓ Example: Hair loss remedies (helpful but not business-critical)

🔗 REFERENCE STORAGE (Low Value - 3 months retention):
   ✓ Minimal value but potentially useful
   ✓ Basic text only, external links to full content
   ✓ Quick cleanup, resource-efficient

🗑️  DISCARD STORAGE (Very Low Value - 1 week retention):
   ✓ Personal preferences, off-topic content
   ✓ Auto-cleanup after short period
   ✓ Example: Ice cream preferences

💡 RESOURCE EFFICIENCY:
   • High-value content: Full database storage + search indexing
   • Medium-value: Core text + external media links  
   • Low-value: Text references + cleanup automation
   • Very low-value: Minimal storage + auto-deletion

🔍 SEARCH OPTIMIZATION:
   • AI-processed keywords for fast searches
   • Related question linking
   • Confidence scoring for result ranking
   • Usage analytics for continuous improvement
`);

export { businessResult, personalResult, technicalResult, hairResult };