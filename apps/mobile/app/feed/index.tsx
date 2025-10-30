import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../theme';
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
  type Request,
} from '../../services/mockApi';
import { isOfflineError } from '../../utils/errors';

type Filters = {
  category?: string;
  maxEta?: number;
  area?: string;
  neighborhoodId?: string;
  radiusMeters?: number;
  query?: string;
};

const ETA_OPTIONS = [15, 30, 45, 60] as const;

export default function FeedScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Request[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState<boolean>(isMockOffline());
  const [filters, setFilters] = useState<Filters>({});
  const [sheetVisible, setSheetVisible] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>({});

  const load = useCallback(
    async (nextPage: number, replace = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await getRequests({ page: nextPage, pageSize: 10, filters });
        setItems((previous) => (replace ? response.items : [...previous, ...response.items]));
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
    [filters]
  );

  useEffect(() => {
    load(1, true);
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setOffline(false);
    await load(1, true);
    setRefreshing(false);
  }, [load]);

  const hasActiveFilters = Boolean(filters.category || filters.maxEta || filters.area);

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
    setFilters({ ...draftFilters });
    setSheetVisible(false);
    setError(null);
    setOffline(false);
  };

  const toggleOffline = () => {
    const next = !isMockOffline();
    setMockOffline(next);
    setOffline(next);
    if (!next) {
      handleRetry();
    } else {
      setItems([]);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.gray,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
      }}
    >
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl }}
        ListHeaderComponent={
          <View style={{ paddingBottom: spacing.lg }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/account')}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.brand.surface,
                  borderWidth: 1,
                  borderColor: colors.brand.border,
                  shadowColor: colors.shadow.brand.color,
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 2,
                }}
              >
                <Ionicons name="menu-outline" size={22} color={colors.brand.text} />
              </Pressable>

              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>
                Demandes
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push('/search')}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.brand.surface,
                    borderWidth: 1,
                    borderColor: colors.brand.border,
                    shadowColor: colors.shadow.brand.color,
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 2,
                  }}
                >
                  <Ionicons name="search" size={20} color={colors.brand.text} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={openFilters}
                  onLongPress={toggleOffline}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.brand.surface,
                    borderWidth: hasActiveFilters ? 2 : 1,
                    borderColor: hasActiveFilters ? colors.brand.text : colors.brand.border,
                    shadowColor: colors.shadow.brand.color,
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 2,
                  }}
                >
                  <Ionicons name="options-outline" size={22} color={colors.brand.text} />
                  {hasActiveFilters ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.semantic.success,
                      }}
                    />
                  ) : null}
                </Pressable>
              </View>
            </View>

            <Text style={{ color: colors.brand.muted }}>
              Trouve les demandes proches et reponds en quelques minutes.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RequestCard item={item} onPress={(id) => router.push(`/request/${id}`)} />
        )}
        ListEmptyComponent={(() => {
          if (offline) {
            return (
              <OfflineState
                title="Mode hors ligne"
                subtitle="Reviens en ligne pour voir les nouvelles demandes."
                ctaLabel="Reessayer"
                onPress={handleRetry}
              />
            );
          }
          if (error) {
            return (
              <ErrorState
                title="Chargement indisponible"
                subtitle={error}
                ctaLabel="Reessayer"
                onPress={handleRetry}
              />
            );
          }
          if (loading) {
            return (
              <View style={{ gap: spacing.lg }}>
                {[0, 1, 2].map((key) => (
                  <SkeletonRequestCard key={key} />
                ))}
              </View>
            );
          }
          return (
            <EmptyState
              title="Aucune demande"
              subtitle="Essaye d'autres filtres ou cree ta propre demande."
              ctaLabel="Reessayer"
              onPress={handleRetry}
            />
          );
        })()}
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
          if (!loadingRef.current && hasMore) {
            load(page + 1);
          }
        }}
        refreshControl={
          <RefreshControl tintColor={colors.brand.text} refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {error && items.length > 0 ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#fee2e2',
              borderColor: colors.semantic.danger,
              borderWidth: 1,
              padding: 12,
              borderRadius: 12,
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
          bottom: spacing.xl,
          right: spacing.lg,
          shadowColor: colors.shadow.brand.color,
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 12 },
          elevation: 6,
        }}
      >
        <LinearGradient
          colors={colors.brand.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={30} color={colors.brand.text} />
        </LinearGradient>
      </Pressable>

      <Modal visible={sheetVisible} animationType="slide" transparent onRequestClose={closeFilters}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1, backgroundColor: colors.overlay }} onPress={closeFilters} />
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.brand.text }}>Filtres</Text>
                <Text style={{ color: colors.brand.muted, marginTop: 4 }}>
                  Ajuste les categories, le temps estime ou ta zone.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={closeFilters}
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
                Categorie
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {REQUEST_CATEGORIES.map((category) => {
                  const selected = draftFilters.category === category;
                  return (
                    <Pressable
                      key={category}
                      onPress={() =>
                        setDraftFilters((previous) => ({
                          ...previous,
                          category: selected ? undefined : category,
                        }))
                      }
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 16,
                        backgroundColor: selected ? colors.brand.surfaceStrong : colors.brand.surfaceMuted,
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
                Temps estime max
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {ETA_OPTIONS.map((eta) => {
                  const selected = draftFilters.maxEta === eta;
                  return (
                    <Pressable
                      key={eta}
                      onPress={() =>
                        setDraftFilters((previous) => ({
                          ...previous,
                          maxEta: selected ? undefined : eta,
                        }))
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
                      <Text style={{ color: selected ? colors.semantic.success : colors.brand.muted, fontSize: 14 }}>
                        {'<= '} {eta} min
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
                const hood = NEIGHBORHOODS.find((item) => item.id === neighborhoodId);
                const km = Math.round((radiusMeters / 1000) * 10) / 10;
                setDraftFilters((previous) => ({
                  ...previous,
                  neighborhoodId,
                  radiusMeters,
                  area: hood ? `${hood.name} (~${km} km)` : previous.area,
                }));
              }}
            />

            <PrimaryButton
              title="Reinitialiser"
              variant="ghost"
              onPress={() => setDraftFilters({})}
            />
            <PrimaryButton title="Afficher les demandes" variant="success" onPress={applyDraftFilters} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
