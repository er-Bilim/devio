import './globals.css';

import { Unbounded, Onest, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { AuthHydrator } from '@/entities/user/ui/AuthHydrator';
import { getMe } from '@/entities/user/api/server';
import type { Metadata } from 'next';
import { cn } from '@/shared/lib/utils';

const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-body',
});

const jbMono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    template: '%s · devio',
    default: 'devio – маршруты в IT',
  },
  description: 'Интерактивные роадмапы: что учить, зачем и что после чего',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const me = await getMe();

  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        `${unbounded.variable}`,
        `${onest.variable}`,
        `${jbMono.variable}`,
      )}
    >
      <body className="min-h-full flex flex-col bg-night font-body text-[15px]">
        <Providers>
          <AuthHydrator user={me} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
