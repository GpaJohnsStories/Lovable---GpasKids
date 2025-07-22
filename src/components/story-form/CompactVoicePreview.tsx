
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Play, Square, Volume2, AlertCircle, CheckCircle } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "@/hooks/use-toast";

const voices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Clear and crisp' },
  { id: 'fable', name: 'Fable', description: 'Warm and storytelling' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and soothing' },
];

interface CompactVoicePreviewProps {
  selectedVoice: string;
  onVoiceSelect: (voiceId: string) => void;
  storyContent?: string;
  storyTitle?: string;
  className?: string;
}

const CompactVoicePreview: React.FC<CompactVoicePreviewProps> = ({
  selectedVoice,
  onVoiceSelect,
  storyContent = '',
  storyTitle = '',
  className = ''
}) => {
  const [sampleText, setSampleText] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-populate sample text from story content
  React.useEffect(() => {
    if (!sampleText && storyContent) {
      // Extract first paragraph or first 200 characters
      const firstParagraph = storyContent.replace(/<[^>]*>/g, '').substring(0, 200);
      if (firstParagraph.trim()) {
        setSampleText(firstParagraph.trim() + (firstParagraph.length >= 200 ? '...' : ''));
      }
    }
  }, [storyContent, sampleText]);

  const defaultSampleText = `Hello! Welcome to ${storyTitle || "GpaJohn's Stories"}. This is how I sound when reading your favorite stories aloud.`;

  const playVoice = async (voiceId: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentlyPlaying(null);
      }

      setLoadingVoice(voiceId);
      console.log(`🎵 Testing voice: ${voiceId}`);

      const textToSpeak = sampleText || defaultSampleText;
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textToSpeak,
          voice: voiceId
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
        description: `Testing ${voices.find(v => v.id === voiceId)?.name} voice`,
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

  const handleUseThisVoice = (voiceId: string) => {
    onVoiceSelect(voiceId);
    toast({
      title: "Voice selected",
      description: `${voices.find(v => v.id === voiceId)?.name} voice has been selected for your story`,
    });
  };

  return (
    <Card className={`border-orange-200 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with expand/collapse */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-sm">Voice Preview & Testing</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>

          {/* Sample text input (collapsible) */}
          {isExpanded && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">
                Test Text (will use story content if empty):
              </label>
              <Textarea
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder={defaultSampleText}
                className="min-h-[60px] text-sm"
              />
            </div>
          )}

          {/* Voice grid */}
          <div className="grid grid-cols-2 gap-3">
            {voices.map((voice) => (
              <Card key={voice.id} className={`border ${selectedVoice === voice.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm text-orange-800">{voice.name}</h4>
                      <p className="text-xs text-orange-600">{voice.description}</p>
                    </div>
                    
                    <div className="flex gap-1">
                      {/* Play/Stop button */}
                      {loadingVoice === voice.id ? (
                        <div className="flex items-center gap-1 px-2 py-1 text-xs">
                          <LoadingSpinner />
                          <span>Testing...</span>
                        </div>
                      ) : currentlyPlaying === voice.id ? (
                        <Button
                          type="button"
                          onClick={stopAudio}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2 bg-orange-100 border-orange-300"
                        >
                          <Square className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => playVoice(voice.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2 hover:bg-orange-50 hover:border-orange-300"
                          disabled={loadingVoice !== null}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      )}

                      {/* Use this voice button */}
                      <Button
                        type="button"
                        onClick={() => handleUseThisVoice(voice.id)}
                        variant={selectedVoice === voice.id ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7 px-2 font-medium"
                      >
                        {selectedVoice === voice.id ? 'Selected' : 'Use'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current selection info */}
          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
            <strong>Current voice:</strong> {voices.find(v => v.id === selectedVoice)?.name || 'None selected'}
            {voices.find(v => v.id === selectedVoice) && (
              <span className="ml-2">- {voices.find(v => v.id === selectedVoice)?.description}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactVoicePreview;
