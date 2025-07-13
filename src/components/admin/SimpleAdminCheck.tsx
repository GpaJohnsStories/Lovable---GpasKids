import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SimpleAdminLogin from "./SimpleAdminLogin";
import { Session } from "@supabase/supabase-js";

interface SimpleAdminCheckProps {
  children: React.ReactNode;
}

const SimpleAdminCheck = ({ children }: SimpleAdminCheckProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAuthorized(false);
        return;
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      
      setIsAuthorized(profile?.role === 'admin');
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Still checking
  if (isAuthorized === null) {
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
        <SimpleAdminLogin onSuccess={() => setIsAuthorized(true)} />
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
};

export default SimpleAdminCheck;