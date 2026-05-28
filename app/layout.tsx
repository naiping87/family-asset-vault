import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n/provider";
import { getLocale } from "@/lib/i18n/server";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Family Asset Vault - 家庭资产保险箱",
  description: "一站式管理您的房产、保险、租约与税务",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`,
        }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <I18nProvider locale={locale}>
          {children}
        </I18nProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
