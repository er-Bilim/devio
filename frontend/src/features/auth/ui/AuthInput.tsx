import { cn } from '@/shared/lib/utils';
import type { IconType } from '@/shared/types/icon';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ComponentProps } from 'react';

interface AuthInputProps extends ComponentProps<'input'> {
  icon?: IconType;
  label?: {
    htmlFor: string;
    title: string;
  };
  passwordType?: 'password' | 'confirmPassword';
  errorMessage?: string | undefined;
}

const inputStyle: string =
  'w-full h-13 py-0 pr-12 pl-12 rounded-[16px] bg-bg/60 text-text text-[15px] border border-line-2 placeholder:text-faint outline-none focus:inset-ring-[1.5px] focus:inset-ring-rose focus:ring-4 focus:ring-[rgba(224,138,126,0.12)] focus:bg-bg/80';

export function AuthInput({
  icon,
  label,
  passwordType,
  errorMessage,
  ...props
}: AuthInputProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={label.htmlFor}
          className="flex justify-between items-baseline text-[13.5px] text-muted mb-2"
        >
          {label.title}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            strokeWidth={1.5}
            className="ic absolute left-4 w-4.25 h-4.25 text-faint pointer-events-none"
          />
        )}
        {passwordType ? (
          <>
            <PasswordInput
              {...props}
              className={cn(inputStyle, {
                'opacity-40 cursor-not-allowed': props.disabled,
              })}
              passwordType={passwordType}
            />
          </>
        ) : (
          <>
            <Input
              className={cn(inputStyle, {
                'border-2 border-alarm': errorMessage,
                'opacity-40 cursor-not-allowed': props.disabled,
              })}
              {...props}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <p className="flex items-center gap-4 mt-3.5 text-alarm text-[12.5px]">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            strokeWidth={1.5}
            className="text-alarm size-4"
          />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}
