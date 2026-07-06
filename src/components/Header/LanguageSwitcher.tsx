'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales } from '../../i18n';
import type { Locale } from '../../i18n';

export const LanguageSwitcher = () => {
  const currentLocale = useLocale();
  const router = useRouter();

  const handleLocaleChange = (locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };
  return (
    <select
      value={currentLocale}
      onChange={(event) => handleLocaleChange(event.target.value as Locale)}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm"
      aria-label="Select language"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
