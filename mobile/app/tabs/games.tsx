import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/theme';
import { SportFilterTabs } from '../../components/SportFilterTabs';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ResponsibleGamblingFooter } from '../../components/ResponsibleGamblingFooter';
import { useFilterStore } from '../../stores/filterStore';
import { getGames } from '../../services/api';
import type { Game, Sport } from '../../types';

export default function GamesTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const selectedSport = useFilterStore((s) => s?.selectedSport ?? 'ALL');
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow'>('today');

  const { data: games, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['games', selectedSport, dateFilter],
    queryFn: () => getGames(selectedSport, dateFilter),
  });

  const safeGames = games ?? [];

  // Group by sport
  const sections = React.useMemo(() => {
    const grouped: Record<string, Game[]> = {};
    for (const g of safeGames) {
      const sport = g?.sport ?? 'ALL';
      if (!grouped[sport]) grouped[sport] = [];
      grouped[sport].push(g);
    }
    return Object.entries(grouped).map(([sport, data]) => ({
      title: sport,
      emoji: data?.[0]?.sportEmoji ?? '🏈',
      data,
    }));
  }, [safeGames]);

  const renderGame = useCallback(({ item }: { item: Game }) => (
    <Pressable
      style={({ pressed }) => [styles.gameCard, pressed && styles.cardPressed]}
      onPress={() => router.push(`/game/${item?.id ?? ''}`)}
    >
      <View style={styles.teams}>
        <Text style={styles.teamName}>{item?.awayTeam ?? 'TBD'}</Text>
        <Text style={styles.vs}>@</Text>
        <Text style={styles.teamName}>{item?.homeTeam ?? 'TBD'}</Text>
      </View>
      <View style={styles.gameInfo}>
        <Text style={styles.time}>{item?.gameTime ?? ''}</Text>
        {item?.spread ? <Text style={styles.spread}>{item.spread}</Text> : null}
        {item?.overUnder ? <Text style={styles.spread}>O/U {item.overUnder}</Text> : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </Pressable>
  ), [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Games</Text>

      <View style={styles.dateToggle}>
        {(['today', 'tomorrow'] as const).map((d) => (
          <Pressable
            key={d}
            style={[styles.dateBtn, dateFilter === d && styles.dateBtnActive]}
            onPress={() => setDateFilter(d)}
          >
            <Text style={[styles.dateBtnText, dateFilter === d && styles.dateBtnTextActive]}>
              {d === 'today' ? 'Today' : 'Tomorrow'}
            </Text>
          </Pressable>
        ))}
      </View>

      <SportFilterTabs />

      {isLoading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item?.id ?? String(Math.random())}
          renderItem={renderGame}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>{section?.emoji ?? ''}</Text>
              <Text style={styles.sectionTitle}>{section?.title ?? ''}</Text>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.accent} colors={[Colors.accent]} />
          }
          ListFooterComponent={<ResponsibleGamblingFooter />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No games scheduled.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: Spacing.lg }}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { ...Typography.heading, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  dateToggle: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.xs },
  dateBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
  },
  dateBtnActive: { backgroundColor: Colors.accent },
  dateBtnText: { ...Typography.caption, fontWeight: '600' },
  dateBtnTextActive: { color: Colors.white },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: { ...Typography.subheading },
  gameCard: {
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
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  teams: { flex: 1 },
  teamName: { ...Typography.body, fontWeight: '600' },
  vs: { ...Typography.caption, marginVertical: 2 },
  gameInfo: { alignItems: 'flex-end', marginRight: Spacing.sm },
  time: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  spread: { ...Typography.small },
  empty: { padding: Spacing.xl, alignItems: 'center' },
  emptyText: { ...Typography.body, color: Colors.textMuted },
});
