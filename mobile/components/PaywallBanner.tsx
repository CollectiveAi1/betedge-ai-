import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { useRouter } from 'expo-router';

interface Props {
  message?: string;
}

export function PaywallBanner({ message }: Props) {
  const router = useRouter();
  const BlurWrapper = Platform.OS === 'web' ? View : BlurView;
  const blurProps = Platform.OS === 'web'
    ? { style: [styles.overlay, styles.webOverlay] }
    : { intensity: 40, tint: 'dark' as const, style: styles.overlay };

  return (
    <BlurWrapper {...blurProps}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="lock" size={32} color={Colors.accent} />
        <Text style={styles.title}>{message ?? 'Unlock with Pro'}</Text>
        <Text style={styles.subtitle}>Get unlimited picks, full analysis & more</Text>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/upgrade')}
          accessibilityLabel="Upgrade to Pro"
        >
          <Text style={styles.buttonText}>Upgrade Now</Text>
        </Pressable>
      </View>
    </BlurWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  webOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  content: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  title: { ...Typography.subheading, marginTop: Spacing.sm },
  subtitle: { ...Typography.caption, marginTop: Spacing.xs, marginBottom: Spacing.md },
  button: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});
