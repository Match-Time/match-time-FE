'use client';

import Image from 'next/image';
import {useRouter, useParams} from 'next/navigation';
import {useState, useEffect, useMemo} from 'react';
import Tag from '@/app/components/common/Tag';
import {ShareSheet} from '@/app/components/common/ShareSheet';
import Link from 'next/link';
import Button from '@/app/components/common/button/Button';
import {motion, AnimatePresence} from 'framer-motion';
import {
  confirmRoomDate,
  fetchRoom,
  fetchRoomUsers,
  recommendDates,
  Room,
  RoomType,
} from '@/lib/api';
import {getUser} from '@/lib/userStorage';
import {ParticipantSheet} from '@/app/components/common/ParticipantSheet';
import {getErrorMessage} from '@/lib/utils';

interface DisplayDate {
  id: string;
  date: string;
  dayOfWeek: string;
  availableCount: number;
}

const dayNames: Record<number, string> = {
  0: '일요일',
  1: '월요일',
  2: '화요일',
  3: '수요일',
  4: '목요일',
  5: '금요일',
  6: '토요일',
};

const dayEnums: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const groupIdNum = Number(groupId);

  const [roomInfo, setRoomInfo] = useState<Room | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<string | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isParticipantSheetOpen, setIsParticipantSheetOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [displayedDates, setDisplayedDates] = useState<DisplayDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }
    if (!groupIdNum) return;

    const load = async () => {
      setLoading(true);
      try {
        const [room, users, rec] = await Promise.all([
          fetchRoom(groupIdNum),
          fetchRoomUsers(groupIdNum),
          recommendDates(groupIdNum),
        ]);
        setRoomInfo(room);
        setMemberCount(users.length);
        const normalized = rec.map((item, idx) => {
          const dt = new Date(item.date);
          const dayIdx = dt.getDay();
          return {
            id: idx.toString(),
            date: item.date,
            dayOfWeek: dayNames[dayIdx],
            availableCount: item.availableCount,
          };
        });
        setDisplayedDates(normalized);
        setSelectedDate(normalized[0]?.date ?? null);
        setConfirmedDate(room.confirmedDate || null);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, '방 정보를 불러오지 못했습니다.'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [groupIdNum, router]);

  const maxAvailableCount = useMemo(
    () => Math.max(0, ...displayedDates.map((item) => item.availableCount)),
    [displayedDates]
  );

  const sortedDates = useMemo(() => {
    if (!confirmedDate) {
      return displayedDates;
    }
    const confirmedItem = displayedDates.find(d => d.date === confirmedDate);
    if (!confirmedItem) {
      return displayedDates;
    }
    const otherItems = displayedDates.filter(d => d.date !== confirmedDate);
    return [confirmedItem, ...otherItems];
  }, [displayedDates, confirmedDate]);

  const handleConfirmDate = async () => {
    if (!selectedDate || !roomInfo) return;
    setSaving(true);
    try {
      const payload: {
        type: RoomType;
        date?: string;
        day?: string;
        start?: string;
        end?: string;
      } = {type: roomInfo.type as RoomType};
      if (roomInfo.type === 'ONCE') {
        payload.date = selectedDate;
      } else {
        const dt = new Date(selectedDate);
        payload.day = dayEnums[dt.getDay()];
        payload.start = '18:00';
        payload.end = '20:00';
      }

      await confirmRoomDate(groupIdNum, payload);
      setConfirmedDate(selectedDate);
      setError(null);

      setIsBouncing(false);
    } catch (err) {
      setError(getErrorMessage(err, '확정에 실패했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSettingClick = () => {
    router.push(`/group/${groupId}/setting`);
  };

  const handleShareClick = () => {
    setIsShareSheetOpen(true);
  };

  if (!groupIdNum) {
    return <div>잘못된 그룹 ID 입니다.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="relative flex items-center justify-center mb-8">
        <Link href="/group" className="absolute left-0">
          <Image
            src="/images/ic_back.png"
            alt="뒤로가기"
            width={18}
            height={30}
          />
        </Link>
        <h1 className="text-lg font-semibold">모임 상세 정보</h1>
      </header>

      <main className="flex-1 overflow-y-auto pt-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-semibold mb-1 text-black">
              {roomInfo?.name ?? '모임 이름'}
            </h1>
            <p className="text-sm text-gray-medium">
              <span className="text-red-main">{memberCount}</span>명 모였어요
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSettingClick}
              className="w-10 h-10 bg-yellow-light rounded-full flex items-center justify-center"
            >
              <Image
                src="/images/ic_setting.png"
                alt="설정"
                width={20}
                height={20}
              />
            </button>
            <button
              onClick={handleShareClick}
              className="w-10 h-10 bg-yellow-light rounded-full flex items-center justify-center"
            >
              <Image
                src="/images/ic_link.png"
                alt="공유"
                width={17}
                height={17}
              />
            </button>
          </div>
        </div>
        <div className="h-[6px] bg-gray-background mt-1 mb-6 relative left-1/2 -translate-x-1/2" />

        <div>
          <h2 className="text-lg font-semibold mb-1 text-black">
            추천 날짜 목록
          </h2>
          <p className="text-sm text-gray-medium mb-8">
            날짜를 선택하면 모임 날짜로 확정할 수 있어요
          </p>
          {error && <p className="text-sm text-red-main mb-3">{error}</p>}
          {loading ? (
            <p className="text-gray-medium">추천 날짜를 불러오는 중...</p>
          ) : displayedDates.length === 0 ? (
            <p className="text-gray-medium">추천할 날짜가 아직 없어요.</p>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {sortedDates.map((item, index) => {
                  const isMax = item.availableCount === maxAvailableCount;
                  const bgColorClass = isMax
                    ? 'bg-yellow-light'
                    : 'bg-green-light';
                  const textColorClass = isMax
                    ? 'text-yellow-dark-text'
                    : 'text-green-main';

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{opacity: 0}}
                      animate={
                        index === 0 && isBouncing
                          ? {opacity: 1, rotate: [0, -1.5, 1.5, -1.5, 1.5, 0]}
                          : {opacity: 1, rotate: 0}
                      }
                      transition={
                        index === 0 && isBouncing
                          ? {duration: 0.5, ease: 'easeInOut'}
                          : undefined
                      }
                      exit={{opacity: 0}}
                    >
                      <label
                        htmlFor={item.id}
                        className="block rounded-xl p-[2px] w-full h-[107px]
  bg-gradient-to-r from-yellow-300 to-yellow-500 cursor-pointer"
                      >
                        <div
                          className={`flex items-center justify-between p-4 rounded-xl transition-colors w-full h-full ${
                            selectedDate === item.date
                              ? 'bg-yellow-50 shadow-lg'
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={item.id}
                              name="recommendedDate"
                              value={item.date}
                              checked={selectedDate === item.date}
                              onChange={() => setSelectedDate(item.date)}
                              className="hidden"
                            />
                            <div>
                              <p className="font-bold text-2xl">{item.date}</p>
                              <p className="text-sm text-gray-dark font-semibold">
                                {item.dayOfWeek}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Tag
                              text={`${item.availableCount}명 가능 날짜`}
                              bgColorClass={bgColorClass}
                              textColorClass={textColorClass}
                            />

                            {selectedDate === item.date ? (
                              <Image
                                src="/images/ic_check_selected.png"
                                alt="선택됨"
                                width={25}
                                height={25}
                                className="ml-4"
                              />
                            ) : (
                              <div className="w-6 h-6 ml-4 border-2 border-gray-light rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </label>
                      {confirmedDate === item.date && (
                        <div className="bg-gradient-to-l from-yellow-main to-yellow-light text-white text-center text-sm py-2 rounded-lg mt-2">
                          해당 날짜가 모임 확정 날짜로 선정되었어요!
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-8 left-0 right-0">
        <footer className="w-full max-w-sm mx-auto bg-white px-4 pb-4">
          <Button
            onClick={handleConfirmDate}
            disabled={!selectedDate || saving}
            className={`w-full py-4 text-base font-semibold text-white rounded-xl transition-colors ${
              selectedDate
                ? 'bg-gradient-to-r from-yellow-main to-yellow-light'
                : 'bg-gray-light'
            }`}
          >
            {saving ? '확정 중...' : '이 날짜로 확정하기'}
          </Button>
        </footer>
      </div>

      <ShareSheet
        open={isShareSheetOpen}
        onOpenChange={setIsShareSheetOpen}
        groupId={groupId}
        inviteCode={roomInfo?.inviteCode}
      />

      <ParticipantSheet
        open={isParticipantSheetOpen}
        onOpenChange={setIsParticipantSheetOpen}
        roomId={groupIdNum}
      />
    </div>
  );
}
