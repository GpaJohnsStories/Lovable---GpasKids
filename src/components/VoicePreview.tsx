
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Play, Square, Volume2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const voices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Clear and crisp' },
  { id: 'fable', name: 'Fable', description: 'Warm and storytelling' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and soothing' },
];

const VoicePreview = () => {
  const [sampleText, setSampleText] = useState(
    "Hello! Welcome to GpaJohn's Stories. This is how I sound when reading your favorite stories aloud. Each voice has its own unique character and style."
  );
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playVoice = async (voiceId: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentlyPlaying(null);
      }

      setLoadingVoice(voiceId);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: sampleText,
          voice: voiceId
        }
      });

      if (error) {
        console.error('Error generating speech:', error);
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
      
      audio.onerror = () => {
        console.error('Error playing audio');
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing voice:', error);
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 font-fun">
          <Volume2 className="h-6 w-6" />
          Voice Preview for Read-To-Me Feature
        </CardTitle>
        <p className="text-orange-600 font-fun">
          Test different voices to see which one you like best for reading stories aloud!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-orange-800 mb-2 font-fun">
            Sample Text (edit to test with different content):
          </label>
          <Textarea
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="min-h-[100px] font-fun"
            placeholder="Enter text to test with different voices..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {voices.map((voice) => (
            <Card key={voice.id} className="border-orange-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-orange-800 font-fun">{voice.name}</h3>
                    <p className="text-sm text-orange-600 font-fun">{voice.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {loadingVoice === voice.id ? (
                      <div className="flex items-center gap-2 px-3 py-2">
                        <LoadingSpinner />
                        <span className="text-sm font-fun">Generating...</span>
                      </div>
                    ) : currentlyPlaying === voice.id ? (
                      <Button
                        onClick={stopAudio}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 font-fun"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        onClick={() => playVoice(voice.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 font-fun"
                        disabled={loadingVoice !== null}
                      >
                        <Play className="h-4 w-4" />
                        Play
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-fun text-sm">
            💡 <strong>Tip:</strong> Try editing the sample text above to test how each voice sounds with different types of content. 
            You can paste in a paragraph from one of your stories to get a better feel for how it would sound!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoicePreview;
