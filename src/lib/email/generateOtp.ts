export function generateOtp(): string {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return String(randomNumber);
}
