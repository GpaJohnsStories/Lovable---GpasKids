/**
 * Character voice assignments for AI-generated audio
 * Maps story characters to their designated OpenAI TTS voices
 */

export interface CharacterVoice {
  character: string;
  voice: string;
  description: string;
}

export const CHARACTER_VOICE_ASSIGNMENTS: CharacterVoice[] = [
  {
    character: 'Buddy',
    voice: 'alloy',
    description: 'Neutral and balanced - Perfect for our beloved dog companion'
  },
  {
    character: 'Fluffy', 
    voice: 'fable',
    description: 'Warm and storytelling - Ideal for gentle cat stories'
  },
  {
    character: 'Gpa John',
    voice: 'onyx', 
    description: 'Deep and authoritative - Great for strong character presence'
  },
  {
    character: 'Sparky',
    voice: 'sage',
    description: 'Wise and thoughtful - Perfect for energetic yet wise characters'
  }
];

/**
 * Get the assigned voice for a specific character
 */
export const getCharacterVoice = (character: string): string => {
  const assignment = CHARACTER_VOICE_ASSIGNMENTS.find(
    cv => cv.character.toLowerCase() === character.toLowerCase()
  );
  return assignment?.voice || 'alloy'; // Default to alloy if character not found
};

/**
 * Get character name for a given voice (reverse lookup)
 */
export const getVoiceCharacter = (voice: string): string | null => {
  const assignment = CHARACTER_VOICE_ASSIGNMENTS.find(cv => cv.voice === voice);
  return assignment?.character || null;
};

/**
 * Get full character voice information
 */
export const getCharacterVoiceInfo = (character: string): CharacterVoice | null => {
  return CHARACTER_VOICE_ASSIGNMENTS.find(
    cv => cv.character.toLowerCase() === character.toLowerCase()
  ) || null;
};

/**
 * Check if a character has a voice assignment
 */
export const hasCharacterVoice = (character: string): boolean => {
  return CHARACTER_VOICE_ASSIGNMENTS.some(
    cv => cv.character.toLowerCase() === character.toLowerCase()
  );
};