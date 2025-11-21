'use client';

import Image from 'next/image';
import {useRouter, useParams} from 'next/navigation';
import {useState, useEffect} from 'react';
import Tag from '@/app/components/common/Tag';
import {ShareSheet} from '@/app/components/common/ShareSheet';
import Link from 'next/link';
import Button from '@/app/components/common/button/Button';
import {motion, AnimatePresence} from 'framer-motion';

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmedDate, setConfirmedDate] = useState<string | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  // Mock data as per request
  const groupInfo = {
    name: '걸스나잇 해요',
    memberCount: 4,
  };

  const recommendedDates = [
    {id: '1', date: '2025.11.30', dayOfWeek: '일요일', availableCount: 4},
    {id: '2', date: '2025.12.04', dayOfWeek: '목요일', availableCount: 4},
    {id: '3', date: '2025.12.05', dayOfWeek: '금요일', availableCount: 3},
  ];

  const [displayedDates, setDisplayedDates] = useState(recommendedDates);

  const maxAvailableCount = Math.max(
    ...recommendedDates.map((item) => item.availableCount)
  );

  const handleConfirmDate = () => {
    if (selectedDate) {
      setConfirmedDate(selectedDate);
      console.log(`Confirming date ${selectedDate} for group ${groupId}`);

      if (displayedDates[0]?.date === selectedDate) {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 400);
      } else {
        // API call would go here
        setDisplayedDates((prevDates) => {
          const confirmedItem = prevDates.find(
            (item) => item.date === selectedDate
          );
          if (!confirmedItem) return prevDates;

          const otherItems = prevDates.filter(
            (item) => item.date !== selectedDate
          );
          return [confirmedItem, ...otherItems];
        });
      }
    }
  };

  const handleSettingClick = () => {
    router.push(`/group/${groupId}/setting`);
  };

  const handleShareClick = () => {
    setIsShareSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Bar */}
      <header className="relative flex items-center justify-center mb-4 px-4 h-14">
        <Link href="/group" className="absolute left-4">
          <Image
            src="/images/ic_back.png"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </Link>
        <h1 className="text-lg font-semibold">{groupInfo.name}</h1>
      </header>

      <main className="flex-1 overflow-y-auto pt-4">
        {/* Group Info Header */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-semibold mb-1 text-black">
              {groupInfo.name}
            </h1>
            <p className="text-sm text-gray-medium">
              <span className="text-red-main">{groupInfo.memberCount}</span>명
              모였어요
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

        {/* Recommended Dates Section */}
        <div>
          <h2 className="text-lg font-semibold mb-1 text-black">
            추천 날짜 목록
          </h2>
          <p className="text-sm text-gray-medium mb-8">
            날짜를 선택하면 모임 날짜로 확정할 수 있어요
          </p>

          <div className="space-y-8">
            <AnimatePresence>
              {displayedDates.map((item, index) => {
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
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-8 left-0 right-0">
        <footer className="w-full max-w-sm mx-auto bg-white px-4 pb-4">
          <Button
            onClick={handleConfirmDate}
            disabled={!selectedDate}
            className={`w-full py-4 text-base font-semibold text-white rounded-xl transition-colors ${
              selectedDate
                ? 'bg-gradient-to-r from-yellow-main to-yellow-light'
                : 'bg-gray-light'
            }`}
          >
            이 날짜로 확정하기
          </Button>
        </footer>
      </div>

      {/* Share Sheet Component */}
      <ShareSheet
        open={isShareSheetOpen}
        onOpenChange={setIsShareSheetOpen}
        groupId={groupId}
      />
    </div>
  );
}
