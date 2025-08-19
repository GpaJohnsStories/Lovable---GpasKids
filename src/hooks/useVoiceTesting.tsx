import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { truncateToWordLimit } from "@/utils/textUtils";

export const useVoiceTesting = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playVoice = async (voiceId: string, content?: string, title?: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentlyPlaying(null);
      }

      setLoadingVoice(voiceId);
      console.log(`🎵 Testing voice: ${voiceId}`);

      // Create sample text
      const defaultText = `Hello! Welcome to ${title || "GpaJohn's Stories"}. This is how I sound when reading your favorite stories aloud.`;
      let textToSpeak = defaultText;
      
      if (content?.trim()) {
        // Extract first paragraph or first 100 words from story content
        const cleanContent = content.replace(/<[^>]*>/g, '').substring(0, 200);
        if (cleanContent.trim()) {
          textToSpeak = cleanContent.trim();
        }
      }
      
      // Ensure text is within word limit before sending
      const textToSend = truncateToWordLimit(textToSpeak, 50); // Shorter for quick testing
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textToSend,
          voice: voiceId.toLowerCase(), // Convert to lowercase to match API expectations
          speed: 0.5 // Match recording speed for consistency
        }
      });

      if (error) {
        console.error('❌ Voice generation error:', error);
        toast({
          title: "Error generating speech",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.audioContent) {
        console.error('❌ No audio content returned');
        toast({
          title: "Error generating speech",
          description: "No audio content was generated",
          variant: "destructive",
        });
        return;
      }

      // Convert base64 to audio blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setCurrentlyPlaying(voiceId);
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Audio playback error",
          description: "Failed to play the generated audio",
          variant: "destructive",
        });
      };
      
      await audio.play();
      
      toast({
        title: "Voice preview playing",
        description: `Testing ${voiceId} voice`,
      });
      
    } catch (error) {
      console.error('❌ Error in playVoice:', error);
      toast({
        title: "Error playing voice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingVoice(null);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentlyPlaying(null);
    }
  };

  return {
    currentlyPlaying,
    loadingVoice,
    playVoice,
    stopAudio
  };
};