import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import SecureStoryContent from '@/components/secure/SecureStoryContent';

interface PrintBlackBoxProps {
  show: boolean;
}

const PrintBlackBox: React.FC<PrintBlackBoxProps> = ({ show }) => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { lookupStoryByCode } = useStoryCodeLookup();

  useEffect(() => {
    const fetchBlackBoxContent = async () => {
      try {
        const result = await lookupStoryByCode('PRT-CRO', true);
        if (result.found && result.story) {
          setTitle(result.story.title || '');
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

  if (!show || loading || !content) {
    return null;
  }

  return (
    <div className="print-black-box">
      {title && <div className="print-black-box-title">{title}</div>}
      <div className="print-black-box-content">
        <SecureStoryContent content={content} />
      </div>
    </div>
  );
};

export default PrintBlackBox;