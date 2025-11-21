import type {Metadata} from 'next';
import {Nunito} from 'next/font/google';
import './globals.css';
import ConditionalBottomBar from './components/common/ConditionalBottomBar';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
});

// 메타 데이터
export const metadata: Metadata = {
  title: '모여요',
  description: '모임 시간을 쉽게 잡는 서비스',
};

// 공통 레이아웃
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <head />

      <body className={`${nunito.className} antialiased bg-blue-50`}>
        {/* 전체 모바일 프레임 */}
        <div className="flex flex-col w-full max-w-sm mx-auto h-dvh font-suit bg-background">
          {/* 메인 콘텐츠(스크롤 가능) */}
          <main className="flex-1 overflow-auto p-4 bg-white">{children}</main>

          {/* 하단 네비 */}
          <ConditionalBottomBar />
        </div>
      </body>
    </html>
  );
}
