
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { BookingForm } from '@/components/forms/BookingForm';

const BookCab = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] py-16 hero-gradient">
        <div className="container px-4 mx-auto md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Book a Cab</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to book a corporate cab for your next business trip.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <BookingForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookCab;
