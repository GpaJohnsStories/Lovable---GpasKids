
import { useQueryClient } from '@tanstack/react-query';

export const useAdminSession = () => {
  const queryClient = useQueryClient();

  const handleStoryFormSave = () => {
    // Invalidate and refetch stories data to show updated content
    queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
    queryClient.invalidateQueries({ queryKey: ['story-counts'] });
    
    // Scroll to top when returning to admin stories list
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    console.log('=== STORIES CACHE INVALIDATED - DATA SHOULD REFRESH ===');
  };

  return {
    handleStoryFormSave,
  };
};
