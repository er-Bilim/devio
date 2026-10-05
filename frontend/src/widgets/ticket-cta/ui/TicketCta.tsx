import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { Ticket } from './Ticket';

const perks = [
  {
    title: 'бесплатно',
  },
  {
    title: 'час в день — достаточно',
  },
  {
    title: 'прогресс сохраняется',
  },
];

export function TicketCta() {
  return (
    <section>
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[36px] p-14 grid grid-cols-[1fr_400px] gap-12 items-center bg-[linear-gradient(160deg,#3A1E22,#241718_60%)] border border-line-2">
          <div className="glow size-90 bg-rose/30 -top-40 left-1/2 mt-45" />
          <div className="cta-text">
            <h2 className="mt-0">Первая станция – сегодня</h2>
            <p className="text-muted text-[16px] mt-3.5 max-w-[42ch]">
              Регистрация за минуту. Карта уже ждёт, а стрик начнётся с первого
              шага
            </p>
            <div className="flex gap-3 flex-wrap mt-7">
              <Link href="/roadmaps/frontend" className="btn btn-primary">
                Начать путь
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  strokeWidth={2}
                  className={`ic`}
                />
              </Link>
              <Link href="/roadmaps" className="btn btn-soft">
                Смотреть направления
              </Link>
            </div>
            <div className="flex gap-y-4.5 gap-x-5.5 flex-wrap mt-6.5 text-[14px] text-muted">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="flex flex-row gap-2 items-center"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    strokeWidth={2}
                    className="ic text-sage"
                  />
                  <span className="inline-flex items-center gap-2">
                    {perk.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Ticket />
        </div>
      </div>
    </section>
  );
}
