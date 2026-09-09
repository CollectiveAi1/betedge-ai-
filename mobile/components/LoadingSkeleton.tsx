import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface Props {
  count?: number;
}

function SkeletonCard() {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View style={[styles.card, { opacity: anim }]}>
      <View style={styles.row}>
        <View style={styles.circle} />
        <View style={styles.lineLong} />
      </View>
      <View style={styles.lineFull} />
      <View style={styles.lineMedium} />
      <View style={styles.lineShort} />
    </Animated.View>
  );
}

export function LoadingSkeleton({ count = 3 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  circle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceLight, marginRight: Spacing.sm },
  lineLong: { height: 14, flex: 1, borderRadius: 4, backgroundColor: Colors.surfaceLight },
  lineFull: { height: 18, borderRadius: 4, backgroundColor: Colors.surfaceLight, marginBottom: Spacing.sm },
  lineMedium: { height: 14, width: '60%', borderRadius: 4, backgroundColor: Colors.surfaceLight, marginBottom: Spacing.sm },
  lineShort: { height: 14, width: '40%', borderRadius: 4, backgroundColor: Colors.surfaceLight },
});
