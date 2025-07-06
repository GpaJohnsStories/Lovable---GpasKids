import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SimpleAdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<{ success: boolean; error?: string }>;
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

  const login = async (token: string) => {
    // Simple token-based authentication for demo
    // In production, this token would be validated server-side
    if (token && token.length > 10) {
      setIsAuthenticated(true);
      sessionStorage.setItem('simpleAdminAuth', 'true');
      return { success: true };
    } else {
      return { success: false, error: 'Invalid access token' };
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