import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupabaseAdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const SupabaseAdminAuthContext = createContext<SupabaseAdminAuthContextType | undefined>(undefined);

export const useSupabaseAdminAuth = () => {
  const context = useContext(SupabaseAdminAuthContext);
  if (!context) {
    throw new Error('useSupabaseAdminAuth must be used within a SupabaseAdminAuthProvider');
  }
  return context;
};

interface SupabaseAdminAuthProviderProps {
  children: ReactNode;
}

export const SupabaseAdminAuthProvider = ({ children }: SupabaseAdminAuthProviderProps) => {
  console.log('SupabaseAdminAuthProvider: Component rendering');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log('SupabaseAdminAuthProvider: State initialized', { isLoading, isAdmin, hasUser: !!user });

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('SupabaseAdminAuth: Checking admin status for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('SupabaseAdminAuth: Admin check error:', error);
        setIsAdmin(false);
        return false;
      }
      
      const isAdminUser = profile?.role === 'admin';
      setIsAdmin(isAdminUser);
      
      if (isAdminUser) {
        console.log('SupabaseAdminAuth: User confirmed as admin');
      } else {
        console.log('SupabaseAdminAuth: User not admin, role:', profile?.role);
        if (profile && profile.role !== 'admin') {
          toast.error("Access denied: Admin privileges required");
        }
      }
      
      return isAdminUser;
    } catch (err) {
      console.error('SupabaseAdminAuth: Admin check failed:', err);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    console.log('SupabaseAdminAuth: Starting initialization');
    let mounted = true;
    
    // Set up auth state listener FIRST (non-async to prevent deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('SupabaseAdminAuth: Auth state change', { event, hasSession: !!session, mounted });
        
        if (!mounted) return;
        
        // Synchronous state updates only
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer async admin check to prevent deadlocks
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              checkAdminStatus(session.user.id).finally(() => {
                if (mounted) setIsLoading(false);
              });
            }
          }, 0);
        } else {
          setIsAdmin(false);
          if (mounted) setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('SupabaseAdminAuth: Initial session check', { hasSession: !!session, error, mounted });
        
        if (!mounted) return;
        
        if (error) {
          console.error('SupabaseAdminAuth: Initial session error:', error);
          setIsLoading(false);
          return;
        }
        
        // Only update state if we don't have a session yet (avoid race conditions)
        if (!session) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
        // If we have a session, let the auth state change handler deal with it
      } catch (error) {
        console.error('SupabaseAdminAuth: Session check exception:', error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('SupabaseAdminAuth: Starting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error('SupabaseAdminAuth: Login error:', error.message);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials.' };
        } if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please check your email and confirm your account before logging in.' };
        } else if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Too many login attempts. Please wait a few minutes and try again.' };
        }
        
        return { success: false, error: error.message };
      }

      console.log('SupabaseAdminAuth: Login successful, waiting for admin verification...');
      return { success: true };
    } catch (error: any) {
      console.error('SupabaseAdminAuth: Login exception:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('SupabaseAdminAuth: Starting signup for:', email);
      const redirectUrl = `${window.location.origin}/buddys_admin/stories`;
      
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('SupabaseAdminAuth: Signup error:', error.message);
        
        // Provide more specific error messages
        if (error.message.includes('User already registered')) {
          return { success: false, error: 'An account with this email already exists. Try logging in instead.' };
        } else if (error.message.includes('Password should be at least')) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        } else if (error.message.includes('Unable to validate email address')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
        
        return { success: false, error: error.message };
      }

      console.log('SupabaseAdminAuth: Signup successful');
      return { success: true };
    } catch (error: any) {
      console.error('SupabaseAdminAuth: Signup exception:', error);
      return { success: false, error: 'Account creation failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isAuthenticated = !!session && isAdmin;

  const value = {
    user,
    session,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    signUp,
    logout
  };

  return (
    <SupabaseAdminAuthContext.Provider value={value}>
      {children}
    </SupabaseAdminAuthContext.Provider>
  );
};