import { cn } from '@/shared/lib/utils';
import './Auth.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { Fire02Icon } from '@hugeicons/core-free-icons';
import { getWeekDayNames } from '@/shared/lib/format';

const weeks = getWeekDayNames();

export function AuthScene() {
  return (
    <div
      className="relative overflow-hidden h-full min-h-155 rounded-[32px] pt-9 px-9 pb-7.5 flex flex-col bg-[linear-gradient(160deg,#2A181C,#1B1415_70%)] border border-line-2"
      aria-hidden="true"
    >
      <div className="glow size-105 bg-wine/45 -top-40 -right-30" />
      <div className="glow size-80 bg-sand/15 -bottom-40 -left-15" />

      <h2 className="font-display font-medium text-[clamp(26px,3vw,36px)] tracking-[-.8px] leading-[1.15]">
        На платформе уже
        <em className="not-italic text-rose ml-3">ждут попутчики</em>
      </h2>
      <p className="text-muted mt-3.5 max-w-[40ch]">
        Прогресс, стрик и следующая станция сохраняются за тобой – войди и
        продолжай с того места, где остановился
      </p>

      <div className="relative flex-1 min-h-62.5 mt-5.5 mb-15.5">
        <div className="tile left-0 top-4.5 w-62.5 -rotate-3 border border-line-2 bg-surface-2/90">
          <small>следующая станция</small>
          <b className="font-display font-medium text-[22px] tracking-[-.4px] mt-1">
            TypeScript
          </b>
          <div className="grid grid-cols-4 gap-1.25 mt-3.5">
            {Array.from({ length: 4 }, (_, i) => {
              return (
                <i
                  key={i}
                  className={cn('h-1.5 rounded-full bg-text/10', {
                    'bg-rose': i === 0,
                  })}
                />
              );
            })}
          </div>
          <span className="block text-[12px] text-muted mt-2.5">
            1 из 4 тем ~2недели
          </span>
        </div>

        <div className="tile right-[4%] w-55.5 rotate-4 border border-line-2 bg-[rgba(48,36,30,.92)]">
          <div className="grid place-items-center size-9.5 rounded-[12px] bg-sand/15 text-sand mb-3">
            <HugeiconsIcon
              icon={Fire02Icon}
              strokeWidth={1.5}
              className="size-5 text-sand"
            />
          </div>
          <b className="font-display font-medium text-[24px] text-sand">
            12 дней
          </b>
          <small>стрик подряд</small>
          <div className="grid grid-cols-7 gap-1 mt-3">
            {weeks.map((_, i) => {
              return (
                <div
                  key={i}
                  className={cn(
                    'aspect-square rounded-[4px] bg-[rgba(255,236,230,.07)]',
                    {
                      'bg-sand': i < 5,
                      'border-2 border-sand': i === 5,
                    },
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
