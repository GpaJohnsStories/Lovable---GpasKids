import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import AdminHeaderBanner from "@/components/admin/AdminHeaderBanner";
import SimpleAdminLogin from "@/components/admin/SimpleAdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAdminSession } from "@/hooks/useAdminSession";
import AdminStoryForm from "@/components/admin/AdminStoryForm";

const SimpleAdmin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { showStoryForm, editingStory, handleCreateStory, handleEditStory, handleStoryFormSave, handleStoryFormCancel } = useAdminSession();
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {!isLoggedIn && <WelcomeHeader />}
      {!isLoggedIn ? (
        <SimpleAdminLogin onSuccess={handleLoginSuccess} />
      ) : (
        <>
          {showStoryForm ? (
            <AdminStoryForm 
              editingStory={editingStory}
              onSave={handleStoryFormSave}
              onCancel={handleStoryFormCancel}
            />
          ) : (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
              <AdminHeaderBanner />
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimpleAdmin;