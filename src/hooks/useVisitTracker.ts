
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        console.log('Starting visit tracking...');
        
        // Get current session to pass auth header if available
        const { data: { session } } = await supabase.auth.getSession();
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        // Include auth header if user is logged in
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
          console.log('User authenticated, including auth header');
        } else {
          console.log('No authentication, tracking as anonymous visitor');
        }

        const response = await supabase.functions.invoke('track-monthly-visit', {
          headers,
        });

        if (response.error) {
          console.warn('Visit tracking failed:', response.error);
        } else if (response.data) {
          console.log('Visit tracking response:', response.data);
          
          // Log different outcomes
          if (response.data.excluded_reason) {
            console.log(`Visit excluded: ${response.data.message} (${response.data.excluded_reason})`);
          } else if (response.data.success) {
            console.log(`Visit tracked successfully for ${response.data.year}-${response.data.month}`);
          }
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
