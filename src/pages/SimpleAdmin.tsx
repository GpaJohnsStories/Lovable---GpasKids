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
                {/* Render AdminDashboard content directly without AdminLayout wrapper */}
                <div className="my-6 flex gap-4">
                  <div className="w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <h2 className="text-xl font-bold mb-4 text-blue-600">Create New Story</h2>
                      <button 
                        onClick={handleCreateStory}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                      >
                        Create Story
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2">
                      Voice Preview & Testing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimpleAdmin;