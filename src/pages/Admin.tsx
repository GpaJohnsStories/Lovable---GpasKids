
import React from 'react';
import { useAdminAuth } from '@/components/admin/useAdminAuth';
import AdminAuth from '@/components/admin/AdminAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const { isAdmin, loading, login, logout } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-amber-800">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isAdmin ? (
        <AdminDashboard onLogout={logout} />
      ) : (
        <AdminAuth onAuthSuccess={login} />
      )}
    </>
  );
};

export default Admin;
