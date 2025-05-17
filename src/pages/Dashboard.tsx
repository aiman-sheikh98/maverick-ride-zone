
import React from 'react';
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

// Mock data for ride history
const rideHistory = [
  {
    id: "RIDE-1234",
    date: "2024-05-15",
    time: "09:30 AM",
    pickup: "Corporate HQ, Downtown",
    dropoff: "Airport Terminal B",
    vehicle: "Sedan",
    driver: "John Smith",
    status: "completed",
    amount: "$45.50",
  },
  {
    id: "RIDE-1235",
    date: "2024-05-16",
    time: "14:15 PM",
    pickup: "Conference Center",
    dropoff: "Hotel Grandeur",
    vehicle: "SUV",
    driver: "Sarah Johnson",
    status: "completed",
    amount: "$32.75",
  },
  {
    id: "RIDE-1236",
    date: "2024-05-17",
    time: "18:00 PM",
    pickup: "Tech Park, Building 3",
    dropoff: "Westside Apartments",
    vehicle: "Luxury",
    driver: "Michael Chen",
    status: "upcoming",
    amount: "$60.00",
  }
];

const Dashboard = () => {
  const { toast } = useToast();

  const handleCancelRide = (rideId: string) => {
    // In a real app, this would make an API call to cancel the ride
    toast({
      title: "Ride Cancelled",
      description: `Ride ${rideId} has been cancelled.`,
    });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-16">
        <div className="container px-4 mx-auto md:px-8">
          <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Rides</CardTitle>
                <CardDescription>All time history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{rideHistory.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Rides</CardTitle>
                <CardDescription>Scheduled pickups</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{rideHistory.filter(ride => ride.status === 'upcoming').length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Spent</CardTitle>
                <CardDescription>All rides combined</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${rideHistory.reduce((sum, ride) => sum + parseFloat(ride.amount.slice(1)), 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ride History</CardTitle>
              <CardDescription>View all your past and upcoming rides</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {rideHistory.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell>
                        <div className="font-medium">{ride.date}</div>
                        <div className="text-sm text-muted-foreground">{ride.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{ride.pickup}</div>
                        <div className="text-sm text-muted-foreground">to {ride.dropoff}</div>
                      </TableCell>
                      <TableCell>{ride.vehicle}</TableCell>
                      <TableCell>{ride.driver}</TableCell>
                      <TableCell>
                        <Badge variant={ride.status === 'completed' ? 'secondary' : 'default'}>
                          {ride.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </Badge>
                      </TableCell>
                      <TableCell>{ride.amount}</TableCell>
                      <TableCell>
                        {ride.status === 'upcoming' && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleCancelRide(ride.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {ride.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
