'use client';

import { useState } from "react";
import { isSameDay } from "date-fns";
import TopBar from "@/app/components/common/topBar";
import ScheduleCalendar from "@/app/components/calendar/ScheduleCalendar";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function MonthPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const groupId = params?.groupId as string;
  const fromSettings = searchParams.get('from') === 'settings';

  if (!groupId) {
    return <div>Loading or Invalid Group ID...</div>;
  }

  // State for the calendar
  const [month, setMonth] = useState(new Date()); 
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([
      new Date("2025-11-10"),
      new Date("2025-11-11"),
  ]); 

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
  
  const handleNextClick = () => {
    console.log("Selected unavailable days for group", groupId);
    console.log(unavailableDays.map(d => d.toLocaleDateString()));
    router.push(`/group/${groupId}`);
  };

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

        <ScheduleCalendar
          month={month}
          onMonthChange={setMonth}
          selectedDays={unavailableDays}
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