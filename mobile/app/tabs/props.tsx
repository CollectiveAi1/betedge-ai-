import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, BorderRadius, Typography, FontSize } from '../../constants/theme';
import { SportFilterTabs } from '../../components/SportFilterTabs';
import { GradeBadge } from '../../components/GradeBadge';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ResponsibleGamblingFooter } from '../../components/ResponsibleGamblingFooter';
import { useFilterStore } from '../../stores/filterStore';
import { getProps } from '../../services/api';
import type { PlayerProp } from '../../types';

export default function PropsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const selectedSport = useFilterStore((s) => s?.selectedSport ?? 'ALL');
  const [search, setSearch] = useState('');

  const { data: props, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['props', selectedSport],
    queryFn: () => getProps(selectedSport),
  });

  const safeProps = props ?? [];

  const filtered = useMemo(() => {
    if (!search?.trim()) return safeProps;
    const q = search.toLowerCase();
    return safeProps.filter((p) =>
      (p?.playerName ?? '').toLowerCase().includes(q) ||
      (p?.team ?? '').toLowerCase().includes(q)
    );
  }, [safeProps, search]);

  const renderItem = useCallback(({ item }: { item: PlayerProp }) => (
    <Pressable
      style={({ pressed }) => [styles.propRow, pressed && styles.rowPressed]}
      onPress={() => router.push(`/prop/${item?.id ?? ''}`)}
    >
      <View style={styles.propLeft}>
        <Text style={styles.propPlayer}>{item?.playerName ?? 'Unknown'}</Text>
        <Text style={styles.propTeam}>{item?.team ?? ''} · {item?.position ?? ''}</Text>
        <Text style={styles.propStat}>
          {item?.statType ?? ''} O/U {item?.line ?? 0}
        </Text>
      </View>
      <GradeBadge grade={item?.grade ?? 'C'} size="sm" />
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </Pressable>
  ), [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Player Props</Text>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search players..."
          placeholderTextColor={Colors.textDisabled}
          accessibilityLabel="Search player props"
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <SportFilterTabs />

      {isLoading ? (
        <LoadingSkeleton count={5} />
      ) : (
        <FlashList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id ?? String(Math.random())}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.accent} colors={[Colors.accent]} />
          }
          ListFooterComponent={<ResponsibleGamblingFooter />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No props found.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: Spacing.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { ...Typography.heading, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  propRow: {
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
  rowPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  propLeft: { flex: 1 },
  propPlayer: { ...Typography.body, fontWeight: '600' },
  propTeam: { ...Typography.small, marginTop: 2 },
  propStat: { ...Typography.caption, marginTop: 4 },
  empty: { padding: Spacing.xl, alignItems: 'center' },
  emptyText: { ...Typography.body, color: Colors.textMuted },
});
