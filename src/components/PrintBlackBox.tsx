import React, { useState, useEffect } from 'react';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { usePersonalId } from '@/hooks/usePersonalId';
import SecureStoryContent from '@/components/secure/SecureStoryContent';
import { replaceTokens, TokenReplacementContext } from '@/utils/printTokens';
import { extractHeaderTokens, createSafeHeaderHtml } from '@/utils/headerTokens';

interface PrintBlackBoxProps {
  storyContext?: {
    title?: string;
    story_code?: string;
    author?: string;
    category?: string;
  };
}

const PrintBlackBox: React.FC<PrintBlackBoxProps> = ({ storyContext }) => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { lookupStoryByCode } = useStoryCodeLookup();
  const { personalId } = usePersonalId();

  useEffect(() => {
    const fetchBlackBoxContent = async () => {
      try {
        const result = await lookupStoryByCode('PRT-CRO', true);
        if (result.found && result.story) {
          // Extract header tokens and get clean content
          const extracted = extractHeaderTokens(result.story.content || '');
          
          // Set title for display above the black box
          setTitle(extracted.tokens.title || '');
          
          // Process the cleaned content with print tokens
          const tokenContext: TokenReplacementContext = {
            personalId,
            story: storyContext
          };
          const processedContent = replaceTokens(extracted.contentWithoutTokens, tokenContext);
          setContent(processedContent);
        }
      } catch (error) {
        console.error('Error fetching PRT-CRO content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlackBoxContent();
  }, [lookupStoryByCode, personalId, storyContext]);

  if (loading || !content) {
    return null;
  }

  return (
    <div className="print-black-box max-w-2xl mx-auto">
      {title && <div className="print-black-box-title">{title}</div>}
      <div className="print-black-box-content">
        <SecureStoryContent content={content} />
      </div>
    </div>
  );
};

export default PrintBlackBox;