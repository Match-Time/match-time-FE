'use client';

import {useEffect, useState} from 'react';
import {useRouter, useParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import {Pencil} from 'lucide-react';
// Removed TopBar import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/app/components/common/dialog';
import Button from '@/app/components/common/button/Button';
import {ParticipantSheet} from '@/app/components/common/ParticipantSheet';
import SettingMenuItem from '@/app/components/common/SettingMenuItem';
import {getUser} from '@/lib/userStorage';
import {fetchRoom, leaveRoom, updateRoomName} from '@/lib/api';
import {getErrorMessage} from '@/lib/utils';

export default function GroupSettingPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const groupIdNum = Number(groupId);

  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isParticipantSheetOpen, setIsParticipantSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        const room = await fetchRoom(groupIdNum);
        setNewGroupName(room.name);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, '모임 정보를 불러오지 못했습니다.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [groupIdNum, router]);

  const handleSaveGroupName = async () => {
    if (!groupIdNum || !newGroupName.trim()) return;
    setSaving(true);
    try {
      await updateRoomName(groupIdNum, newGroupName.trim());
      setError(null);
      setIsNameDialogOpen(false);
    } catch (err) {
      setError(getErrorMessage(err, '이름을 변경하지 못했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveGroup = async () => {
    const stored = getUser();
    if (!stored || !groupIdNum) {
      router.push('/group');
      return;
    }
    if (window.confirm('정말로 모임을 나가시겠습니까?')) {
      try {
        await leaveRoom(stored.id, groupIdNum);
        router.push('/group'); // 목록으로 이동
      } catch (err) {
        setError(getErrorMessage(err, '모임 나가기에 실패했습니다.'));
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="relative flex items-center justify-center mb-8">
        <Link href={`/group/${groupId}`} className="absolute left-0">
          <Image
            src="/images/ic_back.png"
            alt="뒤로가기"
            width={18}
            height={30}
          />
        </Link>
        <h1 className="text-lg font-semibold">모임 설정</h1>
      </header>

      <main className="flex-1 overflow-y-auto ">
        <section className="mb-8">
          <h2 className="text-gray-dark font-semibold px-2 mb-2">그룹 정보</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <SettingMenuItem
              icon={<Pencil size={24} className="text-yellow-main" />}
              title={loading ? '불러오는 중...' : '그룹 이름 수정'}
              onClick={() => !loading && setIsNameDialogOpen(true)}
            />
            <hr className="ml-16 border-t border-gray-100" />
            <SettingMenuItem
              icon={
                <Image
                  src="/images/icon_group_yellow.png"
                  alt=""
                  width={24}
                  height={24}
                />
              }
              title="참여자 보기"
              onClick={() => setIsParticipantSheetOpen(true)}
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className=" text-gray-dark font-semibold px-2 mb-2">내 설정</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <SettingMenuItem
              icon={
                <Image
                  src="/images/icon_month_yellow.png"
                  alt=""
                  width={24}
                  height={24}
                />
              }
              title="내 불가능 날짜 수정"
              subtitle="이 모임에만 적용"
              onClick={() =>
                router.push(`/group/${groupId}/month?from=settings`)
              }
            />
          </div>
        </section>

        {error && <p className="text-sm text-red-main">{error}</p>}

        <div className="mt-12 text-center">
          <button
            onClick={handleLeaveGroup}
            className="px-6 py-1 border border-red-400 text-red-400 rounded-full text-sm hover:bg-red-50 font-semibold transition-colors"
          >
            모임 나가기
          </button>
        </div>
      </main>

      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center mt-1">
              그룹 이름 수정
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <input
              id="name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-2 border border-yellow-main rounded-xl focus:outline-none focus:ring-1 focus:ring-yellow-light bg-yellow-background"
              placeholder="새 그룹 이름을 입력하세요"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-gray-light text-gray-700 hover:bg-gray-light">
                취소
              </Button>
            </DialogClose>
            <Button
              onClick={handleSaveGroupName}
              disabled={saving}
              className="bg-yellow-light"
            >
              {saving ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ParticipantSheet
        open={isParticipantSheetOpen}
        onOpenChange={setIsParticipantSheetOpen}
        roomId={groupIdNum}
      />
    </div>
  );
}
