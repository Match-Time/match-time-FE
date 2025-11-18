import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모여요",
  description: "모임 시간을 쉽게 잡는 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-background">
        {children}
      </body>
    </html>
  );
}
