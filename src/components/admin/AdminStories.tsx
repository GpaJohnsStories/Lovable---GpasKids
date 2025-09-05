
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AdminStoriesTable from "./AdminStoriesTable";

import { useUserRole } from "@/hooks/useUserRole";
import { devLog } from "@/utils/devLog";

const AdminStories = () => {
  const { isViewer } = useUserRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateStory = () => {
    devLog.info('🎯 AdminStories: Creating new story - navigating to super-text');
    navigate('/buddys_admin/super-text');
  };

  const handleEditStory = (story: any) => {
    devLog.info('🎯 AdminStories: Editing story via super-text:', story.id, story.title, 'code:', story.story_code);
    
    // Open super-text in new tab with story code, category, and publication status
    const editUrl = `/buddys_admin/super-text?story_code=${encodeURIComponent(story.story_code || '')}&category=${encodeURIComponent(story.category || '')}&publication_status_code=${story.publication_status_code || 5}`;
    window.open(editUrl, '_blank');
  };


  return (
    <>
      <Helmet><title>Library</title></Helmet>
      <div className="space-y-4">
      <AdminStoriesTable
        onEditStory={handleEditStory}
        onCreateStory={handleCreateStory}
        showActions={!isViewer}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      </div>
    </>
  );
};

export default AdminStories;
