import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { PaywallBanner } from '../components/PaywallBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ResponsibleGamblingFooter } from '../components/ResponsibleGamblingFooter';
import { useAuthStore } from '../stores/authStore';
import { getAlerts } from '../services/api';
import type { Alert as AlertType } from '../types';

export default function AlertsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tier = useAuthStore((s) => s?.user?.subscriptionTier ?? 'free');

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: getAlerts,
  });

  const safeAlerts = alerts ?? [];
  const isFree = tier === 'free';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Alerts</Text>
      </View>

      {isFree ? (
        <View style={styles.paywallContainer}>
          <PaywallBanner message="Alerts are a Pro feature" />
        </View>
      ) : isLoading ? (
        <LoadingSkeleton count={3} />
      ) : (
        <FlatList
          data={safeAlerts}
          keyExtractor={(item) => item?.id ?? String(Math.random())}
          renderItem={({ item }: { item: AlertType }) => (
            <View style={styles.alertCard}>
              <Text style={styles.alertIcon}>
                {item?.type === 'injury' ? '🏥' : '📉'}
              </Text>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{item?.title ?? ''}</Text>
                <Text style={styles.alertDesc}>{item?.description ?? ''}</Text>
                <Text style={styles.alertTime}>{item?.timestamp ?? ''}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="bell-off-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No alerts yet. We'll notify you of line movements and injuries.</Text>
            </View>
          }
          ListFooterComponent={<ResponsibleGamblingFooter />}
          contentContainerStyle={{ paddingBottom: Spacing.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  backBtn: { marginRight: Spacing.sm },
  headerTitle: { ...Typography.heading },
  paywallContainer: { flex: 1, justifyContent: 'center' },
  alertCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
  },
  alertIcon: { fontSize: 24, marginRight: Spacing.sm },
  alertContent: { flex: 1 },
  alertTitle: { ...Typography.body, fontWeight: '600' },
  alertDesc: { ...Typography.caption, marginTop: 4, color: Colors.textSecondary },
  alertTime: { ...Typography.small, marginTop: 4 },
  empty: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.md },
  emptyText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
});
