
import AdminHeader from "./AdminHeader";
import CreateStoryCard from "./CreateStoryCard";
import StoriesTable from "./StoriesTable";
import AdminLayout from "./AdminLayout";

interface AdminDashboardProps {
  onCreateStory: () => void;
  onEditStory: (story: any) => void;
}

const AdminDashboard = ({ onCreateStory, onEditStory }: AdminDashboardProps) => {
  return (
    <AdminLayout>
      <AdminHeader />
      <div className="my-6">
        <CreateStoryCard onCreateStory={onCreateStory} />
      </div>
      <StoriesTable onEditStory={onEditStory} />
    </AdminLayout>
  );
};

export default AdminDashboard;
