
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
          .story-content {
            font-family: Georgia, serif;
            font-size: 18px;
            color: #000000;
            line-height: 1.6;
            font-weight: normal;
            font-style: normal;
            white-space: pre-line;
          }
          
          .story-content * {
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
          }
          
          .story-content p {
            margin: 0 0 1.5em 0;
            font-family: Georgia, serif;
            font-size: 18px;
            color: #000000;
            line-height: 1.6;
            font-weight: normal;
            font-style: normal;
            white-space: pre-line;
          }
          
          .story-content p:last-child {
            margin-bottom: 0;
          }
          
          .story-content br {
            line-height: 1.6;
          }
          
          .story-content div {
            margin: 0 0 1.5em 0;
            font-family: Georgia, serif;
            font-size: 18px;
            color: #000000;
            line-height: 1.6;
            white-space: pre-line;
          }
          
          .story-content h1 {
            font-size: 2em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content h2 {
            font-size: 1.5em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content h3 {
            font-size: 1.17em !important;
            font-weight: bold !important;
            margin: 0 0 1.5em 0 !important;
            font-family: Georgia, serif !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content ul {
            list-style-type: disc;
            margin: 0 0 1.5em 0;
            padding-left: 2em;
            font-family: Georgia, serif;
            font-size: 18px;
            color: #000000;
            line-height: 1.6;
          }
          
          .story-content ol {
            list-style-type: decimal;
            margin: 0 0 1.5em 0;
            padding-left: 2em;
            font-family: Georgia, serif;
            font-size: 18px;
            color: #000000;
            line-height: 1.6;
          }
          
          .story-content li {
            margin: 0.25em 0;
            font-family: Georgia, serif;
            font-size: 18px;
            color: #000000;
            line-height: 1.6;
          }
          
          .story-content a {
            color: #3b82f6 !important;
            text-decoration: underline;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            line-height: 1.6 !important;
          }
          
          .story-content strong,
          .story-content b {
            font-weight: bold !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content em,
          .story-content i {
            font-style: italic !important;
            font-family: Georgia, serif !important;
            font-size: 18px !important;
            color: #000000 !important;
            line-height: 1.6 !important;
          }
          
          .story-content u {
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
            <p className="story-content">
              {excerpt}
            </p>
          </div>
        )
      )}
    </>
  );
};

export default StoryContent;
