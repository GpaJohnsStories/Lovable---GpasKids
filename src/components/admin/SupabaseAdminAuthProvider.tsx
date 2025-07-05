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

  useEffect(() => {
    console.log('SupabaseAdminAuth: Starting initialization');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('SupabaseAdminAuth: Auth state change', { event, hasSession: !!session });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin status
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (!error && profile?.role === 'admin') {
              setIsAdmin(true);
              console.log('SupabaseAdminAuth: User confirmed as admin');
            } else {
              console.log('SupabaseAdminAuth: User not admin or error:', error);
              setIsAdmin(false);
              if (profile && profile.role !== 'admin') {
                toast.error("Access denied: Admin privileges required");
              }
            }
          } catch (err) {
            console.log('SupabaseAdminAuth: Admin check failed:', err);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('SupabaseAdminAuth: Initial session check', { hasSession: !!session, error });
      
      if (error) {
        console.error('SupabaseAdminAuth: Initial session error:', error);
        setIsLoading(false);
        return;
      }
      
      // Don't set session/user here if auth state change already handled it
      if (!session) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('SupabaseAdminAuth: Session check exception:', error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/buddys_admin`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
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