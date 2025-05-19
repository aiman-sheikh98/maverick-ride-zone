
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileAvatarProps {
  avatarUrl: string;
  fullName: string;
  userId: string;
  onAvatarChange: (url: string) => void;
}

export const ProfileAvatar = ({ avatarUrl, fullName, userId, onAvatarChange }: ProfileAvatarProps) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      if (!event.target.files || event.target.files.length === 0 || !userId) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}/avatar.${fileExt}`;
      
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
        onAvatarChange(avatarUrl);
        
        // Update the profile with the new avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', userId);
          
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

  return (
    <div className="flex flex-col items-center">
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
    </div>
  );
};
