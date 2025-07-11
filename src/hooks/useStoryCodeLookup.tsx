import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useStoryCodeLookup = () => {
  const lookupStoryByCode = useCallback(async (storyCode: string) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .ilike('story_code', storyCode.trim())
        .maybeSingle();

      if (error) {
        console.error('Error looking up story by code:', error);
        toast({
          title: "Error",
          description: "Failed to look up story by code",
          variant: "destructive",
        });
        return null;
      }

      if (!data) {
        console.log('No story found for code:', storyCode);
        toast({
          title: "Story not found",
          description: `No story found with code: ${storyCode}`,
          variant: "destructive",
        });
        return null;
      }

      console.log('Story found for code:', storyCode, data);
      return data;
    } catch (error) {
      console.error('Error in lookupStoryByCode:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while looking up the story",
        variant: "destructive",
      });
      return null;
    }
  }, []);

  return {
    lookupStoryByCode
  };
};