import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, CreditCard, Shield } from 'lucide-react';

interface CheckoutRouterProps {
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    vendor?: string;
    isDropship?: boolean;
    isAffiliate?: boolean;
  }>;
}

export default function CheckoutRouter({ cartItems }: CheckoutRouterProps) {
  const [, setLocation] = useLocation();
  const [checkoutType, setCheckoutType] = useState<'standard' | 'affiliate' | 'dropship'>('standard');
  const [vendorGroups, setVendorGroups] = useState<{[key: string]: any[]}>({});

  useEffect(() => {
    // Analyze cart items to determine checkout type
    const affiliateItems = cartItems.filter(item => item.isAffiliate);
    const dropshipItems = cartItems.filter(item => item.isDropship);
    const standardItems = cartItems.filter(item => !item.isAffiliate && !item.isDropship);

    // Group items by vendor for multi-vendor checkout
    const groups = cartItems.reduce((acc, item) => {
      const vendor = item.vendor || 'aveenix';
      if (!acc[vendor]) acc[vendor] = [];
      acc[vendor].push(item);
      return acc;
    }, {} as {[key: string]: any[]});

    setVendorGroups(groups);

    // Determine primary checkout type
    if (affiliateItems.length > 0) {
      setCheckoutType('affiliate');
    } else if (dropshipItems.length > 0) {
      setCheckoutType('dropship');
    } else {
      setCheckoutType('standard');
    }
  }, [cartItems]);

  const getCheckoutTypeInfo = () => {
    switch (checkoutType) {
      case 'affiliate':
        return {
          title: 'Affiliate Checkout',
          description: 'Some items will redirect to partner sites for purchase',
          icon: <Shield className="w-5 h-5" />,
          color: 'bg-purple-100 text-purple-800'
        };
      case 'dropship':
        return {
          title: 'Dropship Checkout',
          description: 'Items will be shipped directly from our partners',
          icon: <Truck className="w-5 h-5" />,
          color: 'bg-orange-100 text-orange-800'
        };
      default:
        return {
          title: 'Standard Checkout',
          description: 'Items will be processed and shipped by Aveenix',
          icon: <Package className="w-5 h-5" />,
          color: 'bg-green-100 text-green-800'
        };
    }
  };

  const handleProceedToCheckout = () => {
    switch (checkoutType) {
      case 'affiliate':
        setLocation('/checkout/affiliate');
        break;
      case 'dropship':
        setLocation('/checkout/dropship');
        break;
      default:
        setLocation('/checkout');
        break;
    }
  };

  const typeInfo = getCheckoutTypeInfo();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Checkout Options
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review your cart and select checkout method
        </p>
      </div>

      {/* Checkout Type Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            {typeInfo.icon}
            <span className="ml-2">{typeInfo.title}</span>
            <Badge className={`ml-auto ${typeInfo.color}`}>
              {checkoutType}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {typeInfo.description}
          </p>
          
          {/* Vendor Groups */}
          {Object.keys(vendorGroups).length > 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Multiple Vendors Detected
              </h3>
              {Object.entries(vendorGroups).map(([vendor, items]) => (
                <div key={vendor} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                      {vendor}
                    </h4>
                    <Badge variant="secondary">
                      {items.length} items
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.name} x{item.quantity}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          {item.isAffiliate && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              Affiliate
                            </Badge>
                          )}
                          {item.isDropship && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              Dropship
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checkout Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className={`cursor-pointer transition-all ${
          checkoutType === 'standard' ? 'ring-2 ring-green-500' : ''
        }`}>
          <CardContent className="p-6 text-center">
            <Package className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Standard Checkout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Direct purchase from Aveenix inventory
            </p>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${
          checkoutType === 'dropship' ? 'ring-2 ring-orange-500' : ''
        }`}>
          <CardContent className="p-6 text-center">
            <Truck className="w-8 h-8 mx-auto mb-4 text-orange-600" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Dropship Checkout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Items shipped directly from partners
            </p>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${
          checkoutType === 'affiliate' ? 'ring-2 ring-purple-500' : ''
        }`}>
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-4 text-purple-600" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Affiliate Checkout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirect to partner sites for purchase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cart Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span>
                  ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleProceedToCheckout}
          size="lg"
          className="px-8"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Proceed to {typeInfo.title}
        </Button>
      </div>
    </div>
  );
}