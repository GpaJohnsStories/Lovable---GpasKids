
import React from 'react';
import ContentProtection from "@/components/ContentProtection";
import AdminHeaderBanner from "./AdminHeaderBanner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ContentProtection enableProtection={false}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <AdminHeaderBanner />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </ContentProtection>
  );
};

export default AdminLayout;
