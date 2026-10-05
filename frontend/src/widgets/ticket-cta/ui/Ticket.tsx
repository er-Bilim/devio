import { HugeiconsIcon } from '@hugeicons/react';
import './Ticket.css';
import { Train01Icon } from '@hugeicons/core-free-icons';

const ticketData = [
  {
    title: 'первая станция',
    value: 'HTML',
  },
  {
    title: 'в пути',
    value: '~4 месяца',
  },
  {
    title: 'отправление',
    value: 'сегодня',
  },
];

export function Ticket() {
  return (
    <div
      aria-hidden="true"
      className="flex rounded-[22px] bg-espresso text-surface -rotate-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]"
    >
      <div className="t-main flex-1 pt-5.5 px-5.5 pb-5 border-r border-dashed border-faint/70 relative">
        <div className="flex justify-between items-center">
          <p className="font-display font-medium text-[15px]">
            <span>devio</span>
            <span className="text-wine">.</span>
          </p>
          <span className="font-soft font-extrabold text-[12px] py-1 px-2.5 rounded-full bg-rose/25 text-wine">
            билет
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4.5">
          <div>
            <small className="block text-[11.5px] text-faint">откуда</small>
            <b className="font-display font-medium text-[22px] tracking-[1px]">
              ноль
            </b>
          </div>
          <HugeiconsIcon
            icon={Train01Icon}
            strokeWidth={2}
            className="ic text-wine/60"
          />
          <div className="text-right">
            <small className="block text-[11.5px] text-faint">куда</small>
            <b className="font-display font-medium text-[22px] tracking-[1px]">
              Frontend
            </b>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mt-4.5 pt-3.5 border-t border-t-faint/30">
          {ticketData.map((data) => (
            <div key={data.value}>
              <small className="block text-[11.5px] text-faint">
                {data.title}
              </small>
              <span className="font-semibold text-[14px]">{data.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-18.5 flex flex-col items-center justify-between py-5">
        <span className="[writing-mode:vertical-rl] font-soft font-extrabold text-[12px] tracking-widest text-faint">
          A-001
        </span>
        <span className="w-7.5 h-14 rounded-1 bg-[repeating-linear-gradient(0deg,#2A1D1F_0_2px,transparent_2px_4px,#2A1D1F_4px_7px,transparent_7px_9px)]" />
      </div>
    </div>
  );
}
