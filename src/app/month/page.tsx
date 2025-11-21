'use client';

import {useState} from 'react';
import {isSameDay} from 'date-fns';
import Image from 'next/image';
import {Pencil, Check, ChevronRight} from 'lucide-react';
import ScheduleCalendar from '@/app/components/calendar/ScheduleCalendar';

export default function MyMonthPage() {
  const [month, setMonth] = useState(new Date()); // Default to current month
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([
    new Date('2025-11-10'),
    new Date('2025-11-11'),
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const handleDayClick = (day: Date) => {
    if (!isEditing) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) {
      return;
    }
    const isSelected = unavailableDays.some((d) => isSameDay(d, day));
    if (isSelected) {
      setUnavailableDays(unavailableDays.filter((d) => !isSameDay(d, day)));
    } else {
      setUnavailableDays([...unavailableDays, day]);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // "수정 완료" logic
      console.log("Saving user's default unavailable days:");
      const sortedDates = [...unavailableDays].sort(
        (a, b) => a.getTime() - b.getTime()
      );
      console.log(sortedDates.map((d) => d.toLocaleDateString()));
      // This is where you would POST to the backend.
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Custom Header */}
      <header className="px-4 h-14 py-4 bg-white flex items-center">
        <h1 className="text-3xl font-bold">내 고정 일정표</h1>
      </header>

      {/* Header 바로 아래 버튼 */}
      <div className="flex justify-end px-4 mt-3">
        <button
          onClick={handleEditToggle}
          className={`flex items-center px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            isEditing
              ? 'bg-green-light text-green-main'
              : 'bg-yellow-main text-white'
          }`}
        >
          {isEditing ? (
            <Check size={16} className="mr-1" />
          ) : (
            <Pencil size={16} className="mr-2" />
          )}
          {isEditing ? '일정 수정 완료' : '일정 수정하기'}
          {!isEditing && <ChevronRight size={16} className="ml-2" />}
        </button>
      </div>

      <main className="flex-1 flex flex-col">
        <ScheduleCalendar
          month={month}
          onMonthChange={setMonth}
          selectedDays={unavailableDays}
          onDayClick={handleDayClick}
          isEditing={isEditing}
        />

        <div className="flex-grow flex flex-col items-start justify-center pl-4">
          <div className="flex items-center text-sm mb-2">
            <span className="w-4 h-4 rounded-full bg-yellow-main mr-2"></span>
            <span className="text-gray-dark">불가능한 날짜</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-4 h-4 rounded-full border-2 border-yellow-main mr-2"></span>
            <span className="text-gray-dark">오늘 날짜</span>
          </div>
        </div>

        {/* Conditional Bottom Banner */}
        {isEditing && (
          <div className="mt-4 p-3 bg-yellow-main text-center text-sm text-black rounded-lg">
            <p>불가능한 날짜를 선택해 주세요! 연속 날짜도 가능해요.</p>
          </div>
        )}
      </main>

      {/* Bottom button is removed */}
    </div>
  );
}
