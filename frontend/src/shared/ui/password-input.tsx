'use client';
import React, { forwardRef, useState, type ComponentProps } from 'react';
import { Input } from '@/src/shared/ui/input';
import { Button } from './button';
import { HugeiconsIcon } from '@hugeicons/react';
import { LookBottomIcon, LookRightIcon } from '@hugeicons/core-free-icons';

interface PasswordInputProps extends ComponentProps<'input'> {
  className?: string;
  passwordType?: 'password' | 'confirmPassword';
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { className, passwordType = 'password', ...props },
    ref,
  ) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={className}
          {...props}
        />
        {passwordType === 'password' && (
          <Button
            className="group absolute right-2 grid place-items-center w-9 h-9  rounded-[12px] text-faint cursor-pointer bg-transparent hover:bg-text/5 duration-200"
            type="button"
            aria-label={showPassword ? 'Показать пароль' : 'Спрятать пароль'}
            aria-pressed={showPassword}
            onClick={handleShowPassword}
          >
            <HugeiconsIcon
              icon={showPassword ? LookBottomIcon : LookRightIcon}
              strokeWidth={1.8}
              className="size-4 group-hover:text-text"
              aria-hidden="true"
            />
          </Button>
        )}
      </>
    );
  },
);
