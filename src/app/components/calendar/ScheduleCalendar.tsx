'use client';

import {DayPicker} from 'react-day-picker';
import {ko} from 'date-fns/locale';
import 'react-day-picker/style.css'; // MUST import for base structure

interface ScheduleCalendarProps {
  selectedDays: Date[];
  onDayClick: (day: Date) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  isEditing?: boolean; // optional for typing convenience
}

export default function ScheduleCalendar({
  selectedDays,
  onDayClick,
  month,
  onMonthChange,
  isEditing,
}: ScheduleCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yellow = '#e5c242';

  const handleDayClick = (day: Date) => {
    onDayClick(day);
  };

  const modifiers = {
    saturday: {dayOfWeek: [6] as number[]},
    sunday: {dayOfWeek: [0] as number[]},
  };

  const modifiersClassNames = {
    saturday: 'text-[#3b7cff]',
    sunday: 'text-[#e94a4a]',
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
      disabled={{before: today}}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      styles={{
        day_selected: {
          background: 'linear-gradient(180deg, #f4d35e 0%, #e5c242 100%)',
          color: '#fff',
          borderRadius: '12px',
          fontWeight: 600,
        },
        day_today: {
          border: `2px solid ${yellow}`,
          borderRadius: '12px',
          backgroundColor: '#fff',
          fontWeight: 600,
          color: '#222',
        },
        day_disabled: {
          color: '#c5c5c5',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
        },
        day: {color: '#222'},
      }}
      classNames={{
        root: 'rdp w-full bg-white flex flex-col items-center text-base',
        table: 'rdp-table w-full',
        head_row: 'rdp-head_row',
        head_cell:
          'rdp-head_cell text-center text-sm font-semibold text-gray-800 pb-2 first:text-[#e94a4a] last:text-[#3b7cff]',
        row: 'rdp-row',
        cell: 'rdp-cell text-center',

        caption:
          'rdp-caption relative flex items-center justify-center w-full text-yellow-main mb-4 mt-2 font-extrabold',
        caption_label: 'rdp-caption_label text-xl font-extrabold text-yellow-main',
        nav: 'rdp-nav absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-2',
        nav_button:
          'rdp-nav_button h-8 w-8 rounded-full bg-white text-yellow-main shadow-sm flex items-center justify-center',
        nav_button_previous: 'rdp-nav_button_previous',
        nav_button_next: 'rdp-nav_button_next',

        head: 'rdp-head',

        day: `rdp-day rounded-xl bg-[#f5f5f5] text-[#222] flex items-center justify-center transition-all border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.06)] ${
          isEditing ? 'cursor-pointer' : 'cursor-default'
        }`,
        day_selected:
          'rdp-day_selected !text-white [border-radius:0.75rem] [font-weight:700] !flex !items-center !justify-center shadow-sm',
        day_today:
          'rdp-day_today !bg-white !text-[#222] [border-radius:0.75rem] [font-weight:700]',
        day_outside: 'rdp-day_outside !text-gray-300 !bg-[#f2f2f2]',
        day_disabled:
          'rdp-day_disabled !bg-[#f2f2f2] !text-gray-300 cursor-not-allowed opacity-70',

        button: 'rdp-button_reset border-none focus:outline-none',
      }}
      components={{
        IconLeft: () => <span className="text-2xl text-yellow-main">{'<'}</span>,
        IconRight: () => <span className="text-2xl text-yellow-main">{'>'}</span>,
      }}
    />
  );
}
