import { maskPersonalId } from '@/utils/personalIdUtils';

export interface TokenReplacementContext {
  personalId?: string;
  story?: {
    title?: string;
    story_code?: string;
    author?: string;
    category?: string;
  };
}

/**
 * Replaces token placeholders in content with actual values
 * Supports: {{DATE}}, {{TIME}}, {{PID}}, {{YEAR}}, {{STORY_TITLE}}, {{STORY_CODE}}, {{AUTHOR}}, {{CATEGORY}}
 */
export const replaceTokens = (content: string, context: TokenReplacementContext = {}): string => {
  const now = new Date();
  
  // Date and time tokens
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
  const year = now.getFullYear().toString();
  
  // Personal ID token
  const maskedPid = context.personalId ? maskPersonalId(context.personalId) : '';
  
  // Story-related tokens
  const storyTitle = context.story?.title || '';
  const storyCode = context.story?.story_code || '';
  const author = context.story?.author || '';
  const category = context.story?.category || '';
  
  return content
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{TIME\}\}/g, time)
    .replace(/\{\{YEAR\}\}/g, year)
    .replace(/\{\{ThisYear\}\}/g, year) // Alias for {{YEAR}}
    .replace(/\{\{PID\}\}/g, maskedPid)
    .replace(/\{\{STORY_TITLE\}\}/g, storyTitle)
    .replace(/\{\{STORY_CODE\}\}/g, storyCode)
    .replace(/\{\{AUTHOR\}\}/g, author)
    .replace(/\{\{CATEGORY\}\}/g, category);
};