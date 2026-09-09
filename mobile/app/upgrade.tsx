import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { ResponsibleGamblingFooter } from '../components/ResponsibleGamblingFooter';
import { getCheckoutUrl } from '../services/api';
import { notify } from '../utils/notify';

interface TierCardProps {
  name: string;
  price: string;
  features: string[];
  borderColor: string;
  badge?: string;
  badgeColor?: string;
  onSubscribe?: () => void;
}

function TierCard({ name, price, features, borderColor, badge, badgeColor, onSubscribe }: TierCardProps) {
  return (
    <View style={[styles.tierCard, { borderColor }]}>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badgeColor ?? Colors.accent }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Text style={styles.tierName}>{name}</Text>
      <Text style={styles.tierPrice}>{price}</Text>
      {(features ?? []).map((f, i) => (
        <View key={i} style={styles.featureRow}>
          <MaterialCommunityIcons name="check" size={16} color={Colors.accent} />
          <Text style={styles.featureText}>{f}</Text>
        </View>
      ))}
      {onSubscribe && (
        <Pressable style={[styles.subscribeBtn, { backgroundColor: borderColor }]} onPress={onSubscribe}>
          <Text style={styles.subscribeBtnText}>Subscribe</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function UpgradeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubscribe = async (tier: string) => {
    try {
      // Plan ids match the web checkout route's price map.
      const url = await getCheckoutUrl(tier === 'elite' ? 'elite-monthly' : 'pro-monthly');
      if (url) {
        await WebBrowser.openBrowserAsync(url).catch(() => {});
      } else {
        notify('Checkout is not available right now. Please try again later.', 'Upgrade');
      }
    } catch {
      notify('Could not start checkout. Please try again.', 'Upgrade');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Upgrade</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        <TierCard
          name="Free"
          price="$0"
          borderColor={Colors.tierFree}
          features={[
            '5 picks per day',
            '5 prop views per day',
            '2-leg parlay max',
            'Preview analysis only',
          ]}
        />
        <TierCard
          name="Pro"
          price="$9.99/mo"
          borderColor={Colors.tierPro}
          badge="Most Popular"
          badgeColor={Colors.tierPro}
          features={[
            'Unlimited picks',
            'Full AI analysis',
            '5-book odds comparison',
            '3 active alerts',
            'Pick tracker + ROI',
          ]}
          onSubscribe={() => handleSubscribe('pro')}
        />
        <TierCard
          name="Elite"
          price="$19.99/mo"
          borderColor={Colors.tierElite}
          badge="Best Value"
          badgeColor={Colors.tierElite}
          features={[
            'Everything in Pro',
            'Early access picks (2hr)',
            '10+ books odds comparison',
            'Unlimited alerts',
            'Advanced ROI analytics',
          ]}
          onSubscribe={() => handleSubscribe('elite')}
        />

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
  tierCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  badgeText: { color: Colors.white, fontWeight: '700', fontSize: 11 },
  tierName: { ...Typography.heading, marginBottom: 4 },
  tierPrice: { ...Typography.display, marginBottom: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  featureText: { ...Typography.body, color: Colors.textSecondary },
  subscribeBtn: {
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  subscribeBtnText: { ...Typography.body, fontWeight: '700', color: Colors.white },
});
