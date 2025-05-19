
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';

type ProfileData = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

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

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loadingRides, setLoadingRides] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // If the profile doesn't exist, create one
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                full_name: '',
                phone: '',
                avatar_url: ''
              })
              .select()
              .single();
              
            if (!createError && newProfile) {
              setProfile(newProfile);
              setFullName(newProfile.full_name || '');
              setPhone(newProfile.phone || '');
              setAvatarUrl(newProfile.avatar_url || '');
            } else {
              console.error('Error creating profile:', createError);
            }
          }
        } else {
          setProfile(data);
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      if (!event.target.files || event.target.files.length === 0 || !user) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/avatar.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      if (publicUrlData) {
        const avatarUrl = publicUrlData.publicUrl;
        setAvatarUrl(avatarUrl);
        
        // Update the profile with the new avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', user.id);
          
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Avatar updated",
          description: "Your avatar has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Avatar upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Fetch user's rides
  const fetchRides = async () => {
    if (!user) return;
    
    setLoadingRides(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.id)
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
      setLoadingRides(false);
    }
  };

  // Load rides when the rides tab is selected
  const handleTabChange = (value: string) => {
    if (value === 'rides' && rides.length === 0) {
      fetchRides();
    }
  };

  // Format ride status for display
  const formatRideStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  // Get badge variant based on ride status
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
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full md:w-[600px] grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="rides">My Rides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile picture</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-6">
                      <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName || 'user'}`} />
                      <AvatarFallback>{fullName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="grid w-full max-w-sm gap-2">
                      <Label htmlFor="avatar" className="cursor-pointer text-center py-2 px-4 border border-dashed rounded-md flex flex-col items-center justify-center">
                        <Upload className="h-4 w-4 mb-2" />
                        {uploadingAvatar ? 'Uploading...' : 'Upload new picture'}
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={uploadAvatar}
                          disabled={uploadingAvatar}
                        />
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={updateProfile} 
                      disabled={updating}
                      className="ml-auto"
                    >
                      {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Account created</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="destructive">Delete Account</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="rides">
              <Card>
                <CardHeader>
                  <CardTitle>My Ride History</CardTitle>
                  <CardDescription>View all your booked rides</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRides ? (
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
