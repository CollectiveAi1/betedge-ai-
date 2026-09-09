import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { ResponsibleGamblingFooter } from '../components/ResponsibleGamblingFooter';
import { getUserPicks } from '../services/api';
import type { SavedPick, PickResult } from '../types';

const RESULT_COLORS: Record<string, string> = {
  WIN: Colors.win,
  LOSS: Colors.loss,
  PUSH: Colors.push,
  PENDING: Colors.pending,
};

const FILTERS: (PickResult | 'ALL')[] = ['ALL', 'WIN', 'LOSS', 'PUSH', 'PENDING'];

export default function PickTrackerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<PickResult | 'ALL'>('ALL');

  const { data: picks, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['userPicks'],
    queryFn: getUserPicks,
  });

  const safePicks = picks ?? [];
  const filtered = filter === 'ALL' ? safePicks : safePicks.filter((p) => p?.result === filter);

  const wins = safePicks.filter((p) => p?.result === 'WIN').length;
  const losses = safePicks.filter((p) => p?.result === 'LOSS').length;
  const pushes = safePicks.filter((p) => p?.result === 'PUSH').length;
  const totalResolved = wins + losses + pushes;
  const roi = totalResolved > 0 ? ((wins - losses) / totalResolved * 100) : 0;

  const renderPick = useCallback(({ item }: { item: SavedPick }) => (
    <View style={styles.pickCard}>
      <View style={styles.pickLeft}>
        <Text style={styles.pickPlayer}>{item?.playerName ?? ''}</Text>
        <Text style={styles.pickDetail}>
          {item?.statType ?? ''} {item?.recommendation ?? ''} {item?.line ?? 0}
        </Text>
        <Text style={styles.pickDate}>{item?.date ?? ''}</Text>
      </View>
      <View style={[styles.resultBadge, { backgroundColor: RESULT_COLORS[item?.result ?? ''] ?? Colors.pending }]}>
        <Text style={styles.resultText}>{item?.result ?? 'PENDING'}</Text>
      </View>
    </View>
  ), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Pick Tracker</Text>
      </View>

      {/* ROI card */}
      <View style={styles.roiCard}>
        <Text style={[styles.roiValue, { color: roi >= 0 ? Colors.accent : Colors.danger }]}>
          {roi >= 0 ? '+' : ''}{roi?.toFixed?.(1) ?? '0.0'}% ROI
        </Text>
        <Text style={styles.roiRecord}>
          {wins}W - {losses}L - {pushes}P · {safePicks?.length ?? 0} total
        </Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f} style={[styles.filterBtn, filter === f && styles.filterBtnActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderPick}
        keyExtractor={(item) => item?.id ?? String(Math.random())}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.accent} />}
        ListFooterComponent={<ResponsibleGamblingFooter />}
        ListEmptyComponent={
          <View style={styles.empty}><Text style={styles.emptyText}>No picks found.</Text></View>
        }
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backBtn: { marginRight: Spacing.sm },
  headerTitle: { ...Typography.heading },
  roiCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  roiValue: { ...Typography.display },
  roiRecord: { ...Typography.caption, marginTop: Spacing.xs },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.xs, marginBottom: Spacing.md },
  filterBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { ...Typography.small, fontWeight: '600', color: Colors.textMuted },
  filterTextActive: { color: Colors.white },
  pickCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickLeft: { flex: 1 },
  pickPlayer: { ...Typography.body, fontWeight: '600' },
  pickDetail: { ...Typography.caption, marginTop: 2 },
  pickDate: { ...Typography.small, marginTop: 2 },
  resultBadge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  resultText: { color: Colors.white, fontWeight: '700', fontSize: 11 },
  empty: { padding: Spacing.xl, alignItems: 'center' },
  emptyText: { ...Typography.body, color: Colors.textMuted },
});
