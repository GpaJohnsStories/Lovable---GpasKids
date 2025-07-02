
import AdminHeader from "./AdminHeader";
import CreateStoryCard from "./CreateStoryCard";
import StoriesTable from "./StoriesTable";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import { Button } from "@/components/ui/button";
import { Volume2, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface AdminDashboardProps {
  onCreateStory: () => void;
  onEditStory: (story: any) => void;
}

const AdminDashboard = ({ onCreateStory, onEditStory }: AdminDashboardProps) => {
  const [showEmergencyTools, setShowEmergencyTools] = useState(false);

  return (
    <AdminLayout>
      <AdminHeader />
      
      <div className="my-6 flex gap-4">
        <CreateStoryCard onCreateStory={onCreateStory} />
        <div className="flex-1 space-y-2">
          <Link to="/admin/voice-preview">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Preview & Testing
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
