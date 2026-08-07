'use client';
import React, { forwardRef, useState } from 'react';
import { Input } from '@/src/shared/ui/input';
import { Button } from './button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SquareLockPasswordIcon,
  LookBottomIcon,
  LookRightIcon,
} from '@hugeicons/core-free-icons';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(function PasswordInput(props, ref) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center">
      <HugeiconsIcon
        icon={SquareLockPasswordIcon}
        strokeWidth={1.8}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mist-soft z-10 pointer-events-none"
      />
      <Input ref={ref} type={showPassword ? 'text' : 'password'} {...props} />
      <Button
        className="absolute bg-transparent border-transparent text-mist-soft right-2 p-1.5 hover:text-mist hover:bg-transparent"
        type="button"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-pressed={showPassword}
        onClick={handleShowPassword}
      >
        <HugeiconsIcon
          icon={showPassword ? LookBottomIcon : LookRightIcon}
          strokeWidth={1.8}
          className="size-4"
          aria-hidden="true"
        />
      </Button>
    </div>
  );
});
