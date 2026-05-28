"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translate, type Locale, defaultLocale } from "./messages";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (k) => k,
});

export function I18nProvider({ locale: initialLocale, children }: { locale: string; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    (["zh", "en", "ms"].includes(initialLocale) ? initialLocale : "zh") as Locale
  );

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  }, []);

  const t = useCallback(
    (key: string) => translate(key, locale),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  return { t: ctx.t, locale: ctx.locale, setLocale: ctx.setLocale };
}
