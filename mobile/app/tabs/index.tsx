import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { SportFilterTabs } from '../../components/SportFilterTabs';
import { PickCard } from '../../components/PickCard';
import { PaywallBanner } from '../../components/PaywallBanner';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ResponsibleGamblingFooter } from '../../components/ResponsibleGamblingFooter';
import { useFilterStore } from '../../stores/filterStore';
import { useAuthStore } from '../../stores/authStore';
import { getPicks, savePick } from '../../services/api';
import type { Pick } from '../../types';

export default function TodayTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const selectedSport = useFilterStore((s) => s?.selectedSport ?? 'ALL');
  const tier = useAuthStore((s) => s?.user?.subscriptionTier ?? 'free');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const { data: picks, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['picks', selectedSport],
    queryFn: () => getPicks(selectedSport),
  });

  const safePicks = picks ?? [];
  const FREE_LIMIT = 5;
  const isFreeTier = tier === 'free';

  const handleSave = useCallback(async (pickId: string) => {
    await savePick(pickId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.add(pickId);
      return next;
    });
  }, []);

  const renderItem = useCallback(({ item, index }: { item: Pick; index: number }) => {
    if (isFreeTier && index >= FREE_LIMIT) {
      if (index === FREE_LIMIT) {
        return <PaywallBanner message="Unlock all picks with Pro" />;
      }
      return null;
    }
    return (
      <PickCard
        pick={{ ...(item ?? {}), isSaved: savedIds.has(item?.id ?? '') } as Pick}
        onSave={handleSave}
      />
    );
  }, [isFreeTier, savedIds, handleSave]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Picks</Text>
        <Pressable onPress={() => router.push('/alerts')} accessibilityLabel="View alerts">
          <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <SportFilterTabs />

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : safePicks.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="emoticon-sad-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No picks available for this sport today.</Text>
        </View>
      ) : (
        <FlashList
          data={isFreeTier ? safePicks.slice(0, FREE_LIMIT + 1) : safePicks}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id ?? String(Math.random())}
          contentContainerStyle={{ paddingBottom: Spacing.lg }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.accent}
              colors={[Colors.accent]}
            />
          }
          ListFooterComponent={<ResponsibleGamblingFooter />}
        />
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
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  emptyText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
});
