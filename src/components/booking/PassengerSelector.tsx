
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PassengerSelectorProps {
  passengers: string;
  onPassengersChange: (value: string) => void;
}

export const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  passengers,
  onPassengersChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="passengers">Passengers</Label>
      <Select 
        onValueChange={onPassengersChange}
        value={passengers}
      >
        <SelectTrigger id="passengers">
          <SelectValue placeholder="# of people" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 Person</SelectItem>
          <SelectItem value="2">2 People</SelectItem>
          <SelectItem value="3">3 People</SelectItem>
          <SelectItem value="4">4 People</SelectItem>
          <SelectItem value="5+">5+ People</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
