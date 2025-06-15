
import AdminHeader from "./AdminHeader";
import CreateStoryCard from "./CreateStoryCard";
import StoriesTable from "./StoriesTable";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";


interface AdminDashboardProps {
  onCreateStory: () => void;
  onEditStory: (story: any) => void;
}

const AdminDashboard = ({ onCreateStory, onEditStory }: AdminDashboardProps) => {
  return (
    <AdminLayout>
      <AdminHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <CreateStoryCard onCreateStory={onCreateStory} />
        <Link to="/admin/comments" className="no-underline">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manage Comments
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Comments Panel</div>
              <p className="text-xs text-muted-foreground">
                Approve, reject, and archive user comments.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <StoriesTable onEditStory={onEditStory} />
    </AdminLayout>
  );
};

export default AdminDashboard;
