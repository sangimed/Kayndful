import React, { useCallback, useState } from 'react';
import { FlatList, Platform, Pressable, RefreshControl, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { ConversationCard } from '../../components/ConversationCard';
import { SkeletonConversationCard } from '../../components/Skeletons';
import {
  getConversations,
  markConversationAsRead,
  type ConversationSummary,
} from '../../services/mockApi';
import { EmptyState, ErrorState, OfflineState } from '../../components/StateCards';
import { isOfflineError } from '../../utils/errors';
import { showErrorToast } from '../../utils/toast';

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getConversations('me');
      setItems(res);
      setOffline(false);
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        setItems([]);
      } else {
        setError('Impossible de charger vos discussions.');
      }
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setOffline(false);
    await load();
    setRefreshing(false);
  }, [load]);

  const openChat = async (chatId: string) => {
    try {
      await markConversationAsRead(chatId, 'me');
      setItems((prev) =>
        prev.map((conv) => (conv.chatId === chatId ? { ...conv, unreadCount: 0 } : conv)),
      );
      router.push({ pathname: '/chat/[id]', params: { id: chatId } });
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        showErrorToast('Indisponible hors ligne.');
      } else {
        showErrorToast("Impossible d'ouvrir la discussion.");
      }
    }
  };

  const isInitialLoading = initialLoad && loading && items.length === 0;

  const renderEmpty = () => {
    if (offline) {
      return (
        <OfflineState
          title="Mode hors ligne"
          subtitle="Reconnecte-toi pour voir tes discussions."
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
        title="Aucune discussion"
        subtitle="Quand une demande commence, elle apparaitra ici."
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
            Discussions
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={load}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="refresh" size={22} color={colors.brand.text} />
          </Pressable>
        </View>
        <Text style={{ color: colors.brand.muted, marginTop: spacing.sm }}>
          Reste en contact avec les voisins et les demandes en cours.
        </Text>
      </View>

      {isInitialLoading ? (
        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}>
          {[0, 1, 2].map((key) => (
            <SkeletonConversationCard key={key} />
          ))}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.lg,
          }}
          renderItem={({ item }) => <ConversationCard item={item} onPress={openChat} />}
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
