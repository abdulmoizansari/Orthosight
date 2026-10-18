import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, spacing, typography, radius } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenWrapper scroll={false}>
      <View style={styles.top}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>O</Text>
        </View>
        <Text style={styles.brand}>OrthoSight</Text>
        <Text style={styles.tagline}>
          AI-powered home physical rehabilitation
        </Text>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.heading}>Let us begin your recovery</Text>
        <Text style={styles.body}>
          We will ask a few questions about your health and rehabilitation goals
          so we can recommend safe exercises for you.
        </Text>

        <PrimaryButton
          title="Get Started"
          onPress={() => navigation.navigate('BasicProfile')}
          style={styles.button}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  top: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: { color: colors.white, fontSize: 44, fontWeight: '700' },
  brand: { ...typography.h1, color: colors.navy, marginBottom: spacing.xs },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  bottom: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  button: { marginTop: spacing.sm },
});
