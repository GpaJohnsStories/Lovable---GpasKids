import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { containsBadWordInNickname } from "@/utils/profanity";

export const useNicknameManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createOrUpdateNickname = useCallback(async (personalId: string, nickname: string) => {
    if (!personalId || personalId.length !== 6) {
      toast({
        title: "Invalid Personal ID",
        description: "Personal ID must be exactly 6 characters",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!nickname || nickname.length < 3 || nickname.length > 10) {
      toast({
        title: "Invalid Nickname",
        description: "Nickname must be between 3 and 10 characters",
        variant: "destructive",
      });
      return { success: false };
    }

    // Check for profanity in nickname
    if (containsBadWordInNickname(nickname)) {
      toast({
        title: "Invalid Nickname",
        description: "Please choose a different nickname",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_or_create_nickname', {
        personal_id: personalId.toUpperCase(),
        desired_nickname: nickname
      });

      if (error) {
        console.error('Error creating/updating nickname:', error);
        toast({
          title: "Error",
          description: "Failed to save nickname. Please try again.",
          variant: "destructive",
        });
        return { success: false };
      }

      return { success: true, nickname: data };
    } catch (error) {
      console.error('Error in createOrUpdateNickname:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateNickname = useCallback(async (personalId: string, newNickname: string) => {
    if (!personalId || personalId.length !== 6) {
      toast({
        title: "Invalid Personal ID",
        description: "Personal ID must be exactly 6 characters",
        variant: "destructive",
      });
      return { success: false };
    }

    if (!newNickname || newNickname.length < 3 || newNickname.length > 10) {
      toast({
        title: "Invalid Nickname",
        description: "Nickname must be between 3 and 10 characters",
        variant: "destructive",
      });
      return { success: false };
    }

    // Check for profanity in nickname
    if (containsBadWordInNickname(newNickname)) {
      toast({
        title: "Invalid Nickname",
        description: "Please choose a different nickname",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('update_nickname', {
        personal_id: personalId.toUpperCase(),
        new_nickname: newNickname
      });

      if (error) {
        console.error('Error updating nickname:', error);
        toast({
          title: "Error",
          description: "Failed to update nickname. Please try again.",
          variant: "destructive",
        });
        return { success: false };
      }

      toast({
        title: "Success",
        description: "Nickname updated successfully!",
      });

      return { success: true, nickname: data };
    } catch (error) {
      console.error('Error in updateNickname:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNickname = useCallback(async (personalId: string) => {
    if (!personalId || personalId.length !== 6) {
      return { success: false, nickname: null };
    }

    try {
      const { data, error } = await supabase.rpc('get_nickname_by_personal_id', {
        personal_id: personalId.toUpperCase()
      });

      if (error) {
        console.error('Error getting nickname:', error);
        return { success: false, nickname: null };
      }

      return { success: true, nickname: data };
    } catch (error) {
      console.error('Error in getNickname:', error);
      return { success: false, nickname: null };
    }
  }, []);

  return {
    createOrUpdateNickname,
    updateNickname,
    getNickname,
    isLoading
  };
};