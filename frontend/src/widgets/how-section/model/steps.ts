export type Stop = {
  numeric: number;
  title: string;
  description: string;
  color: {
    border: string;
  };
};

export const stops: Stop[] = [
  {
    numeric: 1,
    title: 'Выбери ветку',
    description:
      'Направление – это линия с готовым порядком станций. Решать, что учить первым, не нужно',
    color: {
      border: 'border-sage',
    },
  },
  {
    numeric: 2,
    title: 'Проходи станции',
    description:
      'На каждой – материалы, примеры и практика. Закрыл станцию – линия окрашивается дальше',
    color: {
      border: 'border-rose',
    },
  },
  {
    numeric: 3,
    title: 'Возвращайся каждый день',
    description:
      'Даже маленький шаг продлевает стрик. Регулярность важнее скорости',
    color: {
      border: 'border-sand',
    },
  },
];