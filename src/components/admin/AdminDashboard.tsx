
import StoriesTable from "./StoriesTable";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import EncryptionStatusCard from "./EncryptionStatusCard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import PrivilegedAdminManager from "./PrivilegedAdminManager";

import EdgeFunctionAuthTest from "./EdgeFunctionAuthTest";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Shield, Settings, Users, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BUILD_ID } from "@/utils/buildInfo";

interface AdminDashboardProps {
  onCreateStory: () => void;
  onEditStory: (story: any) => void;
}

const AdminDashboard = ({ onCreateStory, onEditStory }: AdminDashboardProps) => {
  const [showEmergencyTools, setShowEmergencyTools] = useState(false);
  const [showSecurityAudit, setShowSecurityAudit] = useState(false);
  const [showAdminManager, setShowAdminManager] = useState(false);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black font-system">
          Manage Stories
        </h1>
        
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Code className="h-4 w-4" />
              <span className="font-medium">Current Build Version:</span>
              <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                {BUILD_ID}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="my-6 flex gap-4">
        <div className="flex-1 space-y-2">
          <Link to="/buddys_admin/voice-preview">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voices
            </Button>
          </Link>
          <Button 
            onClick={() => setShowEmergencyTools(!showEmergencyTools)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Emergency Tools
          </Button>
          <Button 
            onClick={() => setShowSecurityAudit(!showSecurityAudit)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Shield className="h-4 w-4" />
            Security Audit Dashboard
          </Button>
          <Button 
            onClick={() => setShowAdminManager(!showAdminManager)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
          >
            <Users className="h-4 w-4" />
            Admin Management
          </Button>
        </div>
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

      {showAdminManager && (
        <div className="mb-6">
          <PrivilegedAdminManager />
        </div>
      )}

      <div className="mb-6">
        <EdgeFunctionAuthTest />
      </div>
      
      <StoriesTable onEditStory={onEditStory} />
    </AdminLayout>
  );
};

export default AdminDashboard;
