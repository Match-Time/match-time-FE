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
        // Override container styles
        root: 'bg-white p-4 rounded-lg shadow',

        // Caption: < Month >
        caption:
          'flex items-center justify-center relative text-yellow-main mb-4',
        caption_label: 'text-xl font-bold',
        nav_button_previous: 'absolute left-0 text-2xl',
        nav_button_next: 'absolute right-0 text-2xl',

        // Head: Weekdays
        head_cell: 'text-center text-sm font-semibold text-gray-dark pb-2',

        // Day
        day: 'h-10 w-10 rounded-md transition-colors bg-gray-background',
        day_selected: '!bg-yellow-main !text-black [border-radius:0.375rem]',
        day_today: 'font-bold border-2 border-yellow-main', // Modified to include border
        day_outside: '!text-gray-light',

        // Remove default button outlines and styles
        button: 'border-none',
      }}
    />
  );
}
