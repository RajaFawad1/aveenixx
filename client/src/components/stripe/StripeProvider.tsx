import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ReactNode } from 'react';

// Get Stripe publishable key
const getStripeKey = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  console.log('Stripe key loaded:', key ? `${key.slice(0, 20)}...` : 'undefined');
  return key;
};

// Initialize Stripe with publishable key
const stripePromise = loadStripe(getStripeKey() || '');

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider = ({ children }: StripeProviderProps) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};