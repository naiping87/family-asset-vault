import { cookies } from "next/headers";
import { translate, type Locale, defaultLocale } from "./messages";

export async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const val = cookieStore.get("NEXT_LOCALE")?.value;
    if (val === "en" || val === "ms") return val;
  } catch {}
  return defaultLocale;
}

export async function getT() {
  const locale = await getLocale();
  return (key: string) => translate(key, locale);
}
