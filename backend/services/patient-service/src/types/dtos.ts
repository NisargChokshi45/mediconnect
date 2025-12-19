import { z } from 'zod';

export const CreatePatientDtoSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/)
    .optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  bloodGroup: z.string().default('O+'),
});

export type CreatePatientDto = z.infer<typeof CreatePatientDtoSchema>;

export const UpdatePatientDtoSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/)
    .optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/)
    .optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  bloodGroup: z.string().optional(),
});

export type UpdatePatientDto = z.infer<typeof UpdatePatientDtoSchema>;

export const PatientResponseDtoSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date(),
  phone: z.string(),
  address: z.string().nullable(),
  emergencyContact: z.string().nullable(),
  emergencyPhone: z.string().nullable(),
  insuranceProvider: z.string().nullable(),
  insurancePolicyNumber: z.string().nullable(),
  medicalHistory: z.string().nullable(),
  allergies: z.array(z.string()),
  bloodGroup: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PatientResponseDto = z.infer<typeof PatientResponseDtoSchema>;
