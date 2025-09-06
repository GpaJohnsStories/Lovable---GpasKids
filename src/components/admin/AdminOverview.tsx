import React, { useState, useEffect } from 'react';
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import WebAuthnManager from "./WebAuthnManager";
import { MonthlyVisitsCard } from "./MonthlyVisitsCard";
import { CountryVisitsCard } from "./CountryVisitsCard";
import { AdminSystemStatusCard } from "./AdminSystemStatusCard";
import { BackupCenter } from "./BackupCenter";
// import AdminHeaderBanner from "./AdminHeaderBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Shield, Key, BookOpen, Eye, EyeOff, Tag, Video, Volume2, AlertTriangle, ArrowUp, Database, HardDrive, Monitor, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { BUILD_ID } from "@/utils/buildInfo";

interface StoryCounts {
  all: number;
  published: number;
  newStories: number;
  unpublished: number;
  categories: Record<string, number>;
  videos: number;
  audio: number;
}

const AdminOverview = () => {
  const { userRole, isViewer } = useUserRole();

  // Smooth scroll to section with header offset
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 72; // Account for sticky header + submenu
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Define submenu items (only show if section is visible to user)
  const submenuItems = [
    { id: 'visits', label: 'Visits', icon: Eye, show: true },
    { id: 'backup', label: 'Backup', icon: Database, show: true },
    { id: 'sysstat', label: 'SysStat', icon: Monitor, show: true },
    { id: 'secaud', label: 'SecAud', icon: Shield, show: true },
    { id: 'systls', label: 'SysTls', icon: Wrench, show: !isViewer },
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Admin Header Banner - temporarily commented out */}
      {/* <AdminHeaderBanner /> */}
      
      {/* Sticky Submenu */}
      <div className="sticky top-16 z-40 bg-amber-50/95 backdrop-blur-sm border-b border-amber-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {submenuItems.filter(item => item.show).map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                variant="outline"
                size="sm"
                className="flex-shrink-0 rounded-full px-4 py-2 bg-white hover:bg-amber-100 border-amber-300 hover:border-amber-400 text-amber-800 hover:text-amber-900 shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '21px',
                  fontWeight: 'bold',
                  borderWidth: '3px'
                }}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {isViewer && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Read-Only Access</span>
          </div>
        )}

        {/* Section 1: Site Visits by Month */}
        <section id="visits">
          <Card className="mb-6 border-red-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Eye className="h-5 w-5" />
                Site Visits by Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyVisitsCard />
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Site Visits by Location */}
        <section id="locations">
          <Card className="mb-6 border-blue-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Eye className="h-5 w-5" />
                Site Visits by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CountryVisitsCard />
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Backup Management */}
        <section id="backup">
          <Card className="mb-6 border-yellow-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <HardDrive className="h-5 w-5" />
                Backup Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BackupCenter />
            </CardContent>
          </Card>
        </section>

        {/* Section 4: System Status */}
        <section id="sysstat">
          <Card className="mb-6 border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Monitor className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminSystemStatusCard />
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Security Audit */}
        <section id="secaud">
          <Card className="mb-6 border-green-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-green-700">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Audit
                </div>
                <div className="text-sm font-mono text-gray-500">
                  Build: {BUILD_ID}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedSecurityDashboard />
            </CardContent>
          </Card>
        </section>

        {/* Section 6: Security Management (no submenu button) */}
        {!isViewer && (
          <section id="secman">
            <Card className="mb-6 border-orange-500 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Key className="h-5 w-5" />
                  Security Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WebAuthnManager />
              </CardContent>
            </Card>
          </section>
        )}

        {/* Section 7: System Tools */}
        {!isViewer && (
          <section id="systls">
            <Card className="mb-6 border-indigo-500 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Settings className="h-5 w-5" />
                  System Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmergencyAdminTools />
              </CardContent>
            </Card>
          </section>
        )}
        
        {isViewer && (
          <Card className="mb-6 border-blue-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <AlertTriangle className="h-5 w-5" />
                Read-Only Access Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                You have viewer access to the admin dashboard. You can view all data but cannot make changes to stories, comments, or system settings.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating "Top & Menu" Bubble */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={scrollToTop}
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-orange-400 hover:border-orange-300"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            <span className="font-bold text-sm">Top & Menu</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default AdminOverview;