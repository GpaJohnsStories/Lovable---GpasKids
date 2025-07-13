import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "System" | "STORY";
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
    console.log('Supabase client:', supabase);
    
    // Check admin session and RLS function
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session:', session);
    console.log('Session error:', sessionError);
    
    // Test admin function
    const { data: isAdminResult, error: adminError } = await supabase.rpc('is_admin_safe');
    console.log('is_admin_safe result:', isAdminResult);
    console.log('Admin check error:', adminError);
    
    // Check current user profile
    if (session?.session?.user?.id) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.session.user.id)
        .single();
      console.log('Current user profile:', profile);
      console.log('Profile error:', profileError);
    }
    
    // Check if story exists
    if (formData.id) {
      const { data: existingStory, error: fetchError } = await supabase
        .from('stories')
        .select('id, title, updated_at')
        .eq('id', formData.id)
        .single();
      console.log('Existing story check:', existingStory);
      console.log('Fetch error:', fetchError);
    }
    
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
        
        const { data, error } = await supabase
          .from('stories')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id)
          .select();
        
        console.log('Update response - data:', data, 'error:', error);
        
        if (error) throw error;
        toast.success("Story updated successfully!");
      } else {
        // Create new story
        console.log('Creating new story');
        console.log('Insert payload:', formData);
        
        const { data, error } = await supabase
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