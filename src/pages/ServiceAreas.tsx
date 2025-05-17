
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// This would be replaced with a real API call in a production app
const serviceAreas = [
  {
    id: 1,
    name: 'Downtown Business District',
    description: 'Covering all major office buildings and corporate headquarters in the central business district.',
    availability: '24/7',
    landmarks: ['Central Plaza', 'Financial Tower', 'Commerce Center', 'City Hall']
  },
  {
    id: 2,
    name: 'Tech Park Zone',
    description: 'Service to all technology parks and innovation centers in the eastern corridor.',
    availability: '5:00 AM - 11:00 PM',
    landmarks: ['Innovation Hub', 'Tech Campus', 'Digital Valley', 'Startup Center']
  },
  {
    id: 3,
    name: 'Airport & Transport Hubs',
    description: 'Regular service to and from all major airports, train stations and transport terminals.',
    availability: '24/7',
    landmarks: ['International Airport', 'Central Station', 'Bus Terminal', 'Port Authority']
  },
  {
    id: 4,
    name: 'Industrial Area',
    description: 'Covering manufacturing plants and industrial complexes in the western sector.',
    availability: '6:00 AM - 10:00 PM',
    landmarks: ['Manufacturing Park', 'Industrial Complex', 'Factory Zone', 'Distribution Center']
  },
  {
    id: 5,
    name: 'Suburban Office Campuses',
    description: 'Service to satellite offices and corporate campuses in surrounding suburbs.',
    availability: '7:00 AM - 9:00 PM',
    landmarks: ['North Corporate Park', 'Eastside Campus', 'South Business Center', 'West Office Park']
  },
  {
    id: 6,
    name: 'Hotel & Conference Centers',
    description: 'Coverage for major hotels and conference venues for business travelers.',
    availability: '24/7',
    landmarks: ['Grand Hotel', 'Convention Center', 'Business Inn', 'Executive Suites']
  }
];

const ServiceAreas = () => {
  return (
    <Layout>
      <div className="py-16 hero-gradient">
        <div className="container px-4 mx-auto md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Service Areas</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Maverick provides corporate cab services in the following areas. Check if your location is covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area) => (
              <Card key={area.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-maverick-100 rounded-full">
                      <MapPin className="h-5 w-5 text-maverick-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{area.name}</h2>
                      <p className="text-xs text-muted-foreground">Availability: {area.availability}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{area.description}</p>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Key Locations:</h3>
                    <ul className="text-sm space-y-1">
                      {area.landmarks.map((landmark, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-maverick-400 rounded-full mr-2"></span>
                          {landmark}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceAreas;
