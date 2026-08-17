type ThreadParams = {
  hub: { x: number; y: number };
  stop: { x: number; y: number };
  i: number;
};

export const buildThread = (params: ThreadParams) => {
  const { hub, stop, i } = params;
  const CARD_HALF_W = 186;
  const CARD_HALF_H = 246 / 2;
  const VIEWBOX_W = 1160;
  const VIEWBOX_H = 770;

  const viewBoxHub = {
    x: (hub.x / 100) * VIEWBOX_W,
    y: (hub.y / 100) * VIEWBOX_H,
  };
  const viewBoxStop = {
    x: (stop.x / 100) * VIEWBOX_W,
    y: (stop.y / 100) * VIEWBOX_H,
  };
  const sx: number = viewBoxStop.x;
  const sy: number = viewBoxStop.y;

  const dx: number = viewBoxStop.x - viewBoxHub.x;
  const dy: number = viewBoxStop.y - viewBoxHub.y;

  if (dx === 0 && dy === 0) return '';

  const kx: number = CARD_HALF_W / Math.abs(dx);
  const ky: number = CARD_HALF_H / Math.abs(dy);

  const k: number = Math.min(kx, ky);

  const ax: number = viewBoxHub.x + dx * k;
  const ay: number = viewBoxHub.y + dy * k;

  const mx: number = (ax + sx) / 2;
  const my: number = (ay + sy) / 2;

  const len = Math.hypot(dx, dy);
  const px = -dy / len;
  const py = dx / len;

  const bend = Math.min(40, len * 0.22);

  const cx = mx + px * (i % 2 ? bend : -bend);
  const cy = my + py * (i % 2 ? bend : -bend);

  return `M ${ax} ${ay} Q ${cx} ${cy} ${sx} ${sy}`;
};
