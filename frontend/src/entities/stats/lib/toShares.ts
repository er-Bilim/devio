import type { Direction } from '../model/types';

export const toShares = (directions: Direction[]) => {
  const config = {
    frontend: {
      color: {
        bg: 'bg-rose',
      },
    },
    backend: {
      color: {
        bg: 'bg-dusk',
      },
    },
  };

  type configKey = keyof typeof config;

  const learnersCount = directions.reduce(
    (acc, direction) => (acc += direction.learners),
    0,
  );

  if (learnersCount === 0) return [];
  return directions.map((direction) => ({
    ...direction,
    share: Math.round((direction.learners / learnersCount) * 100),
    config: config[direction.slug as configKey],
  }));
};
