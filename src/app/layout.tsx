import type { Metadata } from "next";
import "./globals.css";
import BottomBar from "./components/common/bottomBar";
import TopBar from "./components/common/topBar";

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
        {/* 전체 모바일 프레임 */}
        <div className="w-full max-w-sm mx-auto min-h-dvh flex flex-col bg-background">
          
          {/* 상단 헤더 */}
          <TopBar />

          {/* 메인 콘텐츠(스크롤 가능) */}
          <main className="flex-1 overflow-y-auto px-4 pb-20">
            {children}
          </main>

          {/* 하단 네비게이션 */}
          <BottomBar />
        </div>
      </body>
    </html>
  );
}
