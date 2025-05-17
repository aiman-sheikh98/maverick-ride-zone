
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, Car, User, MapPin } from 'lucide-react';

// Mock booking data
const bookings = [
  {
    id: 'B-1001',
    user: 'John Smith',
    pickup: '123 Corporate Dr.',
    dropoff: 'Airport Terminal 2',
    date: '2025-05-17',
    time: '08:30 AM',
    status: 'completed',
  },
  {
    id: 'B-1002',
    user: 'Sarah Williams',
    pickup: 'Grand Hotel',
    dropoff: 'Tech Park Building C',
    date: '2025-05-17',
    time: '09:45 AM',
    status: 'in-progress',
  },
  {
    id: 'B-1003',
    user: 'Michael Johnson',
    pickup: 'Central Station',
    dropoff: '456 Business Ave.',
    date: '2025-05-17',
    time: '10:15 AM',
    status: 'pending',
  },
  {
    id: 'B-1004',
    user: 'Emma Davis',
    pickup: 'Convention Center',
    dropoff: 'Downtown Office Tower',
    date: '2025-05-18',
    time: '09:00 AM',
    status: 'pending',
  },
  {
    id: 'B-1005',
    user: 'Robert Wilson',
    pickup: 'Industrial Complex',
    dropoff: 'South Business Center',
    date: '2025-05-18',
    time: '13:30 PM',
    status: 'cancelled',
  },
];

const AdminBookings = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.toLowerCase();
    return (
      booking.id.toLowerCase().includes(search) ||
      booking.user.toLowerCase().includes(search) ||
      booking.pickup.toLowerCase().includes(search) ||
      booking.dropoff.toLowerCase().includes(search)
    );
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">In Progress</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };
  
  const handleActionClick = (id: string, action: string) => {
    toast({
      title: `Booking ${action}`,
      description: `Booking ${id} has been ${action}.`,
    });
  };
  
  return (
    <AdminLayout activeTab="bookings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Booking Management</h1>
          <p className="text-muted-foreground">Review and manage all cab booking requests</p>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                View and manage booking requests from all users
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Pickup</TableHead>
                  <TableHead className="hidden md:table-cell">Dropoff</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-maverick-600" />
                          {booking.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {booking.user}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{booking.pickup}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{booking.dropoff}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">{booking.date}</span>
                          <span className="text-xs text-muted-foreground">{booking.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleActionClick(booking.id, 'viewed')}
                          >
                            View
                          </Button>
                          {booking.status === 'pending' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleActionClick(booking.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No bookings found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
