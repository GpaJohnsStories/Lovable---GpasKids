
const PERSONAL_ID_KEY = 'grandpa_john_personal_id';

function generateRandomChar(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function generatePersonalId(): string {
  let id = '';
  // 4 alphanumeric characters
  for (let i = 0; i < 4; i++) {
    id += generateRandomChar();
  }
  // a random letter
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  id += letters.charAt(Math.floor(Math.random() * letters.length));
  // a random number
  const numbers = '0123456789';
  id += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return id;
}

export function getOrSetPersonalId(): string {
  let personalId = localStorage.getItem(PERSONAL_ID_KEY);
  if (!personalId) {
    personalId = generatePersonalId();
    localStorage.setItem(PERSONAL_ID_KEY, personalId);
  }
  return personalId;
}
