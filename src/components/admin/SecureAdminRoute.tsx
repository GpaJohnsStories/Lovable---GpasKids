import React from 'react';
import EnhancedSecureAdminCheck from './EnhancedSecureAdminCheck';
import AdminLayout from './AdminLayout';

interface SecureAdminRouteProps {
  children: React.ReactNode;
}

const SecureAdminRoute = ({ children }: SecureAdminRouteProps) => {
  return (
    <EnhancedSecureAdminCheck>
      <AdminLayout>
        {children}
      </AdminLayout>
    </EnhancedSecureAdminCheck>
  );
};

export default SecureAdminRoute;