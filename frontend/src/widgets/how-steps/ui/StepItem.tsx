import { padNumber } from '@/shared/lib/format';
import { HugeiconsIcon } from '@hugeicons/react';

type StepItemType = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>['icon'];
  additional?: string;
};

interface StepItemProps {
  step: StepItemType;
  index: number;
}

export function StepItem({ step, index }: StepItemProps) {
  return (
    <li className="relative pb-10">
      <p className="font-mono text-[11.5px] tracking-[.16em] text-mist-soft uppercase">
        шаг {padNumber(index)}
      </p>
      <h3 className="font-display font-semibold text-[19px] mt-1.25 mb-2 tracking-[-.2px] text-mist">
        {step.title}
      </h3>
      <p className="text-mist-soft text-[15px] max-w-[58ch]">
        {step.description}
      </p>
      {step.additional && (
        <p className="inline-flex items-center gap-2 mt-3 font-mono text-[12px] text-mist-soft py-1.75 px-3.25 rounded-full bg-[rgba(18,26,46,.75)] border border-line">
          <HugeiconsIcon
            icon={step.icon}
            strokeWidth={1.5}
            className="size-3.5 text-mint"
          />
          {step.additional}
        </p>
      )}
    </li>
  );
}
