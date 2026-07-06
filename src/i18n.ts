import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, isLocale } from './i18n-config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale =
    savedLocale && isLocale(savedLocale) ? savedLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
