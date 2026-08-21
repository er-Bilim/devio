import { HugeiconsIcon } from '@hugeicons/react';
import {
  Train01Icon,
  Target02Icon,
  TagsIcon,
  ClockCheckIcon,
  ThreeDScaleIcon,
} from '@hugeicons/core-free-icons';
import type { Roadmap, Stage } from '@/entities/roadmap';
import { padNumber, pluralize } from '@/shared/lib/format';

interface HowPeekProps {
  roadmap: Roadmap;
}

const peekList = [
  {
    title: 'Зачем она',
    description: 'одно предложение по делу, без воды и мотивационных лозунгов',
    icon: Target02Icon,
  },
  {
    title: 'Темы внутри',
    description: 'что именно осваиваешь на этой остановке',
    icon: TagsIcon,
  },
  {
    title: 'Сколько ехать',
    description: 'честная оценка в неделях при спокойном темпе',
    icon: ClockCheckIcon,
  },
  {
    title: 'Место в маршруте',
    description: 'видно, что было до и что будет после',
    icon: ThreeDScaleIcon,
  },
];

export function HowPeek({ roadmap }: HowPeekProps) {
  const stage: Stage | undefined = roadmap.stages[0];

  if (!stage) return null;

  return (
    <>
      <section>
        <div className="flex items-center gap-2.25 mb-0.75">
          <HugeiconsIcon
            icon={Train01Icon}
            strokeWidth={1.5}
            className="size-3.75 text-mist-soft"
          />
          <h2 className="sec-head">Что внутри станции</h2>
        </div>
        <p className="sec-sub mb-6">
          так выглядит одна остановка на линии Frontend
        </p>
        <div className="grid grid-cols-2 gap-6.5 items-center">
          <div className="bg-[linear-gradient(165deg,rgba(19,28,50,.95),rgba(12,18,34,.95))] border border-line rounded-xl py-5 px-5.5 shadow-[0_26px_56px_-34px_rgba(0,0,0,.9)]">
            <div className="flex items-baseline justify-between gap-2.5 mb-1.75">
              <h4 className="font-display font-medium text-[16px] text-mist">
                <span className="font-mono text-[11px] text-mint mr-2.25">
                  {padNumber(stage.position)}
                </span>
                {stage.title}
              </h4>
              <p className="inline-flex gap-1 font-mono text-[11px] text-mist-soft">
                ~{stage.duration_weeks}
                <span>
                  {pluralize(
                    stage.duration_weeks,
                    'неделя',
                    'недели',
                    'недель',
                  )}
                </span>
              </p>
            </div>
            <p className="text-[14px] text-mist-soft mb-3.25">
              {roadmap.description}
            </p>

            <div className="flex gap-1.75 flex-wrap">
              {stage.topics.map((topic) => (
                <span
                  className="font-mono text-[10.5px] py-1 px-2.5 rounded-full border border-line text-mist-soft"
                  key={topic}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <ul className="flex flex-col gap-3.75">
            {peekList.map((peek) => {
              const Icon = peek.icon;
              return (
                <li
                  key={peek.title}
                  className="flex gap-3 items-start text-[14.5px] text-mist-soft"
                >
                  <HugeiconsIcon
                    icon={Icon}
                    strokeWidth={1.5}
                    className="size-5 text-mint shrink-0 mt-1"
                  />
                  <p>
                    <span className="text-mist font-semibold mr-1">
                      {peek.title}
                    </span>
                    –<span className="ml-1">{peek.description}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="rule" />
    </>
  );
}
