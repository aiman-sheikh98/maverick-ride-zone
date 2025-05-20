
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Clock, History, Filter, Calendar, Check, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  user_id: string;
};

interface RidesHistoryProps {
  userId: string;
}

export const RidesHistory = ({ userId }: RidesHistoryProps) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [cancelRideId, setCancelRideId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rideDetails, setRideDetails] = useState<Ride | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [paymentSuccessDialogOpen, setPaymentSuccessDialogOpen] = useState(false);
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
  
  useEffect(() => {
    // Filter rides based on active tab
    if (activeTab === "all") {
      setFilteredRides(rides);
    } else {
      setFilteredRides(rides.filter(ride => ride.status === activeTab));
    }
  }, [rides, activeTab]);

  // Check URL for payment success
  useEffect(() => {
    // Check if URL contains payment_success=true
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const rideId = urlParams.get('ride_id');
    
    if (paymentSuccess === 'true' && rideId) {
      // Find the ride in the list
      const successRide = rides.find(ride => ride.id === rideId);
      if (successRide) {
        setRideDetails(successRide);
        setPaymentSuccessDialogOpen(true);
        
        // Clear the URL parameters without refreshing the page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [rides]);

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
      
      // Make sure data conforms to our Ride type
      setRides(data as Ride[]);
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

  const handleCancelRide = async () => {
    if (!cancelRideId) return;
    
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', cancelRideId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Ride Cancelled",
        description: "Your ride has been cancelled successfully.",
      });
      
      // Update local state
      setRides(prevRides => 
        prevRides.map(ride => 
          ride.id === cancelRideId ? { ...ride, status: 'cancelled' } : ride
        )
      );
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast({
        title: "Error",
        description: "Failed to cancel ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelDialogOpen(false);
      setCancelRideId(null);
    }
  };

  const openCancelDialog = (rideId: string) => {
    setCancelRideId(rideId);
    setCancelDialogOpen(true);
  };

  const showRideDetails = (ride: Ride) => {
    setRideDetails(ride);
    setDetailsDialogOpen(true);
  };

  const closePaymentSuccessDialog = () => {
    setPaymentSuccessDialogOpen(false);
    setRideDetails(null);
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
      case 'upcoming':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CreditCard className="h-4 w-4 mr-1" />;
      case 'completed':
        return <Check className="h-4 w-4 mr-1" />;
      case 'cancelled':
        return <X className="h-4 w-4 mr-1" />;
      case 'pending_payment':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Calculate statistics
  const totalRides = rides.length;
  const totalSpent = rides
    .filter(ride => ride.status === 'paid' || ride.status === 'completed')
    .reduce((sum, ride) => sum + (ride.amount || 0), 0);
  const cancelledRides = rides.filter(ride => ride.status === 'cancelled').length;
  
  return (
    <>
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
              className="hidden sm:flex transition-transform hover:scale-105"
            >
              <Clock className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardHeader>
        
        <div className="px-6 pt-2 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-muted/30 p-2 rounded-md">
              <span className="text-xs font-medium text-muted-foreground">Total Rides</span>
              <p className="text-lg font-bold">{totalRides}</p>
            </div>
            <div className="bg-muted/30 p-2 rounded-md">
              <span className="text-xs font-medium text-muted-foreground">Total Spent</span>
              <p className="text-lg font-bold">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-muted/30 p-2 rounded-md">
              <span className="text-xs font-medium text-muted-foreground">Cancelled</span>
              <p className="text-lg font-bold">{cancelledRides}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <TabsList className="bg-muted/30">
              <TabsTrigger
                value="all"
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                onClick={() => setActiveTab("paid")}
                className={activeTab === "paid" ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
              >
                Paid
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                onClick={() => setActiveTab("cancelled")}
                className={activeTab === "cancelled" ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger
                value="pending_payment"
                onClick={() => setActiveTab("pending_payment")}
                className={activeTab === "pending_payment" ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
              >
                Pending
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRides.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>From / To</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRides.map((ride) => (
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
                        <div className="font-medium truncate max-w-[150px] lg:max-w-[200px] group-hover:text-primary transition-colors">{ride.pickup_location}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[150px] lg:max-w-[200px]">to {ride.drop_location}</div>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => showRideDetails(ride)}
                            className="transition-all hover:scale-105 text-xs px-2 py-1 h-auto"
                          >
                            Details
                          </Button>
                          
                          {(ride.status === 'upcoming' || ride.status === 'pending_payment') && (
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => openCancelDialog(ride.id)}
                              className="transition-all hover:scale-105 text-xs px-2 py-1 h-auto"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
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
              <p className="text-lg font-medium text-muted-foreground">
                {activeTab === "all" ? "No ride history yet" : `No ${activeTab} rides found`}
              </p>
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

        {/* Cancelled rides section */}
        {activeTab === "all" && cancelledRides > 0 && (
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <X className="h-4 w-4 p-0.5 bg-destructive/10 rounded-full text-destructive" />
                Cancelled Rides
              </h3>
              <p className="text-sm text-muted-foreground">History of cancelled rides</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rides
                .filter(ride => ride.status === 'cancelled')
                .slice(0, 3)
                .map(ride => (
                  <Card key={ride.id} className="bg-muted/10 hover:bg-muted/20 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{format(new Date(ride.date), 'MMM dd, yyyy')}</CardTitle>
                          <CardDescription>{ride.time}</CardDescription>
                        </div>
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <X className="h-3 w-3" /> Cancelled
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="text-sm space-y-2">
                        <div>
                          <div className="text-xs text-muted-foreground">From</div>
                          <div className="font-medium truncate">{ride.pickup_location}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">To</div>
                          <div className="font-medium truncate">{ride.drop_location}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            {cancelledRides > 3 && (
              <div className="mt-2 text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("cancelled")}
                  className="text-xs"
                >
                  View all cancelled rides →
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      {/* Cancel ride confirmation dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Ride</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this ride? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setCancelDialogOpen(false)}
              className="transition-all hover:scale-105"
            >
              No, keep ride
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelRide}
              className="bg-destructive hover:bg-destructive/90 transition-all hover:scale-105"
            >
              Yes, cancel ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Ride details dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Ride Details
            </DialogTitle>
            <DialogDescription>
              Complete information about your ride
            </DialogDescription>
          </DialogHeader>
          
          {rideDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Date</div>
                  <div className="font-medium">{format(new Date(rideDetails.date), 'PPP')}</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Time</div>
                  <div className="font-medium">{rideDetails.time}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">From</div>
                <div className="font-medium bg-muted/20 p-3 rounded-md">{rideDetails.pickup_location}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">To</div>
                <div className="font-medium bg-muted/20 p-3 rounded-md">{rideDetails.drop_location}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Vehicle Type</div>
                  <div className="font-medium capitalize">{rideDetails.vehicle_type}</div>
                </div>
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Passengers</div>
                  <div className="font-medium">{rideDetails.passengers}</div>
                </div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Status</div>
                <Badge 
                  variant={getBadgeVariant(rideDetails.status)} 
                  className="mt-1"
                >
                  {formatRideStatus(rideDetails.status)}
                </Badge>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Amount</div>
                <div className="font-medium text-lg">{rideDetails.amount ? `$${rideDetails.amount.toFixed(2)}` : 'Not charged'}</div>
              </div>
              
              {rideDetails.payment_date && (
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Payment Date</div>
                  <div className="font-medium">{format(new Date(rideDetails.payment_date), 'PPP')}</div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button 
              onClick={() => setDetailsDialogOpen(false)}
              className="transition-all hover:scale-105"
            >
              Close
            </Button>
            
            {rideDetails && (rideDetails.status === 'upcoming' || rideDetails.status === 'pending_payment') && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  setDetailsDialogOpen(false);
                  openCancelDialog(rideDetails.id);
                }}
                className="transition-all hover:scale-105"
              >
                Cancel Ride
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog open={paymentSuccessDialogOpen} onOpenChange={closePaymentSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Check className="h-5 w-5 p-0.5 rounded-full border border-primary" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription>
              Your ride payment has been processed successfully
            </DialogDescription>
          </DialogHeader>
          
          {rideDetails && (
            <div className="p-4 bg-muted/20 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-lg">${rideDetails.amount?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="font-medium">{format(new Date(), 'PPP')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="default" className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> Paid
                </Badge>
              </div>
              
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">Ride Details:</div>
                <div className="text-sm font-medium">{rideDetails.pickup_location}</div>
                <div className="text-xs text-muted-foreground my-1">to</div>
                <div className="text-sm font-medium">{rideDetails.drop_location}</div>
              </div>
            </div>
          )}
          
          <div className="bg-primary/5 p-3 rounded-md border border-primary/10 text-center">
            <p className="text-sm">Thank you for your payment! Your ride is now confirmed.</p>
          </div>
          
          <DialogFooter className="flex justify-center sm:justify-center pt-2">
            <Button 
              onClick={closePaymentSuccessDialog}
              className="transition-all hover:scale-105 w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
