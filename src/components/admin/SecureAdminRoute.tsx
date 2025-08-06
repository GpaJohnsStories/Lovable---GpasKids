import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import SecureAdminLogin from './SecureAdminLogin';

interface SecureAdminRouteProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  allowViewer?: boolean; // Allow viewer role access
}

const SecureAdminRoute = ({ 
  children, 
  title = "Admin Access Required",
  description = "Administrative access required to view this page",
  allowViewer = true 
}: SecureAdminRouteProps) => {
  const { userRole, isLoading, hasAdminAccess } = useUserRole();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading - Admin Access</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  // Check if user has required access level
  const hasRequiredAccess = allowViewer ? hasAdminAccess : userRole === 'admin';

  if (!hasRequiredAccess) {
    // If not logged in at all, show login form
    if (!userRole) {
      return (
        <>
          <Helmet>
            <title>Admin Login Required</title>
          </Helmet>
          <SecureAdminLogin onSuccess={() => window.location.reload()} />
        </>
      );
    }

    // If logged in but insufficient permissions, show access denied
    return (
      <>
        <Helmet>
          <title>Access Denied - {title}</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {allowViewer 
                ? "Admin or viewer access required to view this page."
                : "Admin access required to view this page."
              }
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  // User has required access, render the protected content
  return (
    <>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      {children}
    </>
  );
};

export default SecureAdminRoute;