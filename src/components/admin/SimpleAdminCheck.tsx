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

        // Test basic connection first using a publicly accessible table
        console.log('🔐 SimpleAdminCheck: Testing database connection...');
        const { data: testData, error: testError } = await supabase
          .from('stories')
          .select('id', { count: 'exact', head: true })
          .limit(1);
        
        if (testError) {
          console.error('🔐 SimpleAdminCheck: Database connection test failed:', testError);
          
          // Provide more specific error handling
          let errorMessage = 'Database connection failed';
          if (testError.message.includes('Invalid API key')) {
            errorMessage = 'Invalid API key or database configuration error';
          } else if (testError.message.includes('permission denied') || testError.message.includes('row-level security')) {
            errorMessage = 'Database access restricted - this is likely a configuration issue';
          } else {
            errorMessage = `Database connection failed: ${testError.message}`;
          }
          
          if (isMounted) {
            setError(`${errorMessage}. Please check your internet connection and try again.`);
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }
        
        console.log('🔐 SimpleAdminCheck: Database connection successful');

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

        console.log('🔐 SimpleAdminCheck: Session found for user:', session.user.id);
        console.log('🔐 SimpleAdminCheck: User email:', session.user.email);

        // Check if user is admin using the database function for better reliability
        console.log('🔐 SimpleAdminCheck: Calling is_admin_safe function...');
        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin_safe');
        
        if (adminCheckError) {
          console.error('🔐 SimpleAdminCheck: Admin check error:', {
            message: adminCheckError.message,
            details: adminCheckError.details,
            hint: adminCheckError.hint,
            code: adminCheckError.code
          });
          
          // Fallback: Check profiles table directly
          console.log('🔐 SimpleAdminCheck: Trying fallback admin check via profiles table...');
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('🔐 SimpleAdminCheck: Fallback check also failed:', profileError);
            if (isMounted) {
              setError(`Failed to verify admin access: ${adminCheckError.message}. Fallback check also failed: ${profileError.message}`);
              setIsAuthorized(false);
              setIsLoading(false);
            }
            return;
          }
          
          const fallbackIsAdmin = profileData?.role === 'admin';
          console.log('🔐 SimpleAdminCheck: Fallback check result:', fallbackIsAdmin, 'Role:', profileData?.role);
          
          if (isMounted) {
            setIsAuthorized(fallbackIsAdmin);
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