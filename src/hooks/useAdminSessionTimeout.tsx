import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseAdminSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  isAdminPage?: boolean;
}

export const useAdminSessionTimeout = (options: UseAdminSessionTimeoutOptions = {}) => {
  const {
    timeoutMinutes = 15,
    warningMinutes = 2,
    isAdminPage = true
  } = options;

  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const handleLogout = useCallback(async () => {
    try {
      console.log('🔒 Admin session timeout: Logging out due to inactivity');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear cached data
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to Google
      window.location.href = 'https://www.google.com/';
      
      toast.error('Session expired due to inactivity');
    } catch (error) {
      console.error('🔒 Admin session timeout: Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = 'https://www.google.com/';
    }
  }, []);

  const showWarning = useCallback(() => {
    toast.warning(`Session will expire in ${warningMinutes} minutes due to inactivity`, {
      duration: 10000,
      action: {
        label: 'Stay Active',
        onClick: () => {
          resetTimer();
          toast.success('Session extended');
        }
      }
    });
  }, [warningMinutes]);

  const resetTimer = useCallback(() => {
    if (!isAdminPage) return;

    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set warning timer
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;
    warningRef.current = setTimeout(showWarning, warningMs);

    // Set logout timer
    const timeoutMs = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(handleLogout, timeoutMs);

    console.log(`🔒 Admin session timeout: Timer reset for ${timeoutMinutes} minutes`);
  }, [isAdminPage, timeoutMinutes, warningMinutes, handleLogout, showWarning]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!isAdminPage) return;

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners for activity detection
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [isAdminPage, handleActivity, resetTimer]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current
  };
};