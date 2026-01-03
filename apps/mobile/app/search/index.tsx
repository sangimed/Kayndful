import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { RequestCard } from '../../components/RequestCard';
import MapPreview from '../../components/MapPreview';
import ZoneSelector from '../../components/ZoneSelector';
import { REQUEST_CATEGORIES } from '../../constants/requests';
import { searchRequests, NEIGHBORHOODS, type Request } from '../../services/mockApi';
import { EmptyState, ErrorState, OfflineState } from '../../components/StateCards';
import { isOfflineError } from '../../utils/errors';

type ViewMode = 'list' | 'map';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string | undefined>();
  const [selectedRadius, setSelectedRadius] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [items, setItems] = useState<Request[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const filters = useMemo(
    () => ({
      query,
      neighborhoodId: selectedNeighborhoodId,
      radiusMeters: selectedRadius,
      category: selectedCategory,
    }),
    [query, selectedNeighborhoodId, selectedRadius, selectedCategory],
  );

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchRequests(filters);
      setItems(results);
      setOffline(false);
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        setItems([]);
      } else {
        setError('Impossible de rechercher des demandes.');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 250);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderEmpty = () => {
    if (offline) {
      return (
        <OfflineState
          title="Mode hors ligne"
          subtitle="Reconnecte-toi pour lancer une recherche."
          ctaLabel="Reessayer"
          onPress={fetchData}
        />
      );
    }
    if (error) {
      return (
        <ErrorState
          title="Recherche indisponible"
          subtitle={error}
          ctaLabel="Reessayer"
          onPress={fetchData}
        />
      );
    }
    return (
      <EmptyState title="Aucun resultat" subtitle="Essaie de modifier ton rayon ou le mot-cle." />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md }}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.brand.surface,
              borderWidth: 1,
              borderColor: colors.brand.border,
            }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.brand.text} />
          </Pressable>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>
            Recherche
          </Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            paddingHorizontal: spacing.md,
            borderWidth: 1,
            borderColor: colors.brand.border,
          }}
        >
          <Ionicons
            name="search"
            size={18}
            color={colors.brand.muted}
            style={{ marginRight: spacing.sm }}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher une demande (objet, categorie...)"
            placeholderTextColor={colors.brand.muted}
            style={{ flex: 1, height: 44, color: colors.brand.text }}
          />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {REQUEST_CATEGORIES.map((cat) => {
            const selected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(selected ? undefined : cat)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: 16,
                  backgroundColor: selected
                    ? colors.brand.surfaceStrong
                    : colors.brand.surfaceMuted,
                  borderWidth: selected ? 1 : 0,
                  borderColor: selected ? colors.brand.text : 'transparent',
                }}
              >
                <Text style={{ color: colors.brand.text }}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>

        <ZoneSelector
          selectedNeighborhoodId={selectedNeighborhoodId}
          selectedRadius={selectedRadius}
          neighborhoods={NEIGHBORHOODS}
          onChange={({ neighborhoodId, radiusMeters }) => {
            setSelectedNeighborhoodId(neighborhoodId);
            setSelectedRadius(radiusMeters);
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.brand.border,
          }}
        >
          {(['list', 'map'] as ViewMode[]).map((mode) => {
            const selected = viewMode === mode;
            return (
              <Pressable
                key={mode}
                onPress={() => setViewMode(mode)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: spacing.sm,
                  backgroundColor: selected ? colors.brand.surfaceStrong : 'transparent',
                  borderRadius: radius.lg,
                }}
              >
                <Text
                  style={{
                    color: selected ? colors.brand.text : colors.brand.muted,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {mode === 'list' ? 'Liste' : 'Carte'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ flex: 1, padding: spacing.lg }}>
        {loading && !items.length ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={colors.brand.text} />
          </View>
        ) : viewMode === 'map' ? (
          <MapPreview
            requests={items}
            neighborhoodId={selectedNeighborhoodId}
            radiusMeters={selectedRadius}
            onSelectRequest={(id) => router.push(`/request/${id}`)}
          />
        ) : items.length ? (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ marginBottom: spacing.lg }}>
                <RequestCard item={item} onPress={(id) => router.push(`/request/${id}`)} />
              </View>
            )}
            refreshControl={
              <RefreshControl
                tintColor={colors.brand.text}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        ) : (
          renderEmpty()
        )}
      </View>
    </View>
  );
}
