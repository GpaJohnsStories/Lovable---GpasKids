
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
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
    navigate(`/buddys_admin/stories/edit/${story.id}`);
  };

  const handleEditBio = (authorName: string) => {
    // TODO: Implement bio edit functionality
    console.log('Edit bio for author:', authorName);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <AdminStoriesTable
          onEditStory={handleEditStory}
          onCreateStory={handleCreateStory}
          showActions={!isViewer}
          onEditBio={handleEditBio}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminStories;
