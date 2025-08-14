import { useParams, useNavigate } from "react-router-dom";
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

// Add print-friendly CSS styles
const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-friendly {
      background: white !important;
      color: black !important;
      box-shadow: none !important;
      border: 1px solid #ccc !important;
    }
    .print-header {
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .print-photo {
      max-width: 300px !important;
      height: auto !important;
    }
    body { 
      background: white !important; 
      font-size: 12pt !important;
      line-height: 1.4 !important;
    }
    .container { 
      margin: 0 !important; 
      padding: 10px !important; 
      max-width: none !important; 
    }
  }
`;

const AuthorBio = () => {
  const { authorName } = useParams();
  const navigate = useNavigate();

  // Decode the author name (which is bio_subject_name for BioText stories)
  const decodedSubjectName = authorName ? decodeURIComponent(authorName) : '';

  const { data: authorBio, isLoading: bioLoading } = useQuery({
    queryKey: ['author-bio-biotext', authorName],
    queryFn: async () => {
      if (!authorName) return null;
      
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('category', 'BioText')
        .eq('bio_subject_name', decodedSubjectName)
        .eq('published', 'Y')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching biography:', error);
        throw error;
      }
      
      return data;
    },
  });

  const { data: authorStories, isLoading: storiesLoading } = useQuery({
    queryKey: ['author-other-stories', authorName],
    queryFn: async () => {
      if (!authorName || !authorBio) return [];
      
      // Get other stories by the same author (excluding the biography itself)
      const { data, error } = await supabase
        .from('stories')
        .select('id, story_code, title, author, category, read_count, updated_at, created_at, tagline, excerpt')
        .eq('author', authorBio.author)
        .eq('published', 'Y')
        .neq('id', authorBio.id) // Exclude the biography story itself
        .order('title', { ascending: true });
      
      if (error) {
        console.error('Error fetching author stories:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!authorBio, // Only run when we have the biography
  });

  if (bioLoading || storiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <LoadingSpinner message="Loading biography..." />
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleEditStory = (story: any) => {
    // Navigate to the story page for public viewing
    navigate(`/story/${story.story_code}`);
  };

  const handleViewAuthorBio = (authorName: string) => {
    // Navigate to the author bio page
    navigate(`/author/${encodeURIComponent(authorName)}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <div className="no-print">
          <WelcomeHeader />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">

            <Card className="mb-8 print-friendly">
              <CardContent className="p-8">
                <div className="print-header">
                  <h1 className="text-4xl font-bold text-amber-800 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {decodedSubjectName}
                  </h1>
                  
                  {authorBio && (
                    <div className="text-amber-600 mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      <p className="text-lg mb-2">
                        <strong>Biography written by:</strong> {authorBio.author}
                      </p>
                      
                      {/* Bio-specific information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {authorBio.born_date && (
                          <p><strong>Born:</strong> {formatDate(authorBio.born_date)}</p>
                        )}
                        {authorBio.died_date && (
                          <p><strong>Died:</strong> {formatDate(authorBio.died_date)}</p>
                        )}
                        {authorBio.native_country && (
                          <p><strong>Country:</strong> {authorBio.native_country}</p>
                        )}
                        {authorBio.native_language && (
                          <p><strong>Native Language:</strong> {authorBio.native_language}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Gallery - Support for up to 3 photos */}
                {authorBio && (authorBio.photo_link_1 || authorBio.photo_link_2 || authorBio.photo_link_3) && (
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {authorBio.photo_link_1 && (
                        <div className="overflow-hidden rounded-lg">
                          <img 
                            src={authorBio.photo_link_1} 
                            alt={authorBio.photo_alt_1 || `Photo of ${decodedSubjectName}`}
                            className="w-full h-64 object-cover print-photo"
                          />
                          {authorBio.photo_alt_1 && (
                            <p className="text-sm text-gray-600 mt-2 text-center italic">
                              {authorBio.photo_alt_1}
                            </p>
                          )}
                        </div>
                      )}
                      {authorBio.photo_link_2 && (
                        <div className="overflow-hidden rounded-lg">
                          <img 
                            src={authorBio.photo_link_2} 
                            alt={authorBio.photo_alt_2 || `Photo of ${decodedSubjectName}`}
                            className="w-full h-64 object-cover print-photo"
                          />
                          {authorBio.photo_alt_2 && (
                            <p className="text-sm text-gray-600 mt-2 text-center italic">
                              {authorBio.photo_alt_2}
                            </p>
                          )}
                        </div>
                      )}
                      {authorBio.photo_link_3 && (
                        <div className="overflow-hidden rounded-lg">
                          <img 
                            src={authorBio.photo_link_3} 
                            alt={authorBio.photo_alt_3 || `Photo of ${decodedSubjectName}`}
                            className="w-full h-64 object-cover print-photo"
                          />
                          {authorBio.photo_alt_3 && (
                            <p className="text-sm text-gray-600 mt-2 text-center italic">
                              {authorBio.photo_alt_3}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {authorBio ? (
                  <div 
                    className="text-amber-700 leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '16px' }}
                  >
                    {authorBio.content}
                  </div>
                ) : (
                  <div className="text-amber-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <p>No biography available for {decodedSubjectName} yet.</p>
                    <p className="mt-4">
                      <Link to="/author-bios-simple" className="text-amber-600 hover:text-amber-800 underline">
                        View all available biographies →
                      </Link>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Other stories by the same author */}
            {authorBio && authorStories && authorStories.length > 0 && (
              <div className="mb-6 no-print">
                <h2 className="text-2xl font-bold text-amber-800 mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Other Stories by {authorBio.author}
                </h2>
                
                <AuthorStoriesTable stories={authorStories} />
              </div>
            )}
          </div>
        </div>
        
        <div className="no-print">
          <CookieFreeFooter />
          <ScrollToTop />
        </div>
      </div>
    </>
  );
};

export default AuthorBio;