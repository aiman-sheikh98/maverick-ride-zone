
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const areas = [
  {
    name: 'Downtown Business District',
    description: 'Covering all major office buildings and corporate headquarters in the central business district.',
    availability: '24/7'
  },
  {
    name: 'Tech Park Zone',
    description: 'Service to all technology parks and innovation centers in the eastern corridor.',
    availability: '5:00 AM - 11:00 PM'
  },
  {
    name: 'Airport & Transport Hubs',
    description: 'Regular service to and from all major airports, train stations and transport terminals.',
    availability: '24/7'
  },
  {
    name: 'Industrial Area',
    description: 'Covering manufacturing plants and industrial complexes in the western sector.',
    availability: '6:00 AM - 10:00 PM'
  },
  {
    name: 'Suburban Office Campuses',
    description: 'Service to satellite offices and corporate campuses in surrounding suburbs.',
    availability: '7:00 AM - 9:00 PM'
  },
  {
    name: 'Hotel & Conference Centers',
    description: 'Coverage for major hotels and conference venues for business travelers.',
    availability: '24/7'
  }
];

export const ServiceAreas = () => {
  return (
    <section className="py-16 bg-accent/50">
      <div className="container px-4 mx-auto md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Service Areas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Maverick cabs are available in key business and commercial areas to ensure your employees always have reliable transportation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-maverick-100 rounded-full mt-1">
                      <MapPin className="w-4 h-4 text-maverick-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{area.name}</h3>
                      <p className="text-xs text-muted-foreground">Availability: {area.availability}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
