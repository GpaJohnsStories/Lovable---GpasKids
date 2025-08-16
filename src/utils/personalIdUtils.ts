/**
 * Utility functions for Personal ID display and masking
 */

export function maskPersonalId(personalId: string): string {
  if (!personalId || personalId.length !== 6) {
    return personalId;
  }
  
  // Show first 4 characters, mask last 2 with **
  return personalId.substring(0, 4) + "**";
}

export function getPersonalIdDisplay(personalId: string, isAnnouncement: boolean = false, showMasked: boolean = true): string {
  if (isAnnouncement || personalId === '0000FF') {
    return 'GpaJohn';
  }
  
  return showMasked ? maskPersonalId(personalId) : personalId;
}