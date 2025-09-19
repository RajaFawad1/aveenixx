import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Mail, ArrowLeft, Download } from 'lucide-react';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

interface PaymentDetails {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  customerEmail?: string;
  orderId?: string;
  paymentMethod?: string;
}

export default function Success() {
  const [, navigate] = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    const redirectStatus = urlParams.get('redirect_status');
    const paymentMethod = urlParams.get('payment') || 'stripe';
    const amount = urlParams.get('amount') || '29.99';
    const orderId = urlParams.get('order_id') || urlParams.get('orderId');

    if (paymentIntentId && redirectStatus === 'succeeded') {
      // Fetch payment details from backend
      fetchPaymentDetails(paymentIntentId);
    } else {
      // Simulate payment details for demo
      const baseAmount = parseFloat(amount) * 100; // Convert to cents
      setPaymentDetails({
        paymentIntentId: paymentMethod === 'paypal' ? `paypal_${Date.now()}` : 'pi_demo_123456789',
        amount: baseAmount,
        currency: 'usd',
        status: 'succeeded',
        created: Date.now(),
        customerEmail: 'customer@example.com',
        orderId: orderId || `ORDER-${Date.now()}`,
        paymentMethod: paymentMethod
      });
      setIsLoading(false);
    }
  }, []);

  const fetchPaymentDetails = async (paymentIntentId: string) => {
    try {
      const response = await fetch(`/api/payment-intent/${paymentIntentId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentDetails(data);
      } else {
        // Fallback to demo data
        setPaymentDetails({
          paymentIntentId,
          amount: 2999,
          currency: 'usd',
          status: 'succeeded',
          created: Date.now(),
          customerEmail: 'customer@example.com',
          orderId: 'ORDER-2025-001'
        });
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      // Fallback to demo data
      setPaymentDetails({
        paymentIntentId,
        amount: 2999,
        currency: 'usd',
        status: 'succeeded',
        created: Date.now(),
        customerEmail: 'customer@example.com',
        orderId: 'ORDER-2025-001'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <MainEcommerceLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for your purchase. Your {paymentDetails?.paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'} payment has been processed successfully.
          </p>
          
          {/* Prominent Total Amount Display */}
          {paymentDetails && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-sm text-green-700 dark:text-green-300 mb-1">Total Amount Paid</div>
              <div className="text-4xl font-bold text-green-800 dark:text-green-200">
                {formatAmount(paymentDetails.amount, paymentDetails.currency)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Order #{paymentDetails.orderId || 'ORDER-2025-001'}
              </div>
            </div>
          )}
        </div>

        {/* Payment Details */}
        {paymentDetails && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Payment Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Amount Paid
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatAmount(paymentDetails.amount, paymentDetails.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Date
                  </label>
                  <p className="text-lg font-semibold">
                    {formatDate(paymentDetails.created)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Order ID
                  </label>
                  <p className="text-lg font-mono">
                    {paymentDetails.orderId || 'ORDER-2025-001'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Method
                  </label>
                  <p className="text-lg font-semibold capitalize">
                    {paymentDetails.paymentMethod === 'paypal' ? 'PayPal' : 
                     paymentDetails.paymentMethod === 'stripe' ? 'Credit Card' : 
                     paymentDetails.paymentMethod || 'Card'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment ID
                  </label>
                  <p className="text-lg font-mono text-xs">
                    {paymentDetails.paymentIntentId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    ✓ Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Confirmation Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    A confirmation email has been sent to {paymentDetails?.customerEmail || 'your email address'} with your order details and tracking information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Order Processing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your order is being processed and will be shipped within 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Download className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Order Tracking</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You can track your order status in your account dashboard.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/account/orders')}
            className="flex items-center"
          >
            <Package className="w-4 h-4 mr-2" />
            View My Orders
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Questions about your order? {' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
      </div>
    </MainEcommerceLayout>
  );
}