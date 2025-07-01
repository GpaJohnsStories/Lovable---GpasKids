
import { formatSimpleContent } from "@/utils/simpleContentUtils";

interface SimpleStoryContentProps {
  content?: string;
  excerpt?: string;
}

const SimpleStoryContent = ({ content, excerpt }: SimpleStoryContentProps) => {
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
            dangerouslySetInnerHTML={formatSimpleContent(content)}
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

export default SimpleStoryContent;
