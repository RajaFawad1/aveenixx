import { useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';

// Load Stripe - this should be done outside of component to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo_key');

interface CheckoutFormProps {
  clientSecret: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function CheckoutFormContent({ clientSecret, amount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message || 'An error occurred during payment processing.',
          variant: 'destructive',
        });
        onError?.(error.message || 'Payment failed');
      } else {
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
        });
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Secure Payment
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-4 h-4 mr-1" />
          <span>Protected by Stripe</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Amount */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
              <span className="text-2xl font-bold">${(amount / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Stripe Payment Element */}
          <div className="space-y-4">
            <PaymentElement 
              options={{
                layout: {
                  type: 'accordion',
                  defaultCollapsed: false,
                  radios: false,
                  spacedAccordionItems: true
                }
              }}
            />
          </div>

          {/* Security Notice */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Lock className="w-3 h-3 mr-1" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Pay ${(amount / 100).toFixed(2)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CheckoutForm({ clientSecret, amount, onSuccess, onError }: CheckoutFormProps) {
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutFormContent 
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}