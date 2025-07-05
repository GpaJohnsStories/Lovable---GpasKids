import { DualAdminAuthProvider, useDualAdminAuth } from "@/components/admin/DualAdminAuthProvider";
import DualAdminLogin from "@/components/admin/DualAdminLogin";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";
import AdminLayout from "@/components/admin/AdminLayout";
import SecurityMigrationGuide from "@/components/admin/SecurityMigrationGuide";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminDashboardContent = () => {
  const { isAuthenticated, isLoading } = useDualAdminAuth();
  const [showSecurityGuide, setShowSecurityGuide] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <DualAdminLogin />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin control center</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-orange-800">📚 Story Management</h3>
            <p className="text-gray-600 mb-4">Create, edit, and manage stories for children</p>
            <Button asChild className="w-full">
              <a href="/buddys_admin?tab=stories">Manage Stories</a>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-orange-800">💬 Comments</h3>
            <p className="text-gray-600 mb-4">Review and moderate user comments</p>
            <Button asChild className="w-full" variant="outline">
              <a href="/buddys_admin?tab=comments">View Comments</a>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-orange-800">🔒 Security</h3>
            <p className="text-gray-600 mb-4">Monitor security and audit logs</p>
            <Button asChild className="w-full" variant="outline">
              <a href="/buddys_admin?tab=security">Security Dashboard</a>
            </Button>
          </div>
        </div>
        
        {showSecurityGuide && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Security Migration Status</h3>
              <Button 
                onClick={() => setShowSecurityGuide(false)}
                variant="ghost"
                size="sm"
              >
                Hide
              </Button>
            </div>
            <SecurityMigrationGuide />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const AdminDashboard = () => {
  return (
    <ContentProtection enableProtection={false}>
      <DualAdminAuthProvider>
        <AdminDashboardContent />
      </DualAdminAuthProvider>
    </ContentProtection>
  );
};

export default AdminDashboard;