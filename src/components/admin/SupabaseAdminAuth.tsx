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
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        // Only synchronous state updates here to prevent deadlocks
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User session detected, checking admin role...');
          // Defer admin role check to prevent blocking auth flow
          setTimeout(() => {
            checkAdminRole(session.user.id, session.user.email || '').then(adminStatus => {
              console.log('🔐 Admin status result:', adminStatus);
              setIsAdmin(adminStatus);
            });
          }, 0);
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
    console.log('🔐 Starting simplified admin login process:', { email });
    
    try {
      // Use Supabase Auth directly with the standardized password
      const { data: authData, error: authError } = await adminClient.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Supabase auth response:', { 
        user: authData.user?.email,
        error: authError?.message 
      });

      if (authError) {
        console.error('❌ Supabase auth login error:', authError);
        
        // Handle specific error cases
        if (authError.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Invalid email or password. Please check your credentials and try again.'
          };
        } else if (authError.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'Please confirm your email address before logging in.'
          };
        } else if (authError.message.includes('too_many_requests')) {
          return { 
            success: false, 
            error: 'Too many login attempts. Please wait a few minutes and try again.'
          };
        }
        
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        console.error('❌ No user returned from Supabase auth');
        return { success: false, error: 'Login failed - no user data returned' };
      }

      console.log('✅ Supabase auth login successful');
      
      // Log the admin login to our audit table
      try {
        const { error: auditError } = await adminClient
          .from('admin_audit')
          .insert({
            action: 'admin_login',
            admin_id: authData.user.id,
            user_agent: navigator.userAgent
          });
        
        if (auditError) {
          console.warn('⚠️ Failed to log admin login:', auditError.message);
        }
      } catch (auditError) {
        console.warn('⚠️ Failed to log admin login:', auditError);
      }

      return { success: true };
    } catch (error: any) {
      console.error('💥 Login exception:', error);
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