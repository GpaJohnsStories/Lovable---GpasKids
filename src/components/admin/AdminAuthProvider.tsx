
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem('isAdminAuthenticated');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Could not access session storage", error);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const ADMIN_EMAIL = 'gpajohn.buddy@gmail.com';
    const ADMIN_PASSWORD = 'gpaj0hn#bUdDy1o0s6e';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);
        return { success: true };
      } catch (error) {
        console.error("Could not access session storage", error);
        return { success: false, error: 'Could not set session.' };
      }
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('isAdminAuthenticated');
    } catch (error) {
      console.error("Could not access session storage", error);
    }
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, logout, isLoading };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
