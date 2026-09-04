import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const padNumber = (number: number): string => {
  if (number < 10) {
    return `0${number}`;
  }

  return number.toString();
};

export const pluralize = (
  count: number,
  one: string,
  few: string,
  many: string,
): string => {
  if (!Number.isFinite(count)) throw new Error('count must be a number');

  const absCount = Math.abs(count) % 100;
  const countMod10 = absCount % 10;

  if (absCount > 10 && absCount < 20) return many;
  if (countMod10 === 1) return one;
  if (countMod10 >= 2 && countMod10 <= 4) return few;

  return many;
};

export const formatDate = (
  date: string,
): { year: string; month: string; day: string } => {
  const year = format(new Date(date), 'yyyy');
  const month = format(new Date(date), 'MMMM', { locale: ru });
  const day = format(new Date(date), 'dd');
  return {
    year,
    month,
    day,
  };
};

export const getWeekDayNames = (
  locale = 'ru',
  format: 'short' | 'long' | 'narrow' = 'short',
) => {
  const year = new Date().getFullYear();
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });

  const weeks = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(year, 0, 5 + i);
    return formatter.format(date);
  });

  return weeks;
};
