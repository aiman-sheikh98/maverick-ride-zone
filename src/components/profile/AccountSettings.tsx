
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AccountSettingsProps {
  createdAt?: string;
}

export const AccountSettings = ({ createdAt }: AccountSettingsProps) => {
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>Account created</Label>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Change Password</Button>
        <Button variant="destructive">Delete Account</Button>
      </CardFooter>
    </Card>
  );
};
