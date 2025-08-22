import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { usePersonalId } from '@/hooks/usePersonalId';
import SecureStoryContent from '@/components/secure/SecureStoryContent';
import { replaceTokens, TokenReplacementContext } from '@/utils/printTokens';
import { extractHeaderTokens } from '@/utils/headerTokens';

interface PrintCopyrightFooterProps {
  storyContext?: {
    title?: string;
    story_code?: string;
    author?: string;
    category?: string;
  };
}

const PrintCopyrightFooter: React.FC<PrintCopyrightFooterProps> = ({ storyContext }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { lookupStoryByCode } = useStoryCodeLookup();
  const { personalId } = usePersonalId();

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const result = await lookupStoryByCode('PRT-COF', true);
        if (result.found && result.story) {
          // Extract header tokens and get clean content
          const extracted = extractHeaderTokens(result.story.content || '');
          
          // Process the cleaned content with print tokens
          const tokenContext: TokenReplacementContext = {
            personalId,
            story: storyContext
          };
          const processedContent = replaceTokens(extracted.contentWithoutTokens, tokenContext);
          setContent(processedContent);
        }
      } catch (error) {
        console.error('Error fetching PRT-COF content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterContent();
  }, [lookupStoryByCode, personalId, storyContext]);

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