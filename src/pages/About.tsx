
import React from 'react';
import { Layout } from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] py-16 hero-gradient">
        <div className="container px-4 mx-auto md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About Maverick</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your trusted corporate transportation partner
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="mb-4">
                At Maverick, our mission is to provide safe, reliable, and efficient transportation 
                solutions for businesses and organizations of all sizes. We understand the importance 
                of punctuality and comfort in corporate travel.
              </p>
              <p className="mb-4">
                Founded in 2020, we've grown from a small fleet of 5 vehicles to over 100 cars 
                serving major corporate clients across the country. Our dedication to excellence 
                and customer satisfaction has made us the preferred choice for corporate transportation.
              </p>
              <h2 className="text-2xl font-bold mb-4 mt-8">Our Values</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Safety First - All our drivers undergo rigorous training and background checks</li>
                <li>Punctuality - We understand time is valuable for business professionals</li>
                <li>Comfort - Premium vehicles maintained to the highest standards</li>
                <li>Sustainability - Transitioning our fleet to hybrid and electric vehicles</li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/about-1.jpg" 
                  alt="Maverick Fleet"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-2">Why Choose Maverick?</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">100+</span>
                    </div>
                    <p className="text-sm">Premium Vehicles</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">50+</span>
                    </div>
                    <p className="text-sm">Corporate Clients</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">98%</span>
                    </div>
                    <p className="text-sm">On-time Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">24/7</span>
                    </div>
                    <p className="text-sm">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
