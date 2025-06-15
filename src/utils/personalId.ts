
export function generateIdSuffix(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const numbers = '0123456789';
  const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
  return randomLetter + randomNumber;
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
