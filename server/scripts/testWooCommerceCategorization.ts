#!/usr/bin/env tsx

/**
 * Test WooCommerce Categorization
 * This script tests the WooCommerce product categorization system
 */

import { WooCommerceService } from '../services/woocommerce.js';
import { wooCommerceCategoryMapper } from '../services/woocommerceCategoryMapper.js';

async function testWooCommerceCategorization() {
  console.log('🧪 Testing WooCommerce categorization system...');
  
  try {
    const wooService = new WooCommerceService();
    
    // Test 1: Fetch WooCommerce categories
    console.log('\n📋 Test 1: Fetching WooCommerce categories...');
    const categories = await wooService.fetchCategories();
    console.log(`Found ${categories.length} WooCommerce categories:`);
    categories.slice(0, 5).forEach(cat => {
      console.log(`  - ${cat.name} (${cat.count} products)`);
    });
    
    // Test 2: Test category mapping
    console.log('\n🗺️ Test 2: Testing category mapping...');
    const testCategories = [
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Health & Beauty',
      'Sports & Outdoors'
    ];
    
    for (const categoryName of testCategories) {
      const mapping = await wooCommerceCategoryMapper.mapWooCommerceCategory(
        categoryName,
        categoryName.toLowerCase().replace(/\s+/g, '-'),
        `Test ${categoryName} Product`,
        `This is a test product in the ${categoryName} category`
      );
      
      console.log(`  ${categoryName} → ${mapping.aveenixCategory} (${mapping.confidence}% confidence, ${mapping.mappingSource})`);
    }
    
    // Test 3: Fetch and categorize sample products
    console.log('\n🛍️ Test 3: Fetching and categorizing sample products...');
    const products = await wooService.fetchProducts(1, 5);
    
    for (const product of products) {
      console.log(`\nProduct: ${product.name}`);
      console.log(`  WooCommerce Categories: ${product.categories.map(c => c.name).join(', ')}`);
      
      const transformed = await wooService.transformToAveenixProduct(product);
      console.log(`  Mapped to: ${transformed.category}`);
      console.log(`  Confidence: ${transformed.categoryConfidenceScore}%`);
      console.log(`  Mapping Source: ${transformed.categoryMappingSource}`);
      
      if (transformed.wooCommerceCategories) {
        console.log(`  WooCommerce Categories: ${transformed.wooCommerceCategories.map(c => c.name).join(', ')}`);
      }
    }
    
    console.log('\n✅ WooCommerce categorization testing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing WooCommerce categorization:', error);
    throw error;
  }
}

// Run the test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testWooCommerceCategorization()
    .then(() => {
      console.log('🎉 Testing complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Testing failed:', error);
      process.exit(1);
    });
}

export { testWooCommerceCategorization };
