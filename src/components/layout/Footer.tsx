
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-maverick-800 text-white py-12">
      <div className="container px-4 mx-auto md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold text-white">
              Maverick
            </Link>
            <p className="mt-4 text-gray-300 text-sm">
              The most reliable corporate cab booking service for your organization.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-maverick-400 transition-colors">Home</Link></li>
              <li><Link to="/book-cab" className="hover:text-maverick-400 transition-colors">Book a Cab</Link></li>
              <li><Link to="/service-areas" className="hover:text-maverick-400 transition-colors">Service Areas</Link></li>
              <li><Link to="/about" className="hover:text-maverick-400 transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/faq" className="hover:text-maverick-400 transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-maverick-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-maverick-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-maverick-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-300 text-sm space-y-2">
              <p>1234 Corporate Drive</p>
              <p>Business District, City 12345</p>
              <p className="mt-2">Email: <a href="mailto:info@maverickcabs.com" className="hover:text-maverick-400 transition-colors">info@maverickcabs.com</a></p>
              <p>Phone: <a href="tel:+1234567890" className="hover:text-maverick-400 transition-colors">+1 (234) 567-890</a></p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Maverick Cab Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
