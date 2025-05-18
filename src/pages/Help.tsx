
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Help = () => {
  const { toast } = useToast();

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support request submitted",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-16">
        <div className="container px-4 mx-auto md:px-8">
          <h1 className="text-3xl font-bold mb-8">Help & Support</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find answers to commonly asked questions about our services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I book a cab?</AccordionTrigger>
                      <AccordionContent>
                        You can book a cab by going to the "Book a Cab" page from the navigation menu.
                        Fill in your pickup location, destination, date, time, and choose your preferred
                        vehicle type. Click on "Request Cab" to complete your booking.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do I cancel my ride?</AccordionTrigger>
                      <AccordionContent>
                        You can cancel your upcoming ride from your dashboard. Find the ride in the
                        list and click the "Cancel" button. Please note that cancellations may be subject
                        to our cancellation policy depending on how close to the pickup time you cancel.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How do I update my profile?</AccordionTrigger>
                      <AccordionContent>
                        Go to the "My Profile" page by clicking on your avatar in the top-right corner
                        and selecting "My Profile" from the dropdown menu. There, you can update your 
                        personal information and profile picture.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                      <AccordionContent>
                        We accept credit/debit cards, mobile wallets, and corporate accounts. Payment
                        details can be added in your profile settings.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5">
                      <AccordionTrigger>How do I contact my driver?</AccordionTrigger>
                      <AccordionContent>
                        Once your booking is confirmed and a driver is assigned, you'll be able to 
                        see the driver's contact information in your ride details on the dashboard.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need additional help? Send us a message
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What's your issue about?" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Describe your issue in detail..." 
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
