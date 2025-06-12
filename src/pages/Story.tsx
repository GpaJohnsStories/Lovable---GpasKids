
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User, Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Story = () => {
  const { id } = useParams();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-orange-700 text-lg">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
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
    );
  }

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "Fun":
        return "bg-blue-500 text-white";
      case "Life":
        return "bg-green-500 text-white";
      case "North Pole":
        return "bg-red-600 text-white";
      case "World Changers":
        return "bg-amber-400 text-amber-900";
      default:
        return "bg-amber-200 text-amber-800";
    }
  };

  const formatContent = (content: string) => {
    // Split by double line breaks to create paragraphs
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-orange-800 leading-relaxed">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Link>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-fun ${getCategoryStyles(story.category)}`}>
                  {story.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-orange-800 text-center mb-4 leading-tight">
                {story.title}
              </h1>

              <div className="flex items-center justify-center space-x-6 text-sm text-orange-600 mb-6">
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
                <p className="text-lg text-orange-700 text-center mb-6 italic">
                  {story.tagline}
                </p>
              )}

              {story.content ? (
                <div className="prose prose-orange max-w-none">
                  <div className="text-lg font-serif leading-relaxed">
                    {formatContent(story.content)}
                  </div>
                  
                  {story.google_drive_link && (
                    <div className="mt-8 pt-6 border-t border-orange-200">
                      <p className="text-orange-600 text-center mb-4">
                        Want to read this story in a different format?
                      </p>
                      <div className="text-center">
                        <a 
                          href={story.google_drive_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in Google Drive
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {story.excerpt && (
                    <div className="prose prose-orange max-w-none mb-6">
                      <p className="text-orange-700 leading-relaxed text-base">
                        {story.excerpt}
                      </p>
                    </div>
                  )}

                  {story.google_drive_link && (
                    <div className="text-center mt-8">
                      <a 
                        href={story.google_drive_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button className="cozy-button text-lg px-8 py-4">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Read Full Story
                        </Button>
                      </a>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Story;
