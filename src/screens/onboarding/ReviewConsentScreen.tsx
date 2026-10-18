import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, typography, radius } from '../../theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { CheckboxRow } from '../../components/CheckboxRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ProgressBar } from '../../components/ProgressBar';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewConsent'>;

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || '—'}</Text>
  </View>
);

export const ReviewConsentScreen: React.FC<Props> = ({ navigation }) => {
  const { data, markComplete } = useOnboardingStore();
  const [privacy, setPrivacy] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onComplete = () => {
    markComplete();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const canContinue = privacy && processing;

  return (
    <ScreenWrapper>
      <ProgressBar current={6} total={6} />
      <Text style={styles.stepLabel}>Step 6 of 6</Text>
      <Text style={styles.title}>Review & Consent</Text>
      <Text style={styles.subtitle}>
        Please review your information before we finalize your profile.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic Profile</Text>
        <Row label="Name" value={data.fullName ?? ''} />
        <Row label="Date of Birth" value={data.dateOfBirth ?? ''} />
        <Row label="Gender" value={(data.gender ?? '').replace(/_/g, ' ')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rehabilitation Goals</Text>
        <Row label="Reason" value={data.rehabReason ?? ''} />
        <Row label="Affected Region" value={(data.affectedRegion ?? '').replace(/_/g, ' ')} />
        <Row label="Injury / Procedure" value={data.injuryOrProcedure ?? ''} />
        <Row label="Stage" value={data.rehabStage ?? ''} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medical History</Text>
        <Row label="Surgeries" value={(data.surgeries ?? []).join(', ')} />
        <Row label="Implants" value={(data.implants ?? []).join(', ')} />
        <Row label="Chronic Conditions" value={(data.chronicConditions ?? []).join(', ')} />
        <Row label="Medications" value={(data.medications ?? []).join(', ')} />
        <Row label="Clinician Restrictions" value={data.clinicianRestrictions ?? ''} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pain & Mobility</Text>
        {/* FIXED: Changed painLocations to bodyParts */}
        <Row label="Pain Areas (Body Map)" value={(data.bodyParts ?? []).join(', ').replace(/_/g, ' ')} />
        <Row label="Pain Level" value={`${data.painLevel ?? 0} / 10`} />
        <Row label="Mobility Limitations" value={data.mobilityLimitations ?? ''} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Safety Flags</Text>
        {(data.safetyFlags ?? []).length === 0 ? (
          <Text style={styles.safeText}>No red flags reported.</Text>
        ) : (
          <>
            <Text style={styles.flagText}>
              {data.safetyFlags!.length} flag(s) reported. A clinician should
              review your profile before exercises are unlocked.
            </Text>
            {data.safetyFlags!.map((f) => (
              <Text key={f} style={styles.flagItem}>
                • {f}
              </Text>
            ))}
          </>
        )}
      </View>

      <View style={styles.consentSection}>
        <Text style={styles.cardTitle}>Consent</Text>
        <CheckboxRow
          label="I have read and accept the Privacy Policy."
          checked={privacy}
          onToggle={() => setPrivacy((v) => !v)}
        />
        <CheckboxRow
          label="I consent to my structured data being processed. Raw video is never uploaded."
          checked={processing}
          onToggle={() => setProcessing((v) => !v)}
        />
      </View>

      <PrimaryButton
        title="Complete Setup"
        onPress={onComplete}
        disabled={!canContinue}
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
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.teal, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  rowValue: { fontSize: 13, color: colors.textPrimary, fontWeight: '500', flex: 1, textAlign: 'right', textTransform: 'capitalize' },
  safeText: { fontSize: 14, color: colors.success, fontWeight: '600' },
  flagText: { fontSize: 13, color: colors.warning, fontWeight: '600', marginBottom: spacing.sm },
  flagItem: { fontSize: 13, color: colors.textSecondary, marginLeft: 8 },
  consentSection: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm },
  button: { marginTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});
