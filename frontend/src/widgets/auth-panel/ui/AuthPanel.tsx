import { LoginForm } from '@/features/auth-login';
import { RegisterForm } from '@/features/auth-register';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';

export function AuthPanel() {
  const tabsTriggerStyle: string =
    'flex-1 text-center py-5 font-semibold text-[14px] text-mist-soft border-transparent bg-transparent font-body data-[state=active]:bg-panel data-[state=active]:text-mist data-[state=active]:inset-ring-1 data-[state=active]:inset-ring-line [&:hover:not([data-state=active])]:text-mist';

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsContent value="signin">
        <div className="mb-6.5">
          <h2 className="font-display font-semibold text-[24px] tracking-wide text-mist">
            С возвращением
          </h2>
          <p className="text-mist-soft text-[14px] mt-1.5">
            Войди, чтобы продолжить с текущей станции
          </p>
        </div>
      </TabsContent>
      <TabsContent value="signup">
        <div className="mb-6.5">
          <h2 className="font-display font-semibold text-[24px] tracking-wide text-mist">
            Начни свой путь
          </h2>
          <p className="text-mist-soft text-[14px] mt-1.5">
            Одна минута – и первая станция твоя
          </p>
        </div>
      </TabsContent>
      <TabsList className="w-full flex gap-1 bg-panel-2 border border-line mb-4 py-6">
        <TabsTrigger value="signin" className={tabsTriggerStyle}>
          Вход
        </TabsTrigger>
        <TabsTrigger value="signup" className={tabsTriggerStyle}>
          Регистрация
        </TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <LoginForm />
      </TabsContent>
      <TabsContent value="signup">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};