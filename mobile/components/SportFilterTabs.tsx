import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { useFilterStore } from '../stores/filterStore';
import type { Sport } from '../types';

const SPORTS: Sport[] = ['ALL', 'NFL', 'NBA', 'MLB', 'NCAAF', 'NCAAB'];

export function SportFilterTabs() {
  const selectedSport = useFilterStore((s) => s?.selectedSport ?? 'ALL');
  const setSelectedSport = useFilterStore((s) => s?.setSelectedSport);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SPORTS.map((sport) => {
        const isActive = selectedSport === sport;
        return (
          <Pressable
            key={sport}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => setSelectedSport?.(sport)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${sport}`}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {sport}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.transparent,
  },
  tabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  tabText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.white,
  },
});
