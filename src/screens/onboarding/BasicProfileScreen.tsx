import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { basicProfileSchema } from '../../validation/onboardingSchemas';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { TextField } from '../../components/TextField';
import { ChipSelector } from '../../components/ChipSelector';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { RootStackParamList } from '../../navigation/types';

type FormData = z.infer<typeof basicProfileSchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'BasicProfile'>;

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export const BasicProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { data, updateData, setStep } = useOnboardingStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: {
      fullName: data.fullName ?? '',
      dateOfBirth: data.dateOfBirth ?? '',
      gender: (data.gender as FormData['gender']) ?? 'male',
    },
  });

  const onSubmit = (values: FormData) => {
    updateData(values);
    setStep(1);
    navigation.navigate('RehabGoals');
  };

  return (
    <ScreenWrapper>
      <ProgressBar current={1} total={6} />
      <Text style={styles.stepLabel}>Step 1 of 6</Text>
      <Text style={styles.title}>Basic Profile</Text>
      <Text style={styles.subtitle}>
        Let us start with some basic information about you.
      </Text>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Full Name"
            value={value}
            onChangeText={onChange}
            placeholder="Enter your full name"
            error={errors.fullName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Date of Birth"
            value={value}
            onChangeText={onChange}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            error={errors.dateOfBirth?.message}
          />
        )}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Gender (For Body Model)</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <ChipSelector
              options={genderOptions}
              selected={value}
              onSelect={(v) => onChange(v)}
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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  stepLabel: { color: colors.teal, fontSize: 13, fontWeight: '600', marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  section: { marginTop: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  button: { marginTop: spacing.xl },
});
