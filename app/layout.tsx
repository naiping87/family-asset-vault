import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Asset Vault - 家庭资产保险箱",
  description: "一站式管理您的房产、保险、租约与税务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
