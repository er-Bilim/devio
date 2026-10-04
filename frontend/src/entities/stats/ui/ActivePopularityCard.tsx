import type { DirectionPopularity } from '../model/types';

interface ActivePopularityCardProps {
  directions: DirectionPopularity[];
}

export function ActivePopularityCard({
  directions,
}: ActivePopularityCardProps) {
  return (
    <>
      <div className="flex h-3.5 rounded-full overflow-hidden mt-7.5 gap-1">
        {directions.map((direction) => (
          <i
            key={direction.slug}
            style={{
              width: `${direction.share}%`,
            }}
            className={`block rounded-full ${direction.config.color.bg}`}
          />
        ))}
      </div>
      <div className="flex mt-4.5 gap-y-4 gap-x-11 flex-wrap">
        {directions.map((direction) => (
          <div key={direction.slug} className="flex items-baseline gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-[3px] self-center ${direction.config.color.bg}`}
            />
            <b className="font-display font-medium text-[28px] tracking-[-.6px]">
              {direction.share}%
            </b>
            <span className="text-[14px] text-muted">{direction.title}</span>
          </div>
        ))}
      </div>

      <div className="foot">
        Доля пользователей, начавших направление за последние 30 дней
      </div>
    </>
  );
}
