import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User, Calendar } from "lucide-react";
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

  const renderCategoryBadge = (category: string) => {
    if (category === "Life") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-fun ${getCategoryStyles(category)}`}>
          Lessons and Stories From Grandpa John's Life
        </span>
      );
    }

    if (category === "World Changers") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-fun ${getCategoryStyles(category)}`}>
          World Changers — Real People Who Made A Difference
        </span>
      );
    }

    if (category === "North Pole") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-fun ${getCategoryStyles(category)}`}>
          Stories from the North Pole
        </span>
      );
    }

    if (category === "Fun") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-fun ${getCategoryStyles(category)}`}>
          Fun Jokes, Poems, Games & More
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-fun ${getCategoryStyles(category)}`}>
        {category}
      </span>
    );
  };

  const formatContent = (content: string) => {
    return (
      <div 
        className="prose prose-orange max-w-none text-gray-800 leading-relaxed"
        style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '16px',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <style dangerouslySetInnerHTML={{
        __html: `
          .prose p:empty {
            margin: 1em 0;
            height: 1em;
          }
          .prose br {
            display: block;
            margin: 0.5em 0;
            content: "";
          }
          .prose p {
            margin: 1em 0;
          }
          .prose p:first-child {
            margin-top: 0;
          }
          .prose p:last-child {
            margin-bottom: 0;
          }
        `
      }} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Link>

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

              {story.content ? (
                formatContent(story.content)
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
        </div>
      </div>
    </div>
  );
};

export default Story;
