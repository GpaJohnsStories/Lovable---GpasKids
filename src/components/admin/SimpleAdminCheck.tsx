import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimpleAdminLogin from "./SimpleAdminLogin";
import { Session } from "@supabase/supabase-js";

interface SimpleAdminCheckProps {
  children: React.ReactNode;
}

const SimpleAdminCheck = ({ children }: SimpleAdminCheckProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        console.log('🔐 SimpleAdminCheck: Starting auth check...');
        setIsLoading(true);
        setError(null);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('🔐 SimpleAdminCheck: Session error:', sessionError);
          if (isMounted) {
            setError(`Authentication error: ${sessionError.message}`);
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        if (!session?.user) {
          console.log('🔐 SimpleAdminCheck: No session found');
          if (isMounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        console.log('🔐 SimpleAdminCheck: Session found, checking admin role for user:', session.user.id);

        // Check if user is admin using the database function for better reliability
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin_safe');
        
        if (adminCheckError) {
          console.error('🔐 SimpleAdminCheck: Admin check error:', adminCheckError);
          if (isMounted) {
            setError(`Admin verification failed: ${adminCheckError.message}`);
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        console.log('🔐 SimpleAdminCheck: Admin check result:', isAdmin);
        
        if (isMounted) {
          setIsAuthorized(!!isAdmin);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('🔐 SimpleAdminCheck: Unexpected error:', err);
        if (isMounted) {
          setError(`Authentication check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsAuthorized(false);
          setIsLoading(false);
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 SimpleAdminCheck: Auth state changed:', event, session ? 'Session exists' : 'No session');
      if (isMounted) {
        // Only recheck on significant auth events
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(true);
              setError(null);
              checkAuth();
            }
          }, 100);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-sm mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Still checking
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleAdminLogin onSuccess={() => {
          console.log('🔐 SimpleAdminCheck: Login successful, rechecking auth...');
          setIsAuthorized(null);
          setIsLoading(true);
        }} />
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
};

export default SimpleAdminCheck;