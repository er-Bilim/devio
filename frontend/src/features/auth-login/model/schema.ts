import z from 'zod';

export const schemaLogin = z.object({
  email: z.email({ message: 'Неверный формат email' }),
  password: z.string().min(1, { message: 'Введите пароль' }),
});

export type SchemaLoginData = z.infer<typeof schemaLogin>;
