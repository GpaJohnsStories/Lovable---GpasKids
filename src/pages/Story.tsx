
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
  audio_url: string | null;
  audio_segments?: number;
  audio_duration?: number;
  ai_voice_name?: string;
  ai_voice_model?: string;
}

const Story = () => {
  const { storyCode } = useParams<{ storyCode: string }>();
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStoryCode, setShowStoryCode] = useState(false);
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

  const toggleStoryCode = () => {
    setShowStoryCode(!showStoryCode);
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
    <ContentProtection enableProtection={true}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
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
            showStoryCode={showStoryCode}
            content={story.content}
            description={story.excerpt}
            audioUrl={story.audio_url}
            audioSegments={story.audio_segments}
            audioDuration={story.audio_duration}
            aiVoiceName={story.ai_voice_name}
            aiVoiceModel={story.ai_voice_model}
            allowTextToSpeech={false}
          />

          <main className="mb-8">
            {/* Photo Gallery */}
            <div className="space-y-6 mb-8">
              {story.photo_link_1 && (
                <div>
                  <img
                    src={story.photo_link_1}
                    alt={story.photo_alt_1 || story.title}
                    className="w-full rounded-lg shadow-lg border-4 border-white"
                  />
                  {story.photo_alt_1 && (
                    <p className="text-sm text-gray-600 italic mt-2 text-center">{story.photo_alt_1}</p>
                  )}
                </div>
              )}
              
              {story.photo_link_2 && (
                <div>
                  <img
                    src={story.photo_link_2}
                    alt={story.photo_alt_2 || story.title}
                    className="w-full rounded-lg shadow-lg border-4 border-white"
                  />
                  {story.photo_alt_2 && (
                    <p className="text-sm text-gray-600 italic mt-2 text-center">{story.photo_alt_2}</p>
                  )}
                </div>
              )}
              
              {story.photo_link_3 && (
                <div>
                  <img
                    src={story.photo_link_3}
                    alt={story.photo_alt_3 || story.title}
                    className="w-full rounded-lg shadow-lg border-4 border-white"
                  />
                  {story.photo_alt_3 && (
                    <p className="text-sm text-gray-600 italic mt-2 text-center">{story.photo_alt_3}</p>
                  )}
                </div>
              )}
            </div>

            <div
              className="story-content"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <StoryContentRenderer content={story.content || "No content available."} />
            </div>

            <div className="mt-8 text-center">
              <Button onClick={toggleStoryCode} variant="secondary" size="sm">
                {showStoryCode ? "Hide Story Code" : "Show Story Code"}
              </Button>
              {showStoryCode && (
                <div className="mt-2 text-gray-600">Story Code: {story.story_code}</div>
              )}
            </div>
          </main>

          {/* Comment section will be added when the CommentSection component is available */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-center">Comments section coming soon...</p>
          </div>
        </div>
        <CookieFreeFooter />
      </div>
    </ContentProtection>
  );
};

export default Story;
