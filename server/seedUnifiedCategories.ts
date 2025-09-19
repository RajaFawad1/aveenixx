import { db } from "./db";
import { categories } from "@shared/schema";

// Unified Category System - 20 Main Categories for Multi-Platform Import
export const unifiedCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: "📱",
    isHot: true,
    sortOrder: 1,
    description: "Smartphones, laptops, tablets, gaming, and consumer electronics",
    metaTitle: "Electronics | AVEENIX - Latest Tech & Gadgets",
    metaDescription: "Shop the latest electronics from Amazon, AliExpress, and more. Find smartphones, laptops, tablets, and tech accessories.",
    platformMapping: {
      amazon: ["Electronics", "Cell Phones & Accessories", "Computers & Accessories"],
      aliexpress: ["Consumer Electronics", "Computer & Office", "Phones & Telecommunications"],
      walmart: ["Electronics", "Cell Phones", "Computers"]
    }
  },
  {
    name: "Fashion & Clothing",
    slug: "fashion",
    icon: "👗",
    isHot: true,
    sortOrder: 2,
    description: "Men's and women's clothing, shoes, accessories, and fashion items",
    metaTitle: "Fashion & Clothing | AVEENIX - Style & Trends",
    metaDescription: "Discover the latest fashion trends from top brands. Shop clothing, shoes, and accessories from multiple platforms.",
    platformMapping: {
      amazon: ["Clothing, Shoes & Jewelry", "Women", "Men"],
      aliexpress: ["Women's Clothing", "Men's Clothing", "Shoes"],
      walmart: ["Clothing", "Shoes", "Jewelry & Watches"]
    }
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    icon: "🏠",
    isHot: false,
    sortOrder: 3,
    description: "Home decor, furniture, appliances, garden tools, and outdoor equipment",
    metaTitle: "Home & Garden | AVEENIX - Transform Your Space",
    metaDescription: "Shop home decor, furniture, appliances, and garden supplies from trusted sellers worldwide.",
    platformMapping: {
      amazon: ["Home & Kitchen", "Patio, Lawn & Garden", "Tools & Home Improvement"],
      aliexpress: ["Home & Garden", "Furniture", "Home Improvement"],
      walmart: ["Home", "Patio & Garden", "Home Improvement"]
    }
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: "💄",
    isHot: true,
    sortOrder: 4,
    description: "Skincare, makeup, health supplements, personal care, and wellness products",
    metaTitle: "Health & Beauty | AVEENIX - Wellness & Self-Care",
    metaDescription: "Explore health and beauty products including skincare, makeup, supplements, and personal care items.",
    platformMapping: {
      amazon: ["Beauty & Personal Care", "Health & Household"],
      aliexpress: ["Beauty & Health", "Hair Extensions & Wigs"],
      walmart: ["Beauty", "Health", "Personal Care"]
    }
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    icon: "⚽",
    isHot: false,
    sortOrder: 5,
    description: "Athletic wear, fitness equipment, outdoor gear, and sporting goods",
    metaTitle: "Sports & Outdoors | AVEENIX - Active Lifestyle",
    metaDescription: "Find sports equipment, fitness gear, outdoor supplies, and athletic wear from leading brands.",
    platformMapping: {
      amazon: ["Sports & Outdoors", "Exercise & Fitness"],
      aliexpress: ["Sports & Entertainment", "Outdoor Fun & Sports"],
      walmart: ["Sports & Outdoors", "Exercise & Fitness"]
    }
  },
  {
    name: "Automotive",
    slug: "automotive",
    icon: "🚗",
    isHot: false,
    sortOrder: 6,
    description: "Car parts, accessories, tools, and automotive maintenance products",
    metaTitle: "Automotive | AVEENIX - Car Parts & Accessories",
    metaDescription: "Shop automotive parts, accessories, tools, and car care products from verified sellers.",
    platformMapping: {
      amazon: ["Automotive", "Motorcycle & Powersports"],
      aliexpress: ["Automobiles & Motorcycles"],
      walmart: ["Auto & Tires", "Automotive"]
    }
  },
  {
    name: "Books & Media",
    slug: "books-media",
    icon: "📚",
    isHot: false,
    sortOrder: 7,
    description: "Books, e-books, audiobooks, movies, music, and educational content",
    metaTitle: "Books & Media | AVEENIX - Knowledge & Entertainment",
    metaDescription: "Discover books, audiobooks, movies, music, and educational materials from global sellers.",
    platformMapping: {
      amazon: ["Books", "Movies & TV", "CDs & Vinyl"],
      aliexpress: ["Education & Office Supplies"],
      walmart: ["Books", "Movies & TV Shows", "Music"]
    }
  },
  {
    name: "Toys & Games",
    slug: "toys-games",
    icon: "🧸",
    isHot: true,
    sortOrder: 8,
    description: "Children's toys, educational games, puzzles, and entertainment products",
    metaTitle: "Toys & Games | AVEENIX - Fun for All Ages",
    metaDescription: "Shop toys, games, puzzles, and educational products for kids and adults from trusted brands.",
    platformMapping: {
      amazon: ["Toys & Games"],
      aliexpress: ["Toys & Hobbies"],
      walmart: ["Toys", "Video Games"]
    }
  },
  {
    name: "Jewelry & Watches",
    slug: "jewelry-watches",
    icon: "💎",
    isHot: false,
    sortOrder: 9,
    description: "Fine jewelry, fashion accessories, watches, and luxury items",
    metaTitle: "Jewelry & Watches | AVEENIX - Luxury & Style",
    metaDescription: "Browse fine jewelry, fashion accessories, luxury watches, and precious items from global sellers.",
    platformMapping: {
      amazon: ["Clothing, Shoes & Jewelry"],
      aliexpress: ["Jewelry & Accessories", "Watches"],
      walmart: ["Jewelry & Watches"]
    }
  },
  {
    name: "Pet Supplies",
    slug: "pet-supplies",
    icon: "🐕",
    isHot: false,
    sortOrder: 10,
    description: "Pet food, toys, accessories, health products, and pet care items",
    metaTitle: "Pet Supplies | AVEENIX - Care for Your Pets",
    metaDescription: "Find pet food, toys, accessories, health products, and care items for all types of pets.",
    platformMapping: {
      amazon: ["Pet Supplies"],
      aliexpress: ["Home & Garden"],
      walmart: ["Pets"]
    }
  },
  {
    name: "Office & Business",
    slug: "office-business",
    icon: "💼",
    isHot: false,
    sortOrder: 11,
    description: "Office supplies, business equipment, stationery, and productivity tools",
    metaTitle: "Office & Business | AVEENIX - Professional Solutions",
    metaDescription: "Shop office supplies, business equipment, stationery, and productivity tools for professionals.",
    platformMapping: {
      amazon: ["Office Products", "Industrial & Scientific"],
      aliexpress: ["Office & School Supplies"],
      walmart: ["Office", "Business & Industrial"]
    }
  },
  {
    name: "Arts & Crafts",
    slug: "arts-crafts",
    icon: "🎨",
    isHot: false,
    sortOrder: 12,
    description: "Art supplies, craft materials, DIY projects, and creative tools",
    metaTitle: "Arts & Crafts | AVEENIX - Creative Supplies",
    metaDescription: "Discover art supplies, craft materials, DIY projects, and creative tools for all skill levels.",
    platformMapping: {
      amazon: ["Arts, Crafts & Sewing"],
      aliexpress: ["Office & School Supplies"],
      walmart: ["Arts, Crafts & Sewing"]
    }
  },
  {
    name: "Food & Groceries",
    slug: "food-groceries",
    icon: "🍎",
    isHot: false,
    sortOrder: 13,
    description: "Food items, beverages, snacks, gourmet products, and kitchen essentials",
    metaTitle: "Food & Groceries | AVEENIX - Fresh & Quality",
    metaDescription: "Shop food items, beverages, snacks, gourmet products, and kitchen essentials from trusted suppliers.",
    platformMapping: {
      amazon: ["Grocery & Gourmet Food"],
      aliexpress: ["Food"],
      walmart: ["Food", "Grocery"]
    }
  },
  {
    name: "Travel & Luggage",
    slug: "travel-luggage",
    icon: "🧳",
    isHot: false,
    sortOrder: 14,
    description: "Luggage, travel accessories, outdoor gear, and vacation essentials",
    metaTitle: "Travel & Luggage | AVEENIX - Journey Ready",
    metaDescription: "Find luggage, travel accessories, outdoor gear, and vacation essentials for your adventures.",
    platformMapping: {
      amazon: ["Luggage & Travel Gear"],
      aliexpress: ["Luggage & Bags"],
      walmart: ["Luggage & Travel Gear"]
    }
  },
  {
    name: "Music & Instruments",
    slug: "music-instruments",
    icon: "🎵",
    isHot: false,
    sortOrder: 15,
    description: "Musical instruments, audio equipment, accessories, and music gear",
    metaTitle: "Music & Instruments | AVEENIX - Make Music",
    metaDescription: "Shop musical instruments, audio equipment, accessories, and music gear from top brands.",
    platformMapping: {
      amazon: ["Musical Instruments"],
      aliexpress: ["Sports & Entertainment"],
      walmart: ["Musical Instruments"]
    }
  },
  {
    name: "Industrial & Tools",
    slug: "industrial-tools",
    icon: "🔧",
    isHot: false,
    sortOrder: 16,
    description: "Power tools, hand tools, industrial equipment, and professional gear",
    metaTitle: "Industrial & Tools | AVEENIX - Professional Equipment",
    metaDescription: "Find power tools, hand tools, industrial equipment, and professional gear for all trades.",
    platformMapping: {
      amazon: ["Tools & Home Improvement", "Industrial & Scientific"],
      aliexpress: ["Tools"],
      walmart: ["Tools & Hardware"]
    }
  },
  {
    name: "Collectibles & Antiques",
    slug: "collectibles-antiques",
    icon: "🏺",
    isHot: false,
    sortOrder: 17,
    description: "Rare items, vintage products, collectibles, and unique finds",
    metaTitle: "Collectibles & Antiques | AVEENIX - Unique Treasures",
    metaDescription: "Discover rare items, vintage products, collectibles, and unique finds from global sellers.",
    platformMapping: {
      amazon: ["Collectibles & Fine Art"],
      aliexpress: ["Home & Garden"],
      walmart: ["Collectibles"]
    }
  },
  {
    name: "Gift Cards & Digital",
    slug: "gift-cards-digital",
    icon: "🎁",
    isHot: false,
    sortOrder: 18,
    description: "Gift cards, digital products, software, and online services",
    metaTitle: "Gift Cards & Digital | AVEENIX - Digital Solutions",
    metaDescription: "Shop gift cards, digital products, software, and online services from verified providers.",
    platformMapping: {
      amazon: ["Gift Cards", "Software"],
      aliexpress: ["Computer & Office"],
      walmart: ["Gift Cards"]
    }
  },
  {
    name: "Handmade & Custom",
    slug: "handmade-custom",
    icon: "✋",
    isHot: true,
    sortOrder: 19,
    description: "Handcrafted items, custom products, artisan goods, and personalized items",
    metaTitle: "Handmade & Custom | AVEENIX - Artisan Crafted",
    metaDescription: "Browse handcrafted items, custom products, artisan goods, and personalized items from creators.",
    platformMapping: {
      amazon: ["Handmade"],
      aliexpress: ["Home & Garden"],
      walmart: ["Handmade"]
    }
  },
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    icon: "👶",
    isHot: true,
    sortOrder: 20,
    description: "Baby products, children's clothing, parenting essentials, and kids' items",
    metaTitle: "Baby & Kids | AVEENIX - Growing Together",
    metaDescription: "Find baby products, children's clothing, parenting essentials, and kids' items from trusted brands.",
    platformMapping: {
      amazon: ["Baby"],
      aliexpress: ["Mother & Kids"],
      walmart: ["Baby"]
    }
  }
];

export async function seedUnifiedCategories() {
  console.log("Seeding unified categories...");
  
  try {
    // Insert categories
    for (const category of unifiedCategories) {
      const [insertedCategory] = await db
        .insert(categories)
        .values({
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          isHot: category.isHot,
          sortOrder: category.sortOrder,
          description: category.description,
          metaTitle: category.metaTitle,
          metaDescription: category.metaDescription,
          platform_mapping: category.platformMapping,
        })
        .onConflictDoNothing()
        .returning();

      if (insertedCategory) {
        console.log(`✓ Created category: ${category.name}`);
      }
    }
    
    console.log("✅ Unified categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding unified categories:", error);
  }
}