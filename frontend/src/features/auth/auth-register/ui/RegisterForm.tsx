'use client';
import { useAuth } from '@/src/entities/user';
import { Button } from '@/src/shared/ui/button';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaRegister, type SchemaRegisterData } from '../model/schema';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight02Icon,
  AlertCircleIcon,
  AtIcon,
  MailAtSign01FreeIcons,
  ForgotPasswordIcon,
  AsteriskIcon,
  FrameIcon,
} from '@hugeicons/core-free-icons';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { UserAvatar } from '@/src/entities/user';
import { getAvatarKey } from '@/entities/user/lib/getAvatarKey';
import { AuthInput } from '../../ui/AuthInput';
import { getPasswordStrength } from '../lib/getPasswordStrength';
import { StrengthMeter } from '@/shared/ui/strength-meter';
import { Spinner } from '@/shared/ui/spinner';

export function RegisterForm() {
  const registerUser = useAuth((state) => state.register);
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<SchemaRegisterData>({
    resolver: zodResolver(schemaRegister),
  });

  const username = useWatch({ control, name: 'username' });
  const password = useWatch({ control, name: 'password' });
  const passwordStrength = getPasswordStrength(password);

  const onSubmitRegister = handleSubmit(async (data) => {
    try {
      await registerUser(
        data.email,
        data.username,
        data.display_name,
        data.password,
      );
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
    <form onSubmit={onSubmitRegister}>
      <div className="flex flex-col gap-4 mt-6">
        <AuthInput
          icon={AtIcon}
          label={{
            htmlFor: 'username',
            title: 'Имя пользователя',
          }}
          errorMessage={errors.username?.message}
          id="username"
          placeholder="devio"
          autoComplete="username"
          type="text"
          {...register('username')}
        />

        <div className="flex items-center gap-3.5 py-3 px-3.5 rounded-[18px] bg-rose/10 border border-line-2">
          <div className="rounded-[17px] overflow-hidden shrink-0">
            <UserAvatar username={username} size={52} />
          </div>
          <p>
            <small className="block text-[12px] text-faint leading-[1.3]">
              Твой попутчик
            </small>
            <b className="font-soft font-extrabold text-[15px] text-rose-soft uppercase tracking-[1px]">
              {getAvatarKey(username)}
            </b>
          </p>
        </div>

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

        <div>
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
            {...register('password')}
            passwordType="password"
          />
          <StrengthMeter strength={passwordStrength.score} />
          <div className="flex items-center gap-1.5 mt-1.75 text-faint text-[12.5px]">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              strokeWidth={1.5}
              className="text-faint size-4"
            />
            <span>Минимум 16 символов</span>
          </div>
        </div>
        <AuthInput
          icon={AsteriskIcon}
          label={{
            htmlFor: 'confirmPassword',
            title: 'Повторите пароль',
          }}
          errorMessage={errors.confirm?.message}
          id="confirmPassword"
          placeholder="••••••••"
          autoComplete="password"
          {...register('confirm')}
          passwordType="confirmPassword"
          disabled={isSubmitting}
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
              Создать аккаунт
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

      <div className="flex items-center justify-center flex-col">
        <p className="text-[12px] text-faint mt-2 flex items-center gap-2">
          Пароль хранится только в виде хеша
          <HugeiconsIcon
            icon={FrameIcon}
            strokeWidth={1.5}
            className="size-3"
            aria-hidden="true"
          />
        </p>
      </div>
    </form>
  );
}
