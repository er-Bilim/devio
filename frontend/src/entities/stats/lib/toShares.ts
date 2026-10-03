import type { Direction } from '../model/types';

export interface DirectionConfig {
  color: {
    bg: string;
  };
}

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

  const active_directions = directions.filter(
    (direction) => direction.status === 'active',
  );
  const learnersCount = active_directions.reduce(
    (acc, direction) => (acc += direction.learners),
    0,
  );

  return active_directions.map((direction) => ({
    ...direction,
    share: Math.ceil((direction.learners / learnersCount) * 100),
    config: config[direction.slug as configKey],
  }));
};
