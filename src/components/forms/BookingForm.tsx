
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface Vehicle {
  id: string;
  name: string;
  image: string;
  capacity: string;
  type: string;
}

const vehicles: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan",
    image: "/vehicles/sedan.jpg",
    capacity: "4",
    type: "sedan"
  },
  {
    id: "suv",
    name: "SUV",
    image: "/vehicles/suv.jpg",
    capacity: "6",
    type: "suv"
  },
  {
    id: "luxury",
    name: "Luxury",
    image: "/vehicles/luxury.jpg",
    capacity: "4",
    type: "luxury"
  },
  {
    id: "van",
    name: "Van",
    image: "/vehicles/van.jpg",
    capacity: "8",
    type: "van"
  }
];

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

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>Book a Cab</CardTitle>
        <CardDescription>Enter your trip details to request a cab</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickupLocation">Pickup Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="pickupLocation"
                name="pickupLocation"
                placeholder="Enter pickup address"
                className="pl-10"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropLocation">Drop Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="dropLocation"
                name="dropLocation"
                placeholder="Enter destination address"
                className="pl-10"
                value={formData.dropLocation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  className="pl-10"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Vehicle Type</Label>
            <div className="relative mt-2">
              <Carousel className="w-full">
                <CarouselContent>
                  {vehicles.map((vehicle) => (
                    <CarouselItem key={vehicle.id} className="basis-full sm:basis-1/2 md:basis-1/2">
                      <div 
                        className={cn(
                          "p-2 h-full flex flex-col items-center cursor-pointer",
                          formData.vehicleType === vehicle.id ? "bg-accent rounded-md" : ""
                        )}
                        onClick={() => handleVehicleSelect(vehicle.id)}
                      >
                        <div className="relative h-32 w-full overflow-hidden rounded-md mb-2">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-xs text-muted-foreground">Seats {vehicle.capacity}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers">Passengers</Label>
            <Select 
              onValueChange={(value) => setFormData(prev => ({ ...prev, passengers: value }))}
              value={formData.passengers}
            >
              <SelectTrigger id="passengers">
                <SelectValue placeholder="# of people" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Person</SelectItem>
                <SelectItem value="2">2 People</SelectItem>
                <SelectItem value="3">3 People</SelectItem>
                <SelectItem value="4">4 People</SelectItem>
                <SelectItem value="5+">5+ People</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Request Cab"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
