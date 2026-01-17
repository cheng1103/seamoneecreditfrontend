export const locales = ['en', 'ms'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  ms: '🇲🇾',
};
