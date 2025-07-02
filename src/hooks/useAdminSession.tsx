
import { useState } from 'react';
import { useDualAdminAuth } from '@/components/admin/DualAdminAuthProvider';

export const useAdminSession = () => {
  const { isAuthenticated } = useDualAdminAuth();
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
