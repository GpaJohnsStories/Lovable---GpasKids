import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import AdminPasswordChange from "./AdminPasswordChange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Key, BookOpen, Eye, EyeOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminClient } from "@/integrations/supabase/clients";

const AdminOverview = () => {
  const { data: storyCounts } = useQuery({
    queryKey: ['story-counts'],
    queryFn: async () => {
      const [allResult, publishedResult, unpublishedResult] = await Promise.all([
        adminClient.from('stories').select('id', { count: 'exact', head: true }),
        adminClient.from('stories').select('id', { count: 'exact', head: true }).eq('published', 'Y'),
        adminClient.from('stories').select('id', { count: 'exact', head: true }).eq('published', 'N')
      ]);

      return {
        all: allResult.count || 0,
        published: publishedResult.count || 0,
        unpublished: unpublishedResult.count || 0
      };
    },
  });

  return (
    <AdminLayout>
      <div className="mb-0">
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Admin Dashboard
        </h1>
      </div>
      
      {/* Security Audit - Wide box with green border */}
      <Card className="mb-6 border-green-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Shield className="h-5 w-5" />
            Security Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedSecurityDashboard />
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
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {storyCounts?.all || 0}
              </div>
              <div className="text-sm text-blue-700 font-medium">Total Stories</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <Eye className="h-5 w-5" />
                {storyCounts?.published || 0}
              </div>
              <div className="text-sm text-green-700 font-medium">Published</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <EyeOff className="h-5 w-5" />
                {storyCounts?.unpublished || 0}
              </div>
              <div className="text-sm text-orange-700 font-medium">Unpublished</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management - Wide box with orange border */}
      <Card className="mb-6 border-orange-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Key className="h-5 w-5" />
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminPasswordChange />
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
    </AdminLayout>
  );
};

export default AdminOverview;