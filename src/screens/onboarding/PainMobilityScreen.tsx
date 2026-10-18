import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { painMobilitySchema } from '../../validation/onboardingSchemas';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { TextField } from '../../components/TextField';
import { ChipSelector } from '../../components/ChipSelector';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { RootStackParamList } from '../../navigation/types';

type FormData = z.infer<typeof painMobilitySchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'PainMobility'>;

const painLocations = [
  { label: 'Neck', value: 'neck' },
  { label: 'Shoulder', value: 'shoulder' },
  { label: 'Elbow', value: 'elbow' },
  { label: 'Wrist / Hand', value: 'wrist_hand' },
  { label: 'Upper Back', value: 'upper_back' },
  { label: 'Lower Back', value: 'lower_back' },
  { label: 'Hip', value: 'hip' },
  { label: 'Knee', value: 'knee' },
  { label: 'Ankle / Foot', value: 'ankle_foot' },
];

export const PainMobilityScreen: React.FC<Props> = ({ navigation }) => {
  const { data, updateData, setStep } = useOnboardingStore();
  
  // FIXED: Using bodyParts instead of painLocations from previous screen
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    data.bodyParts ?? []
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(painMobilitySchema),
    defaultValues: {
      painLocations: data.bodyParts ?? [],
      painLevel: data.painLevel ?? 5,
      mobilityLimitations: data.mobilityLimitations ?? '',
      knownRomRestrictions: data.knownRomRestrictions ?? '',
    },
  });

  const painLevel = watch('painLevel');

  const toggleLocation = (val: string) => {
    const next = selectedLocations.includes(val)
      ? selectedLocations.filter((v) => v !== val)
      : [...selectedLocations, val];
    setSelectedLocations(next);
  };

  const onSubmit = (values: FormData) => {
    // FIXED: Do not overwrite bodyParts. Just save the rest.
    updateData({ 
      painLevel: values.painLevel,
      mobilityLimitations: values.mobilityLimitations,
      knownRomRestrictions: values.knownRomRestrictions,
    });
    setStep(5);
    navigation.navigate('SafetyScreening');
  };

  return (
    <ScreenWrapper>
      <ProgressBar current={5} total={6} />
      <Text style={styles.stepLabel}>Step 5 of 6</Text>
      <Text style={styles.title}>Pain Level & Limits</Text>
      <Text style={styles.subtitle}>
        Rate your current pain and tell us about any movement limits.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Current Pain Level</Text>
        <Text style={styles.painValue}>{painLevel} / 10</Text>
        <Controller
          control={control}
          name="painLevel"
          render={({ field: { onChange, value } }) => (
            <Slider
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={value}
              onValueChange={onChange}
              minimumTrackTintColor={colors.teal}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.teal}
              style={styles.slider}
            />
          )}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>0 - No pain</Text>
          <Text style={styles.sliderLabel}>10 - Severe</Text>
        </View>
      </View>

      <Controller
        control={control}
        name="mobilityLimitations"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Mobility Limitations (optional)"
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="e.g., Cannot bend knee past 90 degrees"
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
        )}
      />

      <Controller
        control={control}
        name="knownRomRestrictions"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Known ROM Restrictions (optional)"
            value={value ?? ''}
            onChangeText={onChange}
            placeholder="e.g., Shoulder flexion limited to 120 degrees"
            multiline
            numberOfLines={2}
            style={{ minHeight: 60, textAlignVertical: 'top' }}
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
  stepLabel: { color: colors.teal, fontSize: 13, fontWeight: '600', marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  section: { marginTop: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  painValue: { fontSize: 32, fontWeight: '700', color: colors.teal, textAlign: 'center', marginVertical: spacing.sm },
  slider: { width: '100%', height: 40 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -8 },
  sliderLabel: { fontSize: 12, color: colors.textMuted },
  error: { color: colors.error, fontSize: 13, marginTop: 6 },
  button: { marginTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});
