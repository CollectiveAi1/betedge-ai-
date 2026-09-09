import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/theme';
import { ResponsibleGamblingFooter } from '../../components/ResponsibleGamblingFooter';
import { useAuthStore } from '../../stores/authStore';
import { setAuthToken } from '../../services/api';

const TIER_COLORS = { free: Colors.tierFree, pro: Colors.tierPro, elite: Colors.tierElite };

export default function AccountTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s?.user);
  const logout = useAuthStore((s) => s?.logout);

  const tier = user?.subscriptionTier ?? 'free';
  const initials = (user?.name ?? 'U').split(' ').map((n) => n?.[0] ?? '').join('').toUpperCase();

  const handleLogout = async () => {
    setAuthToken(null);
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']).catch(() => {});
    logout?.();
  };

  const menuItems = [
    { label: 'Pick Tracker', icon: 'chart-line' as const, route: '/pick-tracker' },
    { label: 'Upgrade Plan', icon: 'crown' as const, route: '/upgrade' },
    { label: 'Alerts', icon: 'bell-outline' as const, route: '/alerts' },
    { label: 'Settings', icon: 'cog-outline' as const, route: '/settings' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[tier] ?? Colors.tierFree }]}>
          <Text style={styles.tierText}>{tier?.toUpperCase?.() ?? 'FREE'}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={() => router.push(item.route as never)}
          >
            <MaterialCommunityIcons name={item.icon} size={22} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      <ResponsibleGamblingFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xl },
  profile: { alignItems: 'center', paddingVertical: Spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  initials: { ...Typography.heading, color: Colors.accent },
  name: { ...Typography.heading },
  email: { ...Typography.caption, marginTop: 2 },
  tierBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tierText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
  menu: { marginHorizontal: Spacing.md, gap: Spacing.xs },
  menuItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  menuItemPressed: { opacity: 0.9 },
  menuLabel: { ...Typography.body, flex: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: BorderRadius.md,
  },
  logoutText: { ...Typography.body, color: Colors.danger, fontWeight: '600' },
});
