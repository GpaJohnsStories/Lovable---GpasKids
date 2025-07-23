import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import MenuButtonsManager from '@/components/admin/MenuButtonsManager';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminMenuManager = () => {
  const { userRole, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse bg-muted rounded h-64 w-full"></div>
      </AdminLayout>
    );
  }

  if (userRole !== 'admin') {
    return (
      <AdminLayout>
        <Helmet>
          <title>Access Denied - Menu Manager</title>
        </Helmet>
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin access required to manage navigation menus.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Navigation Menu Manager - Admin</title>
        <meta name="description" content="Manage website navigation buttons and menus" />
      </Helmet>
      
      <MenuButtonsManager />
    </AdminLayout>
  );
};

export default AdminMenuManager;