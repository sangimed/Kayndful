import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius } from '../theme';
import type { Request } from '../services/mockApi';
import { useRequestStore } from '../store/requests';

type Props = {
  item: Request;
  onPress?: (id: string) => void;
  showBookmarkButton?: boolean;
};

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    gradient: readonly [string, string];
    accent: string;
  }
> = {
  Bricolage: {
    icon: 'construct-outline',
    gradient: ['#fde68a', '#f59e0b'],
    accent: '#f59e0b',
  },
  Courses: {
    icon: 'cart-outline',
    gradient: ['#bae6fd', '#60a5fa'],
    accent: '#3b82f6',
  },
  Conseil: {
    icon: 'school-outline',
    gradient: ['#ddd6fe', '#a78bfa'],
    accent: '#7c3aed',
  },
  Services: {
    icon: 'briefcase-outline',
    gradient: ['#bbf7d0', '#22c55e'],
    accent: colors.semantic.success,
  },
  Discussion: {
    icon: 'chatbubbles-outline',
    gradient: ['#fecaca', '#ef4444'],
    accent: colors.semantic.danger,
  },
};

export function RequestCard({ item, onPress, showBookmarkButton = true }: Props) {
  const fallback = { icon: 'pricetag-outline' as const, gradient: colors.brand.primaryGradient, accent: colors.brand.text };
  const config = CATEGORY_CONFIG[item.category] ?? fallback;
  const toggleBookmark = useRequestStore((state) => state.toggleBookmark);
  const isBookmarked = useRequestStore((state) => state.bookmarks.includes(item.id));

  return (
    <Pressable
      onPress={() => onPress?.(item.id)}
      android_ripple={{ color: colors.brand.border, foreground: true }}
      style={{
        backgroundColor: colors.brand.surface,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.brand.border,
        shadowColor: colors.shadow.brand.color,
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 12 },
        elevation: 3,
        gap: spacing.md,
      }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir la demande ${item.title}`}
    >
      {showBookmarkButton ? (
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            toggleBookmark(item.id);
          }}
          hitSlop={8}
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.brand.surface,
          }}
        >
          <Ionicons
            name={isBookmarked ? 'star' : 'star-outline'}
            size={18}
            color={isBookmarked ? colors.semantic.success : colors.brand.muted}
          />
        </Pressable>
      ) : null}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <LinearGradient
          colors={config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={config.icon} size={28} color={colors.brand.text} />
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand.text }}>
              {item.title}
            </Text>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: `${config.accent}20`,
              }}
              accessibilityRole="text"
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: config.accent }}>
                {item.eta} min
              </Text>
            </View>
          </View>

          {item.description ? (
            <Text
              style={{
                fontSize: 14,
                color: colors.brand.muted,
                marginTop: 6,
              }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="location-outline" size={16} color={colors.brand.muted} />
          <Text style={{ fontSize: 12, color: colors.brand.muted }}>
            {item.area} - Localisation approximative
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.brand.muted }}>par {item.author.name}</Text>
      </View>
    </Pressable>
  );
}

export default RequestCard;
