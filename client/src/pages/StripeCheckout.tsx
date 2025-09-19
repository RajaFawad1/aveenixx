import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import CheckoutForm from '@/components/CheckoutForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function StripeCheckout() {
  const [, navigate] = useLocation();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      // Get cart total or default amount for demo
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 29.99, // $29.99 demo amount
          currency: 'usd',
          customerEmail: 'customer@example.com',
          orderId: `ORDER-${Date.now()}`,
          metadata: {
            source: 'web_checkout',
            platform: 'aveenix'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setAmount(data.amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    navigate('/success?payment_intent=demo_payment_123&redirect_status=succeeded');
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Payment Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <div className="flex gap-3">
                <Button onClick={createPaymentIntent} className="flex-1">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/cart')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your purchase with Stripe's secure payment processing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              clientSecret={clientSecret}
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Premium Product</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: 1</p>
                    </div>
                    <span className="font-semibold">${(amount / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${(amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(amount / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Secure Payment:</strong> Your payment information is encrypted and processed securely by Stripe.
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Or pay with{' '}
                    <button
                      onClick={() => navigate('/paypal-checkout')}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      PayPal
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}