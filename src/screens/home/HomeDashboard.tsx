import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography, radius } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeDashboard: React.FC<Props> = ({ navigation }) => {
  const { data, reset } = useOnboardingStore();
  const safetyFlagCount = (data.safetyFlags ?? []).length;

  const onStartOver = () => {
    reset();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  return (
    <ScreenWrapper>
      <Text style={styles.greeting}>Welcome, {data.fullName?.split(' ')[0] ?? 'Patient'} 👋</Text>
      <Text style={styles.subtitle}>Your profile is set up. Exercise recommendations are coming next.</Text>

      {safetyFlagCount > 0 && (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠ Safety Review Needed</Text>
          <Text style={styles.warningBody}>You reported {safetyFlagCount} safety flag(s). Please consult a clinician before starting exercises.</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pain Map Summary</Text>
        <Text style={styles.cardRow}>Affected Areas: {data.bodyParts?.length ? data.bodyParts.join(', ').replace(/_/g, ' ') : 'None'}</Text>
        <Text style={styles.cardRow}>Pain level: {data.painLevel ?? 0} / 10</Text>
        <Text style={styles.cardRow}>Gender Model: {data.gender}</Text>
      </View>

      <PrimaryButton title="Start Over (Demo Reset)" variant="secondary" onPress={onStartOver} style={styles.button} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  greeting: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  warningCard: { backgroundColor: '#FEF3C7', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, borderLeftWidth: 4, borderLeftColor: colors.warning },
  warningTitle: { fontSize: 15, fontWeight: '700', color: colors.warning, marginBottom: spacing.xs },
  warningBody: { fontSize: 13, color: colors.textPrimary, lineHeight: 19 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.teal, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardRow: { fontSize: 14, color: colors.textPrimary, paddingVertical: 4, textTransform: 'capitalize' },
  button: { marginTop: spacing.lg },
});
