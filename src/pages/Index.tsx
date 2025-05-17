
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ServiceAreas } from '@/components/home/ServiceAreas';
import { BookingForm } from '@/components/forms/BookingForm';

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* Booking Form Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background z-0" />
          <div className="container px-4 mx-auto md:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Book Your Ride Now</h2>
                <p className="text-lg text-muted-foreground">
                  Need a ride? Fill out the form to request a corporate cab for your next trip.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-maverick-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-maverick-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Instant booking confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-maverick-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-maverick-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Door-to-door pickup service</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-maverick-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-maverick-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Real-time tracking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-maverick-100 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-maverick-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Corporate billing options</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <BookingForm />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Service Areas Section */}
        <ServiceAreas />

        {/* Testimonials/Stats Section */}
        <section className="py-16 bg-maverick-800 text-white">
          <div className="container px-4 mx-auto md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Companies</h2>
              <p className="text-maverick-200">
                Join hundreds of companies that trust Maverick for their corporate transportation needs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-maverick-300">200+</span>
                <span className="mt-2 text-sm text-maverick-200">Companies</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-maverick-300">5000+</span>
                <span className="mt-2 text-sm text-maverick-200">Employees Served</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-maverick-300">50k+</span>
                <span className="mt-2 text-sm text-maverick-200">Rides Completed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-maverick-300">98%</span>
                <span className="mt-2 text-sm text-maverick-200">Satisfaction Rate</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <div className="h-8 flex items-center">
                <span className="text-xl font-bold">ACME Corp</span>
              </div>
              <div className="h-8 flex items-center">
                <span className="text-xl font-bold">TechGiant</span>
              </div>
              <div className="h-8 flex items-center">
                <span className="text-xl font-bold">Innovatech</span>
              </div>
              <div className="h-8 flex items-center">
                <span className="text-xl font-bold">GlobalFirm</span>
              </div>
              <div className="h-8 flex items-center">
                <span className="text-xl font-bold">MegaSystems</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
