
import { formatStoryContent } from "@/utils/storyContentUtils";

interface StoryContentProps {
  content?: string;
  excerpt?: string;
}

const StoryContent = ({ content, excerpt }: StoryContentProps) => {
  return (
    <>
      {content ? (
        <font face="Georgia, serif" color="#000000" style={{ fontSize: '18px', lineHeight: '1.6', fontWeight: 'normal', fontStyle: 'normal' }}>
          <div 
            style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '18px', 
              color: '#000000', 
              lineHeight: '1.6',
              fontWeight: 'normal',
              fontStyle: 'normal'
            }}
            dangerouslySetInnerHTML={formatStoryContent(content)}
          />
        </font>
      ) : (
        excerpt && (
          <font face="Georgia, serif" color="#000000" style={{ fontSize: '18px', lineHeight: '1.6', fontWeight: 'normal', fontStyle: 'normal' }}>
            <p style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '18px', 
              color: '#000000', 
              fontWeight: 'normal',
              lineHeight: '1.6',
              margin: '0 0 1.5em 0'
            }}>
              {excerpt}
            </p>
          </font>
        )
      )}
    </>
  );
};

export default StoryContent;
