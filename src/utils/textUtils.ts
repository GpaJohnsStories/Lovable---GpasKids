
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
