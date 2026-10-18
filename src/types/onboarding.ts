export type Gender = 'male' | 'female';

export type RehabStage = 'early' | 'mid' | 'late' | 'unknown';

export interface OnboardingData {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;

  rehabReason: string;
  affectedRegion: string; 
  injuryOrProcedure: string;
  rehabStage: RehabStage;

  surgeries: string[];
  implants: string[];
  chronicConditions: string[];
  medications: string[];
  clinicianRestrictions: string;

  bodyParts: string[]; 
  bodySpecificAnswers: Record<string, boolean>; 
  painLevel: number;
  mobilityLimitations: string;
  knownRomRestrictions: string;

  parqAnswers: Record<string, boolean>;
  safetyFlags: string[];

  privacyConsent: boolean;
  dataProcessingConsent: boolean;
}
