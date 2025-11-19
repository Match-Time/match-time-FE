"use client";

import { useState } from "react";
import { isSameDay } from "date-fns";
import TopBar from "@/app/components/common/topBar";
import BottomNav from "@/app/components/common/bottomBar";
import Button from "@/app/components/common/button/Button";
import ScheduleCalendar from "@/app/components/calendar/ScheduleCalendar";
import { useParams } from "next/navigation";

export default function MonthPage() {
  const params = useParams();
  const { groupId } = params;

  // State for the calendar
  const [month, setMonth] = useState(new Date("2025-11-01")); // Set to Nov 2025 for consistency with image
  
  // Mock initial unavailable days based on the image (10, 11)
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([
      new Date("2025-11-10"),
      new Date("2025-11-11"),
  ]); 
  const [isEditing, setIsEditing] = useState(false);

  const handleDayClick = (day: Date) => {
    if (!isEditing) return;
    
    // Prevent selecting past dates
    const today = new Date();
    today.setHours(0,0,0,0);
    if (day < today) {
        return;
    }

    const isSelected = unavailableDays.some(d => isSameDay(d, day));
    if (isSelected) {
      setUnavailableDays(unavailableDays.filter(d => !isSameDay(d, day)));
    } else {
      setUnavailableDays([...unavailableDays, day]);
    }
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      // This is where you would call the API to save the dates
      console.log("Saving unavailable days for group", groupId);
      // Sort dates before logging/sending
      const sortedDates = [...unavailableDays].sort((a, b) => a.getTime() - b.getTime());
      console.log(sortedDates.map(d => d.toLocaleDateString()));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-background">
      {/* The user name in the image seems like a placeholder. 
          The bottom nav says "고정표" (Fixed Schedule) which is more relevant. */}
      <TopBar title="고정표" />
      
      <main className="flex-1 overflow-y-auto p-4">
        <ScheduleCalendar
          month={month}
          onMonthChange={setMonth}
          selectedDays={unavailableDays}
          onDayClick={handleDayClick}
          isEditing={isEditing}
        />
        
        <div className="flex items-center justify-center pt-4 text-sm mt-4">
          <span className="w-4 h-4 rounded-full bg-yellow-main mr-2"></span>
          <span className="text-gray-dark">불가능한 날짜</span>
        </div>
      </main>
      
      <div className="p-4 bg-white border-t">
          <Button 
            onClick={handleEditToggle}
            variant={isEditing ? 'default' : 'outline'}
          >
            {isEditing ? "수정 완료" : "수정하기"}
          </Button>
      </div>
    </div>
  );
}