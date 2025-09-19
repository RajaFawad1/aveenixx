#!/usr/bin/env node

// Comprehensive Feature Testing Script for AVEENIX Product Management
// Tests all four core features: Import, Products, Product Types, Categories

const BASE_URL = 'http://localhost:5000';

async function testAPI(endpoint, description) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    return { success: true, data, description };
  } catch (error) {
    return { success: false, error: error.message, description };
  }
}

async function runComprehensiveTests() {
  console.log('🚀 AVEENIX COMPREHENSIVE FEATURE TESTING\n');
  
  // 1. IMPORT FUNCTIONALITY TESTS
  console.log('=== 1. IMPORT FUNCTIONALITY ===');
  
  const wooConnectionTest = await testAPI('/api/woocommerce/test', 'WooCommerce Connection');
  console.log(`✓ WooCommerce Connection: ${wooConnectionTest.success ? 'WORKING' : 'FAILED'}`);
  
  const wooProductsTest = await testAPI('/api/woocommerce/products', 'WooCommerce Products Fetch');
  console.log(`✓ WooCommerce Products: ${wooProductsTest.success ? `${wooProductsTest.data.length} products available` : 'FAILED'}`);
  
  const importedIdsTest = await testAPI('/api/woocommerce/imported-ids', 'Imported IDs Tracking');
  console.log(`✓ Import Tracking: ${importedIdsTest.success ? `${importedIdsTest.data.importedIds.length} products tracked` : 'FAILED'}`);
  
  // 2. PRODUCTS FUNCTIONALITY TESTS
  console.log('\n=== 2. PRODUCTS FUNCTIONALITY ===');
  
  const overviewTest = await testAPI('/api/product-management/overview', 'Products Overview');
  if (overviewTest.success) {
    const stats = overviewTest.data;
    console.log(`✓ Total Products: ${stats.totalProducts}`);
    console.log(`✓ Pending: ${stats.pendingProducts}`);
    console.log(`✓ Approved: ${stats.approvedProducts}`);
    console.log(`✓ Published: ${stats.publishedProducts}`);
    console.log(`✓ Rejected: ${stats.rejectedProducts}`);
  } else {
    console.log('✗ Products Overview: FAILED');
  }
  
  const pendingTest = await testAPI('/api/product-management/products?status=pending', 'Pending Products');
  console.log(`✓ Pending Products Query: ${pendingTest.success ? `${pendingTest.data.length} products` : 'FAILED'}`);
  
  const publishedTest = await testAPI('/api/product-management/products?status=published', 'Published Products');
  console.log(`✓ Published Products Query: ${publishedTest.success ? `${publishedTest.data.length} products` : 'FAILED'}`);
  
  // 3. PRODUCT TYPES FUNCTIONALITY TESTS
  console.log('\n=== 3. PRODUCT TYPES FUNCTIONALITY ===');
  
  const allProductsForTypes = await testAPI('/api/product-management/products', 'All Products for Type Analysis');
  if (allProductsForTypes.success) {
    const products = allProductsForTypes.data;
    const typeStats = {};
    
    products.forEach(product => {
      const type = product.productType || 'undefined';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });
    
    console.log('✓ Product Type Distribution:');
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} products`);
    });
    
    // Check if we have proper type classification
    const hasTypes = Object.keys(typeStats).filter(type => type !== 'undefined' && type !== 'null').length > 0;
    console.log(`✓ Type Classification: ${hasTypes ? 'WORKING' : 'NEEDS IMPROVEMENT'}`);
  } else {
    console.log('✗ Product Types Analysis: FAILED');
  }
  
  // 4. CATEGORIES FUNCTIONALITY TESTS
  console.log('\n=== 4. CATEGORIES FUNCTIONALITY ===');
  
  const masterCategoriesTest = await testAPI('/api/categories/master', 'Master Categories');
  console.log(`✓ Master Categories: ${masterCategoriesTest.success ? `${masterCategoriesTest.data.length} categories` : 'FAILED'}`);
  
  const subcategoriesTest = await testAPI('/api/subcategories', 'Subcategories');
  console.log(`✓ Subcategories: ${subcategoriesTest.success ? `${subcategoriesTest.data.length} subcategories` : 'FAILED'}`);
  
  const categoryCountsTest = await testAPI('/api/categories/master-with-counts', 'Categories with Product Counts');
  if (categoryCountsTest.success && categoryCountsTest.data.length > 0) {
    console.log('✓ Category Product Counts:');
    categoryCountsTest.data.slice(0, 5).forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.productCount || 0} products`);
    });
  } else {
    console.log('✗ Category Product Counts: FAILED');
  }
  
  // 5. INTEGRATION TESTS
  console.log('\n=== 5. INTEGRATION TESTS ===');
  
  // Test if products have proper category assignments
  if (allProductsForTypes.success) {
    const products = allProductsForTypes.data;
    const categorizedProducts = products.filter(p => p.category && p.category !== 'Uncategorized');
    const categorizationRate = (categorizedProducts.length / products.length * 100).toFixed(1);
    
    console.log(`✓ Product Categorization: ${categorizationRate}% (${categorizedProducts.length}/${products.length})`);
    
    // Test if products have proper source platform
    const wooProducts = products.filter(p => p.sourcePlatform === 'woocommerce');
    console.log(`✓ WooCommerce Integration: ${wooProducts.length} products from WooCommerce`);
    
    // Test workflow states
    const workflowStates = {
      pending: products.filter(p => p.approvalStatus === 'pending').length,
      approved: products.filter(p => p.approvalStatus === 'approved').length,
      published: products.filter(p => p.approvalStatus === 'published').length,
      rejected: products.filter(p => p.approvalStatus === 'rejected').length
    };
    
    console.log('✓ Workflow States:');
    Object.entries(workflowStates).forEach(([state, count]) => {
      console.log(`  - ${state}: ${count} products`);
    });
  }
  
  // FINAL ASSESSMENT
  console.log('\n=== FINAL ASSESSMENT ===');
  const tests = [
    wooConnectionTest.success,
    wooProductsTest.success,
    overviewTest.success,
    pendingTest.success,
    publishedTest.success,
    allProductsForTypes.success,
    masterCategoriesTest.success,
    subcategoriesTest.success
  ];
  
  const passedTests = tests.filter(Boolean).length;
  const totalTests = tests.length;
  const successRate = (passedTests / totalTests * 100).toFixed(1);
  
  console.log(`\n🎯 Overall Success Rate: ${successRate}% (${passedTests}/${totalTests} tests passed)`);
  
  if (successRate >= 90) {
    console.log('🎉 EXCELLENT: All core features are working properly with live data!');
  } else if (successRate >= 75) {
    console.log('⚠️  GOOD: Most features working, minor issues to address');
  } else {
    console.log('❌ NEEDS WORK: Several critical issues need attention');
  }
}

// Run the tests
runComprehensiveTests().catch(console.error);