import { eachDayOfInterval, startOfYear, endOfYear, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const getAllDaysOfYear = (year: number): { allMonths: string[] } => {
  const yearDate = new Date(year, 0, 1);
  const allDates = eachDayOfInterval({
    start: startOfYear(yearDate),
    end: endOfYear(yearDate),
  });

  const allMonths = allDates.map((date) =>
    format(date, 'MMMM', { locale: ru }),
  );

  return {
    allMonths,
  };
};
