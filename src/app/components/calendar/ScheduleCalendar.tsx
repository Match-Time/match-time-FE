'use client';

import {DayPicker} from 'react-day-picker';
import {ko} from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface ScheduleCalendarProps {
  selectedDays: Date[];
  onDayClick: (day: Date) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  isEditing: boolean;
}

export default function ScheduleCalendar({
  selectedDays,
  onDayClick,
  month,
  onMonthChange,
  isEditing,
}: ScheduleCalendarProps) {
  const modifiers = {
    saturday: {dayOfWeek: [6]},
    sunday: {dayOfWeek: [0]},
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
      onDayClick={onDayClick}
      month={month}
      onMonthChange={onMonthChange}
      showOutsideDays={false}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      classNames={{
        root: 'w-full',

        /* Month Header */
        caption: 'flex items-center justify-start mb-4 relative px-1',
        caption_label: 'text-xl font-bold text-yellow-main',
        nav: 'absolute right-1 flex items-center gap-1',
        nav_button: 'text-yellow-main text-xl',

        /* Weekday Row */
        head_row: 'grid grid-cols-7 mb-2',
        head_cell: 'text-center text-sm font-semibold text-gray-dark',

        /* Week Rows */
        row: 'grid grid-cols-7', // ⭐ 무조건 grid-cols-7 유지해야 함

        /* Day Cells */
        day: `
    h-11 w-11 m-1
    flex items-center justify-center
    text-sm rounded-lg bg-gray-background
    ${isEditing ? 'cursor-pointer' : ''}
  `,
        day_selected: '!bg-yellow-main !text-black font-bold',
        day_today: 'border-2 border-yellow-main rounded-lg font-bold',
        day_outside: 'hidden',

        button: 'border-none outline-none',
      }}
    />
  );
}
