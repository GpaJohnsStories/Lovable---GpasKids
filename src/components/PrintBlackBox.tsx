import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { createSafeHtml } from '@/utils/xssProtection';

const PrintBlackBox: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { lookupStoryByCode } = useStoryCodeLookup();

  useEffect(() => {
    const fetchBlackBoxContent = async () => {
      try {
        const result = await lookupStoryByCode('PRT-CRO', true);
        if (result.found && result.story) {
          setContent(result.story.content || '');
        }
      } catch (error) {
        console.error('Error fetching PRT-CRO content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlackBoxContent();
  }, [lookupStoryByCode]);

  if (loading || !content) {
    return null;
  }

  return (
    <div className="print-black-box">
      <div 
        dangerouslySetInnerHTML={createSafeHtml(content)}
      />
    </div>
  );
};

export default PrintBlackBox;