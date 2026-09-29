interface TrainProps {
  width?: number;
  className?: string;
}

export function Train({ width = 30, className }: TrainProps) {
  return (
    <svg
      viewBox="0 0 30 12"
      width={width}
      height={width * 0.4}
      className={className}
      aria-hidden
    >
      <rect width={30} height={12} rx={6} className="fill-text" />
      <rect x={20} y={3} width={5} height={5} rx={1.5} className="fill-rose" />
    </svg>
  );
}
