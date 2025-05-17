
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Menu, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // Dummy notifications for demo
  const notifications = [
    { id: 1, text: "Your cab will arrive in 5 minutes", read: false },
    { id: 2, text: "Booking #1234 has been confirmed", read: false },
    { id: 3, text: "Your receipt is ready for booking #1234", read: true },
  ];

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

        <div className="flex items-center space-x-2">
          {/* Dashboard Link */}
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" aria-label="Dashboard">
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-medium">Notifications</span>
                <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
              </div>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className={`px-4 py-3 cursor-default ${notification.read ? 'opacity-60' : ''}`}>
                    <div>
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">Just now</p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
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
              to="/dashboard" 
              className="px-4 py-3 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
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
