'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Tag from '@/app/components/common/Tag';
import { fetchRoomUsers, fetchUserRooms, Room } from '@/lib/api';
import { loadStoredUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function GroupPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = loadStoredUser();
    if (!user) {
      router.replace('/');
      return;
    }

    const loadRooms = async () => {
      try {
        const data = await fetchUserRooms(user.id);
        setRooms(data);

        // Fetch participant counts in parallel but ignore failures per room
        const results = await Promise.all(
          data.map(async (room) => {
            try {
              const users = await fetchRoomUsers(room.id);
              return [room.id, users.length] as const;
            } catch {
              return [room.id, 0] as const;
            }
          })
        );

        setCounts(Object.fromEntries(results));
      } catch (err) {
        setError(err instanceof Error ? err.message : '방 목록을 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, [router]);

  const formatRoomType = (type: Room['type']) => (type === 'WEEKLY' ? '정기 모임' : '일회성 모임');

  const formatConfirmed = (room: Room) => {
    if (room.confirmedDate) {
      const d = new Date(room.confirmedDate);
      return `${d.getMonth() + 1}월 ${d.getDate()}일`;
    }

    if (room.confirmedDay && room.confirmedStart && room.confirmedEnd) {
      return `${room.confirmedDay} ${room.confirmedStart}~${room.confirmedEnd}`;
    }

    return '미정';
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold font-onepick text-yellow-main">모여요</h1>
          <p className="text-gray-400">모임이 더 쉬워지는 순간</p>
        </div>
        <Image src="/images/img_alarm.png" alt="알람" width={40} height={40} />
      </header>

      {/* Invite Banner */}
      <div className="relative bg-yellow-main rounded-lg p-6 mb-8 text-black">
        <div className="relative z-10">
          <p className="font-bold text-lg mb-2">친구들을 초대해 볼까요?</p>
          <Link
            href="/group/create"
            className="inline-flex items-center bg-white px-4 py-2 rounded-full text-sm font-bold"
          >
            <Image
              src="/images/ic_plus.png"
              alt="플러스 아이콘"
              width={16}
              height={16}
              className="mr-2"
            />
            모임 만들러 가기
          </Link>
        </div>
        <div className="absolute top-[-30px] right-0 z-0">
          <Image src="/images/img_animal.png" alt="동물 캐릭터" width={150} height={100} />
        </div>
      </div>

      {/* Room List */}
      <div>
        <h2 className="font-bold text-lg mb-4">방 목록</h2>

        {isLoading && <p className="text-gray-500">불러오는 중...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-4">
          {rooms.map((room) => (
            <Link href={`/group/${room.id}`} key={room.id} className="block">
              <div className="flex items-center justify-between p-4 border border-yellow-main rounded-lg">
                <div>
                  <h3 className="font-bold">{room.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                    <Tag text={formatRoomType(room.type)} />
                    <span>{counts[room.id] ?? 0}명 참여 중</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-300 block">모임 확정</span>
                  <div className="flex items-center">
                    <p className="text-red font-bold text-lg mr-2">{formatConfirmed(room)}</p>
                    <Image src="/images/ic_next.png" alt="다음" width={12} height={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {!isLoading && rooms.length === 0 && (
            <p className="text-sm text-gray-500">아직 생성된 모임이 없어요. 새로 만들어 보세요!</p>
          )}
        </div>
      </div>
    </>
  );
}
