
import { useState } from 'react';
import { useSimpleAdminAuth } from '@/components/admin/SimpleAdminAuth';

export const useAdminSession = () => {
  const { isAuthenticated } = useSimpleAdminAuth();
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
    // Scroll to top when returning to admin stories list
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleStoryFormCancel = () => {
    setShowStoryForm(false);
    setEditingStory(null);
    // Scroll to top when returning to admin stories list
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    isAuthenticated,
    showStoryForm,
    editingStory,
    handleEditStory,
    handleCreateStory,
    handleStoryFormSave,
    handleStoryFormCancel,
  };
};
