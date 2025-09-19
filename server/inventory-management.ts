import { storage } from "./storage";

export interface InventoryItem {
  productId: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  reorderPoint: number;
  lastUpdated: Date;
}

export interface StockMovement {
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  orderId?: number;
  vendorId?: number;
  timestamp: Date;
}

export class InventoryManager {
  private inventory: Map<string, InventoryItem> = new Map();
  private stockMovements: StockMovement[] = [];

  async initializeInventory() {
    // Initialize with sample inventory data
    const sampleInventory: InventoryItem[] = [
      { productId: "prod_1", quantity: 50, reservedQuantity: 0, lowStockThreshold: 10, reorderPoint: 5, lastUpdated: new Date() },
      { productId: "prod_2", quantity: 25, reservedQuantity: 0, lowStockThreshold: 5, reorderPoint: 3, lastUpdated: new Date() },
      { productId: "prod_3", quantity: 30, reservedQuantity: 0, lowStockThreshold: 8, reorderPoint: 4, lastUpdated: new Date() },
      { productId: "prod_4", quantity: 100, reservedQuantity: 0, lowStockThreshold: 20, reorderPoint: 10, lastUpdated: new Date() },
      { productId: "prod_5", quantity: 15, reservedQuantity: 0, lowStockThreshold: 5, reorderPoint: 2, lastUpdated: new Date() },
      { productId: "prod_6", quantity: 75, reservedQuantity: 0, lowStockThreshold: 15, reorderPoint: 8, lastUpdated: new Date() },
      { productId: "prod_7", quantity: 5, reservedQuantity: 0, lowStockThreshold: 2, reorderPoint: 1, lastUpdated: new Date() },
      { productId: "prod_8", quantity: 200, reservedQuantity: 0, lowStockThreshold: 40, reorderPoint: 20, lastUpdated: new Date() },
      { productId: "prod_9", quantity: 20, reservedQuantity: 0, lowStockThreshold: 5, reorderPoint: 2, lastUpdated: new Date() },
      { productId: "prod_10", quantity: 12, reservedQuantity: 0, lowStockThreshold: 3, reorderPoint: 1, lastUpdated: new Date() },
    ];

    for (const item of sampleInventory) {
      this.inventory.set(item.productId, item);
    }
  }

  async getInventoryLevel(productId: string): Promise<InventoryItem | null> {
    return this.inventory.get(productId) || null;
  }

  async updateInventory(productId: string, quantity: number, reason: string, orderId?: number): Promise<boolean> {
    const item = this.inventory.get(productId);
    if (!item) return false;

    const oldQuantity = item.quantity;
    item.quantity = Math.max(0, item.quantity + quantity);
    item.lastUpdated = new Date();

    // Record stock movement
    this.stockMovements.push({
      productId,
      type: quantity > 0 ? 'in' : 'out',
      quantity: Math.abs(quantity),
      reason,
      orderId,
      timestamp: new Date()
    });

    // Check for low stock alerts
    if (item.quantity <= item.lowStockThreshold) {
      await this.sendLowStockAlert(productId, item.quantity);
    }

    // Check for reorder point
    if (item.quantity <= item.reorderPoint) {
      await this.triggerReorder(productId, item);
    }

    return true;
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    const item = this.inventory.get(productId);
    if (!item) return false;

    const availableQuantity = item.quantity - item.reservedQuantity;
    if (availableQuantity < quantity) return false;

    item.reservedQuantity += quantity;
    return true;
  }

  async releaseReservedStock(productId: string, quantity: number): Promise<boolean> {
    const item = this.inventory.get(productId);
    if (!item) return false;

    item.reservedQuantity = Math.max(0, item.reservedQuantity - quantity);
    return true;
  }

  async confirmReservation(productId: string, quantity: number, orderId: number): Promise<boolean> {
    const item = this.inventory.get(productId);
    if (!item) return false;

    // Release from reserved and deduct from actual inventory
    item.reservedQuantity = Math.max(0, item.reservedQuantity - quantity);
    item.quantity = Math.max(0, item.quantity - quantity);
    item.lastUpdated = new Date();

    // Record stock movement
    this.stockMovements.push({
      productId,
      type: 'out',
      quantity,
      reason: 'Order fulfillment',
      orderId,
      timestamp: new Date()
    });

    return true;
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const lowStockItems: InventoryItem[] = [];
    
    for (const item of this.inventory.values()) {
      if (item.quantity <= item.lowStockThreshold) {
        lowStockItems.push(item);
      }
    }
    
    return lowStockItems;
  }

  async getStockMovements(productId?: string, startDate?: Date, endDate?: Date): Promise<StockMovement[]> {
    let movements = this.stockMovements;
    
    if (productId) {
      movements = movements.filter(m => m.productId === productId);
    }
    
    if (startDate) {
      movements = movements.filter(m => m.timestamp >= startDate);
    }
    
    if (endDate) {
      movements = movements.filter(m => m.timestamp <= endDate);
    }
    
    return movements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getInventoryReport(): Promise<{
    totalProducts: number;
    totalStock: number;
    lowStockItems: number;
    reorderRequired: number;
    totalReserved: number;
  }> {
    const items = Array.from(this.inventory.values());
    
    return {
      totalProducts: items.length,
      totalStock: items.reduce((sum, item) => sum + item.quantity, 0),
      lowStockItems: items.filter(item => item.quantity <= item.lowStockThreshold).length,
      reorderRequired: items.filter(item => item.quantity <= item.reorderPoint).length,
      totalReserved: items.reduce((sum, item) => sum + item.reservedQuantity, 0)
    };
  }

  private async sendLowStockAlert(productId: string, currentStock: number): Promise<void> {
    // Mock low stock alert
    console.log(`LOW STOCK ALERT: Product ${productId} has ${currentStock} units remaining`);
  }

  private async triggerReorder(productId: string, item: InventoryItem): Promise<void> {
    // Mock reorder trigger
    console.log(`REORDER TRIGGERED: Product ${productId} needs restocking (${item.quantity} units remaining)`);
  }

  async performInventoryAdjustment(productId: string, newQuantity: number, reason: string): Promise<boolean> {
    const item = this.inventory.get(productId);
    if (!item) return false;

    const adjustment = newQuantity - item.quantity;
    item.quantity = newQuantity;
    item.lastUpdated = new Date();

    // Record stock movement
    this.stockMovements.push({
      productId,
      type: 'adjustment',
      quantity: Math.abs(adjustment),
      reason,
      timestamp: new Date()
    });

    return true;
  }
}

export const inventoryManager = new InventoryManager();