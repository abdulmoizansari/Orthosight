import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { CheckboxRow } from '../../components/CheckboxRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SafetyScreening'>;

interface Question {
  key: string;
  label: string;
  isRedFlag: boolean;
}

const questions: Question[] = [
  {
    key: 'heartCondition',
    label:
      'Has a doctor ever said you have a heart condition and should only do physical activity recommended by a doctor?',
    isRedFlag: true,
  },
  {
    key: 'chestPain',
    label:
      'Do you feel pain in your chest when you do physical activity?',
    isRedFlag: true,
  },
  {
    key: 'dizziness',
    label:
      'In the past month, have you had chest pain when not doing physical activity or lost balance from dizziness?',
    isRedFlag: true,
  },
  {
    key: 'boneJointProblem',
    label:
      'Do you have a bone or joint problem that could be made worse by physical activity?',
    isRedFlag: true,
  },
  {
    key: 'bloodPressureMeds',
    label:
      'Are you currently taking medication for blood pressure or a heart condition?',
    isRedFlag: true,
  },
  {
    key: 'otherReason',
    label:
      'Do you know of any other reason why you should not do physical activity?',
    isRedFlag: true,
  },
];

export const SafetyScreeningScreen: React.FC<Props> = ({ navigation }) => {
  const { data, updateData, setStep } = useOnboardingStore();
  const [answers, setAnswers] = useState<Record<string, boolean>>(
    data.parqAnswers ?? {}
  );

  const toggle = (key: string) => {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = () => {
    const flags = questions
      .filter((q) => q.isRedFlag && answers[q.key])
      .map((q) => q.key);

    updateData({ parqAnswers: answers, safetyFlags: flags });
    setStep(5);
    navigation.navigate('ReviewConsent');
  };

  const answeredAll = questions.every((q) => answers[q.key] !== undefined);

  return (
    <ScreenWrapper>
      <ProgressBar current={5} total={6} />
      <Text style={styles.stepLabel}>Step 5 of 6</Text>
      <Text style={styles.title}>Safety Screening</Text>
      <Text style={styles.subtitle}>
        These questions help us identify any health risks before you begin
        exercise.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Note: This is a simplified pre-participation screening. It is not
          the official PAR-Q+ questionnaire. A licensed healthcare provider
          should review your case before starting any exercise program.
        </Text>
      </View>

      {questions.map((q) => (
        <CheckboxRow
          key={q.key}
          label={q.label}
          checked={!!answers[q.key]}
          onToggle={() => toggle(q.key)}
        />
      ))}

      <PrimaryButton
        title={answeredAll ? 'Continue' : 'Please answer all questions'}
        onPress={onSubmit}
        disabled={!answeredAll}
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
  infoBox: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  button: { marginTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});
