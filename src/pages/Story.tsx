
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import StoryHeader from "@/components/StoryHeader";
import StoryPhotosGallery from "@/components/StoryPhotosGallery";
import StoryContent from "@/components/StoryContent";
import StoryVotingSection from "@/components/StoryVotingSection";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import { getStoryPhotos } from "@/utils/storyUtils";
import { useState } from "react";

const Story = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [currentVote, setCurrentVote] = useState<'thumbs_up' | 'thumbs_down' | 'ok' | null>(null);

  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching story:', error);
        throw error;
      }
      
      return data;
    },
  });

  const handleVoteUpdate = (newCounts: { thumbs_up_count: number; thumbs_down_count: number; ok_count: number }, newVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null) => {
    // Update the query cache with new vote counts
    queryClient.setQueryData(['story', id], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        thumbs_up_count: newCounts.thumbs_up_count,
        thumbs_down_count: newCounts.thumbs_down_count,
        ok_count: newCounts.ok_count
      };
    });
    
    // Update current vote state
    setCurrentVote(newVote);
  };

  const storyPhotos = getStoryPhotos(story);

  if (isLoading) {
    return (
      <ContentProtection enableProtection={true}>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
          <WelcomeHeader />
          <LoadingSpinner message="Loading your story..." />
          <CookieFreeFooter />
          <ScrollToTop />
        </div>
      </ContentProtection>
    );
  }

  if (error || !story) {
    return (
      <ContentProtection enableProtection={true}>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
          <WelcomeHeader />
          <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-orange-800 mb-4">Story Not Found</h1>
              <p className="text-orange-700 mb-6">The story you're looking for doesn't exist.</p>
              <Link to="/">
                <Button className="cozy-button">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Stories
                </Button>
              </Link>
            </div>
          </div>
          <CookieFreeFooter />
          <ScrollToTop />
        </div>
      </ContentProtection>
    );
  }

  return (
    <ContentProtection enableProtection={true}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <StoryVotingSection
              storyId={story.id}
              storyCode={story.story_code}
              storyTitle={story.title}
              thumbsUpCount={story.thumbs_up_count || 0}
              thumbsDownCount={story.thumbs_down_count || 0}
              okCount={story.ok_count || 0}
              currentVote={currentVote}
              onVoteUpdate={handleVoteUpdate}
            />

            <Card className="mb-8">
              <CardContent className="p-8">
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
                />

                <StoryPhotosGallery
                  photos={storyPhotos}
                  storyTitle={story.title}
                />

                <StoryContent
                  content={story.content}
                  excerpt={story.excerpt}
                />
              </CardContent>
            </Card>

            <StoryVotingSection
              storyId={story.id}
              storyCode={story.story_code}
              storyTitle={story.title}
              thumbsUpCount={story.thumbs_up_count || 0}
              thumbsDownCount={story.thumbs_down_count || 0}
              okCount={story.ok_count || 0}
              currentVote={currentVote}
              onVoteUpdate={handleVoteUpdate}
            />
          </div>
        </div>
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </ContentProtection>
  );
};

export default Story;
