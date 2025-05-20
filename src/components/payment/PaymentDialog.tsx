
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { StripePaymentForm } from './StripePaymentForm';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  rideDetails: {
    rideId: string;
    pickupLocation: string;
    dropLocation: string;
    vehicleType: string;
  } | null;
}

export const PaymentDialog = ({ open, onClose, rideDetails }: PaymentDialogProps) => {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const getPaymentIntent = async () => {
      if (!open || !rideDetails) return;

      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching payment intent for ride:', rideDetails);
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { rideDetails },
        });

        if (error) {
          console.error('Error response from payment intent function:', error);
          
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => getPaymentIntent(), 1500); // Retry after 1.5 seconds
            return;
          }
          
          setError('Unable to set up payment. Please try again.');
          toast({
            title: 'Payment Setup Failed',
            description: error.message || 'Unable to set up payment process. Please try again.',
            variant: 'destructive',
          });
          return;
        }

        if (!data || !data.clientSecret) {
          console.error('Invalid response data:', data);
          setError('Invalid payment data received. Please try again.');
          toast({
            title: 'Payment Setup Failed',
            description: 'Invalid payment data received. Please try again.',
            variant: 'destructive',
          });
          return;
        }

        console.log('Payment intent created successfully');
        setClientSecret(data.clientSecret);
        setAmount(data.amount);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('Error fetching payment intent:', err);
        setError('An unexpected error occurred. Please try again.');
        toast({
          title: 'Payment Setup Failed',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getPaymentIntent();
  }, [open, rideDetails, onClose, toast, retryCount]);

  const handlePaymentSuccess = async () => {
    if (!rideDetails?.rideId) return;
    
    try {
      console.log('Updating ride status to paid');
      setIsLoading(true);
      // Update the ride status to paid and set the amount
      const { error } = await supabase
        .from('rides')
        .update({ 
          status: 'paid',
          amount: amount / 100, // Convert cents to dollars
          payment_date: new Date().toISOString()
        })
        .eq('id', rideDetails.rideId);
      
      if (error) {
        console.error('Error updating ride status:', error);
        toast({
          title: 'Update Failed',
          description: 'Your payment was successful, but we couldn\'t update your ride status.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Payment Successful',
          description: 'Your ride has been confirmed and paid.',
        });
      }
      
      onClose();
      navigate('/dashboard');
    } catch (err) {
      console.error('Error in payment success handler:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred after payment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    toast({
      title: 'Payment Cancelled',
      description: 'You have cancelled the payment process.',
    });
    onClose();
  };
  
  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    getPaymentIntent();
  };

  const getPaymentIntent = async () => {
    if (!rideDetails) return;

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching payment intent for ride:', rideDetails);
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { rideDetails },
      });

      if (error) {
        console.error('Error response from payment intent function:', error);
        setError('Unable to set up payment. Please try again.');
        toast({
          title: 'Payment Setup Failed',
          description: error.message || 'Unable to set up payment process. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (!data || !data.clientSecret) {
        console.error('Invalid response data:', data);
        setError('Invalid payment data received. Please try again.');
        toast({
          title: 'Payment Setup Failed',
          description: 'Invalid payment data received. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      console.log('Payment intent created successfully');
      setClientSecret(data.clientSecret);
      setAmount(data.amount);
    } catch (err) {
      console.error('Error fetching payment intent:', err);
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: 'Payment Setup Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900 border-primary/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Complete Your Payment
          </DialogTitle>
          <DialogDescription>
            Please complete the payment to confirm your ride booking.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Setting up payment...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold">Payment Failed</h3>
              <p className="text-destructive text-center">{error}</p>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="transition-all hover:scale-105"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRetry}
                className="bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <StripePaymentForm 
            clientSecret={clientSecret}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
            amount={amount}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
