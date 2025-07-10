import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import AdminPasswordChange from "./AdminPasswordChange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Key } from "lucide-react";

const AdminOverview = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Admin Dashboard
        </h1>
      </div>
      
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