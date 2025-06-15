
export function generateIdSuffix(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const numbers = '0123456789';
  const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
  return randomLetter + randomNumber;
}
