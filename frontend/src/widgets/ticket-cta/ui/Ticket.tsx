import './Ticket.css';

export function Ticket() {
  return (
    <div
      aria-hidden="true"
      className="flex rounded-[22px] bg-espresso -rotate-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]"
    >
      <div className="t-main flex-1 pt-5.5 px-5.5 pb-5 border-dashed border-faint/30 relative">
        <div className="flex justify-between items-center">
          <p className="font-display font-medium text-[15px]">
            <span>devio</span>
            <span className="text-wine">.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
