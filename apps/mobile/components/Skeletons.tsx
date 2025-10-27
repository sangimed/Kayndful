import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

type SkeletonProps = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
};

function SkeletonBlock({ width, height, borderRadius = 12, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.brand.surfaceStrong,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonRequestCard() {
  return (
    <View
      style={{
        backgroundColor: colors.brand.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.brand.border,
        gap: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <SkeletonBlock width={60} height={60} borderRadius={20} />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <SkeletonBlock width="80%" height={18} borderRadius={8} />
          <SkeletonBlock width="50%" height={12} borderRadius={6} />
          <SkeletonBlock width="90%" height={12} borderRadius={6} />
        </View>
      </View>
      <SkeletonBlock width="60%" height={12} borderRadius={6} />
    </View>
  );
}

export function SkeletonConversationCard() {
  return (
    <View
      style={{
        backgroundColor: colors.brand.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.brand.border,
        flexDirection: 'row',
        gap: spacing.md,
        alignItems: 'center',
      }}
    >
      <SkeletonBlock width={56} height={56} borderRadius={20} />
      <View style={{ flex: 1, gap: spacing.sm }}>
        <SkeletonBlock width="75%" height={16} borderRadius={8} />
        <SkeletonBlock width="50%" height={12} borderRadius={6} />
        <SkeletonBlock width="90%" height={12} borderRadius={6} />
      </View>
    </View>
  );
}

export default SkeletonBlock;
