"use client";

import { useState } from "react";
import { isSameDay } from "date-fns";
import TopBar from "@/app/components/common/topBar";
import Button from "@/app/components/common/button/Button";
import ScheduleCalendar from "@/app/components/calendar/ScheduleCalendar";

export default function MyMonthPage() {
  const [month, setMonth] = useState(new Date("2025-11-01"));
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([
      new Date("2025-11-10"),
      new Date("2025-11-11"),
  ]); 
  const [isEditing, setIsEditing] = useState(false);

  const handleDayClick = (day: Date) => {
    if (!isEditing) return;
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
      console.log("Saving user's default unavailable days:");
      const sortedDates = [...unavailableDays].sort((a, b) => a.getTime() - b.getTime());
      console.log(sortedDates.map(d => d.toLocaleDateString()));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="유저 이름" /> 
      
      <main className="flex-1 flex flex-col p-4">
        <ScheduleCalendar
          month={month}
          onMonthChange={setMonth}
          selectedDays={unavailableDays}
          onDayClick={handleDayClick}
          isEditing={isEditing}
        />
        
        <div className="flex-grow flex items-center justify-center">
            <div className="flex items-center text-sm">
                <span className="w-4 h-4 rounded-full bg-yellow-main mr-2"></span>
                <span className="text-gray-dark">불가능한 날짜</span>
            </div>
        </div>
      </main>
      
      <div className="p-4 bg-white">
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
