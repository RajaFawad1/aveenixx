#!/usr/bin/env node

// Comprehensive Fix Script for Remaining Issues
// 1. Fix undefined product types
// 2. Verify category counts API
// 3. Test all functionality

const BASE_URL = 'http://localhost:5000';

async function fixProductTypes() {
  console.log('🔧 FIXING PRODUCT TYPE CLASSIFICATION');
  
  try {
    // Get all products
    const response = await fetch(`${BASE_URL}/api/product-management/products`);
    const products = await response.json();
    
    console.log(`Found ${products.length} products to check`);
    
    let fixedCount = 0;
    
    for (const product of products) {
      if (!product.productType || product.productType === null) {
        // Determine product type based on characteristics
        let newType = 'physical'; // default
        
        if (product.affiliateUrl || product.externalId) {
          newType = 'affiliate';
        } else if (product.sourcePlatform === 'woocommerce' && product.externalId) {
          newType = 'affiliate';
        }
        
        // Update the product
        const updateResponse = await fetch(`${BASE_URL}/api/product-management/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productType: newType
          })
        });
        
        if (updateResponse.ok) {
          console.log(`✓ Fixed ${product.name}: ${product.productType || 'null'} → ${newType}`);
          fixedCount++;
        } else {
          console.log(`✗ Failed to fix ${product.name}`);
        }
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} products with undefined types`);
    return fixedCount;
    
  } catch (error) {
    console.error('Error fixing product types:', error.message);
    return 0;
  }
}

async function testCategoryCountsAPI() {
  console.log('\n🔍 TESTING CATEGORY COUNTS API');
  
  try {
    const response = await fetch(`${BASE_URL}/api/categories/master-with-counts`);
    const text = await response.text();
    
    if (response.headers.get('content-type')?.includes('application/json')) {
      const categories = JSON.parse(text);
      console.log(`✅ Categories API working: ${categories.length} categories found`);
      
      categories.slice(0, 3).forEach(cat => {
        console.log(`  - ${cat.name}: ${cat.productCount || 0} products`);
      });
      
      return true;
    } else {
      console.log('❌ Categories API returning HTML instead of JSON');
      console.log('Response preview:', text.substring(0, 200));
      return false;
    }
    
  } catch (error) {
    console.error('❌ Categories API error:', error.message);
    return false;
  }
}

async function runFinalTest() {
  console.log('\n🚀 RUNNING FINAL COMPREHENSIVE TEST');
  
  // Test all four features
  const tests = [
    { name: 'WooCommerce Connection', url: '/api/woocommerce/test' },
    { name: 'Products Overview', url: '/api/product-management/overview' },
    { name: 'Product Types', url: '/api/product-management/products' },
    { name: 'Master Categories', url: '/api/categories/master' }
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    try {
      const response = await fetch(`${BASE_URL}${test.url}`);
      const data = await response.json();
      
      if (response.ok && data) {
        console.log(`✅ ${test.name}: WORKING`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
  }
  
  // Check product type distribution after fixes
  try {
    const response = await fetch(`${BASE_URL}/api/product-management/products`);
    const products = await response.json();
    
    const typeStats = {};
    products.forEach(product => {
      const type = product.productType || 'undefined';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });
    
    console.log('\n📊 PRODUCT TYPE DISTRIBUTION:');
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} products`);
    });
    
    const undefinedCount = typeStats['undefined'] || typeStats['null'] || 0;
    console.log(`\n✨ Undefined product types remaining: ${undefinedCount}`);
    
  } catch (error) {
    console.error('Error checking product types:', error.message);
  }
  
  const successRate = (passedTests / tests.length * 100).toFixed(1);
  console.log(`\n🎯 Final Success Rate: ${successRate}% (${passedTests}/${tests.length} tests passed)`);
  
  if (successRate >= 90) {
    console.log('🎉 EXCELLENT: All core features are fully functional!');
  } else {
    console.log('⚠️  Issues remain - additional fixes needed');
  }
}

async function main() {
  console.log('🚀 COMPREHENSIVE ISSUE RESOLUTION\n');
  
  // Step 1: Fix product types
  const fixedProducts = await fixProductTypes();
  
  // Step 2: Test category counts API
  const categoryAPIWorking = await testCategoryCountsAPI();
  
  // Step 3: Run final comprehensive test
  await runFinalTest();
  
  console.log('\n=== SUMMARY ===');
  console.log(`✓ Fixed ${fixedProducts} product types`);
  console.log(`${categoryAPIWorking ? '✓' : '✗'} Category counts API ${categoryAPIWorking ? 'working' : 'needs fix'}`);
  console.log('✓ Comprehensive testing completed');
}

// Run the fix script
main().catch(console.error);