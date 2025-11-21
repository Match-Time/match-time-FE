"use client";

import Image from 'next/image';
import { useRouter } from "next/navigation";

interface TopBarProps {
  title: string;
  showSetting?: boolean;
  onSettingClick?: () => void;
}

export default function TopBar({ title = "모여요", showSetting, onSettingClick }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b">
      <button onClick={() => router.back()}>
        <Image src="/images/ic_back.png" alt="back" width={24} height={24} />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
      {showSetting ? (
        <button onClick={onSettingClick}>
            <Image src="/images/ic_setting.png" alt="setting" width={24} height={24} />
        </button>
      ) : (
        <div className="w-6" /> 
      )}
    </header>
  );
}
