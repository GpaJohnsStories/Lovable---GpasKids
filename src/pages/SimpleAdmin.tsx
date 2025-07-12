import { useNavigate } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import AdminDashboard from "@/components/admin/AdminDashboard";

const SimpleAdmin = () => {
  const navigate = useNavigate();

  const handleCreateStory = () => {
    // Navigate to admin dashboard with story creation
    navigate('/buddys_admin/dashboard');
  };

  const handleEditStory = (story: any) => {
    // Navigate to admin dashboard with story editing
    navigate('/buddys_admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <AdminDashboard onCreateStory={handleCreateStory} onEditStory={handleEditStory} />
      </div>
    </div>
  );
};

export default SimpleAdmin;