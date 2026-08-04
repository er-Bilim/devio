import './globals.css';
import { cn } from '@/shared/lib/utils';
import { Unbounded, Onest, JetBrains_Mono } from 'next/font/google';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
