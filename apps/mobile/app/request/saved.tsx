import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, RefreshControl, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useRequestStore } from '../../store/requests';
import { RequestCard } from '../../components/RequestCard';
import { EmptyState, ErrorState, OfflineState } from '../../components/StateCards';
import { getRequestsByIds, isMockOffline, type Request } from '../../services/mockApi';
import { isOfflineError } from '../../utils/errors';

export default function SavedRequestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bookmarks = useRequestStore((state) => state.bookmarks);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(isMockOffline());
  const [items, setItems] = useState<Request[]>([]);

  const load = useCallback(async () => {
    if (!bookmarks.length) {
      setItems([]);
      setLoading(false);
      setOffline(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getRequestsByIds(bookmarks);
      setItems(data);
      setOffline(false);
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        setItems([]);
      } else {
        setError('Impossible de charger les demandes sauvegardees.');
      }
    } finally {
      setLoading(false);
    }
  }, [bookmarks]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const renderEmpty = () => {
    if (offline) {
      return (
        <OfflineState
          title="Mode hors ligne"
          subtitle="Reconnecte-toi pour acceder a tes favoris."
          ctaLabel="Reessayer"
          onPress={onRefresh}
        />
      );
    }
    if (error) {
      return (
        <ErrorState
          title="Impossible de charger"
          subtitle={error}
          ctaLabel="Reessayer"
          onPress={onRefresh}
        />
      );
    }
    return (
      <EmptyState
        title="Aucune demande sauvegardee"
        subtitle="Ajoute des demandes a ta liste pour les retrouver facilement."
        ctaLabel="Explorer"
        onPress={() => router.replace('/feed')}
      />
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
            Sauvegardees
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <Text style={{ color: colors.brand.muted, marginTop: spacing.sm }}>
          Retrouve ici les demandes que tu as mises de cote.
        </Text>
      </View>

      {loading && !items.length ? (
        <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
          <EmptyState title="Chargement" subtitle="Nous recuperons tes demandes sauvegardees." />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: spacing.lg,
            gap: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          renderItem={({ item }) => (
            <RequestCard item={item} onPress={(id) => router.push(`/request/${id}`)} />
          )}
          ListEmptyComponent={renderEmpty()}
          refreshControl={
            <RefreshControl
              tintColor={colors.brand.text}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
}
