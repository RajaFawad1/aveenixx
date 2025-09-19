import { Router } from "express";
import { storage } from "./storage";
import { 
  insertInventoryLocationSchema, 
  insertInventoryItemSchema, 
  insertStockMovementSchema,
  insertInventoryAlertSchema,
  insertStockTransferSchema 
} from "@shared/schema";
import { z } from "zod";

const router = Router();

// ===== INVENTORY DASHBOARD =====

// Get inventory dashboard statistics
router.get("/dashboard/stats", async (req, res) => {
  try {
    const stats = await storage.getInventoryDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching inventory dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch inventory dashboard stats" });
  }
});

// ===== INVENTORY LOCATIONS =====

// Get all inventory locations
router.get("/locations", async (req, res) => {
  try {
    const locations = await storage.getInventoryLocations();
    res.json(locations);
  } catch (error) {
    console.error("Error fetching inventory locations:", error);
    res.status(500).json({ error: "Failed to fetch inventory locations" });
  }
});

// Get specific inventory location with items
router.get("/locations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const location = await storage.getInventoryLocation(id);
    
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    
    res.json(location);
  } catch (error) {
    console.error("Error fetching inventory location:", error);
    res.status(500).json({ error: "Failed to fetch inventory location" });
  }
});

// Create new inventory location
router.post("/locations", async (req, res) => {
  try {
    const validatedData = insertInventoryLocationSchema.parse(req.body);
    const location = await storage.createInventoryLocation(validatedData);
    res.status(201).json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid location data", details: error.errors });
    }
    console.error("Error creating inventory location:", error);
    res.status(500).json({ error: "Failed to create inventory location" });
  }
});

// Update inventory location
router.put("/locations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertInventoryLocationSchema.partial().parse(req.body);
    const location = await storage.updateInventoryLocation(id, validatedData);
    
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    
    res.json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid location data", details: error.errors });
    }
    console.error("Error updating inventory location:", error);
    res.status(500).json({ error: "Failed to update inventory location" });
  }
});

// Delete inventory location
router.delete("/locations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteInventoryLocation(id);
    
    if (!success) {
      return res.status(404).json({ error: "Location not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting inventory location:", error);
    res.status(500).json({ error: "Failed to delete inventory location" });
  }
});

// ===== INVENTORY ITEMS =====

// Get inventory items (optionally filtered by location)
router.get("/items", async (req, res) => {
  try {
    const { locationId, stockStatus, lowStock } = req.query;
    const filters: any = {};
    
    if (stockStatus) filters.stockStatus = stockStatus;
    if (lowStock === 'true') filters.lowStock = true;
    
    const items = await storage.getInventoryItems(
      locationId ? parseInt(locationId as string) : undefined,
      filters
    );
    
    res.json(items);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
});

// Get specific inventory item
router.get("/items/:productId/:locationId", async (req, res) => {
  try {
    const { productId } = req.params;
    const locationId = parseInt(req.params.locationId);
    
    const item = await storage.getInventoryItem(productId, locationId);
    
    if (!item) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    
    res.json(item);
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).json({ error: "Failed to fetch inventory item" });
  }
});

// Create new inventory item
router.post("/items", async (req, res) => {
  try {
    const validatedData = insertInventoryItemSchema.parse(req.body);
    const item = await storage.createInventoryItem(validatedData);
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid inventory item data", details: error.errors });
    }
    console.error("Error creating inventory item:", error);
    res.status(500).json({ error: "Failed to create inventory item" });
  }
});

// Update inventory item
router.put("/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertInventoryItemSchema.partial().parse(req.body);
    const item = await storage.updateInventoryItem(id, validatedData);
    
    if (!item) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid inventory item data", details: error.errors });
    }
    console.error("Error updating inventory item:", error);
    res.status(500).json({ error: "Failed to update inventory item" });
  }
});

// Update stock levels
router.post("/items/update-stock", async (req, res) => {
  try {
    const schema = z.object({
      productId: z.string(),
      locationId: z.number(),
      quantity: z.number(),
      movementType: z.enum(['in', 'out', 'adjustment', 'transfer']),
      reason: z.string().optional(),
      performedBy: z.number().optional(),
    });
    
    const { productId, locationId, quantity, movementType, reason, performedBy } = schema.parse(req.body);
    
    const success = await storage.updateStock(productId, locationId, quantity, movementType, reason, performedBy);
    
    if (!success) {
      return res.status(400).json({ error: "Failed to update stock" });
    }
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid stock update data", details: error.errors });
    }
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// ===== STOCK MOVEMENTS =====

// Get stock movements
router.get("/movements", async (req, res) => {
  try {
    const { productId, locationId, limit } = req.query;
    
    const movements = await storage.getStockMovements(
      productId as string,
      locationId ? parseInt(locationId as string) : undefined,
      limit ? parseInt(limit as string) : undefined
    );
    
    res.json(movements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ error: "Failed to fetch stock movements" });
  }
});

// Create stock movement
router.post("/movements", async (req, res) => {
  try {
    const validatedData = insertStockMovementSchema.parse(req.body);
    const movement = await storage.createStockMovement(validatedData);
    res.status(201).json(movement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid stock movement data", details: error.errors });
    }
    console.error("Error creating stock movement:", error);
    res.status(500).json({ error: "Failed to create stock movement" });
  }
});

// ===== INVENTORY ALERTS =====

// Get inventory alerts
router.get("/alerts", async (req, res) => {
  try {
    const { isActive } = req.query;
    const alerts = await storage.getInventoryAlerts(
      isActive !== undefined ? isActive === 'true' : undefined
    );
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching inventory alerts:", error);
    res.status(500).json({ error: "Failed to fetch inventory alerts" });
  }
});

// Create inventory alert
router.post("/alerts", async (req, res) => {
  try {
    const validatedData = insertInventoryAlertSchema.parse(req.body);
    const alert = await storage.createInventoryAlert(validatedData);
    res.status(201).json(alert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid alert data", details: error.errors });
    }
    console.error("Error creating inventory alert:", error);
    res.status(500).json({ error: "Failed to create inventory alert" });
  }
});

// Resolve inventory alert
router.put("/alerts/:id/resolve", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { resolvedBy } = req.body;
    
    if (!resolvedBy) {
      return res.status(400).json({ error: "resolvedBy is required" });
    }
    
    const success = await storage.resolveInventoryAlert(id, resolvedBy);
    
    if (!success) {
      return res.status(404).json({ error: "Alert not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error resolving inventory alert:", error);
    res.status(500).json({ error: "Failed to resolve inventory alert" });
  }
});

// ===== STOCK TRANSFERS =====

// Get stock transfers
router.get("/transfers", async (req, res) => {
  try {
    const { status } = req.query;
    const transfers = await storage.getStockTransfers(status as string);
    res.json(transfers);
  } catch (error) {
    console.error("Error fetching stock transfers:", error);
    res.status(500).json({ error: "Failed to fetch stock transfers" });
  }
});

// Create stock transfer
router.post("/transfers", async (req, res) => {
  try {
    const validatedData = insertStockTransferSchema.parse(req.body);
    const transfer = await storage.createStockTransfer(validatedData);
    res.status(201).json(transfer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid transfer data", details: error.errors });
    }
    console.error("Error creating stock transfer:", error);
    res.status(500).json({ error: "Failed to create stock transfer" });
  }
});

// Update stock transfer status
router.put("/transfers/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, updatedBy } = req.body;
    
    if (!status || !updatedBy) {
      return res.status(400).json({ error: "status and updatedBy are required" });
    }
    
    const transfer = await storage.updateStockTransferStatus(id, status, updatedBy);
    
    if (!transfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }
    
    res.json(transfer);
  } catch (error) {
    console.error("Error updating stock transfer status:", error);
    res.status(500).json({ error: "Failed to update stock transfer status" });
  }
});

// ===== INVENTORY ANALYTICS =====

// Get low stock items
router.get("/analytics/low-stock", async (req, res) => {
  try {
    const { threshold } = req.query;
    const items = await storage.getLowStockItems(
      threshold ? parseInt(threshold as string) : undefined
    );
    res.json(items);
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ error: "Failed to fetch low stock items" });
  }
});

// Get out of stock items
router.get("/analytics/out-of-stock", async (req, res) => {
  try {
    const items = await storage.getOutOfStockItems();
    res.json(items);
  } catch (error) {
    console.error("Error fetching out of stock items:", error);
    res.status(500).json({ error: "Failed to fetch out of stock items" });
  }
});

// Get overstock items
router.get("/analytics/overstock", async (req, res) => {
  try {
    const items = await storage.getOverstockItems();
    res.json(items);
  } catch (error) {
    console.error("Error fetching overstock items:", error);
    res.status(500).json({ error: "Failed to fetch overstock items" });
  }
});

// Get items needing reorder
router.get("/analytics/reorder", async (req, res) => {
  try {
    const items = await storage.getReorderItems();
    res.json(items);
  } catch (error) {
    console.error("Error fetching reorder items:", error);
    res.status(500).json({ error: "Failed to fetch reorder items" });
  }
});

// ===== BULK OPERATIONS =====

// Bulk update stock levels
router.post("/bulk/update-stock", async (req, res) => {
  try {
    const schema = z.object({
      updates: z.array(z.object({
        productId: z.string(),
        locationId: z.number(),
        quantity: z.number(),
        movementType: z.enum(['in', 'out', 'adjustment']),
        reason: z.string().optional(),
      })),
      performedBy: z.number().optional(),
    });
    
    const { updates, performedBy } = schema.parse(req.body);
    const results = [];
    
    for (const update of updates) {
      const success = await storage.updateStock(
        update.productId,
        update.locationId,
        update.quantity,
        update.movementType,
        update.reason,
        performedBy
      );
      results.push({ ...update, success });
    }
    
    res.json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid bulk update data", details: error.errors });
    }
    console.error("Error performing bulk stock update:", error);
    res.status(500).json({ error: "Failed to perform bulk stock update" });
  }
});

export default router;