import React, { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, FlatList, type ViewToken } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/theme';
import { useAuthStore } from '../stores/authStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'brain' as const,
    title: 'AI-Powered Picks',
    body: 'Get data-driven picks graded A\u2013F across 5 sports.',
  },
  {
    icon: 'book-open-variant' as const,
    title: 'Cross-Book Odds',
    body: 'Compare odds from top sportsbooks instantly.',
  },
  {
    icon: 'layers-triple' as const,
    title: 'Parlay Builder',
    body: 'Build smarter parlays with AI confidence grades.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const setHasOnboarded = useAuthStore((s) => s?.setHasOnboarded);

  const handleDone = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true').catch(() => {});
    setHasOnboarded?.(true);
    router.replace('/auth/login');
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems?.[0];
      if (first?.index != null) setCurrentIndex(first.index);
    }
  ).current;

  const isLast = currentIndex === (SLIDES?.length ?? 1) - 1;

  return (
    <View style={styles.container}>
      {!isLast && (
        <Pressable style={styles.skipBtn} onPress={handleDone}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <MaterialCommunityIcons name={item?.icon ?? 'brain'} size={80} color={Colors.accent} />
            <Text style={styles.title}>{item?.title ?? ''}</Text>
            <Text style={styles.body}>{item?.body ?? ''}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, currentIndex === i && styles.dotActive]} />
          ))}
        </View>

        {isLast && (
          <Pressable style={styles.getStarted} onPress={handleDone}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  skipBtn: { position: 'absolute', top: 60, right: Spacing.md, zIndex: 10 },
  skipText: { ...Typography.body, color: Colors.textMuted },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  title: { ...Typography.display, marginTop: Spacing.lg, textAlign: 'center' },
  body: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.sm, textAlign: 'center' },
  footer: { paddingBottom: 60, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surfaceLight },
  dotActive: { backgroundColor: Colors.accent, width: 24 },
  getStarted: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  getStartedText: { ...Typography.body, fontWeight: '700', color: Colors.white },
});
