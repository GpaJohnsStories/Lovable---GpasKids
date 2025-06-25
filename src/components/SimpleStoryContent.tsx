
import { formatSimpleContent } from "@/utils/simpleContentUtils";

interface SimpleStoryContentProps {
  content?: string;
  excerpt?: string;
}

const SimpleStoryContent = ({ content, excerpt }: SimpleStoryContentProps) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .simple-story-content {
            font-family: Georgia, serif;
            font-size: 18px;
            color: #000000;
            line-height: 1.6;
          }
          
          .simple-story-content p {
            margin: 0 0 16px 0;
            line-height: 1.6;
          }
          
          .simple-story-content p:last-child {
            margin-bottom: 0;
          }
          
          .simple-story-content br {
            line-height: 1.6;
          }
          
          .simple-story-content strong,
          .simple-story-content b {
            font-weight: bold;
          }
          
          .simple-story-content em,
          .simple-story-content i {
            font-style: italic;
          }
          
          .simple-story-content u {
            text-decoration: underline;
          }
          
          /* Text alignment */
          .simple-story-content [style*="text-align: center"] {
            text-align: center;
          }
          
          .simple-story-content [style*="text-align: right"] {
            text-align: right;
          }
          
          .simple-story-content [style*="text-align: left"] {
            text-align: left;
          }
        `
      }} />
      
      {content ? (
        <div 
          className="simple-story-content"
          dangerouslySetInnerHTML={formatSimpleContent(content)}
        />
      ) : (
        excerpt && (
          <div className="simple-story-content">
            <p>{excerpt}</p>
          </div>
        )
      )}
    </>
  );
};

export default SimpleStoryContent;
