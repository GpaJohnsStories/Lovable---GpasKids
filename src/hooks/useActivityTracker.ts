import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface ActivityData {
  startTime: number;
  lastActivity: number;
  lastBreakSuggestion: number;
  totalActiveTime: number;
}

export const useActivityTracker = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  
  const [isActive, setIsActive] = useState(true);
  const [timeActive, setTimeActive] = useState(0);
  const lastActivityRef = useRef<number>(Date.now());
  const activityCheckIntervalRef = useRef<NodeJS.Timeout>();
  const updateIntervalRef = useRef<NodeJS.Timeout>();

  const ACTIVITY_STORAGE_KEY = 'user_activity_data';
  const INITIAL_BREAK_SUGGESTION = 60 * 60 * 1000; // 1 hour
  const REPEAT_BREAK_INTERVAL = 15 * 60 * 1000; // 15 minutes
  const BREAK_DETECTION_TIME = 5 * 60 * 1000; // 5 minutes of inactivity
  const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  // Load activity data from localStorage
  const loadActivityData = (): ActivityData => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Validate the data structure
        if (data.startTime && data.lastActivity && typeof data.totalActiveTime === 'number') {
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to load activity data:', error);
    }
    
    // Return default data if loading fails or no data exists
    const now = Date.now();
    return {
      startTime: now,
      lastActivity: now,
      lastBreakSuggestion: 0,
      totalActiveTime: 0
    };
  };

  // Save activity data to localStorage
  const saveActivityData = (data: ActivityData) => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save activity data:', error);
    }
  };

  // Reset activity tracking (after a break)
  const resetActivityTimer = () => {
    const now = Date.now();
    const newData: ActivityData = {
      startTime: now,
      lastActivity: now,
      lastBreakSuggestion: 0,
      totalActiveTime: 0
    };
    saveActivityData(newData);
    setTimeActive(0);
    toast.success('Great job taking a break! Activity timer has been reset.', {
      duration: 3000,
    });
  };

  // Show break suggestion toast or trigger break timer popup
  const showBreakSuggestion = (isRepeat: boolean = false) => {
    // Dispatch custom event for break timer popup
    window.dispatchEvent(new CustomEvent('showBreakTimer', { 
      detail: { isRepeat } 
    }));
  };

  // Handle user activity
  const handleActivity = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    
    if (!isActive) {
      setIsActive(true);
    }

    // Update activity data
    const activityData = loadActivityData();
    activityData.lastActivity = now;
    saveActivityData(activityData);
  };

  // Check for break suggestions and inactivity
  const checkActivityStatus = () => {
    const now = Date.now();
    const activityData = loadActivityData();
    const timeSinceLastActivity = now - lastActivityRef.current;
    const totalActiveTime = activityData.totalActiveTime + (now - activityData.startTime);

    // Check if user has been inactive long enough to detect a break
    if (timeSinceLastActivity >= BREAK_DETECTION_TIME) {
      if (isActive) {
        setIsActive(false);
        // If they were previously active and total time suggests they took a break, reset
        if (totalActiveTime >= INITIAL_BREAK_SUGGESTION) {
          resetActivityTimer();
          return;
        }
      }
    } else {
      // User is active
      if (!isActive) {
        setIsActive(true);
      }

      // Check if we should show break suggestion
      const timeSinceLastSuggestion = now - activityData.lastBreakSuggestion;
      
      if (totalActiveTime >= INITIAL_BREAK_SUGGESTION) {
        // First break suggestion after 1 hour
        if (activityData.lastBreakSuggestion === 0) {
          showBreakSuggestion(false);
          activityData.lastBreakSuggestion = now;
          saveActivityData(activityData);
        }
        // Repeat suggestions every 15 minutes
        else if (timeSinceLastSuggestion >= REPEAT_BREAK_INTERVAL) {
          showBreakSuggestion(true);
          activityData.lastBreakSuggestion = now;
          saveActivityData(activityData);
        }
      }
    }

    // Update displayed active time
    setTimeActive(Math.floor(totalActiveTime / 1000 / 60)); // Convert to minutes
  };

  useEffect(() => {
    // Don't initialize activity tracking on admin pages
    if (isAdminPage) {
      return;
    }
    
    // Initialize activity data
    const activityData = loadActivityData();
    lastActivityRef.current = activityData.lastActivity;

    // Add event listeners for activity detection
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - user may have switched tabs or minimized
        setIsActive(false);
      } else {
        // Page is visible again
        handleActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up periodic checks
    activityCheckIntervalRef.current = setInterval(checkActivityStatus, 30000); // Check every 30 seconds
    updateIntervalRef.current = setInterval(() => {
      const activityData = loadActivityData();
      const totalActiveTime = activityData.totalActiveTime + (Date.now() - activityData.startTime);
      setTimeActive(Math.floor(totalActiveTime / 1000 / 60));
    }, 60000); // Update display every minute

    // Initial check
    checkActivityStatus();

    // Cleanup
    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isAdminPage]);

  return {
    isActive,
    timeActive, // in minutes
    resetActivityTimer
  };
};