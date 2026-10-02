import { stops } from '../model/steps';
import './HowSection.css';
import { HowStop } from './HowStop';

export function HowSection() {
  return (
    <section>
      <div className="wrap">
        <div className="head center">
          <span className="kicker">Как это работает</span>
          <h2>Три шага, без спешки</h2>
        </div>
        <div className="how relative grid grid-cols-3 gap-7 max-w-280 mx-auto">
          {stops.map((stop) => (
            <HowStop stop={stop} key={stop.numeric} />
          ))}
        </div>
      </div>
    </section>
  );
}
