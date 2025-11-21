'use client';

import {DayPicker} from 'react-day-picker';
import {ko} from 'date-fns/locale';
import 'react-day-picker/style.css'; // MUST import for base structure

interface ScheduleCalendarProps {
  selectedDays: Date[];
  onDayClick: (day: Date) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
}

export default function ScheduleCalendar({
  selectedDays,
  onDayClick,
  month,
  onMonthChange,
}: ScheduleCalendarProps) {
  const handleDayClick = (day: Date) => {
    onDayClick(day);
  };

  const modifiers = {
    saturday: {dayOfWeek: [6] as number[]},
    sunday: {dayOfWeek: [0] as number[]},
  };

  const modifiersClassNames = {
    saturday: 'text-blue-main',
    sunday: 'text-red-main',
  };

  return (
    <DayPicker
      locale={ko}
      mode="multiple"
      selected={selectedDays}
      onDayClick={handleDayClick}
      month={month}
      onMonthChange={onMonthChange}
      showOutsideDays
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      classNames={{
        root: 'bg-white p-4 rounded-lg',

        // Month header
        caption:
          'flex items-center justify-center relative text-yellow-main mb-4',
        caption_label: 'text-xl font-bold',
        nav_button_previous: 'absolute left-0 text-2xl',
        nav_button_next: 'absolute right-0 text-2xl',

        // Weekday labels
        head_cell: 'text-center text-sm font-semibold pb-2',

        // ★ Day cell styling (정사각형 박스)
        day: `
        h-10 w-10
        text-center leading-[2.5rem]
        rounded-lg bg-gray-background
      `,

        // ★ 선택된 날짜 (노란 정사각형)
        day_selected: `!bg-yellow-main !text-black !rounded-lg !font-semibold
      `,

        // ★ 오늘 날짜 (노란 테두리)
        day_today: `
    font-bold 
    border-2 border-yellow-main 
    bg-white 
    rounded-lg
  `,

        // Outside days 숨기기 또는 연한 색
        day_outside: 'text-gray-300',

        // Remove default button outlines
        button: 'border-none outline-none',
      }}
    />
  );
}
