
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Car, Clock, MapPin } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden hero-gradient">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-maverick-400/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-maverick-300/10 rounded-full filter blur-3xl" />
      </div>
      
      <div className="container relative z-10 px-4 pt-32 pb-20 mx-auto md:px-8 md:pt-40 md:pb-28 flex flex-col lg:flex-row items-center">
        {/* Hero Content */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Corporate <span className="gradient-text">Cab Booking</span> Made Simple
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
            Book reliable corporate transportation for your employees with just a few clicks.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Link to="/book-cab">
              <Button size="lg" className="text-base">
                Book a Cab
              </Button>
            </Link>
            <Link to="/service-areas">
              <Button size="lg" variant="outline" className="text-base">
                Service Areas
              </Button>
            </Link>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 pt-8">
            <div className="flex flex-col items-center lg:items-start space-y-2 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
              <div className="p-2 bg-maverick-100 rounded-full">
                <Car className="w-5 h-5 text-maverick-600" />
              </div>
              <h3 className="font-medium">Premium Fleet</h3>
              <p className="text-sm text-muted-foreground">Modern vehicles for your comfort</p>
            </div>
            <div className="flex flex-col items-center lg:items-start space-y-2 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
              <div className="p-2 bg-maverick-100 rounded-full">
                <Clock className="w-5 h-5 text-maverick-600" />
              </div>
              <h3 className="font-medium">Punctual Service</h3>
              <p className="text-sm text-muted-foreground">Always on time, every time</p>
            </div>
            <div className="flex flex-col items-center lg:items-start space-y-2 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
              <div className="p-2 bg-maverick-100 rounded-full">
                <MapPin className="w-5 h-5 text-maverick-600" />
              </div>
              <h3 className="font-medium">Wide Coverage</h3>
              <p className="text-sm text-muted-foreground">Service across key business districts</p>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-maverick-400/30 rounded-full filter blur-3xl animate-pulse-subtle" />
            <div className="relative z-10 bg-gradient-to-br from-maverick-50 to-maverick-100 p-1 rounded-xl border border-maverick-200 shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop"
                alt="Corporate cab service"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
