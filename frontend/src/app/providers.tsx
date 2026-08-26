'use client';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/entities/user';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const init = useAuth((state) => state.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
