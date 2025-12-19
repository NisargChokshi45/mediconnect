import { z } from 'zod';

export const CreateDoctorDtoSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  specialization: z.string().min(1),
  licenseNumber: z.string().min(1),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/),
  officeAddress: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  consultationDuration: z.number().int().positive().default(30),
  bio: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).default(0),
});

export type CreateDoctorDto = z.infer<typeof CreateDoctorDtoSchema>;

export const UpdateDoctorDtoSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/)
    .optional(),
  officeAddress: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  consultationDuration: z.number().int().positive().optional(),
  bio: z.string().optional(),
  isAcceptingPatients: z.boolean().optional(),
});

export type UpdateDoctorDto = z.infer<typeof UpdateDoctorDtoSchema>;
