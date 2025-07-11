import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'ko'],

  // Used when no locale matches
  defaultLocale: 'fr',

  // Automatically detect the locale based on the user's browser
  localeDetection: true
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en|ko)/:path*']
}; 