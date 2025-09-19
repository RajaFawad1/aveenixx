import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle, ExternalLink, Home, ShoppingBag, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function ExternalOrderConfirmation() {
  const [externalOrder, setExternalOrder] = useState<any>(null);

  useEffect(() => {
    // Get order data from session storage
    const orderData = sessionStorage.getItem('externalOrder');
    if (orderData) {
      setExternalOrder(JSON.parse(orderData));
    }

    // Track conversion for commission rewards system
    const trackExternalOrderCompletion = async () => {
      try {
        await fetch('/api/analytics/external-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            source: 'checkout_redirect',
            orderData: orderData ? JSON.parse(orderData) : null
          })
        });
      } catch (error) {
        console.log('Analytics tracking failed:', error);
      }
    };

    trackExternalOrderCompletion();
  }, []);

  return (
    <MainEcommerceLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Redirected to External Marketplaces
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Your items are being processed on their respective marketplace sites
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Order Details */}
              {externalOrder ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Redirected Items
                  </h3>
                  
                  {externalOrder.items.map((item: any, index: number) => (
                    <Card key={index} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {item.brand || 'Brand'}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Qty: {item.quantity}
                              </Badge>
                              <Badge className="bg-blue-600 text-white text-xs">
                                {externalOrder.platform}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Redirected:</span>
                      <span>${externalOrder.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Complete purchase on {externalOrder.platform} to finalize order
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    No Order Data Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We couldn't find your order details. This usually happens when accessing this page directly.
                  </p>
                  <Button asChild>
                    <Link href="/cart">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Back to Cart
                    </Link>
                  </Button>
                </div>
              )}

              {/* Information Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      What happens next?
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Complete your purchase on the {externalOrder?.platform || 'marketplace'} tab that opened</li>
                      <li>• Payment and delivery are handled by {externalOrder?.platform || 'the external site'}</li>
                      <li>• You'll earn Aveenix rewards points after purchase confirmation</li>
                      <li>• Check your email for order confirmation from {externalOrder?.platform || 'the marketplace'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Rewards Information */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Aveenix Rewards
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Your commission rewards will be automatically tracked and credited to your Aveenix account within 24-48 hours after successful purchase completion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/account">
                    View My Account
                  </Link>
                </Button>
              </div>

              {/* Help Section */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need help? <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact our support team</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}