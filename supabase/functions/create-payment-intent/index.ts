
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@14.19.0?target=deno';

// Set up CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Handle CORS preflight requests
const handleCorsRequest = () => {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
};

// Handle actual requests
const handleRequest = async (req: Request) => {
  try {
    console.log('Payment intent request received');
    
    // Parse the request body
    const { rideDetails } = await req.json();
    console.log('Ride details received:', JSON.stringify(rideDetails));
    
    // Create a Supabase client to authenticate the user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Extract the JWT token from the request headers for authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    console.log('Authentication header found');
    
    // Get the current user from the token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('User not authenticated');
    }
    
    console.log('User authenticated:', user.id);

    // Calculate price based on ride details
    let amount = 0;

    switch (rideDetails.vehicleType.toLowerCase()) {
      case 'sedan':
        amount = 2000; // $20.00
        break;
      case 'suv':
        amount = 3000; // $30.00
        break;
      case 'luxury':
        amount = 5000; // $50.00
        break;
      case 'van':
        amount = 4000; // $40.00
        break;
      default:
        amount = 2000; // Default $20.00
    }
    
    console.log('Calculated amount:', amount);

    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }
    
    console.log('Stripe key verified');
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Create a payment intent
    console.log('Creating payment intent');
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user.id,
        ride_id: rideDetails.rideId,
        pickup_location: rideDetails.pickupLocation,
        drop_location: rideDetails.dropLocation,
        vehicle_type: rideDetails.vehicleType
      },
    });
    
    console.log('Payment intent created:', paymentIntent.id);

    // Return the client secret to the client
    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      amount
    }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      headers: corsHeaders,
      status: 500,
    });
  }
};

// Server function to handle all requests
serve(async (req) => {
  console.log('Request received:', req.method);
  
  // Handle CORS preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }
  
  // Handle actual requests (POST)
  if (req.method === 'POST') {
    return handleRequest(req);
  }
  
  // Return 405 for other methods
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    headers: corsHeaders,
    status: 405,
  });
});
