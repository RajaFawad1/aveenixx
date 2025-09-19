// Role and permissions logic for Aveenix E-commerce Platform

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPPORT = 'support',
  VENDOR = 'vendor'
}

export enum Permission {
  // Product permissions
  VIEW_PRODUCTS = 'view_products',
  CREATE_PRODUCTS = 'create_products',
  UPDATE_PRODUCTS = 'update_products',
  DELETE_PRODUCTS = 'delete_products',
  
  // Order permissions
  VIEW_ORDERS = 'view_orders',
  VIEW_ALL_ORDERS = 'view_all_orders',
  UPDATE_ORDER_STATUS = 'update_order_status',
  CANCEL_ORDERS = 'cancel_orders',
  
  // User permissions
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  UPDATE_USERS = 'update_users',
  DELETE_USERS = 'delete_users',
  
  // Review permissions
  VIEW_REVIEWS = 'view_reviews',
  CREATE_REVIEWS = 'create_reviews',
  UPDATE_REVIEWS = 'update_reviews',
  DELETE_REVIEWS = 'delete_reviews',
  MODERATE_REVIEWS = 'moderate_reviews',
  
  // Category permissions
  VIEW_CATEGORIES = 'view_categories',
  CREATE_CATEGORIES = 'create_categories',
  UPDATE_CATEGORIES = 'update_categories',
  DELETE_CATEGORIES = 'delete_categories',
  
  // Analytics permissions
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_SALES_REPORTS = 'view_sales_reports',
  
  // Support permissions
  VIEW_SUPPORT_TICKETS = 'view_support_tickets',
  RESPOND_TO_TICKETS = 'respond_to_tickets',
  
  // System permissions
  MANAGE_SYSTEM = 'manage_system',
  VIEW_LOGS = 'view_logs'
}

// Role-based permission mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.CREATE_REVIEWS,
    Permission.UPDATE_REVIEWS,
    Permission.VIEW_REVIEWS,
    Permission.VIEW_CATEGORIES
  ],
  
  [UserRole.VENDOR]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCTS,
    Permission.UPDATE_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_REVIEWS,
    Permission.VIEW_CATEGORIES,
    Permission.VIEW_ANALYTICS
  ],
  
  [UserRole.SUPPORT]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_ALL_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.VIEW_USERS,
    Permission.VIEW_REVIEWS,
    Permission.MODERATE_REVIEWS,
    Permission.VIEW_SUPPORT_TICKETS,
    Permission.RESPOND_TO_TICKETS,
    Permission.VIEW_CATEGORIES
  ],
  
  [UserRole.MANAGER]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCTS,
    Permission.UPDATE_PRODUCTS,
    Permission.DELETE_PRODUCTS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_ALL_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.CANCEL_ORDERS,
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.UPDATE_USERS,
    Permission.VIEW_REVIEWS,
    Permission.CREATE_REVIEWS,
    Permission.UPDATE_REVIEWS,
    Permission.DELETE_REVIEWS,
    Permission.MODERATE_REVIEWS,
    Permission.VIEW_CATEGORIES,
    Permission.CREATE_CATEGORIES,
    Permission.UPDATE_CATEGORIES,
    Permission.DELETE_CATEGORIES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_SALES_REPORTS,
    Permission.VIEW_SUPPORT_TICKETS,
    Permission.RESPOND_TO_TICKETS
  ],
  
  [UserRole.ADMIN]: [
    ...Object.values(Permission) // Admin has all permissions
  ]
};

// Permission checking functions
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission);
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Resource-based permissions
export function canViewProduct(userRole: UserRole, productId: string, ownerId?: string): boolean {
  if (hasPermission(userRole, Permission.VIEW_PRODUCTS)) {
    return true;
  }
  
  // Vendors can only view their own products
  if (userRole === UserRole.VENDOR && ownerId) {
    return ownerId === productId; // This would be userId in real implementation
  }
  
  return false;
}

export function canEditProduct(userRole: UserRole, productId: string, ownerId?: string): boolean {
  if (hasPermission(userRole, Permission.UPDATE_PRODUCTS)) {
    return true;
  }
  
  // Vendors can only edit their own products
  if (userRole === UserRole.VENDOR && ownerId) {
    return ownerId === productId;
  }
  
  return false;
}

export function canViewOrder(userRole: UserRole, orderId: string, customerId?: string): boolean {
  // Admin, Manager, Support can view all orders
  if (hasPermission(userRole, Permission.VIEW_ALL_ORDERS)) {
    return true;
  }
  
  // Customers can only view their own orders
  if (userRole === UserRole.CUSTOMER && customerId) {
    return customerId === orderId; // This would be userId in real implementation
  }
  
  return false;
}

export function canModerateReview(userRole: UserRole): boolean {
  return hasPermission(userRole, Permission.MODERATE_REVIEWS);
}

// Helper function to get user permissions
export function getUserPermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole];
}

// Helper function to check if role is elevated
export function isElevatedRole(userRole: UserRole): boolean {
  return [UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPPORT].includes(userRole);
}

// Helper function to check if user can access admin panel
export function canAccessAdminPanel(userRole: UserRole): boolean {
  return [UserRole.ADMIN, UserRole.MANAGER].includes(userRole);
}

// Helper function to check if user can handle support requests
export function canHandleSupport(userRole: UserRole): boolean {
  return hasPermission(userRole, Permission.RESPOND_TO_TICKETS);
}

// Default role assignment
export const DEFAULT_ROLE = UserRole.CUSTOMER;

// Role hierarchy for comparison
export const roleHierarchy = {
  [UserRole.CUSTOMER]: 0,
  [UserRole.VENDOR]: 1,
  [UserRole.SUPPORT]: 2,
  [UserRole.MANAGER]: 3,
  [UserRole.ADMIN]: 4
};

// Check if one role is higher than another
export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return roleHierarchy[role1] > roleHierarchy[role2];
}