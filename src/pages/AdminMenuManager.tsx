import React from 'react';
import { Helmet } from 'react-helmet-async';
import WelcomeHeader from '@/components/WelcomeHeader';
import CookieFreeFooter from '@/components/CookieFreeFooter';
import ScrollToTop from '@/components/ScrollToTop';
import MenuButtonsManager from '@/components/admin/MenuButtonsManager';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminMenuManager = () => {
  const { userRole, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse bg-muted rounded h-64 w-full"></div>
        </main>
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <Helmet>
          <title>Access Denied - Menu Manager</title>
        </Helmet>
        <WelcomeHeader />
        <main className="container mx-auto px-4 py-8">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Admin access required to manage navigation menus.
            </AlertDescription>
          </Alert>
        </main>
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <Helmet>
        <title>Navigation Menu Manager - Admin</title>
        <meta name="description" content="Manage website navigation buttons and menus" />
      </Helmet>
      
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 py-8">
        <MenuButtonsManager />
      </main>
      
      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default AdminMenuManager;