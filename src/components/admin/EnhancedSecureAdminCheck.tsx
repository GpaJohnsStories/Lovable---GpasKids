
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SecureAdminLoginWithWebAuthn from "./SecureAdminLoginWithWebAuthn";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Clock } from "lucide-react";

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

        // Debug auth context first
        const { data: debugInfo } = await supabase.rpc('debug_auth_context');
        console.log('🔍 Auth debug info:', debugInfo);

        // Check admin access (admin or viewer)
        const { data: hasAccess, error: accessCheckError } = await supabase.rpc('has_admin_access');
        
        console.log('🔐 EnhancedSecureAdminCheck: Admin access check result:', { hasAccess, accessCheckError });
        
        if (accessCheckError) {
          console.error('🚨 Admin access check error:', accessCheckError);
          if (isMounted) {
            setAuthError('Failed to verify admin access');
            setIsAuthorized(false);
          }
          return;
        }

        if (isMounted) {
          const authorized = hasAccess || false;
          setIsAuthorized(authorized);
          console.log('🔐 EnhancedSecureAdminCheck: User authorized:', authorized);
          
          // Prefetch admin chunks for authorized users
          if (authorized) {
            // Preload key admin components to improve navigation performance
            import("@/components/admin/AdminOverview");
            import("@/components/admin/AdminStories");
            import("@/components/admin/CommentsDashboard");
            import("@/components/unified-story/UnifiedStoryPage");
            import("@/components/admin/SecurityAuditDashboard");
          }
        }
      } catch (err) {
        console.error('🚨 EnhancedSecureAdminCheck: Auth check failed:', err);
        if (isMounted) {
          setAuthError('Authentication check failed');
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
              {isRecovering ? 'Recovering session...' : 'Verifying access...'}
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

  // Show recovery options if we have an auth error
  if (authError && session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-semibold">Session Issue Detected</h2>
            <p className="text-muted-foreground">{authError}</p>
          </div>
          
          <div className="space-y-3">
            <Button onClick={handleRecovery} className="w-full" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recover Session
            </Button>
            
            <Button 
              onClick={forceRefresh} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Force Refresh
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            If the issue persists, you may need to login again.
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
  console.log('🟢 EnhancedSecureAdminCheck: Rendering authorized content');
  return <>{children}</>;
};

export default EnhancedSecureAdminCheck;
