
import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeaderBanner from "./AdminHeaderBanner";
import ScrollToTop from "@/components/ScrollToTop";

interface AdminLayoutWithHeaderBannerProps {
  children?: React.ReactNode;
}

const AdminLayoutWithHeaderBanner = ({ children }: AdminLayoutWithHeaderBannerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      {/* Header Banner */}
      <AdminHeaderBanner />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>

      <ScrollToTop />
    </div>
  );
};

export default AdminLayoutWithHeaderBanner;
