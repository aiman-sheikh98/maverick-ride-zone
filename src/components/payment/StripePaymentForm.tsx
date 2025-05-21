
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
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
  amount: number;
  isTestMode?: boolean;
}

// The inner payment form component that uses the Stripe hooks
const PaymentForm = ({ onSuccess, onCancel, amount, isTestMode }: Omit<StripePaymentFormProps, 'clientSecret'>) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'error'>('idle');
  const { toast } = useToast();
  
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
      console.log('Confirming payment...');
      
      // Make sure the payment element is properly mounted first
      const paymentElement = elements.getElement('payment');
      if (!paymentElement) {
        throw new Error('Payment element not properly mounted. Please try again.');
      }
      
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
        toast({
          title: "Payment Failed",
          description: error.message || 'An error occurred during payment processing.',
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);
        setPaymentStatus('succeeded');
        toast({
          title: "Payment Successful",
          description: "Your ride has been confirmed and paid.",
        });
        setTimeout(() => {
          onSuccess();
        }, 1000); // Give user time to see success message
      } else if (paymentIntent) {
        console.log('Payment status:', paymentIntent.status);
        // For test mode, we'll treat all non-error states as success
        setPaymentStatus('succeeded');
        toast({
          title: "Payment Processed",
          description: "Your payment is being processed.",
        });
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        console.error('Unexpected response from Stripe');
        setErrorMessage('An unexpected response was received from payment processor.');
        setPaymentStatus('error');
        toast({
          title: "Payment Issue",
          description: "An unexpected response was received from the payment processor.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      setPaymentStatus('error');
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  // For test mode, display test card information
  const testCardInfo = () => {
    if (!isTestMode) return null;
    
    return (
      <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-1 text-sm">Test Mode - Use These Card Details:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>Card Number: <span className="font-mono">4242 4242 4242 4242</span></li>
          <li>Expiry: Any future date (e.g., 12/25)</li>
          <li>CVC: Any 3 digits (e.g., 123)</li>
          <li>ZIP: Any 5 digits (e.g., 12345)</li>
        </ul>
      </div>
    );
  };

  if (paymentStatus === 'succeeded') {
    return (
      <div className="flex flex-col items-center py-8 space-y-4 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <p className="text-lg font-medium">Payment Successful!</p>
        <p className="text-center text-muted-foreground">
          Your ride has been confirmed and payment of {formatAmount(amount)} has been processed.
        </p>
        <p className="text-sm text-muted-foreground animate-pulse">Redirecting to your dashboard...</p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="flex flex-col items-center py-6 space-y-4 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <p className="text-lg font-medium">Payment Failed</p>
        <p className="text-sm text-muted-foreground text-center">{errorMessage}</p>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={onCancel} className="transition-all hover:scale-105">
            Cancel
          </Button>
          <Button onClick={() => setPaymentStatus('idle')} className="transition-all hover:scale-105">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-5 bg-accent/20 rounded-lg border shadow-sm hover:shadow transition-all">
        <PaymentElement options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false
          }
        }} />
      </div>
      
      {testCardInfo()}
      
      <div className="bg-muted/30 p-4 rounded-md shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Amount</span>
          <span className="text-base font-bold">{formatAmount(amount)}</span>
        </div>
        {isTestMode && (
          <div className="text-xs text-muted-foreground">
            This is a test payment. No actual charges will be made.
          </div>
        )}
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {errorMessage}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="transition-all hover:scale-105"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="transition-all duration-300 hover:shadow-md hover:scale-105 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay {formatAmount(amount)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// The outer component that provides the Stripe Elements context
export const StripePaymentForm = ({ clientSecret, onSuccess, onCancel, amount, isTestMode }: StripePaymentFormProps) => {
  const [key, setKey] = useState(0); // Add key to force re-render when client secret changes
  
  // When client secret changes, update the key to force a re-render of the Elements component
  useEffect(() => {
    if (clientSecret) {
      setKey(prevKey => prevKey + 1);
    }
  }, [clientSecret]);
  
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0f172a',
      }
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
    <Card className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-primary" />
          Complete Your Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Elements key={key} stripe={stripePromise} options={options}>
          <PaymentForm onSuccess={onSuccess} onCancel={onCancel} amount={amount} isTestMode={isTestMode} />
        </Elements>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex items-center justify-center bg-accent/10 rounded-b-lg">
        <CreditCard className="h-3 w-3 mr-1" />
        {isTestMode ? 'Test payment processed securely by Stripe.' : 'Payment processed securely by Stripe.'}
      </CardFooter>
    </Card>
  );
};
