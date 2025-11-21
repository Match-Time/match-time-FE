'use client';

import { useEffect, useMemo, useState } from "react";
import { isSameDay } from "date-fns";
import TopBar from "@/app/components/common/topBar";
import ScheduleCalendar from "@/app/components/calendar/ScheduleCalendar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchRoomMonthlyUnavailable, saveRoomMonthlyUnavailable } from "@/lib/api";
import { formatDateToISO, parseISODate } from "@/lib/utils";
import { loadStoredUser } from "@/lib/auth";

export default function MonthPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const groupId = params?.groupId as string;
  const fromSettings = searchParams.get('from') === 'settings';

  const [month, setMonth] = useState(new Date()); 
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const user = useMemo(() => loadStoredUser(), []);

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

    const load = async () => {
      try {
        const dates = await fetchRoomMonthlyUnavailable(user.id, Number(groupId));
        setUnavailableDays(dates.map((d) => parseISODate(d)));
      } catch (err) {
        setError(err instanceof Error ? err.message : '불가능 날짜를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router, user, groupId]);

  const handleDayClick = (day: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    if (day < today) {
        return;
    }

    const isSelected = unavailableDays.some(d => isSameDay(d, day));
    if (isSelected) {
      setUnavailableDays(unavailableDays.filter(d => !isSameDay(d, day)));
    } else {
      setUnavailableDays([...unavailableDays, day]);
    }
  };
  
  const handleNextClick = async () => {
    if (!user) {
      router.replace('/');
      return;
    }

    try {
      await saveRoomMonthlyUnavailable(
        user.id,
        Number(groupId),
        unavailableDays.map((d) => formatDateToISO(d))
      );
      router.push(`/group/${groupId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했어요.');
    }
  };

  if (!groupId) {
    return <div>Loading or Invalid Group ID...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="불가능 날짜 선택" />
      
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="mb-4 px-4">
          <p className="text-lg font-bold text-gray-dark mb-1">내 고정 시간표에서</p>
          <p className="text-lg font-bold text-gray-dark mb-2">
            불가능한 날짜를 <span className="text-yellow-main">수정</span>해 보세요.
          </p>
          <p className="text-sm text-gray-medium">
            현재 수정하는 사항은 이 모임에만 적용돼요.
          </p>
        </div>

        {isLoading && <p className="text-gray-500">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <ScheduleCalendar
          month={month}
          onMonthChange={setMonth}
          selectedDays={unavailableDays}
          unavailableDays={unavailableDays}
          onDayClick={handleDayClick}
        />
        
        <div className="flex flex-col items-start pt-4 text-sm mt-4 pl-4">
          <div className="flex items-center mb-2">
            <span className="w-4 h-4 rounded-full bg-yellow-main mr-2"></span>
            <span className="text-gray-dark">불가능한 날짜</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full border-2 border-yellow-main mr-2"></span>
            <span className="text-gray-dark">오늘 날짜</span>
          </div>
        </div>
      </main>
      
      {/* Conditionally render the footer with the button */}
      {!fromSettings && (
        <div className="p-4 bg-white border-t">
            <button 
              onClick={handleNextClick}
              className="w-full py-4 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-yellow-main to-yellow-light"
            >
              다음
            </button>
        </div>
      )}
    </div>
  );
}
