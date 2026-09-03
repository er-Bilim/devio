import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
// import { getAllDaysOfYear } from '../model/calendar';
import { getWeekDayNames } from '@/shared/lib/format';

export function TripsCalendar() {
  // const allMonth = getAllDaysOfYear(new Date().getFullYear());
  const allWeekNames = getWeekDayNames('ru', 'short');

  return (
    <section>
      <div className="flex items-end justify-between gap-4 flex-wrap mt-5.5">
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
              <span>за год – яркость клетки === активность дня</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2.25 overflow-x-auto pb-1.5">
        <div className="grid grid-template-cols-[repeat(7,13px)] gap-3 pt-5 shrink-0">
          {allWeekNames.map((name) => (
            <span key={name} className="font-mono text-[9.5px] text-mist-soft leading-3">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
