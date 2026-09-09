import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, BorderRadius, Typography } from '../../../constants/theme';
import { GradeBadge } from '../../../components/GradeBadge';
import { OddsStrip } from '../../../components/OddsStrip';
import { TrendBar } from '../../../components/TrendBar';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { ResponsibleGamblingFooter } from '../../../components/ResponsibleGamblingFooter';
import { useParlayStore } from '../../../stores/parlayStore';
import { getPropDetail, savePick } from '../../../services/api';

function AccordionSection({ title, icon, iconColor, children, defaultOpen = true }: {
  title: string; icon: string; iconColor: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.accordion}>
      <Pressable style={styles.accordionHeader} onPress={() => setOpen(!open)}>
        <Text style={styles.accordionIcon}>{icon}</Text>
        <Text style={[styles.accordionTitle, { color: iconColor }]}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textMuted} />
      </Pressable>
      {open && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

export default function PropDetailScreen() {
  const { propId = '' } = useLocalSearchParams<{ propId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addLeg = useParlayStore((s) => s?.addLeg);

  const { data: prop, isLoading } = useQuery({
    queryKey: ['prop', propId],
    queryFn: () => getPropDetail(propId),
    enabled: !!propId,
  });

  const isOver = prop?.recommendation === 'OVER' || prop?.recommendation === 'LEAN OVER';

  const handleSave = async () => {
    await savePick(propId);
    const msg = 'Pick saved!';
    if (Platform.OS === 'web') { window.alert(msg); } else { Alert.alert('Saved', msg); }
  };

  const handleAddToParlay = () => {
    const bestOdds = prop?.bookOdds?.find((o) => o?.isBest) ?? prop?.bookOdds?.[0];
    addLeg?.({
      id: `leg_${Date.now()}`,
      propId: prop?.id ?? '',
      playerName: prop?.playerName ?? '',
      team: prop?.team ?? '',
      statType: prop?.statType ?? '',
      line: prop?.line ?? 0,
      recommendation: prop?.recommendation ?? 'OVER',
      grade: prop?.grade ?? 'C',
      confidence: prop?.confidence ?? 0,
      odds: bestOdds?.odds ?? -110,
    });
    const msg = 'Added to parlay!';
    if (Platform.OS === 'web') { window.alert(msg); } else { Alert.alert('Parlay', msg); }
  };

  if (isLoading || !prop) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LoadingSkeleton count={4} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{prop?.playerName ?? ''}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        {/* Player header */}
        <View style={styles.playerHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {(prop?.playerName ?? 'U').split(' ').map((n) => n?.[0] ?? '').join('')}
            </Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{prop?.playerName ?? ''}</Text>
            <Text style={styles.playerTeam}>{prop?.team ?? ''} · {prop?.position ?? ''}</Text>
          </View>
        </View>

        {/* Grade section */}
        <View style={styles.gradeSection}>
          <GradeBadge grade={prop?.grade ?? 'C'} confidence={prop?.confidence} size="lg" />
          <View style={styles.recContainer}>
            <View style={[styles.recChip, { backgroundColor: isOver ? Colors.accent : Colors.danger }]}>
              <Text style={styles.recText}>{prop?.recommendation ?? ''}</Text>
            </View>
            <Text style={styles.lineText}>{prop?.statType ?? ''} {prop?.line ?? 0}</Text>
          </View>
        </View>

        {/* Odds Strip */}
        <View style={styles.oddsSection}>
          <Text style={styles.oddsSectionTitle}>Odds Comparison</Text>
          <OddsStrip odds={prop?.bookOdds ?? []} />
        </View>

        {/* Key Factors */}
        <AccordionSection title="Key Factors" icon="✅" iconColor={Colors.accent}>
          {(prop?.keyFactors ?? []).map((f, i) => (
            <View key={i} style={styles.factorRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color={Colors.accent} />
              <Text style={styles.factorText}>{f ?? ''}</Text>
            </View>
          ))}
        </AccordionSection>

        {/* Risks */}
        <AccordionSection title="Risks" icon="❌" iconColor={Colors.danger}>
          {(prop?.risks ?? []).map((r, i) => (
            <View key={i} style={styles.factorRow}>
              <MaterialCommunityIcons name="close-circle" size={18} color={Colors.danger} />
              <Text style={styles.factorText}>{r ?? ''}</Text>
            </View>
          ))}
        </AccordionSection>

        {/* Trend */}
        <AccordionSection title="Historical Trend" icon="📊" iconColor={Colors.info}>
          <View style={{ paddingHorizontal: Spacing.md }}>
            <TrendBar
              overCount={prop?.trendOverCount ?? 0}
              total={prop?.trendTotal ?? 1}
              avg={prop?.trendAvg}
            />
          </View>
        </AccordionSection>

        {/* AI Analysis */}
        <AccordionSection title="AI Analysis" icon="🤖" iconColor={Colors.info}>
          <Text style={styles.analysisText}>{prop?.aiAnalysis ?? ''}</Text>
        </AccordionSection>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable style={styles.savePickBtn} onPress={handleSave}>
            <MaterialCommunityIcons name="bookmark-plus" size={20} color={Colors.white} />
            <Text style={styles.savePickText}>Save Pick</Text>
          </Pressable>
          <Pressable style={styles.addParlayBtn} onPress={handleAddToParlay}>
            <MaterialCommunityIcons name="layers-plus" size={20} color={Colors.accent} />
            <Text style={styles.addParlayText}>Add to Parlay</Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          For entertainment purposes only. Not financial advice. Past performance does not guarantee future results.
        </Text>

        <ResponsibleGamblingFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backBtn: { marginRight: Spacing.sm },
  headerTitle: { ...Typography.heading, flex: 1 },
  playerHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...Typography.subheading, color: Colors.accent },
  playerInfo: { marginLeft: Spacing.md },
  playerName: { ...Typography.heading },
  playerTeam: { ...Typography.caption },
  gradeSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xl, paddingVertical: Spacing.md },
  recContainer: { alignItems: 'center', gap: Spacing.sm },
  recChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full },
  recText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  lineText: { ...Typography.body, fontWeight: '600' },
  oddsSection: { marginBottom: Spacing.sm },
  oddsSectionTitle: { ...Typography.subheading, paddingHorizontal: Spacing.md, marginBottom: Spacing.xs },
  accordion: { marginHorizontal: Spacing.md, marginBottom: Spacing.sm, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.sm },
  accordionIcon: { fontSize: 16 },
  accordionTitle: { ...Typography.subheading, flex: 1 },
  accordionBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  factorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  factorText: { ...Typography.body, flex: 1, color: Colors.textSecondary },
  analysisText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24 },
  actions: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  savePickBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.accent, borderRadius: BorderRadius.sm, paddingVertical: Spacing.sm + 4,
  },
  savePickText: { ...Typography.body, fontWeight: '700', color: Colors.white },
  addParlayBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderWidth: 1, borderColor: Colors.accent, borderRadius: BorderRadius.sm, paddingVertical: Spacing.sm + 4,
  },
  addParlayText: { ...Typography.body, fontWeight: '600', color: Colors.accent },
  disclaimer: { ...Typography.caption, fontStyle: 'italic', textAlign: 'center', paddingHorizontal: Spacing.lg, marginTop: Spacing.md, color: Colors.textDisabled },
});
