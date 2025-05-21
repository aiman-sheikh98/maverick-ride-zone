
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle, CreditCard, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ride {
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
}

interface RidesHistoryProps {
  userId: string;
}

export const RidesHistory = ({ userId }: RidesHistoryProps) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const pageSize = 5;
  const { toast } = useToast();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const query = supabase
          .from('rides')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          setRides(data);
        }
      } catch (error) {
        console.error('Error fetching rides', error);
        toast({
          title: "Error fetching ride history",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRides();
    }
  }, [userId, toast]);

  // Calculate total pages
  const filteredRides = filterStatus === 'all' 
    ? rides 
    : rides.filter(ride => ride.status === filterStatus);

  const totalPages = Math.ceil(filteredRides.length / pageSize);
  
  // Get current page data
  const currentRides = filteredRides.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleGoToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
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

  const handlePayNow = (rideId: string) => {
    window.location.href = `/book-cab?ride_id=${rideId}&payment=true`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;
    
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ride History</CardTitle>
          <CardDescription>No rides yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven't booked any rides yet.</p>
          <Button onClick={() => window.location.href = "/book-cab"}>
            Book a Cab
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalRides = rides.length;
  const upcomingRides = rides.filter(ride => ride.status === 'upcoming').length;
  const pendingPaymentRides = rides.filter(ride => ride.status === 'pending_payment').length;
  const completedRides = rides.filter(ride => ride.status === 'completed' || ride.status === 'paid').length;
  const cancelledRides = rides.filter(ride => ride.status === 'cancelled').length;
  const totalSpent = rides
    .filter(ride => ride.status === 'paid' || ride.status === 'completed')
    .reduce((sum, ride) => sum + (ride.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalRides}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{upcomingRides}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedRides}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Ride History</CardTitle>
              <CardDescription>View your past and upcoming rides</CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => { setFilterStatus('all'); setPage(1); }} 
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
              >
                All Rides
              </Button>
              <Button 
                onClick={() => { setFilterStatus('upcoming'); setPage(1); }} 
                variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
              >
                <Clock className="h-3 w-3 mr-1" />
                Upcoming
              </Button>
              {pendingPaymentRides > 0 && (
                <Button 
                  onClick={() => { setFilterStatus('pending_payment'); setPage(1); }} 
                  variant={filterStatus === 'pending_payment' ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Pending Payment
                </Button>
              )}
              {cancelledRides > 0 && (
                <Button 
                  onClick={() => { setFilterStatus('cancelled'); setPage(1); }} 
                  variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Cancelled
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRides.length === 0 ? (
            <div className="text-center py-6">
              <p className="font-medium">No {filterStatus} rides found</p>
              <Button className="mt-4" variant="outline" onClick={() => { setFilterStatus('all'); setPage(1); }}>
                Show All Rides
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Locations</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRides.map((ride) => (
                      <TableRow key={ride.id} className="hover:bg-accent/20 transition-all">
                        <TableCell>
                          <div className="font-medium">{new Date(ride.date).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">{ride.time}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">From:</span> {ride.pickup_location}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">To:</span> {ride.drop_location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <img 
                              src={getVehicleImage(ride.vehicle_type)} 
                              alt={ride.vehicle_type} 
                              className="h-7 w-7 rounded-sm object-cover"
                            />
                            <div className="text-sm">{ride.vehicle_type}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              ride.status === 'completed' ? 'secondary' : 
                              ride.status === 'paid' ? 'default' : 
                              ride.status === 'cancelled' ? 'destructive' : 
                              'outline'
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
                          {ride.amount ? `$${ride.amount.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          {ride.status === 'pending_payment' && (
                            <Button 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handlePayNow(ride.id)}
                            >
                              Pay Now
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handleGoToPage(page - 1)}
                          className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            onClick={() => handleGoToPage(pageNumber)}
                            isActive={pageNumber === page}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handleGoToPage(page + 1)}
                          className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
