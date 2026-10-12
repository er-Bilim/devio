import { RegisterForm } from '@/features/auth/auth-register';
import type { AuthMode } from '../model/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { AuthFormTitle } from './AuthFormTitle';
import { useAuthMode } from '../lib/useAuthMode';
import { LoginForm } from '@/features/auth/auth-login';

const tabsTriggerStyle: string =
  'relative z-10 h-10.5 rounded-full bg-transparent text-muted text-[14.5px] font-medium cursor-pointer data-[state=active]:bg-surface-2/70 data-[state=active]:text-text data-[state=active]:font-semibold';

export function AuthCard() {
  const { setAuthParams, authMode: mode } = useAuthMode();

  return (
    <div className="relative p-8 rounded-[32px] bg-surface-2/70 border border-line">
      <Tabs
        defaultValue={mode}
        onValueChange={(value: string) => setAuthParams(value as AuthMode)}
      >
        <TabsContent value={mode}>
          <AuthFormTitle mode={mode} />
        </TabsContent>
        <TabsList className="w-full relative grid grid-cols-2 p-1.25 mt-6 rounded-full bg-bg/50 border border-line">
          <TabsTrigger value="signin" className={tabsTriggerStyle}>
            Войти
          </TabsTrigger>
          <TabsTrigger value="signup" className={tabsTriggerStyle}>
            Регистрация
          </TabsTrigger>
        </TabsList>
        <TabsContent value={mode}>
          {mode === 'signin' ? <LoginForm /> : <RegisterForm />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
