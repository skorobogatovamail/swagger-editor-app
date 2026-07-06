import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export type Locale = 'en' | 'ru';

export const locales = ['en', 'ru'];
const defaultLocale = 'en';

const isLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale);
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale =
    savedLocale && isLocale(savedLocale) ? savedLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default as Record<
      string,
      string
    >,
  };
});
