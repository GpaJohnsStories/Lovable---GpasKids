
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export const useAdminSession = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleStoryFormSave = () => {
    // Invalidate and refetch stories data to show updated content
    queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
    queryClient.invalidateQueries({ queryKey: ['story-counts'] });
    
    // Check if this page was opened in a new tab
    const isNewTab = window.opener !== null;
    
    if (isNewTab) {
      // If opened in new tab, don't navigate - just show success toast
      toast.success("Story saved successfully! You can close this tab and refresh the admin list to see changes.", {
        duration: 6000,
      });
      console.log('=== SMART SAVE: New tab detected - staying on edit page ===');
    } else {
      // If opened directly, maintain existing behavior
      navigate('/buddys_admin/stories');
      
      // Scroll to top when returning to admin stories list
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      console.log('=== SMART SAVE: Direct navigation - returning to admin list ===');
    }
    
    console.log('=== UNIFIED STORY SYSTEM: STORIES CACHE INVALIDATED - DATA SHOULD REFRESH ===');
  };

  return {
    handleStoryFormSave,
  };
};
