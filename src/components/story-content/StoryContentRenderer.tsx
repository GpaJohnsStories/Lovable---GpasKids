
import React from 'react';
import { SuperSuper } from '../SuperSuper';
import { StoryCodePhotoDisplay } from './StoryCodePhotoDisplay';
import { useStoryCodeLookup } from '../../hooks/useStoryCodeLookup';

interface StoryContentRendererProps {
  content: string;
  className?: string;
}

export const StoryContentRenderer: React.FC<StoryContentRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  const { lookupStoryByCode } = useStoryCodeLookup();

  // Process content to find story codes and replace them with components
  const processContent = (text: string) => {
    // Pattern to match story codes like [SYS-BDY] or [FUN-001]
    const storyCodePattern = /\[([A-Z]{3}-[A-Z0-9]{3})\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = storyCodePattern.exec(text)) !== null) {
      const [fullMatch, storyCode] = match;
      const matchStart = match.index;

      // Add text before the story code
      if (matchStart > lastIndex) {
        const beforeText = text.substring(lastIndex, matchStart);
        if (beforeText.trim()) {
          parts.push(
            <div 
              key={`text-${lastIndex}`}
              dangerouslySetInnerHTML={{ __html: beforeText }}
              className="prose prose-lg max-w-none text-black leading-relaxed font-normal"
              style={{ fontFamily: 'Georgia, serif' }}
            />
          );
        }
      }

      // Add story code component
      parts.push(
        <StoryCodeContent 
          key={`story-${storyCode}-${matchStart}`}
          storyCode={storyCode}
        />
      );

      lastIndex = matchStart + fullMatch.length;
    }

    // Add remaining text after the last story code
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText.trim()) {
        parts.push(
          <div 
            key={`text-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: remainingText }}
            className="prose prose-lg max-w-none text-black leading-relaxed font-normal"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        );
      }
    }

    // If no story codes found, return the original content
    if (parts.length === 0) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: text }}
          className="prose prose-lg max-w-none text-black leading-relaxed font-normal"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      );
    }

    return parts;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {processContent(content)}
    </div>
  );
};

// Component to handle individual story code content
const StoryCodeContent: React.FC<{ storyCode: string }> = ({ storyCode }) => {
  const { lookupStoryByCode } = useStoryCodeLookup();
  const [storyData, setStoryData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuperSuper, setShowSuperSuper] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(16);

  React.useEffect(() => {
    let isMounted = true;
    
    const fetchStoryData = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await lookupStoryByCode(storyCode);
        if (isMounted) {
          setStoryData(data);
          setError(data ? null : `Story ${storyCode} not found`);
        }
      } catch (error) {
        console.error('Error fetching story data:', error);
        if (isMounted) {
          setError('Failed to load story content');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStoryData();
    
    return () => {
      isMounted = false;
    };
  }, [storyCode, lookupStoryByCode]);

  if (isLoading) {
    return (
      <div className="my-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-600 text-center">Loading story content for {storyCode}...</p>
      </div>
    );
  }

  if (error || !storyData) {
    return (
      <div className="my-6 p-4 border border-orange-300 rounded-lg bg-orange-50">
        <p className="text-orange-700 text-center">{error || `Story code ${storyCode} not found.`}</p>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
      {/* Story Title */}
      <h3 className="text-xl font-bold text-blue-800 mb-3 text-center" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
        {storyData.title}
      </h3>

      {/* Audio Controls - Only show if audio is available or if we allow TTS */}
      {(storyData.audio_url || storyData.content) && (
        <div className="mb-4">
          <button
            onClick={() => setShowSuperSuper(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Play Audio
          </button>
          {showSuperSuper && (
            <SuperSuper
              isOpen={showSuperSuper}
              onClose={() => setShowSuperSuper(false)}
              title={storyData.title}
              author={storyData.author}
              voiceName="Default"
              audioUrl={storyData.audio_url || ''}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
            />
          )}
        </div>
      )}

      {/* Photos - Show any available photos */}
      <StoryCodePhotoDisplay story={storyData} />

      {/* Story Content */}
      {storyData.content && (
        <div 
          dangerouslySetInnerHTML={{ __html: storyData.content }}
          className="prose prose-lg max-w-none text-black leading-relaxed font-normal mt-4"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      )}

      {/* Story Code Display */}
      <div className="text-right mt-4">
        <span className="text-sm font-mono text-blue-600 bg-white/70 px-2 py-1 rounded">
          {storyCode}
        </span>
      </div>
    </div>
  );
};
