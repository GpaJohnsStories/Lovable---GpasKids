
import { useState, useEffect } from 'react';

interface AdminSession {
  email: string;
  timestamp: number;
  expiresAt: number;
}

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = () => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        const session: AdminSession = JSON.parse(sessionData);
        
        // Check if session is still valid
        if (Date.now() < session.expiresAt) {
          setIsAdmin(true);
        } else {
          // Session expired, remove it
          localStorage.removeItem('adminSession');
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
  };

  const login = () => {
    setIsAdmin(true);
  };

  return {
    isAdmin,
    loading,
    login,
    logout,
    checkAdminSession
  };
};
