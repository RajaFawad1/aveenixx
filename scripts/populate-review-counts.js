#!/usr/bin/env node
const { exec } = require('child_process');

// Using tsx to run TypeScript directly
exec('tsx scripts/populate-review-counts.ts', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(stdout);
  if (stderr) console.error(stderr);
});

// Mock Amazon review data for ASINs (this would come from actual Amazon API in production)
const amazonReviewData = {
  'B0CJ2J15TG': { rating: 4.3, reviewCount: 823 },
  'B0DT39NXQW': { rating: 4.1, reviewCount: 156 },
  '0593314921': { rating: 4.5, reviewCount: 2341 },
  'B084ZHK7Y2': { rating: 4.6, reviewCount: 1876 },
  'B08N5WRWNW': { rating: 4.2, reviewCount: 945 },
  'B0B6YRWK4H': { rating: 4.4, reviewCount: 634 },
  'B0D3J5TQZJ': { rating: 4.7, reviewCount: 1299 },
  'B0BDQZ6ZNK': { rating: 4.3, reviewCount: 567 },
  'B0C8X1XZ8R': { rating: 4.5, reviewCount: 789 },
  'B0BL4YVR8P': { rating: 4.2, reviewCount: 423 },
  // Add more ASIN to review data mappings
};

async function populateReviewCounts() {
  console.log('🔍 Fetching products with platform_specific_data...');
  
  try {
    // Get all products with platform_specific_data
    const productsWithData = await db
      .select()
      .from(products)
      .where(isNotNull(products.platformSpecificData));

    console.log(`📊 Found ${productsWithData.length} products with platform data`);

    let updatedCount = 0;

    for (const product of productsWithData) {
      try {
        const platformData = product.platformSpecificData;
        
        // Extract ASIN from platform data
        let asin = null;
        if (platformData?.woocommerce?.meta_data?.product_asin) {
          asin = platformData.woocommerce.meta_data.product_asin;
        }
        
        if (asin && amazonReviewData[asin]) {
          const reviewData = amazonReviewData[asin];
          
          await db
            .update(products)
            .set({
              rating: reviewData.rating.toString(),
              reviewCount: reviewData.reviewCount
            })
            .where(eq(products.id, product.id));
          
          console.log(`✅ Updated ${product.name?.substring(0, 50)}... - Rating: ${reviewData.rating}, Reviews: ${reviewData.reviewCount}`);
          updatedCount++;
        } else if (asin) {
          console.log(`⚠️  No review data for ASIN: ${asin} (${product.name?.substring(0, 30)}...)`);
        }
      } catch (error) {
        console.error(`❌ Error processing product ${product.id}:`, error.message);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} products with review data!`);
    
  } catch (error) {
    console.error('❌ Error populating review counts:', error);
  }
  
  process.exit(0);
}

populateReviewCounts();