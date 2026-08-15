import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/provider";
import { getLocale } from "@/lib/i18n/server";
import { SessionGuard } from "@/components/layout/SessionGuard";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

export const dynamic = "force-dynamic";

// 自托管 Inter,消除 Google Fonts 渲染阻塞(网络慢/被墙时页面不再卡加载)
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Family Asset Vault - 家庭资产保险箱",
  description: "一站式管理您的房产、保险、租约与税务",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`,
        }} />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <SessionGuard />
          {children}
        </I18nProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
