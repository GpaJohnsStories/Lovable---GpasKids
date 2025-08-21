import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { usePersonalId } from '@/hooks/usePersonalId';
import { createSafeHtml } from '@/utils/xssProtection';
import { maskPersonalId } from '@/utils/personalIdUtils';

const PrintCopyrightFooter: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { lookupStoryByCode } = useStoryCodeLookup();
  const { personalId } = usePersonalId();

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const result = await lookupStoryByCode('PRT-COF', true);
        if (result.found && result.story) {
          let footerContent = result.story.content || '';
          
          // Replace tokens with actual values
          const now = new Date();
          const date = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          const time = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
          const maskedPid = personalId ? maskPersonalId(personalId) : '';
          
          footerContent = footerContent
            .replace(/\{\{DATE\}\}/g, date)
            .replace(/\{\{TIME\}\}/g, time)
            .replace(/\{\{PID\}\}/g, maskedPid);
          
          setContent(footerContent);
        }
      } catch (error) {
        console.error('Error fetching PRT-COF content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterContent();
  }, [lookupStoryByCode, personalId]);

  if (loading || !content) {
    return null;
  }

  return (
    <div className="print-copyright-footer">
      <div 
        dangerouslySetInnerHTML={createSafeHtml(content)}
      />
    </div>
  );
};

export default PrintCopyrightFooter;