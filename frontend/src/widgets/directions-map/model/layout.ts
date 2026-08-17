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

type HubConfig = {
  hub: HubPosition;
  stops: StopPosition[];
  threads: string[];
};

export const configHubRoadmap: Record<string, HubConfig> = {
  frontend: {
    hub: { x: 80, y: 45, color: `var(--mint)` },
    stops: [
      { x: 44.5, y: 8, dur: 7.4, delay: -2 },
      { x: 38.5, y: 28, dur: 8.2, delay: -4 },
      { x: 93, y: 24.4, dur: 6.8, delay: -1 },
      { x: 100, y: 42.2, dur: 7.9, delay: -3 },
      { x: 69, y: 56, dur: 8.6, delay: -5 },
      { x: 82, y: 59.5, dur: 7.1, delay: 2.5 },
    ],
    threads: [
      'M628 234 C 556 252, 516 216, 452 238',
      'M628 234 C 556 252, 516 216, 452 238',
      'M640 274 C 562 310, 538 302, 470 338',
      'M640 274 C 562 310, 538 302, 470 338',
      'M932 198 C 990 176, 1004 204, 1058 186',
      'M932 198 C 990 176, 1004 204, 1058 186',
      'M936 254 C 986 276, 980 302, 1032 324',
      'M936 254 C 986 276, 980 302, 1032 324',
      'M782 312 C 774 364, 806 378, 800 428',
      'M782 312 C 774 364, 806 378, 800 428',
      'M848 312 C 902 358, 920 370, 948 424',
      'M848 312 C 902 358, 920 370, 948 424',
    ],
  },
  backend: {
    hub: {
      x: 40.5,
      y: 85.5,
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
    threads: [
      'M470 658 C 392 528, 252 450, 174 320',
      'M470 658 C 485 541, 437 426, 452 308',
      'M470 658 C 324 592, 157 609, 12 543',
      'M470 658 C 347 673, 244 751, 122 766',
      'M470 658 C 493 684, 528 695, 551 720',
      'M470 658 C 525 638, 565 590, 621 570',
      'M470 658 C 439 675, 420 707, 389 724',
      'M470 658 C 327 629, 183 676, 41 647',
    ],
  },
};
