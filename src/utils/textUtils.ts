
/**
 * Counts words in a text string, ignoring HTML tags
 * @param text - The text to count words in
 * @returns The number of words
 */
export const countWords = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  
  // Remove HTML tags
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Count words (split by whitespace and filter out empty strings)
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

/**
 * Truncates text to a specified word limit
 * @param text - The text to truncate
 * @param wordLimit - Maximum number of words allowed
 * @returns Truncated text
 */
export const truncateToWordLimit = (text: string, wordLimit: number): string => {
  if (!text || text.trim() === '') return text;
  
  // Remove HTML tags for word counting
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  
  if (words.length <= wordLimit) {
    return text; // Return original text if within limit
  }
  
  // Truncate to word limit
  const truncatedWords = words.slice(0, wordLimit);
  return truncatedWords.join(' ') + '...';
};

/**
 * Validates if text is within word limit
 * @param text - The text to validate
 * @param wordLimit - Maximum number of words allowed
 * @returns True if within limit, false otherwise
 */
export const isWithinWordLimit = (text: string, wordLimit: number): boolean => {
  const wordCount = countWords(text);
  return wordCount <= wordLimit;
};

// Module-level cache for voice sample text
let cachedSampleText: string = '';

// US English alphabet fallback text for voice testing
const FALLBACK_ALPHABET_TEXT = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';

/**
 * Generates and caches sample text for voice preview
 * @param storyContent - The story content to extract text from
 * @param wordLimit - Maximum number of words to extract (default: 200)
 */
export const generateSampleTextForVoice = (storyContent?: string, wordLimit: number = 200): void => {
  if (storyContent && storyContent.trim()) {
    // Remove HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = storyContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Extract first ~200 words
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length > 0) {
      const truncatedWords = words.slice(0, wordLimit);
      cachedSampleText = truncatedWords.join(' ');
      return;
    }
  }
  
  // Use fallback alphabet text if no valid story content
  cachedSampleText = FALLBACK_ALPHABET_TEXT;
};

/**
 * Retrieves the cached sample text for voice preview
 * @returns The cached sample text
 */
export const getCachedSampleText = (): string => {
  return cachedSampleText || FALLBACK_ALPHABET_TEXT;
};
