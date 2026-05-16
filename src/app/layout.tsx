import type { Metadata } from "next";

import "./globals.css";

import { CartProvider } from "@/lib/cart-store";
import { FloatingDebugDock } from "@/components/FloatingDebugDock";
import { NotiflyProvider } from "@/components/NotiflyProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "NOTIF — 오늘의 무드, 내일의 일상",
  description:
    "디자이너 가구, 리빙, 키친, 침구, 향. 큐레이터가 직접 고른 라이프스타일 셀렉트샵.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NotiflyProvider>
          <CartProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <FloatingDebugDock />
          </CartProvider>
        </NotiflyProvider>
      </body>
    </html>
  );
}
