import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield } from "lucide-react";
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