
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateStoryForm, checkStoryCodeExists } from "./StoryFormValidation";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  video_url: string;
  published: string;
}

export const handleStorySubmission = async (
  formData: Story,
  story?: Story,
  onSave?: () => void
): Promise<void> => {
  console.log('Starting story submission...', { formData, story });
  console.log('Story content length:', formData.content?.length || 0);
  console.log('Story content preview:', formData.content?.substring(0, 200) + (formData.content?.length > 200 ? '...' : ''));
  
  // Validate form data (title now required)
  if (!validateStoryForm(formData)) {
    console.log('Form validation failed');
    return;
  }

  console.log('Form validation passed');

  // Check for duplicate story code
  const isDuplicate = await checkStoryCodeExists(formData.story_code, story?.id);
  if (isDuplicate) {
    console.log('Duplicate story code detected');
    toast.error("Story code already exists. Please choose a different code.");
    return;
  }

  console.log('Story code check passed');

  try {
    // Ensure only Supabase bucket URLs are saved for videos and clean timestamp fields
    const safeFormData: any = {
      ...formData,
      video_url: formData.video_url && formData.video_url.includes('supabase') 
        ? formData.video_url 
        : '' // Clear external URLs
    };

    // Convert empty string timestamps to null to avoid Postgres errors
    const timestampFields = ['audio_generated_at', 'born_date', 'died_date', 'created_at', 'updated_at'];
    timestampFields.forEach(field => {
      if (safeFormData[field] === '') {
        safeFormData[field] = null;
      }
    });

    if (story?.id) {
      // Update existing story
      console.log('Updating existing story with ID:', story.id);
      console.log('Update data:', safeFormData);
      const { error } = await supabase
        .from('stories')
        .update({
          ...safeFormData,
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      console.log('Story updated successfully!');
      toast.success("Story updated successfully!");
    } else {
      // Create new story
      console.log('Creating new story');
      console.log('Insert data:', safeFormData);
      const { error } = await supabase
        .from('stories')
        .insert([safeFormData]);
      
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      console.log('Story created successfully!');
      toast.success("Story created successfully!");
    }
    
    // Only call onSave after successful database operation
    console.log('Calling onSave callback...');
    onSave?.();
  } catch (error: any) {
    console.error('Error saving story:', error);
    
    if (error?.code === '23505' && error.constraint === 'stories_story_code_key') {
      toast.error("Story code already exists. Please use a different code.");
    } else if (error?.message) {
      toast.error(`Error saving story: ${error.message}`);
    } else {
      toast.error("Error saving story. Please try again.");
    }
    throw error;
  }
};
