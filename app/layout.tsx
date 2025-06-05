import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import i18n from '@/lib/i18n';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Damien Demontis | Portfolio',
  description: 'Full-stack developer dreaming of Asia',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { locale, messages } = await i18n();
  return (
    <html lang={locale}>
      <body className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
