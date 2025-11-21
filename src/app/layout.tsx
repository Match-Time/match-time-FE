import type {Metadata} from 'next';
import './globals.css';
import ConditionalBottomBar from './components/common/ConditionalBottomBar';
import TopBar from './components/common/topBar';

// 메타 데이터
export const metadata: Metadata = {
  title: '모여요',
  description: '모임 시간을 쉽게 잡는 서비스',
};

// 공통 레이아웃
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <head>
        {/* Google Fonts Preload */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="antialiased bg-blue-50">
        {/* 전체 모바일 프레임 */}
        <div className="flex flex-col w-full max-w-sm mx-auto min-h-dvh font-suit bg-background">
          {/* 메인 콘텐츠(스크롤 가능) */}
          <main className="flex-1 overflow-auto p-4 bg-white">{children}</main>

          {/* 하단 네비 */}
          <ConditionalBottomBar />
        </div>
      </body>
    </html>
  );
}
