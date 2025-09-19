import { db } from "./db";
import { categories } from "../shared/schema";
import { eq } from "drizzle-orm";

async function createSubcategories() {
  try {
    // Find Electronics category
    const electronicsCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, 'electronics-technology'))
      .limit(1);

    if (electronicsCategory.length === 0) {
      console.log('Electronics category not found');
      return;
    }

    const electronicsId = electronicsCategory[0].id;

    // Create Electronics subcategories
    const subcategories = [
      {
        name: "Smartphones",
        slug: "smartphones",
        icon: "Smartphone",
        parentId: electronicsId,
        sortOrder: 1,
        isActive: true,
        productCount: 0,
        description: "Mobile phones and smartphone accessories"
      },
      {
        name: "Laptops & Computers",
        slug: "laptops-computers",
        icon: "Laptop",
        parentId: electronicsId,
        sortOrder: 2,
        isActive: true,
        productCount: 0,
        description: "Laptops, desktops, and computer accessories"
      },
      {
        name: "Headphones & Audio",
        slug: "headphones-audio",
        icon: "Headphones",
        parentId: electronicsId,
        sortOrder: 3,
        isActive: true,
        productCount: 0,
        description: "Headphones, earbuds, and audio equipment"
      },
      {
        name: "Cameras & Photography",
        slug: "cameras-photography",
        icon: "Camera",
        parentId: electronicsId,
        sortOrder: 4,
        isActive: true,
        productCount: 0,
        description: "Digital cameras and photography equipment"
      },
      {
        name: "Smart TVs & Displays",
        slug: "smart-tvs-displays",
        icon: "Tv",
        parentId: electronicsId,
        sortOrder: 5,
        isActive: true,
        productCount: 0,
        description: "Smart TVs, monitors, and display devices"
      },
      {
        name: "Wearables & Smartwatches",
        slug: "wearables-smartwatches",
        icon: "Watch",
        parentId: electronicsId,
        sortOrder: 6,
        isActive: true,
        productCount: 0,
        description: "Smartwatches, fitness trackers, and wearable tech"
      }
    ];

    // Insert subcategories
    const inserted = await db.insert(categories).values(subcategories).returning();
    console.log(`✅ Created ${inserted.length} Electronics subcategories:`);
    inserted.forEach(sub => console.log(`  - ${sub.name} (ID: ${sub.id})`));

  } catch (error) {
    console.error('Error creating subcategories:', error);
  }
}

createSubcategories();