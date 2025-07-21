
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayoutWithHeaderBanner from "./AdminLayoutWithHeaderBanner";
import AdminStoriesTable from "./AdminStoriesTable";
import { useUserRole } from "@/hooks/useUserRole";

const AdminStories = () => {
  const { isViewer } = useUserRole();
  const navigate = useNavigate();

  const handleCreateStory = () => {
    console.log('🎯 AdminStories: handleCreateStory called - navigating to create form');
    navigate('/buddys_admin/stories/new');
  };

  const handleEditStory = (story: any) => {
    console.log('🎯 AdminStories: handleEditStory called with story:', story.id, story.title);
    
    // Store current context in sessionStorage for restoration
    const currentContext = {
      scrollPosition: window.pageYOffset,
      timestamp: Date.now(),
      returnUrl: window.location.pathname + window.location.search
    };
    sessionStorage.setItem('admin-edit-context', JSON.stringify(currentContext));
    
    // Open edit page in a new tab
    const editUrl = `/buddys_admin/stories/edit/${story.id}`;
    window.open(editUrl, '_blank');
  };

  const handleEditBio = (authorName: string) => {
    // TODO: Implement bio edit functionality
    console.log('Edit bio for author:', authorName);
  };

  return (
    <AdminLayoutWithHeaderBanner>
      <div className="space-y-4">
        <AdminStoriesTable
          onEditStory={handleEditStory}
          onCreateStory={handleCreateStory}
          showActions={!isViewer}
          onEditBio={handleEditBio}
        />
      </div>
    </AdminLayoutWithHeaderBanner>
  );
};

export default AdminStories;
