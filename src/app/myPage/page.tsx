'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pencil, UserCog, Info } from 'lucide-react';
import SettingMenuItem from '@/app/components/common/SettingMenuItem';

export default function MyPage() {
  const router = useRouter();

  // Mock user data
  const userData = {
    name: '이모임',
    avatar: '/images/img_animal.png',
  };

  return (
    <div className="flex flex-col h-full bg-white p-4">
      {/* Profile Section */}
      <section className="flex flex-col items-center pt-8 pb-12">
        <div className="relative">
          <Image
            src={userData.avatar}
            alt="User Avatar"
            width={90}
            height={90}
            className="rounded-full border-4 border-yellow-main"
          />
          <button className="absolute bottom-0 right-0 bg-yellow-main p-1.5 rounded-full border-2 border-white">
            <Pencil size={16} className="text-black" />
          </button>
        </div>
        <h1 className="mt-4 text-xl font-bold">{userData.name}</h1>
      </section>

      {/* Settings Menu */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <SettingMenuItem
            icon={<UserCog size={24} className="text-yellow-main" />}
            title="계정 관리"
            onClick={() => console.log('Navigate to Account Management')}
          />
          <hr className="ml-16 border-t border-gray-100" />
          <SettingMenuItem
            icon={<Info size={24} className="text-yellow-main" />}
            title="모여요 정보"
            onClick={() => console.log('Navigate to App Info')}
          />
        </div>
      </section>

      {/* CTA Banner */}
      <section>
        <div className="relative p-6 bg-yellow-main rounded-2xl text-black overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg">기본 시간표를 설정해 보세요!</h3>
            <p className="text-sm mb-4">모든 방에 불러올 수 있어요.</p>
            <button 
              onClick={() => router.push('/month')}
              className="px-6 py-2 bg-white rounded-full text-sm font-bold shadow-md"
            >
              설정하러 가기
            </button>
          </div>
          <Image
            src="/images/icon_month_gray.png" // Using as a placeholder background icon
            alt=""
            width={100}
            height={100}
            className="absolute -right-4 -bottom-4 z-0 opacity-20"
          />
        </div>
      </section>
    </div>
  );
}