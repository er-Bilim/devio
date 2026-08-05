import z from 'zod';

export const schemaRegister = z
  .object({
    email: z.email({ message: 'Неверный формат email' }),
    password: z
      .string()
      .min(8, { message: 'Пароль должен содержать не менее 8 символов' }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Пароли не совпадают',
    path: ['confirm'],
  });

export type SchemaRegisterData = z.infer<typeof schemaRegister>;
