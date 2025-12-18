import { z } from 'zod';
import { UserRole, AppointmentStatus, AuditAction } from './enums';

// Auth DTOs
export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

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

// Patient DTOs
export const CreatePatientDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().regex(/^[\d\s\-\+\(\)]+$/).optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
});

export type CreatePatientDto = z.infer<typeof CreatePatientDtoSchema>;

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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PatientResponseDto = z.infer<typeof PatientResponseDtoSchema>;

// Doctor DTOs
export const CreateDoctorDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  specialization: z.string().min(1),
  licenseNumber: z.string().min(1),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/),
  officeAddress: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  consultationDuration: z.number().int().positive().default(15),
});

export type CreateDoctorDto = z.infer<typeof CreateDoctorDtoSchema>;

export const DoctorResponseDtoSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  specialization: z.string(),
  licenseNumber: z.string(),
  phone: z.string(),
  officeAddress: z.string().nullable(),
  qualifications: z.array(z.string()),
  consultationDuration: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DoctorResponseDto = z.infer<typeof DoctorResponseDtoSchema>;

// Appointment DTOs
export const CreateAppointmentDtoSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.number().int().positive().default(30),
  reasonForVisit: z.string().optional(),
  patientNotes: z.string().optional(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentDtoSchema>;

export const UpdateAppointmentStatusDtoSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
  cancellationReason: z.string().optional(),
});

export type UpdateAppointmentStatusDto = z.infer<typeof UpdateAppointmentStatusDtoSchema>;

export const AppointmentResponseDtoSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  scheduledAt: z.date(),
  durationMinutes: z.number(),
  status: z.nativeEnum(AppointmentStatus),
  reasonForVisit: z.string().nullable(),
  patientNotes: z.string().nullable(),
  insuranceVerified: z.boolean(),
  cancellationReason: z.string().nullable(),
  cancelledAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  patient: PatientResponseDtoSchema.optional(),
  doctor: DoctorResponseDtoSchema.optional(),
});

export type AppointmentResponseDto = z.infer<typeof AppointmentResponseDtoSchema>;

// Note DTOs
export const CreateNoteDtoSchema = z.object({
  appointmentId: z.string().uuid(),
  chiefComplaint: z.string().min(1),
  historyOfPresentIllness: z.string().optional(),
  physicalExamination: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  medications: z.string().optional(),
  followUpInstructions: z.string().optional(),
});

export type CreateNoteDto = z.infer<typeof CreateNoteDtoSchema>;

export const NoteResponseDtoSchema = z.object({
  id: z.string().uuid(),
  appointmentId: z.string().uuid(),
  doctorId: z.string().uuid(),
  chiefComplaint: z.string(),
  historyOfPresentIllness: z.string().nullable(),
  physicalExamination: z.string().nullable(),
  diagnosis: z.string().nullable(),
  treatmentPlan: z.string().nullable(),
  medications: z.string().nullable(),
  followUpInstructions: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type NoteResponseDto = z.infer<typeof NoteResponseDtoSchema>;

// Audit Log DTOs
export const CreateAuditLogDtoSchema = z.object({
  action: z.nativeEnum(AuditAction),
  userId: z.string().uuid().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  ipAddress: z.string(),
  userAgent: z.string().optional(),
  correlationId: z.string().optional(),
});

export type CreateAuditLogDto = z.infer<typeof CreateAuditLogDtoSchema>;
