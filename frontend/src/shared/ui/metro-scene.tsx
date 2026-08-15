import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon } from '@hugeicons/core-free-icons';

interface MetroSceneProps {
  variant: 'broken' | 'empty';
}

export function MetroScene({ variant }: MetroSceneProps) {
  const isBroken: boolean = variant === 'broken';

  return (
    <div className="mb-1 flex justify-center">
      {isBroken ? (
        <svg
          viewBox="0 0 440 110"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Разрыв на линии между станциями"
          className="w-full max-w-110 h-auto overflow-visible"
        >
          <path
            className="fill-none stroke-mint"
            d="M20 62 H168"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle
            className="fill-mint stroke-mint"
            cx="20"
            cy="62"
            r="7"
            strokeWidth={3.5}
          />
          <circle
            className="fill-mint stroke-mint"
            cx="100"
            cy="62"
            r="7"
            strokeWidth={3.5}
          />

          <path
            className="fill-none tr-broken stroke-line"
            d="M188 62 H262"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={'2 14'}
          />

          <g className="drop-shadow-[0_0_10px_rgba(240,106,106,0.45)] animate-pulse">
            <path
              d="M225 18 L245 52 H205 Z"
              fill="none"
              stroke="var(--alarm)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <line
              x1="225"
              y1="30"
              x2="225"
              y2="41"
              stroke="var(--alarm)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="225" cy="47" r="1.9" fill="var(--alarm)" />
          </g>

          <path
            className="fill-none stroke-mint"
            d="M282 62 H420"
            opacity=".35"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle
            className="fill-night stroke-line"
            cx="340"
            cy="62"
            r="7"
            strokeWidth={3.5}
          />
          <circle
            className="fill-night stroke-line"
            cx="420"
            cy="62"
            r="7"
            strokeWidth={3.5}
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 640 120"
          role="img"
          aria-label="Линия метро обрывается: следующей станции нет на карте"
        >
          <defs>
            <filter
              id="ghost-glow"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line
            x1="16"
            y1="60"
            x2="392"
            y2="60"
            className="stroke-signal"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <line
            x1="410"
            y1="60"
            x2="522"
            y2="60"
            className="stroke-signal"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray="1 16"
            opacity="0.45"
          />
          <circle
            cx="72"
            cy="60"
            r="11"
            className="fill-night stroke-signal"
            strokeWidth={6}
          />
          <circle
            cx="192"
            cy="60"
            r="11"
            className="fill-night stroke-signal"
            strokeWidth={6}
          />
          <circle
            cx="312"
            cy="60"
            r="11"
            className="fill-night stroke-signal"
            strokeWidth={6}
          />
          <g className="animate-pulse" filter="url(#ghost-glow)">
            <circle
              cx="566"
              cy="60"
              r="26"
              className="fill-none stroke-alarm"
              strokeWidth={2}
              strokeDasharray="4 7"
            />
            <text
              x="566"
              y="65"
              className="fill-alarm font-mono"
              textAnchor="middle"
              fontSize="14"
            >
              404
            </text>
          </g>
        </svg>
      )}
    </div>
  );
}
