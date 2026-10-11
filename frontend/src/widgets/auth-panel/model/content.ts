import type { AuthMode } from './types';

type ContentType = {
  formTitle: string;
  formDescription: string;
};

export const authContent: Record<AuthMode, ContentType> = {
  signin: {
    formTitle: 'С возвращением',
    formDescription: 'Войди, чтобы продолжить с текущей станции',
  },
  signup: {
    formTitle: 'Первая станция',
    formDescription: 'Создай аккаунт — прогресс и стрик начнут сохраняться',
  },
};
