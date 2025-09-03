import { useStorySave } from '@/hooks/useStorySave';
import type { Story } from '@/hooks/useStoryFormState';

export const useStoryFormActions = (
  storyId?: string,
  refetchStory?: () => Promise<any>,
  onSave?: () => void,
  updateFormData?: (updates: Partial<Story>) => void
) => {
  const { saveStory, isSaving } = useStorySave();

  const handleSaveOnly = async (formData: Story) => {
    const timestamp = new Date().toISOString();
    console.log(`=== SAVE ONLY (Ctrl+S) AT ${timestamp} ===`);
    console.log('❗ SAVE ONLY TRIGGERED - Check if this is being called repeatedly');
    try {
      const result = await saveStory(formData, async () => {
        console.log('=== SAVE SUCCESSFUL - REFRESHING DATA ===');
        // Refresh the story data to show updated timestamps
        if (refetchStory) {
          await refetchStory();
          console.log('=== REFETCH COMPLETED - TIMESTAMP SHOULD BE UPDATED ===');
        }
        // Don't call onSave() - just stay on the edit page
      });
      
      // If this was a new story creation, update the form with the new ID
      if (result && result.success && result.story && !formData.id && updateFormData) {
        console.log('=== BINDING NEW STORY ID TO FORM ===', result.story.id);
        updateFormData({ id: result.story.id });
      }
      
      if (result && result.success) {
        console.log('=== SAVE SUCCESSFUL (stayed on page) ===');
      }
    } catch (error) {
      console.error('Error in handleSaveOnly:', error);
    }
  };

  const handleSubmit = async (formData: Story, customOnSave?: () => void | Promise<void>) => {
    const timestamp = new Date().toISOString();
    console.log(`=== FORM SUBMITTED AT ${timestamp} ===`);
    console.log('❗ FORM SUBMIT TRIGGERED - Check if this is being called repeatedly');
    console.log('Form data at submission:', formData);
    console.log('Story ID:', storyId);
    console.log('onSave callback:', typeof onSave);
    console.log('customOnSave callback:', typeof customOnSave);
    
    try {
      console.log('About to call saveStory...');
      const result = await saveStory(formData, async () => {
        console.log('=== SAVE SUCCESSFUL - REFRESHING DATA ===');
        // Refresh the story data to show updated content
        if (refetchStory) {
          await refetchStory();
          console.log('=== REFETCH COMPLETED - TIMESTAMP SHOULD BE UPDATED ===');
        }
        
        // Use customOnSave if provided, otherwise use the default onSave
        if (customOnSave) {
          await customOnSave();
          console.log('=== CUSTOM ONSAVE COMPLETED ===');
        } else if (onSave) {
          onSave(); // Navigate back to admin list
        }
      });
      console.log('saveStory returned:', result);
      
      // If this was a new story creation, update the form with the new ID
      if (result && result.success && result.story && !formData.id && updateFormData) {
        console.log('=== BINDING NEW STORY ID TO FORM ===', result.story.id);
        updateFormData({ id: result.story.id });
      }
      
      if (result && result.success) {
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