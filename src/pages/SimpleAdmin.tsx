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
                  <div>Stories management interface will go here</div>
                )}
                
                {currentSection === 'comments' && (
                  <div>Comments management interface will go here</div>
                )}
                
                {currentSection === 'deployment' && (
                  <div>Deployment tools will go here</div>
                )}
                
                {currentSection === 'voice-preview' && (
                  <div>Voice preview testing will go here</div>
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