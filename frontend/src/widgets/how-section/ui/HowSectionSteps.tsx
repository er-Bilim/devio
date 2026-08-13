import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';

interface HowSectionStepsProps {
  steps: {
    icon: IconSvgElement;
    title: string;
    description: string;
  }[];
}

export function HowSectionSteps({ steps }: HowSectionStepsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {steps.map((step) => {
        const Icon = step.icon;

        return (
          <div
            className="bg-panel-2 border border-line rounded-xl p-6.5"
            key={step.title}
          >
            <div className="w-11 h-11 rounded-md bg-panel border border-line flex items-center justify-center mb-4.5">
              <HugeiconsIcon
                icon={Icon}
                strokeWidth={1.8}
                className="size-5 text-signal"
              />
            </div>
            <h3 className="font-body font-bold text-[17px] mb-2 text-mist">
              {step.title}
            </h3>
            <p className="text-mist-soft text-[14.5px]">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
