export function formatCurrency(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function daysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const greetings: Record<string, [string, string, string]> = {
  zh: ["早上好", "下午好", "晚上好"],
  en: ["Good morning", "Good afternoon", "Good evening"],
  ms: ["Selamat pagi", "Selamat petang", "Selamat malam"],
};

export function getGreeting(lang: string = "zh"): string {
  const hour = new Date().getHours();
  const g = greetings[lang] ?? greetings.zh;
  if (hour < 12) return g[0];
  if (hour < 18) return g[1];
  return g[2];
}

export function formatFullDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekday = weekdays[d.getDay()];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 · ${weekday}`;
}
