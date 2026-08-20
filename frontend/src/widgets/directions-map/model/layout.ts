type HubPosition = {
  x: number;
  y: number;
  color: string;
};

type StopPosition = {
  x: number;
  y: number;
  dur: number;
  delay: number;
};

export type HubConfig = {
  hub: HubPosition;
  stops: StopPosition[];
};

export const configHubRoadmap: Record<string, HubConfig> = {
  frontend: {
    hub: { x: 65, y: 25, color: `var(--mint)` },
    stops: [
      { x: 40, y: 8, dur: 7.4, delay: -2 },
      { x: 38.5, y: 28, dur: 8.2, delay: -4 },
      { x: 93, y: 24.4, dur: 6.8, delay: -1 },
      { x: 90, y: 42.2, dur: 7.9, delay: -3 },
      { x: 69, y: 56, dur: 8.6, delay: -5 },
      { x: 82, y: 59.5, dur: 7.1, delay: 2.5 },
    ],
  },
  backend: {
    hub: {
      x: 30.5,
      y: 69.5,
      color: `var(--azure)`,
    },
    stops: [
      { x: 15, y: 41.5, dur: 7.6, delay: -1.5 },
      { x: 39, y: 40, dur: 8.8, delay: -4.5 },
      { x: 1, y: 70.5, dur: 6.9, delay: -2 },
      { x: 10.5, y: 99.5, dur: 8.1, delay: -5.5 },
      { x: 47.5, y: 93.5, dur: 7.3, delay: -3.5 },
      { x: 53.5, y: 74, dur: 9.2, delay: -1 },
      { x: 33.5, y: 94, dur: 6.1, delay: 0.7 },
      { x: 3.5, y: 84, dur: 9.8, delay: -3 },
    ],
  },
};
