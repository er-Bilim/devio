import z from 'zod';

export const schemaRegister = z
  .object({
    email: z.email({ message: 'invalid format email' }),
    username: z
      .string()
      .min(5, 'username must be at least 5 characters')
      .max(30, 'username must be at most 30 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'username must contain only alphanumeric characters and underscores',
      ),
    display_name: z
      .string()
      .min(3, 'display name must be at least 3 characters')
      .max(25, 'display name must be at most 25 characters'),
    password: z
      .string()
      .min(8, { message: 'password must be at least 8 characters' }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'passwords do not match',
    path: ['confirm'],
  });

export type SchemaRegisterData = z.infer<typeof schemaRegister>;
