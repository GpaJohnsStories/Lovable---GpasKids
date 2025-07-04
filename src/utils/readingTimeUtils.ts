
export const calculateReadingTime = (content: string): string => {
  if (!content) return "About 1 minute to read";
  
  // Strip HTML tags and count words
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Count words (split by whitespace and filter out empty strings)
  const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate reading time at 150 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 150));
  
  return `About ${readingTimeMinutes} minute${readingTimeMinutes === 1 ? '' : 's'} to read`;
};

export const calculateReadingTimeWithWordCount = (content: string): { readingTime: string; wordCount: number } => {
  if (!content) return { readingTime: "About 1 minute to read", wordCount: 0 };
  
  // Strip HTML tags and count words
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Count words (split by whitespace and filter out empty strings)
  const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate reading time at 150 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 150));
  
  return {
    readingTime: `About ${readingTimeMinutes} minute${readingTimeMinutes === 1 ? '' : 's'} to read`,
    wordCount
  };
};
