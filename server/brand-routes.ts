import type { Express } from "express";
import { db } from "./db";
import { brands, products } from "@shared/schema";
import { eq, desc, asc, count, sql, and } from "drizzle-orm";
import { insertBrandSchema } from "@shared/schema";

export function registerBrandRoutes(app: Express) {
  // Get all brands with product counts
  app.get("/api/brands", async (req, res) => {
    try {
      const allBrands = await db
        .select({
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          description: brands.description,
          logoUrl: brands.logoUrl,
          websiteUrl: brands.websiteUrl,
          isActive: brands.isActive,
          isFeatured: brands.isFeatured,
          productCount: brands.productCount,
          createdAt: brands.createdAt,
          updatedAt: brands.updatedAt,
        })
        .from(brands)
        .where(eq(brands.isActive, true))
        .orderBy(desc(brands.isFeatured), asc(brands.name));

      res.json(allBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  // Get featured brands only
  app.get("/api/brands/featured", async (req, res) => {
    try {
      const featuredBrands = await db
        .select()
        .from(brands)
        .where(and(eq(brands.isActive, true), eq(brands.isFeatured, true)))
        .orderBy(asc(brands.name));

      res.json(featuredBrands);
    } catch (error) {
      console.error("Error fetching featured brands:", error);
      res.status(500).json({ error: "Failed to fetch featured brands" });
    }
  });

  // Get brands for a specific category
  app.get("/api/brands/by-category/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      
      const categoryBrands = await db
        .select({
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          logoUrl: brands.logoUrl,
          productCount: sql<number>`count(${products.id})::int`.as('productCount'),
        })
        .from(brands)
        .innerJoin(products, eq(products.brand, brands.name))
        .where(and(
          eq(brands.isActive, true),
          eq(products.category, categoryId)
        ))
        .groupBy(brands.id, brands.name, brands.slug, brands.logoUrl)
        .having(sql`count(${products.id}) > 0`)
        .orderBy(desc(sql`count(${products.id})`), asc(brands.name));

      res.json(categoryBrands);
    } catch (error) {
      console.error("Error fetching category brands:", error);
      res.status(500).json({ error: "Failed to fetch category brands" });
    }
  });

  // Create a new brand
  app.post("/api/brands", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      
      // Generate slug from name if not provided
      if (!validatedData.slug) {
        validatedData.slug = validatedData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      const [newBrand] = await db
        .insert(brands)
        .values(validatedData)
        .returning();

      res.status(201).json(newBrand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ error: "Failed to create brand" });
    }
  });

  // Update brand
  app.put("/api/brands/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBrandSchema.parse(req.body);

      const [updatedBrand] = await db
        .update(brands)
        .set({
          ...validatedData,
          updatedAt: new Date(),
        })
        .where(eq(brands.id, parseInt(id)))
        .returning();

      if (!updatedBrand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      res.json(updatedBrand);
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({ error: "Failed to update brand" });
    }
  });

  // Update brand product counts (utility endpoint)
  app.post("/api/brands/update-counts", async (req, res) => {
    try {
      // Update product counts for all brands
      const brandCounts = await db
        .select({
          brandName: products.brand,
          count: count()
        })
        .from(products)
        .where(sql`${products.brand} IS NOT NULL AND ${products.brand} != ''`)
        .groupBy(products.brand);

      for (const brandCount of brandCounts) {
        await db
          .update(brands)
          .set({ 
            productCount: brandCount.count,
            updatedAt: new Date()
          })
          .where(eq(brands.name, brandCount.brandName));
      }

      res.json({ 
        message: "Brand product counts updated successfully",
        updatedBrands: brandCounts.length 
      });
    } catch (error) {
      console.error("Error updating brand counts:", error);
      res.status(500).json({ error: "Failed to update brand counts" });
    }
  });

  // Sync brands from products (create missing brands)
  app.post("/api/brands/sync-from-products", async (req, res) => {
    try {
      // Get unique brands from products that don't exist in brands table
      const productBrands = await db
        .select({ 
          brand: products.brand,
          count: count()
        })
        .from(products)
        .where(sql`${products.brand} IS NOT NULL AND ${products.brand} != ''`)
        .groupBy(products.brand);

      const existingBrands = await db
        .select({ name: brands.name })
        .from(brands);

      const existingBrandNames = new Set(existingBrands.map(b => b.name));
      const newBrands = productBrands
        .filter(pb => !existingBrandNames.has(pb.brand))
        .map(pb => ({
          name: pb.brand,
          slug: pb.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          productCount: pb.count,
          isActive: true,
          isFeatured: false,
        }));

      if (newBrands.length > 0) {
        await db.insert(brands).values(newBrands);
      }

      res.json({ 
        message: "Brands synced from products successfully",
        newBrandsCreated: newBrands.length,
        totalProductBrands: productBrands.length
      });
    } catch (error) {
      console.error("Error syncing brands:", error);
      res.status(500).json({ error: "Failed to sync brands from products" });
    }
  });
}