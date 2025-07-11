import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export const locales = ['fr', 'en', 'ko'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'fr';

export default getRequestConfig(async () => {
  const headersList = headers();
  const acceptLanguage = headersList.get('Accept-Language') || '';
  
  let locale: Locale = defaultLocale;
  
  if (acceptLanguage.includes('ko') || acceptLanguage.includes('kr')) {
    locale = 'ko';
  } else if (acceptLanguage.includes('en')) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 