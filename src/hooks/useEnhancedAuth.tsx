
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isRecovering: boolean;
  lastActiveTab: string | null;
}

export const useEnhancedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
    isRecovering: false,
    lastActiveTab: null
  });

  const tabId = useRef<string>(Math.random().toString(36));
  const recoveryAttempts = useRef<number>(0);
  const maxRecoveryAttempts = 3;

  // Cross-tab session synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'supabase-session-sync') {
        console.log('🔄 Session sync event detected from another tab');
        
        try {
          const syncData = JSON.parse(event.newValue || '{}');
          if (syncData.tabId !== tabId.current) {
            console.log('🔄 Syncing session from tab:', syncData.tabId);
            setAuthState(prev => ({
              ...prev,
              session: syncData.session,
              user: syncData.session?.user || null,
              lastActiveTab: syncData.tabId,
              isLoading: false
            }));
          }
        } catch (error) {
          console.error('🚨 Error parsing session sync data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced session recovery with retry logic
  const recoverSession = async (): Promise<boolean> => {
    if (recoveryAttempts.current >= maxRecoveryAttempts) {
      console.log('🚨 Max recovery attempts reached');
      return false;
    }

    recoveryAttempts.current++;
    console.log(`🔄 Session recovery attempt ${recoveryAttempts.current}/${maxRecoveryAttempts}`);

    setAuthState(prev => ({ ...prev, isRecovering: true }));

    try {
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('🚨 Session refresh failed:', error);
        
        // If refresh fails, try getting the session again
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error('🚨 Session recovery failed:', sessionError);
          setAuthState(prev => ({ ...prev, isRecovering: false }));
          return false;
        }

        setAuthState(prev => ({
          ...prev,
          session: sessionData.session,
          user: sessionData.session.user,
          isRecovering: false,
          isLoading: false
        }));

        return true;
      }

      if (data.session) {
        console.log('✅ Session recovered successfully');
        setAuthState(prev => ({
          ...prev,
          session: data.session,
          user: data.session.user,
          isRecovering: false,
          isLoading: false
        }));

        // Sync to other tabs
        syncSessionToOtherTabs(data.session);
        return true;
      }

      setAuthState(prev => ({ ...prev, isRecovering: false }));
      return false;
    } catch (error) {
      console.error('🚨 Session recovery error:', error);
      setAuthState(prev => ({ ...prev, isRecovering: false }));
      return false;
    }
  };

  // Sync session to other tabs
  const syncSessionToOtherTabs = (session: Session | null) => {
    try {
      const syncData = {
        session,
        tabId: tabId.current,
        timestamp: Date.now()
      };
      localStorage.setItem('supabase-session-sync', JSON.stringify(syncData));
      console.log('🔄 Session synced to other tabs');
    } catch (error) {
      console.error('🚨 Error syncing session to other tabs:', error);
    }
  };

  // Enhanced auth state management
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      console.log('🔐 Enhanced auth initialization starting...');
      
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🚨 Error getting session:', error);
          
          // Attempt session recovery if no session found
          if (error.message.includes('refresh_token_not_found') || 
              error.message.includes('Invalid Refresh Token')) {
            console.log('🔄 Attempting session recovery...');
            const recovered = await recoverSession();
            
            if (!recovered && isMounted) {
              setAuthState(prev => ({
                ...prev,
                session: null,
                user: null,
                isLoading: false,
                isRecovering: false
              }));
            }
          } else {
            if (isMounted) {
              setAuthState(prev => ({
                ...prev,
                session: null,
                user: null,
                isLoading: false,
                isRecovering: false
              }));
            }
          }
          return;
        }

        if (isMounted) {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session?.user || null,
            isLoading: false,
            isRecovering: false
          }));

          // Sync to other tabs if we have a session
          if (session) {
            syncSessionToOtherTabs(session);
          }
        }

        // Reset recovery attempts on successful session
        if (session) {
          recoveryAttempts.current = 0;
        }

      } catch (err) {
        console.error('🚨 Auth initialization error:', err);
        if (isMounted) {
          setAuthState(prev => ({
            ...prev,
            session: null,
            user: null,
            isLoading: false,
            isRecovering: false
          }));
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Enhanced auth state change:', event, session?.user?.id);
        
        if (!isMounted) return;

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('✅ User signed in');
            recoveryAttempts.current = 0;
            break;
          case 'SIGNED_OUT':
            console.log('👋 User signed out');
            recoveryAttempts.current = 0;
            break;
          case 'TOKEN_REFRESHED':
            console.log('🔄 Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('👤 User updated');
            break;
        }

        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          isLoading: false,
          isRecovering: false
        }));

        // Sync to other tabs
        syncSessionToOtherTabs(session);
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Provide auth actions
  const signOut = async () => {
    console.log('👋 Signing out...');
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🚨 Sign out error:', error);
      }
      
      // Clear cross-tab sync
      localStorage.removeItem('supabase-session-sync');
      
    } catch (err) {
      console.error('🚨 Sign out error:', err);
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 Force refreshing session...');
    await recoverSession();
  };

  return {
    session: authState.session,
    user: authState.user,
    isLoading: authState.isLoading,
    isRecovering: authState.isRecovering,
    lastActiveTab: authState.lastActiveTab,
    signOut,
    forceRefresh,
    recoverSession
  };
};
