
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SecureAdminLoginWithWebAuthn from "./SecureAdminLoginWithWebAuthn";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Clock, Shield } from "lucide-react";

interface EnhancedSecureAdminCheckProps {
  children: React.ReactNode;
}

const EnhancedSecureAdminCheck = ({ children }: EnhancedSecureAdminCheckProps) => {
  const { session, user, isLoading, isRecovering, isNewTab, forceRefresh, recoverSession } = useEnhancedAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authCheckLoading, setAuthCheckLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [newTabWaitTime, setNewTabWaitTime] = useState(3);

  // New tab countdown timer
  useEffect(() => {
    if (isNewTab && newTabWaitTime > 0) {
      const timer = setTimeout(() => {
        setNewTabWaitTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNewTab, newTabWaitTime]);

  // Check admin access when we have a session
  useEffect(() => {
    let isMounted = true;

    const checkAdminAccess = async () => {
      // Reset authorization state when session changes
      if (!session?.user) {
        console.log('🔐 EnhancedSecureAdminCheck: No session, setting unauthorized');
        if (isMounted) {
          setIsAuthorized(false);
          setAuthError(null);
          setAuthCheckLoading(false);
        }
        return;
      }

      // Wait a moment to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        console.log('🔐 EnhancedSecureAdminCheck: Checking admin access for user:', session.user.id);
        setAuthCheckLoading(true);
        setAuthError(null);

        // Step 1: Check if user is a privileged admin (in the allowlist)
        console.log('🔍 Checking privileged admin status...');
        const { data: isPrivilegedAdmin, error: privilegedError } = await supabase.rpc('is_privileged_admin');
        
        if (privilegedError) {
          console.error('🚨 Privileged admin check failed:', privilegedError);
          throw new Error(`Privileged admin check failed: ${privilegedError.message}`);
        }

        if (!isPrivilegedAdmin) {
          console.log('🚫 User is not in privileged admin allowlist');
          if (isMounted) {
            setAuthError('Access denied. You are not in the privileged admin allowlist.');
            setIsAuthorized(false);
            // Sign out user since they shouldn't have access
            setTimeout(async () => {
              try {
                await supabase.auth.signOut();
              } catch (signOutError) {
                console.error('Error signing out unauthorized user:', signOutError);
              }
            }, 2000);
          }
          return;
        }

        console.log('✅ User is privileged admin');

        // Step 2: Check if user has admin role in profiles
        console.log('🔍 Checking admin role in profiles...');
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        
        if (adminError) {
          console.error('🚨 Admin role check failed:', adminError);
          throw new Error(`Admin role check failed: ${adminError.message}`);
        }

        if (!isAdmin) {
          console.log('🚫 User does not have admin role');
          if (isMounted) {
            setAuthError('Access denied. Admin role required in profiles.');
            setIsAuthorized(false);
            // Sign out user since they don't have the proper role
            setTimeout(async () => {
              try {
                await supabase.auth.signOut();
              } catch (signOutError) {
                console.error('Error signing out user without admin role:', signOutError);
              }
            }, 2000);
          }
          return;
        }

        console.log('✅ User has admin role');

        if (isMounted) {
          setIsAuthorized(true);
          setAuthError(null);
          console.log('🔐 EnhancedSecureAdminCheck: User fully authorized for admin access');
        }
      } catch (err) {
        console.error('🚨 EnhancedSecureAdminCheck: Auth check failed:', err);
        if (isMounted) {
          setAuthError(err instanceof Error ? err.message : 'Authentication check failed');
          setIsAuthorized(false);
        }
      } finally {
        if (isMounted) {
          setAuthCheckLoading(false);
        }
      }
    };

    // Reset state when session changes
    if (session?.user?.id) {
      setIsAuthorized(null);
      setAuthError(null);
      
      // Don't check if this is a new tab that's still waiting for sync
      if (!(isNewTab && newTabWaitTime > 0)) {
        checkAdminAccess();
      }
    } else {
      // No session, immediately set unauthorized
      setIsAuthorized(false);
      setAuthError(null);
      setAuthCheckLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, isNewTab, newTabWaitTime]);

  // Handle session recovery
  const handleRecovery = async () => {
    console.log('🔄 Attempting manual session recovery...');
    const recovered = await recoverSession();
    
    if (!recovered) {
      setAuthError('Unable to recover session. Please login again.');
    }
  };

  // Show new tab waiting state
  if (isNewTab && newTabWaitTime > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Clock className="h-12 w-12 text-blue-500 mx-auto" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Syncing authentication from parent tab...
            </p>
            <p className="text-sm text-muted-foreground">
              Waiting {newTabWaitTime} seconds for session sync
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced loading state with recovery options
  if (isLoading || authCheckLoading || isRecovering) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isRecovering ? 'Recovering session...' : 'Verifying admin access...'}
            </p>
            {isRecovering && (
              <p className="text-sm text-muted-foreground">
                Attempting to restore your login session
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show error state with clear messaging
  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">{authError}</p>
          </div>
          
          <div className="space-y-3">
            {session?.user ? (
              <>
                <Button onClick={handleRecovery} className="w-full" size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Authorization Check
                </Button>
                
                <Button 
                  onClick={forceRefresh} 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  Force Refresh
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = '/'} 
                className="w-full"
                size="lg"
              >
                Back to Home
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact the site administrator.
          </p>
        </div>
      </div>
    );
  }

  // Not authorized - show secure login
  if (!session?.user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-background">
        <SecureAdminLoginWithWebAuthn onSuccess={() => {
          setIsAuthorized(null);
          setAuthCheckLoading(true);
          setAuthError(null);
        }} />
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
};

export default EnhancedSecureAdminCheck;
