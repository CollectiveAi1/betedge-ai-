import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

export function ResponsibleGamblingFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gamble Responsibly | 21+</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  text: {
    ...Typography.caption,
    color: Colors.textDisabled,
    fontSize: 12,
  },
});
