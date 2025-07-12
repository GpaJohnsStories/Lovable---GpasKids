import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import SimpleAdminLogin from "@/components/admin/SimpleAdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const SimpleAdmin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

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
      {!isLoggedIn ? (
        <SimpleAdminLogin onSuccess={handleLoginSuccess} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          <AdminDashboard onCreateStory={handleCreateStory} onEditStory={handleEditStory} />
        </div>
      )}
    </div>
  );
};

export default SimpleAdmin;