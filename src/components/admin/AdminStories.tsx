
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminStoriesTable from "./AdminStoriesTable";
import AuthorBiosTable from "./AuthorBiosTable";
import { useUserRole } from "@/hooks/useUserRole";

const AdminStories = () => {
  const { isViewer } = useUserRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');

  const handleCreateStory = () => {
    console.log('🎯 AdminStories: handleCreateStory called - navigating to unified story system');
    navigate('/buddys_admin/unified_story_system/add');
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
    
    // Open edit page in a new tab using the unified story system
    const editUrl = `/buddys_admin/unified_story_system/update/${story.id}`;
    window.open(editUrl, '_blank');
  };

  const handleCreateBio = () => {
    console.log('🎯 AdminStories: handleCreateBio called');
    navigate('/buddys_admin/author-bios/add');
  };

  const handleEditBio = (bio: any) => {
    console.log('🎯 AdminStories: handleEditBio called with bio:', bio.id, bio.author_name);
    navigate(`/buddys_admin/author-bios/edit/${bio.id}`);
  };

  return (
    <div className="space-y-4">
      {view === 'bios' ? (
        <AuthorBiosTable
          onEditBio={handleEditBio}
          onCreateBio={handleCreateBio}
        />
      ) : (
        <AdminStoriesTable
          onEditStory={handleEditStory}
          onCreateStory={handleCreateStory}
          showActions={!isViewer}
          onEditBio={handleEditBio}
        />
      )}
    </div>
  );
};

export default AdminStories;
