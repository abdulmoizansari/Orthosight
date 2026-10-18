import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  gender: 'male' | 'female';
  selectedParts: string[];
  onTogglePart: (partId: string) => void;
}

const BODY_PARTS = [
  { id: 'head_neck', label: 'Head & Neck' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'chest', label: 'Chest / Upper Back' },
  { id: 'arms', label: 'Arms & Elbows' },
  { id: 'lower_back', label: 'Lower Back / Abdomen' },
  { id: 'hips', label: 'Hips / Pelvis' },
  { id: 'thighs', label: 'Thighs' },
  { id: 'knees', label: 'Knees' },
  { id: 'calves', label: 'Calves / Shins' },
  { id: 'feet', label: 'Ankles & Feet' },
];

export const InteractiveBodyMap: React.FC<Props> = ({
  gender,
  selectedParts,
  onTogglePart,
}) => {
  const getFill = (partId: string) => {
    return selectedParts.includes(partId) ? colors.teal : '#D1D5DB'; // Light grey if unselected
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg viewBox="0 0 200 400" width="100%" height="100%">
          {/* Head */}
          <G onPress={() => onTogglePart('head_neck')}>
            <Circle cx="100" cy="40" r="22" fill={getFill('head_neck')} />
            <Path d="M90,60 L90,75 L110,75 L110,60 Z" fill={getFill('head_neck')} />
          </G>

          {/* Shoulders */}
          <G onPress={() => onTogglePart('shoulders')}>
            <Path d="M65,75 Q80,65 100,70 Q120,65 135,75 Q120,90 100,85 Q80,90 65,75 Z" fill={getFill('shoulders')} />
          </G>

          {/* Chest / Torso */}
          <G onPress={() => onTogglePart('chest')}>
            <Path d="M75,90 L125,90 L115,150 L85,150 Z" fill={getFill('chest')} />
          </G>

          {/* Arms */}
          <G onPress={() => onTogglePart('arms')}>
            <Path d="M65,75 L50,140 L60,145 L75,90 Z" fill={getFill('arms')} />
            <Path d="M135,75 L150,140 L140,145 L125,90 Z" fill={getFill('arms')} />
          </G>

          {/* Abdomen / Lower Back */}
          <G onPress={() => onTogglePart('lower_back')}>
            <Path d="M85,150 L115,150 L110,200 L90,200 Z" fill={getFill('lower_back')} />
          </G>

          {/* Hips */}
          <G onPress={() => onTogglePart('hips')}>
            <Path d="M90,200 L110,200 L120,220 L80,220 Z" fill={getFill('hips')} />
          </G>

          {/* Thighs */}
          <G onPress={() => onTogglePart('thighs')}>
            <Path d="M80,220 L95,220 L92,280 L75,280 Z" fill={getFill('thighs')} />
            <Path d="M105,220 L120,220 L125,280 L108,280 Z" fill={getFill('thighs')} />
          </G>

          {/* Knees */}
          <G onPress={() => onTogglePart('knees')}>
            <Circle cx="83.5" cy="290" r="10" fill={getFill('knees')} />
            <Circle cx="116.5" cy="290" r="10" fill={getFill('knees')} />
          </G>

          {/* Calves */}
          <G onPress={() => onTogglePart('calves')}>
            <Path d="M75,300 L92,300 L88,360 L78,360 Z" fill={getFill('calves')} />
            <Path d="M108,300 L125,300 L122,360 L112,360 Z" fill={getFill('calves')} />
          </G>

          {/* Feet */}
          <G onPress={() => onTogglePart('feet')}>
            <Path d="M78,360 L88,360 L85,380 L75,380 Z" fill={getFill('feet')} />
            <Path d="M112,360 L122,360 L125,380 L115,380 Z" fill={getFill('feet')} />
          </G>
        </Svg>
      </View>

      <View style={styles.legendContainer}>
        {BODY_PARTS.map((part) => {
          const isSelected = selectedParts.includes(part.id);
          return (
            <TouchableOpacity
              key={part.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onTogglePart(part.id)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {part.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  svgContainer: { width: 280, height: 380, marginVertical: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 10 },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  chipText: { fontSize: 12, color: colors.textSecondary },
  chipTextActive: { color: colors.white, fontWeight: 'bold' },
});
