
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
  published?: string;
  book_title?: string;
  chapter_number?: number;
  chapter_title?: string;
  publication_status_code?: number;
  copyright_status?: string;
}

// Helper function to count words in content
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Validation for basic save (publication_status_code >= 2)
export const validateBasicSave = (formData: Story): boolean => {
  console.log('Validating basic save...', formData);
  
  if (!formData.story_code?.trim()) {
    toast.error("Story Code (A) is required");
    return false;
  }
  
  if (!formData.category?.trim()) {
    toast.error("Category (B1) is required");
    return false;
  }
  
  if (!formData.copyright_status?.trim()) {
    toast.error("Copyright Status (B2) is required");
    return false;
  }
  
  if (!formData.title?.trim()) {
    toast.error("Title (C) is required");
    return false;
  }

  const statusCode = Number(formData.publication_status_code);
  if (isNaN(statusCode) || statusCode < 2 || statusCode > 4) {
    toast.error("Publication Status must be 2, 3, or 4");
    return false;
  }

  console.log('Basic validation passed');
  return true;
};

// Validation for published save (publication_status_code 0 or 1)
export const validatePublishedSave = (formData: Story, colorPresetId?: string): boolean => {
  console.log('Validating published save...', formData, 'colorPresetId:', colorPresetId);
  
  if (!formData.story_code?.trim()) {
    toast.error("Story Code (A) is required");
    return false;
  }
  
  if (!formData.category?.trim()) {
    toast.error("Category (B1) is required");
    return false;
  }
  
  if (!formData.copyright_status?.trim()) {
    toast.error("Copyright Status (B2) is required");
    return false;
  }
  
  if (!formData.title?.trim()) {
    toast.error("Title (C) is required");
    return false;
  }

  const statusCode = Number(formData.publication_status_code);
  if (isNaN(statusCode) || (statusCode !== 0 && statusCode !== 1)) {
    toast.error("Publication Status must be 0 or 1 for published content");
    return false;
  }

  // Check content has more than 3 words
  const wordCount = countWords(formData.content || '');
  if (wordCount <= 3) {
    toast.error("HTML Source (Blue Dot 3) must contain more than 3 words");
    return false;
  }

  // Check color preset is between 1-8
  const presetNum = Number(colorPresetId);
  if (!colorPresetId || isNaN(presetNum) || presetNum < 1 || presetNum > 8) {
    toast.error("Color Preset must be set to 1 through 8");
    return false;
  }

  console.log('Published validation passed');
  return true;
};

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

  // Publication status validation - convert to number and check if valid (0-4)
  const statusCode = Number(formData.publication_status_code);
  if (isNaN(statusCode) || statusCode >= 5) {
    console.log('Publication status validation failed');
    toast.error("Set Publication Code Before Save");
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
