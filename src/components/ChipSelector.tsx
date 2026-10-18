import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface Props {
  options: { label: string; value: string }[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multi?: boolean;
}

export const ChipSelector: React.FC<Props> = ({
  options,
  selected,
  onSelect,
  multi = false,
}) => {
  const isSelected = (val: string) =>
    multi
      ? Array.isArray(selected) && selected.includes(val)
      : selected === val;

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = isSelected(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: { color: colors.white, fontWeight: '700' },
});
