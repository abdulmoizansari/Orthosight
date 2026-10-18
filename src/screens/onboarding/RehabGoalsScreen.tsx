import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { rehabGoalsSchema } from '../../validation/onboardingSchemas';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { TextField } from '../../components/TextField';
import { ChipSelector } from '../../components/ChipSelector';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { RootStackParamList } from '../../navigation/types';

type FormData = z.infer<typeof rehabGoalsSchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'RehabGoals'>;

const regionOptions = [
  { label: 'Neck', value: 'neck' },
  { label: 'Shoulder', value: 'shoulder' },
  { label: 'Elbow', value: 'elbow' },
  { label: 'Wrist / Hand', value: 'wrist_hand' },
  { label: 'Upper Back', value: 'upper_back' },
  { label: 'Lower Back', value: 'lower_back' },
  { label: 'Hip', value: 'hip' },
  { label: 'Knee', value: 'knee' },
  { label: 'Ankle / Foot', value: 'ankle_foot' },
  { label: 'Full Body', value: 'full_body' },
];

const stageOptions = [
  { label: 'Early (0-2 weeks)', value: 'early' },
  { label: 'Mid (2-8 weeks)', value: 'mid' },
  { label: 'Late (8+ weeks)', value: 'late' },
  { label: 'Not sure', value: 'unknown' },
];

export const RehabGoalsScreen: React.FC<Props> = ({ navigation }) => {
  const { data, updateData, setStep } = useOnboardingStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(rehabGoalsSchema),
    defaultValues: {
      rehabReason: data.rehabReason ?? '',
      affectedRegion: data.affectedRegion ?? '',
      injuryOrProcedure: data.injuryOrProcedure ?? '',
      rehabStage: (data.rehabStage as FormData['rehabStage']) ?? 'unknown',
    },
  });

  const selectedRegion = watch('affectedRegion');
  const selectedStage = watch('rehabStage');

  const onSubmit = (values: FormData) => {
    updateData(values);
    setStep(2);
    navigation.navigate('MedicalHistory');
  };

  return (
    <ScreenWrapper>
      <ProgressBar current={2} total={6} />
      <Text style={styles.stepLabel}>Step 2 of 6</Text>
      <Text style={styles.title}>Rehabilitation Goals</Text>
      <Text style={styles.subtitle}>
        Tell us what you are recovering from and which body area needs attention.
      </Text>

      <Controller
        control={control}
        name="rehabReason"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Reason for Rehabilitation"
            value={value}
            onChangeText={onChange}
            placeholder="e.g., Post-surgery recovery, sports injury"
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
            error={errors.rehabReason?.message}
          />
        )}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Affected Body Region</Text>
        <Controller
          control={control}
          name="affectedRegion"
          render={({ field: { onChange } }) => (
            <ChipSelector
              options={regionOptions}
              selected={selectedRegion}
              onSelect={(v) => {
                onChange(v);
                setValue('affectedRegion', v, { shouldValidate: true });
              }}
            />
          )}
        />
        {errors.affectedRegion && (
          <Text style={styles.error}>{errors.affectedRegion.message}</Text>
        )}
      </View>

      <Controller
        control={control}
        name="injuryOrProcedure"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Injury or Procedure (optional)"
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="e.g., ACL reconstruction, rotator cuff tear"
          />
        )}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Rehabilitation Stage</Text>
        <Controller
          control={control}
          name="rehabStage"
          render={({ field: { onChange } }) => (
            <ChipSelector
              options={stageOptions}
              selected={selectedStage}
              onSelect={(v) => {
                onChange(v);
                setValue('rehabStage', v as FormData['rehabStage'], {
                  shouldValidate: true,
                });
              }}
            />
          )}
        />
      </View>

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
  error: { color: colors.error, fontSize: 13, marginTop: 6 },
  button: { marginTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});
