
import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Car, Clock, MapPin, Users } from 'lucide-react';

const data = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 7 },
  { name: 'Wed', bookings: 5 },
  { name: 'Thu', bookings: 6 },
  { name: 'Fri', bookings: 10 },
  { name: 'Sat', bookings: 3 },
  { name: 'Sun', bookings: 2 },
];

const AdminDashboard = () => {
  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of bookings, service areas, and other important metrics.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <h3 className="text-2xl font-bold mt-1">247</h3>
                <p className="text-xs text-green-600 mt-1">+12% from last week</p>
              </div>
              <div className="p-3 bg-maverick-100 rounded-full">
                <Car className="h-5 w-5 text-maverick-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Service Areas</p>
                <h3 className="text-2xl font-bold mt-1">6</h3>
                <p className="text-xs text-blue-600 mt-1">No change from last week</p>
              </div>
              <div className="p-3 bg-maverick-100 rounded-full">
                <MapPin className="h-5 w-5 text-maverick-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                <h3 className="text-2xl font-bold mt-1">4.2m</h3>
                <p className="text-xs text-green-600 mt-1">-0.5m from last week</p>
              </div>
              <div className="p-3 bg-maverick-100 rounded-full">
                <Clock className="h-5 w-5 text-maverick-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered Users</p>
                <h3 className="text-2xl font-bold mt-1">189</h3>
                <p className="text-xs text-green-600 mt-1">+8 from last week</p>
              </div>
              <div className="p-3 bg-maverick-100 rounded-full">
                <Users className="h-5 w-5 text-maverick-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Bookings</CardTitle>
              <CardDescription>Overview of cab bookings for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="bookings" stroke="#7e69ab" fill="#9b87f5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-accent rounded-md">
                  <div className="h-2 w-2 rounded-full bg-maverick-600 mt-1"></div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">New booking from John Smith</p>
                    <p className="text-xs text-muted-foreground">Pickup at 08:30 AM today</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">5 min ago</span>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-accent rounded-md">
                  <div className="h-2 w-2 rounded-full bg-maverick-600 mt-1"></div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">New service area added</p>
                    <p className="text-xs text-muted-foreground">Tech Park Zone is now active</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">2 hours ago</span>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-accent rounded-md">
                  <div className="h-2 w-2 rounded-full bg-maverick-600 mt-1"></div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">Contact details updated</p>
                    <p className="text-xs text-muted-foreground">3 new contacts added to the system</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">5 hours ago</span>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-accent rounded-md">
                  <div className="h-2 w-2 rounded-full bg-maverick-600 mt-1"></div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">User feedback received</p>
                    <p className="text-xs text-muted-foreground">4.8/5 rating for yesterday's ride</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
