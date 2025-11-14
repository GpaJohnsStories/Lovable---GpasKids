import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import SecureStoryContent from '@/components/secure/SecureStoryContent';

interface PrintCopyrightFooterProps {}

const PrintCopyrightFooter: React.FC<PrintCopyrightFooterProps> = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { lookupStoryByCode } = useStoryCodeLookup();

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const result = await lookupStoryByCode('PRT-COF', true);
        if (result.found && result.story) {
          setContent(result.story.content || '');
        }
      } catch (error) {
        console.error('Error fetching PRT-COF content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterContent();
  }, [lookupStoryByCode]);

  if (loading || !content) {
    return null;
  }

  return (
    <div className="print-copyright-footer">
      <SecureStoryContent 
        content={content}
        className=""
      />
    </div>
  );
};

export default PrintCopyrightFooter;