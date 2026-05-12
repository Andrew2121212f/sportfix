export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

/** RTL-локали — переключает dir="rtl" на <html> и логические направления в Tailwind */
export const RTL_LOCALES: ReadonlyArray<Locale> = ["ar"];

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}
