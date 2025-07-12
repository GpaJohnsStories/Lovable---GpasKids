import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "./LoadingSpinner";

const CommentsRules = () => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommentsRules = async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('content')
          .eq('story_code', 'SYS-CCR')
          .eq('published', 'Y')
          .single();

        if (error) {
          console.error('Error fetching comments rules:', error);
          // Fallback content if fetch fails
          setContent(`
            <div class="font-fun text-orange-800 bg-amber-100/60 p-6 rounded-lg border-2 border-orange-200 text-xl mb-8">
              <p class="text-center mb-6">
                Please follow these simple rules to make this a fun and safe place for everyone.
              </p>
              <div class="space-y-4 text-left">
                <div>
                  <h3 class="text-xl font-bold">1. Be Kind! 👍</h3>
                  <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
                    <li>Always use kind words and be nice to everyone.</li>
                  </ul>
                </div>
              </div>
            </div>
          `);
        } else {
          setContent(data.content || '');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setContent('<p class="text-orange-800">Loading rules...</p>');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentsRules();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* Web-text code indicator */}
      <div style={{ 
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        fontSize: '12px',
        color: '#666',
        fontFamily: 'monospace',
        fontWeight: 'normal',
        opacity: 0.7
      }}>
        SYS-CCR
      </div>
    </div>
  );
};

export default CommentsRules;