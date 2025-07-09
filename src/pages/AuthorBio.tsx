import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import AuthorStoriesTable from "@/components/AuthorStoriesTable";

const AuthorBio = () => {
  const { authorName } = useParams();

  const { data: authorBio, isLoading: bioLoading } = useQuery({
    queryKey: ['author-bio', authorName],
    queryFn: async () => {
      if (!authorName) return null;
      
      const { data, error } = await supabase
        .from('author_bios')
        .select('*')
        .eq('author_name', decodeURIComponent(authorName))
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching author bio:', error);
        throw error;
      }
      
      return data;
    },
  });

  const { data: authorStories, isLoading: storiesLoading } = useQuery({
    queryKey: ['author-stories', authorName],
    queryFn: async () => {
      if (!authorName) return [];
      
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author', decodeURIComponent(authorName))
        .eq('published', 'Y')
        .order('title', { ascending: true });
      
      if (error) {
        console.error('Error fetching author stories:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  if (bioLoading || storiesLoading) {
    return (
      <ContentProtection enableProtection={true}>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
          <WelcomeHeader />
          <LoadingSpinner message="Loading author information..." />
          <CookieFreeFooter />
          <ScrollToTop />
        </div>
      </ContentProtection>
    );
  }

  const decodedAuthorName = authorName ? decodeURIComponent(authorName) : '';

  const handleEditStory = (story: any) => {
    // Navigate to the story page for public viewing
    window.location.href = `/story/${story.id}`;
  };

  const handleViewAuthorBio = (authorName: string) => {
    // Navigate to the author bio page
    window.location.href = `/author/${encodeURIComponent(authorName)}`;
  };

  return (
    <ContentProtection enableProtection={true}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link to="/library">
                <Button className="cozy-button mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Library
                </Button>
              </Link>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-amber-800 mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  About {decodedAuthorName}
                </h1>
                
                {authorBio ? (
                  <div 
                    className="text-amber-700 leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '16px' }}
                  >
                    {authorBio.bio_content}
                  </div>
                ) : (
                  <div className="text-amber-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <p>No biography available for this author yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Stories by {decodedAuthorName}
              </h2>
              
              {authorStories && authorStories.length > 0 ? (
                <AuthorStoriesTable stories={authorStories} />
              ) : (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center py-8">
                      <p className="text-amber-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        No published stories found for this author.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </ContentProtection>
  );
};

export default AuthorBio;