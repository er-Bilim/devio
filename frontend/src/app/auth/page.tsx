import { AuthPanel } from '@/src/widgets/auth-panel';

export const metadata = { title: 'Авторизация' };

const Auth = () => {
  return (
    <>
      <div className="aura" />
      <AuthPanel />
    </>
  );
};

export default Auth;
