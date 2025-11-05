import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

type Props = {
  step: number;
  total: number;
  title: string;
};

export default function ProgressHeader({ step, total, title }: Props) {
  const pct = Math.max(0, Math.min(1, step / total));
  return (
    <View style={styles.container}>
      <Text accessibilityRole="text" style={styles.stepText}>
        {`Step ${step} of ${total}`}
      </Text>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.xl },
  stepText: { color: colors.brand.muted, marginBottom: spacing.xs },
  title: { fontSize: 28, fontWeight: '800', color: colors.brand.text, marginBottom: spacing.md },
  progressTrack: {
    height: 6,
    borderRadius: 6,
    backgroundColor: '#F2E7DF',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#A8D5FF',
  },
});
