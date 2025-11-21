'use client';

import {useEffect, useState} from 'react';
import {isSameDay} from 'date-fns';
import {Pencil, Check} from 'lucide-react';
import ScheduleCalendar from '@/app/components/calendar/ScheduleCalendar';
import {
  fetchUserMonthlyUnavailable,
  saveUserMonthlyUnavailable,
} from '@/lib/api';
import {getUser} from '@/lib/userStorage';
import {useRouter} from 'next/navigation';

const toLocalISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromISO = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export default function MyMonthPage() {
  const [month, setMonth] = useState(new Date());
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const dates = await fetchUserMonthlyUnavailable(stored.id);
        setUnavailableDays(
          dates.map((d) => fromISO(d)),
        );
        setError(null);
      } catch (err: any) {
        setError(err.message || '불가능 날짜를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleDayClick = (day: Date) => {
    if (!isEditing) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return;

    const isSelected = unavailableDays.some((d) => isSameDay(d, day));
    if (isSelected) {
      setUnavailableDays(unavailableDays.filter((d) => !isSameDay(d, day)));
    } else {
      setUnavailableDays([...unavailableDays, day]);
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }

    setSaving(true);
    try {
      const sortedDates = [...unavailableDays]
        .sort((a, b) => a.getTime() - b.getTime())
        .map((d) => toLocalISO(d));

      await saveUserMonthlyUnavailable(stored.id, sortedDates);
      setError(null);
      setIsEditing(false);
      router.refresh(); // 새로고침하여 최신 상태 반영
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
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
          disabled={saving || loading}
        >
          {isEditing ? (
            <Check size={16} className="mr-1" />
          ) : (
            <Pencil size={16} className="mr-1" />
          )}
          {isEditing ? (saving ? '저장 중...' : '고정표 수정 완료') : '고정표 수정하기'}
        </button>
      </header>

      <main className="flex-1 flex flex-col p-4 space-y-4">
        {error && <p className="text-sm text-red-main mb-3">{error}</p>}
        {loading ? (
          <p className="text-gray-medium">불가능 날짜를 불러오는 중...</p>
        ) : (
          <ScheduleCalendar
            month={month}
            onMonthChange={setMonth}
            selectedDays={unavailableDays}
            onDayClick={handleDayClick}
            isEditing={isEditing}
          />
        )}

        {isEditing && (
          <div className="p-3 bg-yellow-main text-center text-sm text-black rounded-lg shadow-sm">
            <p>불가능한 날짜를 선택해 주세요! 연속 날짜도 가능해요.</p>
          </div>
        )}

        <div className="flex items-center gap-8 text-sm text-gray-dark pl-2">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full border-2 border-[#3b7cff] mr-3"></span>
            <span>불가능한 날짜</span>
          </div>
        </div>
      </main>
    </div>
  );
}
