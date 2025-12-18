import { z } from 'zod';

export const CreateNoteDtoSchema = z.object({
  appointmentId: z.string().uuid(),
  doctorId: z.string().uuid(),
  chiefComplaint: z.string().min(1),
  historyOfPresentIllness: z.string().optional(),
  physicalExamination: z.string().optional(),
  vitalSigns: z.string().optional(),
  diagnosis: z.string().optional(),
  differentialDiagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  medications: z.string().optional(),
  followUpInstructions: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type CreateNoteDto = z.infer<typeof CreateNoteDtoSchema>;

export const UpdateNoteDtoSchema = z.object({
  chiefComplaint: z.string().min(1).optional(),
  historyOfPresentIllness: z.string().optional(),
  physicalExamination: z.string().optional(),
  vitalSigns: z.string().optional(),
  diagnosis: z.string().optional(),
  differentialDiagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  medications: z.string().optional(),
  followUpInstructions: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type UpdateNoteDto = z.infer<typeof UpdateNoteDtoSchema>;
