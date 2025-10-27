import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

type BaseStateProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onPress?: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  tone?: 'default' | 'danger' | 'offline';
};

const toneColor = (tone: BaseStateProps['tone']) => {
  switch (tone) {
    case 'danger':
      return colors.semantic.danger;
    case 'offline':
      return '#0f172a';
    default:
      return colors.brand.text;
  }
};

function StateCard({ title, subtitle, ctaLabel, onPress, iconName = 'leaf-outline', tone = 'default' }: BaseStateProps) {
  const color = toneColor(tone);
  return (
    <View
      style={{
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 24,
          backgroundColor: '#f8fafc',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={iconName} size={32} color={color} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '600', color }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: colors.brand.muted, fontSize: 14, textAlign: 'center' }}>{subtitle}</Text>
      ) : null}
      {ctaLabel && onPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{
            marginTop: spacing.sm,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderRadius: radius.md,
            backgroundColor: '#eef2ff',
          }}
        >
          <Text style={{ color: colors.brand.text, fontWeight: '600' }}>{ctaLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState(props: Omit<BaseStateProps, 'tone'>) {
  return <StateCard iconName="planet-outline" {...props} tone="default" />;
}

export function ErrorState(props: Omit<BaseStateProps, 'tone'>) {
  return <StateCard iconName="alert-circle-outline" {...props} tone="danger" />;
}

export function OfflineState(props: Omit<BaseStateProps, 'tone'>) {
  return <StateCard iconName="cloud-offline-outline" {...props} tone="offline" />;
}

export default StateCard;
