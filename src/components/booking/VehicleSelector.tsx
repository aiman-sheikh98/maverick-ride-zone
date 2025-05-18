
import React from 'react';
import { Car, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface Vehicle {
  id: string;
  name: string;
  image: string;
  capacity: string;
  type: string;
  icon: React.ReactNode;
}

export const VEHICLES: Vehicle[] = [
  {
    id: "sedan",
    name: "Sedan",
    image: "/vehicles/sedan.jpg",
    capacity: "4",
    type: "sedan",
    icon: <Car className="h-6 w-6" />
  },
  {
    id: "suv",
    name: "SUV",
    image: "/vehicles/suv.jpg",
    capacity: "6",
    type: "suv",
    icon: <Car className="h-6 w-6" />
  },
  {
    id: "luxury",
    name: "Luxury",
    image: "/vehicles/luxury.jpg",
    capacity: "4",
    type: "luxury",
    icon: <Car className="h-6 w-6" />
  },
  {
    id: "van",
    name: "Van",
    image: "/vehicles/van.jpg",
    capacity: "8",
    type: "van",
    icon: <Truck className="h-6 w-6" />
  }
];

interface VehicleSelectorProps {
  selectedVehicleType: string;
  onVehicleSelect: (vehicleType: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ 
  selectedVehicleType, 
  onVehicleSelect 
}) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {VEHICLES.map((vehicle) => (
          <CarouselItem key={vehicle.id} className="basis-full sm:basis-1/2 md:basis-1/2">
            <div 
              className={cn(
                "p-2 h-full flex flex-col items-center cursor-pointer",
                selectedVehicleType === vehicle.id ? "bg-accent rounded-md" : ""
              )}
              onClick={() => onVehicleSelect(vehicle.id)}
            >
              <div className="relative h-32 w-full overflow-hidden rounded-md mb-2">
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  {vehicle.icon}
                </div>
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.previousElementSibling?.classList.remove('hidden');
                  }}
                />
              </div>
              <div className="text-center">
                <p className="font-medium">{vehicle.name}</p>
                <p className="text-xs text-muted-foreground">Seats {vehicle.capacity}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
};
