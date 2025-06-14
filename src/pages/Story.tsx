import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <BookOpen className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-orange-700 text-lg">Loading your story...</p>
          </div>
        </div>
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

  const cleanHtmlContent = (htmlContent: string) => {
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove unnecessary nested divs and clean up structure
    const cleanElement = (element: Element) => {
      // Convert div elements that only contain text or simple content to paragraphs
      if (element.tagName === 'DIV') {
        const hasOnlyTextOrInlineContent = Array.from(element.childNodes).every(node => 
          node.nodeType === Node.TEXT_NODE || 
          (node.nodeType === Node.ELEMENT_NODE && ['SPAN', 'STRONG', 'EM', 'B', 'I', 'BR'].includes((node as Element).tagName))
        );
        
        if (hasOnlyTextOrInlineContent && element.textContent?.trim()) {
          const p = document.createElement('p');
          p.innerHTML = element.innerHTML;
          element.parentNode?.replaceChild(p, element);
          return;
        }
        
        // Remove empty divs
        if (!element.textContent?.trim() && !element.querySelector('br')) {
          element.remove();
          return;
        }
        
        // If div only contains other divs, unwrap it
        const childDivs = element.querySelectorAll(':scope > div');
        if (childDivs.length === element.children.length && element.children.length > 0) {
          const parent = element.parentNode;
          if (parent) {
            while (element.firstChild) {
              parent.insertBefore(element.firstChild, element);
            }
            element.remove();
            return;
          }
        }
      }
      
      // Clean children recursively
      Array.from(element.children).forEach(cleanElement);
    };
    
    // Clean all elements
    Array.from(tempDiv.children).forEach(cleanElement);
    
    // Convert remaining empty divs to paragraph breaks
    tempDiv.querySelectorAll('div').forEach(div => {
      if (!div.textContent?.trim()) {
        const br = document.createElement('br');
        div.parentNode?.replaceChild(br, div);
      }
    });
    
    return tempDiv.innerHTML;
  };

  const formatContent = (content: string) => {
    const cleanedContent = cleanHtmlContent(content);
    
    return (
      <div 
        className="prose prose-orange max-w-none text-gray-800 leading-relaxed story-content"
        style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '16px',
        }}
        dangerouslySetInnerHTML={{ __html: cleanedContent }}
      />
    );
  };

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
      <CookieFreeFooter />
    </div>
  );
};

export default Story;
