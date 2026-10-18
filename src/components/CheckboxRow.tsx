import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export const CheckboxRow: React.FC<Props> = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.check}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    backgroundColor: colors.surface,
  },
  boxChecked: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  check: { color: colors.white, fontSize: 14, fontWeight: '700' },
  label: { flex: 1, fontSize: 15, color: colors.textPrimary },
});
