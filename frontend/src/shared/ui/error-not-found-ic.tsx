interface ErrorNotFoundIconProps {
  cx: string;
  cy: string;
  textY: string;
}

export function ErrorNotFoundIcon({ cx, cy, textY }: ErrorNotFoundIconProps) {
  return (
    <g className="animate-pulse" filter="url(#ghost-glow)">
      <circle
        cx={cx}
        cy={cy}
        r="26"
        className="fill-none stroke-alarm"
        strokeWidth={2}
        strokeDasharray="4 7"
      />
      <text
        x={cx}
        y={textY}
        className="fill-alarm font-mono"
        textAnchor="middle"
        fontSize="14"
      >
        404
      </text>
    </g>
  );
}
