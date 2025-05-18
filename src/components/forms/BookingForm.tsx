
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Import our new components
import { VehicleSelector } from '@/components/booking/VehicleSelector';
import { LocationInputs } from '@/components/booking/LocationInputs';
import { DateTimePicker } from '@/components/booking/DateTimePicker';
import { PassengerSelector } from '@/components/booking/PassengerSelector';

export const BookingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    date: undefined as Date | undefined,
    time: '',
    vehicleType: '',
    passengers: '1',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a ride.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!formData.date) {
      toast({
        title: "Date Required",
        description: "Please select a date for your ride.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          pickup_location: formData.pickupLocation,
          drop_location: formData.dropLocation,
          date: format(formData.date, 'yyyy-MM-dd'),
          time: formData.time,
          vehicle_type: formData.vehicleType,
          passengers: parseInt(formData.passengers, 10),
          status: 'upcoming'
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Booking Confirmed",
        description: "Your cab booking request has been submitted!",
      });
      
      // Redirect to dashboard to see the new booking
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error booking ride:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicleType: string) => {
    setFormData(prev => ({ ...prev, vehicleType }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handlePassengersChange = (passengers: string) => {
    setFormData(prev => ({ ...prev, passengers }));
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>Book a Cab</CardTitle>
        <CardDescription>Enter your trip details to request a cab</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocationInputs 
            pickupLocation={formData.pickupLocation}
            dropLocation={formData.dropLocation}
            handleChange={handleChange}
          />

          <DateTimePicker 
            date={formData.date}
            time={formData.time}
            onDateChange={handleDateChange}
            onTimeChange={handleChange}
          />

          <div className="space-y-2">
            <label>Select Vehicle Type</label>
            <div className="relative mt-2">
              <VehicleSelector 
                selectedVehicleType={formData.vehicleType}
                onVehicleSelect={handleVehicleSelect}
              />
            </div>
          </div>

          <PassengerSelector 
            passengers={formData.passengers}
            onPassengersChange={handlePassengersChange}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Request Cab"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
