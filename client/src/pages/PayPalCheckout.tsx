import { useState } from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useLocation } from 'wouter';
import PayPalButton from "@/components/PayPalButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';

export default function PayPalCheckout() {
  const [location, setLocation] = useLocation();
  const [amount, setAmount] = useState('29.99');

  const handlePaymentSuccess = (details: any) => {
    // Navigate to success page with payment details
    setLocation('/success?payment=paypal&amount=' + amount);
  };

  const handlePaymentError = (error: any) => {
    console.error('PayPal payment error:', error);
  };

  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">PayPal Configuration Required</CardTitle>
            <CardDescription>
              PayPal client ID is not configured. Please add VITE_PAYPAL_CLIENT_ID to your environment variables.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => setLocation('/stripe-checkout')}
              className="w-full"
            >
              Use Stripe Instead
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">PayPal Checkout</CardTitle>
            <CardDescription>
              Complete your purchase securely with PayPal
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your payment is processed securely through PayPal's encrypted servers
              </p>
            </div>

            <PayPalScriptProvider options={{ 
              "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "",
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "",
              currency: "USD"
            }}>
              <PayPalButton 
                amount={amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </PayPalScriptProvider>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Or pay with{' '}
                <button
                  onClick={() => setLocation('/stripe-checkout')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Stripe
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}