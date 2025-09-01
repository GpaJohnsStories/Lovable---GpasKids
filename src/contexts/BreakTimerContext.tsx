/**
 * BreakTimerContext - Global break timer system
 * 
 * Requirements:
 * 1. No timer activity on admin pages
 * 2. If they leave site, timer keeps going for 10 more minutes then shuts down
 * 3. When they return, timer starts over (assume they had a break)
 * 4. Break Guide always present on public pages, clicking doesn't affect timer state
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface BreakTimerContextType {
  minutesLeft: number;
  isBreakReminderOpen: boolean;
  openBreakReminder: () => void;
  closeBreakReminder: () => void;
  onBreakComplete: () => void;
  isTimerActive: boolean;
}

const BreakTimerContext = createContext<BreakTimerContextType | undefined>(undefined);

const BREAK_INTERVAL_MINUTES = 55;
const OFF_SITE_GRACE_PERIOD = 10 * 60 * 1000; // 10 minutes in milliseconds
const STORAGE_KEY = 'gpaskids_break_timer';
const LEADER_LOCK_KEY = 'gpaskids_break_timer_leader';
const LEADER_LOCK_TIMEOUT = 5000; // 5 seconds

interface TimerState {
  nextBreakAt: number;
  offSiteAt?: number;
  leaderId?: string;
}

export const BreakTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  
  const [minutesLeft, setMinutesLeft] = useState(BREAK_INTERVAL_MINUTES);
  const [isBreakReminderOpen, setIsBreakReminderOpen] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [leaderId] = useState(() => Math.random().toString(36).substr(2, 9));

  // Helper functions for localStorage operations
  const getTimerState = useCallback((): TimerState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const setTimerState = useCallback((state: TimerState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const clearTimerState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEADER_LOCK_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Leader election for multi-tab synchronization
  const becomeLeader = useCallback(() => {
    try {
      const lockData = {
        leaderId,
        timestamp: Date.now()
      };
      localStorage.setItem(LEADER_LOCK_KEY, JSON.stringify(lockData));
      return true;
    } catch {
      return false;
    }
  }, [leaderId]);

  const isLeader = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(LEADER_LOCK_KEY);
      if (!stored) return false;
      
      const lockData = JSON.parse(stored);
      const isStale = Date.now() - lockData.timestamp > LEADER_LOCK_TIMEOUT;
      
      if (isStale) {
        // Lock is stale, try to become leader
        return becomeLeader();
      }
      
      return lockData.leaderId === leaderId;
    } catch {
      return false;
    }
  }, [leaderId, becomeLeader]);

  // Initialize timer on mount (only for public pages)
  useEffect(() => {
    if (isAdminPage) {
      setIsTimerActive(false);
      return;
    }

    const storedState = getTimerState();
    const now = Date.now();

    if (storedState?.nextBreakAt) {
      // Check if user was off-site too long
      if (storedState.offSiteAt && (now - storedState.offSiteAt) > OFF_SITE_GRACE_PERIOD) {
        // Too much time passed off-site, start fresh
        clearTimerState();
        const nextBreakAt = now + (BREAK_INTERVAL_MINUTES * 60 * 1000);
        setTimerState({ nextBreakAt, leaderId });
        setMinutesLeft(BREAK_INTERVAL_MINUTES);
      } else {
        // Resume existing timer
        const timeLeft = Math.max(0, storedState.nextBreakAt - now);
        const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
        setMinutesLeft(minutesLeft);
        
        // Clear offSiteAt since user returned
        if (storedState.offSiteAt) {
          setTimerState({ ...storedState, offSiteAt: undefined, leaderId });
        }
        
        // Check if break is due
        if (timeLeft <= 0) {
          setIsBreakReminderOpen(true);
        }
      }
    } else {
      // First visit, start new timer
      const nextBreakAt = now + (BREAK_INTERVAL_MINUTES * 60 * 1000);
      setTimerState({ nextBreakAt, leaderId });
      setMinutesLeft(BREAK_INTERVAL_MINUTES);
    }

    setIsTimerActive(true);
    becomeLeader();
  }, [isAdminPage, getTimerState, setTimerState, clearTimerState, leaderId, becomeLeader]);

  // Timer countdown logic (only for leader tab)
  useEffect(() => {
    if (!isTimerActive || isAdminPage) return;

    const interval = setInterval(() => {
      if (!isLeader()) return; // Only leader tab updates the timer

      const storedState = getTimerState();
      if (!storedState?.nextBreakAt) return;

      const now = Date.now();
      const timeLeft = Math.max(0, storedState.nextBreakAt - now);
      const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
      
      setMinutesLeft(minutesLeft);

      // Check if break is due
      if (timeLeft <= 0 && !isBreakReminderOpen) {
        setIsBreakReminderOpen(true);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [isTimerActive, isAdminPage, isLeader, getTimerState, isBreakReminderOpen]);

  // Handle visibility change (tab switch, minimize, etc.)
  useEffect(() => {
    if (isAdminPage) return;

    const handleVisibilityChange = () => {
      const storedState = getTimerState();
      if (!storedState?.nextBreakAt) return;

      if (document.hidden) {
        // User switched away, mark off-site time
        setTimerState({ ...storedState, offSiteAt: Date.now() });
      } else {
        // User returned, check if still within grace period
        if (storedState.offSiteAt) {
          const offTime = Date.now() - storedState.offSiteAt;
          if (offTime > OFF_SITE_GRACE_PERIOD) {
            // Too long off-site, restart timer
            clearTimerState();
            const nextBreakAt = Date.now() + (BREAK_INTERVAL_MINUTES * 60 * 1000);
            setTimerState({ nextBreakAt, leaderId });
            setMinutesLeft(BREAK_INTERVAL_MINUTES);
          } else {
            // Still within grace period, clear off-site marker
            setTimerState({ ...storedState, offSiteAt: undefined });
          }
        }
        
        // Recalculate minutes left
        const now = Date.now();
        const timeLeft = Math.max(0, storedState.nextBreakAt - now);
        const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
        setMinutesLeft(minutesLeft);
        
        // Check if break is due
        if (timeLeft <= 0 && !isBreakReminderOpen) {
          setIsBreakReminderOpen(true);
        }
        
        // Become leader when returning to tab
        becomeLeader();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAdminPage, getTimerState, setTimerState, clearTimerState, leaderId, becomeLeader, isBreakReminderOpen]);

  // Listen for cross-tab storage changes
  useEffect(() => {
    if (isAdminPage) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newState: TimerState = JSON.parse(e.newValue);
          if (newState.nextBreakAt) {
            const now = Date.now();
            const timeLeft = Math.max(0, newState.nextBreakAt - now);
            const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
            setMinutesLeft(minutesLeft);
            
            // Check if break is due
            if (timeLeft <= 0 && !isBreakReminderOpen) {
              setIsBreakReminderOpen(true);
            }
          }
        } catch {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAdminPage, isBreakReminderOpen]);

  // Handle page unload (user leaving site)
  useEffect(() => {
    if (isAdminPage) return;

    const handleBeforeUnload = () => {
      const storedState = getTimerState();
      if (storedState?.nextBreakAt) {
        setTimerState({ ...storedState, offSiteAt: Date.now() });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAdminPage, getTimerState, setTimerState]);

  const openBreakReminder = useCallback(() => {
    setIsBreakReminderOpen(true);
  }, []);

  const closeBreakReminder = useCallback(() => {
    setIsBreakReminderOpen(false);
  }, []);

  const onBreakComplete = useCallback(() => {
    setIsBreakReminderOpen(false);
    
    // Start new timer
    const nextBreakAt = Date.now() + (BREAK_INTERVAL_MINUTES * 60 * 1000);
    setTimerState({ nextBreakAt, leaderId });
    setMinutesLeft(BREAK_INTERVAL_MINUTES);
    
    toast({
      title: `Break complete! Next break in ${BREAK_INTERVAL_MINUTES} minutes.`,
      duration: 4000,
    });
  }, [setTimerState, leaderId]);

  const value: BreakTimerContextType = {
    minutesLeft,
    isBreakReminderOpen,
    openBreakReminder,
    closeBreakReminder,
    onBreakComplete,
    isTimerActive: isTimerActive && !isAdminPage
  };

  return (
    <BreakTimerContext.Provider value={value}>
      {children}
    </BreakTimerContext.Provider>
  );
};

export const useBreakTimer = (): BreakTimerContextType => {
  const context = useContext(BreakTimerContext);
  if (context === undefined) {
    throw new Error('useBreakTimer must be used within a BreakTimerProvider');
  }
  return context;
};