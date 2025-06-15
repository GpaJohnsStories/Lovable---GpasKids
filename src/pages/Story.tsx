import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import StoryVoting from "@/components/StoryVoting";
import { renderCategoryBadge } from "@/utils/categoryUtils";
import { formatStoryContent } from "@/utils/storyContentUtils";
import { useState, useEffect } from "react";

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

  // Check for existing vote when story loads
  useEffect(() => {
    const checkExistingVote = async () => {
      if (!id) return;
      
      try {
        const { data: existingVote, error } = await supabase
          .from('story_votes')
          .select('vote_type')
          .eq('story_id', id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing vote:', error);
          return;
        }

        if (existingVote) {
          setCurrentVote(existingVote.vote_type as 'thumbs_up' | 'thumbs_down' | 'ok');
        }
      } catch (error) {
        console.error('Error checking existing vote:', error);
      }
    };

    checkExistingVote();
  }, [id]);

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

  // Helper function to get all available photos
  const getStoryPhotos = () => {
    if (!story) return [];
    const photos = [];
    if (story.photo_link_1) photos.push(story.photo_link_1);
    if (story.photo_link_2) photos.push(story.photo_link_2);
    if (story.photo_link_3) photos.push(story.photo_link_3);
    return photos;
  };

  const storyPhotos = getStoryPhotos();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <LoadingSpinner message="Loading your story..." />
        <CookieFreeFooter />
      </div>
    );
  }

  if (error || !story) {
    return (
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .story-content p {
            margin: 1em 0;
            min-height: 1.2em;
          }
          
          .story-content p:empty,
          .story-content p:has(br:only-child),
          .story-content p:has(&nbsp;:only-child) {
            height: 1.2em;
            margin: 1em 0;
          }
          
          .story-content p:first-child {
            margin-top: 0;
          }
          
          .story-content p:last-child {
            margin-bottom: 0;
          }
          
          .story-content br {
            display: block;
            margin: 0.5em 0;
            content: "";
          }
          
          .story-content div {
            margin: 0.5em 0;
          }
        `
      }} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Voting component at the top */}
          <div className="mb-8">
            <StoryVoting
              storyId={story.id}
              thumbsUpCount={story.thumbs_up_count || 0}
              thumbsDownCount={story.thumbs_down_count || 0}
              okCount={story.ok_count || 0}
              currentVote={currentVote}
              onVoteUpdate={handleVoteUpdate}
            />
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                {renderCategoryBadge(story.category)}
              </div>

              <h1 className="text-3xl font-bold text-orange-800 text-center mb-4 leading-tight">
                {story.title}
              </h1>

              <div className="flex items-center justify-center space-x-6 text-sm text-orange-600 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span className="font-medium">by {story.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(story.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {story.tagline && (
                <p className="text-lg text-orange-700 text-center mb-6 italic" style={{ fontFamily: 'Georgia, serif' }}>
                  {story.tagline}
                </p>
              )}

              {/* Story Photos Gallery */}
              {storyPhotos.length > 0 && (
                <div className="mb-8">
                  <div className={`grid gap-4 ${
                    storyPhotos.length === 1 ? 'grid-cols-1 justify-items-center' :
                    storyPhotos.length === 2 ? 'grid-cols-2' :
                    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {storyPhotos.map((photo, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border border-orange-200 shadow-sm">
                        <img
                          src={photo}
                          alt={`${story.title} - Photo ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {story.content ? (
                <div 
                  className="prose prose-orange max-w-none text-gray-800 leading-relaxed story-content"
                  style={{ 
                    fontFamily: 'Georgia, serif', 
                    fontSize: '16px',
                  }}
                  dangerouslySetInnerHTML={formatStoryContent(story.content)}
                />
              ) : (
                story.excerpt && (
                  <div className="prose prose-orange max-w-none">
                    <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                      {story.excerpt}
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Voting component at the bottom */}
          <div className="mb-8">
            <StoryVoting
              storyId={story.id}
              thumbsUpCount={story.thumbs_up_count || 0}
              thumbsDownCount={story.thumbs_down_count || 0}
              okCount={story.ok_count || 0}
              currentVote={currentVote}
              onVoteUpdate={handleVoteUpdate}
            />
          </div>
        </div>
      </div>
      <CookieFreeFooter />
    </div>
  );
};

export default Story;
