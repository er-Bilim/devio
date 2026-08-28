import z from 'zod';

export const schemaLogin = z.object({
  email: z.email({ message: 'Неверный формат email' }),
  // username: z
  //   .string()
  //   .min(5, 'username must be at least 5 characters')
  //   .max(30, 'username must be at most 30 characters')
  //   .regex(
  //     /^[a-zA-Z0-9_]+$/,
  //     'username must contain only alphanumeric characters and underscores',
  //   ),
  password: z.string().min(1, { message: 'Введите пароль' }),
});

export type SchemaLoginData = z.infer<typeof schemaLogin>;
