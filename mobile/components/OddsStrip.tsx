import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import type { BookOdds } from '../types';

interface Props {
  odds: BookOdds[];
}

function formatOdds(num: number): string {
  if (num == null) return '--';
  return num > 0 ? `+${num}` : `${num}`;
}

export function OddsStrip({ odds }: Props) {
  const safeOdds = odds ?? [];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {safeOdds.map((o, i) => (
        <View key={`${o?.book ?? i}_${i}`} style={[styles.chip, o?.isBest && styles.chipBest]}>
          <Text style={[styles.book, o?.isBest && styles.bookBest]}>{o?.book ?? ''}</Text>
          <Text style={[styles.odds, o?.isBest && styles.oddsBest]}>{formatOdds(o?.odds ?? 0)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minWidth: 80,
  },
  chipBest: { borderColor: Colors.accent },
  book: { ...Typography.small, color: Colors.textMuted },
  bookBest: { color: Colors.accent },
  odds: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary },
  oddsBest: { color: Colors.accent },
});
