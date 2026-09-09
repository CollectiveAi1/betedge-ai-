// BetEdge AI — Theme Constants
import { Platform, StyleSheet } from 'react-native';

export const Colors = {
  // Backgrounds
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  border: '#334155',

  // Brand
  primary: '#0F172A',
  accent: '#22C55E',
  accentDark: '#16A34A',

  // Grades
  gradeA: '#22C55E',
  gradeB: '#3B82F6',
  gradeC: '#F59E0B',
  gradeD: '#F97316',
  gradeF: '#EF4444',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textDisabled: '#64748B',

  // Tab
  tabActive: '#22C55E',
  tabInactive: '#64748B',

  // Status badges
  win: '#22C55E',
  loss: '#EF4444',
  push: '#F59E0B',
  pending: '#94A3B8',

  // Subscription
  tierFree: '#94A3B8',
  tierPro: '#22C55E',
  tierElite: '#F59E0B',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const GradeColors: Record<string, string> = {
  A: Colors.gradeA,
  B: Colors.gradeB,
  C: Colors.gradeC,
  D: Colors.gradeD,
  F: Colors.gradeF,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: 'Arial, sans-serif',
  default: 'System',
});

export const Typography = StyleSheet.create({
  display: {
    fontSize: FontSize.xxl,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    fontFamily,
  },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    fontFamily,
  },
  subheading: {
    fontSize: FontSize.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    fontFamily,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: '400' as const,
    color: Colors.textPrimary,
    fontFamily,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: '400' as const,
    color: Colors.textMuted,
    fontFamily,
  },
  small: {
    fontSize: FontSize.xs,
    fontWeight: '400' as const,
    color: Colors.textMuted,
    fontFamily,
  },
});

export const Shadows = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}) as Record<string, unknown>;

export const GradientColors = {
  primaryButton: ['#22C55E', '#16A34A'] as const,
  cardHighlight: ['#1E293B', '#0F172A'] as const,
} as const;
