import { eachDayOfInterval, startOfYear, endOfYear } from 'date-fns';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const getAllDaysOfYear = (
  year: number,
): { months: string[][]; allDates: Date[] } => {
  const yearDate = new Date(year, 0, 1);
  const allDates = eachDayOfInterval({
    start: startOfYear(yearDate),
    end: endOfYear(yearDate),
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    return format(new Date(year, i, 1), 'LLL', { locale: ru }).split('.');
  });

  return {
    months,
    allDates,
  };
};
