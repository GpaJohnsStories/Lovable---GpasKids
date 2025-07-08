import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { adminClient } from "@/integrations/supabase/clients";
import type { User, Session } from '@supabase/supabase-js';

interface SupabaseAdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const isAuthenticated = !!user && !!session;

  console.log('SupabaseAdminAuth: State', { 
    user: user?.email, 
    isAuthenticated, 
    isLoading, 
    isAdmin 
  });

  // Check if user has admin role
  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('Error in checkAdminRole:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = adminClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role when user is authenticated
          const adminStatus = await checkAdminRole(session.user.id);
          setIsAdmin(adminStatus);
          console.log('Admin status:', adminStatus);
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    adminClient.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id).then(adminStatus => {
          setIsAdmin(adminStatus);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting admin login process:', { email });
    
    try {
      const { data, error } = await adminClient.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Supabase auth response:', { 
        hasUser: !!data.user, 
        userId: data.user?.id,
        userEmail: data.user?.email,
        hasSession: !!data.session,
        error: error?.message 
      });

      if (error) {
        console.error('❌ Supabase auth error:', error);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        console.error('❌ No user returned from auth');
        return { success: false, error: 'Login failed - no user data' };
      }

      console.log('✅ Authentication successful, checking admin role...');
      // Admin role will be checked by the auth state change handler
      return { success: true };
    } catch (error: any) {
      console.error('💥 Login exception in auth component:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    await adminClient.auth.signOut();
  };

  const value = {
    user,
    session,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    logout
  };

  return (
    <SupabaseAdminAuthContext.Provider value={value}>
      {children}
    </SupabaseAdminAuthContext.Provider>
  );
};