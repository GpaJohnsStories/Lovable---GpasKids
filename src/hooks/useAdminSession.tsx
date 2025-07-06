
import { useState } from 'react';
import { useSupabaseAdminAuth } from '@/components/admin/SupabaseAdminAuth';
import { useQueryClient } from '@tanstack/react-query';

export const useAdminSession = () => {
  const { isAuthenticated, isAdmin } = useSupabaseAdminAuth();
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState<any>(null);
  const queryClient = useQueryClient();

  const handleEditStory = (story: any) => {
    setEditingStory(story);
    setShowStoryForm(true);
  };

  const handleCreateStory = () => {
    setEditingStory(null);
    setShowStoryForm(true);
  };

  const handleStoryFormSave = () => {
    // Invalidate and refetch stories data to show updated content
    queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
    queryClient.invalidateQueries({ queryKey: ['story-counts'] });
    
    setShowStoryForm(false);
    setEditingStory(null);
    // Scroll to top when returning to admin stories list
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    console.log('=== STORIES CACHE INVALIDATED - DATA SHOULD REFRESH ===');
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
    isAdmin,
    showStoryForm,
    editingStory,
    handleEditStory,
    handleCreateStory,
    handleStoryFormSave,
    handleStoryFormCancel,
  };
};
