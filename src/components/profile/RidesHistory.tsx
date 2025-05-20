
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Clock, History } from 'lucide-react';
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
  payment_date: string | null;
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

    // Subscribe to realtime updates
    const channel = supabase
      .channel('rides_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'rides',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchRides(); // Refresh rides on any changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending_payment':
        return 'Payment Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'pending_payment':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'completed':
        return <History className="h-4 w-4 mr-1" />;
      case 'pending_payment':
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              My Ride History
            </CardTitle>
            <CardDescription>View all your booked rides</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRides}
            className="hidden sm:flex"
          >
            <Clock className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
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
                <TableRow className="bg-muted/50 hover:bg-muted">
                  <TableHead>Date & Time</TableHead>
                  <TableHead>From / To</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rides.map((ride) => (
                  <TableRow key={ride.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell>
                      <div className="font-medium">{format(new Date(ride.date), 'MMM dd, yyyy')}</div>
                      <div className="text-sm text-muted-foreground">{ride.time}</div>
                      {ride.payment_date && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Paid on {format(new Date(ride.payment_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[200px] group-hover:text-primary transition-colors">{ride.pickup_location}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">to {ride.drop_location}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={`/vehicles/${ride.vehicle_type.toLowerCase()}.jpg`} 
                          alt={ride.vehicle_type} 
                          className="h-8 w-8 rounded-full object-cover border border-muted-foreground/20" 
                        />
                        <span className="capitalize">{ride.vehicle_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getBadgeVariant(ride.status)} 
                        className="flex items-center gap-1 transition-all hover:shadow-sm"
                      >
                        {getStatusIcon(ride.status)}
                        {formatRideStatus(ride.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ride.amount ? (
                        <div className="font-medium">
                          ${ride.amount.toFixed(2)}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <div className="inline-flex justify-center items-center p-4 bg-primary/10 rounded-full mb-4">
              <History className="h-6 w-6 text-primary" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">No ride history yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Book a cab to start your journey</p>
            <Button 
              className="mt-2 transition-all hover:translate-y-[-2px]" 
              onClick={() => window.location.href = '/book-cab'}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Book a Cab
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
