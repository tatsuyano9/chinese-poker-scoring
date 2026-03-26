import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chinese Poker Scoring",
  description: "チャイニーズポーカーの点数計算アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
