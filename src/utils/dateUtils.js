/**
 * 날짜 유틸리티 함수
 */
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  differenceInDays,
  differenceInHours,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (date, fmt = 'yyyy.MM.dd') => {
  return format(new Date(date), fmt, { locale: ko });
};

export const formatRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = differenceInDays(date, now);
  const diffHours = differenceInHours(date, now);

  if (diffDays === 0 && diffHours >= 0) return '오늘';
  if (diffDays === 1) return '내일';
  if (diffDays === -1) return '어제';
  if (diffDays > 1 && diffDays <= 7) return `${diffDays}일 후`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)}일 전`;
  return formatDate(dateStr);
};

export const getCalendarDays = (currentDate) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push({
      date: new Date(day),
      isCurrentMonth: isSameMonth(day, currentDate),
      isToday: isToday(day),
    });
    day = addDays(day, 1);
  }
  return days;
};

export const getDeadlineUrgency = (dueDateStr) => {
  const now = new Date();
  const due = new Date(dueDateStr);
  const hours = differenceInHours(due, now);
  if (hours < 0) return 'overdue';
  if (hours <= 24) return 'urgent';
  if (hours <= 48) return 'warning';
  if (hours <= 72) return 'soon';
  return 'normal';
};

export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export { addMonths, subMonths, isSameDay, format };
