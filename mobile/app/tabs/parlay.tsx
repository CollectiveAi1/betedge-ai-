import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography, FontSize } from '../../constants/theme';
import { GradeBadge } from '../../components/GradeBadge';
import { ResponsibleGamblingFooter } from '../../components/ResponsibleGamblingFooter';
import { PaywallBanner } from '../../components/PaywallBanner';
import { useParlayStore } from '../../stores/parlayStore';
import { useAuthStore } from '../../stores/authStore';
import { saveParlay } from '../../services/api';
import { notify } from '../../utils/notify';
import type { ParlayLeg } from '../../types';

function americanToDecimal(odds: number): number {
  if (odds == null || odds === 0) return 1;
  return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
}

export default function ParlayTab() {
  const insets = useSafeAreaInsets();
  const legs = useParlayStore((s) => s?.legs ?? []);
  const removeLeg = useParlayStore((s) => s?.removeLeg);
  const clearAll = useParlayStore((s) => s?.clearAll);
  const tier = useAuthStore((s) => s?.user?.subscriptionTier ?? 'free');
  const [wager, setWager] = useState('10');

  const FREE_LEG_LIMIT = 2;
  const isFreeTier = tier === 'free';
  const atLimit = isFreeTier && (legs?.length ?? 0) >= FREE_LEG_LIMIT;

  const combinedDecimal = (legs ?? []).reduce(
    (acc, leg) => acc * americanToDecimal(leg?.odds ?? -110),
    1
  );
  const combinedAmerican = combinedDecimal >= 2
    ? Math.round((combinedDecimal - 1) * 100)
    : Math.round(-100 / (combinedDecimal - 1));
  const wagerNum = parseFloat(wager) || 0;
  const payout = (wagerNum * combinedDecimal);

  const handleSave = async () => {
    if ((legs?.length ?? 0) < 2) {
      notify('Add at least 2 legs to save a parlay.', 'Parlay');
      return;
    }
    try {
      await saveParlay(legs, combinedAmerican);
      notify('Parlay saved successfully!', 'Success');
    } catch {
      notify('Could not save your parlay. Please try again.', 'Parlay');
    }
  };

  const renderLeg = useCallback(({ item }: { item: ParlayLeg }) => (
    <View style={styles.legCard}>
      <View style={styles.legInfo}>
        <Text style={styles.legPlayer}>{item?.playerName ?? ''}</Text>
        <Text style={styles.legDetails}>
          {item?.statType ?? ''} {item?.recommendation ?? ''} {item?.line ?? 0}
        </Text>
      </View>
      <GradeBadge grade={item?.grade ?? 'C'} size="sm" />
      <Pressable style={styles.removeBtn} onPress={() => removeLeg?.(item?.id ?? '')}>
        <MaterialCommunityIcons name="close-circle" size={22} color={Colors.danger} />
      </Pressable>
    </View>
  ), [removeLeg]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Parlay Builder</Text>
        {(legs?.length ?? 0) > 0 && (
          <Pressable onPress={() => clearAll?.()}>
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {(legs?.length ?? 0) === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="layers-plus" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyText}>Add picks from Today or Props to build your parlay.</Text>
        </View>
      ) : (
        <FlatList
          data={legs}
          renderItem={renderLeg}
          keyExtractor={(item) => item?.id ?? String(Math.random())}
          contentContainerStyle={{ paddingBottom: 200 }}
          ListFooterComponent={
            <>
              {atLimit && <PaywallBanner message="Add more legs with Pro" />}
              <ResponsibleGamblingFooter />
            </>
          }
        />
      )}

      {(legs?.length ?? 0) > 0 && (
        <View style={[styles.summary, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{legs?.length ?? 0} Legs</Text>
            <Text style={styles.summaryOdds}>
              {combinedAmerican > 0 ? '+' : ''}{combinedAmerican}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.wagerRow}>
              <Text style={styles.wagerLabel}>$</Text>
              <TextInput
                style={styles.wagerInput}
                value={wager}
                onChangeText={setWager}
                keyboardType="numeric"
                accessibilityLabel="Wager amount"
              />
            </View>
            <Text style={styles.payoutText}>
              Payout: ${payout?.toFixed?.(2) ?? '0.00'}
            </Text>
          </View>
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Parlay</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  title: { ...Typography.heading },
  clearText: { ...Typography.caption, color: Colors.danger },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  emptyText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
  legCard: {
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
  legInfo: { flex: 1 },
  legPlayer: { ...Typography.body, fontWeight: '600' },
  legDetails: { ...Typography.caption, marginTop: 2 },
  removeBtn: { marginLeft: Spacing.sm },
  summary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  summaryLabel: { ...Typography.body, fontWeight: '600' },
  summaryOdds: { ...Typography.heading, color: Colors.accent },
  wagerRow: { flexDirection: 'row', alignItems: 'center' },
  wagerLabel: { ...Typography.body, fontWeight: '600', marginRight: 4 },
  wagerInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    width: 80,
  },
  payoutText: { ...Typography.body, fontWeight: '600', color: Colors.accent },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
  },
  saveBtnText: { ...Typography.body, fontWeight: '700', color: Colors.white },
});
