
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

const cleanText = (text: string): string => {
    // This makes the check case-insensitive and ignores simple ways to bypass the filter
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export const containsBadWord = (text: string): boolean => {
  if (!text) return false;
  const cleanedText = cleanText(text);
  return badWords.some(word => cleanedText.includes(word));
};
