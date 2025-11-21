'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {getUser} from '@/lib/userStorage';
import {fetchUserRooms, joinByInvite, Room} from '@/lib/api';

export default function InviteJoinPage() {
  const params = useParams();
  const router = useRouter();
  const inviteCode = params.inviteCode as string;

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('모임에 참여 중입니다...');

  useEffect(() => {
    const run = async () => {
      const stored = getUser();
      if (!stored) {
        setStatus('error');
        setMessage('로그인이 필요합니다. 다시 로그인해 주세요.');
        router.push('/');
        return;
      }
      try {
        await joinByInvite(stored.id, inviteCode);
        const rooms = await fetchUserRooms(stored.id);
        const target = rooms.find((r: Room) => r.inviteCode === inviteCode);
        setStatus('success');
        setMessage('참여 완료! 이동합니다...');
        router.push(target ? `/group/${target.id}` : '/group');
      } catch (err: Error) {
        setStatus('error');
        setMessage(err.message || '참여에 실패했습니다.');
      }
    };
    run();
  }, [inviteCode, router]);

  return (
    <div className="flex flex-col h-full items-center justify-center space-y-4 bg-white text-center p-6">
      <p className="text-lg font-semibold">
        {status === 'loading' ? '초대 코드를 확인 중...' : message}
      </p>
      {status === 'loading' && (
        <p className="text-sm text-gray-medium">잠시만 기다려주세요.</p>
      )}
      {status === 'error' && (
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-yellow-main rounded-full text-black font-semibold"
        >
          홈으로 가기
        </button>
      )}
    </div>
  );
}
