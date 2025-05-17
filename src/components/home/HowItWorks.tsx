
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    title: 'Create an Account',
    description: 'Sign up with your corporate email to get started with our service.'
  },
  {
    number: '02',
    title: 'Select Pickup & Drop',
    description: 'Enter your pickup location, destination, and preferred time.'
  },
  {
    number: '03',
    title: 'Choose a Vehicle',
    description: 'Select from our range of vehicle types based on your needs.'
  },
  {
    number: '04',
    title: 'Confirm & Ride',
    description: 'Confirm your booking and enjoy your comfortable ride.'
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Booking a corporate cab is simple and seamless with our streamlined process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border border-border bg-background overflow-hidden">
              <CardContent className="p-6">
                <span className="text-4xl font-bold text-maverick-200">{step.number}</span>
                <h3 className="text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
