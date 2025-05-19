
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
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
            } else {
              console.error('Error creating profile:', createError);
            }
          }
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Any tab change logic can go here if needed in the future
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
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
