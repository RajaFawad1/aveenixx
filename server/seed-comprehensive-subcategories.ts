import { db } from "./db";
import { categories } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Comprehensive subcategory mapping for all 22 main categories
const COMPREHENSIVE_SUBCATEGORIES = {
  "Electronics & Technology": [
    { name: "Smartphones", slug: "smartphones", icon: "Smartphone" },
    { name: "Laptops & Computers", slug: "laptops-computers", icon: "Laptop" },
    { name: "Headphones & Audio", slug: "headphones-audio", icon: "Headphones" },
    { name: "Cameras & Photography", slug: "cameras-photography", icon: "Camera" },
    { name: "Smart TVs & Displays", slug: "smart-tvs-displays", icon: "Tv" },
    { name: "Wearables & Smartwatches", slug: "wearables-smartwatches", icon: "Watch" },
    { name: "Gaming Consoles", slug: "gaming-consoles", icon: "Gamepad2" },
    { name: "Tablets & E-readers", slug: "tablets-ereaders", icon: "Tablet" },
    { name: "Smart Home Devices", slug: "smart-home-devices", icon: "Home" },
    { name: "Computer Accessories", slug: "computer-accessories", icon: "Mouse" },
    { name: "Mobile Accessories", slug: "mobile-accessories", icon: "Smartphone" },
    { name: "Networking & WiFi", slug: "networking-wifi", icon: "Wifi" }
  ],
  
  "Fashion & Apparel": [
    { name: "Women's Clothing", slug: "womens-clothing", icon: "Shirt" },
    { name: "Men's Clothing", slug: "mens-clothing", icon: "Shirt" },
    { name: "Shoes", slug: "shoes", icon: "Footprints" },
    { name: "Bags & Handbags", slug: "bags-handbags", icon: "ShoppingBag" },
    { name: "Watches", slug: "watches", icon: "Clock" },
    { name: "Sunglasses", slug: "sunglasses", icon: "Sunglasses" },
    { name: "Activewear", slug: "activewear", icon: "Activity" },
    { name: "Formal Wear", slug: "formal-wear", icon: "Crown" },
    { name: "Underwear & Lingerie", slug: "underwear-lingerie", icon: "Heart" },
    { name: "Kids' Clothing", slug: "kids-clothing", icon: "Baby" }
  ],

  "Home & Garden": [
    { name: "Furniture", slug: "furniture", icon: "Armchair" },
    { name: "Kitchen Appliances", slug: "kitchen-appliances", icon: "ChefHat" },
    { name: "Home Decor", slug: "home-decor", icon: "Palette" },
    { name: "Bedding & Bath", slug: "bedding-bath", icon: "Bed" },
    { name: "Garden & Outdoor", slug: "garden-outdoor", icon: "Trees" },
    { name: "Tools & Hardware", slug: "tools-hardware", icon: "Wrench" },
    { name: "Lighting", slug: "lighting", icon: "Lightbulb" },
    { name: "Storage & Organization", slug: "storage-organization", icon: "Archive" },
    { name: "Cleaning Supplies", slug: "cleaning-supplies", icon: "SparkleIcon" },
    { name: "Smart Home", slug: "smart-home", icon: "Home" }
  ],

  "Health & Beauty": [
    { name: "Skincare", slug: "skincare", icon: "Sparkles" },
    { name: "Makeup", slug: "makeup", icon: "Palette" },
    { name: "Hair Care", slug: "hair-care", icon: "Scissors" },
    { name: "Fragrances", slug: "fragrances", icon: "Flower" },
    { name: "Personal Care", slug: "personal-care", icon: "User" },
    { name: "Health Supplements", slug: "health-supplements", icon: "Pill" },
    { name: "Fitness Equipment", slug: "fitness-equipment", icon: "Dumbbell" },
    { name: "Medical Devices", slug: "medical-devices", icon: "Stethoscope" },
    { name: "Oral Care", slug: "oral-care", icon: "Smile" },
    { name: "Men's Grooming", slug: "mens-grooming", icon: "User" }
  ],

  "Sports & Outdoors": [
    { name: "Exercise & Fitness", slug: "exercise-fitness", icon: "Activity" },
    { name: "Outdoor Recreation", slug: "outdoor-recreation", icon: "Mountain" },
    { name: "Team Sports", slug: "team-sports", icon: "Users" },
    { name: "Water Sports", slug: "water-sports", icon: "Waves" },
    { name: "Cycling", slug: "cycling", icon: "Bike" },
    { name: "Running", slug: "running", icon: "Zap" },
    { name: "Camping & Hiking", slug: "camping-hiking", icon: "Tent" },
    { name: "Winter Sports", slug: "winter-sports", icon: "Snowflake" },
    { name: "Golf", slug: "golf", icon: "Target" },
    { name: "Hunting & Fishing", slug: "hunting-fishing", icon: "Fish" }
  ],

  "Automotive": [
    { name: "Car Accessories", slug: "car-accessories", icon: "Car" },
    { name: "Car Electronics", slug: "car-electronics", icon: "Radio" },
    { name: "Motorcycle", slug: "motorcycle", icon: "Bike" },
    { name: "Car Care", slug: "car-care", icon: "Droplets" },
    { name: "Tools & Equipment", slug: "auto-tools-equipment", icon: "Wrench" },
    { name: "Parts & Components", slug: "parts-components", icon: "Cog" },
    { name: "Tires & Wheels", slug: "tires-wheels", icon: "Circle" },
    { name: "Interior Accessories", slug: "interior-accessories", icon: "Car" },
    { name: "Exterior Accessories", slug: "exterior-accessories", icon: "Car" }
  ],

  "Books & Media": [
    { name: "Fiction", slug: "fiction", icon: "Book" },
    { name: "Non-Fiction", slug: "non-fiction", icon: "BookOpen" },
    { name: "Children's Books", slug: "childrens-books", icon: "Baby" },
    { name: "Educational", slug: "educational", icon: "GraduationCap" },
    { name: "Movies & TV", slug: "movies-tv", icon: "Film" },
    { name: "Music", slug: "music", icon: "Music" },
    { name: "Magazines", slug: "magazines", icon: "Newspaper" },
    { name: "E-books", slug: "ebooks", icon: "Tablet" },
    { name: "Audiobooks", slug: "audiobooks", icon: "Headphones" }
  ],

  "Toys & Games": [
    { name: "Action Figures", slug: "action-figures", icon: "Users" },
    { name: "Board Games", slug: "board-games", icon: "Gamepad2" },
    { name: "Educational Toys", slug: "educational-toys", icon: "GraduationCap" },
    { name: "Dolls & Accessories", slug: "dolls-accessories", icon: "Heart" },
    { name: "Building Sets", slug: "building-sets", icon: "Blocks" },
    { name: "Video Games", slug: "video-games", icon: "Gamepad2" },
    { name: "Outdoor Toys", slug: "outdoor-toys", icon: "Sun" },
    { name: "Arts & Crafts", slug: "toy-arts-crafts", icon: "Palette" },
    { name: "Puzzles", slug: "puzzles", icon: "Puzzle" },
    { name: "Remote Control", slug: "remote-control", icon: "Radio" }
  ],

  "Food & Beverages": [
    { name: "Snacks", slug: "snacks", icon: "Cookie" },
    { name: "Beverages", slug: "beverages", icon: "Coffee" },
    { name: "Organic Foods", slug: "organic-foods", icon: "Leaf" },
    { name: "Gourmet Foods", slug: "gourmet-foods", icon: "ChefHat" },
    { name: "Health Foods", slug: "health-foods", icon: "Apple" },
    { name: "International Foods", slug: "international-foods", icon: "Globe" },
    { name: "Baking Supplies", slug: "baking-supplies", icon: "Cookie" },
    { name: "Condiments & Sauces", slug: "condiments-sauces", icon: "Droplets" },
    { name: "Tea & Coffee", slug: "tea-coffee", icon: "Coffee" }
  ],

  "Office & Business": [
    { name: "Office Supplies", slug: "office-supplies", icon: "Briefcase" },
    { name: "Office Furniture", slug: "office-furniture", icon: "Armchair" },
    { name: "Technology", slug: "office-technology", icon: "Monitor" },
    { name: "Filing & Storage", slug: "filing-storage", icon: "FolderOpen" },
    { name: "Writing Instruments", slug: "writing-instruments", icon: "Pen" },
    { name: "Presentation", slug: "presentation", icon: "Presentation" },
    { name: "Shipping & Packaging", slug: "shipping-packaging", icon: "Package" },
    { name: "Safety & Security", slug: "safety-security", icon: "Shield" },
    { name: "Cleaning & Janitorial", slug: "cleaning-janitorial", icon: "SparkleIcon" }
  ],

  "Arts & Crafts": [
    { name: "Drawing & Painting", slug: "drawing-painting", icon: "Palette" },
    { name: "Crafting Materials", slug: "crafting-materials", icon: "Scissors" },
    { name: "Sewing & Textiles", slug: "sewing-textiles", icon: "Shirt" },
    { name: "Jewelry Making", slug: "jewelry-making", icon: "Diamond" },
    { name: "Scrapbooking", slug: "scrapbooking", icon: "Book" },
    { name: "Knitting & Crochet", slug: "knitting-crochet", icon: "Heart" },
    { name: "Woodworking", slug: "woodworking", icon: "Trees" },
    { name: "Photography", slug: "arts-photography", icon: "Camera" },
    { name: "Pottery & Ceramics", slug: "pottery-ceramics", icon: "Circle" }
  ],

  "Pet Supplies": [
    { name: "Dog Supplies", slug: "dog-supplies", icon: "Dog" },
    { name: "Cat Supplies", slug: "cat-supplies", icon: "Cat" },
    { name: "Fish & Aquatic", slug: "fish-aquatic", icon: "Fish" },
    { name: "Bird Supplies", slug: "bird-supplies", icon: "Bird" },
    { name: "Small Animals", slug: "small-animals", icon: "Rabbit" },
    { name: "Pet Food", slug: "pet-food", icon: "Bowl" },
    { name: "Pet Toys", slug: "pet-toys", icon: "Bone" },
    { name: "Pet Health", slug: "pet-health", icon: "Heart" },
    { name: "Pet Grooming", slug: "pet-grooming", icon: "Scissors" }
  ],

  "Baby & Kids": [
    { name: "Baby Clothing", slug: "baby-clothing", icon: "Baby" },
    { name: "Baby Gear", slug: "baby-gear", icon: "ShoppingCart" },
    { name: "Baby Food", slug: "baby-food", icon: "Milk" },
    { name: "Diapers & Wipes", slug: "diapers-wipes", icon: "Baby" },
    { name: "Baby Safety", slug: "baby-safety", icon: "Shield" },
    { name: "Strollers & Car Seats", slug: "strollers-car-seats", icon: "Car" },
    { name: "Baby Toys", slug: "baby-toys", icon: "Toy" },
    { name: "Nursery Decor", slug: "nursery-decor", icon: "Home" },
    { name: "Maternity", slug: "maternity", icon: "Heart" }
  ],

  "Jewelry & Accessories": [
    { name: "Fine Jewelry", slug: "fine-jewelry", icon: "Diamond" },
    { name: "Fashion Jewelry", slug: "fashion-jewelry", icon: "Gem" },
    { name: "Watches", slug: "jewelry-watches", icon: "Clock" },
    { name: "Earrings", slug: "earrings", icon: "Circle" },
    { name: "Necklaces", slug: "necklaces", icon: "Heart" },
    { name: "Bracelets", slug: "bracelets", icon: "Circle" },
    { name: "Rings", slug: "rings", icon: "Circle" },
    { name: "Wedding Jewelry", slug: "wedding-jewelry", icon: "Heart" },
    { name: "Men's Jewelry", slug: "mens-jewelry", icon: "User" }
  ],

  "Tools & Hardware": [
    { name: "Power Tools", slug: "power-tools", icon: "Zap" },
    { name: "Hand Tools", slug: "hand-tools", icon: "Wrench" },
    { name: "Hardware", slug: "hardware", icon: "Nut" },
    { name: "Tool Storage", slug: "tool-storage", icon: "Archive" },
    { name: "Electrical", slug: "electrical", icon: "Zap" },
    { name: "Plumbing", slug: "plumbing", icon: "Droplets" },
    { name: "Safety Equipment", slug: "safety-equipment", icon: "Shield" },
    { name: "Measuring Tools", slug: "measuring-tools", icon: "Ruler" },
    { name: "Fasteners", slug: "fasteners", icon: "Link" }
  ]
};

export async function seedComprehensiveSubcategories() {
  try {
    console.log("🌱 Starting comprehensive subcategory seeding...");
    
    let totalSeeded = 0;
    
    for (const [categoryName, subcatList] of Object.entries(COMPREHENSIVE_SUBCATEGORIES)) {
      // Find the parent category
      const [parentCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, categoryName))
        .limit(1);
      
      if (!parentCategory) {
        console.log(`⚠️  Parent category "${categoryName}" not found, skipping...`);
        continue;
      }
      
      console.log(`📂 Processing ${categoryName} (${subcatList.length} subcategories)...`);
      
      for (const [index, subcat] of subcatList.entries()) {
        // Check if subcategory already exists
        const [existing] = await db
          .select()
          .from(categories)
          .where(and(
            eq(categories.name, subcat.name),
            eq(categories.parentId, parentCategory.id)
          ))
          .limit(1);
        
        if (existing) {
          console.log(`  ⏭️  ${subcat.name} already exists, skipping...`);
          continue;
        }
        
        // Create subcategory
        const [inserted] = await db
          .insert(categories)
          .values({
            name: subcat.name,
            slug: subcat.slug,
            description: `${subcat.name} products and accessories`,
            icon: subcat.icon,
            parentId: parentCategory.id,
            sortOrder: index + 1,
            isActive: true,
            productCount: 0
          })
          .returning();
        
        console.log(`  ✅ Created: ${inserted.name} (ID: ${inserted.id})`);
        totalSeeded++;
      }
    }
    
    console.log(`🎉 Subcategory seeding completed! Total seeded: ${totalSeeded}`);
    return { success: true, totalSeeded };
    
  } catch (error) {
    console.error('❌ Error seeding comprehensive subcategories:', error);
    throw error;
  }
}