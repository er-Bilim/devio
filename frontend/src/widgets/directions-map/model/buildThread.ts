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

  const kx: number = dx !== 0 ? CARD_HALF_W / Math.abs(dx) : Infinity;
  const ky: number = dy !== 0 ? CARD_HALF_H / Math.abs(dy) : Infinity;
  const kRay: number = Math.min(kx, ky);

  let ax: number;
  let ay: number;

  if (kRay >= 1) {
    ax = viewBoxHub.x;
    ay = viewBoxHub.y;
  } else {
    ax = viewBoxHub.x + dx * kRay;
    ay = viewBoxHub.y + dy * kRay;
  }

  const lineDx = sx - ax;
  const lineDy = sy - ay;
  const len = Math.hypot(lineDx, lineDy);

  if (len === 0) return '';

  const mx: number = (ax + sx) / 2;
  const my: number = (ay + sy) / 2;

  const px = -lineDy / len;
  const py = lineDx / len;

  const bend = Math.min(40, len * 0.22);
  const offset = i % 2 === 1 ? bend : -bend;

  const cx = mx + px * offset;
  const cy = my + py * offset;

  return `M ${ax} ${ay} Q ${cx} ${cy} ${sx} ${sy}`;
};
