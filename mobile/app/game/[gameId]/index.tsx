import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, BorderRadius, Typography } from '../../../constants/theme';
import { OddsStrip } from '../../../components/OddsStrip';
import { GradeBadge } from '../../../components/GradeBadge';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { ResponsibleGamblingFooter } from '../../../components/ResponsibleGamblingFooter';
import { getGameDetail, getPropsForGame } from '../../../services/api';
import type { PlayerProp } from '../../../types';

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.section}>
      <Pressable style={styles.sectionHeader} onPress={() => setOpen(!open)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textMuted} />
      </Pressable>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

export default function GameDetailScreen() {
  const { gameId = '' } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: game, isLoading: loadingGame } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGameDetail(gameId),
    enabled: !!gameId,
  });

  const { data: props, isLoading: loadingProps, refetch, isRefetching } = useQuery({
    queryKey: ['gameProps', gameId],
    queryFn: () => getPropsForGame(gameId),
    enabled: !!gameId,
  });

  const safeProps = props ?? [];

  // Mock odds for spread/moneyline/total
  const mockOdds = [
    { book: 'FanDuel', odds: -110 },
    { book: 'DraftKings', odds: -108, isBest: true },
    { book: 'BetMGM', odds: -115 },
    { book: 'Caesars', odds: -112 },
  ];

  if (loadingGame) return <LoadingSkeleton count={4} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Game Detail</Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.accent} />}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{game?.sportEmoji ?? '🏈'}</Text>
          <Text style={styles.awayTeam}>{game?.awayTeam ?? 'Away'}</Text>
          <Text style={styles.atText}>@</Text>
          <Text style={styles.homeTeam}>{game?.homeTeam ?? 'Home'}</Text>
          <Text style={styles.gameTime}>{game?.gameTime ?? ''}</Text>
          {game?.venue && <Text style={styles.venue}>{game.venue}</Text>}
        </View>

        <CollapsibleSection title="Spread">
          <Text style={styles.marketLabel}>{game?.spread ?? 'Pick'}</Text>
          <OddsStrip odds={mockOdds} />
        </CollapsibleSection>

        <CollapsibleSection title="Moneyline">
          <View style={styles.mlRow}>
            <Text style={styles.mlTeam}>{game?.awayTeam ?? 'Away'}</Text>
            <Text style={styles.mlTeam}>{game?.homeTeam ?? 'Home'}</Text>
          </View>
          <OddsStrip odds={mockOdds} />
        </CollapsibleSection>

        <CollapsibleSection title="Total (O/U)">
          <Text style={styles.marketLabel}>O/U {game?.overUnder ?? '--'}</Text>
          <OddsStrip odds={mockOdds} />
        </CollapsibleSection>

        <CollapsibleSection title={`Player Props (${safeProps?.length ?? 0})`} defaultOpen={!loadingProps}>
          {loadingProps ? <LoadingSkeleton count={3} /> : safeProps.map((prop: PlayerProp) => (
            <Pressable
              key={prop?.id ?? ''}
              style={styles.propRow}
              onPress={() => router.push(`/prop/${prop?.id ?? ''}`)}
            >
              <View style={styles.propLeft}>
                <Text style={styles.propPlayer}>{prop?.playerName ?? ''}</Text>
                <Text style={styles.propStat}>{prop?.statType ?? ''} O/U {prop?.line ?? 0}</Text>
              </View>
              <GradeBadge grade={prop?.grade ?? 'C'} size="sm" />
              <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
            </Pressable>
          ))}
        </CollapsibleSection>

        <ResponsibleGamblingFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backBtn: { marginRight: Spacing.sm },
  headerTitle: { ...Typography.heading },
  hero: { alignItems: 'center', paddingVertical: Spacing.lg },
  heroEmoji: { fontSize: 32, marginBottom: Spacing.sm },
  awayTeam: { ...Typography.heading },
  atText: { ...Typography.caption, marginVertical: 4 },
  homeTeam: { ...Typography.heading },
  gameTime: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.sm },
  venue: { ...Typography.caption, marginTop: 2 },
  section: { marginHorizontal: Spacing.md, marginBottom: Spacing.sm, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  sectionTitle: { ...Typography.subheading },
  sectionBody: { paddingBottom: Spacing.md },
  marketLabel: { ...Typography.body, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  mlRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  mlTeam: { ...Typography.body, fontWeight: '600' },
  propRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  propLeft: { flex: 1 },
  propPlayer: { ...Typography.body, fontWeight: '600' },
  propStat: { ...Typography.caption },
});
