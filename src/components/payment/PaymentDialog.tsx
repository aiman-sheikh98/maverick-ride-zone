
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { StripePaymentForm } from './StripePaymentForm';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

    getPaymentIntent();
  }, [open, rideDetails, onClose, toast]);

  const handlePaymentSuccess = async () => {
    if (!rideDetails?.rideId) return;
    
    try {
      console.log('Updating ride status to completed');
      setIsLoading(true);
      // Update the ride status to completed and set the amount
      const { error } = await supabase
        .from('rides')
        .update({ 
          status: 'completed',
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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            Please complete the payment to confirm your ride booking.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-6 space-y-4">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              Close
            </button>
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
