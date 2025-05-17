
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">Maverick</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/service-areas" className="text-sm font-medium hover:text-primary transition-colors">
              Service Areas
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About Us
            </Link>
          </nav>
        )}

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="/book-cab">
            <Button>Book a Cab</Button>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in">
          <nav className="container flex flex-col px-4 py-4">
            <Link 
              to="/" 
              className="px-4 py-3 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/service-areas" 
              className="px-4 py-3 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Service Areas
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-3 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-3 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
