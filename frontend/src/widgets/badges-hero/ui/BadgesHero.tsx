import type { Badge, UserBadgesCompleted } from '@/entities/badges/';
import { cn } from '@/shared/lib/utils';
import { Apple01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface BadgesHeroProps {
  badges: Badge[];
  completedBadges: UserBadgesCompleted[] | null;
}

export function BadgesHero({ badges, completedBadges }: BadgesHeroProps) {
  const earned = completedBadges ? completedBadges.length : 0;
  const total = badges.length;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = earned / total;
  const offset = circumference * (1 - progress);

  const tiers: { tier: string }[] = [
    ...new Map(badges.map((badge) => [badge.tier, badge])).values(),
  ];

  return (
    <>
      <section className="pt-16 pb-2 relative z-10">
        <p className="kicker">коллекция</p>
        <h1 className="font-display font-semibold text-[clamp(28px,3.6vw,40px)] tracking-[-.8px] leading-[1.1] text-mist">
          Жетоны
        </h1>
        <p className="text-mist-soft text-[16px] max-w-[56ch] mt-3.5">
          Их не покупают и не выдают за время – каждый отмечает что-то, что ты
          действительно сделал в пути. Редкие светятся.
        </p>

        <div className="flex items-center gap-9.5 mt-9 flex-wrap">
          <div className="relative w-29.5 h-29.5 shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#243050"
                strokeWidth="9"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#3ECF8E"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.75">
              <div className="text-mist-soft font-display leading-1 flex flex-row items-baseline gap-1">
                <span className="font-semibold text-[26px] tracking-[-0.5px] text-mist">
                  {completedBadges?.length ?? 0}
                </span>
                <span>/</span>
                <span>{badges.length}</span>
              </div>
              <p className="font-mono text-[11px] leading-[.14em] uppercase text-mist-soft/70 mt-5 tracking-widest">
                собрано
              </p>
            </div>
          </div>
          <div className="flex gap-3.5 flex-wrap">
            {tiers.map((tier) => (
              <div
                key={tier.tier}
                className={cn(
                  'flex flex-col gap-2.25 py-3.5 px-4.5 rounded-[14px] min-w-29.5 border border-line bg-panel-2',
                )}
              >
                <div className="flex flex-row gap-2 items-center">
                  <HugeiconsIcon
                    icon={Apple01Icon}
                    strokeWidth={2}
                    className="size-3.5 text-mist-soft"
                  />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-mist-soft">
                    {tier.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />
    </>
  );
}
