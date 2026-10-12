'use client';
import { Button } from '@/src/shared/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight02Icon,
  MailAtSign01FreeIcons,
  ForgotPasswordIcon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '@/src/entities/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaLogin, type SchemaLoginData } from '../model/schema';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { Spinner } from '@/shared/ui/spinner';
import { useRouter } from 'next/navigation';
import { AuthInput } from '../../ui/AuthInput';

export function LoginForm() {
  const loginUser = useAuth((state) => state.login);
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SchemaLoginData>({
    resolver: zodResolver(schemaLogin),
  });

  const onSubmitLogin = handleSubmit(async (data) => {
    try {
      await loginUser(data.email, data.password);
      reset();
      router.replace('/');
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setError('root', { message: 'Неверный email или пароль' });
      } else {
        setError('root', { message: 'Что-то пошло не так, попробуйте позже' });
      }
    }
  });

  return (
    <form onSubmit={onSubmitLogin}>
      <div className="flex flex-col gap-4 mt-6">
        <AuthInput
          icon={MailAtSign01FreeIcons}
          label={{
            htmlFor: 'email',
            title: 'Email',
          }}
          errorMessage={errors.email?.message}
          id="email"
          placeholder="you@gmail.com"
          autoComplete="email"
          type="email"
          {...register('email')}
        />

        <AuthInput
          icon={ForgotPasswordIcon}
          label={{
            htmlFor: 'password',
            title: 'Пароль',
          }}
          errorMessage={errors.password?.message}
          id="password"
          placeholder="••••••••"
          autoComplete="password"
          passwordType="password"
          {...register('password')}
        />

        <Button
          className="flex items-center justify-center gap-2.5 h-13.5 mt-1.5 rounded-[16px] cursor-pointer bg-rose text-bg font-semibold text-[15px] hover:bg-rose-soft duration-300 disabled:bg-rose/50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            <>
              Войти
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                strokeWidth={1.8}
                className="size-4"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
