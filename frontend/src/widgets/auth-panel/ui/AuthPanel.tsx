'use client';

import { LoginForm } from '@/features/auth-login';
import { RegisterForm } from '@/features/auth-register';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { useState } from 'react';
import { AuthFormTitle } from './AuthFormTitle';
import { BrandAside } from './BrandAside';

export function AuthPanel() {
  const [activeTab, setActiveTab] = useState<
    'signin' | 'signup' | string | null
  >(null);

  const tabsTriggerStyle: string =
    'flex-1 text-center py-5 font-semibold text-[14px] text-mist-soft border-transparent bg-transparent font-body data-[state=active]:bg-panel data-[state=active]:text-mist data-[state=active]:inset-ring-1 data-[state=active]:inset-ring-line [&:hover:not([data-state=active])]:text-mist';

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] min-h-screen">
      <BrandAside variant={activeTab || 'signup'} />
      <div className="flex items-center justify-center py-10 px-6">
        <Tabs
          defaultValue="signup"
          className="max-w-100 w-full"
          onValueChange={handleTabChange}
        >
          <TabsContent value={activeTab || 'signup'}>
            <AuthFormTitle variant={activeTab || 'signup'} />
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
      </div>
    </div>
  );
}
