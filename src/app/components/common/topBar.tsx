"use client";

import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  return (
    <header className="h-14 flex items-center px-4 bg-white border-b">
      <button onClick={() => router.back()} className="text-sm">
        ←
      </button>
      <h1 className="flex-1 text-center font-semibold">모여요</h1>
      <div className="w-6" /> {/* 오른쪽 균형 맞추는 용 */}
    </header>
  );
}
