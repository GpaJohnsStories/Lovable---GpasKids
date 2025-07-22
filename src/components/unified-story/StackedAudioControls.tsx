
import React from 'react';
import { UniversalAudioControls } from '../UniversalAudioControls';

interface StackedAudioControlsProps {
  audioUrl?: string;
  title: string;
  content?: string;
  author?: string;
  allowTextToSpeech?: boolean;
  context?: string;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  aiVoiceName?: string;
}

export const StackedAudioControls: React.FC<StackedAudioControlsProps> = ({
  audioUrl,
  title,
  content,
  author,
  allowTextToSpeech = false,
  context = 'unified-story-system',
  className = '',
  onPlayStart,
  onPlayEnd,
  aiVoiceName
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Audio Controls */}
      <div className="bg-white/80 rounded-lg border border-blue-200 p-4">
        <UniversalAudioControls
          audioUrl={audioUrl}
          title={title}
          content={content}
          author={author}
          allowTextToSpeech={allowTextToSpeech}
          context={context}
          size="lg"
          className="w-full"
          onPlayStart={onPlayStart}
          onPlayEnd={onPlayEnd}
        />
      </div>

      {/* Voice Information */}
      {aiVoiceName && (
        <div className="text-sm text-gray-600 text-center">
          Voice: {aiVoiceName}
        </div>
      )}
    </div>
  );
};
