import { useStorySave } from '@/hooks/useStorySave';
import type { Story } from '@/hooks/useStoryFormState';

export const useStoryFormActions = (
  storyId?: string,
  refetchStory?: () => Promise<any>,
  onSave?: () => void
) => {
  const { saveStory, isSaving } = useStorySave();

  const handleSaveOnly = async (formData: Story) => {
    console.log('=== SAVE ONLY (Ctrl+S) ===');
    try {
      const success = await saveStory(formData, async () => {
        console.log('=== SAVE SUCCESSFUL - REFRESHING DATA ===');
        // Refresh the story data to show updated content
        if (storyId && refetchStory) {
          await refetchStory();
        }
        // Don't call onSave() here - stay on the edit page
      });
      
      if (success) {
        console.log('=== SAVE SUCCESSFUL (stayed on page) ===');
      }
    } catch (error) {
      console.error('Error in handleSaveOnly:', error);
    }
  };

  const handleSubmit = async (formData: Story) => {
    console.log('=== FORM SUBMITTED ===');
    console.log('Form data at submission:', formData);
    console.log('Story ID:', storyId);
    console.log('onSave callback:', typeof onSave);
    
    try {
      console.log('About to call saveStory...');
      const success = await saveStory(formData, async () => {
        console.log('=== SAVE SUCCESSFUL - REFRESHING DATA ===');
        // Refresh the story data to show updated content
        if (storyId && refetchStory) {
          await refetchStory();
        }
        if (onSave) {
          onSave(); // Navigate back to admin list
        }
      });
      console.log('saveStory returned:', success);
      
      if (success) {
        console.log('=== SAVE SUCCESSFUL ===');
      } else {
        console.log('=== SAVE FAILED ===');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return {
    handleSaveOnly,
    handleSubmit,
    isSaving
  };
};