
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
  amount: number;
}

// The inner payment form component that uses the Stripe hooks
const PaymentForm = ({ onSuccess, onCancel, amount }: Omit<StripePaymentFormProps, 'clientSecret'>) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        // Payment succeeded
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

// The outer component that provides the Stripe Elements context
export const StripePaymentForm = ({ clientSecret, onSuccess, onCancel, amount }: StripePaymentFormProps) => {
  // Fix: Use the correct type for options
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const, // Use type assertion here
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
      </CardHeader>
      <CardContent>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm onSuccess={onSuccess} onCancel={onCancel} amount={amount} />
          </Elements>
        ) : (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your payment is processed securely by Stripe.
      </CardFooter>
    </Card>
  );
};
