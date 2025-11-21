"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar from "@/app/components/common/topBar";
import Button from "@/app/components/common/button/Button";
import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Tag from '@/app/components/common/Tag';
import { ShareSheet } from '@/app/components/common/ShareSheet';
import { Room, RecommendedDate, confirmRoom, fetchRoom, fetchRoomUsers, getRecommendedDates, joinByInvite } from "@/lib/api";
import { loadStoredUser } from "@/lib/auth";

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const groupId = Number(params.groupId);
  const inviteCode = searchParams.get('inviteCode');

  if (Number.isNaN(groupId)) {
    return <div className="p-4">잘못된 모임 정보입니다.</div>;
  }

  const [room, setRoom] = useState<Room | null>(null);
  const [recommendedDates, setRecommendedDates] = useState<RecommendedDate[]>([]);
  const [participants, setParticipants] = useState<{ id: number; nickname: string; email: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState<string | null>(null);

  const user = useMemo(() => loadStoredUser(), []);

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

    const loadData = async () => {
      try {
        const [roomData, recommended, users] = await Promise.all([
          fetchRoom(groupId),
          getRecommendedDates(groupId),
          fetchRoomUsers(groupId),
        ]);

        setRoom(roomData);
        setConfirmedDate(roomData.confirmedDate ?? null);
        setRecommendedDates(recommended);
        setParticipants(users);

        if (recommended.length > 0) {
          setSelectedDate(recommended[0].date);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '모임 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      loadData();
    }
  }, [groupId, router, user]);

  // Auto-join via inviteCode if present
  useEffect(() => {
    if (!inviteCode || !user || Number.isNaN(groupId)) return;

    const join = async () => {
      setIsJoining(true);
      try {
        await joinByInvite(user.id, inviteCode);
        const refreshed = await fetchRoomUsers(groupId);
        setParticipants(refreshed);
      } catch (err) {
        setError(err instanceof Error ? err.message : '초대 코드로 참여에 실패했어요.');
      } finally {
        setIsJoining(false);
      }
    };

    join();
  }, [groupId, inviteCode, user]);

  const handleConfirmDate = async () => {
    if (!room || !selectedDate) return;

    setIsSubmitting(true);
    setError('');

    try {
      if (room.type === 'ONCE') {
        await confirmRoom(room.id, { type: 'ONCE', date: selectedDate });
        setConfirmedDate(selectedDate);
        setRoom({ ...room, confirmedDate: selectedDate });
        alert('모임 날짜를 확정했어요!');
      } else {
        // 정기 모임이면 설정 페이지로 안내
        router.push(`/group/${groupId}/setting`);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '확정에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSettingClick = () => {
    router.push(`/group/${groupId}/setting`);
  };

  const handleShareClick = () => {
    setIsShareSheetOpen(true);
  };

  const dayOfWeek = useMemo(
    () => ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    []
  );

  const renderBody = () => {
    if (isLoading) return <p className="text-gray-500">불러오는 중...</p>;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;
    if (!room) return <p className="text-gray-500">모임 정보를 찾을 수 없어요.</p>;

    return (
      <>
        {/* Group Info Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">{room.name}</h1>
            <p className="text-sm text-gray-medium">{participants.length}명 모였어요</p>
            {inviteCode && isJoining && <p className="text-xs text-yellow-main">초대 코드로 참여 중...</p>}
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleSettingClick} className="w-10 h-10 bg-yellow-light rounded-full flex items-center justify-center">
              <Image src="/images/ic_setting.png" alt="설정" width={24} height={24} />
            </button>
            <button onClick={handleShareClick} className="w-10 h-10 bg-yellow-light rounded-full flex items-center justify-center">
              <Image src="/images/ic_link.png" alt="공유" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Recommended Dates Section */}
        <div>
          <h2 className="text-lg font-bold">추천 날짜 목록</h2>
          <p className="text-sm text-gray-medium mb-4">날짜를 선택하면 모임 날짜로 확정할 수 있어요</p>
          
          <div className="space-y-3">
            {recommendedDates.map((item) => {
              const dateObj = new Date(item.date);
              const isConfirmed = confirmedDate === item.date;
              return (
              <label key={item.date} htmlFor={item.date} className={`flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedDate === item.date ? 'border-yellow-main bg-yellow-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={item.date}
                      name="recommendedDate"
                      value={item.date}
                      checked={selectedDate === item.date}
                      onChange={() => setSelectedDate(item.date)}
                      className="hidden"
                    />
                    <div>
                      <p className="font-bold text-lg">{item.date}</p>
                      <p className="text-sm text-gray-medium">{dayOfWeek[dateObj.getDay()]}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Tag text={`${item.availableCount}명 가능 날짜`} />
                    <div className={`w-6 h-6 rounded-full ml-4 flex items-center justify-center border-2 transition-colors ${selectedDate === item.date ? 'bg-yellow-main border-yellow-main' : 'border-gray-400'}`}>
                      {selectedDate === item.date && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                  </div>
                </div>
                {isConfirmed && (
                  <div className="text-sm text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-md p-2">
                    해당 날짜가 모임 확정 날짜로 설정되었어요!
                  </div>
                )}
              </label>
            )})}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="모임 세부 정보" />
      
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {renderBody()}
      </main>
      
      {/* Footer Button */}
      <footer className="p-4 bg-white border-t">
        <Button
          onClick={handleConfirmDate}
          disabled={!selectedDate || isSubmitting || !room}
          className={`w-full py-3 text-lg font-bold rounded-lg transition-colors ${
            selectedDate && !isSubmitting
            ? 'bg-yellow-main text-black' 
            : 'bg-gray-200 text-gray-400'
          }`}
        >
          {isSubmitting ? '확정 중...' : '이 날짜로 확정하기'}
        </Button>
      </footer>

      {/* Share Sheet Component */}
      <ShareSheet open={isShareSheetOpen} onOpenChange={setIsShareSheetOpen} groupId={String(groupId)} inviteCode={room?.inviteCode} />
    </div>
  );
}
