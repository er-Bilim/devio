import z from 'zod';

export const schemaRegister = z
  .object({
    email: z.email({ message: 'Неверный формат адреса электронной почты' }),
    username: z
      .string()
      .min(5, 'Имя пользователя должно состоять как минимум из 5 символов')
      .max(30, 'Имя пользователя должно содержать не более 30 символов')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Имя пользователя должно состоять исключительно из букв, цифр и символов подчеркивания',
      ),
    display_name: z
      .string()
      .min(3, 'Отображаемое имя должно состоять как минимум из 3 символов')
      .max(25, 'Отображаемое имя должно содержать не более 25 символов'),
    password: z.string().min(16, {
      message: 'Пароль должен состоять как минимум из 16 символов',
    }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Пароли не совпадают',
    path: ['confirm'],
  });

export type SchemaRegisterData = z.infer<typeof schemaRegister>;
