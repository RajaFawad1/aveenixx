# AVEENIX Hub - Unified SaaS + E-Commerce Platform

## 📋 Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Frontend Components](#frontend-components)
- [Backend Routes & APIs](#backend-routes--apis)
- [Database Schema](#database-schema)
- [Authentication System](#authentication-system)
- [Cart & Checkout Flow](#cart--checkout-flow)
- [Payment Integration](#payment-integration)
- [Installation & Setup](#installation--setup)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## 🌟 Overview

AVEENIX Hub is a comprehensive unified SaaS + E-Commerce platform designed with an Odoo-style modular architecture. The platform features role-based access control, shared components, and supports both affiliate and regular product sales with a sophisticated commission system.

### Key Features
- **Universal Product Import**: Multi-marketplace integration (Amazon, AliExpress, WooCommerce)
- **Authentication-Gated Cart**: Login required for all products to enable customer tracking
- **Hybrid Product Types**: Supports affiliate, dropship, and regular products
- **Advanced Analytics**: Real-time data and comprehensive reporting
- **Role-Based Access**: SuperAdmin, Admin, Vendor, Customer roles
- **Premium UI/UX**: Professional design with global theming system

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + TanStack Query
- **Authentication**: Custom JWT-based system
- **Payment**: Stripe + PayPal integration

### Project Structure
```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── providers/       # Context providers
│   │   └── utils/           # Utility functions
├── server/                   # Express.js backend
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations
│   └── index.ts            # Server entry point
├── shared/                   # Shared types and schemas
│   └── schema.ts           # Database schema definitions
└── migrations/              # Database migrations
```

## 🧩 Frontend Components

### Core Layout Components
- **`MainEcommerceLayout.tsx`**: Main layout wrapper with header/footer
- **`StickyHeaderFull.tsx`**: Full-featured header with navigation
- **`StickyHeaderGeneric.tsx`**: Simplified header for specific pages
- **`EcommerceFooter.tsx`**: Site-wide footer with links and info

### Product Components
- **`ProductCard.tsx`**: Universal product display card
- **`ProductDetailPage.tsx`**: Detailed product view with recommendations
- **`QuickViewModal.tsx`**: Modal for quick product preview
- **`ProductGrid.tsx`**: Grid layout for product listings

### Shopping Components
- **`CartPage.tsx`**: Full cart management interface
- **`CartDropdown.tsx`**: Quick cart summary dropdown
- **`QuickCheckoutPage.tsx`**: Single-page checkout experience
- **`CheckoutRouter.tsx`**: Routes checkout flow based on product types

### Authentication Components
- **`LoginModal.tsx`**: Authentication modal interface
- **`AuthProvider.tsx`**: Authentication state management

### Category & Navigation
- **`CategoriesPage.tsx`**: Category browsing interface
- **`CategoryPage.tsx`**: Individual category product listings
- **`UniversalSearch.tsx`**: Global search functionality

### User Account Components
- **`MyOrders.tsx`**: Order history and tracking
- **`Wishlist.tsx`**: Saved products management
- **`Addresses.tsx`**: Shipping address management
- **`Notifications.tsx`**: User notification center

### Administrative Components
- **`EnterpriseDashboard.tsx`**: Main admin dashboard
- **`AdminPanel.tsx`**: Administrative controls
- **`VendorDashboard.tsx`**: Vendor management interface

## 🛣️ Backend Routes & APIs

### Authentication Routes
```javascript
POST /api/auth/login          # User login
POST /api/auth/register       # User registration  
POST /api/auth/logout         # User logout
GET  /api/auth/user          # Get current user info
```

### Product Routes
```javascript
GET    /api/products                    # Get all products
GET    /api/products/:id               # Get single product
GET    /api/products/by-category/:cat  # Get products by category
GET    /api/products/by-subcategory/:sub # Get products by subcategory
POST   /api/products                   # Create product (admin)
PUT    /api/products/:id              # Update product (admin)
DELETE /api/products/:id              # Delete product (admin)
```

### Category Routes
```javascript
GET /api/categories           # Get all categories
GET /api/categories/:id       # Get single category
```

### Cart Routes
```javascript
GET    /api/cart             # Get user's cart
POST   /api/cart/add         # Add item to cart
PUT    /api/cart/update      # Update cart item
DELETE /api/cart/remove/:id  # Remove item from cart
POST   /api/cart/clear       # Clear entire cart
```

### Order Routes
```javascript
GET  /api/orders             # Get user's orders
POST /api/orders             # Create new order
GET  /api/orders/:id         # Get single order
PUT  /api/orders/:id/status  # Update order status (admin)
```

### User Management Routes
```javascript
GET    /api/users            # Get all users (admin)
GET    /api/users/:id        # Get single user
PUT    /api/users/:id        # Update user profile
DELETE /api/users/:id        # Delete user (admin)
```

### Address Routes
```javascript
GET    /api/addresses        # Get user's addresses
POST   /api/addresses        # Add new address
PUT    /api/addresses/:id    # Update address
DELETE /api/addresses/:id    # Delete address
```

### Payment Routes
```javascript
POST /api/stripe/create-payment-intent    # Create Stripe payment
POST /api/paypal/create-order             # Create PayPal order
POST /api/paypal/capture-order            # Capture PayPal payment
```

### Utility Routes
```javascript
GET  /api/notifications       # Get user notifications
GET  /api/notifications/count # Get notification count
GET  /api/weather            # Get weather data
POST /api/user/auto-detect-location # Auto-detect user location
PUT  /api/user/preferences   # Update user preferences
```

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
users {
  id: string (primary key)
  email: string (unique)
  firstName: string
  lastName: string
  profileImageUrl: string
  role: enum ('superadmin', 'admin', 'vendor', 'customer', 'business')
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Products Table
```sql
products {
  id: string (primary key)
  name: string
  price: decimal
  originalPrice: decimal
  salePrice: decimal
  description: text
  imageUrl: string
  category: string
  brand: string
  sku: string
  stock: integer
  isActive: boolean
  productType: enum ('affiliate', 'dropship', 'regular')
  affiliateUrl: string
  sourcePlatform: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Orders Table
```sql
orders {
  id: string (primary key)
  userId: string (foreign key)
  status: enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
  totalAmount: decimal
  shippingAddress: jsonb
  paymentMethod: string
  paymentStatus: enum ('pending', 'paid', 'failed', 'refunded')
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Cart Items Table
```sql
cartItems {
  id: string (primary key)
  userId: string (foreign key)
  productId: string (foreign key)
  quantity: integer
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🔐 Authentication System

### Authentication Flow
1. User submits login credentials via `LoginModal`
2. `AuthProvider` handles authentication state
3. JWT token stored in localStorage
4. Protected routes check authentication status
5. User context available throughout application

### Role-Based Access Control
- **SuperAdmin**: Full system access
- **Admin**: Administrative functions
- **Vendor**: Product and order management
- **Business**: Enhanced customer features
- **Customer**: Basic shopping functionality

## 🛒 Cart & Checkout Flow

### Cart System Features
- **Session-based**: Guest cart support
- **Database Persistence**: Authenticated user carts
- **Product Type Handling**: Affiliate vs regular products
- **Quantity Management**: Update/remove items
- **Price Calculations**: Dynamic pricing with discounts

### Checkout Process
1. **Cart Review** (`CartPage.tsx`)
2. **Authentication Check** (Login required)
3. **Checkout Routing** (`CheckoutRouter.tsx`)
4. **Address Selection** (`AddressSelectionPage.tsx`)
5. **Payment Method** (`PaymentMethodPage.tsx`)
6. **Order Review** (`OrderReviewPage.tsx`)
7. **Payment Processing** (Stripe/PayPal)
8. **Order Confirmation** (`OrderConfirmationPageNew.tsx`)

### Product Type Handling
- **Regular Products**: Standard Aveenix checkout
- **Affiliate Products**: Redirect to external marketplace
- **Dropship Products**: Special handling for vendor fulfillment

## 💳 Payment Integration

### Stripe Integration
- Payment intents for secure processing
- Card payment support
- Webhook handling for payment events
- Refund management

### PayPal Integration
- PayPal checkout buttons
- Order creation and capture
- Express checkout support
- Subscription handling

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- PayPal developer account

### Environment Variables
```bash
DATABASE_URL=your_postgresql_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
JWT_SECRET=your_jwt_secret
```

### Installation Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

## 📐 Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint + Prettier for formatting
- Component-based architecture
- Custom hooks for business logic
- Context providers for state management

### Database Operations
- Use Drizzle ORM for all database operations
- Define schemas in `shared/schema.ts`
- Use migrations for schema changes
- Implement proper error handling

### API Design
- RESTful endpoints
- Consistent response formats
- Proper HTTP status codes
- Input validation with Zod schemas
- Error handling middleware

### UI/UX Standards
- Mobile-first responsive design
- Consistent component styling
- Global theming system
- Accessibility best practices
- Loading states for all async operations

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify DATABASE_URL environment variable
- Check PostgreSQL service status
- Ensure database exists and user has permissions

#### Payment Integration Issues
- Verify Stripe/PayPal API keys
- Check webhook configurations
- Ensure HTTPS in production

#### Authentication Problems
- Clear localStorage and cookies
- Verify JWT secret configuration
- Check token expiration settings

#### Performance Issues
- Monitor database query performance
- Implement proper caching strategies
- Optimize image loading
- Use React.memo for expensive components

### Debugging Tips
- Check browser developer console
- Monitor network requests
- Use React Developer Tools
- Review server logs for API errors

## 📈 Performance Monitoring

### Key Metrics to Monitor
- Page load times
- API response times  
- Database query performance
- Cart conversion rates
- Payment success rates

### Optimization Strategies
- Image optimization and lazy loading
- API response caching
- Database query optimization
- Code splitting and lazy loading
- CDN usage for static assets

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Payment webhooks configured
- [ ] Error monitoring setup
- [ ] Performance monitoring enabled
- [ ] Backup strategies implemented

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Code review and approval
6. Merge to main branch

### Code Quality Standards
- Minimum 80% test coverage
- TypeScript strict mode
- ESLint compliance
- Proper error handling
- Documentation for complex logic

---

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting guide
- Contact development team

**Last Updated**: August 21, 2025
**Version**: 2.1.0