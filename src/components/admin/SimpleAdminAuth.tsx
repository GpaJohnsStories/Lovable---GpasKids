import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SimpleAdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
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

const ADMIN_PASSWORD = 'buddy2025admin';

export const SimpleAdminAuthProvider = ({ children }: SimpleAdminAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated on load
    const stored = sessionStorage.getItem('simpleAdminAuth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('simpleAdminAuth', 'true');
      return { success: true };
    } else {
      return { success: false, error: 'Invalid password' };
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