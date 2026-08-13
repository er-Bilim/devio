'use client';
import { useAuth } from '@/src/entities/user';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaRegister, type SchemaRegisterData } from '../model/schema';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MailAtSign01Icon,
  PasswordValidationIcon,
  ArrowRight02Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { isAxiosError } from 'axios';
import { PasswordInput } from '@/src/shared/ui/password-input';
import { Spinner } from '@/shared/ui/spinner';

export function RegisterForm() {
  const registerUser = useAuth((state) => state.register);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SchemaRegisterData>({
    resolver: zodResolver(schemaRegister),
  });

  const onSubmitRegister = handleSubmit(async (data) => {
    try {
      await registerUser(data.email, data.password).then(() => reset());
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setError('root', { message: 'Неверный email или пароль' });
      } else {
        setError('root', { message: 'Что-то пошло не так, попробуйте снова' });
      }
    }
  });

  return (
    <form onSubmit={onSubmitRegister}>
      <div className="grid grid-cols-1 gap-3">
        <div className="mb-2">
          <label
            htmlFor="email"
            className="block text-[12px] text-mist-soft font-mono mb-1.75 uppercase"
          >
            email
          </label>

          <div className="relative">
            <HugeiconsIcon
              icon={MailAtSign01Icon}
              strokeWidth={1.8}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mist-soft z-10 pointer-events-none"
            />
            <Input
              id="email"
              placeholder="you@gmail.com"
              className="w-full py-6 pr-10 pl-10 bg-panel-2 text-mist border border-line placeholder:text-[#556184] focus-visible:outline-none focus-visible:border-signal focus-visible:shadow-[4px_5px_10px_rgba(77,163,255,0.18)]"
              autoComplete="email"
              type="email"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <div className=" mt-2 text-[12.5px]  text-red-400 inline-flex items-center gap-2" role='alert'>
              <HugeiconsIcon
                icon={AlertCircleIcon}
                strokeWidth={1.8}
                className="size-4"
              />
              <p>{errors.email.message}</p>
            </div>
          )}
        </div>
        <div className="mb-2">
          <label
            htmlFor="password"
            className="block text-[12px] text-mist-soft font-mono mb-1.75 uppercase"
          >
            пароль
          </label>
          <PasswordInput
            {...register('password')}
            placeholder="минимум 8 символов"
            id="password"
            autoComplete="current-password"
            className="w-full py-6 pr-10 pl-10 bg-panel-2 text-mist border border-line placeholder:text-[#556184] focus-visible:outline-none focus-visible:border-signal focus-visible:shadow-[4px_5px_10px_rgba(77,163,255,0.18)]"
          />
          {errors.password && (
            <div className="mt-2 text-[12.5px] text-red-400 inline-flex items-center gap-2">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                strokeWidth={1.8}
                className="size-4"
              />
              <p>{errors.password.message}</p>
            </div>
          )}
        </div>

        <div className="mb-2">
          <label
            htmlFor="password-confirm"
            className="block text-[12px] text-mist-soft font-mono mb-1.75 uppercase"
          >
            повторите пароль
          </label>
          <div className="relative flex items-center">
            <HugeiconsIcon
              icon={PasswordValidationIcon}
              strokeWidth={1.8}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mist-soft z-10 pointer-events-none"
            />
            <Input
              id="password-confirm"
              placeholder="••••••••"
              className="w-full py-6 pr-10 pl-10 bg-panel-2 text-mist border border-line placeholder:text-[#556184] focus-visible:outline-none focus-visible:border-signal focus-visible:shadow-[4px_5px_10px_rgba(77,163,255,0.18)]"
              autoComplete="new-password"
              type="password"
              {...register('confirm')}
            />
          </div>
          {errors.confirm && (
            <div className="mt-2 text-[12.5px] text-red-400 inline-flex items-center gap-2">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                strokeWidth={1.8}
                className="size-4"
              />
              <p>{errors.confirm.message}</p>
            </div>
          )}
        </div>

        {errors.root && (
          <div className="mt-2 text-[12.5px] text-red-400 inline-flex items-center gap-2">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              strokeWidth={1.8}
              className="size-4"
            />
            <p>{errors.root.message}</p>
          </div>
        )}

        <div className="mt-0.3">
          <Button
            type="submit"
            className="w-full py-5 bg-signal text-[#071120] font-body font-bold text-[15px] flex items-center justify-center gap-2.25 hover:bg-[#6ab4ff] active:bg-signal-deep"
          >
            Создать аккаунт
            {isSubmitting ? (
              <Spinner />
            ) : (
              <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={1.8} />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
