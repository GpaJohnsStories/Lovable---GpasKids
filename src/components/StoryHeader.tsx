
import React, { useState } from 'react';
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";
import AuthorLink from "@/components/AuthorLink";
import CopyrightIcon from "@/components/CopyrightIcon";
import PrintIcon from "@/components/PrintIcon";

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
  copyrightStatus?: string;
  printMode?: boolean;
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
  allowTextToSpeech = false,
  copyrightStatus,
  printMode = false
}: StoryHeaderProps) => {
  const [showSuperAV, setShowSuperAV] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  return (
    <>
      {/* Container with audio button positioned top right */}
      <div className="relative">
        {/* Audio Button - Top Right Corner - only show if audio is available and not in print mode */}
        {audioUrl && !printMode && (
          <div className="absolute top-0 right-0 z-5">
            <AudioButton 
              code={storyCode || 'STORY'}
              onClick={() => setShowSuperAV(true)}
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
          <h2 className="text-2xl text-orange-700 text-center mb-4 italic font-medium font-georgia">
            {tagline}
          </h2>
        )}

        <div className="flex flex-col items-center gap-2 text-xl text-orange-600 mb-2 font-georgia">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="font-medium">by {author}</span>
            </div>
            {!printMode && <AuthorLink authorName={author} variant="button" size="sm" />}
            <div className="flex items-center">
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {/* Icons row */}
          <div className="flex items-center gap-2">
            {!printMode && <CopyrightIcon copyrightStatus={copyrightStatus || '©'} />}
            {(copyrightStatus === 'L' || copyrightStatus === 'O') && !printMode && storyCode && (
              <PrintIcon storyCode={storyCode} />
            )}
          </div>
        </div>

        {description && (
          <p className="text-lg text-orange-700 text-center mb-6 italic font-georgia">
            {description}
          </p>
        )}
      </div>

      {/* SuperAV Player - Hide in print mode */}
      {!printMode && (
        <SuperAV
          isOpen={showSuperAV}
          onClose={() => setShowSuperAV(false)}
          title={title}
          author={author}
          voiceName={aiVoiceName}
          showAuthor={true}
          audioUrl={audioUrl}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      )}
    </>
  );
};

export default StoryHeader;
