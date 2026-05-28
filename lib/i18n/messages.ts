import zhMessages from "@/messages/zh.json";
import enMessages from "@/messages/en.json";
import msMessages from "@/messages/ms.json";

type Messages = Record<string, Record<string, string>>;
const messages: Record<string, Messages> = { zh: zhMessages as Messages, en: enMessages as Messages, ms: msMessages as Messages };

export type Locale = "zh" | "en" | "ms";
export const defaultLocale: Locale = "zh";

export function translate(key: string, locale: Locale): string {
  const msgs = messages[locale] || messages.zh;
  const parts = key.split(".");
  let val: unknown = msgs;
  for (const p of parts) {
    if (val && typeof val === "object") val = (val as Record<string, unknown>)[p];
    else return key;
  }
  return typeof val === "string" ? val : key;
}
