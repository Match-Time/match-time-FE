'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RoomType, createRoom, joinRoom } from '@/lib/api';
import { loadStoredUser } from '@/lib/auth';

const meetingTypes: { label: string; value: RoomType }[] = [
  { label: '일회성 모임', value: 'ONCE' },
  { label: '정기 모임', value: 'WEEKLY' },
];

export default function CreateGroupPage() {
  const [meetingName, setMeetingName] = useState('');
  const [meetingType, setMeetingType] = useState<RoomType | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = loadStoredUser();
    if (!user) {
      router.replace('/');
    }
  }, [router]);

  const isFormValid = meetingName.trim() !== '' && meetingType !== '';

  const handleNextClick = async () => {
    if (!isFormValid) return;

    const user = loadStoredUser();
    if (!user) {
      router.replace('/');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const room = await createRoom({ name: meetingName.trim(), type: meetingType as RoomType });
      await joinRoom(room.id, user.id);
      router.push(`/group/${room.id}/month`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '모임 생성에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <header className="relative flex items-center justify-center mb-4">
        <Link href="/group" className="absolute left-0">
          <Image src="/images/ic_back.png" alt="뒤로가기" width={24} height={24} />
        </Link>
        <h1 className="text-lg font-semibold">모임 기본 정보 입력</h1>
      </header>

      <main className="flex-grow">
        {/* Meeting Name Input */}
        <div className="mb-8">
          <label className="block mb-2 font-semibold">
            모임 이름을 입력해 주세요 <span className="text-red-500">(필수)</span>
          </label>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="걸스나잇 해요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-main"
          />
        </div>

        {/* Meeting Type Selection */}
        <div>
          <label className="block mb-2 font-semibold">
            모임 유형를 선택해 주세요 <span className="text-red-500">(필수)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {meetingTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setMeetingType(type.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border
                  ${
                    meetingType === type.value
                      ? 'bg-yellow-main text-black border-yellow-main'
                      : 'bg-gray-light text-gray-400 border-gray-light'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </main>

      {/* Bottom Button */}
      <footer className="pb-4">
        <button
          onClick={handleNextClick}
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-4 text-lg font-bold text-white rounded-lg
            ${
              isFormValid && !isSubmitting
                ? 'bg-gradient-to-r from-yellow-main to-yellow-light'
                : 'bg-gray-medium'
            }`}
        >
          {isSubmitting ? '생성 중...' : '다음'}
        </button>
      </footer>
    </div>
  );
}
