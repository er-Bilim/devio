import { HowSectionSteps } from './HowSectionSteps';
import {
  MapsIcon,
  CheckmarkSquare04Icon,
  Fire03Icon,
} from '@hugeicons/core-free-icons';

export function HowSection() {
  const steps = [
    {
      icon: MapsIcon,
      title: 'Выбери ветку',
      description:
        'Направление — это линия с готовым порядком станций. Не надо решать, что учить первым: карта уже построена.',
    },
    {
      icon: CheckmarkSquare04Icon,
      title: 'Проходи станции',
      description:
        'На каждой — материалы, примеры и практика. Закрыл станцию — линия загорается, ты двигаешься дальше.',
    },
    {
      icon: Fire03Icon,
      title: 'Держи стрик',
      description:
        'Каждый день с закрытым этапом — плюс к серии. Стрик горит, пока горишь ты.',
    },
  ];

  return (
    <section className="pt-0">
      <div className="wrap">
        <div className="mb-11 max-w-[60ch]">
          <p className="font-mono text-[12.5px] tracking-[.14em] text-signal uppercase mb-4.5">
            Интерактивные роадмапы
          </p>
          <h2 className="font-display font-semibold text-[clamp(24px,2.6vw,32px)] tracking-[-0.4px] text-mist">
            Три правила движения
          </h2>
        </div>
        <HowSectionSteps steps={steps} />
      </div>
    </section>
  );
}
