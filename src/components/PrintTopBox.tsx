import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import SecureStoryContent from '@/components/secure/SecureStoryContent';

interface PrintTopBoxProps {
  copyrightStatus: string;
}

const PrintTopBox: React.FC<PrintTopBoxProps> = ({ copyrightStatus }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { lookupStoryByCode } = useStoryCodeLookup();

  useEffect(() => {
    const fetchTopBoxContent = async () => {
      // Only show for Limited copyright
      if (copyrightStatus !== 'L') {
        setLoading(false);
        return;
      }

      try {
        const result = await lookupStoryByCode('PRT-LTP', true);
        if (result.found && result.story) {
          setContent(result.story.content || '');
        }
      } catch (error) {
        console.error('Error fetching PRT-LTP content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBoxContent();
  }, [copyrightStatus, lookupStoryByCode]);

  if (copyrightStatus !== 'L' || loading || !content) {
    return null;
  }

  return (
    <div className="print-top-box">
      <SecureStoryContent 
        content={content}
        className=""
      />
    </div>
  );
};

export default PrintTopBox;
