'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const meetingTypes = ['팀 회의', '정기 회의', '친구 모임', '기타'];

export default function CreateGroupPage() {
  const [meetingName, setMeetingName] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const router = useRouter();

  const isFormValid = meetingName.trim() !== '' && meetingType !== '';

  const handleNextClick = () => {
    if (isFormValid) {
      // TODO: API 연동하여 그룹 생성 후 해당 groupId로 이동 필요
      const groupId = 'temp-group-id';
      router.push(`/group/${groupId}/month`);
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
                key={type}
                onClick={() => setMeetingType(type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border
                  ${
                    meetingType === type
                      ? 'bg-yellow-main text-black border-yellow-main'
                      : 'bg-gray-light text-gray-400 border-gray-light'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Button */}
      <footer className="pb-4">
        <button
          onClick={handleNextClick}
          disabled={!isFormValid}
          className={`w-full py-4 text-lg font-bold text-white rounded-lg
            ${
              isFormValid
                ? 'bg-gradient-to-r from-yellow-main to-yellow-light'
                : 'bg-gray-medium'
            }`}
        >
          다음
        </button>
      </footer>
    </div>
  );
}