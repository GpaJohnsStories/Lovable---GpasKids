
const badWords = [
  'poop',
  'butt',
  'fart',
  'stupid',
  'dumb',
  'hate',
  // Profanity
  'fuck',
  'shit',
  'ass',
  'asshole',
  'bitch',
  'damn',
  'dick',
  'cunt',
  'hell',
  // Slurs
  'nigger',
  'nigga',
  'retard',
  'faggot',
  'tranny',
  'kike',
  'gook',
  'spic',
  'paki',
  'chink',
  // Sexually suggestive
  'penis',
  'vagina',
  // General insults
  'idiot',
  'moron',
  'loser',
  'pathetic',
  'jerk',
  'creep',
  'weakling',
  'coward',
];

export const containsBadWord = (text: string): boolean => {
  if (!text) return false;
  
  // Use word boundaries to match only complete words
  const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
  return regex.test(text);
};

// Check for bad words as substrings in codes (for Personal IDs)
export const containsBadWordInCode = (code: string): boolean => {
  if (!code) return false;
  
  const normalizedCode = code.toLowerCase();
  
  // Check for bad words as substrings, but only if they're 4+ characters to avoid false positives
  return badWords.some(badWord => {
    if (badWord.length >= 4) {
      return normalizedCode.includes(badWord.toLowerCase());
    }
    return false;
  });
};

export const getHighlightedParts = (text: string): { text: string; isBad: boolean }[] => {
    if (!text) return [{ text: '', isBad: false }];

    // Use word boundaries for highlighting as well
    const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.filter(part => part).map(part => {
        const isBad = badWords.some(badWord => 
          new RegExp(`\\b${badWord}\\b`, 'i').test(part)
        );
        return { text: part, isBad };
    });
};
