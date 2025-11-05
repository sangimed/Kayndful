import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../theme';
import type { Request, RequestSupporter } from '../services/mockApi';
import { useRequestStore } from '../store/requests';
import { usePressFeedback, addAlphaToHex } from '../hooks/usePressFeedback';

type Props = {
  item: Request;
  onPress?: (id: string) => void;
  showBookmarkButton?: boolean;
};

type RichSegment = {
  type: 'text' | 'mention' | 'hashtag';
  value: string;
};

const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=1';
//// Encodage-safe: ne dépend pas des plages de caractères locales
const mentionRegex = /([@#][^\s.,;:!?()\"'\\]+)/g;

function formatRelativeTime(dateIso: string) {
  if (!dateIso) return "À l'instant";
  const diff = Date.now() - new Date(dateIso).getTime();
  const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  const weeks = Math.floor(days / 7);
  return `Il y a ${weeks} sem.`;
}

function formatDistance(meters?: number) {
  if (!meters || meters <= 0) return 'Distance inconnue';
  if (meters < 1000) {
    return `${Math.round(meters / 10) * 10} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(km >= 10 ? 0 : 1).replace('.', ',')} km`;
}

function formatTimeOfDay(dateIso: string) {
  if (!dateIso) return '';
  try {
    const date = new Date(dateIso);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatSupportCount(count: number) {
  if (count >= 1000) {
    const value = count / 1000;
    return `${value.toFixed(value >= 10 ? 0 : 1).replace('.', ',')} k`;
  }
  return `${count}`;
}

function formatDuration(seconds?: number) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseRichSegments(input?: string): RichSegment[] {
  if (!input) return [];
  const segments: RichSegment[] = [];
  let lastIndex = 0;
  for (const match of input.matchAll(mentionRegex)) {
    const [value] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: 'text', value: input.slice(lastIndex, index) });
    }
    const type = value.startsWith('@') ? 'mention' : 'hashtag';
    segments.push({ type, value });
    lastIndex = index + value.length;
  }
  if (lastIndex < input.length) {
    segments.push({ type: 'text', value: input.slice(lastIndex) });
  }
  return segments;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  pressable: {
    borderRadius: radius.card,
    shadowColor: colors.shadow.softCard.color,
    shadowOpacity: colors.shadow.softCard.opacity,
    shadowRadius: colors.shadow.softCard.radius,
    shadowOffset: { width: 0, height: colors.shadow.softCard.offsetY },
    elevation: colors.shadow.softCard.elevation,
  },
  cardWrapper: {
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  card: {
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.brand.surfaceMuted,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.brand.text,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerMetaText: {
    fontSize: 12,
    color: colors.brand.muted,
  },
  followChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.brand.border,
    backgroundColor: colors.brand.surface,
  },
  followChipActive: {
    borderColor: colors.semantic.success,
    backgroundColor: '#dcfce7',
  },
  followChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand.text,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.brand.surfaceStrong,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.brand.muted,
  },
  bodyRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bodyContent: {
    flex: 1,
    gap: spacing.sm,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.brand.text,
  },
  mention: {
    color: colors.semantic.success,
    fontWeight: '600',
  },
  hashtag: {
    color: colors.brand.text,
    fontWeight: '600',
  },
  seeMore: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.semantic.success,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  mediaItem: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.brand.surfaceMuted,
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(15,23,42,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  mediaDuration: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  actionGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.brand.surface,
    borderWidth: 1,
    borderColor: colors.brand.border,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.brand.border,
    backgroundColor: colors.brand.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpersLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: addAlphaToHex(colors.brand.text, 0.9),
    textAlign: 'center',
  },
  footer: {
    gap: spacing.sm,
  },
  supportersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  supportersStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supporterAvatar: {
    width: 28,
    height: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.brand.surface,
    backgroundColor: colors.brand.surfaceMuted,
  },
  supportCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand.muted,
  },
  footerChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.brand.surfaceStrong,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.brand.text,
  },
  xpPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: addAlphaToHex(colors.brand.text, 0.85),
  },
});

type ActionIconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  active?: boolean;
  activeColor?: string;
  defaultColor?: string;
  activeBackground?: string;
};

function ActionIconButton({
  icon,
  label,
  onPress,
  active = false,
  activeColor = colors.semantic.success,
  defaultColor = colors.brand.muted,
  activeBackground = addAlphaToHex(activeColor, 0.16),
}: ActionIconButtonProps) {
  const { animatedStyle, pressableProps } = usePressFeedback({
    scaleTo: 0.92,
    opacityTo: 0.8,
    durationMs: 90,
    androidRipple: { color: addAlphaToHex(colors.brand.text, 0.08), foreground: true },
    haptics: 'selection',
  });

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      {...pressableProps}
      onPress={handlePress}
      style={{ width: 44 }}
    >
      <Animated.View
        style={[
          styles.actionButton,
          animatedStyle,
          active && {
            backgroundColor: activeBackground,
            borderColor: addAlphaToHex(activeColor, 0.6),
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={active ? activeColor : defaultColor} />
      </Animated.View>
    </Pressable>
  );
}

function SupportersStack({
  supporters,
  borderColor = colors.brand.surface,
}: {
  supporters: RequestSupporter[];
  borderColor?: string;
}) {
  if (!supporters.length) return null;
  const visible = supporters.slice(0, 3);
  return (
    <View style={styles.supportersStack}>
      {visible.map((supporter, index) => (
        <Image
          key={`${supporter.id}-${index}`}
          source={{ uri: supporter.avatar ?? FALLBACK_AVATAR }}
          style={[styles.supporterAvatar, { borderColor }, index > 0 && { marginLeft: -12 }]}
        />
      ))}
    </View>
  );
}

// (MetaChip supprimÃ© â€“ rendu inline pour compatibilitÃ© dark mode)

function getMediaLayoutStyles(count: number) {
  if (count <= 1) return { width: '100%', height: 220 };
  if (count === 2) return { width: '48%', height: 160 };
  return { width: '48%', height: 120 };
}

export function RequestCard({ item, onPress, showBookmarkButton = true }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const cardBg = isDark ? colors.app.cardDark : colors.app.cardLight;
  const gradientEnd = isDark ? '#111315' : '#f5f7fb';

  // Animation d'entrÃ©e
  const mount = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(mount, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [mount]);
  const mountStyle = {
    opacity: mount,
    transform: [{ translateY: mount.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
  } as const;

  const { animatedStyle: cardAnimatedStyle, pressableProps: cardPressableProps } = usePressFeedback(
    {
      scaleTo: 0.97,
      opacityTo: 0.95,
      durationMs: 110,
      androidRipple: { color: addAlphaToHex(colors.brand.text, 0.05), foreground: true },
      haptics: 'light',
    },
  );
  const { animatedStyle: proposeAnimatedStyle, pressableProps: proposePressableProps } =
    usePressFeedback({
      scaleTo: 0.92,
      opacityTo: 0.9,
      durationMs: 80,
      androidRipple: { color: addAlphaToHex(colors.brand.text, 0.12), foreground: true },
      haptics: 'medium',
    });

  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(Boolean(item.isFollowed));
  const toggleBookmark = useRequestStore((state) => state.toggleBookmark);
  const isBookmarked = useRequestStore((state) => state.bookmarks.includes(item.id));

  const segments = useMemo(() => parseRichSegments(item.description), [item.description]);
  const showSeeMore = !expanded && (item.description?.length ?? 0) > 140;
  const distanceLabel = formatDistance(item.distanceMeters);
  const areaLabel = item.area;
  const timeLabel = formatTimeOfDay(item.createdAt);
  const relativeTime = formatRelativeTime(item.createdAt);
  const supporters = item.supporters ?? [];
  const supportCountLabel = `${formatSupportCount(item.supportCount)} soutiens`;
  const tags = item.tags ?? [];
  const media = item.media ?? [];

  const handleCardPress = () => onPress?.(item.id);
  const handleFollowToggle = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setIsFollowing((prev) => !prev);
  };

  const textPrimary = isDark ? '#E5E7EB' : colors.brand.text;
  const textMuted = isDark ? '#9CA3AF' : colors.brand.muted;
  const chipBg = isDark ? '#1C2227' : colors.brand.surfaceStrong;

  return (
    <Animated.View style={[styles.container, mountStyle]}>
      <Pressable
        accessibilityRole="button"
        onPress={handleCardPress}
        style={styles.pressable}
        {...cardPressableProps}
      >
        <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
          <LinearGradient
            colors={[cardBg, gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.header}>
              <Image
                source={{ uri: item.author.avatar ?? FALLBACK_AVATAR }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={styles.headerInfo}>
                <Text style={[styles.headerName, { color: textPrimary }]}>{item.author.name}</Text>
                <View style={styles.headerMeta}>
                  <Ionicons name="time-outline" size={14} color={textMuted} />
                  <Text style={[styles.headerMetaText, { color: textMuted }]}>{relativeTime}</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isFollowing ? 'Ne plus suivre' : 'Suivre cette demande'}
                onPress={handleFollowToggle}
                style={[styles.followChip, isFollowing && styles.followChipActive]}
              >
                <Text style={styles.followChipLabel}>{isFollowing ? 'Suivi' : 'Suivre'}</Text>
              </Pressable>
            </View>

            <View style={styles.metaRow}>
              <View style={[styles.metaChip, { backgroundColor: chipBg }]}>
                <Ionicons name="navigate-outline" size={14} color={textMuted} />
                <Text style={[styles.metaChipText, { color: textMuted }]}>{distanceLabel}</Text>
              </View>
              <View style={[styles.metaChip, { backgroundColor: chipBg }]}>
                <Ionicons name="location-outline" size={14} color={textMuted} />
                <Text style={[styles.metaChipText, { color: textMuted }]}>{areaLabel}</Text>
              </View>
              <View style={[styles.metaChip, { backgroundColor: chipBg }]}>
                <Ionicons name="time-outline" size={14} color={textMuted} />
                <Text style={[styles.metaChipText, { color: textMuted }]}>{timeLabel}</Text>
              </View>
            </View>

            <View style={styles.bodyRow}>
              <View style={styles.bodyContent}>
                {segments.length ? (
                  <Text
                    style={[styles.description, { color: textPrimary }]}
                    numberOfLines={expanded ? undefined : 3}
                  >
                    {segments.map((segment, index) => {
                      if (segment.type === 'mention') {
                        return (
                          <Text
                            key={`mention-${segment.value}-${index}`}
                            style={styles.mention}
                            accessibilityRole="link"
                          >
                            {segment.value}
                          </Text>
                        );
                      }
                      if (segment.type === 'hashtag') {
                        return (
                          <Text
                            key={`hashtag-${segment.value}-${index}`}
                            style={styles.hashtag}
                            accessibilityRole="link"
                          >
                            {segment.value}
                          </Text>
                        );
                      }
                      return <Text key={`text-${index}`}>{segment.value}</Text>;
                    })}
                  </Text>
                ) : null}
                {showSeeMore ? (
                  <Pressable onPress={() => setExpanded(true)} accessibilityRole="button">
                    <Text
                      style={[
                        styles.seeMore,
                        { color: isDark ? colors.semantic.success : colors.semantic.success },
                      ]}
                    >
                      Voir plus
                    </Text>
                  </Pressable>
                ) : null}

                {media.length ? (
                  <View style={styles.mediaGrid}>
                    {media.slice(0, 4).map((mediaItem) => {
                      const { width, height } = getMediaLayoutStyles(media.length);
                      return (
                        <View key={mediaItem.id} style={[styles.mediaItem, { width, height }]}>
                          <Image
                            source={{ uri: mediaItem.thumbnail }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                          {mediaItem.type === 'video' ? (
                            <View style={styles.mediaOverlay}>
                              <Ionicons name="play" size={20} color="#fff" />
                              <Text style={styles.mediaDuration}>
                                {formatDuration(mediaItem.durationSeconds)}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>

              {/* rail vertical supprimÃ© */}
            </View>

            <View style={styles.footer}>
              <View style={styles.supportersRow}>
                <SupportersStack supporters={supporters} borderColor={cardBg} />
                <Text style={styles.supportCountText}>{supportCountLabel}</Text>
              </View>
              <View style={styles.footerChips}>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={[styles.tagPill, { backgroundColor: chipBg }]}>
                      <Text style={[styles.tagText, { color: textPrimary }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <LinearGradient
                  colors={colors.semantic.successGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.xpPill}
                >
                  <Text
                    style={[styles.xpLabel, { color: addAlphaToHex(textPrimary, 0.85) }]}
                  >{`${item.xp} XP`}</Text>
                </LinearGradient>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Proposer mon aide"
                  {...proposePressableProps}
                  onPress={(event) => event.stopPropagation()}
                >
                  <Animated.View style={[styles.actionGhost, proposeAnimatedStyle]}>
                    <Ionicons name="add" size={16} color={addAlphaToHex(textPrimary, 0.9)} />
                    <Text style={[styles.helpersLabel, { color: addAlphaToHex(textPrimary, 0.9) }]}>
                      Proposer
                    </Text>
                  </Animated.View>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>

      <View style={styles.actionsRow}>
        <ActionIconButton
          icon={liked ? 'heart' : 'heart-outline'}
          label={liked ? 'Retirer le soutien' : 'Soutenir cette demande'}
          onPress={() => setLiked((prev) => !prev)}
          active={liked}
          activeColor={colors.semantic.danger}
          activeBackground="#fee2e2"
        />
        {showBookmarkButton ? (
          <ActionIconButton
            icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            label={isBookmarked ? 'Retirer des favoris' : 'Enregistrer pour plus tard'}
            onPress={() => toggleBookmark(item.id)}
            active={isBookmarked}
            activeColor={colors.semantic.success}
            activeBackground="#dcfce7"
          />
        ) : null}
        <ActionIconButton icon="share-social-outline" label="Partager la demande" />
        <ActionIconButton icon="chatbubble-ellipses-outline" label="Envoyer un message" />
      </View>
    </Animated.View>
  );
}

export default RequestCard;
