
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "System";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  published: string;
}

export const validateStoryForm = (formData: Story): boolean => {
  if (!formData.title.trim()) {
    toast.error("Title is required");
    return false;
  }

  if (!formData.story_code.trim()) {
    toast.error("Story code is required");
    return false;
  }

  if (!formData.content.trim()) {
    toast.error("Story content is required");
    return false;
  }

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
