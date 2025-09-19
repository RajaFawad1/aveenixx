import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import { LocalizationProvider } from "@/components/providers/LocalizationProvider";
import { CartProvider } from "@/contexts/CartContext";
import JarvisFloatingChat from "@/components/JarvisFloatingChat";

// E-commerce Pages
import HomePage from "@/pages/HomePage";

import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import Success from "@/pages/Success";
import StripeCheckout from "@/pages/StripeCheckout";
import PayPalCheckout from "@/pages/PayPalCheckout";
import OrderConfirmationPageNew from "@/pages/OrderConfirmationPageNew";
import ThankYouPage from "@/pages/ThankYouPage";
import QuickCheckoutPage from "@/pages/QuickCheckoutPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryPage from "@/pages/CategoryPage";
import ShopPage from "@/pages/ShopPage";
import CategoryNavigation from "@/pages/CategoryNavigation";

// Platform Pages
import EnterpriseDashboard from "@/pages/EnterpriseDashboard";
import RoleBasedDashboard from "@/components/dashboard/RoleBasedDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import TestAPI from "@/pages/TestAPI";


import EnhancedDashboard from "@/pages/EnhancedDashboard";
import CommunityHub from "@/pages/CommunityHub";
import CommunityRewards from "@/pages/CommunityRewards";
import RewardsAndTasks from "@/components/RewardsAndTasks";
import TaskManager from "@/components/TaskManager";

// User Account Pages
import Addresses from "@/pages/Addresses";
import Favourites from "@/pages/Favourites";
import Wishlist from "@/pages/Wishlist";
import Notifications from "@/pages/Notifications";


// Legal & Information Pages
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import ReturnsPolicy from "@/pages/ReturnsPolicy";
import SellerPolicy from "@/pages/SellerPolicy";
import SecurityPolicy from "@/pages/SecurityPolicy";
import ShippingInfo from "@/pages/ShippingInfo";

// Shopping & Discovery Pages
import Brands from "@/pages/Brands";
import Deals from "@/pages/Deals";
import GiftCards from "@/pages/GiftCards";
import Compare from "@/pages/Compare";


// E-commerce Service Pages
import MyOrders from "@/pages/MyOrders";
import Sellers from "@/pages/Sellers";
import SiteMap from "@/pages/SiteMap";
import StoreLocator from "@/pages/StoreLocator";
import TrackOrder from "@/pages/TrackOrder";
import Community from "@/pages/Community";
import ExternalOrderConfirmation from "@/pages/ExternalOrderConfirmation";

// Admin Pages
import AdminHome from "@/pages/admin/AdminHome";
import ProductManagement from "@/pages/ProductManagement";
import RateCardManager from "@/pages/RateCardManager";
import InventoryManagement from "@/pages/InventoryManagement";
import SalesManagement from "@/pages/SalesManagement";
import WooCommerceCategoryManager from "@/pages/WooCommerceCategoryManager";

// Test Pages

// Jarvis Business Suite Pages
import JarvisDashboard from "@/pages/jarvis/JarvisDashboard";
import Helpdesk from "@/pages/Helpdesk";
import Logout from "@/pages/Logout";

// Vendor Pages
import RegisterVendor from "@/pages/RegisterVendor";
import VendorProductListing from "@/pages/vendor/ProductListing";
import VendorOverview from "@/pages/vendor/Overview";
import VendorProducts from "@/pages/vendor/Products";
import VendorOrders from "@/pages/vendor/Orders";
import VendorProductUpload from "@/pages/vendor/VendorProductUpload";
import VendorSettings from "@/pages/vendor/Settings";
import VendorReports from "@/pages/vendor/Reports";

// Module Pages - Placeholder imports for future implementation
// import WorkshopDashboard from "@/modules/workshop/pages/index";
// import CustomerDashboard from "@/modules/portal/pages/index";
// import DirectoryDashboard from "@/modules/directory/pages/index";
// import AutoblogDashboard from "@/modules/autoblog/pages/index";

function Router() {
  const ProtectedAccount = () => {
    const { isLoggedIn, user } = useAuth();
    const [, navigate] = useLocation();
    if (!isLoggedIn) {
      navigate("/");
      return null;
    }
    if (user?.role === "admin" || user?.role === "superadmin") {
      navigate("/account-dashboard");
      return null;
    }
    if (user?.role === "vendor") {
      navigate("/vendor");
      return null;
    }
    // For customers, show dedicated customer dashboard
    return <CustomerDashboard />;
  };

  const AdminOnlyEnterprise = () => {
    const { user } = useAuth();
    const [, navigate] = useLocation();
    if (!user) {
      navigate("/");
      return null;
    }
    if (user.role !== "admin" && user.role !== "superadmin") {
      navigate("/account");
      return null;
    }
    return <EnterpriseDashboard />;
  };

  return (
    <Switch>

      
      {/* E-commerce Routes */}
      <Route path="/" component={HomePage} />

      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={QuickCheckoutPage} />
      <Route path="/checkout/quick" component={QuickCheckoutPage} />
      <Route path="/checkout/success" component={Success} />
      <Route path="/stripe-checkout" component={StripeCheckout} />
      <Route path="/paypal-checkout" component={PayPalCheckout} />
      <Route path="/success" component={Success} />
      <Route path="/order/confirmation/external" component={ExternalOrderConfirmation} />
      <Route path="/external-order-confirmation" component={ExternalOrderConfirmation} />
      <Route path="/order/confirmation/:orderId" component={OrderConfirmationPageNew} />
      <Route path="/thank-you" component={ThankYouPage} />

      <Route path="/categories" component={CategoriesPage} />
      <Route path="/category-nav" component={CategoryNavigation} />
      <Route path="/category/:category" component={CategoryPage} />
      <Route path="/shop" component={ShopPage} />
      
      {/* User Account Routes */}
      <Route path="/account" component={ProtectedAccount} />
      <Route path="/account/orders" component={ProtectedAccount} />
      <Route path="/account/track-orders" component={ProtectedAccount} />
      <Route path="/account/addresses" component={ProtectedAccount} />
      <Route path="/account/wishlist" component={ProtectedAccount} />
      <Route path="/account/rewards" component={ProtectedAccount} />
      <Route path="/account/notifications" component={ProtectedAccount} />
      <Route path="/account/payments" component={ProtectedAccount} />
      <Route path="/account-dashboard" component={AdminOnlyEnterprise} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/addresses" component={Addresses} />
      <Route path="/favourites" component={Favourites} />
      <Route path="/wishlist" component={Wishlist} />
      
      {/* Developer Tools */}
      <Route path="/test-api" component={TestAPI} />

      <Route path="/enhanced-dashboard" component={EnhancedDashboard} />
      <Route path="/community-hub" component={CommunityHub} />
      <Route path="/community-rewards" component={CommunityRewards} />
      <Route path="/tasks" component={TaskManager} />
      <Route path="/logout" component={Logout} />
      
      {/* Test Pages */}
      
      {/* Legal & Information Routes */}
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/legal" component={TermsOfService} />
      <Route path="/returns" component={ReturnsPolicy} />
      <Route path="/seller" component={SellerPolicy} />
      <Route path="/security" component={SecurityPolicy} />
      <Route path="/shipping" component={ShippingInfo} />
      
      {/* Shopping & Discovery Routes */}
      <Route path="/brands" component={Brands} />
      <Route path="/deals" component={Deals} />
      <Route path="/gift-cards" component={GiftCards} />
      <Route path="/compare" component={Compare} />

      
      {/* E-commerce Service Routes */}
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/sellers" component={Sellers} />
      <Route path="/sitemap" component={SiteMap} />
      <Route path="/store-locator" component={StoreLocator} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/community" component={Community} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminHome} />
      <Route path="/product-management" component={ProductManagement} />
      <Route path="/rate-card-manager" component={RateCardManager} />
      <Route path="/inventory-management" component={InventoryManagement} />
      <Route path="/sales-management" component={SalesManagement} />
      <Route path="/woocommerce-categories" component={WooCommerceCategoryManager} />
      
      {/* Jarvis Business Suite Routes */}
      <Route path="/jarvis" component={JarvisDashboard} />
      <Route path="/helpdesk" component={Helpdesk} />
      
      {/* Vendor Routes */}
      <Route path="/vendor" component={VendorOverview} />
      <Route path="/vendor/products" component={VendorProducts} />
      <Route path="/vendor/orders" component={VendorOrders} />
      <Route path="/vendor/upload" component={VendorProductUpload} />
      <Route path="/vendor/settings" component={VendorSettings} />
      <Route path="/vendor/reports" component={VendorReports} />
      <Route path="/vendor/register" component={RegisterVendor} />
      <Route path="/vendor/products/listing" component={VendorProductListing} />
      

    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocalizationProvider>
          <ThemeProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
                <JarvisFloatingChat />
              </TooltipProvider>
            </CartProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
