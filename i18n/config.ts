export const locales = ["zh", "en", "ms"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";
