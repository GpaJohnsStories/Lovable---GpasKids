import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

interface DualAdminAuthContextType {
  // Legacy auth (current system)
  isLegacyAuthenticated: boolean;
  legacyLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  legacyLogout: () => Promise<void>;
  
  // New Supabase auth
  user: User | null;
  session: Session | null;
  isSupabaseAuthenticated: boolean;
  supabaseLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  supabaseSignUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  supabaseLogout: () => Promise<void>;
  
  // Combined auth state
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  authMode: 'legacy' | 'supabase' | 'none';
}

const DualAdminAuthContext = createContext<DualAdminAuthContextType | undefined>(undefined);

export const useDualAdminAuth = () => {
  const context = useContext(DualAdminAuthContext);
  if (!context) {
    throw new Error('useDualAdminAuth must be used within a DualAdminAuthProvider');
  }
  return context;
};

interface DualAdminAuthProviderProps {
  children: ReactNode;
}

export const DualAdminAuthProvider = ({ children }: DualAdminAuthProviderProps) => {
  // Legacy auth state
  const [isLegacyAuthenticated, setIsLegacyAuthenticated] = useState(false);
  
  // Supabase auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Check admin status
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('DualAdminAuth: Starting initialization');
    setIsLoading(true);
    
    // Check legacy auth
    try {
      const storedAuth = sessionStorage.getItem('isAdminAuthenticated');
      if (storedAuth === 'true') {
        console.log('DualAdminAuth: Legacy auth found');
        setIsLegacyAuthenticated(true);
        setIsAdmin(true);
        setIsLoading(false);
        return; // Exit early if legacy auth is found
      }
    } catch (error) {
      console.error("Could not access session storage", error);
    }

    // Set up Supabase auth listener with timeout
    const authTimeout = setTimeout(() => {
      console.error('DualAdminAuth: Auth check timed out, setting loading to false');
      setIsLoading(false);
    }, 5000); // 5 second timeout

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('DualAdminAuth: Auth state change', { event, hasSession: !!session });
        clearTimeout(authTimeout);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('DualAdminAuth: User found, setting as authenticated');
          setIsSupabaseAuthenticated(true);
          
          // For now, let's assume any authenticated user is admin
          // We can fix the admin check later
          setIsAdmin(true);
          console.log('DualAdminAuth: User set as admin (temporary)');
        } else {
          console.log('DualAdminAuth: No user session');
          setIsSupabaseAuthenticated(false);
          if (!isLegacyAuthenticated) {
            setIsAdmin(false);
          }
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session with timeout
    const sessionPromise = supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('DualAdminAuth: Initial session check', { hasSession: !!session, error });
      clearTimeout(authTimeout);
      
      if (error) {
        console.error('DualAdminAuth: Initial session error:', error);
        setIsLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('DualAdminAuth: Initial session found');
        setIsSupabaseAuthenticated(true);
        setIsAdmin(true); // Temporary - assume admin
      } else {
        setIsSupabaseAuthenticated(false);
      }
      
      setIsLoading(false);
    }).catch((error) => {
      console.error('DualAdminAuth: Session check exception:', error);
      clearTimeout(authTimeout);
      setIsLoading(false);
    });

    return () => {
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Legacy login
  const legacyLogin = async (email: string, password: string) => {
    const ADMIN_EMAIL = 'gpajohn.buddy@gmail.com';
    const ADMIN_PASSWORD = 'gpaj0hn#bUdDy1o0s6e';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsLegacyAuthenticated(true);
        setIsAdmin(true);
        return { success: true };
      } catch (error) {
        console.error("Could not access session storage", error);
        return { success: false, error: 'Could not set session.' };
      }
    }
    return { success: false, error: 'Invalid credentials' };
  };

  // Legacy logout
  const legacyLogout = async () => {
    try {
      sessionStorage.removeItem('isAdminAuthenticated');
    } catch (error) {
      console.error("Could not access session storage", error);
    }
    setIsLegacyAuthenticated(false);
    
    // Only clear admin status if Supabase auth is also not admin
    if (!isSupabaseAuthenticated) {
      setIsAdmin(false);
    }
  };

  // Supabase login
  const supabaseLogin = async (email: string, password: string) => {
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

  // Supabase signup
  const supabaseSignUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
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

  // Supabase logout
  const supabaseLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Combined auth state
  const isAuthenticated = isLegacyAuthenticated || isSupabaseAuthenticated;
  const authMode: 'legacy' | 'supabase' | 'none' = isSupabaseAuthenticated ? 'supabase' : isLegacyAuthenticated ? 'legacy' : 'none';

  const value = {
    // Legacy auth
    isLegacyAuthenticated,
    legacyLogin,
    legacyLogout,
    
    // Supabase auth
    user,
    session,
    isSupabaseAuthenticated,
    supabaseLogin,
    supabaseSignUp,
    supabaseLogout,
    
    // Combined state
    isAuthenticated,
    isAdmin,
    isLoading,
    authMode
  };

  return (
    <DualAdminAuthContext.Provider value={value}>
      {children}
    </DualAdminAuthContext.Provider>
  );
};