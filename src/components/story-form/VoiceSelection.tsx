
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mic, Square, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceSelectionProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

const voices = [
  { id: 'nova', name: 'Nova', description: 'Bright and energetic - Great for fun stories' },
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced - Good for all content' },
  { id: 'echo', name: 'Echo', description: 'Clear and crisp - Perfect for clear narration' },
  { id: 'fable', name: 'Fable', description: 'Warm and storytelling - Ideal for children\'s stories' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative - Good for serious content' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and soothing - Perfect for bedtime stories' },
];

const VoiceSelection: React.FC<VoiceSelectionProps> = ({
  selectedVoice,
  onVoiceChange,
  isRecording = false,
  onStartRecording,
  onStopRecording
}) => {
  const selectedVoiceData = voices.find(v => v.id === selectedVoice);

  return (
    <Card className="border-orange-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-3 block flex items-center">
              <Volume2 className="h-5 w-5 mr-2 text-orange-600" />
              Choose AI Voice for Audio Version
            </Label>
            <Select value={selectedVoice} onValueChange={onVoiceChange}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select a voice for audio narration" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id} className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{voice.name}</span>
                      <span className="text-sm text-gray-500">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVoiceData && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: <strong>{selectedVoiceData.name}</strong> - {selectedVoiceData.description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Label className="text-base font-medium text-gray-700">
                  Generate Audio Narration
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Create an AI-narrated audio version using the {selectedVoiceData?.name || 'selected'} voice
                </p>
              </div>
            </div>
            {onStartRecording && (
              <Button
                type="button"
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                onClick={isRecording ? onStopRecording : onStartRecording}
                className={`w-full h-12 text-base font-medium ${isRecording ? "animate-pulse" : ""}`}
                disabled={!selectedVoice}
              >
                {isRecording ? (
                  <>
                    <Square className="h-5 w-5 mr-2" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Generate Audio Narration
                  </>
                )}
              </Button>
            )}
            {!selectedVoice && (
              <p className="text-sm text-red-600 mt-2">
                Please select a voice before generating audio
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSelection;
