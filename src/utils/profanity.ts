
const badWords = [
  'poop',
  'butt',
  'fart',
  'stupid',
  'dumb',
  'hate',
];

const cleanText = (text: string): string => {
    // This makes the check case-insensitive and ignores simple ways to bypass the filter
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export const containsBadWord = (text: string): boolean => {
  if (!text) return false;
  const cleanedText = cleanText(text);
  return badWords.some(word => cleanedText.includes(word));
};
