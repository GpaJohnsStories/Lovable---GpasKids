import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Settings, Shield, FileText, MessageSquare, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminOverview = () => {
  const [showEmergencyTools, setShowEmergencyTools] = useState(false);
  const [showSecurityAudit, setShowSecurityAudit] = useState(false);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your website content and settings</p>
      </div>
      
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-orange-600" />
              Manage Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Add, edit, and organize your stories</p>
            <Link to="/buddys_admin/stories">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Go to Stories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-yellow-600" />
              Manage Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Review and moderate user comments</p>
            <Link to="/buddys_admin/comments">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                Go to Comments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Volume2 className="h-5 w-5 text-purple-600" />
              Voice Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Test story narration voices</p>
            <Link to="/buddys_admin/voice-preview">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Go to Voice Preview
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowEmergencyTools(!showEmergencyTools)}
              variant="outline"
              className="w-full mb-2"
            >
              {showEmergencyTools ? 'Hide' : 'Show'} Emergency Tools
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowSecurityAudit(!showSecurityAudit)}
              variant="outline"
              className="w-full mb-2 text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              {showSecurityAudit ? 'Hide' : 'Show'} Security Audit
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {showEmergencyTools && (
        <div className="mb-6">
          <EmergencyAdminTools />
        </div>
      )}

      {showSecurityAudit && (
        <div className="mb-6 space-y-6">
          <AdvancedSecurityDashboard />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOverview;