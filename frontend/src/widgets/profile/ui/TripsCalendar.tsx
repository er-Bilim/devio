import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getAllDaysOfYear } from '../model/calendar';
import { getWeekDayNames, pluralize } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';

export function TripsCalendar() {
  const dates = getAllDaysOfYear(new Date().getFullYear());
  const allWeekNames = getWeekDayNames('ru', 'short');

  return (
    <section>
      <div className="flex items-end justify-between gap-4 flex-wrap my-5.5">
        <div>
          <div className="sec-head flex flex-row gap-2 items-center">
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={2}
              className="size-4.5 text-mist-soft"
            />
            <h2>Карта поездок</h2>
          </div>
          <div className="sec-sub mt-2">
            <div className="flex flex-row gap-2">
              <span className="text-mist font-semibold">184 поездки</span>
              <p className="inline-flex gap-1">
                за год – яркость клетки <span className="text-amber">===</span>
                <span className="text-mint font-medium">активность дня</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2.25 overflow-x-auto pb-1.5">
        <div className="grid grid-template-cols-[repeat(7,13px)] gap-5.5 pt-5 shrink-0">
          {allWeekNames.map((name, index) => {
            const isOdd = index % 2 !== 0;
            return (
              <span
                key={name}
                className={cn(
                  'font-mono text-[9.5px] text-mist-soft leading-3 block',
                  isOdd && 'hidden',
                )}
              >
                {name}
              </span>
            );
          })}
        </div>
        <div className="min-w-max">
          <div className="grid grid-flow-col gap-1 h-5 font-mono text-[10px] text-mist-soft">
            {dates.months.map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-[repeat(7,16px)] gap-1">
            {dates.allDates.map((_, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-[4px] bg-[rgba(36,48,80,.36)] duration-200 hover:scale-[1.15]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3.5 mt-3.5 flex-wrap font-mono text-[10.5px] text-mist-soft">
        <p className="inline-flex gap-1.5">
          самый долгий стрик в этом году –
          <span className="text-amber">
            10 {pluralize(10, 'день', 'дня', 'дней')}
          </span>
          в апреле
        </p>
        <div className="flex items-center gap-1.25">
          <p>меньше</p>
          {Array.from({ length: 5 }, (_, i) => {
            const isFirst = i === 0;
            const isLast = i === 4;
            const bg = isFirst
              ? 'bg-[rgba(36,48,80,.36)]'
              : isLast
                ? 'bg-mint'
                : `bg-mint/${i + 1 * 2}0`;
            return (
              <div key={i} className={`w-3.5 h-3.5 rounded-[4px] ${bg}`} />
            );
          })}
          <p>больше</p>
        </div>
      </div>
    </section>
  );
}
