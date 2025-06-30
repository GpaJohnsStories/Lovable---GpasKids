
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateStoryForm, checkStoryCodeExists } from "./StoryFormValidation";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
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
  // Validate form data
  if (!validateStoryForm(formData)) {
    return;
  }

  // Check for duplicate story code
  const isDuplicate = await checkStoryCodeExists(formData.story_code, story?.id);
  if (isDuplicate) {
    toast.error("Story code already exists. Please choose a different code.");
    return;
  }

  try {
    if (story?.id) {
      // Update existing story
      const { error } = await supabase
        .from('stories')
        .update(formData)
        .eq('id', story.id);
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      toast.success("Story updated successfully!");
    } else {
      // Create new story
      const { error } = await supabase
        .from('stories')
        .insert([formData]);
      
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      toast.success("Story created successfully!");
    }
    
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
