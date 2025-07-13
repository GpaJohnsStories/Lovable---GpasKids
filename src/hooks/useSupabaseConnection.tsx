import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useSupabaseConnection = () => {
  const [state, setState] = useState<ConnectionState>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const testConnection = async () => {
    try {
      console.log('🔗 Testing Supabase connection...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Test basic database access with a simple query using a publicly accessible table
      const { data, error } = await supabase
        .from('stories')
        .select('count(*)')
        .limit(1);

      if (error) {
        console.error('🔗 Connection test failed:', error);
        setState({
          isConnected: false,
          isLoading: false,
          error: error.message,
          lastChecked: new Date()
        });
        return false;
      }

      console.log('🔗 Connection test successful');
      setState({
        isConnected: true,
        isLoading: false,
        error: null,
        lastChecked: new Date()
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
      console.error('🔗 Connection test error:', err);
      setState({
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date()
      });
      return false;
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    ...state,
    testConnection
  };
};