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
