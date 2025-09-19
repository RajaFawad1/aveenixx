#!/usr/bin/env tsx

/**
 * Initialize WooCommerce Category Mappings
 * This script sets up the WooCommerce category mappings in the database
 */

import { wooCommerceCategoryMapper } from '../services/woocommerceCategoryMapper.js';
import { hybridCategoryMappingService } from '../services/hybridCategoryMappingService.js';

async function initializeWooCommerceMappings() {
  console.log('🚀 Starting WooCommerce category mapping initialization...');
  
  try {
    // Initialize hybrid category mappings first
    console.log('📋 Initializing hybrid category mappings...');
    await hybridCategoryMappingService.initializeHybridMappings();
    
    // Initialize WooCommerce specific mappings
    console.log('🛒 Initializing WooCommerce category mappings...');
    await wooCommerceCategoryMapper.initializePlatformMappings();
    
    // Get mapping statistics
    const stats = await wooCommerceCategoryMapper.getMappingStats();
    console.log('📊 Mapping Statistics:');
    console.log(`  - Total Mappings: ${stats.totalMappings}`);
    console.log(`  - Categories with Mappings: ${stats.categoriesWithMappings}`);
    console.log(`  - Average Confidence: ${stats.averageConfidence}%`);
    
    console.log('✅ WooCommerce category mapping initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing WooCommerce category mappings:', error);
    process.exit(1);
  }
}

// Run the initialization if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeWooCommerceMappings()
    .then(() => {
      console.log('🎉 Initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

export { initializeWooCommerceMappings };
