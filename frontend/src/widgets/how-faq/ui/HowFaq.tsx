import { HugeiconsIcon } from '@hugeicons/react';
import { BadgeQuestionMarkIcon } from '@hugeicons/core-free-icons';

export function HowFaq() {
  return (
    <div className="flex items-center gap-2.25 mb-0.75">
      <HugeiconsIcon
        icon={BadgeQuestionMarkIcon}
        strokeWidth={1.5}
        className="size-3.75 text-mist-soft"
      />
      <h2 className="sec-head">Частые вопросы</h2>
    </div>
  );
}
