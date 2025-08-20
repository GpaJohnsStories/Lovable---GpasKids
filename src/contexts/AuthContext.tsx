
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (params: { email: string; password: string }) => Promise<{ data: any; error: any }>;
  signIn: (params: { email: string; password: string }) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (newPassword: string) => Promise<{ data: any; error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { session, user, isLoading, signOut: enhancedSignOut } = useEnhancedAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Enhanced user object that includes profile data
  const enhancedUser = user && userProfile ? { ...user, ...userProfile } : user;

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (user) {
      // Fetch user profile data asynchronously to prevent auth deadlock
      setTimeout(async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data && !error) {
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }, 0);
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await enhancedSignOut();
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Filter out any personal data fields that no longer exist
      const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
        if (!['full_name', 'avatar_url', 'display_name'].includes(key)) {
          acc[key] = updates[key];
        }
        return acc;
      }, {} as any);

      // Only update if there are valid fields to update
      if (Object.keys(filteredUpdates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(filteredUpdates)
          .eq('id', user.id);
          
        if (error) throw error;
        
        setUserProfile(prevProfile => ({
          ...prevProfile,
          ...filteredUpdates
        }));
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value: AuthContextType = {
    user: enhancedUser,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
