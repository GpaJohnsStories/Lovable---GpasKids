
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
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .simple-story-content *,
          .simple-story-content p,
          .simple-story-content div,
          .simple-story-content span,
          .simple-story-content strong,
          .simple-story-content b,
          .simple-story-content em,
          .simple-story-content i,
          .simple-story-content u {
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .simple-story-content p {
            margin: 0 0 16px 0 !important;
            line-height: 1.6 !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
          }
          
          .simple-story-content p:last-child {
            margin-bottom: 0 !important;
          }
          
          .simple-story-content br {
            line-height: 1.6 !important;
          }
          
          .simple-story-content strong,
          .simple-story-content b {
            font-weight: bold !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
          }
          
          .simple-story-content em,
          .simple-story-content i {
            font-style: italic !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
          }
          
          .simple-story-content u {
            text-decoration: underline !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
          }
          
          /* Text alignment */
          .simple-story-content [style*="text-align: center"] {
            text-align: center !important;
          }
          
          .simple-story-content [style*="text-align: right"] {
            text-align: right !important;
          }
          
          .simple-story-content [style*="text-align: left"] {
            text-align: left !important;
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
