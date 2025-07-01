
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
          /* Use higher specificity selectors to override global styles */
          div.story-content,
          div.story-content *,
          div.story-content p,
          div.story-content div,
          div.story-content span,
          div.story-content strong,
          div.story-content b,
          div.story-content em,
          div.story-content i,
          div.story-content u {
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
            font-weight: normal !important;
            font-style: normal !important;
          }
          
          /* Override Tailwind classes specifically */
          div.story-content p.text-2xl,
          div.story-content p.text-amber-800,
          div.story-content p.font-semibold {
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            font-weight: normal !important;
          }
          
          div.story-content p {
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
            font-weight: normal !important;
            font-style: normal !important;
            white-space: pre-line;
          }
          
          div.story-content p:last-child {
            margin-bottom: 0 !important;
          }
          
          /* Preserve line breaks created by <br> tags */
          div.story-content br {
            display: block;
            content: "";
            margin-top: 0;
            line-height: 1.6 !important;
          }
          
          /* Remove any unwanted spacing from divs */
          div.story-content div {
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
            white-space: pre-line;
            font-weight: normal !important;
            font-style: normal !important;
          }
          
          /* Ensure centered content stays centered */
          div.story-content p[style*="text-align: center"],
          div.story-content div[style*="text-align: center"] {
            text-align: center !important;
          }
          
          /* Override any conflicting styles that might prevent centering */
          div.story-content [style*="text-align: center"] {
            text-align: center !important;
          }
          
          /* Fix line spacing for bold text within centered content */
          div.story-content p[style*="text-align: center"] strong,
          div.story-content p[style*="text-align: center"] b,
          div.story-content div[style*="text-align: center"] strong,
          div.story-content div[style*="text-align: center"] b {
            display: inline !important;
            line-height: 1.6 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            font-weight: bold !important;
          }
          
          /* Ensure line breaks within bold centered text work properly */
          div.story-content p[style*="text-align: center"] strong br,
          div.story-content p[style*="text-align: center"] b br,
          div.story-content div[style*="text-align: center"] strong br,
          div.story-content div[style*="text-align: center"] b br {
            line-height: 1.6 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          div.story-content h1 {
            font-size: 2em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content h2 {
            font-size: 1.5em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content h3 {
            font-size: 1.17em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content ul {
            list-style-type: disc;
            margin: 0 0 1.5em 0 !important;
            padding-left: 2em;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content ol {
            list-style-type: decimal;
            margin: 0 0 1.5em 0 !important;
            padding-left: 2em;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content li {
            margin: 0.25em 0 !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content a {
            color: #3b82f6 !important;
            text-decoration: underline;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            line-height: 1.6 !important;
          }
          
          div.story-content strong,
          div.story-content b {
            font-weight: bold !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content em,
          div.story-content i {
            font-style: italic !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          div.story-content u {
            text-decoration: underline !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
        `
      }} />
      
      {content ? (
        <div 
          className="prose prose-orange max-w-none story-content"
          dangerouslySetInnerHTML={formatStoryContent(content)}
        />
      ) : (
        excerpt && (
          <div className="prose prose-orange max-w-none">
            <p className="story-content" style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#000000', fontWeight: 'normal' }}>
              {excerpt}
            </p>
          </div>
        )
      )}
    </>
  );
};

export default StoryContent;
