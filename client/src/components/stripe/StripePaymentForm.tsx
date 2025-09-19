import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  customerEmail: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const StripePaymentForm = ({
  amount,
  customerEmail,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent on backend with cache busting
      const response = await fetch(`/api/create-payment-intent?t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          customerEmail: customerEmail,
          orderId: `order_${Date.now()}`,
          metadata: {
            integration_check: 'accept_a_payment',
            timestamp: Date.now().toString(),
          },
        }),
      });

      const { clientSecret, error: backendError, paymentIntentId } = await response.json();

      console.log('📝 Created new payment intent:', paymentIntentId);
      console.log('🔑 Client secret received:', clientSecret ? 'Yes' : 'No');

      if (backendError) {
        throw new Error(backendError);
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: customerEmail,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-base font-medium">
          <CreditCard className="w-4 h-4" />
          Card Information
        </Label>
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Lock className="w-4 h-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      <Button
        onClick={handlePayment}
        disabled={!stripe || isProcessing}
        className="w-full h-12 text-base font-semibold"
        style={{
          backgroundColor: 'var(--primary-color)',
          color: 'var(--primary-foreground)',
        }}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </div>
  );
};