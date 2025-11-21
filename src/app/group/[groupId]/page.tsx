"use client";

import TopBar from "@/app/components/common/topBar";
// import BottomNav from "@/app/components/common/bottomBar"; // This is in RootLayout
import Button from "@/app/components/common/button/Button";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import Tag from "@/app/components/common/Tag";
import { ShareSheet } from "@/app/components/common/ShareSheet";

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  // Mock data as per request
  const groupInfo = {
    name: "걸스나잇 해요",
    memberCount: 4,
  };

  const recommendedDates = [
    { id: "1", date: "2025.11.30", dayOfWeek: "일요일", availableCount: 4 },
    { id: "2", date: "2025.12.04", dayOfWeek: "목요일", availableCount: 4 },
    { id: "3", date: "2025.12.05", dayOfWeek: "금요일", availableCount: 3 },
  ];

  const handleConfirmDate = () => {
    if (selectedDate) {
      console.log(`Confirming date ${selectedDate} for group ${groupId}`);
      // API call would go here
      alert(`모임 날짜가 ${selectedDate}로 확정되었습니다!`);
    }
  };

  const handleSettingClick = () => {
    router.push(`/group/${groupId}/setting`);
  };

  const handleShareClick = () => {
    setIsShareSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="모임 세부 정보" />

      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {/* Group Info Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-black">
              {groupInfo.name}
            </h1>
            <p className="text-sm text-gray-medium">
              <span className="text-red-main">{groupInfo.memberCount}</span>명
              모였어요
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSettingClick}
              className="w-10 h-10 bg-yellow-light rounded-full flex items-center justify-center"
            >
              <Image
                src="/images/ic_setting.png"
                alt="설정"
                width={20}
                height={20}
              />
            </button>
            <button
              onClick={handleShareClick}
              className="w-10 h-10 bg-yellow-light rounded-full flex items-center justify-center"
            >
              <Image
                src="/images/ic_link.png"
                alt="공유"
                width={17}
                height={17}
              />
            </button>
          </div>
        </div>
        <div className="w-full -mx-4 h-[6px] bg-gray-background mt-3 mb-6" />

        {/* Recommended Dates Section */}
        <div>
          <h2 className="text-lg font-semibold text-black">추천 날짜 목록</h2>
          <p className="text-sm text-gray-medium mb-4">
            날짜를 선택하면 모임 날짜로 확정할 수 있어요
          </p>

          <div className="space-y-3">
            {recommendedDates.map((item) => (
              <label
                key={item.id}
                htmlFor={item.id}
                className="block rounded-xl p-[2px] w-full h-[107px]
bg-gradient-to-r from-yellow-300 to-yellow-500 cursor-pointer"
              >
                <div
                  className={`flex items-center justify-between p-4 rounded-xl transition-colors w-full h-full ${
                    selectedDate === item.date ? "bg-yellow-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={item.id}
                      name="recommendedDate"
                      value={item.date}
                      checked={selectedDate === item.date}
                      onChange={() => setSelectedDate(item.date)}
                      className="hidden"
                    />
                    <div>
                      <p className="font-bold text-2xl">{item.date}</p>
                      <p className="text-sm text-gray-dark font-semibold">
                        {item.dayOfWeek}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Tag text={`${item.availableCount}명 가능 날짜`} />

                    {selectedDate === item.date ? (
                      <Image
                        src="/images/ic_check_selected.png"
                        alt="선택됨"
                        width={25}
                        height={25}
                        className="ml-4"
                      />
                    ) : (
                      <div className="w-6 h-6 ml-4 border-2 border-gray-light rounded-full"></div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Button */}
      <footer className="p-4 bg-white border-t">
        <Button
          onClick={handleConfirmDate}
          disabled={!selectedDate}
          className={`w-full py-3 text-lg font-bold rounded-lg transition-colors ${
            selectedDate
              ? "bg-yellow-main text-black"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          이 날짜로 확정하기
        </Button>
      </footer>

      {/* Share Sheet Component */}
      <ShareSheet
        open={isShareSheetOpen}
        onOpenChange={setIsShareSheetOpen}
        groupId={groupId}
      />
    </div>
  );
}
