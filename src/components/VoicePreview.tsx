
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Play, Square, Volume2, AlertCircle, CheckCircle } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "@/hooks/use-toast";

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
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  const playVoice = async (voiceId: string) => {
    try {
      // Clear any previous states
      setLastError(null);
      setLastSuccess(null);
      
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentlyPlaying(null);
      }

      setLoadingVoice(voiceId);
      console.log(`🎵 Starting voice generation for voice: ${voiceId}`);
      console.log(`📝 Text to convert: "${sampleText.substring(0, 50)}..."`);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: sampleText,
          voice: voiceId
        }
      });

      console.log('📡 Supabase function response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        setLastError(`Function error: ${error.message}`);
        toast({
          title: "Error generating speech",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (!data || !data.audioContent) {
        console.error('❌ No audio content returned:', data);
        setLastError('No audio content returned from the API');
        toast({
          title: "Error generating speech",
          description: "No audio content was generated",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Audio content received, length:', data.audioContent.length);
      console.log('🔄 Converting base64 to audio blob...');

      // Convert base64 to audio blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('🎧 Audio blob created successfully, attempting to play...');
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setCurrentlyPlaying(voiceId);
      
      audio.onended = () => {
        console.log('🎵 Audio playback ended');
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setLastError('Failed to play audio - check if your browser supports MP3 playback');
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Audio playback error",
          description: "Failed to play the generated audio",
          variant: "destructive",
        });
      };

      audio.oncanplay = () => {
        console.log('✅ Audio is ready to play');
        setLastSuccess(`Successfully generated and ready to play ${voiceId} voice`);
      };

      audio.onloadstart = () => {
        console.log('🔄 Audio loading started');
      };

      audio.onloadeddata = () => {
        console.log('📊 Audio data loaded');
      };
      
      await audio.play();
      console.log('🎵 Audio playback started successfully');
      
      toast({
        title: "Voice generated successfully!",
        description: `Now playing ${voices.find(v => v.id === voiceId)?.name} voice`,
      });
      
    } catch (error) {
      console.error('❌ Error in playVoice:', error);
      setLastError(`Playback error: ${error.message}`);
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
        {lastError && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-700 text-sm">{lastError}</p>
            </div>
          </div>
        )}

        {lastSuccess && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold">Success:</p>
              <p className="text-green-700 text-sm">{lastSuccess}</p>
            </div>
          </div>
        )}

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
                        className="flex items-center gap-2 font-fun bg-orange-100 border-orange-300"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        onClick={() => playVoice(voice.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 font-fun hover:bg-orange-50 hover:border-orange-300"
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

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 font-fun text-sm">
            🔧 <strong>Debugging Info:</strong> Check the browser console (F12) for detailed logs about the voice generation process. 
            This will help identify any issues with API calls or audio playback.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoicePreview;
