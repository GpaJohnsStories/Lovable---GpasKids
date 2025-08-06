
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

// Educational alphabet fallback text for voice testing
const FALLBACK_ALPHABET_TEXT = 'A is for Apple, B is for Boy, C is for Cat, D is for Dog, E is for Elephant, F is for Fish, G is for Girl, H is for Hat, I is for Ice cream, J is for Jump, K is for Kite, L is for Lion, M is for Mouse, N is for Nest, O is for Orange, P is for Pig, Q is for Queen, R is for Rabbit, S is for Sun, T is for Tree, U is for Umbrella, V is for Van, W is for Water, X is for X-ray, Y is for Yellow, Z is for Zebra.';

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
