
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type Ride = {
  id: string;
  pickup_location: string;
  drop_location: string;
  date: string;
  time: string;
  vehicle_type: string;
  passengers: number;
  status: string;
  driver_name: string | null;
  driver_rating: number | null;
  vehicle_number: string | null;
  amount: number | null;
  created_at: string;
};

interface RidesHistoryProps {
  userId: string;
}

export const RidesHistory = ({ userId }: RidesHistoryProps) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchRides();
  }, [userId]);
  
  const fetchRides = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setRides(data || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast({
        title: "Error",
        description: "Failed to load ride history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatRideStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'pending_payment':
        return 'outline';
      case 'upcoming':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Ride History</CardTitle>
        <CardDescription>View all your booked rides</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : rides.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>From / To</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rides.map((ride) => (
                  <TableRow key={ride.id}>
                    <TableCell>
                      <div className="font-medium">{format(new Date(ride.date), 'MMM dd, yyyy')}</div>
                      <div className="text-sm text-muted-foreground">{ride.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[200px]">{ride.pickup_location}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">to {ride.drop_location}</div>
                    </TableCell>
                    <TableCell>{ride.vehicle_type}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(ride.status)}>
                        {formatRideStatus(ride.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ride.amount ? `$${(ride.amount / 100).toFixed(2)}` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-muted-foreground">No ride history yet</p>
            <p className="text-sm text-muted-foreground mt-1">Book a cab to start your journey</p>
            <Button className="mt-4" onClick={() => window.location.href = '/book-cab'}>
              Book a Cab
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
