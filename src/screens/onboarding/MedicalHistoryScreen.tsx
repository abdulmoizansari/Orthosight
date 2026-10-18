import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { medicalHistorySchema } from '../../validation/onboardingSchemas';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { TextField } from '../../components/TextField';
import { ChipSelector } from '../../components/ChipSelector';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { RootStackParamList } from '../../navigation/types';

type FormData = z.infer<typeof medicalHistorySchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'MedicalHistory'>;

const conditionOptions = [
  { label: 'Diabetes', value: 'diabetes' },
  { label: 'Hypertension', value: 'hypertension' },
  { label: 'Heart Disease', value: 'heart_disease' },
  { label: 'Asthma', value: 'asthma' },
  { label: 'Arthritis', value: 'arthritis' },
  { label: 'Osteoporosis', value: 'osteoporosis' },
  { label: 'None', value: 'none' },
];

const implantOptions = [
  { label: 'Knee Replacement', value: 'knee_replacement' },
  { label: 'Hip Replacement', value: 'hip_replacement' },
  { label: 'Spinal Implant', value: 'spinal_implant' },
  { label: 'Pacemaker', value: 'pacemaker' },
  { label: 'None', value: 'none' },
];

export const MedicalHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { data, updateData, setStep } = useOnboardingStore();
  const [surgeriesText, setSurgeriesText] = useState(
    (data.surgeries ?? []).join(', ')
  );
  const [medicationsText, setMedicationsText] = useState(
    (data.medications ?? []).join(', ')
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      surgeries: data.surgeries ?? [],
      implants: data.implants ?? [],
      chronicConditions: data.chronicConditions ?? [],
      medications: data.medications ?? [],
      clinicianRestrictions: data.clinicianRestrictions ?? '',
    },
  });

  const selectedImplants = watch('implants') ?? [];
  const selectedConditions = watch('chronicConditions') ?? [];

  const onSubmit = (values: FormData) => {
    const surgeries = surgeriesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const medications = medicationsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateData({ ...values, surgeries, medications });
    setStep(3);
    navigation.navigate('BodyMap');
  };

  const toggleImplant = (val: string) => {
    const next = selectedImplants.includes(val)
      ? selectedImplants.filter((v) => v !== val)
      : [...selectedImplants, val];
    setValue('implants', next, { shouldValidate: true });
  };

  const toggleCondition = (val: string) => {
    const next = selectedConditions.includes(val)
      ? selectedConditions.filter((v) => v !== val)
      : [...selectedConditions, val];
    setValue('chronicConditions', next, { shouldValidate: true });
  };

  return (
    <ScreenWrapper>
      <ProgressBar current={3} total={6} />
      <Text style={styles.stepLabel}>Step 3 of 6</Text>
      <Text style={styles.title}>Medical History</Text>
      <Text style={styles.subtitle}>
        This helps us recommend safe exercises. Please be accurate.
      </Text>

      <TextField
        label="Previous Surgeries (comma separated)"
        value={surgeriesText}
        onChangeText={setSurgeriesText}
        placeholder="e.g., ACL reconstruction 2022, Appendectomy 2019"
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Implants</Text>
        <ChipSelector
          options={implantOptions}
          selected={selectedImplants}
          onSelect={toggleImplant}
          multi
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Chronic Conditions</Text>
        <ChipSelector
          options={conditionOptions}
          selected={selectedConditions}
          onSelect={toggleCondition}
          multi
        />
      </View>

      <TextField
        label="Current Medications (comma separated)"
        value={medicationsText}
        onChangeText={setMedicationsText}
        placeholder="e.g., Metformin, Lisinopril"
        multiline
        numberOfLines={2}
        style={{ minHeight: 60, textAlignVertical: 'top' }}
      />

      <Controller
        control={control}
        name="clinicianRestrictions"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Clinician-Provided Restrictions (optional)"
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="e.g., No weight bearing on left leg"
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
        )}
      />

      <PrimaryButton
        title="Continue"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        style={styles.button}
      />
      <PrimaryButton
        title="Back"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  stepLabel: {
    color: colors.teal,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: { marginTop: spacing.lg },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  button: { marginTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});
