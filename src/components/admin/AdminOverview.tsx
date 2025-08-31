import React, { useState, useEffect } from 'react';
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import WebAuthnManager from "./WebAuthnManager";
import { MonthlyVisitsCard } from "./MonthlyVisitsCard";
import { CountryVisitsCard } from "./CountryVisitsCard";
import { AdminSystemStatusCard } from "./AdminSystemStatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Key, BookOpen, Eye, EyeOff, Tag, Video, Volume2, AlertTriangle } from "lucide-react";
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
  const [storyCounts, setStoryCounts] = useState<StoryCounts>({
    all: 0,
    published: 0,
    newStories: 0,
    unpublished: 0,
    categories: {},
    videos: 0,
    audio: 0
  });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        // Placeholder data until we can resolve TypeScript issues
        setStoryCounts({
          all: 0,
          published: 0,
          newStories: 0,
          unpublished: 0,
          categories: { 'Fun': 0, 'Life': 0, 'North Pole': 0, 'World Changers': 0, 'WebText': 0 },
          videos: 0,
          audio: 0
        });
      } catch (error) {
        console.error('Error loading story counts:', error);
      }
    };

    loadCounts();
  }, []);

  return (
    <div className="space-y-6">
      {isViewer && (
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">Read-Only Access</span>
        </div>
      )}

      {/* System Status */}
      <AdminSystemStatusCard />

      {/* Security Audit - Wide box with green border */}
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
      
      {/* Monthly Site Visits - Wide box with red border */}
      <Card className="mb-6 border-red-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Eye className="h-5 w-5" />
            Monthly Site Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyVisitsCard />
        </CardContent>
      </Card>

      {/* Country Visits - Wide box with blue border */}
      <Card className="mb-6 border-blue-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Eye className="h-5 w-5" />
            Country Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CountryVisitsCard />
        </CardContent>
      </Card>
      
      {/* Story Statistics - Wide box with purple border */}
      <Card className="mb-6 border-purple-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <BookOpen className="h-5 w-5" />
            Story Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-600">
                {storyCounts?.all || 0}
              </div>
              <div className="text-xs text-blue-700 font-medium">Total Story Files</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
                <Eye className="h-4 w-4" />
                {storyCounts?.published || 0}
              </div>
              <div className="text-xs text-green-700 font-medium">Published</div>
            </div>
            <div className="text-center p-2 bg-yellow-200 rounded-lg border border-yellow-300">
              <div className="text-xl font-bold text-yellow-700">
                {storyCounts?.newStories || 0}
              </div>
              <div className="text-xs text-yellow-800 font-medium">New Stories</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <EyeOff className="h-4 w-4" />
                {storyCounts?.unpublished || 0}
              </div>
              <div className="text-xs text-orange-700 font-medium">Unpublished</div>
            </div>
          </div>
          
          {/* Category counts */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {['Fun', 'Life', 'North Pole', 'World Changers', 'WebText'].map((category) => {
              const getCategoryColors = (cat: string) => {
                switch (cat) {
                  case 'Fun':
                    return { bg: 'bg-blue-500', text: 'text-white' };
                  case 'Life':
                    return { bg: 'bg-green-500', text: 'text-white' };
                  case 'North Pole':
                    return { bg: 'bg-red-600', text: 'text-white' };
                  case 'World Changers':
                    return { bg: 'bg-amber-400', text: 'text-amber-900' };
                  case 'WebText':
                    return { bg: 'bg-gray-500', text: 'text-white' };
                  default:
                    return { bg: 'bg-gray-500', text: 'text-white' };
                }
              };
              const colors = getCategoryColors(category);
              return (
                <div key={category} className={`text-center p-1 ${colors.bg} rounded`}>
                  <div className={`text-lg font-bold ${colors.text} flex items-center justify-center gap-1`}>
                    <Tag className="h-3 w-3" />
                    {storyCounts?.categories?.[category] || 0}
                  </div>
                  <div className={`text-xs ${colors.text} font-medium`}>{category}</div>
                </div>
              );
            })}
          </div>
          
          {/* Media counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-xl font-bold text-indigo-600 flex items-center justify-center gap-1">
                <Video className="h-4 w-4" />
                {storyCounts?.videos || 0}
              </div>
              <div className="text-xs text-indigo-700 font-medium">With Videos</div>
            </div>
            <div className="text-center p-2 bg-teal-50 rounded-lg border border-teal-200">
              <div className="text-xl font-bold text-teal-600 flex items-center justify-center gap-1">
                <Volume2 className="h-4 w-4" />
                {storyCounts?.audio || 0}
              </div>
              <div className="text-xs text-teal-700 font-medium">With Audio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isViewer && (
        <>

          {/* Security Management - Wide box with orange border */}
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

          {/* System Tools - Wide box with blue border */}
          <Card className="mb-6 border-blue-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Settings className="h-5 w-5" />
                System Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmergencyAdminTools />
            </CardContent>
          </Card>
        </>
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
  );
};

export default AdminOverview;