import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ request }) => {
  const locale = request.headers.get('accept-language')?.split(',')[0] ?? 'fr';
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
