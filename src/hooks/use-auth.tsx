
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the subscription first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Check for session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      navigate('/dashboard');
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Create profile if sign up successful
      if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          phone: phone,
        });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
        
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
