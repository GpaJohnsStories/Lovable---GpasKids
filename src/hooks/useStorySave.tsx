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
    console.log('Form data received:', formData);
    console.log('Story ID:', formData.id);
    console.log('Admin client:', adminClient);
    
    // Basic validation
    if (!formData.title.trim()) {
      console.log('Validation failed: Title required');
      toast.error("Title is required");
      return false;
    }
    if (!formData.story_code.trim()) {
      console.log('Validation failed: Story code required');
      toast.error("Story code is required");
      return false;
    }
    if (!formData.content.trim()) {
      console.log('Validation failed: Content required');
      toast.error("Story content is required");
      return false;
    }

    console.log('Validation passed, setting loading state...');
    setIsSaving(true);
    
    try {
      if (formData.id) {
        // Update existing story
        console.log('Updating story with ID:', formData.id);
        console.log('Update payload:', formData);
        
        const { data, error } = await adminClient
          .from('stories')
          .update(formData)
          .eq('id', formData.id)
          .select();
        
        console.log('Update response - data:', data, 'error:', error);
        
        if (error) throw error;
        toast.success("Story updated successfully!");
      } else {
        // Create new story
        console.log('Creating new story');
        console.log('Insert payload:', formData);
        
        const { data, error } = await adminClient
          .from('stories')
          .insert([formData])
          .select();
        
        console.log('Insert response - data:', data, 'error:', error);
        
        if (error) throw error;
        toast.success("Story created successfully!");
      }
      
      console.log('About to call onSuccess callback...');
      onSuccess?.();
      console.log('onSuccess callback completed');
      return true;
    } catch (error: any) {
      console.error('Save error details:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      toast.error(`Error saving story: ${error.message}`);
      return false;
    } finally {
      console.log('Setting loading state to false...');
      setIsSaving(false);
    }
  };

  return {
    saveStory,
    isSaving
  };
};