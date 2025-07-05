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

  // Periodic session validation
  useEffect(() => {
    if (!isLegacyAuthenticated) return;

    const validateSession = () => {
      try {
        const authTimestamp = sessionStorage.getItem('adminAuthTimestamp');
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        if (authTimestamp) {
          const timeSinceAuth = Date.now() - parseInt(authTimestamp);
          
          if (timeSinceAuth >= sessionTimeout) {
            console.log('DualAdminAuth: Session expired during use, logging out');
            sessionStorage.removeItem('isAdminAuthenticated');
            sessionStorage.removeItem('adminAuthTimestamp');
            setIsLegacyAuthenticated(false);
            if (!isSupabaseAuthenticated) {
              setIsAdmin(false);
            }
          }
        }
      } catch (error) {
        console.error("Session validation error:", error);
      }
    };

    const interval = setInterval(validateSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isLegacyAuthenticated, isSupabaseAuthenticated]);

  useEffect(() => {
    console.log('DualAdminAuth: Starting initialization');
    setIsLoading(true);
    
    // Check legacy auth with expiration validation
    try {
      const storedAuth = sessionStorage.getItem('isAdminAuthenticated');
      const authTimestamp = sessionStorage.getItem('adminAuthTimestamp');
      const currentTime = Date.now();
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
      
      if (storedAuth === 'true' && authTimestamp) {
        const timeSinceAuth = currentTime - parseInt(authTimestamp);
        
        if (timeSinceAuth < sessionTimeout) {
          console.log('DualAdminAuth: Valid legacy auth found');
          setIsLegacyAuthenticated(true);
          setIsAdmin(true);
          setIsLoading(false);
        } else {
          console.log('DualAdminAuth: Legacy auth expired, clearing session');
          sessionStorage.removeItem('isAdminAuthenticated');
          sessionStorage.removeItem('adminAuthTimestamp');
        }
      } else if (storedAuth === 'true') {
        // If there's no timestamp, it's an old session - clear it
        console.log('DualAdminAuth: Legacy auth without timestamp, clearing session');
        sessionStorage.removeItem('isAdminAuthenticated');
      }
    } catch (error) {
      console.error("Could not access session storage", error);
    }

    // Always set up Supabase auth listener (even with legacy auth for dual system)
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
          console.log('DualAdminAuth: User found, checking admin status');
          setIsSupabaseAuthenticated(true);
          
          // Check admin status safely with timeout
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (!error && profile?.role === 'admin') {
                setIsAdmin(true);
                console.log('DualAdminAuth: User confirmed as admin');
              } else {
                console.log('DualAdminAuth: User not admin or error:', error);
                // Keep them authenticated but not admin
              }
            } catch (err) {
              console.log('DualAdminAuth: Admin check failed, keeping basic auth');
            }
          }, 100); // Small delay to avoid blocking
        } else {
          console.log('DualAdminAuth: No user session');
          setIsSupabaseAuthenticated(false);
          if (!isLegacyAuthenticated) {
            setIsAdmin(false);
          }
        }
        
        if (!isLegacyAuthenticated) {
          setIsLoading(false);
        }
      }
    );

    // Check for existing session with timeout (only if no legacy auth)
    if (!sessionStorage.getItem('isAdminAuthenticated')) {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
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
          
          // Check admin status safely with timeout
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (!error && profile?.role === 'admin') {
                setIsAdmin(true);
                console.log('DualAdminAuth: Initial user confirmed as admin');
              } else {
                console.log('DualAdminAuth: Initial user not admin or error:', error);
              }
            } catch (err) {
              console.log('DualAdminAuth: Initial admin check failed');
            }
          }, 100);
        } else {
          setIsSupabaseAuthenticated(false);
        }
        
        setIsLoading(false);
      }).catch((error) => {
        console.error('DualAdminAuth: Session check exception:', error);
        clearTimeout(authTimeout);
        setIsLoading(false);
      });
    }

    return () => {
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, [isLegacyAuthenticated]);

  // Legacy login - now uses secure database authentication
  const legacyLogin = async (email: string, password: string) => {
    try {
      // Use secure database authentication
      const { data, error } = await supabase.rpc('admin_login', {
        email_input: email.toLowerCase().trim(),
        password_input: password,
        device_info: navigator.userAgent
      });

      if (error) {
        console.error('Admin login error:', error);
        return { success: false, error: 'Authentication service error' };
      }

      const result = data as { success: boolean; error?: string; admin_id?: string; email?: string; role?: string };
      
      if (result.success) {
        try {
          // Store secure session data
          const sessionData = {
            isAuthenticated: true,
            adminId: result.admin_id,
            email: result.email,
            role: result.role,
            loginTime: new Date().toISOString(),
            deviceFingerprint: btoa(navigator.userAgent)
          };
          
          const currentTime = Date.now().toString();
          sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          sessionStorage.setItem('adminAuthTimestamp', currentTime);
          setIsLegacyAuthenticated(true);
          setIsAdmin(true);
          return { success: true };
        } catch (storageError) {
          console.error("Could not access session storage", storageError);
          return { success: false, error: 'Could not create secure session.' };
        }
      } else {
        return { success: false, error: result.error || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Unexpected admin login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  // Legacy logout
  const legacyLogout = async () => {
    try {
      sessionStorage.removeItem('isAdminAuthenticated');
      sessionStorage.removeItem('adminAuthTimestamp');
      sessionStorage.removeItem('adminSession'); // Clear secure session data
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