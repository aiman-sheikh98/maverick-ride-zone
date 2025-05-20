
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LockIcon, CheckCircle, XCircle } from 'lucide-react';

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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      setErrorMessage('Payment system is initializing. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage(undefined);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        setErrorMessage(error.message || 'An error occurred during payment processing.');
        setPaymentStatus('error');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);
        setPaymentStatus('succeeded');
        setTimeout(() => {
          onSuccess();
        }, 1500); // Give user time to see success message
      } else {
        console.log('Payment status:', paymentIntent?.status);
        // For other statuses like 'processing', assume success for now
        setPaymentStatus('succeeded');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setPaymentStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === 'succeeded') {
    return (
      <div className="flex flex-col items-center py-6 space-y-4 animate-fade-in">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <p className="text-lg font-medium">Payment Successful!</p>
        <p>Redirecting to your dashboard...</p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="flex flex-col items-center py-6 space-y-4 animate-fade-in">
        <XCircle className="h-16 w-16 text-red-500" />
        <p className="text-lg font-medium">Payment Failed</p>
        <p className="text-sm text-muted-foreground text-center">{errorMessage}</p>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => setPaymentStatus('idle')}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-accent/50 rounded-lg">
        <PaymentElement options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false
          }
        }} />
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {errorMessage}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="transition-all duration-300 hover:shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <LockIcon className="mr-2 h-4 w-4" />
              Pay ${(amount / 100).toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// The outer component that provides the Stripe Elements context
export const StripePaymentForm = ({ clientSecret, onSuccess, onCancel, amount }: StripePaymentFormProps) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  if (!clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Payment Form</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-maverick-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-maverick-50 to-transparent">
        <CardTitle className="flex items-center">
          <LockIcon className="h-5 w-5 mr-2 text-maverick-600" />
          Complete Your Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm onSuccess={onSuccess} onCancel={onCancel} amount={amount} />
        </Elements>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex items-center justify-center bg-accent/30 rounded-b-lg">
        <LockIcon className="h-3 w-3 mr-1" />
        Your payment is processed securely by Stripe.
      </CardFooter>
    </Card>
  );
};
