import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Plus, Minus, Trash2, ShoppingCart, Heart, Gift, Truck, Calculator, Tag, ArrowRight, Home, ChevronRight, Clock, CheckCircle, AlertCircle, X, ExternalLink, Star, TrendingUp, Eye, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { useToast } from "@/hooks/use-toast";
import MainEcommerceLayout from "@/components/layout/MainEcommerceLayout";
import { useCart } from "@/contexts/CartContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWishlist } from "@/hooks/useWishlist";

const mockCart = [
  {
    id: "1",
    name: "Apple Watch Series 9",
    price: 399.99,
    originalPrice: 449.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
    brand: "Apple",
    color: "Midnight",
    size: "45mm",
    inStock: true,
    stockCount: 15,
    estimatedDelivery: "2-3 business days",
    weight: 0.4,
    type: "internal"
  },
  {
    id: "2",
    name: "Sony WH-1000XM4 Wireless Headphones",
    price: 149.99,
    originalPrice: 199.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop",
    brand: "Sony",
    color: "Black",
    inStock: true,
    stockCount: 8,
    estimatedDelivery: "1-2 business days",
    weight: 0.3,
    type: "internal"
  },
  {
    id: "3",
    name: "iPad Pro 12.9-inch",
    price: 899.99,
    originalPrice: 999.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    brand: "Apple",
    color: "Space Gray",
    size: "256GB",
    inStock: true,
    stockCount: 3,
    estimatedDelivery: "3-4 business days",
    weight: 0.7,
    type: "internal"
  }
];

const promoCodes = [
  { code: "SAVE20", discount: 0.20, description: "20% off your order" },
  { code: "FIRST10", discount: 0.10, description: "10% off for first-time buyers" },
  { code: "WELCOME15", discount: 0.15, description: "15% off welcome offer" },
  { code: "FREESHIP", discount: 0, description: "Free shipping on any order", freeShipping: true }
];

const shippingOptions = [
  { id: "standard", name: "Standard Shipping", price: 9.99, time: "5-7 business days", description: "Free on orders over $50" },
  { id: "express", name: "Express Shipping", price: 19.99, time: "2-3 business days", description: "Faster delivery" },
  { id: "overnight", name: "Overnight Shipping", price: 29.99, time: "1 business day", description: "Next day delivery" }
];

interface PromoCode {
  code: string;
  discount: number;
  description: string;
  freeShipping?: boolean;
}

// Transform platform names to user-friendly versions
const transformPlatformName = (platform: string) => {
  const platformMap: Record<string, string> = {
    'woocommerce': 'Amazon', // Default mapping for woocommerce imports
    'amazon': 'Amazon',
    'aliexpress': 'AliExpress', 
    'ebay': 'eBay',
    'walmart': 'Walmart',
    'shopify': 'Shopify'
  };
  return platformMap[platform?.toLowerCase()] || platform || 'Partner Site';
};

function CartContent() {
  const { cartItems: cart, updateQuantity: updateCartQuantity, removeFromCart, addToCart } = useCart();
  const [location, navigate] = useLocation();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [showShippingCalc, setShowShippingCalc] = useState(false);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Affiliate link tracking system
  const [openedAffiliateItems, setOpenedAffiliateItems] = useState<Set<string>>(new Set());

  // Load opened affiliate items from localStorage on component mount
  useEffect(() => {
    const savedOpenedItems = localStorage.getItem('aveenix-opened-affiliate-items');
    if (savedOpenedItems) {
      try {
        const parsed = JSON.parse(savedOpenedItems);
        const now = Date.now();
        // Filter out items older than 24 hours
        const validItems = Object.entries(parsed).reduce((acc: any, [id, timestamp]) => {
          if (now - (timestamp as number) < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
            acc[id] = timestamp;
          }
          return acc;
        }, {});
        
        // Update localStorage with cleaned data
        localStorage.setItem('aveenix-opened-affiliate-items', JSON.stringify(validItems));
        setOpenedAffiliateItems(new Set(Object.keys(validItems)));
        
        // Remove expired affiliate items from cart
        const expiredIds = Object.keys(parsed).filter(id => !validItems[id]);
        expiredIds.forEach(id => {
          removeFromCart(id);
        });
      } catch (error) {
        console.error('Error loading opened affiliate items:', error);
      }
    }
  }, [removeFromCart]);

  // Function to mark affiliate items as opened and set cleanup timer
  const markAffiliateItemsAsOpened = (items: any[]) => {
    const now = Date.now();
    const savedOpenedItems = JSON.parse(localStorage.getItem('aveenix-opened-affiliate-items') || '{}');
    
    items.forEach(item => {
      savedOpenedItems[item.id] = now;
    });
    
    localStorage.setItem('aveenix-opened-affiliate-items', JSON.stringify(savedOpenedItems));
    setOpenedAffiliateItems(new Set([...Array.from(openedAffiliateItems), ...items.map(item => item.id)]));
    
    // Schedule cleanup after 24 hours
    setTimeout(() => {
      items.forEach(item => {
        removeFromCart(item.id);
      });
      
      // Clean up localStorage
      const currentOpenedItems = JSON.parse(localStorage.getItem('aveenix-opened-affiliate-items') || '{}');
      items.forEach(item => {
        delete currentOpenedItems[item.id];
      });
      localStorage.setItem('aveenix-opened-affiliate-items', JSON.stringify(currentOpenedItems));
      
    }, 24 * 60 * 60 * 1000); // 24 hours
  };

  // Separate cart items into affiliate/external and regular Aveenix products
  const affiliateProducts = cart.filter(item => 
    item.affiliateUrl && (item.productType === 'affiliate' || item.productType === 'dropship')
  );
  const regularProducts = cart.filter(item => 
    !item.affiliateUrl || (item.productType !== 'affiliate' && item.productType !== 'dropship')
  );

  // Handle session storage data from checkout page
  useEffect(() => {
    const checkoutData = sessionStorage.getItem('addToCartFromCheckout');
    if (checkoutData) {
      try {
        const { product, quantity } = JSON.parse(checkoutData);
        
        // Add product to cart
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          sku: product.sku || product.id,
          brand: product.brand
        }, quantity);

        // Clear session storage
        sessionStorage.removeItem('addToCartFromCheckout');
        
        toast({
          title: "Product Added to Cart",
          description: `${product.name} has been added to your cart for editing.`,
        });
      } catch (error) {
        console.error('Error adding product from checkout:', error);
      }
    }
  }, [addToCart, toast]);

  const updateQuantity = async (id: string, delta: number) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      try {
        await updateCartQuantity(id, newQuantity);
      } catch (error) {
        toast({
          title: "Error updating quantity",
          description: "Failed to update item quantity",
          variant: "destructive",
        });
      }
    }
  };

  const removeItem = async (id: string) => {
    try {
      await removeFromCart(id);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error removing item",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const saveForLater = (id: string) => {
    const item = cart.find((item: any) => item.id === id);
    if (item) {
      setSavedItems([...savedItems, item]);
      removeFromCart(id);
      toast({
        title: "Item saved",
        description: "Item has been saved for later",
      });
    }
  };

  const moveToCart = async (id: string) => {
    const item = savedItems.find((item: any) => item.id === id);
    if (item) {
      try {
        // Add back to cart via API
        await updateCartQuantity(item.id, item.quantity);
        setSavedItems(savedItems.filter((item: any) => item.id !== id));
        toast({
          title: "Item moved to cart",
          description: "Item has been moved back to your cart",
        });
      } catch (error) {
        toast({
          title: "Error moving item",
          description: "Failed to move item back to cart",
          variant: "destructive",
        });
      }
    }
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      setPromoCode("");
      toast({
        title: "Promo code applied!",
        description: promo.description,
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again",
        variant: "destructive",
      });
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast({
      title: "Promo code removed",
      description: "Promo code has been removed from your order",
    });
  };

  // Calculate totals for ONLY regular products (exclude affiliate products)
  const subtotal = regularProducts.reduce((acc: number, item: any) => acc + (item.price || 0) * item.quantity, 0);
  const totalSavings = regularProducts.reduce((acc: number, item: any) => 
    acc + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0
  );
  const promoDiscount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);
  const shippingCost = appliedPromo?.freeShipping || (subtotal > 50 && selectedShipping === "standard") ? 0 : selectedShippingOption?.price || 0;
  const tax = (subtotal - promoDiscount) * 0.08; // 8% tax
  const total = subtotal - promoDiscount + shippingCost + tax;
  const totalWeight = regularProducts.reduce((acc: number, item: any) => acc + (item.weight || 0.5) * item.quantity, 0);

  if (cart.length === 0 && savedItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 text-center py-16">
        <div className="mb-8">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Discover amazing products and start shopping!</p>
          <Button 
            onClick={() => navigate("/")}
            className="font-semibold px-8 py-3"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full md:max-w-[1500px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        <Link href="/" className="hover:text-yellow-500 flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-medium">Shopping Cart</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>
        {totalSavings > 0 && (
          <Badge className="bg-green-100 text-green-800 px-3 py-1 self-start sm:self-center">
            You're saving <PriceDisplay price={typeof totalSavings === 'number' ? totalSavings : parseFloat(totalSavings || '0')} size="sm" className="inline" />!
          </Badge>
        )}
      </div>

      {/* Checkout Progress Indicator */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700">
              <div className="h-full bg-green-500 transition-all duration-500" style={{width: '0%'}}></div>
            </div>
            
            {/* Steps */}
            <div className="flex justify-between w-full relative z-10">
              {/* Cart Step - Current */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold shadow-md">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">Cart</span>
              </div>
              
              {/* Shipping Step */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold shadow-md">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Shipping</span>
              </div>
              
              {/* Payment Step */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Payment</span>
              </div>
              
              {/* Review Step */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold shadow-md">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Cart Items Section */}
        <div className="space-y-6">
          
          {/* Empty Cart State */}
          {cart.length === 0 && (
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg text-center py-16 rounded-xl">
              <CardContent>
                <ShoppingCart className="w-20 h-20 mx-auto text-gray-400 mb-6" />
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">Your cart is empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Add some amazing products to get started!</p>
                <Button 
                  onClick={() => navigate("/")}
                  className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Affiliate/External Products Section */}
          {affiliateProducts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              <div className="lg:col-span-7 space-y-3">
              {affiliateProducts.map((item: any) => {
                const isOpened = openedAffiliateItems.has(item.id);
                return (
                <Card key={item.id} className={`overflow-hidden border-0 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 ${
                  isOpened 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Link href={`/product/${item.productId || item.id}`} className="flex-shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      </Link>
                      
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/product/${item.productId || item.id}`} className="block hover:text-blue-600 transition-colors flex-1">
                            <h4 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 leading-tight">{item.name}</h4>
                          </Link>
                          {isOpened && (
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                              ✓ Opened
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${
                          isOpened ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {isOpened ? 'Link opened - Complete purchase within 24hrs' : (item.brand || 'Brand')}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base font-bold text-gray-900 dark:text-white">
                            <PriceDisplay price={typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')} size="md" className="inline" />
                          </span>
                          {item.sourcePlatform && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              From {transformPlatformName(item.sourcePlatform)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (item.affiliateUrl) {
                                // Mark this individual item as opened
                                markAffiliateItemsAsOpened([item]);
                                
                                // Open the affiliate URL
                                window.open(item.affiliateUrl, '_blank');
                                
                                toast({
                                  title: "Partner Link Opened",
                                  description: `Opened ${transformPlatformName(item.sourcePlatform)} link. Product will remain in cart for 24 hours.`,
                                  duration: 4000,
                                });
                              }
                            }}
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Buy on {transformPlatformName(item.sourcePlatform)}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
              </div>
              
              {/* External Platform Products Total Summary */}
              <div className="lg:col-span-3">
                <div className="sticky top-4">
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-lg rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base text-blue-800 dark:text-blue-200 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Aveenix Partner Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Individual Item Breakdown */}
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {affiliateProducts.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-start text-xs">
                              <Link 
                                href={`/product/${item.productId || item.id}`}
                                className="flex-1 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 truncate pr-2 transition-colors"
                              >
                                • {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                              </Link>
                              <span className="text-blue-600 dark:text-blue-400 whitespace-nowrap font-medium">
                                <PriceDisplay price={item.price * item.quantity} size="sm" className="inline" />
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="bg-blue-300 dark:bg-blue-700" />
                        
                        {/* Summary Totals */}
                        <div className="flex justify-between text-sm sm:text-base">
                          <span>Items ({affiliateProducts.length}):</span>
                          <span className="font-medium">{affiliateProducts.length}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span>Total Value:</span>
                          <span className={`font-bold ${
                            openedAffiliateItems.size > 0 && affiliateProducts.some(item => openedAffiliateItems.has(item.id))
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-blue-800 dark:text-blue-200'
                          }`}><PriceDisplay price={affiliateProducts.reduce((acc: number, item: any) => acc + (item.price || 0) * item.quantity, 0)} size="md" className="inline" /></span>
                        </div>
                        {openedAffiliateItems.size > 0 && affiliateProducts.some(item => openedAffiliateItems.has(item.id)) && (
                          <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Links opened - Complete purchases within 24 hours
                          </div>
                        )}
                        <Separator className="bg-blue-300 dark:bg-blue-700" />
                        {/* Partner Products Action Buttons */}
                        <div className="mt-4 space-y-2">
                          <Button 
                            onClick={() => {
                              let blockedCount = 0;
                              let openedCount = 0;
                              
                              // Open all affiliate URLs with popup blocking detection
                              affiliateProducts.forEach((item, index) => {
                                if (item.affiliateUrl) {
                                  setTimeout(() => {
                                    const popup = window.open(item.affiliateUrl, '_blank');
                                    if (popup === null || popup === undefined) {
                                      blockedCount++;
                                    } else {
                                      openedCount++;
                                    }
                                    
                                    // Show final result after last attempt
                                    if (index === affiliateProducts.length - 1) {
                                      setTimeout(() => {
                                        if (blockedCount > 0) {
                                          toast({
                                            title: "Some Links Blocked",
                                            description: `${openedCount} links opened, ${blockedCount} blocked. Please enable popups for this site and try again.`,
                                            duration: 6000,
                                            variant: "destructive"
                                          });
                                        } else {
                                          toast({
                                            title: "All Partner Links Opened",
                                            description: `Successfully opened all ${affiliateProducts.length} partner site links. Products will remain in cart for 24 hours.`,
                                            duration: 4000,
                                          });
                                        }
                                      }, 100);
                                    }
                                  }, index * 300); // 300ms delay between each link
                                }
                              });
                              
                              // Mark items as opened with tracking
                              markAffiliateItemsAsOpened(affiliateProducts);
                            }}
                            className="w-full font-semibold py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {openedAffiliateItems.size > 0 && affiliateProducts.some(item => openedAffiliateItems.has(item.id)) 
                              ? 'Reopen Partner Sites' 
                              : 'Buy on Partner Sites'
                            }
                          </Button>
                          <Button 
                            onClick={() => navigate("/checkout/quick")}
                            variant="outline"
                            className="w-full font-semibold py-3 text-sm"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Proceed to Checkout
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {/* Full Width Separator */}
          {affiliateProducts.length > 0 && regularProducts.length > 0 && (
            <div className="w-full max-w-[1500px] mx-auto px-3 sm:px-4 my-6">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="px-3 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                  Aveenix Products
                </div>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>
          )}
          
          {/* Regular Aveenix Products Section */}
          {regularProducts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              <div className="lg:col-span-7 space-y-3">
              {regularProducts.map((item: any) => (
                <Card key={item.id} className="overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Link href={`/product/${item.productId || item.id}`} className="flex-shrink-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <Link href={`/product/${item.productId || item.id}`} className="block hover:text-primary transition-colors">
                      <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 leading-tight">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.brand || 'Brand'}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        <PriceDisplay price={typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')} size="lg" className="inline" />
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          <PriceDisplay price={typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice || '0')} size="sm" className="inline" />
                        </span>
                      )}
                      {item.originalPrice && (
                        <span className="text-sm text-green-600 font-medium">
                          Save <PriceDisplay price={(((typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice || '0')) - (typeof item.price === 'number' ? item.price : parseFloat(item.price || '0'))) * item.quantity)} size="sm" className="inline" />
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {item.inStock ? (
                        <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          In Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.estimatedDelivery}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="min-w-[1.5rem] text-center font-medium text-sm px-2">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveForLater(item.id)}
                          className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Save for Later</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      <PriceDisplay price={(typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')) * item.quantity} size="lg" className="inline" />
                    </p>
                  </div>
                </div>
              </CardContent>
                </Card>
              ))}
              </div>
              
              {/* Aveenix Products Total Summary */}
              <div className="lg:col-span-3">
                <div className="sticky top-4 space-y-3">
                  {/* Promo Code - Only show for regular products */}
                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-sm sm:text-base">
                        <Tag className="w-4 h-4 mr-2" />
                        Promo Code
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {appliedPromo ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div>
                            <p className="font-semibold text-green-800 dark:text-green-300">{appliedPromo.code}</p>
                            <p className="text-sm text-green-600 dark:text-green-400">{appliedPromo.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removePromoCode}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={applyPromoCode} disabled={!promoCode.trim()} className="w-full sm:w-auto">
                            Apply
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-lg rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base text-green-800 dark:text-green-200 flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Aveenix Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Individual Item Breakdown */}
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {regularProducts.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-start text-xs">
                              <Link 
                                href={`/product/${item.productId || item.id}`}
                                className="flex-1 text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 truncate pr-2 transition-colors"
                              >
                                • {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                              </Link>
                              <span className="text-green-600 dark:text-green-400 whitespace-nowrap font-medium">
                                <PriceDisplay price={item.price * item.quantity} size="sm" className="inline" />
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="bg-green-300 dark:bg-green-700" />
                        
                        {/* Summary Totals */}
                        <div className="flex justify-between text-sm sm:text-base">
                          <span>Items ({regularProducts.length}):</span>
                          <span className="font-medium">{regularProducts.length}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span>Total Value:</span>
                          <span className="font-bold text-green-800 dark:text-green-200"><PriceDisplay price={typeof total === 'number' ? total : parseFloat(total || '0')} size="md" className="inline" /></span>
                        </div>
                        <Separator className="bg-green-300 dark:bg-green-700" />
                        {/* Aveenix Checkout Button */}
                        <div className="mt-4">
                          <Button 
                            onClick={() => navigate("/checkout/quick")}
                            className="w-full font-semibold py-3 text-sm bg-green-600 hover:bg-green-700 text-white"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Proceed to Checkout
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Saved for Later */}
          {savedItems.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Saved for Later ({savedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400"><PriceDisplay price={typeof item.price === 'number' ? item.price : parseFloat(item.price || '0')} size="sm" className="inline" /></p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveToCart(item.id)}
                      >
                        Move to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cart Upsell Sections */}
          <CartUpsellSections />
        
        </div>
      </div>
    </div>
  );
}

// Cart Upsell Sections Component
function CartUpsellSections() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [favoritesIds, setFavoritesIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Fetch all products for mapping IDs to product objects
  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ['/api/products'],
  });

  // Load data from localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    setWishlistIds(savedWishlist);
    setFavoritesIds(savedFavorites);
    setRecentlyViewedIds(savedRecentlyViewed);
  }, []);

  // Fetch best sellers and top rated products for fallbacks
  const { data: bestSellers = [] } = useQuery<any[]>({
    queryKey: ['/api/products/best-sellers'],
  });

  const { data: topRated = [] } = useQuery<any[]>({
    queryKey: ['/api/products/top-rated'],
  });

  // Convert IDs to product objects
  const wishlistProducts = allProducts.filter(product => wishlistIds.includes(product.id)).slice(0, 6);
  const favoritesProducts = allProducts.filter(product => favoritesIds.includes(product.id)).slice(0, 6);
  const recentlyViewedProducts = allProducts.filter(product => recentlyViewedIds.includes(product.id)).slice(0, 6);

  // Smart fallback logic
  const displayWishlistSection = wishlistProducts.length > 0;
  const displayFavoritesSection = favoritesProducts.length > 0;
  const displayRecentlyViewedSection = recentlyViewedProducts.length > 0;

  // Fallback products
  const fallbackBestSellers = bestSellers.slice(0, 6);
  const fallbackTopRated = topRated.slice(0, 6);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      sku: product.sku || product.id,
      brand: product.brand || 'Brand'
    }, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const UpsellProductCard = ({ product }: { product: any }) => (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
          <img 
            src={product.mainImage || product.imageUrl || product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
          {product.isBestseller && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              BESTSELLER
            </div>
          )}
        </div>
      </Link>
      
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-tight">{product.name}</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 dark:text-white">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{product.rating}</span>
            </div>
          )}
        </div>
        
        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full py-2 text-sm font-medium"
          size="sm"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );

  const UpsellSection = ({ 
    title, 
    icon: Icon, 
    products, 
    fallbackProducts, 
    fallbackTitle 
  }: { 
    title: string;
    icon: any;
    products: any[];
    fallbackProducts?: any[];
    fallbackTitle?: string;
  }) => {
    const displayProducts = products.length > 0 ? products : fallbackProducts || [];
    const displayTitle = products.length > 0 ? title : fallbackTitle || title;
    
    if (displayProducts.length === 0) return null;

    const isUsingFallback = products.length === 0 && fallbackProducts && fallbackProducts.length > 0;

    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="flex items-center gap-2">
                <Icon className="w-6 h-6 text-primary" />
                {displayTitle}
              </div>
              <span className="text-sm text-gray-500 font-normal bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {displayProducts.length}
              </span>
            </CardTitle>
            
            {isUsingFallback && (
              <Badge variant="secondary" className="text-xs">
                Recommended for you
              </Badge>
            )}
          </div>
          
          {isUsingFallback && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {fallbackTitle === "Best Sellers" 
                ? "Popular products that other customers love"
                : "Highly rated products you might enjoy"}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {displayProducts.map(product => (
              <UpsellProductCard key={product.id} product={product} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 py-6">
      {/* Section Divider */}
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Gift className="w-4 h-4" />
          <span className="text-sm font-medium">You Might Also Like</span>
        </div>
        <Separator className="flex-1" />
      </div>

      {/* Wishlist Section with Best Sellers Fallback */}
      <UpsellSection
        title="Complete Your Wishlist"
        icon={Heart}
        products={wishlistProducts}
        fallbackProducts={fallbackBestSellers}
        fallbackTitle="Best Sellers"
      />

      {/* Favorites Section with Top Rated Fallback */}
      <UpsellSection
        title="Your Favorites"
        icon={Star}
        products={favoritesProducts}
        fallbackProducts={fallbackTopRated}
        fallbackTitle="Top Rated Products"
      />

      {/* Recently Viewed Section (always shows if data exists) */}
      {displayRecentlyViewedSection && (
        <UpsellSection
          title="Recently Viewed"
          icon={Eye}
          products={recentlyViewedProducts}
        />
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <MainEcommerceLayout>
      <CartContent />
    </MainEcommerceLayout>
  );
}