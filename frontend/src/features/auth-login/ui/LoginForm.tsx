'use client';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import { ArrowRight, Eye, KeyRound, Mail } from 'lucide-react';

export function LoginForm() {
  return (
    <form>
      <div className="grid grid-cols-1 gap-3">
        <div className="mb-2">
          <label
            htmlFor="email"
            className="block text-[12px] text-mist-soft font-mono mb-1.75 uppercase"
          >
            email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mist-soft z-10 pointer-events-none" />
            <Input
              placeholder="you@gmail.com"
              className="w-full py-6 pr-10 pl-10 bg-panel-2 text-mist border border-line placeholder:text-[#556184] focus-visible:outline-none focus-visible:border-signal focus-visible:shadow-[4px_5px_10px_rgba(77,163,255,0.18)]"
              autoComplete="email"
              type="email"
            />
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="password"
            className="block text-[12px] text-mist-soft font-mono mb-1.75 uppercase"
          >
            пароль
          </label>
          <div className="relative flex items-center">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mist-soft z-10 pointer-events-none" />
            <Input
              placeholder="••••••••"
              className="w-full py-6 pr-10 pl-10 bg-panel-2 text-mist border border-line placeholder:text-[#556184] focus-visible:outline-none focus-visible:border-signal focus-visible:shadow-[4px_5px_10px_rgba(77,163,255,0.18)]"
              autoComplete="current-password"
              type="password"
            />
            <Button className="absolute bg-transparent border-transparent text-mist-soft right-2 p-1.5 hover:text-mist hover:bg-transparent">
              <Eye className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-0.3">
          <Button
            type="submit"
            className="w-full py-6 bg-signal text-[#071120] font-body font-bold text-[15px] flex items-center justify-center gap-2.25 hover:bg-[#6ab4ff] active:bg-signal-deep"
          >
            Войти
            <ArrowRight className="stroke-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
