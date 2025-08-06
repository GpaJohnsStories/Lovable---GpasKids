
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

    </div>
  );
};

export default VoiceSelection;
