// Script to populate category icons in the database
import { db } from '../db';
import { categories } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Icon mapping for main categories based on category names
const categoryIconMapping: { [key: string]: string } = {
  'Electronics & Technology': 'zap',
  'Electronics': 'zap',
  'Technology': 'zap',
  'Fashion & Apparel': 'shirt',
  'Fashion': 'shirt',
  'Apparel': 'shirt',
  'Clothing': 'shirt',
  'Home & Garden': 'home',
  'Home': 'home',
  'Garden': 'layers',
  'Sports & Outdoors': 'dumbbell',
  'Sports & Fitness': 'dumbbell',
  'Sports': 'dumbbell',
  'Fitness': 'dumbbell',
  'Outdoor': 'dumbbell',
  'Outdoors': 'dumbbell',
  'Automotive': 'car',
  'Auto': 'car',
  'Car': 'car',
  'Vehicle': 'car',
  'Books & Media': 'book',
  'Books': 'book',
  'Media': 'book',
  'Reading': 'book',
  'Health & Beauty': 'heart',
  'Health': 'heart',
  'Beauty': 'heart',
  'Wellness': 'heart',
  'Toys & Games': 'baby',
  'Toys': 'baby',
  'Games': 'baby',
  'Gaming': 'baby',
  'Jewelry & Accessories': 'trophy',
  'Jewelry': 'trophy',
  'Accessories': 'trophy',
  'Pet Supplies': 'heart',
  'Pet': 'heart',
  'Office & Business': 'briefcase',
  'Office': 'briefcase',
  'Business': 'briefcase',
  'Work': 'briefcase',
  'Arts & Crafts': 'flame',
  'Arts': 'flame',
  'Crafts': 'flame',
  'Creative': 'flame',
  'Food & Beverages': 'utensils',
  'Food': 'utensils',
  'Beverages': 'utensils',
  'Drinks': 'utensils',
  'Tools & Hardware': 'layers',
  'Tools': 'layers',
  'Hardware': 'layers',
  'Equipment': 'layers',
  'Industrial & Scientific': 'zap',
  'Industrial': 'zap',
  'Scientific': 'zap',
  'Musical Instruments': 'heart',
  'Musical': 'heart',
  'Instruments': 'heart',
  'Baby & Kids': 'baby',
  'Baby': 'baby',
  'Kids': 'baby',
  'Children': 'baby',
  'Travel & Luggage': 'backpack',
  'Travel': 'backpack',
  'Luggage': 'backpack',
  'Bags': 'backpack',
  'Collectibles & Antiques': 'trophy',
  'Collectibles': 'trophy',
  'Antiques': 'trophy',
  'Party & Events': 'flame',
  'Party': 'flame',
  'Events': 'flame',
  'Religious & Spiritual': 'heart',
  'Religious': 'heart',
  'Spiritual': 'heart'
};

// Subcategory icon mapping
const subcategoryIconMapping: { [key: string]: string } = {
  // Electronics subcategories
  'Smartphones': 'smartphone',
  'Mobile Phones': 'smartphone',
  'Laptops & Computers': 'laptop',
  'Laptops': 'laptop',
  'Computers': 'laptop',
  'Gaming Consoles': 'baby',
  'Gaming': 'baby',
  'Headphones & Audio': 'headphones',
  'Headphones': 'headphones',
  'Audio': 'headphones',
  'Photography': 'camera',
  'Cameras': 'camera',
  'Technology': 'zap',
  'Car Electronics': 'zap',
  
  // Fashion subcategories
  'Men\'s Clothing': 'shirt',
  'Women\'s Clothing': 'shirt',
  'Shoes': 'shirt',
  'Footwear': 'shirt',
  'Watches': 'trophy',
  'Sunglasses': 'heart',
  'Activewear': 'dumbbell',
  
  // Home subcategories
  'Home Improvement': 'home',
  'Furniture': 'home',
  'Kitchen & Dining': 'utensils',
  'Kitchen': 'utensils',
  'Appliances': 'home',
  'Bedding': 'home',
  'Bath': 'home',
  'Garden & Outdoor': 'layers',
  'Storage': 'home',
  'Lighting': 'zap',
  
  // Sports subcategories
  'Exercise & Fitness': 'dumbbell',
  'Sports & Recreation': 'dumbbell',
  'Outdoor Activities': 'dumbbell',
  
  // Health & Beauty
  'Skincare': 'heart',
  'Beauty & Personal Care': 'heart',
  'Health & Wellness': 'heart',
  'Makeup': 'heart',
  'Hair Care': 'heart',
  'Personal Care': 'heart',
  'Vitamins': 'heart',
  'Medical': 'heart',
  
  // Auto
  'Car Accessories': 'car',
  'Car Care': 'car',
  'Motorcycle': 'car',
  'Auto Parts': 'car',
  'Tires': 'car',
  
  // Office & Business
  'Office Supplies': 'briefcase',
  'Office Furniture': 'briefcase',
  'Business Equipment': 'briefcase',
  
  // Tools & Hardware
  'Hand Tools': 'layers',
  'Power Tools': 'layers',
  'Hardware': 'layers',
  
  // Baby & Kids
  'Action Figures': 'baby',
  'Board Games': 'baby',
  'Educational': 'baby',
  'Dolls': 'baby',
  'Building Sets': 'baby',
  'Outdoor Play': 'baby',
  
  // Books & Media
  'E-books': 'book',
  'Audiobooks': 'book',
  'Movies': 'camera',
  'Music': 'heart',
  'Magazines': 'book',
};

// Function to determine icon for a category
function getIconForCategory(categoryName: string, isSubcategory = false): string {
  const mapping = isSubcategory ? subcategoryIconMapping : categoryIconMapping;
  
  // Direct match
  if (mapping[categoryName]) {
    return mapping[categoryName];
  }
  
  // Partial matches
  for (const [key, icon] of Object.entries(mapping)) {
    if (categoryName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(categoryName.toLowerCase())) {
      return icon;
    }
  }
  
  // Default fallback
  return 'layers';
}

async function populateCategoryIcons() {
  try {
    console.log('Starting category icon population...');
    
    // Get all categories
    const allCategories = await db.select().from(categories);
    console.log(`Found ${allCategories.length} categories to update`);
    
    let updatedCount = 0;
    
    for (const category of allCategories) {
      const isSubcategory = category.parentId !== null;
      const iconName = getIconForCategory(category.name, isSubcategory);
      
      // Update the category with the icon
      await db.update(categories)
        .set({ icon: iconName })
        .where(eq(categories.id, category.id));
      
      console.log(`Updated "${category.name}" with icon "${iconName}" (${isSubcategory ? 'subcategory' : 'main category'})`);
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} categories with icons`);
    console.log('Category icon population completed!');
    
  } catch (error) {
    console.error('Error populating category icons:', error);
  }
}

export { populateCategoryIcons, getIconForCategory };

// Run the script if called directly
populateCategoryIcons().then(() => {
  console.log('Script finished');
  process.exit(0);
});