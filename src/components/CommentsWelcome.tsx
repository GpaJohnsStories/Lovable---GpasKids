import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CommentsWelcome = () => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommentsWelcome = async () => {
      try {
        const { data: story, error } = await supabase
          .from('stories')
          .select('content')
          .eq('story_code', 'SYS-CCW')
          .eq('published', 'Y')
          .single();

        if (error) {
          console.error('Error fetching SYS-CCW content:', error);
          // Fallback to default content
          setContent(`
            <h1 class="text-3xl font-bold text-center text-orange-800 mb-4 font-fun">
              Comments, Questions & Feedback
            </h1>
            
            <p class="text-center text-orange-800 font-fun text-xl mb-8">
              Hi Kids! We want to hear what you think about our website! Do you have a question? Do you have an idea? Or just want to tell us what you like? Please share your thoughts below!
              <br /><br />
              Before you write, please read these simple rules with a grown-up to help keep our website a happy and safe place for everyone.
            </p>
          `);
        } else if (story?.content) {
          setContent(story.content);
        }
      } catch (error) {
        console.error('Unexpected error fetching SYS-CCW content:', error);
        // Fallback content on error
        setContent(`
          <h1 class="text-3xl font-bold text-center text-orange-800 mb-4 font-fun">
            Comments, Questions & Feedback
          </h1>
          
          <p class="text-center text-orange-800 font-fun text-xl mb-8">
            Hi Kids! We want to hear what you think about our website! Please share your thoughts below!
          </p>
        `);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentsWelcome();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200 relative">
        <div className="text-center text-orange-800 font-fun text-xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200 relative">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
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
        SYS-CCW
      </div>
    </div>
  );
};

export default CommentsWelcome;