import { Request, Response } from 'express';
import { db } from '../db';
import { vendors, users, insertVendorSchema } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const registerVendor = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user.id;

    // Check if user already has a vendor account
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId));

    if (existingVendor.length > 0) {
      return res.status(409).json({ message: 'Vendor account already exists' });
    }

    // Validate request body
    const validationResult = insertVendorSchema.safeParse({
      ...req.body,
      userId,
    });

    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Invalid vendor data',
        errors: validationResult.error.errors,
      });
    }

    // Create vendor account
    const [newVendor] = await db
      .insert(vendors)
      .values(validationResult.data)
      .returning();

    // Update user role to vendor
    await db
      .update(users)
      .set({ role: 'vendor' })
      .where(eq(users.id, userId));

    res.status(201).json({
      message: 'Vendor registration successful',
      vendor: newVendor,
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Customer submits a vendor application (no auth required)
// Customer submits a vendor application (no auth required)
export const applyForVendor = async (req: Request, res: Response) => {
  try {
    const parse = insertVendorSchema.omit({ userId: true }).safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ message: 'Invalid application data', errors: parse.error.errors });
    }

    // Check if user_id is required in your schema
    // If it is, we need to handle this differently
    
    // Option 1: Create a temporary user for the application
    // Option 2: Modify your database schema to allow null user_id for pending applications
    
    // For now, let's create a minimal temporary user
    const tempUsername = `temp_vendor_${Math.random().toString(36).substring(2, 10)}`;
    const tempPassword = randomUUID();
    
    // Create a temporary user
    const [tempUser] = await db.insert(users).values({
      username: tempUsername,
      email: parse.data.email,
      password: tempPassword,
      role: 'customer', // Start as customer, will be elevated to vendor upon approval
      firstName: parse.data.contactName || 'Vendor',
      isActive: false, // Inactive until approved
    }).returning();

    // Create a pending vendor application with the temporary user
    const [vendor] = await db
      .insert(vendors)
      .values({ 
        ...parse.data, 
        userId: tempUser.id, // Use the temporary user ID
        status: 'pending',
        taxId: parse.data.taxId || null,
        website: parse.data.website || null,
        businessDescription: parse.data.businessDescription || null,
        // Set default values for required fields
        totalSales: '0',
        totalOrders: 0,
        rating: '0',
        reviewCount: 0,
        approvedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return res.status(201).json({ message: 'Application submitted', vendorId: vendor.id });
  } catch (error) {
    console.error('Vendor application error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: list pending vendor applications
export const listVendorApplications = async (_req: Request, res: Response) => {
  try {
    const apps = await db
      .select()
      .from(vendors)
      .where(eq(vendors.status, 'pending'))
      .orderBy(desc(vendors.createdAt));
    
    return res.json(apps);
  } catch (error) {
    console.error('List applications error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: approve vendor application -> create user (if needed) and update vendor
export const approveVendorApplication = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid vendor id' });
    }

    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    if (!vendor) return res.status(404).json({ message: 'Vendor application not found' });
    if (vendor.status === 'approved') return res.status(409).json({ message: 'Already approved' });

    // Ensure user exists or create a minimal one
    let existingUser = (await db.select().from(users).where(eq(users.email, vendor.email)))[0];
    if (!existingUser) {
      const username = vendor.email.split('@')[0] + '_' + Math.floor(Math.random() * 10000);
      const placeholderPassword = randomUUID();
      [existingUser] = await db.insert(users).values({
        username,
        email: vendor.email,
        password: placeholderPassword,
        role: 'vendor',
        firstName: vendor.contactName,
        isActive: true,
      }).returning();
    } else {
      // elevate role if not vendor
      if (existingUser.role !== 'vendor') {
        await db.update(users).set({ role: 'vendor' }).where(eq(users.id, existingUser.id));
      }
    }

    // Update vendor with user ID and approved status
    const [updatedVendor] = await db.update(vendors)
      .set({ 
        userId: existingUser.id,
        status: 'approved',
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(vendors.id, id))
      .returning();

    return res.json({ 
      message: 'Application approved',
      vendor: updatedVendor 
    });
  } catch (error) {
    console.error('Approve application error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: reject vendor application
export const rejectVendorApplication = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid vendor id' });
    }

    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    if (!vendor) return res.status(404).json({ message: 'Vendor application not found' });
    if (vendor.status !== 'pending') return res.status(409).json({ message: 'Application already processed' });

    // Update vendor status to rejected
    const [updatedVendor] = await db.update(vendors)
      .set({ 
        status: 'rejected',
        updatedAt: new Date()
      })
      .where(eq(vendors.id, id))
      .returning();

    return res.json({ 
      message: 'Application rejected',
      vendor: updatedVendor 
    });
  } catch (error) {
    console.error('Reject application error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendorProfile = async (req: Request, res: Response) => {
  try {
    if (!req.vendor) {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, req.vendor.id));

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error('Get vendor profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateVendorProfile = async (req: Request, res: Response) => {
  try {
    if (!req.vendor) {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const allowedUpdates = [
      'businessName',
      'businessDescription',
      'contactName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
      'country',
      'website',
    ];

    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {} as any);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid updates provided' });
    }

    const [updatedVendor] = await db
      .update(vendors)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vendors.id, req.vendor.id))
      .returning();

    res.json(updatedVendor);
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendorStats = async (req: Request, res: Response) => {
  try {
    if (!req.vendor) {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const vendorId = req.vendor.id;

    // Get basic vendor stats
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId));

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // For now, return the vendor data with some calculated fields
    // In a real app, you'd calculate these from orders, products, etc.
    const stats = {
      totalSales: parseFloat(vendor.totalSales || '0'),
      totalOrders: vendor.totalOrders || 0,
      totalProducts: 42, // This would come from products table
      totalCustomers: 178, // This would come from orders analysis
      monthlyRevenue: 12345.67, // This would come from recent orders
      pendingOrders: 8, // This would come from orders with pending status
      rating: parseFloat(vendor.rating || '0'),
      reviewCount: vendor.reviewCount || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Get vendor stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendorOrders = async (req: Request, res: Response) => {
  try {
    if (!req.vendor) {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const { page = 1, limit = 10, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // For now, return mock data
    // In a real app, you'd query the orders table filtered by vendor
    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-2024-001',
        customerName: 'John Smith',
        amount: 299.99,
        status: 'pending',
        date: '2024-01-15',
      },
      {
        id: 2,
        orderNumber: 'ORD-2024-002',
        customerName: 'Sarah Johnson',
        amount: 149.50,
        status: 'processing',
        date: '2024-01-14',
      },
      {
        id: 3,
        orderNumber: 'ORD-2024-003',
        customerName: 'Mike Davis',
        amount: 89.99,
        status: 'shipped',
        date: '2024-01-13',
      },
    ];

    res.json({
      orders: mockOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: mockOrders.length,
        pages: Math.ceil(mockOrders.length / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    if (!req.vendor) {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const { page = 1, limit = 10, category } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // For now, return mock data
    // In a real app, you'd query the products table filtered by vendor
    const mockProducts = [
      {
        id: 1,
        name: 'Wireless Headphones',
        sales: 45,
        revenue: 2249.55,
        stock: 23,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      },
      {
        id: 2,
        name: 'Smart Watch',
        sales: 32,
        revenue: 1599.68,
        stock: 15,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      },
      {
        id: 3,
        name: 'Laptop Stand',
        sales: 28,
        revenue: 839.72,
        stock: 8,
        status: 'low_stock',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
      },
    ];

    res.json({
      products: mockProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: mockProducts.length,
        pages: Math.ceil(mockProducts.length / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get vendor products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};