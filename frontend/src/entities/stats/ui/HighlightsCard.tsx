import {
  ArrowRight02Icon,
  BubblesIcon,
  Fire02Icon,
  FootprintsIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import './StatsCard.css';

// Временное решение

const highlights = [
  {
    icon: ArrowRight02Icon,
    title: 'После JS чаще всего едут на',
    highlight: 'TypeScript',
    color: {
      text: 'text-rose',
    },
  },
  {
    icon: FootprintsIcon,
    title: 'Самая проходимая станция',
    highlight: 'React',
    color: {
      text: 'text-sage',
    },
  },
  {
    icon: Fire02Icon,
    title: 'Самый длинный стрик',
    highlight: '47 дней',
    color: {
      text: 'text-sand',
    },
  },
];

export function HighlightsCard() {
  return (
    <div className="card">
      <h3>
        <HugeiconsIcon
          icon={BubblesIcon}
          strokeWidth={2}
          className="ic text-faint"
        />
        На этой неделе
      </h3>

      <div className="flex flex-col gap-3 mt-5.5">
        {highlights.map((highlight) => {
          const Icon = highlight.icon;

          return (
            <div
              key={highlight.highlight}
              className="flex gap-3.5 items-start py-3.25 px-4 rounded-(--r-sm) bg-text/5"
            >
              <HugeiconsIcon
                icon={Icon}
                strokeWidth={2}
                className={`ic ${highlight.color.text}`}
              />
              <p className="text-[14.5px] text-muted tracking-1.5">
                <span>{highlight.title} – </span>
                <b className="text-text font-semibold">{highlight.highlight}</b>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
