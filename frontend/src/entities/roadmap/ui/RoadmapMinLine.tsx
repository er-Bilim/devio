interface RoadmapMiniLineProps {
  total: number;
  filled: number;
  tone?: 'mint' | 'signal';
}

const toneClass = {
  mint: {
    line: 'stroke-mint drop-shadow-[0_0_6px_rgba(62,207,142,0.55)]',
    dot: 'fill-mint stroke-mint',
  },
  signal: {
    line: 'stroke-signal drop-shadow-[0_0_6px_rgba(77,163,255,0.55)]',
    dot: 'fill-signal stroke-signal',
  },
};

export function RoadmapMiniLine({
  total,
  filled,
  tone = 'mint',
}: RoadmapMiniLineProps) {
  if (total <= 0) return null;

  const completed = Math.min(Math.max(filled, 0), total);
  const GAP = 85;
  const width = 12 + GAP * (total - 1) + 12;
  const filledX = 12 + GAP * Math.max(completed - 1, 0);
  const t = toneClass[tone];

  return (
    <svg
      viewBox={`0 0 ${width} 24`}
      className="w-full h-auto overflow-visible block"
      aria-hidden="true"
    >
      {filled > 0 && (
        <path
          d={`M12 12 H${filledX}`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className={t.line}
        />
      )}
      <path
        d={`M${filledX} 12 H${width - 12}`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        className="stroke-line"
      />
      {Array.from({ length: total }, (_, i) => (
        <circle
          key={i}
          cx={12 + GAP * i}
          cy="12"
          r="5"
          strokeWidth="3"
          className={i < filled ? t.dot : 'fill-night stroke-line'}
        />
      ))}
    </svg>
  );
}
