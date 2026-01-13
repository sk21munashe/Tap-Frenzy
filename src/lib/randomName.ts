const adjectives = [
  'Swift', 'Blazing', 'Cosmic', 'Neon', 'Turbo', 'Hyper', 'Ultra', 'Mega', 'Super', 'Epic',
  'Mystic', 'Shadow', 'Thunder', 'Storm', 'Fire', 'Ice', 'Dark', 'Light', 'Golden', 'Silver',
  'Savage', 'Wild', 'Fierce', 'Bold', 'Brave', 'Lucky', 'Rapid', 'Flash', 'Cyber', 'Pixel'
];

const nouns = [
  'Tapper', 'Player', 'Ninja', 'Hunter', 'Master', 'Legend', 'Hero', 'Warrior', 'Champion', 'Pro',
  'Gamer', 'Ace', 'Star', 'King', 'Queen', 'Wolf', 'Fox', 'Dragon', 'Phoenix', 'Tiger',
  'Hawk', 'Eagle', 'Cobra', 'Viper', 'Shark', 'Bear', 'Lion', 'Panther', 'Falcon', 'Raven'
];

export const generateRandomName = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adjective}${noun}${number}`;
};
