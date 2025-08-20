
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mic, Square, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getVoiceCharacter } from "@/utils/characterVoices";

interface VoiceSelectionProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  storyContent?: string;
  storyTitle?: string;
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
  onStopRecording,
  storyContent = '',
  storyTitle = ''
}) => {
  const selectedVoiceData = voices.find(v => v.id === selectedVoice);

  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-orange-600" />
              <Label className="text-sm font-bold">AI Voice Selection</Label>
            </div>
            
            <Select value={selectedVoice} onValueChange={onVoiceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice for AI audio generation" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-xs text-gray-600">{voice.description}</span>
                      {getVoiceCharacter(voice.id) && (
                        <span className="text-xs text-amber-700 font-medium">
                          📖 Assigned to: {getVoiceCharacter(voice.id)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedVoiceData && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <strong>Selected:</strong> {selectedVoiceData.name} - {selectedVoiceData.description}
                {getVoiceCharacter(selectedVoiceData.id) && (
                  <div className="text-amber-700 font-medium mt-1">
                    📖 Character Assignment: {getVoiceCharacter(selectedVoiceData.id)}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceSelection;
