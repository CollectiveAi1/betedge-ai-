import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { GradeColors, Colors, Typography } from '../constants/theme';
import type { Grade } from '../types';

interface Props {
  grade: Grade;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

const SIZES = { sm: 28, md: 40, lg: 56 };
const FONT_SIZES = { sm: 12, md: 18, lg: 26 };

export function GradeBadge({ grade, confidence, size = 'md', style }: Props) {
  const dim = SIZES[size] ?? SIZES.md;
  const fontSize = FONT_SIZES[size] ?? FONT_SIZES.md;
  const color = GradeColors[grade] ?? Colors.textMuted;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.badge, { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: color }]}>
        <Text style={[styles.letter, { fontSize }]}>{grade ?? '?'}</Text>
      </View>
      {confidence != null && (
        <Text style={styles.confidence}>{confidence}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  badge: { alignItems: 'center', justifyContent: 'center' },
  letter: { color: Colors.white, fontWeight: '700' },
  confidence: { ...Typography.small, marginTop: 2, color: Colors.textMuted },
});
