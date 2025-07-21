
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isRecovering: boolean;
  lastActiveTab: string | null;
  isNewTab: boolean;
}

export const useEnhancedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
    isRecovering: false,
    lastActiveTab: null,
    isNewTab: false
  });

  const tabId = useRef<string>(Math.random().toString(36));
  const recoveryAttempts = useRef<number>(0);
  const maxRecoveryAttempts = 3;
  const newTabTimeout = useRef<NodeJS.Timeout | null>(null);

  // Enhanced cross-tab session synchronization
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
              isLoading: false,
              isRecovering: false
            }));
          }
        } catch (error) {
          console.error('🚨 Error parsing session sync data:', error);
        }
      }
    };

    // Listen for session sync events
    window.addEventListener('storage', handleStorageChange);
    
    // Check for existing session sync data on initialization
    const checkExistingSync = () => {
      try {
        const existingSync = localStorage.getItem('supabase-session-sync');
        if (existingSync) {
          const syncData = JSON.parse(existingSync);
          const timeDiff = Date.now() - syncData.timestamp;
          
          // If sync data is less than 30 seconds old and from another tab
          if (timeDiff < 30000 && syncData.tabId !== tabId.current && syncData.session) {
            console.log('🔄 Found recent session sync data, applying...');
            setAuthState(prev => ({
              ...prev,
              session: syncData.session,
              user: syncData.session?.user || null,
              lastActiveTab: syncData.tabId,
              isLoading: false,
              isNewTab: true
            }));
            return true;
          }
        }
      } catch (error) {
        console.error('🚨 Error checking existing sync:', error);
      }
      return false;
    };

    // For new tabs, try to get session from sync first
    if (window.opener || document.referrer) {
      console.log('🎯 New tab detected, checking for session sync...');
      const foundSync = checkExistingSync();
      
      if (!foundSync) {
        // If no sync found, mark as new tab and set a timeout
        setAuthState(prev => ({ ...prev, isNewTab: true }));
        
        newTabTimeout.current = setTimeout(() => {
          console.log('🎯 New tab timeout reached, proceeding with normal auth check');
          setAuthState(prev => ({ ...prev, isNewTab: false }));
        }, 3000); // Wait 3 seconds for potential sync
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (newTabTimeout.current) {
        clearTimeout(newTabTimeout.current);
      }
    };
  }, []);

  // Proactive session sync to other tabs
  const syncSessionToOtherTabs = (session: Session | null) => {
    try {
      const syncData = {
        session,
        tabId: tabId.current,
        timestamp: Date.now()
      };
      localStorage.setItem('supabase-session-sync', JSON.stringify(syncData));
      console.log('🔄 Session synced to other tabs');
      
      // Also trigger a storage event manually for same-origin tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'supabase-session-sync',
        newValue: JSON.stringify(syncData),
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('🚨 Error syncing session to other tabs:', error);
    }
  };

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

        syncSessionToOtherTabs(sessionData.session);
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

  // Enhanced auth state management
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      console.log('🔐 Enhanced auth initialization starting...');
      
      // If this is a new tab and we're still waiting for sync, don't proceed yet
      if (authState.isNewTab && newTabTimeout.current) {
        console.log('🎯 New tab waiting for session sync...');
        return;
      }
      
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

    // Initialize auth, but respect new tab timing
    if (!authState.isNewTab || !newTabTimeout.current) {
      initializeAuth();
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [authState.isNewTab]);

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
    isNewTab: authState.isNewTab,
    signOut,
    forceRefresh,
    recoverSession
  };
};
