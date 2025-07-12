import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StoryCodeAudioControls } from '@/components/story-content/StoryCodeAudioControls';

interface DeployedContentData {
  id: string;
  story_code: string;
  content: string | null;
  photo_url: string | null;
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
  className?: string;
}

export const DeployedContent = ({ 
  storyCode, 
  fallbackContent, 
  includeAudio = false,
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

  return (
    <div className={className}>
      {/* Photo if available */}
      {content.photo_url && (
        <img 
          src={content.photo_url} 
          alt={content.title || 'Story image'}
          className="w-full h-auto rounded-lg mb-4 max-w-md mx-auto"
        />
      )}
      
      {/* Content */}
      {content.content && (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      )}
      
      {/* Audio if requested and available */}
      {includeAudio && content.audio_url && (
        <div className="mt-6">
          <StoryCodeAudioControls 
            audioUrl={content.audio_url}
            title={content.title || ''}
            author={content.author || ''}
          />
        </div>
      )}
    </div>
  );
};