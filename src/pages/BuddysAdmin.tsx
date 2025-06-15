
import { useState } from "react";
import StoryForm from "@/components/StoryForm";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import CreateStoryCard from "@/components/admin/CreateStoryCard";
import StoriesTable from "@/components/admin/StoriesTable";

const BuddysAdminContent = () => {
  const { isAuthenticated } = useAdminAuth();
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState<any>(null);

  const handleEditStory = (story: any) => {
    setEditingStory(story);
    setShowStoryForm(true);
  };

  const handleCreateStory = () => {
    setEditingStory(null);
    setShowStoryForm(true);
  };

  const handleStoryFormSave = () => {
    setShowStoryForm(false);
    setEditingStory(null);
  };

  const handleStoryFormCancel = () => {
    setShowStoryForm(false);
    setEditingStory(null);
  };

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (showStoryForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
        <div className="container mx-auto px-4">
          <StoryForm
            story={editingStory}
            onSave={handleStoryFormSave}
            onCancel={handleStoryFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
      <div className="container mx-auto px-4 py-8">
        <AdminHeader />
        <CreateStoryCard onCreateStory={handleCreateStory} />
        <StoriesTable onEditStory={handleEditStory} />
      </div>
    </div>
  );
};

const BuddysAdmin = () => {
  return (
    <AdminAuthProvider>
      <BuddysAdminContent />
    </AdminAuthProvider>
  );
};

export default BuddysAdmin;
