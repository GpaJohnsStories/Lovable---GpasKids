
import AdminHeader from "./AdminHeader";
import CreateStoryCard from "./CreateStoryCard";
import StoriesTable from "./StoriesTable";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminDashboardProps {
  onCreateStory: () => void;
  onEditStory: (story: any) => void;
}

const AdminDashboard = ({ onCreateStory, onEditStory }: AdminDashboardProps) => {
  return (
    <AdminLayout>
      <AdminHeader />
      <div className="my-6 flex gap-4">
        <CreateStoryCard onCreateStory={onCreateStory} />
        <div className="flex-1">
          <Link to="/admin/voice-preview">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Preview & Testing
            </Button>
          </Link>
        </div>
      </div>
      <StoriesTable onEditStory={onEditStory} />
    </AdminLayout>
  );
};

export default AdminDashboard;
