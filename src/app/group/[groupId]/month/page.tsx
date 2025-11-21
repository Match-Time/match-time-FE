'use client';

import {useEffect, useState} from 'react';
import {isSameDay} from 'date-fns';
import TopBar from '@/app/components/common/topBar';
import ScheduleCalendar from '@/app/components/calendar/ScheduleCalendar';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {
  fetchRoomMonthlyUnavailable,
  fetchUserMonthlyUnavailable,
  saveRoomMonthlyUnavailable,
} from '@/lib/api';
import {getUser} from '@/lib/userStorage';

export default function MonthPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const groupId = params?.groupId as string;
  const groupIdNum = Number(groupId);
  const fromSettings = searchParams.get('from') === 'settings';

  const [month, setMonth] = useState(new Date());
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupIdNum) return;
    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const roomDates = await fetchRoomMonthlyUnavailable(stored.id, groupIdNum);
        const baseDates =
          roomDates.length > 0
            ? roomDates
            : await fetchUserMonthlyUnavailable(stored.id);

        setUnavailableDays(
          baseDates.map((d) => {
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
  }, [groupIdNum, router]);

  const handleDayClick = (day: Date) => {
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

  const handleNextClick = async () => {
    const stored = getUser();
    if (!stored) {
      router.push('/');
      return;
    }
    setSaving(true);
    try {
      const payload = unavailableDays
        .map((d) => {
          const copy = new Date(d);
          copy.setHours(0, 0, 0, 0);
          return copy;
        })
        .sort((a, b) => a.getTime() - b.getTime())
        .map((d) => d.toISOString().split('T')[0]);
      await saveRoomMonthlyUnavailable(stored.id, groupIdNum, payload);
      setError(null);
      router.push(`/group/${groupId}`);
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!groupIdNum) {
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

        {error && <p className="text-sm text-red-main mb-3">{error}</p>}

        {loading ? (
          <p className="text-gray-medium">불가능 날짜를 불러오는 중...</p>
        ) : (
          <ScheduleCalendar
            month={month}
            onMonthChange={setMonth}
            selectedDays={unavailableDays}
            onDayClick={handleDayClick}
          />
        )}

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

      {!fromSettings && (
        <div className="p-4 bg-white border-t">
          <button
            onClick={handleNextClick}
            disabled={saving || loading}
            className="w-full py-4 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-yellow-main to-yellow-light disabled:bg-gray-medium"
          >
            {saving ? '저장 중...' : '다음'}
          </button>
        </div>
      )}
    </div>
  );
}
