import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import StoryVotingSection from "@/components/StoryVotingSection";
import { SuperBox } from "@/components/admin/SuperBox";
import ScreenCopyrightMessage from "@/components/ScreenCopyrightMessage";


interface StoryData {
  id: string;
  title: string;
  content: string | null;
  category: string;
  author: string;
  created_at: string;
  tagline?: string;
  story_code: string;
  excerpt: string;
  photo_link_1: string | null;
  photo_link_2: string | null;
  photo_link_3: string | null;
  photo_alt_1: string | null;
  photo_alt_2: string | null;
  photo_alt_3: string | null;
  video_url: string | null;
  audio_url: string | null;
  audio_segments?: number;
  audio_duration?: number;
  ai_voice_name?: string;
  ai_voice_model?: string;
  thumbs_up_count: number;
  thumbs_down_count: number;
  ok_count: number;
  copyright_status?: string;
  updated_at?: string;
}

const Story = () => {
  const { storyCode } = useParams<{ storyCode: string }>();
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVote, setCurrentVote] = useState<'thumbs_up' | 'thumbs_down' | 'ok' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('story_code', storyCode?.trim())
          .single();

        if (error) {
          console.error("Error fetching story:", error);
          setError("Failed to load story.");
          return;
        }

        if (!data) {
          console.warn(`Story with code ${storyCode} not found.`);
          setError("Story not found.");
          navigate('/library', { replace: true });
          return;
        }

        setStory(data);
        
        // Increment read_count using secure function
        await supabase.rpc('increment_story_read_count', {
          story_uuid: data.id
        });

      } catch (err) {
        console.error("Unexpected error fetching story:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (storyCode) {
      fetchStory();
    }
  }, [storyCode, navigate]);

  const handleVoteUpdate = (newCounts: { thumbs_up_count: number; thumbs_down_count: number; ok_count: number }, newVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null) => {
    if (story) {
      setStory({
        ...story,
        thumbs_up_count: newCounts.thumbs_up_count,
        thumbs_down_count: newCounts.thumbs_down_count,
        ok_count: newCounts.ok_count
      });
      setCurrentVote(newVote);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Story not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <WelcomeHeader />
      <div className="container mx-auto px-4 pt-0">
        <main className="mb-8">
          <SuperBox code={story.story_code} />
        </main>

        {/* Screen Copyright Message - Between content and voting */}
        <ScreenCopyrightMessage copyrightStatus={story.copyright_status || '©'} />

        <StoryVotingSection
          storyId={story.id}
          storyCode={story.story_code}
          storyTitle={story.title}
          thumbsUpCount={story.thumbs_up_count}
          thumbsDownCount={story.thumbs_down_count}
          okCount={story.ok_count}
          currentVote={currentVote}
          onVoteUpdate={handleVoteUpdate}
        />
      </div>
      <CookieFreeFooter />
    </div>
  );
};

export default Story;
