
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useAdminSession = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleStoryFormSave = () => {
    // Invalidate and refetch stories data to show updated content
    queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
    queryClient.invalidateQueries({ queryKey: ['story-counts'] });
    
    // Navigate back to admin stories list using the unified system
    navigate('/buddys_admin/stories');
    
    // Scroll to top when returning to admin stories list
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    console.log('=== UNIFIED STORY SYSTEM: STORIES CACHE INVALIDATED - DATA SHOULD REFRESH ===');
  };

  return {
    handleStoryFormSave,
  };
};
