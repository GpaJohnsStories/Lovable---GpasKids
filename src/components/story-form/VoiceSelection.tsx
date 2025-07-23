
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mic, Square, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CompactVoicePreview from "./CompactVoicePreview";

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
      {/* Voice Selection and Generation */}
      <Card className="border-orange-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-bold text-gray-700 mb-3 block flex items-center">
                <Volume2 className="h-5 w-5 mr-2 text-orange-600" />
                AI Voice & Audio Generation
              </Label>
              
              {/* Two-column layout for voice selection and generation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
                {/* Voice Selection Column */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-600">
                    Choose Voice
                  </Label>
                  <Select value={selectedVoice} onValueChange={onVoiceChange}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Select a voice for audio narration" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id} className="py-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{voice.name}</span>
                            <span className="text-xs text-muted-foreground">{voice.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button Column */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-600">
                    Generate Audio
                  </Label>
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
                          Generating...
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5 mr-2" />
                          Generate Audio
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Selected voice info and validation message */}
              <div className="mt-3 space-y-2">
                {selectedVoiceData && (
                  <p className="text-sm text-gray-600">
                    Selected: <strong>{selectedVoiceData.name}</strong> - {selectedVoiceData.description}
                  </p>
                )}
                {!selectedVoice && (
                  <p className="text-sm text-red-600">
                    Please select a voice before generating audio
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrated Voice Preview */}
      <CompactVoicePreview
        selectedVoice={selectedVoice}
        onVoiceSelect={onVoiceChange}
        storyContent={storyContent}
        storyTitle={storyTitle}
      />
    </div>
  );
};

export default VoiceSelection;
