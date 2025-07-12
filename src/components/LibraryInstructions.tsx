import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const LibraryInstructions = () => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryInstructions = async () => {
      try {
        const { data: story, error } = await supabase
          .from('stories')
          .select('content')
          .eq('story_code', 'SYS-LIB')
          .eq('published', 'Y')
          .single();

        if (error) {
          console.error('Error fetching SYS-LIB content:', error);
          // Fallback to default content
          setContent(`
            <div style="margin-bottom: 16px; text-align: center;">
              Hover over a story title and it will turn red.<br />Click on a story title and it will take you to the story page where you may enjoy it.
            </div>
            <div style="margin-bottom: 16px; text-align: center;">
              Click on any column heading to sort the library by that column.<br />The first click will always sort down and the next click will sort up.
            </div>
            <div style="text-align: center;">
              As more stories are loaded, you may want to keep a note on your device or even use<br />pencil and paper to record the Story Code so you can find it easily in the future.
            </div>
          `);
        } else if (story?.content) {
          setContent(story.content);
        }
      } catch (error) {
        console.error('Unexpected error fetching SYS-LIB content:', error);
        // Fallback content
        setContent(`
          <div style="margin-bottom: 16px; text-align: center;">
            Hover over a story title and it will turn red.<br />Click on a story title and it will take you to the story page where you may enjoy it.
          </div>
          <div style="margin-bottom: 16px; text-align: center;">
            Click on any column heading to sort the library by that column.<br />The first click will always sort down and the next click will sort up.
          </div>
          <div style="text-align: center;">
            As more stories are loaded, you may want to keep a note on your device or even use<br />pencil and paper to record the Story Code so you can find it easily in the future.
          </div>
        `);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryInstructions();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div style={{ 
          color: '#000000',
          fontSize: '18px',
          fontStyle: 'italic',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          lineHeight: '1.6',
          fontWeight: 'normal',
          textAlign: 'center'
        }}>
          Loading instructions...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 relative">
      <div style={{ 
        color: '#000000',
        fontSize: '18px',
        fontStyle: 'italic',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: '1.6',
        fontWeight: 'normal'
      }}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      
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
        SYS-LIB
      </div>
    </div>
  );
};

export default LibraryInstructions;