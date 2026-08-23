import { HugeiconsIcon } from '@hugeicons/react';
import {
  FootprintsIcon,
  MapingIcon,
  AppleReminderIcon,
  Comet01Icon,
} from '@hugeicons/core-free-icons';
import { StepItem } from './StepItem';

const steps = [
  {
    title: 'Выбери линию',
    description:
      'Frontend или Backend — два открытых направления. На схеме сети видно, куда ведёт каждая линия и сколько на ней станций: решение принимается глазами, а не наугад',
    icon: MapingIcon,
    additional: 'DevOps и Mobile — в депо, скоро откроются',
  },
  {
    title: 'Езжай по станциям',
    description:
      'Каждая станция — тема: что учить, зачем она нужна и что идёт после неё. Порядок выверен, тупиков нет — не нужно самому склеивать курс из двадцати вкладок',
    icon: AppleReminderIcon,
    additional: 'у станции есть темы и срок в неделях',
  },
  {
    title: 'Отмечай пройденное',
    description:
      'Нажал «пройдено» – станция загорается, линия закрашивается, а ты видишь, где находишься. Каждый такой день продлевает стрик',
    icon: Comet01Icon,
    additional: 'стрик – счётчик дней подряд',
  },
];

export function HowSteps() {
  return (
    <>
      <section>
        <div className="flex items-center gap-2.25 mb-0.75">
          <HugeiconsIcon
            icon={FootprintsIcon}
            strokeWidth={1.5}
            className="size-3.75 text-mist-soft"
          />
          <h2 className="sec-head">
            Путь в три шага
          </h2>
        </div>
        <p className="sec-sub mb-6">
          от «ничего не понятно» до первой пройденной станции – минут за пять
        </p>

        <ol className="steps relative pl-10.5 mt-2">
          {steps.map((step, index) => (
            <StepItem key={index} step={step} index={index + 1} />
          ))}
        </ol>
      </section>

      <div className="rule" />
    </>
  );
}
