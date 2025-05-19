
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PersonalInfoFormProps {
  fullName: string;
  phone: string;
  email: string | undefined;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  isUpdating: boolean;
}

export const PersonalInfoForm = ({
  fullName,
  phone,
  email,
  onFullNameChange,
  onPhoneChange,
  onSubmit,
  isUpdating
}: PersonalInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email || ''}
          disabled
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          onClick={onSubmit} 
          disabled={isUpdating}
        >
          {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </div>
  );
};
