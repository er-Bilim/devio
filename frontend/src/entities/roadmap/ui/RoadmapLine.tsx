import type { Station } from '../model/types';

interface NightMapProps {
  stations: Station[];
}

const stationClass: Record<Station['status'], string> = {
  done: 'fill-mint stroke-mint',
  here: 'fill-night stroke-signal animate-station-pulse drop-shadow-[0_0_8px_rgba(77,163,255,0.8)]',
  next: 'fill-night stroke-line',
};

const labelClass: Record<Station['status'], string> = {
  done: 'fill-mint',
  here: 'fill-signal font-medium',
  next: 'fill-mist-soft',
};

export function RoadmapLine({ stations }: NightMapProps) {
  const GAP = 108;
  const width = 16 + GAP * (stations.length - 1) + 16;
  const doneCount = stations.filter((s) => s.status === 'done').length;
  const doneX = 16 + GAP * Math.max(doneCount - 1, 0);

  return (
    <svg
      viewBox={`0 0 ${width} 70`}
      className="w-full overflow-visible"
      aria-hidden="true"
    >
      <path
        d={`M16 28 H${doneX}`}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="stroke-mint drop-shadow-[0_0_6px_rgba(62,207,142,0.55)]"
      />
      <path
        d={`M${doneX} 28 H${width - 16}`}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        className="stroke-line"
      />

      {stations.map((s, i) => (
        <g key={s.title}>
          <circle
            cx={16 + GAP * i}
            cy="28"
            r="7"
            strokeWidth="3.5"
            className={stationClass[s.status]}
          />
          <text
            x={16 + GAP * i}
            y="56"
            textAnchor="middle"
            className={`font-mono text-[10.5px] ${labelClass[s.status]}`}
          >
            {s.status === 'here' ? `${s.title} – ты` : s.title}
          </text>
        </g>
      ))}
    </svg>
  );
}
