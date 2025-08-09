
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminStoriesTable from "./AdminStoriesTable";
import AuthorBiosTable from "./AuthorBiosTable";
import { useUserRole } from "@/hooks/useUserRole";

const AdminStories = () => {
  const { isViewer } = useUserRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateStory = () => {
    console.log('🎯 AdminStories: Creating new story - navigating to unified story system');
    navigate('/buddys_admin/unified_story_system/add');
  };

  const handleEditStory = (story: any) => {
    console.log('🎯 AdminStories: Editing story via unified system:', story.id, story.title);
    
    // Store current context for potential restoration
    const currentContext = {
      scrollPosition: window.pageYOffset,
      timestamp: Date.now(),
      returnUrl: window.location.pathname + window.location.search
    };
    sessionStorage.setItem('admin-edit-context', JSON.stringify(currentContext));
    
    // Navigate to unified story system for editing
    const editUrl = `/buddys_admin/unified_story_system/update/${story.id}`;
    window.open(editUrl, '_blank');
  };

  const handleCreateBio = () => {
    console.log('🎯 AdminStories: Creating new author bio');
    navigate('/buddys_admin/author-bios/add');
  };

  const handleEditBio = (bio: any) => {
    console.log('🎯 AdminStories: Editing author bio:', bio.id, bio.author_name);
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </div>
  );
};

export default AdminStories;
