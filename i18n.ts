import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const messageLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  zh: () => import("./messages/zh.json").then((m) => m.default),
  en: () => import("./messages/en.json").then((m) => m.default),
  ms: () => import("./messages/ms.json").then((m) => m.default),
};

export default getRequestConfig(async () => {
  let locale = "zh";
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieVal === "en" || cookieVal === "ms") locale = cookieVal;
  } catch {
    // cookies() not available (static generation), use default
  }

  return {
    locale,
    messages: await messageLoaders[locale](),
  };
});
