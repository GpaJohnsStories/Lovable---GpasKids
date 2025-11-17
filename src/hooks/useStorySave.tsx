
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "Admin";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_link_4: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  photo_alt_4: string;
  video_url: string;
  ai_voice_name?: string;
  ai_voice_model?: string;
  audio_url?: string;
  publication_status_code?: number;
}

export const useStorySave = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveStory = async (formData: Story, onSuccess?: () => void) => {
    const timestamp = new Date().toISOString();
    console.log(`=== STARTING SAVE OPERATION AT ${timestamp} ===`);
    console.log('❗ SAVE TRIGGERED - Check if this is being called repeatedly every 5 seconds');
    console.log('Form data received:', formData);
    console.log('Story ID:', formData.id);
    console.log('Story Code:', formData.story_code);
    console.log('Publication Status Code:', formData.publication_status_code);
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
    
    // Publication status validation - convert to number and check if valid (0-4)
    const statusCode = Number(formData.publication_status_code);
    if (isNaN(statusCode) || statusCode >= 5) {
      console.log('Validation failed: Publication status required');
      toast.error("Set Publication Code Before Save");
      return false;
    }

    console.log('Validation passed, setting loading state...');
    setIsSaving(true);
    
    try {
      const saveData: any = {
        ...formData,
        ai_voice_name: formData.ai_voice_name || 'Nova',
        ai_voice_model: formData.ai_voice_model || 'tts-1',
        publication_status_code: formData.publication_status_code
      };
      
      // Remove google_drive_link if it exists (column was removed from database)
      delete saveData.google_drive_link;

      // Handle timestamps properly based on whether this is a new story or update
      if (!formData.id) {
        // NEW STORY: Remove all timestamp fields - let database defaults work
        delete saveData.created_at;
        delete saveData.updated_at;
        delete saveData.audio_generated_at;
      } else {
        // UPDATE: Explicitly set updated_at, never send created_at
        saveData.updated_at = new Date().toISOString();
        delete saveData.created_at;
        // Only include audio_generated_at if it has a real value
        if (!saveData.audio_generated_at) {
          delete saveData.audio_generated_at;
        }
      }

      let result;
      
      if (formData.id) {
        // Update existing story
        console.log('Updating story with ID:', formData.id);
        console.log('Update payload:', saveData);
        
        const { data, error } = await supabase
          .from('stories')
          .update({
            ...saveData,
            // Explicitly convert empty strings to null for optional text fields
            tagline: saveData.tagline?.trim() || null,
            excerpt: saveData.excerpt?.trim() || null,
            author: saveData.author?.trim() || saveData.author,
            photo_alt_1: saveData.photo_alt_1?.trim() || null,
            photo_alt_2: saveData.photo_alt_2?.trim() || null,
            photo_alt_3: saveData.photo_alt_3?.trim() || null,
            photo_alt_4: saveData.photo_alt_4?.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id)
          .select();
        
        console.log('Update response - data:', data, 'error:', error);
        
        if (error) throw error;
        toast.success("Story updated successfully!");
        
        // Set result with updated story data
        result = { success: true, story: data?.[0] || null };
      } else {
        // Create new story - clean payload
        console.log('Creating new story');
        
        // Clone saveData and remove id field and undefined values
        const insertData = { ...saveData };
        delete insertData.id; // Remove id to let Postgres generate UUID
        
        // Remove undefined values to prevent database issues
        Object.keys(insertData).forEach(key => {
          if (insertData[key] === undefined) {
            delete insertData[key];
          }
        });
        
        console.log('Insert payload keys:', Object.keys(insertData));
        console.log('Insert payload (id should not be present):', insertData);
        
        const { data, error } = await supabase
          .from('stories')
          .insert([insertData])
          .select();
        
        console.log('Insert response - data:', data, 'error:', error);
        
        if (error) throw error;
        toast.success("Story created successfully!");
        
        // Set result with created story data
        result = { success: true, story: data?.[0] || null };
      }
      
      // Call onSuccess callback after successful save operation
      console.log('About to call onSuccess callback...');
      if (onSuccess) {
        await onSuccess();
        console.log('onSuccess callback completed');
      }
      
      return result;
    } catch (error: any) {
      console.error('Save error details:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      toast.error(`Error saving story: ${error.message}`);
      return { success: false };
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
