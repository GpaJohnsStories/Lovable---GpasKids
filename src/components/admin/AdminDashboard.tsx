
import AdminHeader from "./AdminHeader";
import CreateStoryCard from "./CreateStoryCard";
import StoriesTable from "./StoriesTable";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityMigrationGuide from "./SecurityMigrationGuide";
import { Button } from "@/components/ui/button";
import { Volume2, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface AdminDashboardProps {
  onCreateStory: () => void;
  onEditStory: (story: any) => void;
}

const AdminDashboard = ({ onCreateStory, onEditStory }: AdminDashboardProps) => {
  const [showEmergencyTools, setShowEmergencyTools] = useState(false);
  const [showSecurityGuide, setShowSecurityGuide] = useState(true);

  return (
    <AdminLayout>
      <AdminHeader />
      
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
      
      <div className="my-6 flex gap-4">
        <CreateStoryCard onCreateStory={onCreateStory} />
        <div className="flex-1 space-y-2">
          <Link to="/admin/voice-preview">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Preview & Testing
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => setShowEmergencyTools(!showEmergencyTools)}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Emergency Tools
            </Button>
            <Button 
              onClick={() => setShowSecurityGuide(!showSecurityGuide)}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Security Guide
            </Button>
          </div>
        </div>
      </div>
      
      {showEmergencyTools && (
        <div className="mb-6">
          <EmergencyAdminTools />
        </div>
      )}
      
      <StoriesTable onEditStory={onEditStory} />
    </AdminLayout>
  );
};

export default AdminDashboard;
