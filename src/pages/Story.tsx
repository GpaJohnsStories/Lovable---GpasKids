
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from "lucide-react";
import { StoryContentRenderer } from "@/components/story-content/StoryContentRenderer";
import WelcomeHeader from "@/components/WelcomeHeader";
import StoryHeader from "@/components/StoryHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import StoryPhotosGallery from "@/components/StoryPhotosGallery";
import StoryVideoPlayer from "@/components/StoryVideoPlayer";
import StoryVotingSection from "@/components/StoryVotingSection";
import { getStoryPhotos } from "@/utils/storyUtils";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";


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
}

const Story = () => {
  const { storyCode } = useParams<{ storyCode: string }>();
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVote, setCurrentVote] = useState<'thumbs_up' | 'thumbs_down' | 'ok' | null>(null);
  const [showSuperAV, setShowSuperAV] = useState(false);
  
  const [fontSize, setFontSize] = useState(18);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('story_code', storyCode)
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
        
        // Store the current story path for the READ menu functionality
        sessionStorage.setItem('currentStoryPath', `/story/${storyCode}`);
        console.log('📖 Story loaded - stored currentStoryPath:', `/story/${storyCode}`);

        // Increment read_count
        await supabase
          .from('stories')
          .update({ read_count: (data.read_count || 0) + 1 })
          .eq('id', data.id);

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

  const photos = getStoryPhotos(story);

  return (
      <div className="min-h-screen bg-white">
        <WelcomeHeader />
        <ScrollToTop />
        <div className="container mx-auto px-4 pt-0">
          <StoryHeader
            title={story.title}
            category={story.category}
            author={story.author}
            createdAt={story.created_at}
            tagline={story.tagline}
            storyCode={story.story_code}
            showStoryCode={true}
            content={story.content}
            description={story.excerpt}
            audioUrl={story.audio_url}
            audioSegments={story.audio_segments}
            audioDuration={story.audio_duration}
            aiVoiceName={story.ai_voice_name}
            aiVoiceModel={story.ai_voice_model}
            allowTextToSpeech={false}
          />

          {/* Top Voting Section */}
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

          <main className="mb-8">
            {/* Photo Gallery using StoryPhotosGallery component */}
            <StoryPhotosGallery photos={photos} storyTitle={story.title} />

            {/* Video Player - Show if video exists */}
            {story.video_url && (
              <div className="mb-8">
                <StoryVideoPlayer
                  videoUrl={story.video_url}
                  title={story.title}
                />
              </div>
            )}

            {/* Font and Audio Controls positioned above story box */}
            <div className="relative">
              
              {/* Audio Button - positioned on right */}
              <div className="absolute top-0 right-0 -mt-8 z-10">
                <AudioButton
                  code={story.story_code}
                  onClick={() => {
                    console.log('Audio button clicked for story:', story.story_code);
                    setShowSuperAV(true);
                  }}
                />
              </div>
              
              <div 
                className="bg-[#F5E6D3] border-2 border-[#9c441a] rounded-lg p-6 md:p-8 shadow-sm"
              >
                <StoryContentRenderer 
                  content={story.content || "No content available."}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                />
              </div>
            </div>
          </main>

          {/* Bottom Voting Section */}
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
        
        {/* SuperAV Player */}
        <SuperAV
          isOpen={showSuperAV}
          onClose={() => setShowSuperAV(false)}
          title={story.title}
          author={story.author}
          voiceName={story.ai_voice_name}
          audioUrl={story.audio_url}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
        
        
        <CookieFreeFooter />
      </div>
  );
};

export default Story;
