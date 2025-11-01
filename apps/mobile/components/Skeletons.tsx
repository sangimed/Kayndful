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
        borderRadius: radius.card,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.brand.border,
        gap: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <SkeletonBlock width={52} height={52} borderRadius={20} />
          <View style={{ gap: 8 }}>
            <SkeletonBlock width={140} height={18} borderRadius={8} />
            <SkeletonBlock width={90} height={12} borderRadius={6} />
          </View>
        </View>
        <SkeletonBlock width={84} height={28} borderRadius={14} />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <SkeletonBlock width={100} height={20} borderRadius={16} />
        <SkeletonBlock width={120} height={20} borderRadius={16} />
        <SkeletonBlock width={80} height={20} borderRadius={16} />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.sm }}>
          <SkeletonBlock width="100%" height={12} borderRadius={6} />
          <SkeletonBlock width="85%" height={12} borderRadius={6} />
          <SkeletonBlock width="70%" height={12} borderRadius={6} />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <SkeletonBlock width="48%" height={120} borderRadius={18} />
            <SkeletonBlock width="48%" height={120} borderRadius={18} />
            <SkeletonBlock width="48%" height={120} borderRadius={18} />
            <SkeletonBlock width="48%" height={120} borderRadius={18} />
          </View>
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SkeletonBlock width={28} height={28} borderRadius={12} />
            <SkeletonBlock width={28} height={28} borderRadius={12} style={{ marginLeft: -12 }} />
            <SkeletonBlock width={28} height={28} borderRadius={12} style={{ marginLeft: -12 }} />
          </View>
          <SkeletonBlock width={120} height={12} borderRadius={6} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' }}>
          <SkeletonBlock width={80} height={24} borderRadius={16} />
          <SkeletonBlock width={70} height={24} borderRadius={16} />
          <SkeletonBlock width={60} height={24} borderRadius={16} />
          <SkeletonBlock width={72} height={24} borderRadius={16} />
          <SkeletonBlock width={72} height={24} borderRadius={16} />
          <View style={{ flex: 1 }} />
          <SkeletonBlock width={70} height={28} borderRadius={16} />
          <SkeletonBlock width={80} height={28} borderRadius={16} />
        </View>
      </View>
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
