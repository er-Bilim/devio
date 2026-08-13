'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/entities/user';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const init = useAuth((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
