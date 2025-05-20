
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// This would be replaced with a real API call in a production app
const serviceAreas = [
  {
    id: 1,
    name: 'Downtown Business District',
    description: 'Covering all major office buildings and corporate headquarters in the central business district.',
    availability: '24/7',
    landmarks: ['Central Plaza', 'Financial Tower', 'Commerce Center', 'City Hall'],
    image: 'https://images.unsplash.com/photo-1582152472601-3ae99bf72545?auto=format&fit=crop&q=80', // Downtown skyline
    details: 'Our Downtown Business District service covers the bustling center of the city, providing reliable transportation for corporate executives, employees, and visitors. With 24/7 availability, we ensure you never have to wait for a cab, even during late-night meetings or early morning conferences.'
  },
  {
    id: 2,
    name: 'Tech Park Zone',
    description: 'Service to all technology parks and innovation centers in the eastern corridor.',
    availability: '5:00 AM - 11:00 PM',
    landmarks: ['Innovation Hub', 'Tech Campus', 'Digital Valley', 'Startup Center'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', // Modern tech campus
    details: 'The Tech Park Zone service area encompasses the rapidly growing technology sector in the eastern part of the city. Our cabs are available from early morning until late evening, catering to the flexible working hours of tech professionals. We provide seamless transportation between tech campuses, co-working spaces, and innovation hubs.'
  },
  {
    id: 3,
    name: 'Airport & Transport Hubs',
    description: 'Regular service to and from all major airports, train stations and transport terminals.',
    availability: '24/7',
    landmarks: ['International Airport', 'Central Station', 'Bus Terminal', 'Port Authority'],
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80', // Airport terminal
    details: 'Never miss a flight or connection with our dedicated Airport & Transport Hubs service. We operate around the clock, ensuring travelers and commuters have reliable transportation to and from all major transportation hubs in the city. Our drivers are familiar with all terminals and can navigate the busiest times with ease.'
  },
  {
    id: 4,
    name: 'Industrial Area',
    description: 'Covering manufacturing plants and industrial complexes in the western sector.',
    availability: '6:00 AM - 10:00 PM',
    landmarks: ['Manufacturing Park', 'Industrial Complex', 'Factory Zone', 'Distribution Center'],
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80', // Industrial facilities
    details: 'Our Industrial Area service caters to employees and business visitors to the manufacturing and distribution centers in the western part of the city. With operations starting early and running into the evening, we accommodate shift changes and business hours of industrial facilities.'
  },
  {
    id: 5,
    name: 'Suburban Office Campuses',
    description: 'Service to satellite offices and corporate campuses in surrounding suburbs.',
    availability: '7:00 AM - 9:00 PM',
    landmarks: ['North Corporate Park', 'Eastside Campus', 'South Business Center', 'West Office Park'],
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80', // Suburban office park
    details: 'Our Suburban Office Campuses service connects the peripheral business districts with the city center and residential areas. We provide reliable transportation for employees commuting to suburban corporate offices, with service times aligned to standard business hours.'
  },
  {
    id: 6,
    name: 'Hotel & Conference Centers',
    description: 'Coverage for major hotels and conference venues for business travelers.',
    availability: '24/7',
    landmarks: ['Grand Hotel', 'Convention Center', 'Business Inn', 'Executive Suites'],
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80', // Hotel and conference center
    details: 'Business travelers can rely on our Hotel & Conference Centers service for all their transportation needs. Available 24/7, we ensure attendees and organizers of conferences, seminars, and business events have dependable transportation between venues, hotels, and other points of interest.'
  }
];

const ServiceAreas = () => {
  const [selectedArea, setSelectedArea] = useState<typeof serviceAreas[0] | null>(null);

  const openAreaDetails = (area: typeof serviceAreas[0]) => {
    setSelectedArea(area);
  };

  const closeAreaDetails = () => {
    setSelectedArea(null);
  };

  return (
    <Layout>
      <div className="py-16 hero-gradient">
        <div className="container px-4 mx-auto md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Service Areas</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Maverick provides corporate cab services in the following areas. Click on an area to learn more about its coverage and landmarks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area) => (
              <Card 
                key={area.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openAreaDetails(area)}
              >
                <div className="w-full">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={area.image} 
                      alt={area.name}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
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
                  
                  <Button variant="ghost" className="flex items-center gap-1 mt-2 hover:text-maverick-600 p-0" asChild>
                    <div>
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedArea} onOpenChange={() => closeAreaDetails()}>
        {selectedArea && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedArea.name}</DialogTitle>
              <DialogDescription>
                Availability: {selectedArea.availability}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <AspectRatio ratio={16/9}>
                <img 
                  src={selectedArea.image} 
                  alt={selectedArea.name}
                  className="object-cover w-full h-full rounded-md"
                />
              </AspectRatio>
              
              <p className="text-muted-foreground">{selectedArea.details}</p>
              
              <div>
                <h3 className="font-semibold mb-2">Key Locations:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedArea.landmarks.map((landmark, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-maverick-400 rounded-full mr-2"></span>
                      {landmark}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </Layout>
  );
};

export default ServiceAreas;
