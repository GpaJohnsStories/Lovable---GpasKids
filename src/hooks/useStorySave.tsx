import { useState } from 'react';
import { toast } from "sonner";
import { adminClient } from "@/integrations/supabase/clients";

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
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  video_url: string;
  published: string;
}

export const useStorySave = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveStory = async (formData: Story, onSuccess?: () => void) => {
    console.log('=== STARTING SAVE OPERATION ===');
    
    // Basic validation
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

    setIsSaving(true);
    
    try {
      if (formData.id) {
        // Update existing story
        console.log('Updating story with ID:', formData.id);
        const { error } = await adminClient
          .from('stories')
          .update(formData)
          .eq('id', formData.id);
        
        if (error) throw error;
        toast.success("Story updated successfully!");
      } else {
        // Create new story
        console.log('Creating new story');
        const { error } = await adminClient
          .from('stories')
          .insert([formData]);
        
        if (error) throw error;
        toast.success("Story created successfully!");
      }
      
      onSuccess?.();
      return true;
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(`Error saving story: ${error.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveStory,
    isSaving
  };
};