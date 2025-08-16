
import { supabase } from "@/integrations/supabase/client";
import { containsBadWord, containsBadWordInCode } from "./profanity";

// Check digit calculation function based on your provided formula
function calculateCheckDigit(baseID: string): string {
  const weights = [1, 2, 1, 2, 1]; // Fixed weights for positions C1 to C5

  // Mapping from character to its numeric code (from your "Alpha/Numeric Order" column)
  const characterToCodeMap: { [key: string]: number } = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 36, 'B': 11, 'C': 34, 'D': 13, 'E': 32,
    'F': 15, 'G': 30, 'H': 17, 'I': 28, 'J': 19,
    'K': 26, 'L': 21, 'M': 24, 'N': 23, 'O': 22,
    'P': 25, 'Q': 20, 'R': 27, 'S': 18, 'T': 29,
    'U': 16, 'V': 31, 'W': 14, 'X': 33, 'Y': 12, 'Z': 35
  };

  // Reverse mapping from numeric code to character (from your "Value Order" column)
  const codeToCharacterMap: { [key: number]: string } = {
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4',
    5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
    11: 'B', 12: 'Y', 13: 'D', 14: 'W', 15: 'F',
    16: 'U', 17: 'H', 18: 'S', 19: 'J', 20: 'Q',
    21: 'L', 22: 'O', 23: 'N', 24: 'M', 25: 'P',
    26: 'K', 27: 'R', 28: 'I', 29: 'T', 30: 'G',
    31: 'V', 32: 'E', 33: 'X', 34: 'C', 35: 'Z', 36: 'A'
  };
  
  let totalSum = 0;
  
  for (let i = 0; i < 5; i++) { // Loop through the 5 characters of baseID (C1 to C5)
    const char = baseID[i].toUpperCase(); // Ensure uppercase for mapping
    
    if (char in characterToCodeMap) {
      const numericValue = characterToCodeMap[char];
      totalSum = totalSum + (numericValue * weights[i]);
    } else {
      // Handle error: character not found in map (shouldn't happen if inputs are validated)
      throw new Error("Invalid character in base ID");
    }
  }
    
  const remainder = totalSum % 36;
  
  if (remainder in codeToCharacterMap) {
    return codeToCharacterMap[remainder];
  } else {
    // This case should ideally not be reached if the modulo and map are correctly aligned.
    throw new Error("Remainder does not map to a character");
  }
}

export function generateIdSuffix(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  return randomLetter;
}

// Check if a Personal ID already exists in the database using secure function
async function isPersonalIdUsed(personalId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('check_personal_id_exists', { 
      p_personal_id: personalId.toUpperCase() 
    });
  
  if (error) {
    // Don't log specific error details to prevent information leakage
    throw error;
  }
  
  return data === true;
}

// Export function to check if Personal ID exists (for form validation)
export async function checkPersonalIdExists(personalId: string): Promise<boolean> {
  return isPersonalIdUsed(personalId);
}

// Store a Personal ID in the database to mark it as used
async function storePersonalId(personalId: string): Promise<void> {
  const { error } = await supabase
    .from('used_personal_ids')
    .insert([{ personal_id: personalId.toUpperCase() }]);
  
  if (error) {
    // Don't log specific error details to prevent information leakage
    throw error;
  }
}

// Generate a complete Personal ID with check digit validation
export async function generateCompletePersonalId(prefix: string): Promise<string | null> {
  const maxAttempts = 100; // Prevent infinite loops
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate random letter (5th character)
    const randomLetter = generateIdSuffix();
    
    // Create the 5-character base ID (4 prefix + 1 random letter)
    const baseId = (prefix + randomLetter).toUpperCase();
    
    // Calculate check digit (6th character)
    let checkDigit: string;
    try {
      checkDigit = calculateCheckDigit(baseId);
    } catch (error) {
      // Don't log specific error details to prevent information leakage
      continue; // Try again with a different random letter
    }
    
    // Create complete 6-character Personal ID
    const completeId = baseId + checkDigit;
    
    // Check for bad words in complete ID (both whole words and substrings)
    if (containsBadWord(completeId) || containsBadWordInCode(completeId)) {
      continue; // Try again with a different random letter
    }
    
    // Check if ID is already used
    try {
      const isUsed = await isPersonalIdUsed(completeId);
      if (isUsed) {
        continue; // Try again with a different random letter
      }
      
      // Store the new Personal ID to prevent future duplicates
      await storePersonalId(completeId);
      
      // Success! Return the complete Personal ID
      return completeId;
    } catch (error) {
      // Don't log specific error details to prevent information leakage
      continue; // Try again
    }
  }
  
  // If we couldn't generate a valid ID after maxAttempts, return null
  // Don't log specific attempt count to prevent information leakage
  return null;
}

const PERSONAL_ID_KEY = 'personalId';

export function getPersonalId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PERSONAL_ID_KEY);
  }
  return null;
}

export function setPersonalId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PERSONAL_ID_KEY, id);
  }
}
