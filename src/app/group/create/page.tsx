'use client';

import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createRoom, joinRoom, RoomType} from '@/lib/api';
import {getUser} from '@/lib/userStorage';

const meetingTypes = [
  {label: '팀 회의', value: 'ONCE'},
  {label: '정기 회의', value: 'WEEKLY'},
  {label: '친구 모임', value: 'ONCE'},
  {label: '기타', value: 'ONCE'},
] as const;

export default function CreateGroupPage() {
  const [meetingName, setMeetingName] = useState('');
  const [meetingType, setMeetingType] = useState<
    (typeof meetingTypes)[number]['value'] | ''
  >('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isFormValid = meetingName.trim() !== '' && meetingType !== '';

  const handleNextClick = async () => {
    if (!isFormValid || loading) return;
    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const room = await createRoom({
        name: meetingName.trim(),
        type: meetingType as RoomType,
      });
      await joinRoom(stored.id, room.id);
      router.push(`/group/${room.id}/month`);
    } catch (err: any) {
      setError(err.message || '방을 만들지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="relative flex items-center justify-center mb-8">
        <Link href="/group" className="absolute left-0">
          <Image
            src="/images/ic_back.png"
            alt="뒤로가기"
            width={18}
            height={30}
          />
        </Link>
        <h1 className="text-lg font-semibold">모임 기본 정보 입력</h1>
      </header>
      <main className="flex-grow">
        <div className="mb-8">
          <label className="block mb-2 font-semibold">
            모임 이름을 입력해 주세요{' '}
            <span className="text-red-main text-xs font-light">(필수)</span>
          </label>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="예시: 걸스나잇 해요"
            className="w-full p-3 border-2  border-gray-light rounded-xl 
focus:outline-none focus:border-transparent focus:ring-2 focus:ring-yellow-main"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            모임 유형를 선택해 주세요{' '}
            <span className="text-red-main text-xs font-light">(필수)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {meetingTypes.map((type) => (
              <button
                key={type.label}
                onClick={() => setMeetingType(type.value)}
                className={`px-4 py-1 rounded-full text-sm font-semibold border
                  ${
                    meetingType === type.value
                      ? 'bg-yellow-main font-normal text-white border-yellow-main'
                      : 'bg-gray-background text-gray-light font-light border-gray-background'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-main mt-4">{error}</p>}
      </main>
      <div className="fixed bottom-8 left-0 right-0">
        <footer className="w-full max-w-sm mx-auto bg-white px-4 pb-4">
          <button
            onClick={handleNextClick}
            disabled={!isFormValid || loading}
            className={`w-full py-4 text-base font-semibold text-white rounded-xl
                    ${
                      isFormValid
                        ? 'bg-gradient-to-r from-yellow-main to-yellow-light'
                        : 'bg-gray-light'
                    }`}
          >
            {loading ? '만드는 중...' : '다음'}
          </button>
        </footer>
      </div>{' '}
    </div>
  );
}
