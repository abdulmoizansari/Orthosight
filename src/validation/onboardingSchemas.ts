import { z } from 'zod';

export const basicProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use format YYYY-MM-DD')
    .refine((val) => {
      const d = new Date(val);
      if (isNaN(d.getTime())) return false;
      return d < new Date();
    }, 'Date of birth must be in the past')
    .refine((val) => {
      const d = new Date(val);
      const age = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 5 && age <= 120;
    }, 'Please enter a valid age (5-120 years)'),
  gender: z.enum(['male', 'female']), // <--- FIXED: Only 2 options
});

export const rehabGoalsSchema = z.object({
  rehabReason: z.string().min(3, 'Please describe the reason'),
  affectedRegion: z.string().min(1, 'Select an affected region'),
  injuryOrProcedure: z.string().optional(),
  rehabStage: z.enum(['early', 'mid', 'late', 'unknown']),
});

export const medicalHistorySchema = z.object({
  surgeries: z.array(z.string()),
  implants: z.array(z.string()),
  chronicConditions: z.array(z.string()),
  medications: z.array(z.string()),
  clinicianRestrictions: z.string().optional(),
});

export const painMobilitySchema = z.object({
  painLocations: z.array(z.string()).min(1, 'Select at least one location'), // <--- We keep this schema for the UI chips
  painLevel: z.number().min(0).max(10),
  mobilityLimitations: z.string().optional(),
  knownRomRestrictions: z.string().optional(),
});

export const safetyScreeningSchema = z.object({
  heartCondition: z.boolean(),
  chestPain: z.boolean(),
  dizziness: z.boolean(),
  boneJointProblem: z.boolean(),
  bloodPressureMeds: z.boolean(),
  otherReason: z.boolean(),
});

export const reviewConsentSchema = z.object({
  privacyConsent: z.boolean().refine((v) => v === true, {
    message: 'You must accept the privacy policy',
  }),
  dataProcessingConsent: z.boolean().refine((v) => v === true, {
    message: 'You must consent to data processing',
  }),
});
