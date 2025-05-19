
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ProfileAvatar } from './ProfileAvatar';
import { PersonalInfoForm } from './PersonalInfoForm';

interface ProfileContentProps {
  profile: {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  user: any;
  onUpdateProfile: (fullName: string, phone: string, avatarUrl: string) => Promise<void>;
  isUpdating: boolean;
}

export const ProfileContent = ({ profile, user, onUpdateProfile, isUpdating }: ProfileContentProps) => {
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');

  const handleProfileUpdate = () => {
    onUpdateProfile(fullName, phone, avatarUrl);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ProfileAvatar 
            avatarUrl={avatarUrl} 
            fullName={fullName} 
            userId={profile.id} 
            onAvatarChange={setAvatarUrl} 
          />
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalInfoForm
            fullName={fullName}
            phone={phone}
            email={user?.email}
            onFullNameChange={setFullName}
            onPhoneChange={setPhone}
            onSubmit={handleProfileUpdate}
            isUpdating={isUpdating}
          />
        </CardContent>
      </Card>
    </div>
  );
};
