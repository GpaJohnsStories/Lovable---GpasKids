
import { formatStoryContent } from "@/utils/storyContentUtils";

interface StoryContentProps {
  content?: string;
  excerpt?: string;
}

const StoryContent = ({ content, excerpt }: StoryContentProps) => {
  return (
    <>
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
      
      {content ? (
        <div 
          className="prose prose-orange max-w-none text-gray-800 leading-relaxed story-content"
          style={{ 
            fontFamily: 'Georgia, serif', 
            fontSize: '16px',
          }}
          dangerouslySetInnerHTML={formatStoryContent(content)}
        />
      ) : (
        excerpt && (
          <div className="prose prose-orange max-w-none">
            <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
              {excerpt}
            </p>
          </div>
        )
      )}
    </>
  );
};

export default StoryContent;
