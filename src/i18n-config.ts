export const locales = ['en', 'ru'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale);
};
