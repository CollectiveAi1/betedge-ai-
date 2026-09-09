import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { ResponsibleGamblingFooter } from '../components/ResponsibleGamblingFooter';
import { useAuthStore } from '../stores/authStore';
import { setAuthToken } from '../services/api';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s?.user);
  const logout = useAuthStore((s) => s?.logout);
  const tier = user?.subscriptionTier ?? 'free';

  const [pushEnabled, setPushEnabled] = useState(false);
  const [dailyAlert, setDailyAlert] = useState(false);
  const [lineAlert, setLineAlert] = useState(false);

  const handlePushToggle = async (val: boolean) => {
    if (val && Platform.OS !== 'web') {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setPushEnabled(true);
          // Would register push token with backend
        } else {
          setPushEnabled(false);
        }
      } catch {
        setPushEnabled(false);
      }
    } else {
      setPushEnabled(val);
    }
  };

  const handleLogout = async () => {
    setAuthToken(null);
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']).catch(() => {});
    logout?.();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        <Text style={styles.sectionLabel}>Notifications</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={handlePushToggle}
            trackColor={{ false: Colors.surfaceLight, true: Colors.accent }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.settingText, !pushEnabled && styles.disabled]}>Daily Top Picks Alert</Text>
          <Switch
            value={dailyAlert}
            onValueChange={setDailyAlert}
            disabled={!pushEnabled}
            trackColor={{ false: Colors.surfaceLight, true: Colors.accent }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextRow}>
            <Text style={[styles.settingText, tier === 'free' && styles.disabled]}>Line Movement Alerts</Text>
            {tier === 'free' && (
              <MaterialCommunityIcons name="lock" size={16} color={Colors.textMuted} />
            )}
          </View>
          <Switch
            value={lineAlert}
            onValueChange={setLineAlert}
            disabled={tier === 'free'}
            trackColor={{ false: Colors.surfaceLight, true: Colors.accent }}
          />
        </View>

        <Text style={styles.sectionLabel}>Account</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Email</Text>
          <Text style={styles.settingValue}>{user?.email ?? ''}</Text>
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>BetEdge AI v1.0.0</Text>

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
  sectionLabel: { ...Typography.subheading, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingText: { ...Typography.body },
  settingTextRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  settingValue: { ...Typography.body, color: Colors.textMuted },
  disabled: { color: Colors.textDisabled },
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
  version: { ...Typography.caption, textAlign: 'center', marginTop: Spacing.lg, color: Colors.textDisabled },
});
