import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ru'];
const defaultLocale = 'en';

export default getRequestConfig(async () => {
  const locale = defaultLocale;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
