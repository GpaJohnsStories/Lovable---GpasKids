import { useStorySave } from '@/hooks/useStorySave';
import type { Story } from '@/hooks/useStoryFormState';

export const useStoryFormActions = (
  storyId?: string,
  refetchStory?: () => Promise<any>,
  onSave?: () => void
) => {
  const { saveStory, isSaving } = useStorySave();

  const handleSaveOnly = async (formData: Story) => {
    const timestamp = new Date().toISOString();
    console.log(`=== SAVE ONLY (Ctrl+S) AT ${timestamp} ===`);
    console.log('❗ SAVE ONLY TRIGGERED - Check if this is being called repeatedly');
    try {
      const success = await saveStory(formData, async () => {
        console.log('=== SAVE SUCCESSFUL - REFRESHING DATA ===');
        // Refresh the story data to show updated timestamps
        if (refetchStory) {
          await refetchStory();
          console.log('=== REFETCH COMPLETED - TIMESTAMP SHOULD BE UPDATED ===');
        }
        // Don't call onSave() - just stay on the edit page
      });
      
      if (success) {
        console.log('=== SAVE SUCCESSFUL (stayed on page) ===');
      }
    } catch (error) {
      console.error('Error in handleSaveOnly:', error);
    }
  };

  const handleSubmit = async (formData: Story) => {
    const timestamp = new Date().toISOString();
    console.log(`=== FORM SUBMITTED AT ${timestamp} ===`);
    console.log('❗ FORM SUBMIT TRIGGERED - Check if this is being called repeatedly');
    console.log('Form data at submission:', formData);
    console.log('Story ID:', storyId);
    console.log('onSave callback:', typeof onSave);
    
    try {
      console.log('About to call saveStory...');
      const success = await saveStory(formData, async () => {
        console.log('=== SAVE SUCCESSFUL - REFRESHING DATA ===');
        // Refresh the story data to show updated content
        if (refetchStory) {
          await refetchStory();
          console.log('=== REFETCH COMPLETED - TIMESTAMP SHOULD BE UPDATED ===');
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