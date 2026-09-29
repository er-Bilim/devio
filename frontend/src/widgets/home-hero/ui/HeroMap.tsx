import { Train } from '@/shared/ui/train';

type Station = {
  name: string;
  x: number;
  y: number;
  nameX: number;
  nameY: number;
};

const FRONT_PATH: string =
  'M40 140 H150 Q180 140 180 170 V200 Q180 230 210 230 H364';

const FRONT_STATIONS: Station[] = [
  { name: 'HTML', x: 40, y: 140, nameX: 24, nameY: 176 },
  { name: 'CSS', x: 110, y: 140, nameX: 98, nameY: 170 },
  { name: 'JS', x: 180, y: 185, nameX: 196, nameY: 190 },
  { name: 'TS', x: 250, y: 230, nameX: 238, nameY: 260 },
  { name: 'React', x: 310, y: 230, nameX: 290, nameY: 260 },
  { name: 'Next', x: 364, y: 230, nameX: 348, nameY: 260 },
];

const BACK_STATIONS_X: number[] = [148, 256, 364];

const branch: string =
  'font-mono text-[11px] uppercase tracking-[.14em] fill-faint';

export function HeroMap() {
  const [start, ...rest] = FRONT_STATIONS;

  return (
    <svg viewBox="0 100 400 250" className="relative z-1 block h-auto w-full">
      {start && rest.length > 0 && (
        <>
          <text x={36} y={110} className={branch}>
            frontend
          </text>
          <path
            d={FRONT_PATH}
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-rose/28"
          />
          <circle
            cx={start.x}
            cy={start.y}
            r={21}
            className="fill-rose/18 motion-safe:animate-breathe"
          />
          <circle
            cx={start.x}
            cy={start.y}
            r={11}
            strokeWidth={5}
            className="fill-bg stroke-rose"
          />
          {rest.map((s) => (
            <circle
              key={s.name}
              cx={s.x}
              cy={s.y}
              r={8}
              strokeWidth={3}
              className="fill-surface stroke-rose/55"
            />
          ))}
          {FRONT_STATIONS.map((s) => (
            <text
              key={s.name}
              x={s.nameX}
              y={s.nameY}
              className={
                s === start
                  ? 'text-[12px] fill-text font-semibold'
                  : 'text-[11px] fill-muted'
              }
            >
              {s.name}
            </text>
          ))}

          <g transform="translate(54 126)">
            <g className="motion-safe:animate-wait">
              <Train />
            </g>
          </g>

          <text x={36} y={306} className={branch}>
            backend
          </text>
          <path
            d="M40 330 H364"
            fill="none"
            strokeWidth={10}
            strokeLinecap="round"
            className="stroke-dusk/28"
          />
          <circle
            cx={40}
            cy={330}
            r={10}
            strokeWidth={4.5}
            className="fill-bg stroke-dusk"
          />
          {BACK_STATIONS_X.map((x) => (
            <circle
              key={x}
              cx={x}
              cy={330}
              r={8}
              strokeWidth={3}
              className="fill-surface stroke-dusk/55"
            />
          ))}
        </>
      )}
    </svg>
  );
}
