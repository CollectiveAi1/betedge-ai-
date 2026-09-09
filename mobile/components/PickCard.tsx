import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';
import { GradeBadge } from './GradeBadge';
import type { Pick } from '../types';
import { useParlayStore } from '../stores/parlayStore';
import { useRouter } from 'expo-router';

interface Props {
  pick: Pick;
  onSave?: (pickId: string) => void;
}

export function PickCard({ pick, onSave }: Props) {
  const router = useRouter();
  const addLeg = useParlayStore((s) => s?.addLeg);
  const isOver = pick?.recommendation === 'OVER' || pick?.recommendation === 'LEAN OVER';

  const handleAddToParlay = () => {
    const bestOdds = pick?.bookOdds?.find((o) => o?.isBest) ?? pick?.bookOdds?.[0];
    addLeg?.({
      id: `leg_${Date.now()}`,
      propId: `prop_${pick?.id ?? ''}`,
      playerName: pick?.playerName ?? '',
      team: pick?.team ?? '',
      statType: pick?.statType ?? '',
      line: pick?.line ?? 0,
      recommendation: pick?.recommendation ?? 'OVER',
      grade: pick?.grade ?? 'C',
      confidence: pick?.confidence ?? 0,
      odds: bestOdds?.odds ?? -110,
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/prop/prop_${pick?.id ?? ''}`)}
      accessibilityRole="button"
      accessibilityLabel={`${pick?.playerName ?? ''} ${pick?.statType ?? ''} pick`}
    >
      <View style={styles.topRow}>
        <Text style={styles.sportEmoji}>{pick?.sportEmoji ?? '🏈'}</Text>
        <Text style={styles.gameInfo}>{pick?.gameInfo ?? ''}</Text>
        <GradeBadge grade={pick?.grade ?? 'C'} confidence={pick?.confidence} size="sm" />
      </View>

      <Text style={styles.playerName}>{pick?.playerName ?? 'Unknown Player'}</Text>
      <Text style={styles.team}>{pick?.team ?? ''}</Text>

      <View style={styles.statRow}>
        <Text style={styles.statText}>
          {pick?.statType ?? ''} O/U {pick?.line ?? 0}
        </Text>
        <View style={[styles.recChip, { backgroundColor: isOver ? Colors.accent : Colors.danger }]}>
          <Text style={styles.recText}>{pick?.recommendation ?? ''}</Text>
        </View>
      </View>

      <Text style={styles.edge} numberOfLines={1}>
        {pick?.edgeSummary ?? ''}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => onSave?.(pick?.id ?? '')}
          accessibilityLabel="Save pick"
        >
          <MaterialCommunityIcons
            name={pick?.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={pick?.isSaved ? Colors.accent : Colors.textMuted}
          />
          <Text style={styles.actionText}>Save</Text>
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={handleAddToParlay}
          accessibilityLabel="Add to parlay"
        >
          <MaterialCommunityIcons name="layers-plus" size={20} color={Colors.textMuted} />
          <Text style={styles.actionText}>Parlay</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows,
  },
  cardPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  sportEmoji: { fontSize: 18, marginRight: Spacing.sm },
  gameInfo: { ...Typography.caption, flex: 1 },
  playerName: { ...Typography.subheading, marginBottom: 2 },
  team: { ...Typography.caption, marginBottom: Spacing.sm },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  statText: { ...Typography.body, flex: 1 },
  recChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  recText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
  edge: { ...Typography.caption, fontStyle: 'italic', marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { ...Typography.caption },
});
