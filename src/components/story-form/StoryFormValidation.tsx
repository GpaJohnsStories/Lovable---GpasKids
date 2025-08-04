
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  published: string;
  book_title?: string;
  chapter_number?: number;
  chapter_title?: string;
}

export const validateStoryForm = (formData: Story): boolean => {
  console.log('Validating story form...', formData);
  
  if (!formData.title.trim()) {
    console.log('Title validation failed');
    toast.error("Title is required");
    return false;
  }

  if (!formData.story_code.trim()) {
    console.log('Story code validation failed');
    toast.error("Story code is required");
    return false;
  }

  if (!formData.content.trim()) {
    console.log('Content validation failed');
    toast.error("Story content is required");
    return false;
  }

  console.log('All validations passed');
  return true;
};

export const checkStoryCodeExists = async (storyCode: string, excludeId?: string): Promise<boolean> => {
  let query = supabase
    .from('stories')
    .select('id')
    .eq('story_code', storyCode.trim())
    .limit(1);

  // Exclude current story when editing
  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error checking story code:', error);
    throw error;
  }

  return data && data.length > 0;
};
