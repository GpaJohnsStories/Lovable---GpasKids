import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface SimpleAdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const SimpleAdminAuthContext = createContext<SimpleAdminAuthContextType | undefined>(undefined);

export const useSimpleAdminAuth = () => {
  const context = useContext(SimpleAdminAuthContext);
  if (!context) {
    throw new Error('useSimpleAdminAuth must be used within a SimpleAdminAuthProvider');
  }
  return context;
};

interface SimpleAdminAuthProviderProps {
  children: ReactNode;
}

export const SimpleAdminAuthProvider = ({ children }: SimpleAdminAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log('SimpleAdminAuthProvider: State', { isAuthenticated, isLoading });

  useEffect(() => {
    // Check if already authenticated on load
    const stored = sessionStorage.getItem('simpleAdminAuth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use the secure database admin_login function
      const { data, error } = await supabase.rpc('admin_login', {
        email_input: email,
        password_input: password,
        device_info: navigator.userAgent
      });

      if (error) {
        return { success: false, error: 'Authentication failed' };
      }

      // Cast the JSON response to the expected type
      const response = data as { success: boolean; error?: string };
      
      if (response && response.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('simpleAdminAuth', 'true');
        return { success: true };
      } else {
        return { success: false, error: response?.error || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('simpleAdminAuth');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <SimpleAdminAuthContext.Provider value={value}>
      {children}
    </SimpleAdminAuthContext.Provider>
  );
};