const AVATAR_KEYS: string[] = [
  'cat',
  'fox',
  'bear',
  'owl',
  'frog',
  'panda',
  'penguin',
  'rabbit',
];

const hash = (s: string) => {
  const hashed = [...s].reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0,
    1,
  );
  return hashed;
};

export const getAvatarKey = (username: string): string => {
  const normalized = username.trim().toLowerCase() || 'devio';
  return AVATAR_KEYS[hash(normalized) % AVATAR_KEYS.length];
};
