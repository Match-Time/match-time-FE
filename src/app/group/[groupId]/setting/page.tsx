'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import TopBar from '@/app/components/common/topBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/app/components/common/dialog';
import Button from '@/app/components/common/button/Button';
import { ParticipantSheet } from '@/app/components/common/ParticipantSheet'; // Import ParticipantSheet

import SettingMenuItem from '@/app/components/common/SettingMenuItem';


export default function GroupSettingPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('걸스나잇 해요'); // Placeholder
  const [isParticipantSheetOpen, setIsParticipantSheetOpen] = useState(false); // State for Participant Sheet

  const handleSaveGroupName = () => {
    console.log('Saving new group name:', newGroupName, 'for group', groupId);
    // API call to save name would go here
    setIsNameDialogOpen(false);
  };

  const handleLeaveGroup = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('정말로 모임을 나가시겠습니까?')) {
      console.log('Leaving group', groupId);
      // API call to leave group would go here
      router.push('/group'); // Navigate back to group list
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="모임 설정" />

      <main className="flex-1 overflow-y-auto p-4">
        {/* Group Info Section */}
        <section className="mb-8">
          <h2 className="text-sm text-gray-500 px-2 mb-2">그룹 정보</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
             <SettingMenuItem 
                icon={<Pencil size={24} className="text-yellow-main" />}
                title="그룹 이름 수정"
                onClick={() => setIsNameDialogOpen(true)}
             />
             <hr className="ml-16 border-t border-gray-100"/>
             <SettingMenuItem 
                icon={<Image src="/images/icon_group_yellow.png" alt="" width={24} height={24} />}
                title="참여자 보기"
                onClick={() => setIsParticipantSheetOpen(true)} // Open participant sheet
             />
          </div>
        </section>

        {/* My Settings Section */}
        <section className="mb-8">
            <h2 className="text-sm text-gray-500 px-2 mb-2">내 설정</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <SettingMenuItem 
                    icon={<Image src="/images/icon_month_yellow.png" alt="" width={24} height={24} />}
                    title="내 불가능 시간 수정"
                    subtitle="이 모임의 시간만 수정"
                    onClick={() => router.push(`/group/${groupId}/month?from=settings`)}
                />
            </div>
        </section>

        {/* Leave Group Button */}
        <div className="mt-12 text-center">
            <button 
                onClick={handleLeaveGroup}
                className="px-6 py-2 border border-red-400 text-red-400 rounded-full text-sm hover:bg-red-50 font-semibold transition-colors"
            >
                모임 나가기
            </button>
        </div>
      </main>

      {/* Edit Name Dialog */}
      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">그룹 이름 수정</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              id="name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-3 border border-yellow-main rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-main"
              placeholder="새 그룹 이름을 입력하세요"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-gray-700 border-gray-300">취소</Button>
            </DialogClose>
            <Button onClick={handleSaveGroupName}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Participant Sheet */}
      <ParticipantSheet open={isParticipantSheetOpen} onOpenChange={setIsParticipantSheetOpen} />
    </div>
  );
}