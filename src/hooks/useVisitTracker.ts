import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get current session to pass auth header if available
        const { data: { session } } = await supabase.auth.getSession();
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Include auth header if user is logged in
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const response = await supabase.functions.invoke('track-monthly-visit', {
          headers,
        });

        if (response.error) {
          console.warn('Visit tracking failed:', response.error);
        }
      } catch (error) {
        console.warn('Visit tracking error:', error);
        // Silently fail - don't disrupt user experience
      }
    };

    // Track visit on component mount
    trackVisit();
  }, []); // Empty dependency array means this runs once on mount
};