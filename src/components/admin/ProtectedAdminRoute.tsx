import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimpleAdminLogin from "./SimpleAdminLogin";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Session } from "@supabase/supabase-js";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          const adminStatus = await checkAdminStatus(session.user.id);
          if (isMounted) {
            setIsAdmin(adminStatus);
          }
        } else {
          if (isMounted) {
            setIsAdmin(false);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isMounted) return;
      
      setSession(session);
      
      if (session?.user) {
        const adminStatus = await checkAdminStatus(session.user.id);
        if (isMounted) {
          setIsAdmin(adminStatus);
        }
      }
      
      if (isMounted) {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = async () => {
    // Force a session refresh to trigger the auth state change
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const adminStatus = await checkAdminStatus(session.user.id);
      setIsAdmin(adminStatus);
      setSession(session);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleAdminLogin onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;