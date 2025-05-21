
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, CreditCard, Clock, Trash2, Info, AlertTriangle } from 'lucide-react';

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
  payment_date?: string | null;
  payment_intent_id?: string | null;
};

type RideStatus = 'all' | 'upcoming' | 'paid' | 'completed' | 'cancelled' | 'pending_payment';

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelRideId, setCancelRideId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RideStatus>('all');

  useEffect(() => {
    if (!user) return;

    const fetchRides = async () => {
      try {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching rides:', error);
          toast({
            title: "Error",
            description: "Failed to fetch ride history. Please try again later.",
            variant: "destructive",
          });
        } else {
          setRides(data || []);
        }
      } catch (error) {
        console.error('Ride fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('public:rides')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'rides',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRides(prev => [payload.new as Ride, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRides(prev => 
              prev.map(ride => 
                ride.id === payload.new.id ? payload.new as Ride : ride
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRides(prev => 
              prev.filter(ride => ride.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleCancelRide = async (rideId: string) => {
    setCancelRideId(rideId);
    setShowCancelDialog(true);
  };

  const confirmCancelRide = async () => {
    if (!user || !cancelRideId) return;

    setShowCancelDialog(false);
    
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', cancelRideId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error cancelling ride:', error);
        toast({
          title: "Cancellation Failed",
          description: "Could not cancel the ride. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ride Cancelled",
          description: `Ride has been cancelled successfully.`,
        });
        
        // Update local state
        setRides(prev => 
          prev.map(ride => 
            ride.id === cancelRideId ? { ...ride, status: 'cancelled' } : ride
          )
        );
      }
    } catch (error) {
      console.error('Ride cancellation error:', error);
    } finally {
      setCancelRideId(null);
    }
  };

  const getVehicleImage = (vehicleType: string) => {
    switch (vehicleType.toLowerCase()) {
      case 'sedan':
        return '/vehicles/sedan.jpg';
      case 'suv':
        return '/vehicles/suv.jpg';
      case 'luxury':
        return '/vehicles/luxury.jpg';
      default:
        return '/vehicles/sedan.jpg';
    }
  };

  // Filter rides based on status
  const filteredRides = filterStatus === 'all' 
    ? rides 
    : rides.filter(ride => ride.status === filterStatus);
  
  // Calculate statistics
  const totalRides = rides.length;
  const upcomingRides = rides.filter(ride => ride.status === 'upcoming').length;
  const totalSpent = rides
    .filter(ride => ride.status === 'paid' || ride.status === 'completed')
    .reduce((sum, ride) => sum + (ride.amount || 0), 0);
  const cancelledRides = rides.filter(ride => ride.status === 'cancelled').length;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] py-16">
        <div className="container px-4 mx-auto md:px-8">
          <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle>Total Rides</CardTitle>
                <CardDescription>All time history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalRides}</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Rides</CardTitle>
                <CardDescription>Scheduled pickups</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{upcomingRides}</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle>Total Spent</CardTitle>
                <CardDescription>All rides combined</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  ${totalSpent.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle>Cancelled</CardTitle>
                <CardDescription>Cancelled rides</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-500">{cancelledRides}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6 hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Ride History</CardTitle>
                  <CardDescription>View all your past and upcoming rides</CardDescription>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => setFilterStatus('all')} 
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    All
                  </Button>
                  <Button 
                    onClick={() => setFilterStatus('upcoming')} 
                    variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Upcoming
                  </Button>
                  <Button 
                    onClick={() => setFilterStatus('pending_payment')} 
                    variant={filterStatus === 'pending_payment' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Pending Payment
                  </Button>
                  <Button 
                    onClick={() => setFilterStatus('paid')} 
                    variant={filterStatus === 'paid' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    Paid
                  </Button>
                  <Button 
                    onClick={() => setFilterStatus('completed')} 
                    variant={filterStatus === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    Completed
                  </Button>
                  <Button 
                    onClick={() => setFilterStatus('cancelled')} 
                    variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Cancelled
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {rides.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg font-medium text-muted-foreground">No ride history yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Book a cab to start your journey</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/book-cab'}>
                    Book a Cab
                  </Button>
                </div>
              ) : filteredRides.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg font-medium text-muted-foreground">No {filterStatus} rides found</p>
                  <Button className="mt-4" variant="outline" onClick={() => setFilterStatus('all')}>
                    Show All Rides
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Pickup/Dropoff</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRides.map((ride) => (
                        <TableRow key={ride.id} className="hover:bg-accent/20 transition-all">
                          <TableCell>
                            <div className="font-medium">{new Date(ride.date).toLocaleDateString()}</div>
                            <div className="text-sm text-muted-foreground">{ride.time}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{ride.pickup_location}</div>
                            <div className="text-sm text-muted-foreground">to {ride.drop_location}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <img 
                                src={getVehicleImage(ride.vehicle_type)} 
                                alt={ride.vehicle_type} 
                                className="h-8 w-8 rounded object-cover"
                              />
                              <span>{ride.vehicle_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {ride.driver_name ? (
                              <div>
                                <div>{ride.driver_name}</div>
                                {ride.driver_rating && (
                                  <div className="text-sm text-yellow-500">
                                    {'★'.repeat(Math.floor(ride.driver_rating))}
                                    {ride.driver_rating % 1 >= 0.5 ? '½' : ''}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                ride.status === 'completed' ? 'secondary' : 
                                ride.status === 'paid' ? 'default' : 
                                ride.status === 'cancelled' ? 'destructive' : 
                                ride.status === 'pending_payment' ? 'outline' : 
                                'default'
                              }
                              className={
                                ride.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                                ride.status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                                ''
                              }
                            >
                              {ride.status.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {ride.amount ? (
                              <span className="font-medium text-green-600">${ride.amount.toFixed(2)}</span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {ride.status === 'upcoming' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Ride</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this ride? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No, keep it</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleCancelRide(ride.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Yes, cancel ride
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            {ride.status === 'pending_payment' && (
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-primary hover:bg-primary/90 flex items-center gap-1"
                                onClick={() => window.location.href = `/book-cab?ride_id=${ride.id}&payment=true`}
                              >
                                <CreditCard className="h-3 w-3" />
                                Pay Now
                              </Button>
                            )}
                            {(ride.status === 'completed' || ride.status === 'paid') && (
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                Details
                              </Button>
                            )}
                            {ride.status === 'cancelled' && (
                              <Button variant="ghost" size="sm" className="text-red-500" disabled>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Cancelled
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Ride</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this ride? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelRideId(null)}>No, keep it</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelRide}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, cancel ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Dashboard;
