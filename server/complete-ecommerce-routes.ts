import type { Express } from "express";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertCartSchema, insertWishlistSchema, insertAddressSchema, insertReviewSchema, insertVendorSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { paymentProcessor } from "./payment-processing";
import { inventoryManager } from "./inventory-management";
import { analyticsService } from "./analytics-service";

// Middleware for authentication
const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Permission middleware
const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

export function registerCompleteEcommerceRoutes(app: Express) {
  
  // ==================== AUTHENTICATION ROUTES ====================
  
  // Register user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: userData.role || "customer"
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );
      
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Registration failed" });
    }
  });
  
  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );
      
      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Login failed" });
    }
  });
  
  // Get current user
  app.get("/api/auth/me", authenticate, async (req: any, res) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone
      }
    });
  });
  
  // ==================== PRODUCT ROUTES ====================
  
  // Get all products with filtering and pagination
  app.get("/api/products", async (req, res) => {
    try {
      const { 
        category, 
        search, 
        minPrice, 
        maxPrice, 
        isNew, 
        isBestseller, 
        isOnSale,
        page = 1, 
        limit = 20,
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      const filters = {
        category: category as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        isNew: isNew === 'true',
        isBestseller: isBestseller === 'true',
        isOnSale: isOnSale === 'true',
      };

      const products = await storage.getProducts(
        filters,
        parseInt(page as string),
        parseInt(limit as string),
        sortBy as string,
        sortOrder as string
      );

      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  
  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      console.log("DEBUG ROUTE: Raw req.params:", JSON.stringify(req.params));
      console.log("DEBUG ROUTE: Product ID type:", typeof req.params.id);
      console.log("DEBUG ROUTE: Product ID value:", req.params.id);
      
      const productId = req.params.id;
      const product = await storage.getProduct(productId);
      console.log("DEBUG ROUTE: Product found:", product ? "YES" : "NO");
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Get reviews for this product
      const reviews = await storage.getReviews(productId);
      console.log("DEBUG ROUTE: Reviews found:", reviews.length);
      
      res.json({ ...product, reviews });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  
  // Create product (vendor only)
  app.post("/api/products", authenticate, requireRole(["vendor", "admin"]), async (req: any, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      
      // Generate unique product ID
      const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const product = await storage.createProduct({
        ...productData,
        id: productId
      });
      
      res.status(201).json({
        message: "Product created successfully",
        product
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  });
  
  // Update product
  app.put("/api/products/:id", authenticate, requireRole(["vendor", "admin"]), async (req: any, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({
        message: "Product updated successfully",
        product
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });
  
  // Delete product
  app.delete("/api/products/:id", authenticate, requireRole(["vendor", "admin"]), async (req: any, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  
  // ==================== CART ROUTES ====================
  
  // Cart route removed - using ecommerce-routes.ts cart route instead
  
  // Add to cart (supports guest carts)  
  app.post("/api/cart", async (req: any, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
      
      if (req.user?.id) {
        // Authenticated user - save to database
        const cartData = insertCartSchema.parse({
          productId,
          quantity,
          userId: req.user.id
        });
        const cartItem = await storage.addToCart(cartData);
        res.status(201).json({
          message: "Item added to cart",
          cartItem
        });
      } else {
        // Guest user - save to session
        if (!req.session.guestCart) {
          req.session.guestCart = [];
        }
        
        // Find existing item
        const existingIndex = req.session.guestCart.findIndex(item => item.productId === productId);
        
        if (existingIndex >= 0) {
          // Update quantity
          req.session.guestCart[existingIndex].quantity += quantity;
        } else {
          // Add new item
          req.session.guestCart.push({
            id: Date.now().toString(),
            productId,
            quantity,
            createdAt: new Date()
          });
        }
        
        res.status(201).json({ message: "Item added to cart" });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(400).json({ error: "Failed to add item to cart" });
    }
  });
  
  // Update cart item (supports guest carts)
  app.put("/api/cart/:id", async (req: any, res) => {
    try {
      const { quantity } = req.body;
      
      if (req.user?.id) {
        // Authenticated user - update in database
        const cartItem = await storage.updateCartItem(parseInt(req.params.id), quantity);
        if (!cartItem) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        
        res.json({
          message: "Cart item updated",
          cartItem
        });
      } else {
        // Guest user - update in session
        if (!req.session.guestCart) {
          return res.status(404).json({ error: "Cart not found" });
        }
        
        const itemIndex = req.session.guestCart.findIndex(item => item.id === req.params.id);
        if (itemIndex === -1) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        
        req.session.guestCart[itemIndex].quantity = quantity;
        res.json({ message: "Cart item updated" });
      }
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(400).json({ error: "Failed to update cart item" });
    }
  });
  
  // Remove from cart (supports guest carts)
  app.delete("/api/cart/:id", async (req: any, res) => {
    try {
      if (req.user?.id) {
        // Authenticated user - remove from database
        const success = await storage.removeFromCart(parseInt(req.params.id));
        if (!success) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        
        res.json({ message: "Item removed from cart" });
      } else {
        // Guest user - remove from session
        if (!req.session.guestCart) {
          return res.status(404).json({ error: "Cart not found" });
        }
        
        const itemIndex = req.session.guestCart.findIndex(item => item.id === req.params.id);
        if (itemIndex === -1) {
          return res.status(404).json({ error: "Cart item not found" });
        }
        
        req.session.guestCart.splice(itemIndex, 1);
        res.json({ message: "Item removed from cart" });
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  });
  
  // Clear cart
  app.delete("/api/cart", authenticate, async (req: any, res) => {
    try {
      await storage.clearCart(req.user.id);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Clear cart error:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });
  
  // ==================== WISHLIST ROUTES ====================
  
  // Get user's wishlist
  app.get("/api/wishlist", authenticate, async (req: any, res) => {
    try {
      const wishlistItems = await storage.getWishlist(req.user.id);
      
      // Get product details for each wishlist item
      const wishlistWithProducts = await Promise.all(
        wishlistItems.map(async (item) => {
          const product = await storage.getProduct(item.productId.toString());
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(wishlistWithProducts);
    } catch (error) {
      console.error("Get wishlist error:", error);
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });
  
  // Add to wishlist
  app.post("/api/wishlist", authenticate, async (req: any, res) => {
    try {
      const wishlistData = insertWishlistSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const wishlistItem = await storage.addToWishlist(wishlistData);
      res.status(201).json({
        message: "Item added to wishlist",
        wishlistItem
      });
    } catch (error) {
      console.error("Add to wishlist error:", error);
      res.status(400).json({ error: "Failed to add item to wishlist" });
    }
  });
  
  // Remove from wishlist
  app.delete("/api/wishlist/:id", authenticate, async (req: any, res) => {
    try {
      const success = await storage.removeFromWishlist(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Wishlist item not found" });
      }
      
      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      res.status(500).json({ error: "Failed to remove item from wishlist" });
    }
  });
  
  // ==================== ORDER ROUTES ====================
  
  // Create order with payment processing
  app.post("/api/orders", authenticate, async (req: any, res) => {
    try {
      const { items, shippingAddress, billingAddress, paymentMethod, paymentData } = req.body;
      
      // Calculate order totals
      let subtotal = 0;
      for (const item of items) {
        subtotal += parseFloat(item.price) * item.quantity;
      }
      
      const shipping = await paymentProcessor.calculateShipping(shippingAddress);
      const tax = await paymentProcessor.calculateTax(subtotal.toString(), shippingAddress);
      const total = subtotal + parseFloat(shipping.cost) + parseFloat(tax);
      
      // Process payment
      const paymentResult = await paymentProcessor.processPayment({
        ...paymentData,
        paymentMethod,
        amount: total
      });
      
      if (!paymentResult.success) {
        return res.status(400).json({ error: paymentResult.error });
      }
      
      // Create order
      const orderResult = await paymentProcessor.createOrder({
        userId: req.user.id,
        items,
        shippingAddress,
        billingAddress,
        paymentMethod,
        subtotal: subtotal.toString(),
        shippingCost: shipping.cost,
        tax,
        total: total.toString()
      });
      
      if (!orderResult.success) {
        return res.status(400).json({ error: orderResult.error });
      }
      
      res.status(201).json({
        message: "Order created successfully",
        orderId: orderResult.orderId,
        paymentId: paymentResult.paymentId
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ error: "Failed to create order" });
    }
  });
  
  // Calculate order totals
  app.post("/api/orders/calculate", authenticate, async (req: any, res) => {
    try {
      const { items, shippingAddress, couponCode } = req.body;
      
      let subtotal = 0;
      for (const item of items) {
        subtotal += parseFloat(item.price) * item.quantity;
      }
      
      const shipping = await paymentProcessor.calculateShipping(shippingAddress);
      const tax = await paymentProcessor.calculateTax(subtotal.toString(), shippingAddress);
      
      let discount = "0.00";
      if (couponCode) {
        const couponResult = await paymentProcessor.applyCoupon(couponCode, subtotal.toString());
        if (couponResult.valid) {
          discount = couponResult.discount!;
        }
      }
      
      const total = subtotal + parseFloat(shipping.cost) + parseFloat(tax) - parseFloat(discount);
      
      res.json({
        subtotal: subtotal.toFixed(2),
        shipping: shipping.cost,
        tax,
        discount,
        total: total.toFixed(2),
        estimatedDelivery: shipping.estimatedDays
      });
    } catch (error) {
      console.error("Calculate order error:", error);
      res.status(400).json({ error: "Failed to calculate order totals" });
    }
  });
  
  // Apply coupon code
  app.post("/api/orders/apply-coupon", authenticate, async (req: any, res) => {
    try {
      const { code, subtotal } = req.body;
      
      const result = await paymentProcessor.applyCoupon(code, subtotal);
      
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({
        message: "Coupon applied successfully",
        discount: result.discount
      });
    } catch (error) {
      console.error("Apply coupon error:", error);
      res.status(400).json({ error: "Failed to apply coupon" });
    }
  });
  
  // Get user's orders
  app.get("/api/orders", authenticate, async (req: any, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const orders = await storage.getOrders(
        req.user.id,
        undefined,
        parseInt(page as string),
        parseInt(limit as string)
      );
      
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  
  // Get single order
  app.get("/api/orders/:id", authenticate, async (req: any, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Check if user owns this order or is admin
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  
  // Update order status (admin/vendor only)
  app.patch("/api/orders/:id/status", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const { status } = req.body;
      
      const order = await storage.updateOrderStatus(parseInt(req.params.id), status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({
        message: "Order status updated",
        order
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(400).json({ error: "Failed to update order status" });
    }
  });
  
  // ==================== VENDOR ROUTES ====================
  
  // Register as vendor
  app.post("/api/vendors/register", authenticate, async (req: any, res) => {
    try {
      const vendorData = insertVendorSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if user is already a vendor
      const existingVendor = await storage.getVendorByUserId(req.user.id);
      if (existingVendor) {
        return res.status(400).json({ error: "User is already registered as a vendor" });
      }
      
      const vendor = await storage.createVendor(vendorData);
      
      res.status(201).json({
        message: "Vendor registration submitted successfully",
        vendor
      });
    } catch (error) {
      console.error("Vendor registration error:", error);
      res.status(400).json({ error: "Failed to register as vendor" });
    }
  });
  
  // Get vendor profile
  app.get("/api/vendors/profile", authenticate, requireRole(["vendor", "admin"]), async (req: any, res) => {
    try {
      const vendor = await storage.getVendorByUserId(req.user.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor profile not found" });
      }
      
      res.json(vendor);
    } catch (error) {
      console.error("Get vendor profile error:", error);
      res.status(500).json({ error: "Failed to fetch vendor profile" });
    }
  });
  
  // Update vendor profile
  app.put("/api/vendors/profile", authenticate, requireRole(["vendor", "admin"]), async (req: any, res) => {
    try {
      const vendor = await storage.getVendorByUserId(req.user.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor profile not found" });
      }
      
      const vendorData = insertVendorSchema.partial().parse(req.body);
      
      const updatedVendor = await storage.updateVendor(vendor.id, vendorData);
      
      res.json({
        message: "Vendor profile updated successfully",
        vendor: updatedVendor
      });
    } catch (error) {
      console.error("Update vendor profile error:", error);
      res.status(400).json({ error: "Failed to update vendor profile" });
    }
  });
  
  // Get all vendors (admin only)
  app.get("/api/vendors", authenticate, requireRole(["admin"]), async (req: any, res) => {
    try {
      const { status } = req.query;
      
      const vendors = await storage.getVendors(status as string);
      res.json(vendors);
    } catch (error) {
      console.error("Get vendors error:", error);
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });
  
  // Approve/reject vendor (admin only)
  app.patch("/api/vendors/:id/status", authenticate, requireRole(["admin"]), async (req: any, res) => {
    try {
      const { status } = req.body;
      
      const vendor = await storage.updateVendor(parseInt(req.params.id), {
        status: status as any,
        approvedAt: status === "approved" ? new Date() : null
      });
      
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      
      res.json({
        message: `Vendor ${status} successfully`,
        vendor
      });
    } catch (error) {
      console.error("Update vendor status error:", error);
      res.status(400).json({ error: "Failed to update vendor status" });
    }
  });
  
  // ==================== ADDRESS ROUTES ====================
  
  // Get user's addresses
  app.get("/api/addresses", authenticate, async (req: any, res) => {
    try {
      const addresses = await storage.getAddresses(req.user.id);
      res.json(addresses);
    } catch (error) {
      console.error("Get addresses error:", error);
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  });
  
  // Create address
  app.post("/api/addresses", authenticate, async (req: any, res) => {
    try {
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const address = await storage.createAddress(addressData);
      
      res.status(201).json({
        message: "Address created successfully",
        address
      });
    } catch (error) {
      console.error("Create address error:", error);
      res.status(400).json({ error: "Failed to create address" });
    }
  });
  
  // Update address
  app.put("/api/addresses/:id", authenticate, async (req: any, res) => {
    try {
      const addressData = insertAddressSchema.partial().parse(req.body);
      
      const address = await storage.updateAddress(parseInt(req.params.id), addressData);
      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      
      res.json({
        message: "Address updated successfully",
        address
      });
    } catch (error) {
      console.error("Update address error:", error);
      res.status(400).json({ error: "Failed to update address" });
    }
  });
  
  // Delete address
  app.delete("/api/addresses/:id", authenticate, async (req: any, res) => {
    try {
      const success = await storage.deleteAddress(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Address not found" });
      }
      
      res.json({ message: "Address deleted successfully" });
    } catch (error) {
      console.error("Delete address error:", error);
      res.status(500).json({ error: "Failed to delete address" });
    }
  });
  
  // ==================== REVIEW ROUTES ====================
  
  // Get product reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  
  // Create review
  app.post("/api/products/:id/reviews", authenticate, async (req: any, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId: parseInt(req.params.id),
        userId: req.user.id
      });
      
      const review = await storage.createReview(reviewData);
      
      res.status(201).json({
        message: "Review created successfully",
        review
      });
    } catch (error) {
      console.error("Create review error:", error);
      res.status(400).json({ error: "Failed to create review" });
    }
  });
  
  // ==================== PROMO CODE ROUTES ====================
  
  // Validate promo code
  app.post("/api/promo-codes/validate", authenticate, async (req: any, res) => {
    try {
      const { code } = req.body;
      
      const promoCode = await storage.getPromoCode(code);
      if (!promoCode) {
        return res.status(404).json({ error: "Promo code not found" });
      }
      
      // Check if promo code is active and not expired
      if (!promoCode.isActive || (promoCode.expiresAt && promoCode.expiresAt < new Date())) {
        return res.status(400).json({ error: "Promo code is expired or inactive" });
      }
      
      // Check usage limit
      if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return res.status(400).json({ error: "Promo code usage limit reached" });
      }
      
      res.json({
        message: "Promo code is valid",
        promoCode: {
          id: promoCode.id,
          code: promoCode.code,
          type: promoCode.type,
          value: promoCode.value,
          minimumAmount: promoCode.minimumAmount
        }
      });
    } catch (error) {
      console.error("Validate promo code error:", error);
      res.status(500).json({ error: "Failed to validate promo code" });
    }
  });
  
  // ==================== CATEGORIES ROUTES ====================
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  
  // Create category (admin only)
  app.post("/api/categories", authenticate, requireRole(["admin"]), async (req: any, res) => {
    try {
      const categoryData = req.body;
      
      const category = await storage.createCategory(categoryData);
      
      res.status(201).json({
        message: "Category created successfully",
        category
      });
    } catch (error) {
      console.error("Create category error:", error);
      res.status(400).json({ error: "Failed to create category" });
    }
  });
  
  // ==================== ANALYTICS ROUTES ====================
  
  // Get sales analytics
  app.get("/api/analytics/sales", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const analytics = await analyticsService.getSalesAnalytics(start, end);
      res.json(analytics);
    } catch (error) {
      console.error("Get sales analytics error:", error);
      res.status(500).json({ error: "Failed to fetch sales analytics" });
    }
  });
  
  // Get customer analytics
  app.get("/api/analytics/customers", authenticate, requireRole(["admin"]), async (req: any, res) => {
    try {
      const analytics = await analyticsService.getCustomerAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Get customer analytics error:", error);
      res.status(500).json({ error: "Failed to fetch customer analytics" });
    }
  });
  
  // Get vendor analytics
  app.get("/api/analytics/vendors", authenticate, requireRole(["admin"]), async (req: any, res) => {
    try {
      const analytics = await analyticsService.getVendorAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Get vendor analytics error:", error);
      res.status(500).json({ error: "Failed to fetch vendor analytics" });
    }
  });
  
  // Get product performance
  app.get("/api/analytics/products/:id", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const performance = await analyticsService.getProductPerformance(req.params.id);
      res.json(performance);
    } catch (error) {
      console.error("Get product performance error:", error);
      res.status(500).json({ error: "Failed to fetch product performance" });
    }
  });
  
  // Get revenue by period
  app.get("/api/analytics/revenue", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const { period, startDate, endDate } = req.query;
      
      if (!period || !startDate || !endDate) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      const revenue = await analyticsService.getRevenueByPeriod(
        period as 'daily' | 'weekly' | 'monthly' | 'yearly',
        start,
        end
      );
      
      res.json(revenue);
    } catch (error) {
      console.error("Get revenue by period error:", error);
      res.status(500).json({ error: "Failed to fetch revenue data" });
    }
  });
  
  // Get inventory analytics
  app.get("/api/analytics/inventory", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const analytics = await analyticsService.getInventoryAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Get inventory analytics error:", error);
      res.status(500).json({ error: "Failed to fetch inventory analytics" });
    }
  });
  
  // Get conversion funnel
  app.get("/api/analytics/conversion-funnel", authenticate, requireRole(["admin"]), async (req: any, res) => {
    try {
      const funnel = await analyticsService.getConversionFunnel();
      res.json(funnel);
    } catch (error) {
      console.error("Get conversion funnel error:", error);
      res.status(500).json({ error: "Failed to fetch conversion funnel" });
    }
  });
  
  // Get customer segmentation
  app.get("/api/analytics/customer-segmentation", authenticate, requireRole(["admin"]), async (req: any, res) => {
    try {
      const segmentation = await analyticsService.getCustomerSegmentation();
      res.json(segmentation);
    } catch (error) {
      console.error("Get customer segmentation error:", error);
      res.status(500).json({ error: "Failed to fetch customer segmentation" });
    }
  });
  
  // ==================== INVENTORY MANAGEMENT ROUTES (DEPRECATED - USING NEW ROUTER SYSTEM) ====================
  // Note: Commented out to prevent conflicts with new inventory-routes.ts system
  // The new system uses inventory-routes.ts without authentication middleware for better compatibility
  
  /*
  // Get inventory level for a product
  app.get("/api/inventory/:productId", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const inventory = await inventoryManager.getInventoryLevel(req.params.productId);
      if (!inventory) {
        return res.status(404).json({ error: "Product not found in inventory" });
      }
      res.json(inventory);
    } catch (error) {
      console.error("Get inventory level error:", error);
      res.status(500).json({ error: "Failed to fetch inventory level" });
    }
  });
  
  // Update inventory
  app.post("/api/inventory/:productId/update", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const { quantity, reason } = req.body;
      
      const success = await inventoryManager.updateInventory(
        req.params.productId,
        quantity,
        reason
      );
      
      if (!success) {
        return res.status(404).json({ error: "Product not found in inventory" });
      }
      
      res.json({ message: "Inventory updated successfully" });
    } catch (error) {
      console.error("Update inventory error:", error);
      res.status(500).json({ error: "Failed to update inventory" });
    }
  });
  
  // Get low stock items
  app.get("/api/inventory/low-stock", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const lowStockItems = await inventoryManager.getLowStockItems();
      res.json(lowStockItems);
    } catch (error) {
      console.error("Get low stock items error:", error);
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  });
  
  // Get stock movements
  app.get("/api/inventory/movements", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const { productId, startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const movements = await inventoryManager.getStockMovements(
        productId as string,
        start,
        end
      );
      
      res.json(movements);
    } catch (error) {
      console.error("Get stock movements error:", error);
      res.status(500).json({ error: "Failed to fetch stock movements" });
    }
  });
  
  // Get inventory report
  app.get("/api/inventory/report", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const report = await inventoryManager.getInventoryReport();
      res.json(report);
    } catch (error) {
      console.error("Get inventory report error:", error);
      res.status(500).json({ error: "Failed to fetch inventory report" });
    }
  });
  
  // Perform inventory adjustment
  app.post("/api/inventory/:productId/adjust", authenticate, requireRole(["admin", "vendor"]), async (req: any, res) => {
    try {
      const { newQuantity, reason } = req.body;
      
      const success = await inventoryManager.performInventoryAdjustment(
        req.params.productId,
        newQuantity,
        reason
      );
      
      if (!success) {
        return res.status(404).json({ error: "Product not found in inventory" });
      }
      
      res.json({ message: "Inventory adjusted successfully" });
    } catch (error) {
      console.error("Inventory adjustment error:", error);
      res.status(500).json({ error: "Failed to adjust inventory" });
    }
  });
  */
  
  // Initialize inventory management
  inventoryManager.initializeInventory();
}