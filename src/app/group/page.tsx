'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Tag from '@/app/components/common/Tag';
import {fetchRoomUsers, fetchUserRooms, Room} from '@/lib/api';
import {getUser} from '@/lib/userStorage';
import {useRouter} from 'next/navigation';
import {getErrorMessage} from '@/lib/utils';

interface RoomListItem {
  room: Room;
  participantCount: number;
}

const typeLabel: Record<Room['type'], string> = {
  WEEKLY: '정기 모임',
  ONCE: '단발 모임',
};

export default function GroupPage() {
  const router = useRouter();
  const [items, setItems] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getUser();
    if (!stored) {
      router.push('/');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const rooms = await fetchUserRooms(stored.id);
        const withCounts = await Promise.all(
          rooms.map(async (room) => {
            const users = await fetchRoomUsers(room.id);
            return {room, participantCount: users.length};
          })
        );
        setItems(withCounts);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, '방 목록을 불러오지 못했습니다.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  return (
    <>
      <header className="px-3 flex justify-between items-center my-12">
        <div>
          <Image
            src="/images/모여요.png"
            alt="모여요 로고"
            width={82}
            height={22}
            priority
          />
          <p className="text-gray-dark mt-2">모임이 더 쉬워지는 순간</p>
        </div>
      </header>

      <div className="flex justify-end">
        <Image
          src="/images/img_animal.png"
          alt="동물 캐릭터"
          width={216}
          height={106}
          className="-mb-5 z-10 relative"
        />
      </div>

      <div className="relative bg-gradient-to-r from-yellow-gradient to-white rounded-2xl pl-6 py-8 mb-9 overflow-hidden">
        <div className="relative z-10">
          <p className="font-bold text-242424 text-base mb-2">
            친구들을 초대해 볼까요?
          </p>
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
            <span className="text-yellow-dark">모임 만들러 가기</span>
          </Link>
        </div>

        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-0">
          <Image
            src="/images/img_alarm.png"
            alt="알람"
            width={145}
            height={100}
          />
        </div>
      </div>

      <div>
        <h2 className="font-bold text-xl text-black mb-4">방 목록</h2>
        {error && <p className="text-sm text-red-main mb-3">{error}</p>}
        {loading ? (
          <p className="text-gray-medium">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-medium">아직 만든 모임이 없어요.</p>
        ) : (
          <div className="space-y-4">
            {items.map(({room, participantCount}) => {
              const confirmed = room.confirmedDate;
              const dateParts = confirmed
                ? room.confirmedDate?.split('-')
                : null;
              return (
                <Link
                  href={`/group/${room.id}`}
                  key={room.id}
                  className="block"
                >
                  <div className="flex items-center justify-between py-3 px-4 border-2 border-yellow-main rounded-2xl">
                    <div>
                      <h3 className="font-bold text-yellow-main">
                        {room.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                        <Tag
                          text={typeLabel[room.type]}
                          textColorClass="text-white"
                        />
                        <span className="text-gray-dark">
                          {participantCount}명 참여 중
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {confirmed && dateParts && dateParts.length === 3 ? (
                        <div className="text-right mr-2">
                          <span className="text-sm text-gray-dark">
                            모임 확정 날짜
                          </span>
                          <div className="flex items-center justify-end w-full text-lg font-bold">
                            <span className="text-red-main">
                              {Number(dateParts[1])}
                            </span>
                            <span className="text-black">월</span>
                            <span className="text-red-main ml-1">
                              {Number(dateParts[2])}
                            </span>
                            <span className="text-black">일</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 mr-2">미정</span>
                      )}

                      <Image
                        className="ml-3"
                        src="/images/ic_next.png"
                        alt="다음"
                        width={12}
                        height={12}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
