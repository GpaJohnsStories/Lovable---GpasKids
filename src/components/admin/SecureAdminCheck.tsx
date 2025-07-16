import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SecureAdminLogin from "./SecureAdminLogin";

interface SecureAdminCheckProps {
  children: React.ReactNode;
}

const SecureAdminCheck = ({ children }: SecureAdminCheckProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          if (isMounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        // Check admin status
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin_safe');
        
        if (adminCheckError || !isAdmin) {
          if (isMounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setIsAuthorized(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        if (isMounted) {
          setIsAuthorized(false);
          setIsLoading(false);
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (isMounted && (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED')) {
        setTimeout(() => {
          if (isMounted) {
            checkAuth();
          }
        }, 100);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  // Not authorized - show secure login
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background">
        <SecureAdminLogin onSuccess={() => {
          setIsAuthorized(null);
          setIsLoading(true);
        }} />
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
};

export default SecureAdminCheck;