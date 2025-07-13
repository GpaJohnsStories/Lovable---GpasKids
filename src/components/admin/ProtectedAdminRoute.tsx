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
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          const userIsAdmin = profile?.role === 'admin';
          setIsAdmin(userIsAdmin);
          setAuthenticated(userIsAdmin);
        } else {
          setIsAdmin(false);
          setAuthenticated(false);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        const userIsAdmin = profile?.role === 'admin';
        setIsAdmin(userIsAdmin);
        setAuthenticated(userIsAdmin);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!authenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleAdminLogin onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;