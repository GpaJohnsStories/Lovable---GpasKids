
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
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Clear and crisp' },
  { id: 'fable', name: 'Fable', description: 'Warm and storytelling' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'shimmer', name: 'Shimmer', description: 'Gentle and soothing' },
];

const VoiceSelection: React.FC<VoiceSelectionProps> = ({
  selectedVoice,
  onVoiceChange,
  isRecording = false,
  onStartRecording,
  onStopRecording
}) => {
  return (
    <Card className="border-orange-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium text-gray-700 mb-2 block flex items-center">
              <Volume2 className="h-4 w-4 mr-2" />
              AI Voice Selection
            </Label>
            <Select value={selectedVoice} onValueChange={onVoiceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-sm text-gray-500">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(onStartRecording || onStopRecording) && (
            <div className="pt-2 border-t border-orange-100">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">
                  Record audio version with {voices.find(v => v.id === selectedVoice)?.name || 'selected'} voice
                </Label>
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  className={isRecording ? "animate-pulse" : ""}
                  disabled={!selectedVoice}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Generate Audio
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSelection;
