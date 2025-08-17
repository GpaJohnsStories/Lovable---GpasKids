
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

// Enhanced profanity check for nicknames using sliding window approach
export const containsBadWordInNickname = (nickname: string): boolean => {
  if (!nickname || nickname.length < 3) return false;
  
  const normalizedNickname = nickname.toLowerCase();
  
  // Check for exact word matches first
  const exactMatch = badWords.some(badWord => 
    new RegExp(`\\b${badWord.toLowerCase()}\\b`).test(normalizedNickname)
  );
  
  if (exactMatch) return true;
  
  // For 3-10 character nicknames, use sliding window to check for bad word substrings
  for (let windowSize = 3; windowSize <= Math.min(normalizedNickname.length, 10); windowSize++) {
    for (let i = 0; i <= normalizedNickname.length - windowSize; i++) {
      const substring = normalizedNickname.slice(i, i + windowSize);
      
      // Check if this substring matches any bad word (for words 3+ chars)
      const foundBadWord = badWords.some(badWord => {
        if (badWord.length >= 3) {
          return badWord.toLowerCase() === substring;
        }
        return false;
      });
      
      if (foundBadWord) return true;
    }
  }
  
  return false;
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
