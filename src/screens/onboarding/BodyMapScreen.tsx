import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { CheckboxRow } from '../../components/CheckboxRow';
import { InteractiveBodyMap } from '../../components/InteractiveBodyMap';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BodyMap'>;

const SPECIFIC_QUESTIONS: Record<string, { key: string; label: string }[]> = {
  knees: [
    { key: 'knee_pain_walking', label: 'Does your knee pain worsen when walking or climbing stairs?' },
    { key: 'knee_swelling', label: 'Do you experience swelling or stiffness in the knee?' },
  ],
  shoulders: [
    { key: 'shoulder_overhead', label: 'Is it painful to lift your arm overhead?' },
    { key: 'shoulder_night_pain', label: 'Does the pain worsen at night?' },
  ],
  lower_back: [
    { key: 'back_radiating', label: 'Does the pain radiate down your leg (sciatica)?' },
  ],
  default: [
    { key: 'pain_movement', label: 'Does the pain increase with movement?' },
  ]
};

export const BodyMapScreen: React.FC<Props> = ({ navigation }) => {
  const { data, updateData, setStep } = useOnboardingStore();
  
  const [selectedParts, setSelectedParts] = useState<string[]>(data.bodyParts ?? []);
  const [answers, setAnswers] = useState<Record<string, boolean>>(data.bodySpecificAnswers ?? {});

  const togglePart = (partId: string) => {
    setSelectedParts((prev) =>
      prev.includes(partId) ? prev.filter((p) => p !== partId) : [...prev, partId]
    );
  };

  const toggleAnswer = (key: string) => {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = () => {
    updateData({ bodyParts: selectedParts, bodySpecificAnswers: answers });
    setStep(4); 
    navigation.navigate('PainMobility');
  };

  const dynamicQuestions = selectedParts.flatMap((part) => SPECIFIC_QUESTIONS[part] || SPECIFIC_QUESTIONS.default);

  return (
    <ScreenWrapper>
      <ProgressBar current={4} total={6} />
      <Text style={styles.stepLabel}>Step 4 of 6</Text>
      <Text style={styles.title}>Where is your pain?</Text>
      <Text style={styles.subtitle}>
        Tap the areas on the body map where you feel discomfort.
      </Text>

      <InteractiveBodyMap
        gender={data.gender || 'male'}
        selectedParts={selectedParts}
        onTogglePart={togglePart}
      />

      {selectedParts.length > 0 && (
        <View style={styles.questionsContainer}>
          <Text style={styles.sectionTitle}>A few questions about your selected areas:</Text>
          {dynamicQuestions.map((q, index) => (
            <CheckboxRow
              key={`${q.key}-${index}`}
              label={q.label}
              checked={!!answers[q.key]}
              onToggle={() => toggleAnswer(q.key)}
            />
          ))}
        </View>
      )}

      <PrimaryButton
        title="Continue"
        onPress={onSubmit}
        disabled={selectedParts.length === 0}
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
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
  questionsContainer: { marginTop: spacing.xl, backgroundColor: colors.surface, padding: spacing.md, borderRadius: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  button: { marginTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});
