
import React from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LocationInputsProps {
  pickupLocation: string;
  dropLocation: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LocationInputs: React.FC<LocationInputsProps> = ({
  pickupLocation,
  dropLocation,
  handleChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="pickupLocation">Pickup Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="pickupLocation"
            name="pickupLocation"
            placeholder="Enter pickup address"
            className="pl-10"
            value={pickupLocation}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dropLocation">Drop Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="dropLocation"
            name="dropLocation"
            placeholder="Enter destination address"
            className="pl-10"
            value={dropLocation}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </>
  );
};
