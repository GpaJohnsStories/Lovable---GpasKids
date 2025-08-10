
import React, { useState } from 'react';
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { AudioButton } from "@/components/AudioButton";
import { SuperSuper } from "@/components/SuperSuper";
import AuthorLink from "@/components/AuthorLink";

interface StoryHeaderProps {
  title: string;
  category: string;
  author: string;
  createdAt: string;
  tagline?: string;
  storyCode?: string;
  showStoryCode?: boolean;
  content?: string;
  description?: string;
  audioUrl?: string;
  audioSegments?: number;
  audioDuration?: number;
  aiVoiceName?: string;
  aiVoiceModel?: string;
  allowTextToSpeech?: boolean;
}

const StoryHeader = ({ 
  title, 
  category, 
  author, 
  createdAt, 
  tagline, 
  storyCode, 
  showStoryCode = false, 
  content, 
  description, 
  audioUrl, 
  audioSegments, 
  audioDuration, 
  aiVoiceName, 
  aiVoiceModel,
  allowTextToSpeech = false
}: StoryHeaderProps) => {
  const [showSuperAudio, setShowSuperAudio] = useState(false);

  return (
    <>
      {/* Container with audio button positioned top right */}
      <div className="relative">
        {/* Audio Button - Top Right Corner - only show if audio is available */}
        {audioUrl && (
          <div className="absolute top-0 right-0 z-5">
            <AudioButton 
              code={storyCode || 'STORY'}
              onClick={() => setShowSuperAudio(true)}
            />
          </div>
        )}
        
        <div className="text-center mb-6">
          {renderCategoryBadge(category)}
        </div>

        {/* Story Title - Now properly centered */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-orange-800 leading-tight">
            {title}
          </h1>
        </div>

        {tagline && (
          <h2 className="text-xl text-orange-700 text-center mb-4 italic font-medium" style={{ fontFamily: 'Georgia, serif' }}>
            {tagline}
          </h2>
        )}

        <div className="flex items-center justify-center space-x-4 text-sm text-orange-600 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          <div className="flex items-center">
            <span className="font-medium">by {author}</span>
          </div>
          <AuthorLink authorName={author} variant="button" size="sm" />
          {showStoryCode && storyCode ? (
            <div className="flex items-center">
              <span>Story Code: {storyCode}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-lg text-orange-700 text-center mb-6 italic" style={{ fontFamily: 'Georgia, serif' }}>
            {description}
          </p>
        )}
      </div>

      {/* SuperAudio Player */}
      <SuperSuper
        isOpen={showSuperAudio}
        onClose={() => setShowSuperAudio(false)}
        title={title}
        author={author}
        voiceName={aiVoiceName}
        showAuthor={true}
        audioUrl={audioUrl}
      />
    </>
  );
};

export default StoryHeader;
