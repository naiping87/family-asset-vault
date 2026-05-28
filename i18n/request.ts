import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, type Locale } from "./config";

const messageLoaders: Record<Locale, () => Promise<Record<string, unknown>>> = {
  zh: () => import("../messages/zh.json").then((m) => m.default),
  en: () => import("../messages/en.json").then((m) => m.default),
  ms: () => import("../messages/ms.json").then((m) => m.default),
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  let locale: Locale = defaultLocale;
  if (localeCookie === "en" || localeCookie === "ms") {
    locale = localeCookie;
  }

  return {
    locale,
    messages: await messageLoaders[locale](),
  };
});
