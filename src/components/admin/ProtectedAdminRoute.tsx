import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SecureAdminLogin from "./SecureAdminLogin";
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
      console.log('Checking admin status for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile data:', profile, 'Error:', error);
      const isAdminUser = profile?.role === 'admin';
      console.log('Is admin user:', isAdminUser);
      return isAdminUser;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      console.log('Initializing auth...');
      
      // Check for existing session first
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Current session:', currentSession?.user?.id);
      
      if (!isMounted) return;
      
      setSession(currentSession);
      
      if (currentSession?.user) {
        const adminStatus = await checkAdminStatus(currentSession.user.id);
        if (isMounted) {
          setIsAdmin(adminStatus);
          console.log('Set admin status:', adminStatus);
        }
      }
      
      if (isMounted) {
        setLoading(false);
        console.log('Loading set to false');
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
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

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = async () => {
    console.log('Login success called');
    // Force a session refresh to trigger the auth state change
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const adminStatus = await checkAdminStatus(session.user.id);
      setIsAdmin(adminStatus);
      setSession(session);
      console.log('Login success - admin status:', adminStatus);
    }
  };

  console.log('Render state:', { loading, session: !!session, isAdmin });

  if (loading) {
    console.log('Showing loading spinner');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
        <div className="ml-4 text-muted-foreground">Checking authentication...</div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    console.log('Showing login form');
    return (
      <div className="min-h-screen bg-background">
        <SecureAdminLogin onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  console.log('Showing admin content');
  return <>{children}</>;
};

export default ProtectedAdminRoute;