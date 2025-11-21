'use client';

import {DayPicker} from 'react-day-picker';
import {ko} from 'date-fns/locale';
import 'react-day-picker/style.css'; // MUST import for base structure

interface ScheduleCalendarProps {
  selectedDays: Date[];
  onDayClick: (day: Date) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  unavailableDays?: Date[];
}

export default function ScheduleCalendar({
  selectedDays,
  onDayClick,
  month,
  onMonthChange,
  unavailableDays = [],
}: ScheduleCalendarProps) {
  const handleDayClick = (day: Date) => {
    onDayClick(day);
  };

  const modifiers = {
    saturday: {dayOfWeek: [6] as number[]},
    sunday: {dayOfWeek: [0] as number[]},
    unavailable: unavailableDays,
  };

  const modifiersClassNames = {
    saturday: 'text-blue-main',
    sunday: 'text-red-main',
    unavailable: 'bg-yellow-main/30 text-gray-900 border-yellow-main/50',
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
        // Override container styles
        root: 'bg-white p-4 rounded-2xl shadow-sm border border-gray-100',

        // Caption: < Month >
        caption:
          'flex items-center justify-center relative text-yellow-main mb-4',
        caption_label: 'text-xl font-bold',
        nav_button_previous: 'absolute left-0 text-2xl',
        nav_button_next: 'absolute right-0 text-2xl',

        // Head: Weekdays
        head_cell: 'text-center text-sm font-semibold text-gray-dark pb-2 tracking-tight',

        // Day
        day: 'h-10 w-10 rounded-lg transition-colors bg-white text-gray-700 border border-gray-100 hover:border-yellow-main/50',
        day_selected: '!bg-yellow-main/80 !text-black !font-bold shadow-inner ring-2 ring-yellow-main/50 border-yellow-main',
        day_today: 'font-bold border-2 border-yellow-main bg-white',
        day_outside: '!text-gray-light !bg-gray-50',

        // Remove default button outlines and styles
        button: 'border-none',
      }}
    />
  );
}
