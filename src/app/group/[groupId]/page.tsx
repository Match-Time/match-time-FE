"use client";

import TopBar from "@/app/components/common/topBar";
import BottomNav from "@/app/components/common/bottomBar";
import Button from "@/app/components/common/button/Button";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { groupId } = params;

  // Mock data for now
  const groupName = "코딩 스터디"; // This would be fetched based on groupId
  const members = [
    { id: 1, name: "개미", avatar: "/images/img_animal.png" },
    { id: 2, name: "베짱이", avatar: "/images/img_animal.png" },
    { id: 3, name: "두루미", avatar: "/images/img_animal.png" },
    { id: 4, name: "호랑이", avatar: "/images/img_animal.png" },
  ];

  const handleSettingClick = () => {
    router.push(`/group/${groupId}/setting`);
  };
  
  const handleCreateSchedule = () => {
    // Navigate to a create schedule page, which doesn't exist yet
    // For now, just log it.
    console.log("Navigate to create schedule page for group", groupId);
  };
  
  const handleMonthView = () => {
    router.push(`/group/${groupId}/month`);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-background">
      <TopBar title={groupName} showSetting onSettingClick={handleSettingClick} />
      
      <main className="flex-1 overflow-y-auto p-4">
        {/* Calendar Section */}
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">11월</h2>
                <button onClick={handleMonthView} className="text-sm text-gray-dark">전체보기</button>
            </div>
            {/* This would be a real calendar component */}
            <div className="text-center p-8 border rounded-lg bg-gray-50">
                <p className="text-gray-600">캘린더 영역</p>
            </div>
        </div>

        {/* Members Section */}
        <div className="mt-6">
            <h3 className="font-bold">멤버 ({members.length})</h3>
            <div className="grid grid-cols-4 gap-4 mt-2">
                {members.map(member => (
                    <div key={member.id} className="text-center">
                        <Image src={member.avatar} alt={member.name} width={60} height={60} className="rounded-full mx-auto border" />
                        <p className="text-sm mt-1">{member.name}</p>
                    </div>
                ))}
            </div>
        </div>

      </main>
      
      <div className="p-4 bg-white border-t">
          <Button onClick={handleCreateSchedule}>+ 일정 만들기</Button>
      </div>
    </div>
  );
}