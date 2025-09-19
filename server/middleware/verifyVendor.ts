import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { vendors } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Extend the Request interface to include vendor
declare global {
  namespace Express {
    interface Request {
      vendor?: {
        id: number;
        userId: number;
        businessName: string;
        status: string;
        isActive: boolean;
      };
    }
  }
}

export const verifyVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user.id;

    // Check if user is a vendor
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId));

    if (!vendor) {
      return res.status(403).json({ message: 'Vendor account not found' });
    }

    // Check if vendor is approved and active
    if (vendor.status !== 'approved') {
      return res.status(403).json({ 
        message: 'Vendor account not approved',
        status: vendor.status 
      });
    }

    if (!vendor.isActive) {
      return res.status(403).json({ message: 'Vendor account is inactive' });
    }

    // Attach vendor info to request
    req.vendor = {
      id: vendor.id,
      userId: vendor.userId,
      businessName: vendor.businessName,
      status: vendor.status,
      isActive: vendor.isActive,
    };

    next();
  } catch (error) {
    console.error('Vendor verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyVendorOrPending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user.id;

    // Check if user is a vendor (any status)
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId));

    if (!vendor) {
      return res.status(403).json({ message: 'Vendor account not found' });
    }

    // Attach vendor info to request
    req.vendor = {
      id: vendor.id,
      userId: vendor.userId,
      businessName: vendor.businessName,
      status: vendor.status,
      isActive: vendor.isActive,
    };

    next();
  } catch (error) {
    console.error('Vendor verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};