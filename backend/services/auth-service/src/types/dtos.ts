import { z } from 'zod';
import { UserRole } from '../entities/User';

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.nativeEnum(UserRole),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const TokenResponseDtoSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: z.nativeEnum(UserRole),
  }),
});

export type TokenResponseDto = z.infer<typeof TokenResponseDtoSchema>;

export const UserResponseDtoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean(),
  lastLoginAt: z.date().nullable(),
  createdAt: z.date(),
});

export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;
