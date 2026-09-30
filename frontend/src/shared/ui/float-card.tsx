import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '../lib/utils';
import type { IconType } from '../types/icon';
import type { ReactNode } from 'react';

type CustomConfig = {
  type: 'custom';
  icon: ReactNode;
};

type DefaultConfig = {
  type: 'default';
  icon: IconType;
};

type IconConfig = CustomConfig | DefaultConfig;

export type FloatCardSettings = {
  title: string;
  description?: string;
} & IconConfig;

interface FloatCardProps {
  className?: string;
  settings: FloatCardSettings;
}

export function FloatCard({ className, settings }: FloatCardProps) {
  const isDefault: boolean = settings.type === 'default';
  const isCustom: boolean = settings.type === 'custom';

  return (
    <div
      className={cn(
        'absolute z-20 flex items-center gap-3 py-3 px-4 rounded-[18px] bg-surface/80 backdrop-blur-[10px] shadow-[0_14px_40px_-18px_rgba(0,0,0,0.8),inset_0_0_0_1px_var(--line-2)]',
        className,
      )}
    >
      <div
        className={cn(
          'grid place-items-center w-9 h-9 rounded-[12px] text-rose bg-rose/14',
          {
            'w-auto': isCustom,
            'bg-transparent': isCustom,
            'rounded-none': isCustom,
          },
        )}
      >
        {isDefault && (
          <HugeiconsIcon
            icon={settings.icon as IconType}
            strokeWidth={2}
            className={`ic`}
          />
        )}
        {isCustom && (
          <div className="w-full flex flex-row rounded-[11px] shadow-[0_0_0_2px_#282021] -ml-2.25 mr-1">
            {settings.icon as ReactNode}
          </div>
        )}
      </div>

      <p>
        <small className="block text-[12px] text-faint leading-3">
          {settings.title}
        </small>
        {settings.description && (
          <b className="font-semibold text-[14.5px]">{settings.description}</b>
        )}
      </p>
    </div>
  );
}
