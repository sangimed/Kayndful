import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
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
import { colors, radius, spacing } from '../../theme';
import { RequestCard } from '../../components/RequestCard';
import { EmptyState, ErrorState, OfflineState } from '../../components/StateCards';
import {
  getConversations,
  getRequestsByIds,
  isMockOffline,
  type ConversationSummary,
  type Request,
} from '../../services/mockApi';
import { isOfflineError } from '../../utils/errors';

type FilterMode = 'all' | 'unread' | 'completed';

type ContributionItem = {
  request: Request;
  conversation: ConversationSummary;
};

export default function ContributionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(isMockOffline());
  const [items, setItems] = useState<ContributionItem[]>([]);
  const [filter, setFilter] = useState<FilterMode>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const conversations = await getConversations('me');
      const withRequestId = conversations.filter((conv) => Boolean(conv.requestId));
      if (!withRequestId.length) {
        setItems([]);
        setOffline(false);
        return;
      }
      const requestIds = withRequestId.map((conv) => conv.requestId);
      const requests = await getRequestsByIds(requestIds);
      const byId = new Map(requests.map((req) => [req.id, req]));
      const contributions: ContributionItem[] = withRequestId
        .map((conv) => {
          const request = byId.get(conv.requestId);
          return request ? { request, conversation: conv } : undefined;
        })
        .filter((item): item is ContributionItem => Boolean(item));
      setItems(contributions);
      setOffline(false);
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        setItems([]);
      } else {
        setError('Impossible de charger vos contributions.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filteredItems = useMemo(() => {
    if (filter === 'unread') {
      return items.filter((item) => item.conversation.unreadCount > 0);
    }
    if (filter === 'completed') {
      return items.filter((item) => item.conversation.isCompletedByRequester);
    }
    return items;
  }, [filter, items]);

  const renderEmpty = () => {
    if (offline) {
      return (
        <OfflineState
          title="Mode hors ligne"
          subtitle="Reconnecte-toi pour voir tes contributions."
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
        title="Aucune contribution"
        subtitle="Accepte d'aider sur une demande et elle apparaitra ici."
        ctaLabel="Explorer les demandes"
        onPress={() => router.replace('/feed')}
      />
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.gray,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
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
            Mes contributions
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <Text style={{ color: colors.brand.muted, marginTop: spacing.sm }}>
          Retrouve ici les demandes pour lesquelles tu as proposé ton aide.
        </Text>

        <View
          style={{
            marginTop: spacing.md,
            flexDirection: 'row',
            gap: spacing.sm,
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            padding: 4,
            borderWidth: 1,
            borderColor: colors.brand.border,
          }}
        >
          {(['all', 'unread', 'completed'] as FilterMode[]).map((mode) => {
            const selected = filter === mode;
            return (
              <Pressable
                key={mode}
                accessibilityRole="button"
                onPress={() => setFilter(mode)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: radius.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected ? colors.brand.surfaceStrong : 'transparent',
                }}
              >
                <Text
                  style={{
                    color: selected ? colors.brand.text : colors.brand.muted,
                    fontWeight: selected ? '700' : '500',
                  }}
                >
                  {mode === 'all'
                    ? 'Toutes'
                    : mode === 'unread'
                      ? 'Avec nouveaux messages'
                      : 'Contributions terminées'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loading && !items.length ? (
        <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
          <EmptyState title="Chargement" subtitle="Nous recuperons tes contributions." />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.conversation.id}
          contentContainerStyle={{
            padding: spacing.lg,
            gap: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          renderItem={({ item }) => (
            <View style={{ gap: spacing.xs }}>
              <RequestCard item={item.request} onPress={(id) => router.push(`/request/${id}`)} />
              {item.conversation.unreadCount > 0 ? (
                <Text
                  style={{
                    color: colors.semantic.success,
                    fontSize: 12,
                    marginLeft: spacing.sm,
                  }}
                >
                  {item.conversation.unreadCount}{' '}
                  {item.conversation.unreadCount > 1 ? 'nouveaux messages' : 'nouveau message'} dans
                  la discussion.
                </Text>
              ) : null}
            </View>
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
    </SafeAreaView>
  );
}
