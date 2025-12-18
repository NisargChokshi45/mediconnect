import { z } from 'zod';
import { AppointmentStatus } from '../entities/Appointment';

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
