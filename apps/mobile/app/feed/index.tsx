import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../theme';
import { RequestCard } from '../../components/RequestCard';
import { REQUEST_CATEGORIES } from '../../constants/requests';
import { PrimaryButton } from '../../components/Button';
import { SkeletonRequestCard } from '../../components/Skeletons';
import { EmptyState, ErrorState, OfflineState } from '../../components/StateCards';
import ZoneSelector from '../../components/ZoneSelector';
import {
  getRequests,
  isMockOffline,
  setMockOffline,
  NEIGHBORHOODS,
  getCurrentUserSnapshot,
  type FeedChannel,
  type Request,
  type RequestSortOption,
} from '../../services/mockApi';
import { isOfflineError } from '../../utils/errors';
import { addAlphaToHex, usePressFeedback } from '../../hooks/usePressFeedback';

// -------------------- Types & constants --------------------
type Filters = {
  category?: string;
  maxDistanceMeters?: number;
  minXp?: number;
  area?: string;
  neighborhoodId?: string;
  radiusMeters?: number;
  query?: string;
  channel: FeedChannel;
  sortBy: RequestSortOption;
};

const DEFAULT_FILTERS: Filters = { channel: 'latest', sortBy: 'recent' };
const DISTANCE_OPTIONS = [500, 1000, 1500, 2000] as const;
const XP_OPTIONS = [10, 20, 30, 40, 50, 60] as const;
const SORT_OPTIONS: { value: RequestSortOption; label: string }[] = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'distance', label: 'Distance' },
  { value: 'xp', label: 'XP décroissant' },
];

const TABS: { key: FeedChannel; label: string }[] = [
  { key: 'latest', label: 'Dernières' },
  { key: 'community', label: 'Communauté' },
  { key: 'following', label: 'Suivis' },
];

// -------------------- Screen --------------------
export default function FeedScreen() {
  const router = useRouter();
  const currentUser = useMemo(() => getCurrentUserSnapshot(), []);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { width } = useWindowDimensions();
  const isCompactHeader = width < 360;
  const headerLayout = {
    buttonSize: isCompactHeader ? 40 : 46,
    buttonRadius: isCompactHeader ? 14 : 16,
    profileIconSize: isCompactHeader ? 24 : 28,
    actionIconSize: isCompactHeader ? 16 : 18,
    filterButtonSize: isCompactHeader ? 40 : 46,
    filterButtonRadius: isCompactHeader ? 15 : 17,
    filterIconSize: isCompactHeader ? 18 : 20,
    rowGap: spacing.sm,
    actionsGap: spacing.xs,
  } as const;

  const [items, setItems] = useState<Request[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState<boolean>(isMockOffline());

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState(filters.query ?? '');

  const hasActiveFilters = Boolean(
    filters.category ||
      filters.maxDistanceMeters ||
      filters.minXp ||
      filters.radiusMeters ||
      filters.neighborhoodId ||
      filters.query ||
      filters.sortBy !== 'recent',
  );

  const load = useCallback(
    async (nextPage: number, replace = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await getRequests({ page: nextPage, pageSize: 10, filters });
        setItems((prev) => (replace ? response.items : [...prev, ...response.items]));
        setHasMore(response.hasMore);
        setPage(nextPage);
        setOffline(false);
      } catch (err) {
        if (isOfflineError(err)) {
          setOffline(true);
          if (replace) setItems([]);
        } else {
          setError('Impossible de charger les demandes.');
        }
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [filters],
  );

  useEffect(() => {
    load(1, true);
  }, [load]);

  // Debounced search
  useEffect(() => {
    const trimmed = searchTerm.trim();
    const t = setTimeout(() => {
      setFilters((prev) => ({ ...prev, query: trimmed.length ? trimmed : undefined }));
    }, 280);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(filters.query ?? '');
  }, [filters.query]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setOffline(false);
    await load(1, true);
    setRefreshing(false);
  }, [load]);

  const handleRetry = () => {
    setOffline(false);
    setError(null);
    load(1, true);
  };

  const openFilters = () => {
    setDraftFilters(filters);
    setSheetVisible(true);
  };
  const closeFilters = () => setSheetVisible(false);
  const applyDraftFilters = () => {
    setFilters({
      ...draftFilters,
      channel: filters.channel,
      sortBy: draftFilters.sortBy ?? 'recent',
    });
    setSheetVisible(false);
    setError(null);
    setOffline(false);
  };

  const toggleOffline = () => {
    const next = !isMockOffline();
    setMockOffline(next);
    setOffline(next);
    if (!next) handleRetry();
    else setItems([]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.app.backgroundDark : colors.app.backgroundLight,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
      }}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <RequestCard item={item as Request} onPress={(id) => router.push(`/request/${id}`)} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <FeedHeader
              currentUserAvatar={currentUser.avatar}
              hasActiveFilters={hasActiveFilters}
              offline={offline}
              searchValue={searchTerm}
              layout={headerLayout}
              onSearchChange={setSearchTerm}
              onFiltersPress={openFilters}
              onFiltersLongPress={toggleOffline}
              onRetry={handleRetry}
              onOpenProfile={() => router.push('/account')}
              onOpenNotifications={() => router.push('/inbox')}
              onOpenSaved={() => router.push('/request/saved')}
            />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 8,
                gap: spacing.md,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((k) => (
                <View key={k} style={{ width: '100%' }}>
                  <SkeletonRequestCard />
                </View>
              ))}
            </View>
          ) : offline ? (
            <OfflineState
              title="Mode hors ligne"
              subtitle="Connecte-toi pour voir les nouvelles demandes."
            />
          ) : error ? (
            <ErrorState title="Erreur" subtitle={error ?? 'Impossible de charger les demandes.'} />
          ) : (
            <EmptyState
              title="Aucune demande"
              subtitle="Aucune demande ne correspond à tes filtres."
            />
          )
        }
        ListFooterComponent={
          !offline && !error && items.length > 0 ? (
            <View style={{ padding: spacing.lg, alignItems: 'center' }}>
              {loading ? (
                <ActivityIndicator color={colors.brand.text} />
              ) : hasMore ? (
                <PrimaryButton title="Charger plus" onPress={() => load(page + 1)} />
              ) : null}
            </View>
          ) : null
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!loadingRef.current && hasMore && !loading) load(page + 1);
        }}
        refreshControl={
          <RefreshControl
            tintColor={colors.brand.text}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />

      {error && items.length > 0 ? (
        <View style={{ position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: 24 }}>
          <View
            style={{
              backgroundColor: '#fee2e2',
              borderColor: colors.semantic.danger,
              borderWidth: 1,
              padding: spacing.sm,
              borderRadius: radius.md,
            }}
          >
            <Text style={{ color: colors.semantic.danger }}>{error}</Text>
          </View>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/request/new')}
        style={{
          position: 'absolute',
          bottom: spacing.xl + spacing.md,
          right: spacing.md,
          shadowColor: colors.shadow.softCard.color,
          shadowOpacity: colors.shadow.softCard.opacity,
          shadowRadius: colors.shadow.softCard.radius,
          shadowOffset: { width: 0, height: colors.shadow.softCard.offsetY },
          elevation: colors.shadow.softCard.elevation,
        }}
      >
        <LinearGradient
          colors={colors.brand.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={24} color={colors.brand.text} />
        </LinearGradient>
      </Pressable>

      <FiltersSheet
        visible={sheetVisible}
        draftFilters={draftFilters}
        onChangeDraft={setDraftFilters}
        onClose={closeFilters}
        onApply={applyDraftFilters}
      />
    </SafeAreaView>
  );
}

// -------------------- Header (flat, not card) --------------------
type FeedHeaderProps = {
  currentUserAvatar?: string;
  hasActiveFilters: boolean;
  offline: boolean;
  searchValue: string;
  layout: {
    buttonSize: number;
    buttonRadius: number;
    profileIconSize: number;
    actionIconSize: number;
    filterButtonSize: number;
    filterButtonRadius: number;
    filterIconSize: number;
    rowGap: number;
    actionsGap: number;
  };
  onSearchChange: (value: string) => void;
  onFiltersPress: () => void;
  onFiltersLongPress: () => void;
  onRetry: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenSaved: () => void;
};

function FeedHeader({
  currentUserAvatar,
  hasActiveFilters,
  offline,
  searchValue,
  layout,
  onSearchChange,
  onFiltersPress,
  onFiltersLongPress,
  onRetry,
  onOpenProfile,
  onOpenNotifications,
  onOpenSaved,
}: FeedHeaderProps) {
  const { animatedStyle: profileAnimatedStyle, pressableProps: profilePressableProps } =
    usePressFeedback({
      scaleTo: 0.95,
      opacityTo: 0.9,
      durationMs: 90,
      androidRipple: { color: addAlphaToHex(colors.brand.text, 0.08), foreground: true },
      haptics: 'selection',
    });
  const {
    buttonSize,
    buttonRadius,
    profileIconSize,
    actionIconSize,
    filterButtonSize,
    filterButtonRadius,
    filterIconSize,
    rowGap,
    actionsGap,
  } = layout;

  return (
    <View style={{ paddingVertical: spacing.lg, gap: spacing.sm }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: rowGap,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voir mon profil"
          onPress={onOpenProfile}
          style={{ marginLeft: spacing.xs }}
          {...profilePressableProps}
        >
          <Animated.View
            style={[
              {
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonRadius,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.brand.surface,
                borderWidth: 1,
                borderColor: colors.brand.border,
              },
              profileAnimatedStyle,
            ]}
          >
            {currentUserAvatar ? (
              <Image
                source={{ uri: currentUserAvatar }}
                style={{
                  width: buttonSize - 4,
                  height: buttonSize - 4,
                  borderRadius: buttonRadius - 2,
                }}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={profileIconSize}
                color={colors.brand.text}
              />
            )}
          </Animated.View>
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: actionsGap,
            flex: 1,
          }}
        >
          <HeaderActionButton
            icon="notifications-outline"
            accessibilityLabel="Ouvrir les notifications"
            onPress={onOpenNotifications}
            size={buttonSize}
            cornerRadius={buttonRadius}
            iconSize={actionIconSize}
          />
          <HeaderActionButton
            icon="bookmark-outline"
            accessibilityLabel="Voir mes favoris"
            onPress={onOpenSaved}
            size={buttonSize}
            cornerRadius={buttonRadius}
            iconSize={actionIconSize}
          />
          <FilterButton
            hasActiveFilters={hasActiveFilters}
            onPress={onFiltersPress}
            onLongPress={onFiltersLongPress}
            size={filterButtonSize}
            cornerRadius={filterButtonRadius}
            iconSize={filterIconSize}
          />
        </View>
      </View>
      {offline ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.sm,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: radius.md,
            backgroundColor: colors.brand.surfaceStrong,
          }}
        >
          <Ionicons name="cloud-offline-outline" size={18} color={colors.brand.text} />
          <Text style={{ flex: 1, fontSize: 12, color: colors.brand.text }}>
            Mode hors ligne - contenu en cache
          </Text>
          <Pressable accessibilityRole="button" onPress={onRetry}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.semantic.success }}>
              Revenir en ligne
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

// -------------------- Filters bottom sheet --------------------
function FiltersSheet({
  visible,
  draftFilters,
  onChangeDraft,
  onClose,
  onApply,
}: {
  visible: boolean;
  draftFilters: Filters;
  onChangeDraft: (f: Filters | ((p: Filters) => Filters)) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={{ flex: 1, backgroundColor: colors.overlay }} onPress={onClose} />
        <View
          style={{
            backgroundColor: colors.brand.surface,
            padding: spacing.lg,
            paddingBottom: spacing.xl,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            gap: spacing.lg,
          }}
        >
          <View
            style={{
              width: 48,
              height: 4,
              borderRadius: 999,
              backgroundColor: colors.brand.border,
              alignSelf: 'center',
              marginTop: 4,
            }}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.brand.text }}>
                Filtres
              </Text>
              <Text style={{ color: colors.brand.muted, marginTop: 4 }}>
                Ajuste la portée, l'XP minimum et la catégorie.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.brand.surfaceStrong,
              }}
            >
              <Ionicons name="close" size={20} color={colors.brand.text} />
            </Pressable>
          </View>

          <View>
            <Text style={{ fontWeight: '600', color: colors.brand.text, marginBottom: spacing.sm }}>
              Catégorie
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {REQUEST_CATEGORIES.map((category) => {
                const selected = draftFilters.category === category;
                return (
                  <Pressable
                    key={category}
                    onPress={() =>
                      onChangeDraft((p) => ({ ...p, category: selected ? undefined : category }))
                    }
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      backgroundColor: selected
                        ? colors.brand.surfaceStrong
                        : colors.brand.surfaceMuted,
                      borderWidth: selected ? 1 : 0,
                      borderColor: selected ? colors.brand.text : 'transparent',
                    }}
                  >
                    <Text style={{ color: colors.brand.text, fontSize: 14 }}>{category}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: '600', color: colors.brand.text, marginBottom: spacing.sm }}>
              Distance maximale
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {DISTANCE_OPTIONS.map((value) => {
                const selected = draftFilters.maxDistanceMeters === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() =>
                      onChangeDraft((p) => ({
                        ...p,
                        maxDistanceMeters: selected ? undefined : value,
                      }))
                    }
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      backgroundColor: selected ? '#dbeafe' : colors.brand.surfaceStrong,
                      borderWidth: selected ? 1 : 0,
                      borderColor: selected ? '#2563eb' : 'transparent',
                    }}
                  >
                    <Text
                      style={{ color: selected ? '#1d4ed8' : colors.brand.muted, fontSize: 14 }}
                    >
                      {'≤ '}
                      {value >= 1000 ? `${value / 1000} km` : `${value} m`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={{ fontWeight: '600', color: colors.brand.text, marginBottom: spacing.sm }}>
              XP minimum
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {XP_OPTIONS.map((value) => {
                const selected = draftFilters.minXp === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() =>
                      onChangeDraft((p) => ({ ...p, minXp: selected ? undefined : value }))
                    }
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      backgroundColor: selected ? '#dcfce7' : colors.brand.surfaceStrong,
                      borderWidth: selected ? 1 : 0,
                      borderColor: selected ? colors.semantic.success : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? colors.semantic.success : colors.brand.muted,
                        fontSize: 14,
                      }}
                    >
                      {'≥ '}
                      {value} XP
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <ZoneSelector
            selectedNeighborhoodId={draftFilters.neighborhoodId}
            selectedRadius={draftFilters.radiusMeters}
            onChange={({ neighborhoodId, radiusMeters }) => {
              const hood = NEIGHBORHOODS.find((n) => n.id === neighborhoodId);
              const km = Math.round((radiusMeters / 1000) * 10) / 10;
              onChangeDraft((p) => ({
                ...p,
                neighborhoodId,
                radiusMeters,
                area: hood ? `${hood.name} (~${km} km)` : p.area,
              }));
            }}
          />

          <PrimaryButton
            title="Réinitialiser"
            variant="ghost"
            onPress={() =>
              onChangeDraft({
                ...DEFAULT_FILTERS,
                channel: draftFilters.channel,
                query: draftFilters.query,
              })
            }
          />
          <PrimaryButton title="Afficher les demandes" variant="success" onPress={onApply} />
        </View>
      </View>
    </Modal>
  );
}

function HeaderActionButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 46,
  cornerRadius = 16,
  iconSize = 18,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  cornerRadius?: number;
  iconSize?: number;
}) {
  const { animatedStyle, pressableProps } = usePressFeedback({
    scaleTo: 0.92,
    opacityTo: 0.85,
    durationMs: 90,
    androidRipple: { color: addAlphaToHex(colors.brand.text, 0.08), foreground: true },
    haptics: 'selection',
  });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      {...pressableProps}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: cornerRadius,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.brand.surface,
            borderWidth: 1,
            borderColor: colors.brand.border,
          },
          animatedStyle,
        ]}
      >
        <Ionicons name={icon} size={iconSize} color={colors.brand.text} />
      </Animated.View>
    </Pressable>
  );
}

function FilterButton({
  hasActiveFilters,
  onPress,
  onLongPress,
  size = 48,
  cornerRadius = 18,
  iconSize = 20,
}: {
  hasActiveFilters: boolean;
  onPress: () => void;
  onLongPress: () => void;
  size?: number;
  cornerRadius?: number;
  iconSize?: number;
}) {
  const { animatedStyle, pressableProps } = usePressFeedback({
    scaleTo: 0.94,
    opacityTo: 0.86,
    durationMs: 90,
    androidRipple: { color: addAlphaToHex(colors.brand.text, 0.08), foreground: true },
    haptics: 'selection',
  });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ouvrir les filtres"
      onPress={onPress}
      onLongPress={onLongPress}
      {...pressableProps}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: cornerRadius,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.brand.surface,
            borderWidth: 1,
            borderColor: colors.brand.border,
          },
          animatedStyle,
          hasActiveFilters && { borderColor: colors.brand.text, borderWidth: 1.5 },
        ]}
      >
        <Ionicons name="options-outline" size={iconSize} color={colors.brand.text} />
        {hasActiveFilters ? (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.semantic.success,
            }}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}
