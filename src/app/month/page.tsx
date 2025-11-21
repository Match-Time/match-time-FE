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
          dates.map((d) => {
            const dt = new Date(d);
            dt.setHours(0, 0, 0, 0);
            return dt;
          }),
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
        .map((d) => {
          const copy = new Date(d);
          copy.setHours(0, 0, 0, 0);
          return copy;
        })
        .sort((a, b) => a.getTime() - b.getTime())
        .map((d) => d.toISOString().split('T')[0]);

      await saveUserMonthlyUnavailable(stored.id, sortedDates);
      setError(null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between px-4 h-16 bg-white">
        <h1 className="text-2xl font-bold">내 고정 일정표</h1>
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
          {isEditing ? (saving ? '저장 중...' : '일정 수정 완료') : '일정 수정하기'}
        </button>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-2 pb-6 space-y-4">
        <div className="text-sm text-gray-500 mb-2">불가능한 날짜를 선택해 주세요. 연속 날짜도 가능해요.</div>

        {error && <p className="text-sm text-red-main">{error}</p>}

        <div className="rounded-2xl bg-white">
          {loading ? (
            <p className="text-gray-medium px-2 py-6 text-center">
              불가능 날짜를 불러오는 중...
            </p>
          ) : (
            <ScheduleCalendar
              month={month}
              onMonthChange={setMonth}
              selectedDays={unavailableDays}
              onDayClick={handleDayClick}
              isEditing={isEditing}
            />
          )}
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-dark px-1">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-[#e5c242] mr-2" />
            <span>불가능한 날짜</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full border-2 border-[#e5c242] mr-2" />
            <span>오늘 날짜</span>
          </div>
        </div>

        {isEditing && (
          <div className="mt-auto p-3 bg-yellow-main text-center text-sm text-black rounded-lg shadow-sm">
            불가능한 날짜를 선택해 주세요! 연속 날짜도 가능해요.
          </div>
        )}
      </main>
    </div>
  );
}
