
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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getPaymentIntent = async () => {
      if (!open || !rideDetails) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { rideDetails },
        });

        if (error) {
          throw error;
        }

        setClientSecret(data.clientSecret);
        setAmount(data.amount);
      } catch (error) {
        console.error('Error fetching payment intent:', error);
        toast({
          title: 'Payment Setup Failed',
          description: 'Unable to set up payment process. Please try again.',
          variant: 'destructive',
        });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    getPaymentIntent();
  }, [open, rideDetails, onClose, toast]);

  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment Successful',
      description: 'Your ride has been confirmed.',
    });
    onClose();
    navigate('/dashboard');
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
