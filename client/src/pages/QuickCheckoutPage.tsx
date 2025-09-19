import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import {
  ArrowLeft,
  Shield,
  Truck,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
  Package,
  User,
  Phone,
  Edit,
  Plus,
  Lock,
  Home,
  ChevronRight
} from 'lucide-react';
import { AddressBook } from '@/components/AddressBook';
import { useAuth } from '@/hooks/useAuth';
import { StripeProvider } from '@/components/stripe/StripeProvider';

interface QuickCheckoutFormData {
  email: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  billingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  saveAddress: boolean;
  sameAsBilling: boolean;
  deliveryInstructions?: string;
}

// Shipping options would typically be fetched from API in a real application
const shippingOptions = [
  { id: "standard", name: "Standard Shipping", price: 9.99, time: "5-7 business days", description: "Free on orders over $50" },
  { id: "express", name: "Express Shipping", price: 19.99, time: "2-3 business days", description: "Faster delivery" },
  { id: "overnight", name: "Overnight Shipping", price: 29.99, time: "1 business day", description: "Next day delivery" }
];

// Payment methods would typically be fetched from API based on merchant configuration
const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, American Express" },
  { id: "paypal", name: "PayPal (Coming Soon)", icon: CreditCard, description: "Pay with your PayPal account", disabled: true },
  { id: "apple", name: "Apple Pay (Coming Soon)", icon: CreditCard, description: "Touch ID or Face ID", disabled: true },
  { id: "google", name: "Google Pay (Coming Soon)", icon: CreditCard, description: "Pay with Google", disabled: true }
];

export default function QuickCheckoutPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, updateQuantity: updateCartQuantity, removeFromCart, clearCart } = useCart();
  const { user, isLoggedIn, isLoading } = useAuth();
  
  // Fetch user addresses for dropdown
  const { data: userAddresses = [], isLoading: addressesLoading } = useQuery<any[]>({
    queryKey: [`/api/user/${user?.id}/addresses`],
    enabled: !!user?.id
  });

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

  // Get product and quantity from session storage (set by Buy Now Modal)
  const [productData, setProductData] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [useFullCart, setUseFullCart] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // Dual checkout logic for affiliate vs regular products
  const handleSingleAffiliateProductRedirect = (product: any) => {
    try {
      // Track user interaction for commission rewards
      const trackingData = {
        productId: product.id,
        userId: user?.id,
        action: 'affiliate_redirect',
        timestamp: new Date().toISOString(),
        sourcePlatform: product.sourcePlatform,
        affiliateUrl: product.affiliateUrl
      };
      
      // Store tracking data for commission processing
      sessionStorage.setItem('affiliateTracking', JSON.stringify(trackingData));
      
      toast({
        title: "Redirecting to " + (product.sourcePlatform || 'Partner Site'),
        description: "You'll be redirected to complete your purchase on the original marketplace.",
        duration: 3000,
      });
      
      // Clear buy now data and redirect after short delay
      setTimeout(() => {
        // Store external order data for confirmation page
        const externalOrder = {
          id: `ext-${Date.now()}`,
          items: [{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl || product.image,
            brand: product.brand,
            productType: product.productType,
            affiliateUrl: product.affiliateUrl,
            sourcePlatform: product.sourcePlatform
          }],
          platform: product.sourcePlatform,
          affiliateUrl: product.affiliateUrl,
          timestamp: new Date().toISOString(),
          total: parseFloat(product.price || '0')
        };
        sessionStorage.setItem('externalOrder', JSON.stringify(externalOrder));
        
        sessionStorage.removeItem('buyNowProduct');
        window.open(product.affiliateUrl, '_blank');
        navigate('/order/confirmation/external');
      }, 1500);
      
    } catch (error) {
      console.error('Error handling affiliate redirect:', error);
      toast({
        title: "Redirect Error", 
        description: "Unable to redirect to partner site. Please try again.",
        variant: "destructive",
      });
      navigate('/order/confirmation/external');
    }
  };
  
  // Removed handleAffiliateProductsRedirect - mixed cart now handled on checkout page

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with checkout.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [isLoggedIn, isLoading, navigate, toast]);

  useEffect(() => {
    // Check if there are existing cart items
    if (cartItems.length > 0) {
      setUseFullCart(true);
      return;
    }

    // Get buy now product data from session storage
    const buyNowProduct = JSON.parse(sessionStorage.getItem('buyNowProduct') || 'null');
    if (buyNowProduct) {
      // Check if this is an affiliate product
      if (buyNowProduct.affiliateUrl && (buyNowProduct.productType === 'affiliate' || buyNowProduct.productType === 'dropship')) {
        handleSingleAffiliateProductRedirect(buyNowProduct);
        return;
      }
      
      setProductData(buyNowProduct);
      setQuantity(buyNowProduct.quantity || 1);
      setUseFullCart(false);
    } else {
      // Redirect back to home if no product data and no cart items
      navigate('/');
    }
  }, [navigate, cartItems]);

  const [formData, setFormData] = useState<QuickCheckoutFormData>({
    email: user?.email || '',
    shippingAddress: {
      fullName: user?.name || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: (user as any)?.phone || ''
    },
    billingAddress: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    },
    shippingMethod: 'standard',
    paymentMethod: 'card',
    saveAddress: false,
    sameAsBilling: true,
    deliveryInstructions: ''
  });

  // Update form email when user data changes
  useEffect(() => {
    if (user?.email && formData.email !== user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user?.email, formData.email]);

  // Use product data from session storage instead of API call
  const product = productData;
  const productLoading = !useFullCart && !productData;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return await response.json();
    },
    onSuccess: (data) => {
      setIsProcessing(false);
      // Navigate to success page with order information
      const successUrl = `/success?payment_intent=${data.paymentId || 'demo'}&redirect_status=succeeded&order_id=${data.orderId}&amount=${calculateTotal()}`;
      navigate(successUrl);
    },
    onError: (error: any) => {
      console.error('Order submission error:', error);
      toast({
        title: "Order Error",
        description: error?.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateShippingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
    
    // Auto-sync billing address if same as shipping
    if (formData.sameAsBilling) {
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    }
  };

  const handleSameAsBilling = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsBilling: checked,
      billingAddress: checked ? prev.shippingAddress : prev.billingAddress
    }));
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    // Update form data with selected address
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        fullName: address.fullName,
        address: address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : ''),
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        phone: address.phone || ''
      }
    }));
  };

  // Handle dropdown address selection
  const handleDropdownAddressSelect = (value: string) => {
    if (value === "add-new") {
      setShowAddressModal(true);
      setSelectedAddressId("");
      setSelectedAddress(null);
    } else {
      const address = userAddresses.find((addr: any) => addr.id.toString() === value);
      if (address) {
        setSelectedAddressId(value);
        setSelectedAddress(address);
        setShowManualForm(false);
        handleAddressSelect(address);
      }
    }
  };

  // Set default address on load or show manual form if no addresses
  useEffect(() => {
    if (userAddresses.length > 0 && !selectedAddressId) {
      const defaultAddress = userAddresses.find((addr: any) => addr.isDefault) || userAddresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id.toString());
        setSelectedAddress(defaultAddress);
        setShowManualForm(false);
        handleAddressSelect(defaultAddress);
      }
    } else if (userAddresses.length === 0) {
      setShowManualForm(true);
      setSelectedAddressId("");
      setSelectedAddress(null);
    }
  }, [userAddresses]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.email || !formData.shippingAddress.fullName || !formData.shippingAddress.address || 
        !formData.shippingAddress.city || !formData.shippingAddress.state || !formData.shippingAddress.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const orderData = {
      items: useFullCart 
        ? cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        : [{
            productId: product.id,
            quantity: quantity,
            price: product.price
          }],
      shippingAddress: formData.shippingAddress,
      shippingMethod: formData.shippingMethod,
      paymentMethod: formData.paymentMethod,
      pricing: {
        subtotal: calculateSubtotal(),
        shippingCost: calculateShippingCost(),
        tax: calculateTax(),
        total: calculateTotal()
      },
      guestInfo: {
        email: formData.email
      }
    };

    console.log('Submitting order data:', orderData); // Debug log

    createOrderMutation.mutate(orderData);
  };

  // Start Stripe hosted Checkout session for card payments
  const startStripeCheckout = async () => {
    try {
      setIsProcessing(true);
      const totalCents = Math.round(calculateTotal() * 100);
      
      // Prepare order data for webhook processing
      const orderData = {
        items: useFullCart 
          ? cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              image: item.image
            }))
          : [{
              productId: product.id,
              quantity: quantity,
              price: product.price,
              name: product.name,
              image: product.image
            }],
        shippingAddress: formData.shippingAddress,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        pricing: {
          subtotal: calculateSubtotal(),
          shippingCost: calculateShippingCost(),
          tax: calculateTax(),
          total: calculateTotal()
        },
        guestInfo: {
          email: formData.email
        }
      };
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: totalCents,
          currency: 'usd',
          customerEmail: user?.email || formData.email,
          orderId: `order_${Date.now()}`,
          orderData: orderData, // Pass order data for webhook processing
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout/cancel`
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to start Stripe Checkout');
      }

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error('Stripe Checkout URL not received');
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: 'Payment Error',
        description: error?.message || 'Unable to redirect to Stripe Checkout.',
        variant: 'destructive'
      });
    }
  };

  // Simple cart separation for checkout display
  const separateCartItems = () => {
    if (!useFullCart) return { affiliateItems: [], regularItems: [] };
    
    const affiliateItems = cartItems.filter(item => 
      item.affiliateUrl && (item.productType === 'affiliate' || item.productType === 'dropship')
    );
    const regularItems = cartItems.filter(item => 
      !item.affiliateUrl || (item.productType !== 'affiliate' && item.productType !== 'dropship')
    );
    
    return { affiliateItems, regularItems };
  };

  const calculateSubtotal = () => {
    if (useFullCart) {
      // Calculate subtotal for all cart items (both regular and affiliate)
      return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    return product ? product.price * quantity : 0;
  };
  
  const calculateShippingCost = () => {
    const option = shippingOptions.find(opt => opt.id === formData.shippingMethod);
    const subtotal = calculateSubtotal();
    return option && !(option.id === 'standard' && subtotal > 50) ? option.price : 0;
  };
  
  const calculateTax = () => calculateSubtotal() * 0.08;
  const calculateTotal = () => calculateSubtotal() + calculateShippingCost() + calculateTax();

  const updateSingleProductQuantity = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const removeSingleProduct = () => {
    sessionStorage.removeItem('buyNowProduct');
    navigate('/');
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    
    // Create order after successful payment
    const orderData = {
      customerInfo: {
        email: formData.email,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsBilling ? formData.shippingAddress : formData.billingAddress,
      },
      items: useFullCart ? cartItems : [{
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      }],
      shipping: {
        method: formData.shippingMethod,
        cost: calculateShippingCost()
      },
      payment: {
        method: formData.paymentMethod,
        amount: calculateTotal(),
        paymentIntentId: paymentIntent.id,
        status: 'paid'
      },
      summary: {
        subtotal: calculateSubtotal(),
        shipping: calculateShippingCost(),
        tax: calculateTax(),
        total: calculateTotal()
      }
    };

    createOrderMutation.mutate(orderData);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  // Handle checkout completion with mixed cart logic
  const handleCompleteCheckout = () => {
    // Always redirect to Stripe Checkout for card payments
    if (formData.paymentMethod === 'card') {
      startStripeCheckout();
      return;
    }

    // For non-card payments, handle based on cart contents
    if (!useFullCart) {
      // Single product checkout - standard flow
      handleSubmit();
      return;
    }

    const { affiliateItems, regularItems } = separateCartItems();
    
    // If only affiliate items, redirect all to external sites
    if (affiliateItems.length > 0 && regularItems.length === 0) {
      affiliateItems.forEach(item => {
        if (item.affiliateUrl) {
          window.open(item.affiliateUrl, '_blank');
        }
      });
      clearCart();
      navigate('/order/confirmation/external');
      return;
    }

    // If only regular items or mixed cart, process regular items through Aveenix
    if (regularItems.length > 0) {
      handleSubmit();
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <MainEcommerceLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Authenticating...</p>
          </div>
        </div>
      </MainEcommerceLayout>
    );
  }

  if (productLoading) {
    return (
      <MainEcommerceLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
          </div>
        </div>
      </MainEcommerceLayout>
    );
  }

  if (!useFullCart && !product) {
    return (
      <MainEcommerceLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Product not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return Home
            </Button>
          </div>
        </div>
      </MainEcommerceLayout>
    );
  }

  return (
    <StripeProvider>
      <MainEcommerceLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-full md:max-w-[1500px] mx-auto px-3 sm:px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-yellow-500 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/cart" className="hover:text-yellow-500">
              Shopping Cart
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">Checkout</span>
          </nav>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Express Checkout</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/cart')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Edit Cart
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700">
                  <div className="h-full bg-green-500 transition-all duration-500" style={{width: '66%'}}></div>
                </div>
                
                {/* Steps */}
                <div className="flex justify-between w-full relative z-10">
                  {/* Contact Step */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">Contact</span>
                  </div>
                  
                  {/* Shipping Step */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold shadow-md">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">Shipping</span>
                  </div>
                  
                  {/* Payment Step */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-blue-200 flex items-center justify-center text-white font-semibold shadow-md">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">Payment</span>
                  </div>
                  
                  {/* Review Step */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contact Information */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="contact-name"
                      type="text"
                      value={formData.shippingAddress.fullName}
                      onChange={(e) => updateShippingAddress('fullName', e.target.value)}
                      placeholder={user?.name || "Enter full name"}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-address" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Address *
                    </Label>
                    <Input
                      id="contact-address"
                      type="text"
                      value={formData.shippingAddress.address}
                      onChange={(e) => updateShippingAddress('address', e.target.value)}
                      placeholder="Street address"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.shippingAddress.phone}
                        onChange={(e) => updateShippingAddress('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Email for Order Updates *
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <Truck className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address Selection Dropdown */}
                  <div>
                    <Label htmlFor="address-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Choose Shipping Address *
                    </Label>
                    <Select value={selectedAddressId} onValueChange={handleDropdownAddressSelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select shipping address" />
                      </SelectTrigger>
                      <SelectContent>
                        {userAddresses.length > 0 ? (
                          <>
                            {userAddresses.map((address: any) => (
                              <SelectItem key={address.id} value={address.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {address.label || `${address.addressLine1.slice(0, 30)}...`}
                                </div>
                              </SelectItem>
                            ))}
                            <SelectItem value="add-new">
                              <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add New Address...
                              </div>
                            </SelectItem>
                          </>
                        ) : (
                          <SelectItem value="add-new">
                            <div className="flex items-center gap-2">
                              <Plus className="w-4 h-4" />
                              Add Your First Address...
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {!showManualForm && selectedAddress ? (
                    <>
                      {/* Address Preview */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {selectedAddress.label || 'Selected Address'}
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {selectedAddress.isDefault ? 'Default' : 'Saved'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <p className="font-medium">{selectedAddress.fullName}</p>
                          <p>{selectedAddress.addressLine1}</p>
                          {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                          <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                          {selectedAddress.phone && <p>Phone: {selectedAddress.phone}</p>}
                        </div>
                      </div>
                      
                      {/* Special Instructions for Saved Address */}
                      <div className="space-y-2">
                        <Label htmlFor="delivery-instructions">Special Delivery Instructions (Optional)</Label>
                        <textarea
                          id="delivery-instructions"
                          value={formData.deliveryInstructions || ''}
                          onChange={(e) => updateFormData('deliveryInstructions', e.target.value)}
                          placeholder="e.g., Leave at front door, Ring doorbell, Call upon arrival..."
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Help our delivery partner find you and deliver safely</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.shippingAddress.fullName}
                          onChange={(e) => updateShippingAddress('fullName', e.target.value)}
                          placeholder={user?.name || "Enter full name"}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={formData.shippingAddress.address}
                          onChange={(e) => updateShippingAddress('address', e.target.value)}
                          placeholder="Street address"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.shippingAddress.city}
                            onChange={(e) => updateShippingAddress('city', e.target.value)}
                            placeholder="City"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={formData.shippingAddress.zipCode}
                            onChange={(e) => {
                              const zipCode = e.target.value;
                              updateShippingAddress('zipCode', zipCode);
                              
                              // Auto-populate city/state when ZIP code is 5 digits
                              if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
                                // Simple ZIP to city/state mapping for common ZIP codes
                                const zipMapping: Record<string, {city: string, state: string}> = {
                                  '10001': {city: 'New York', state: 'NY'},
                                  '90210': {city: 'Beverly Hills', state: 'CA'},
                                  '60601': {city: 'Chicago', state: 'IL'},
                                  '77001': {city: 'Houston', state: 'TX'},
                                  '33101': {city: 'Miami', state: 'FL'},
                                  '02101': {city: 'Boston', state: 'MA'},
                                  '98101': {city: 'Seattle', state: 'WA'},
                                  '85001': {city: 'Phoenix', state: 'AZ'},
                                  '19101': {city: 'Philadelphia', state: 'PA'},
                                  '30301': {city: 'Atlanta', state: 'GA'}
                                };
                                
                                const location = zipMapping[zipCode];
                                if (location) {
                                  updateShippingAddress('city', location.city);
                                  updateShippingAddress('state', location.state);
                                }
                              }
                            }}
                            placeholder="ZIP code"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Special Instructions for Manual Entry */}
                      <div className="space-y-2">
                        <Label htmlFor="delivery-instructions-manual">Special Delivery Instructions (Optional)</Label>
                        <textarea
                          id="delivery-instructions-manual"
                          value={formData.deliveryInstructions || ''}
                          onChange={(e) => updateFormData('deliveryInstructions', e.target.value)}
                          placeholder="e.g., Leave at front door, Ring doorbell, Call upon arrival..."
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Help our delivery partner find you and deliver safely</p>
                      </div>

                      {/* Save Address Option */}
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <input
                          type="checkbox"
                          id="save-address"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="save-address" className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Save this address for future orders
                        </label>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <Clock className="w-5 h-5" />
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Compact Shipping Method Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="shipping-method">Choose Shipping Speed *</Label>
                    <Select
                      value={formData.shippingMethod}
                      onValueChange={(value) => updateFormData('shippingMethod', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select shipping method">
                          {formData.shippingMethod && (
                            <div className="flex items-center justify-between w-full">
                              {(() => {
                                const option = shippingOptions.find(o => o.id === formData.shippingMethod);
                                if (!option) return null;
                                return (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <Truck className="w-4 h-4" />
                                      <span>{option.name}</span>
                                    </div>
                                    <span className="font-medium">
                                      {option.id === 'standard' && calculateSubtotal() > 50 ? (
                                        <span className="text-green-600 dark:text-green-400">FREE</span>
                                      ) : (
                                        `$${(typeof option.price === 'number' ? option.price : parseFloat(option.price || '0')).toFixed(2)}`
                                      )}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {shippingOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <Truck className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">{option.name}</div>
                                  <div className="text-xs text-gray-500">{option.time} • {option.description}</div>
                                </div>
                              </div>
                              <div className="ml-4 font-medium">
                                {option.id === 'standard' && calculateSubtotal() > 50 ? (
                                  <span className="text-green-600 dark:text-green-400">FREE</span>
                                ) : (
                                  `$${(typeof option.price === 'number' ? option.price : parseFloat(option.price || '0')).toFixed(2)}`
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Shipping Method Info */}
                  {formData.shippingMethod && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      {(() => {
                        const selectedOption = shippingOptions.find(o => o.id === formData.shippingMethod);
                        if (!selectedOption) return null;
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Truck className="w-5 h-5 text-primary" />
                              <div>
                                <h4 className="font-medium text-sm">{selectedOption.name}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {selectedOption.time} • {selectedOption.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm">
                                {selectedOption.id === 'standard' && calculateSubtotal() > 50 ? (
                                  <span className="text-green-600 dark:text-green-400">FREE</span>
                                ) : (
                                  `$${(typeof selectedOption.price === 'number' ? selectedOption.price : parseFloat(selectedOption.price || '0')).toFixed(2)}`
                                )}
                              </div>
                              <Badge variant="secondary" className="text-xs mt-1">Selected</Badge>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Accepted Payment Methods */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">We Accept</h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border shadow-sm">
                        <CreditCard className="w-8 h-5 text-blue-600" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border shadow-sm">
                        <span className="text-blue-600 font-bold text-sm">VISA</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border shadow-sm">
                        <span className="text-red-600 font-bold text-sm">MC</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border shadow-sm">
                        <span className="text-blue-700 font-bold text-sm">AMEX</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border shadow-sm">
                        <span className="text-purple-600 font-bold text-sm">PayPal</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border shadow-sm">
                        <span className="text-gray-800 dark:text-gray-200 font-bold text-sm">Apple Pay</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Payment Method Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Choose Payment Method *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => updateFormData('paymentMethod', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select payment method">
                          {formData.paymentMethod && (
                            <div className="flex items-center gap-2">
                              {(() => {
                                const method = paymentMethods.find(m => m.id === formData.paymentMethod);
                                if (!method) return null;
                                return (
                                  <>
                                    <method.icon className="w-4 h-4" />
                                    <span>{method.name}</span>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id} disabled={method.disabled}>
                            <div className="flex items-center gap-3">
                              <method.icon className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-xs text-gray-500">{method.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Security Trust Badges */}
                  <div className="space-y-4">
                    {/* Security Trust Badges */}
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-green-600" />
                        <div>
                          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Secure Checkout</h4>
                          <p className="text-xs text-green-700 dark:text-green-400">Your information is encrypted and secure</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-green-600" />
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">SSL Protected</span>
                      </div>
                    </div>
                  </div>

                  {/* Card method selected: no inline card fields, we'll redirect to Stripe Checkout */}
                  {formData.paymentMethod === 'card' && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                      {(() => {
                        const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);
                        if (!selectedMethod) return null;
                        return (
                          <div className="flex items-center gap-3">
                            <selectedMethod.icon className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{selectedMethod.name}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">You will be redirected to secure Stripe Checkout to pay.</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">Selected</Badge>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Non-card payment methods */}
                  {formData.paymentMethod && formData.paymentMethod !== 'card' && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      {(() => {
                        const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);
                        if (!selectedMethod) return null;
                        return (
                          <div className="flex items-center gap-3">
                            <selectedMethod.icon className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{selectedMethod.name}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{selectedMethod.description}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">Selected</Badge>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 bg-white dark:bg-gray-800 border-0 shadow-lg rounded-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Products with Mixed Cart Handling */}
                  {useFullCart ? (
                    /* Full Cart Display with Product Type Segregation */
                    (() => {
                      const { affiliateItems, regularItems } = separateCartItems();
                      
                      return (
                        <div className="space-y-4">
                          {/* Affiliate Products Section */}
                          {affiliateItems.length > 0 && (
                            <>
                              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                                <ExternalLink className="w-4 h-4" />
                                Aveenix Partner Products
                              </div>
                              <div className="space-y-3">
                                {affiliateItems.map((item) => {
                                const isOpened = openedAffiliateItems.has(item.id);
                                return (
                                  <div key={item.id} className={`flex gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                    isOpened 
                                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                  }`}>
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-xs line-clamp-2">{item.name}</h3>
                                        {isOpened && (
                                          <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                                            ✓ Opened
                                          </Badge>
                                        )}
                                      </div>
                                      <p className={`text-xs ${isOpened ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                        {isOpened ? 'Link opened - Complete purchase within 24hrs' : `Buy on ${item.sourcePlatform || 'External Site'}`}
                                      </p>
                                      <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                          Qty: {item.quantity}
                                        </span>
                                        <Button
                                          size="sm"
                                          className={`h-6 text-xs text-white px-2 font-medium ${
                                            item.sourcePlatform === 'amazon' 
                                              ? 'bg-orange-500 hover:bg-orange-600' 
                                              : item.sourcePlatform === 'aliexpress' 
                                              ? 'bg-red-500 hover:bg-red-600'
                                              : 'bg-blue-600 hover:bg-blue-700'
                                          }`}
                                          onClick={() => window.open(item.affiliateUrl, '_blank')}
                                        >
                                          <ExternalLink className="w-3 h-3 mr-1" />
                                          Buy on {item.sourcePlatform || 'Site'}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              </div>
                              
                              {/* Affiliate Products Summary */}
                              <div className={`p-3 rounded-lg border space-y-2 transition-all duration-200 ${
                                openedAffiliateItems.size > 0 && affiliateItems.some(item => openedAffiliateItems.has(item.id))
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                              }`}>
                                <div className="flex justify-between text-sm">
                                  <span>Items ({affiliateItems.length}):</span>
                                  <span className="font-medium">{affiliateItems.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Total Value:</span>
                                  <span className={`font-bold ${
                                    openedAffiliateItems.size > 0 && affiliateItems.some(item => openedAffiliateItems.has(item.id))
                                      ? 'text-green-800 dark:text-green-200'
                                      : 'text-blue-800 dark:text-blue-200'
                                  }`}>
                                    ${affiliateItems.reduce((acc, item) => acc + (parseFloat(String(item.price || '0')) * item.quantity), 0).toFixed(2)}
                                  </span>
                                </div>
                                {openedAffiliateItems.size > 0 && affiliateItems.some(item => openedAffiliateItems.has(item.id)) && (
                                  <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Links opened - Complete purchases within 24 hours
                                  </div>
                                )}
                                <Button 
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
                                  onClick={() => {
                                    let blockedCount = 0;
                                    let openedCount = 0;
                                    
                                    // Open all affiliate URLs with popup blocking detection
                                    affiliateItems.forEach((item, index) => {
                                      if (item.affiliateUrl) {
                                        setTimeout(() => {
                                          const popup = window.open(item.affiliateUrl, '_blank');
                                          if (popup === null || popup === undefined) {
                                            blockedCount++;
                                          } else {
                                            openedCount++;
                                          }
                                          
                                          // Show final result after last attempt
                                          if (index === affiliateItems.length - 1) {
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
                                                  description: `Successfully opened all ${affiliateItems.length} partner site links. Products will remain here for 24 hours.`,
                                                  duration: 4000,
                                                });
                                              }
                                            }, 100);
                                          }
                                        }, index * 300); // 300ms delay between each link
                                      }
                                    });
                                    
                                    // Mark items as opened with tracking
                                    markAffiliateItemsAsOpened(affiliateItems);
                                  }}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {openedAffiliateItems.size > 0 && affiliateItems.some(item => openedAffiliateItems.has(item.id)) 
                                    ? 'Reopen Partner Sites' 
                                    : 'Buy on Partner Sites'
                                  }
                                </Button>
                              </div>
                              
                              {/* Divider between affiliate and regular items */}
                              {regularItems.length > 0 && (
                                <div className="border-t border-gray-300 dark:border-gray-600 my-4 pt-4">
                                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    <Package className="w-4 h-4" />
                                    Aveenix Products
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* Regular/Dropship Products Section */}
                          {regularItems.length > 0 && (
                            <div className="space-y-3">
                              {regularItems.map((item) => (
                                <div key={item.id} className="flex gap-3 border-b pb-3 last:border-b-0">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                                    <p className="text-xs text-gray-500">{item.brand}</p>
                                    <div className="flex items-center justify-between mt-1">
                                      <p className="text-sm font-semibold">${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || '0').toFixed(2)} × {item.quantity}</p>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                                          className="h-6 w-6 p-0"
                                        >
                                          -
                                        </Button>
                                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                          className="h-6 w-6 p-0"
                                        >
                                          +
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeFromCart(item.id)}
                                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    /* Single Product Display */
                    product && (
                      <div className="flex gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm font-semibold">${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || '0').toFixed(2)} × {quantity}</p>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateSingleProductQuantity(quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-sm">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateSingleProductQuantity(quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                +
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={removeSingleProduct}
                                className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Always show checkout section with order totals */}
                  <>
                    <Separator />

                    {/* Order totals */}
                    <div className="space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                        <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700 dark:text-gray-300">Shipping</span>
                        <span className="font-semibold">{calculateShippingCost() > 0 ? `$${calculateShippingCost().toFixed(2)}` : (
                          <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                        )}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700 dark:text-gray-300">Tax</span>
                        <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span className="text-2xl" style={{ color: 'var(--primary-color)' }}>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Security badge */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-medium">Secure checkout protected by SSL</span>
                      </div>
                    </div>

                    {/* Submit button */}
                    <Button 
                      onClick={handleCompleteCheckout}
                      disabled={isProcessing || createOrderMutation.isPending}
                      className="w-full font-semibold h-12 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--primary-color)', 
                        color: 'var(--primary-foreground)',
                      }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--primary-color-dark)'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--primary-color)'}
                    >
                      {isProcessing || createOrderMutation.isPending ? (
                        'Processing...'
                      ) : (
                        `Pay $${calculateTotal().toFixed(2)}`
                      )}
                    </Button>
                  </>

                  <p className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </MainEcommerceLayout>

      {/* Address Management Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Your Addresses</DialogTitle>
          </DialogHeader>
          <AddressBook
            userId={parseInt(user?.id || '1')}
            onAddressSelect={(address: any) => {
              handleAddressSelect(address);
              setSelectedAddressId(address.id.toString());
              setSelectedAddress(address);
              setShowManualForm(false);
              setShowAddressModal(false);
            }}
            selectedAddressId={selectedAddress?.id}
          />
        </DialogContent>
      </Dialog>
    </StripeProvider>
  );
}