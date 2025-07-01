
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
          /* Use higher specificity selectors to override global styles */
          div.simple-story-content,
          div.simple-story-content *,
          div.simple-story-content p,
          div.simple-story-content div,
          div.simple-story-content span,
          div.simple-story-content strong,
          div.simple-story-content b,
          div.simple-story-content em,
          div.simple-story-content i,
          div.simple-story-content u {
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
            font-weight: normal !important;
            font-style: normal !important;
          }
          
          /* Override Tailwind classes specifically */
          div.simple-story-content p.text-2xl,
          div.simple-story-content p.text-amber-800,
          div.simple-story-content p.font-semibold {
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            font-weight: normal !important;
          }
          
          div.simple-story-content p {
            margin: 0 0 16px 0 !important;
            line-height: 1.6 !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            font-weight: normal !important;
            font-style: normal !important;
          }
          
          div.simple-story-content p:last-child {
            margin-bottom: 0 !important;
          }
          
          div.simple-story-content br {
            line-height: 1.6 !important;
          }
          
          div.simple-story-content strong,
          div.simple-story-content b {
            font-weight: bold !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            font-size: 18px !important;
          }
          
          div.simple-story-content em,
          div.simple-story-content i {
            font-style: italic !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            font-size: 18px !important;
          }
          
          div.simple-story-content u {
            text-decoration: underline !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            font-size: 18px !important;
          }
          
          /* Text alignment */
          div.simple-story-content [style*="text-align: center"] {
            text-align: center !important;
          }
          
          div.simple-story-content [style*="text-align: right"] {
            text-align: right !important;
          }
          
          div.simple-story-content [style*="text-align: left"] {
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
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#000000', fontWeight: 'normal' }}>
              {excerpt}
            </p>
          </div>
        )
      )}
    </>
  );
};

export default SimpleStoryContent;
