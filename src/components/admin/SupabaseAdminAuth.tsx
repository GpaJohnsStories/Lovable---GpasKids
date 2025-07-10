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

  // Enhanced admin role check using both auth.users and admin_users table
  const checkAdminRole = async (userId: string, userEmail: string) => {
    console.log('🔍 Checking admin role for:', { userId, userEmail });
    
    try {
      console.log('📋 Starting profile check...');
      // First check: Verify user has admin role in profiles table
      const { data: profileData, error: profileError } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      console.log('📋 Profile check result:', { profileData, profileError });

      if (profileError) {
        console.error('❌ Error checking profile admin role:', profileError);
        return false;
      }

      if (profileData?.role !== 'admin') {
        console.log('❌ User does not have admin role in profiles. Current role:', profileData?.role);
        return false;
      }

      console.log('✅ Profile admin role verified');

      console.log('🏛️ Starting admin_users check...');
      // Second check: Verify user exists in admin_users table (enhanced security)
      const { data: adminData, error: adminError } = await adminClient
        .from('admin_users')
        .select('email, role, locked_until')
        .eq('email', userEmail)
        .maybeSingle();

      console.log('🏛️ Admin users check result:', { adminData, adminError });

      if (adminError) {
        console.error('❌ Error checking admin_users table:', adminError);
        return false;
      }

      if (!adminData) {
        console.log('❌ User not found in admin_users table');
        return false;
      }

      // Check if account is locked
      if (adminData.locked_until && new Date(adminData.locked_until) > new Date()) {
        console.log('❌ Admin account is locked until:', adminData.locked_until);
        return false;
      }

      console.log('✅ User verified in both profiles and admin_users tables');
      return true;
    } catch (error) {
      console.error('💥 Exception in checkAdminRole:', error);
      console.error('💥 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = adminClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User session detected, checking admin role...');
          // Check admin role when user is authenticated
          const adminStatus = await checkAdminRole(session.user.id, session.user.email || '');
          console.log('🔐 Admin status result:', adminStatus);
          setIsAdmin(adminStatus);
        } else {
          console.log('❌ No user session, setting admin to false');
          setIsAdmin(false);
        }
        
        setIsLoading(false);
        console.log('✅ Auth state update complete');
      }
    );

    // Check for existing session
    console.log('🔍 Checking for existing session...');
    adminClient.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Existing session found, checking admin role...');
        checkAdminRole(session.user.id, session.user.email || '').then(adminStatus => {
          console.log('🔐 Initial admin status:', adminStatus);
          setIsAdmin(adminStatus);
          setIsLoading(false);
        });
      } else {
        console.log('❌ No existing session found');
        setIsLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting secure admin login process:', { email });
    
    try {
      // STEP 1: Use our custom admin_login function for secure authentication
      const { data: loginResult, error: loginError } = await adminClient
        .rpc('admin_login', {
          email_input: email,
          password_input: password,
          device_info: navigator.userAgent
        });

      console.log('🔐 Custom admin login response:', { 
        result: loginResult,
        error: loginError?.message 
      });

      if (loginError) {
        console.error('❌ Custom admin login error:', loginError);
        return { success: false, error: loginError.message };
      }

      // Type guard and validation for the response
      const result = loginResult as any;
      if (!result || result.success !== true) {
        console.error('❌ Custom admin login failed:', result?.error);
        return { success: false, error: result?.error || 'Invalid credentials' };
      }

      console.log('✅ Custom admin authentication successful');

      // STEP 2: Try Supabase Auth login for session management
      const { data: authData, error: authError } = await adminClient.auth.signInWithPassword({
        email,
        password,
      });

      // If Supabase Auth fails, we need to handle this gracefully
      if (authError) {
        console.warn('⚠️ Supabase auth login failed, but custom auth passed:', authError.message);
        
        // Check if user exists in auth but password is different
        if (authError.message.includes('Invalid login credentials')) {
          console.log('🔧 Password mismatch detected. Custom auth passed but Supabase auth failed.');
          console.log('💡 User should update their Supabase Auth password to match admin password.');
          return { 
            success: false, 
            error: 'Password synchronization required. Please contact the system administrator to update your Supabase Auth password.' 
          };
        }
        
        return { success: false, error: 'Session creation failed: ' + authError.message };
      }

      if (!authData.user) {
        console.error('❌ No user returned from Supabase auth');
        return { success: false, error: 'Session creation failed - no user data' };
      }

      console.log('✅ Complete secure admin login successful');
      return { success: true };
    } catch (error: any) {
      console.error('💥 Secure login exception:', error);
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