
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
      <CreateStoryCard onCreateStory={onCreateStory} />
      <StoriesTable onEditStory={onEditStory} />
    </AdminLayout>
  );
};

export default AdminDashboard;
