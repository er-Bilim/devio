import type { Badge, UserBadgesCompleted } from '@/entities/badges/';

interface Props {
  badges: Badge[];
  completedBadges: UserBadgesCompleted[];
}

export const BadgesHero = ({ badges, completedBadges }: Props) => {
  return (
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.75">
            <div>
              <span>{completedBadges?.length ?? 0}</span>
              <span>/{badges.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
