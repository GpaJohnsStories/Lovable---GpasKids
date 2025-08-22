
import React, { useState } from 'react';
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";
import AuthorLink from "@/components/AuthorLink";
import CopyrightIcon from "@/components/CopyrightIcon";
import PrintIcon from "@/components/PrintIcon";
import { createSafeHeaderHtml } from "@/utils/headerTokens";

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
  // HTML token props for dynamic styling
  titleHtml?: string;
  taglineHtml?: string;
  authorHtml?: string;
  descriptionHtml?: string;
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
  printMode = false,
  titleHtml,
  taglineHtml,
  authorHtml,
  descriptionHtml
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
        
        {!printMode && (
          <div className="text-center mb-6">
            {renderCategoryBadge(category)}
          </div>
        )}

        {/* Story Title - Now properly centered */}
        <div className="text-center mb-4">
          {titleHtml ? (
            <h1 
              className="text-27px font-bold text-amber-800 leading-tight text-center font-fun"
              dangerouslySetInnerHTML={createSafeHeaderHtml(titleHtml)}
            />
          ) : (
            <h1 className="text-27px font-bold text-amber-800 leading-tight text-center font-fun">
              {title}
            </h1>
          )}
        </div>

        {(tagline || taglineHtml) && (
          <div className="text-center mb-4">
            {taglineHtml ? (
              <h2 
                className="text-21px text-amber-700 italic leading-tight font-fun text-center whitespace-pre-line"
                dangerouslySetInnerHTML={createSafeHeaderHtml(taglineHtml)}
              />
            ) : (
              <h2 className="text-21px text-amber-700 italic leading-tight font-fun text-center whitespace-pre-line">
                {tagline}
              </h2>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-2 text-21px text-amber-800 mb-2 font-fun">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {authorHtml ? (
                <span 
                  className="font-medium"
                  dangerouslySetInnerHTML={createSafeHeaderHtml(`by ${authorHtml}`)}
                />
              ) : (
                <span className="font-medium">by {author}</span>
              )}
            </div>
            {!printMode && <AuthorLink authorName={author} variant="button" size="sm" />}
          </div>
          {/* Icons row */}
          <div className="flex items-center gap-2">
            {/* {!printMode && <CopyrightIcon copyrightStatus={copyrightStatus || '©'} />} */}
            {(copyrightStatus === 'L' || copyrightStatus === 'O') && !printMode && storyCode && (
              <PrintIcon storyCode={storyCode} />
            )}
          </div>
        </div>

        {(description || descriptionHtml) && (
          <div className="text-center mb-6">
            {descriptionHtml ? (
              <p 
                className="text-21px text-amber-700 leading-relaxed font-fun text-center whitespace-pre-line"
                dangerouslySetInnerHTML={createSafeHeaderHtml(descriptionHtml)}
              />
            ) : (
              <p className="text-21px text-amber-700 leading-relaxed font-fun text-center whitespace-pre-line">
                {description}
              </p>
            )}
          </div>
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
