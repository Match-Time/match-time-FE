'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {Pencil, UserCog, Info} from 'lucide-react';
import SettingMenuItem from '@/app/components/common/SettingMenuItem';
import {getUser, saveUser} from '@/lib/userStorage';
import {updateUserNickname} from '@/lib/api';

export default function MyPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }
    setNickname(stored.nickname);
    setEmail(stored.email);
  }, [router]);

  const handleNicknameChange = async () => {
    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }
    const next = prompt('새 닉네임을 입력하세요', nickname);
    if (!next || next.trim() === nickname) return;
    try {
      const updated = await updateUserNickname(stored.id, next.trim());
      saveUser({id: updated.id, email: updated.email, nickname: updated.nickname});
      setNickname(updated.nickname);
      setError(null);
    } catch (err: any) {
      setError(err.message || '닉네임을 변경하지 못했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Profile Section */}
      <section className="flex flex-col items-center pt-8 pb-8">
        <div className="relative pr-2">
          <Image
            src="/images/ic_profile_cat.png"
            alt="User Avatar"
            width={133}
            height={118}
            className="rounded-full"
          />
        </div>
        <h1 className=" text-xl mt-1 font-bold text-gray-dark">{nickname}</h1>
        <p className="text-sm text-gray-medium mt-1">{email}</p>
        {error && <p className="text-sm text-red-main mt-2">{error}</p>}
      </section>

      {/* Settings Menu */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <SettingMenuItem
            icon={<UserCog size={24} className="text-yellow-main" />}
            title="계정 관리"
            onClick={handleNicknameChange}
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
        <div className="relative p-6 bg-gradient-to-r from-yellow-main to-yellow-light rounded-2xl text-black overflow-hidden">
          <Image
            src="/images/ic_calender.png"
            alt=""
            width={40}
            height={40}
            className="absolute left-4 top-4 z-0 opacity-70"
          />
          <Image
            src="/images/ic_clock.png"
            alt=""
            width={30}
            height={30}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-0 opacity-70"
          />
          <div className="relative z-10 w-full text-center">
            <h3 className="font-bold text-white text-lg">
              기본 시간표를 설정해 보세요!
            </h3>
            <p className="text-sm text-white mb-2">
              모든 방에 불러올 수 있어요.
            </p>
            <button
              onClick={() => router.push('/month')}
              className="w-full px-6 py-2 bg-white text-yellow-dark rounded-full text-xs font-bold"
            >
              설정하러 가기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
