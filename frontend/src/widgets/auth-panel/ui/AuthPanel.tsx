'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/shared/ui/logo';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import type { AuthMode } from '../model/types';
import { AuthCard } from './AuthCard';
import { useAuthMode } from '../lib/useAuthMode';

export function AuthPanel() {
  const { authMode } = useAuthMode();
  const [mode] = useState<AuthMode>(authMode);

  return (
    <>
      <div className="relative z-10 w-[min(1140px,100%-64px)] mx-auto min-h-screen flex flex-col pt-5.5 pb-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo size={28} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] py-2.25 px-3.5 rounded-full bg-surface"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              strokeWidth={1}
              className="ic text-muted"
            />
            <span className="text-muted">На главную</span>
          </Link>
        </div>

        <div className="flex-1 grid grid-cols-[460px_1fr] gap-7 items-center py-9">
          <AuthCard mode={mode} />
        </div>
      </div>
    </>
  );
}
