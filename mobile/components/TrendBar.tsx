import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';

interface Props {
  overCount: number;
  total: number;
  avg?: number;
}

export function TrendBar({ overCount, total, avg }: Props) {
  const safeTotal = total ?? 1;
  const safeOver = overCount ?? 0;
  const pct = safeTotal > 0 ? (safeOver / safeTotal) * 100 : 50;

  return (
    <View style={styles.container}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.labels}>
        <Text style={[styles.label, { color: Colors.accent }]}>OVER</Text>
        <Text style={styles.centerLabel}>
          {safeOver}/{safeTotal} OVER
        </Text>
        <Text style={[styles.label, { color: Colors.danger }]}>UNDER</Text>
      </View>
      {avg != null && (
        <Text style={styles.avg}>Avg: {avg?.toFixed?.(1) ?? '0.0'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.sm },
  barBg: {
    height: 12,
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  label: { ...Typography.small, fontWeight: '600' },
  centerLabel: { ...Typography.caption, fontWeight: '600' },
  avg: { ...Typography.caption, textAlign: 'center', marginTop: 2 },
});
