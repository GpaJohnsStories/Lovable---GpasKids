import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import AdminHeaderBanner from "@/components/admin/AdminHeaderBanner";
import SimpleAdminLogin from "@/components/admin/SimpleAdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import StoriesTable from "@/components/admin/StoriesTable";
import CommentsDashboard from "@/components/admin/CommentsDashboard";
import StaticDeploymentSystem from "@/components/admin/StaticDeploymentSystem";
import { useAdminSession } from "@/hooks/useAdminSession";
import AdminStoryForm from "@/components/admin/AdminStoryForm";

const SimpleAdmin = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard'); // dashboard, stories, comments, deployment, voice-preview
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
              <AdminHeaderBanner onSectionChange={setCurrentSection} currentSection={currentSection} />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">
                  {currentSection === 'dashboard' && 'Admin Dashboard'}
                  {currentSection === 'stories' && 'Stories Management'}
                  {currentSection === 'comments' && 'Comments Management'}
                  {currentSection === 'deployment' && 'Deployment Tools'}
                  {currentSection === 'voice-preview' && 'Voice Preview & Testing'}
                </h1>
                
                {currentSection === 'dashboard' && (
                  <AdminDashboard onCreateStory={handleCreateStory} onEditStory={handleEditStory} />
                )}
                
                {currentSection === 'stories' && (
                  <StoriesTable onEditStory={handleEditStory} />
                )}
                
                {currentSection === 'comments' && (
                  <CommentsDashboard />
                )}
                
                {currentSection === 'deployment' && (
                  <StaticDeploymentSystem />
                )}
                
                {currentSection === 'voice-preview' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Voice Preview & Testing</h2>
                    <p className="text-gray-600 mb-4">Test different voices and preview story audio generation.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Test Text:</label>
                        <textarea 
                          className="w-full p-3 border rounded-lg" 
                          rows={4}
                          placeholder="Enter text to preview with different voices..."
                        />
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded">
                        Generate Preview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimpleAdmin;