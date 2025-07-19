import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SecureAdminLoginWithWebAuthn from "./SecureAdminLoginWithWebAuthn";

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
        console.log('🔐 SecureAdminCheck: Starting auth check...');
        setIsLoading(true);

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔐 SecureAdminCheck: Session check result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          sessionError 
        });
        
        if (sessionError || !session?.user) {
          console.log('🔐 SecureAdminCheck: No valid session found');
          if (isMounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        console.log('🔐 SecureAdminCheck: Checking admin status for user:', session.user.id);
        
        // Check admin access (admin or viewer)
        const { data: hasAccess, error: accessCheckError } = await supabase.rpc('has_admin_access');
        
        console.log('🔐 SecureAdminCheck: Admin access check result:', { hasAccess, accessCheckError });
        
        if (accessCheckError || !hasAccess) {
          console.log('🔐 SecureAdminCheck: Access check failed or user not authorized');
          if (isMounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        console.log('🔐 SecureAdminCheck: User authorized for admin access');
        if (isMounted) {
          setIsAuthorized(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('🔐 SecureAdminCheck: Auth check failed:', err);
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
        <SecureAdminLoginWithWebAuthn onSuccess={() => {
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