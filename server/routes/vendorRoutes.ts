import { Router } from 'express';
import { 
  registerVendor, 
  getVendorProfile, 
  updateVendorProfile, 
  getVendorStats,
  getVendorOrders,
  getVendorProducts,
  applyForVendor,
  listVendorApplications,
  approveVendorApplication,
} from '../controllers/vendorController';
import { verifyVendor, verifyVendorOrPending } from '../middleware/verifyVendor';

const router = Router();

// Vendor registration (public for authenticated users)
router.post('/register', registerVendor);

// Vendor application (public)
router.post('/apply', applyForVendor);

// Admin: vendor applications
router.get('/applications', listVendorApplications);
router.post('/applications/:id/approve', approveVendorApplication);

// Vendor profile routes (requires vendor verification)
router.get('/profile', verifyVendorOrPending, getVendorProfile);
router.put('/profile', verifyVendor, updateVendorProfile);

// Vendor dashboard data
router.get('/stats', verifyVendor, getVendorStats);
router.get('/orders', verifyVendor, getVendorOrders);
router.get('/orders/recent', verifyVendor, getVendorOrders);
router.get('/products', verifyVendor, getVendorProducts);
router.get('/products/top', verifyVendor, getVendorProducts);

export default router;