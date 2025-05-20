import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Clock, Settings } from 'lucide-react';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { RidesHistory } from '@/components/profile/RidesHistory';

type ProfileData = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Check for payment success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const rideId = urlParams.get('ride_id');
    
    if (paymentSuccess === 'true' && rideId) {
      // If there's a payment success parameter, switch to rides tab
      setActiveTab('rides');
      
      // Clear the URL parameters but keep on the same page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // First check if the profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          // Profile exists
          setProfile(data);
        } else {
          // Profile doesn't exist, create one
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: '',
              phone: '',
              avatar_url: ''
            })
            .select();
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            toast({
              title: "Profile Creation Error",
              description: "There was an error setting up your profile.",
              variant: "destructive"
            });
          } else if (newProfile && newProfile.length > 0) {
            setProfile(newProfile[0] as ProfileData);
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const updateProfile = async (fullName: string, phone: string, avatarUrl: string) => {
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
        
        // Update the profile state with new values
        setProfile(prev => {
          if (!prev) return null;
          return {
            ...prev,
            full_name: fullName,
            phone: phone,
            avatar_url: avatarUrl
          };
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] py-16 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <Loader2 className="h-12 w-12 animate-spin text-maverick-500" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] py-16 bg-gradient-to-br from-maverick-50/60 via-transparent to-transparent">
        <div className="container px-4 mx-auto md:px-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <div className="p-2 rounded-full bg-maverick-100">
              <User className="h-6 w-6 text-maverick-600" />
            </div>
            <span>My Profile</span>
          </h1>
          <p className="text-muted-foreground mb-8">Manage your personal information and account settings</p>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-white shadow-md rounded-xl mb-8 p-1">
              <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto p-1 gap-2">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-maverick-100 data-[state=active]:text-maverick-700"
                >
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="rides"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-maverick-100 data-[state=active]:text-maverick-700"
                >
                  <Clock className="h-4 w-4" />
                  My Rides
                </TabsTrigger>
                <TabsTrigger 
                  value="account"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-maverick-100 data-[state=active]:text-maverick-700"
                >
                  <Settings className="h-4 w-4" />
                  Account
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-white shadow-md rounded-xl p-6 animate-fade-in">
              <TabsContent value="profile">
                {profile && (
                  <ProfileContent 
                    profile={profile}
                    user={user}
                    onUpdateProfile={updateProfile}
                    isUpdating={updating}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="account">
                <AccountSettings createdAt={user?.created_at} />
              </TabsContent>

              <TabsContent value="rides">
                {user && <RidesHistory userId={user.id} />}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
