'use client';

import { useEffect, useMemo, useState } from 'react';
import { isSameDay } from 'date-fns';
import { Pencil, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ScheduleCalendar from '@/app/components/calendar/ScheduleCalendar';
import { fetchMonthlyUnavailable, saveMonthlyUnavailable } from '@/lib/api';
import { formatDateToISO, parseISODate } from '@/lib/utils';
import { loadStoredUser } from '@/lib/auth';

export default function MyMonthPage() {
  const router = useRouter();
  const [month, setMonth] = useState(new Date());
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const user = useMemo(() => loadStoredUser(), []);

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

    const load = async () => {
      try {
        const dates = await fetchMonthlyUnavailable(user.id);
        setUnavailableDays(dates.map((d) => parseISODate(d)));
      } catch (err) {
        setError(err instanceof Error ? err.message : '불가능 날짜를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router, user]);

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

  const handleEditToggle = async () => {
    if (!user) {
      router.replace('/');
      return;
    }

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await saveMonthlyUnavailable(
        user.id,
        unavailableDays.map((d) => formatDateToISO(d))
      );
      // 저장 후 최신값 재조회로 서버와 동기화
      const dates = await fetchMonthlyUnavailable(user.id);
      setUnavailableDays(dates.map((d) => parseISODate(d)));
      alert('고정 불가능 날짜를 저장했어요.');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했어요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b">
        <h1 className="text-xl font-bold">내 일정표</h1>
        <button
          onClick={handleEditToggle}
          className={`flex items-center px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            isEditing
              ? 'bg-green-light text-green-main'
              : 'bg-yellow-main text-black'
          }`}
          disabled={isSaving}
        >
          {isEditing ? (
            <Check size={16} className="mr-1" />
          ) : (
            <Pencil size={16} className="mr-1" />
          )}
          {isEditing ? (isSaving ? '저장 중...' : '고정표 수정 완료') : '고정표 수정하기'}
        </button>
      </header>

      <main className="flex-1 flex flex-col p-4">
        {isLoading && <p className="text-gray-500">불러오는 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <ScheduleCalendar
          month={month}
          onMonthChange={setMonth}
          selectedDays={unavailableDays}
          unavailableDays={unavailableDays}
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

        {isEditing && (
          <div className="mt-4 p-3 bg-yellow-main text-center text-sm text-black rounded-lg">
            <p>불가능한 날짜를 선택해 주세요! 연속 날짜도 가능해요.</p>
          </div>
        )}
      </main>
    </div>
  );
}
