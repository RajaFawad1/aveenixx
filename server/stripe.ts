import Stripe from 'stripe';

// Allow development mode without Stripe keys for initial setup
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });
} else {
  console.warn('STRIPE_SECRET_KEY not found - Stripe functionality will be disabled');
}

export interface CreatePaymentIntentParams {
  amount: number; // Amount in cents
  currency?: string;
  customerEmail?: string;
  orderId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export async function createPaymentIntent({
  amount,
  currency = 'usd',
  customerEmail,
  orderId,
  metadata = {}
}: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is an integer
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId || `order_${Date.now()}`,
        customerEmail: customerEmail || '',
        ...metadata,
      },
      receipt_email: customerEmail,
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: paymentIntent.created * 1000, // Convert to milliseconds
      customerEmail: paymentIntent.receipt_email,
      orderId: paymentIntent.metadata?.orderId,
      metadata: paymentIntent.metadata,
    };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw new Error('Failed to retrieve payment intent');
  }
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw new Error('Failed to confirm payment intent');
  }
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount, // If not provided, refunds the full amount
    });

    return {
      id: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
      created: refund.created * 1000,
    };
  } catch (error) {
    console.error('Error creating refund:', error);
    throw new Error('Failed to create refund');
  }
}

export async function listPaymentIntents(limit: number = 10) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
  }
  
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit,
    });

    return paymentIntents.data.map(pi => ({
      id: pi.id,
      amount: pi.amount,
      currency: pi.currency,
      status: pi.status,
      created: pi.created * 1000,
      customerEmail: pi.receipt_email,
      orderId: pi.metadata?.orderId,
    }));
  } catch (error) {
    console.error('Error listing payment intents:', error);
    throw new Error('Failed to list payment intents');
  }
}

export default stripe;