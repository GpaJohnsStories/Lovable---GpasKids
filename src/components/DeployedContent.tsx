import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoryCodeAudioControls } from '@/components/story-content/StoryCodeAudioControls';

interface DeployedContentData {
  id: string;
  story_code: string;
  content: string | null;
  photo_url: string | null;
  photo_alt_text: string | null;
  audio_url: string | null;
  title: string | null;
  author: string | null;
  deployed_at: string;
  is_active: boolean;
}

interface DeployedContentProps {
  storyCode: string;
  fallbackContent?: React.ReactNode;
  includeAudio?: boolean;
  audioOnly?: boolean;
  showInlineAudio?: boolean;
  className?: string;
}

export const DeployedContent = ({ 
  storyCode, 
  fallbackContent, 
  includeAudio = false,
  audioOnly = false,
  showInlineAudio = false,
  className = "" 
}: DeployedContentProps) => {
  const [content, setContent] = useState<DeployedContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeployedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('deployed_content')
          .select('*')
          .eq('story_code', storyCode)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) {
          console.error(`Error fetching deployed content for ${storyCode}:`, fetchError);
          setError('Failed to load content');
          return;
        }

        setContent(data);
      } catch (err) {
        console.error(`Error in fetchDeployedContent for ${storyCode}:`, err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeployedContent();
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
    return (
      <div className={className}>
        {fallbackContent || (
          <div className="text-muted-foreground">
            Content not yet deployed for {storyCode}
          </div>
        )}
      </div>
    );
  }

  // If audioOnly mode, only return audio controls
  if (audioOnly && content.audio_url) {
    return (
      <div className="flex-shrink-0">
        <StoryCodeAudioControls 
          audioUrl={content.audio_url}
          title={content.title || ''}
          author={content.author || ''}
        />
      </div>
    );
  }

  // If audioOnly but no audio, return nothing
  if (audioOnly) {
    return null;
  }

  return (
    <div className={className}>
      {/* Audio controls at the top if requested and available */}
      {includeAudio && content.audio_url && (
        <div className="mb-6">
          <StoryCodeAudioControls 
            audioUrl={content.audio_url}
            title={content.title || ''}
            author={content.author || ''}
          />
        </div>
      )}

      {/* Photo if available - positioned to float left */}
      {!audioOnly && content.photo_url && (
        <img 
          src={content.photo_url} 
          alt={content.photo_alt_text || content.title || 'Story image'}
          className="float-left mr-8 mb-6 w-full max-w-xs h-auto rounded-lg shadow-lg border-4 border-white"
        />
      )}
      
      {/* Content */}
      {!audioOnly && content.content && (
        <div 
          className="deployed-story-content"
          style={{ fontFamily: 'Georgia, serif' }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      )}
    </div>
  );
};