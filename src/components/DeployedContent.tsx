
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SuperAV } from '@/components/SuperAV';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

interface StoryData {
  id: string;
  story_code: string;
  content: string | null;
  photo_link_1: string | null;
  photo_alt_1?: string | null;
  audio_url: string | null;
  title: string | null;
  author: string | null;
  updated_at: string;
  category: string;
}

interface DeployedContentProps {
  storyCode: string;
  fallbackContent?: React.ReactNode;
  includeAudio?: boolean;
  audioOnly?: boolean;
  showInlineAudio?: boolean;
  hidePhotos?: boolean;
  className?: string;
  allowTextToSpeech?: boolean;
  context?: string;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
  showHeaderPreview?: boolean;
}

export const DeployedContent = ({ 
  storyCode, 
  fallbackContent, 
  includeAudio = false,
  audioOnly = false,
  showInlineAudio = false,
  hidePhotos = false,
  className = "",
  allowTextToSpeech = false,
  context = "default",
  fontSize = 16,
  onFontSizeChange,
  showHeaderPreview = false
}: DeployedContentProps) => {
  const [content, setContent] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuperAV, setShowSuperAV] = useState(false);

  useEffect(() => {
    const fetchStoryContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query the stories table directly for WebText content
        const { data, error: fetchError } = await supabase
          .from('stories')
          .select('*')
          .eq('story_code', storyCode)
          .eq('category', 'WebText')
          .maybeSingle();

        if (fetchError) {
          console.error(`Error fetching story content for ${storyCode}:`, fetchError);
          setError('Failed to load content');
          return;
        }

        console.log(`DeployedContent: fetched story data for ${storyCode}:`, data);
        setContent(data);
      } catch (err) {
        console.error(`Error in fetchStoryContent for ${storyCode}:`, err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStoryContent();
  }, [storyCode]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !content) {
    console.log(`DeployedContent: No content found for ${storyCode}, error:`, error, 'content:', content);
    return (
      <div className={className}>
        {fallbackContent || (
          <div className="text-muted-foreground">
            Content not yet available for {storyCode}
          </div>
        )}
      </div>
    );
  }

  console.log(`DeployedContent: Using story content for ${storyCode}:`, content);

  // If audioOnly mode, only return audio controls
  if (audioOnly) {
    return (
      <div className="flex-shrink-0">
        <button
          onClick={() => setShowSuperAV(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Play Audio
        </button>
        {showSuperAV && (
          <SuperAV
            isOpen={showSuperAV}
            onClose={() => setShowSuperAV(false)}
            title={content.title || ''}
            author={content.author || ''}
            voiceName="Default"
            audioUrl={content.audio_url || ''}
            fontSize={fontSize}
            onFontSizeChange={onFontSizeChange || (() => {})}
          />
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Audio controls at the top if requested and available */}
      {includeAudio && (
        <div className="mb-6">
          <button
            onClick={() => setShowSuperAV(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Play Audio
          </button>
          {showSuperAV && (
            <SuperAV
              isOpen={showSuperAV}
              onClose={() => setShowSuperAV(false)}
              title={content.title || ''}
              author={content.author || ''}
              voiceName="Default"
              audioUrl={content.audio_url || ''}
              fontSize={fontSize}
              onFontSizeChange={onFontSizeChange || (() => {})}
            />
          )}
        </div>
      )}

      {/* Photo if available - positioned to float left with Tooltip */}
      {!audioOnly && !hidePhotos && content.photo_link_1 && (
        <div className="float-left mr-8 mb-6 w-full max-w-xs">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img 
                  src={content.photo_link_1} 
                  alt={content.photo_alt_1 || content.title || 'Story image'}
                  className="w-full h-auto rounded-lg shadow-lg border-4 border-white cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">
                  {content.photo_alt_1 || content.title || 'Story image'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Content */}
      {!audioOnly && content.content && (
        <IsolatedStoryRenderer
          content={content.content}
          className="deployed-story-content"
          category="WebText"
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
          useRichCleaning={true}
          showHeaderPreview={showHeaderPreview}
        />
      )}
    </div>
  );
};
