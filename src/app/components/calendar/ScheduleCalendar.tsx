'use client';

import type { CSSProperties } from 'react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface ScheduleCalendarProps {
  selectedDays: Date[];
  onDayClick: (day: Date) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  isEditing?: boolean;
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
    if (!isEditing) return;
    onDayClick(day);
  };

  const modifiers = {
    saturday: { dayOfWeek: [6] },
    sunday: { dayOfWeek: [0] },
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
      disabled={!isEditing}
      //disabled={disabledBeforeToday}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      styles={{
        root: {
          '--rdp-day-width': '46px',
          '--rdp-day-height': '46px',
          '--rdp-day_button-width': '46px',
          '--rdp-day_button-height': '46px',
          '--rdp-day_button-border-radius': '14px',
        } as CSSProperties,

        /** 기본 날짜 스타일 */
        day: {
          backgroundColor: '#f5f5f5',
          color: '#4a4a4a',
          borderRadius: '14px',
          fontWeight: 600,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease, border 0.2s ease',
        },

        /** 선택된 날짜 */
        day_selected: {
          background: '#fde68a',
          color: '#2f2f2f',
          fontWeight: 600,
          borderRadius: '14px',
        },

        /** 밖의 날짜 */
        day_outside: {
          color: '#c7c7c7',
          backgroundColor: '#f1f1f1',
          borderRadius: '14px',
        },

        /** 비활성 날짜 */
        day_disabled: {
          color: '#a0a0a0',
          backgroundColor: '#f0f0f0',
          //border: '1px solid #e0e0e0',
          cursor: 'not-allowed',
          borderRadius: '14px',
        },

        /** 클릭 버튼 */
        day_button: {
          cursor: isEditing ? 'pointer' : 'default',
        },

        /** 헤더 / 네비게이션 */
        caption: { alignItems: 'center', color: yellow },
        caption_label: { fontWeight: 800, fontSize: '18px', color: yellow },
        nav_button: { color: isEditing ? yellow : '#c8c8c8', border: 'none', background: 'transparent' },
        nav_button_previous: { color: isEditing ? '#c8c8c8' : '#e0e0e0' },
        nav_button_next: { color: isEditing ? yellow : '#e0e0e0' },

        head_cell: { fontWeight: 700 },
        table: { borderSpacing: '10px 10px' },
        row: { marginBottom: '8px' },
      }}
    />
  );
}
