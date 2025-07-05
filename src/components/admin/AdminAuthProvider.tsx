
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
    try {
      // Use secure database authentication
      const { data, error } = await supabase.rpc('admin_login', {
        email_input: email.toLowerCase().trim(),
        password_input: password,
        device_info: navigator.userAgent
      });

      if (error) {
        console.error('Admin login error:', error);
        return { success: false, error: 'Authentication service error' };
      }

      const result = data as { success: boolean; error?: string; admin_id?: string; email?: string; role?: string };
      
      if (result.success) {
        try {
          // Store secure session data
          const sessionData = {
            isAuthenticated: true,
            adminId: result.admin_id,
            email: result.email,
            role: result.role,
            loginTime: new Date().toISOString(),
            deviceFingerprint: btoa(navigator.userAgent)
          };
          
          sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          setIsAuthenticated(true);
          return { success: true };
        } catch (storageError) {
          console.error("Could not access session storage", storageError);
          return { success: false, error: 'Could not create secure session.' };
        }
      } else {
        return { success: false, error: result.error || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Unexpected admin login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
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
