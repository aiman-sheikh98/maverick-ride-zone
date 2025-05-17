
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Menu, 
  Moon, 
  Sun, 
  LayoutDashboard, 
  User,
  LogOut 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

export const Header = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, [user]);

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
          {user && <NotificationDropdown />}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || user.email}`} 
                      alt="Avatar" 
                    />
                    <AvatarFallback>
                      {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-default">
                  <div>
                    <p className="font-medium">{profile?.full_name || user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/book-cab">
                <Button>Book a Cab</Button>
              </Link>
            </>
          )}
          
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
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="px-4 py-3 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  className="text-left px-4 py-3 hover:bg-accent rounded-md transition-colors"
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-3 hover:bg-accent rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
