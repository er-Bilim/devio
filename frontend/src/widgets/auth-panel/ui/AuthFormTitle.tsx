interface AuthFormTitleProps {
  variant: string | 'signin' | 'signup';
}

export function AuthFormTitle({ variant }: AuthFormTitleProps) {
  const isLogin = variant === 'signin';
  const isRegister = variant === 'signup';

  return (
    <div className="mb-6.5">
      <h2 className="font-display font-semibold text-[24px] tracking-wide text-mist">
        {isLogin && 'С возвращением'}
        {isRegister && 'Начни свой путь'}
      </h2>
      <p className="text-mist-soft text-[14px] mt-1.5">
        {isLogin && 'Войди, чтобы продолжить с текущей станции'}
        {isRegister && 'Одна минута – и первая станция твоя'}
      </p>
    </div>
  );
}
