import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import {
  getRequestById,
  getRequestMessages,
  getRequestConversationSummary,
  markConversationAsRead,
  seedMockConversationWithRequest,
  type Request,
  type Message,
} from '../../services/mockApi';
import { PrimaryButton } from '../../components/Button';
import { ReportModal } from '../../components/ReportModal';
import { EmptyState } from '../../components/StateCards';
import { useRequestStore } from '../../store/requests';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import { isOfflineError } from '../../utils/errors';

function formatRelative(dateIso?: string) {
  if (!dateIso) return '';
  const diff = Date.now() - new Date(dateIso).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'A l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} j`;
}

export default function RequestDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const requestId = params.id;
  const [request, setRequest] = useState<Request | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportVisible, setReportVisible] = useState(false);
  const [thread, setThread] = useState<Message[]>([]);
  const [threadLoading, setThreadLoading] = useState(true);
  const toggleBookmark = useRequestStore((state) => state.toggleBookmark);
  const isBookmarked = useRequestStore((state) => (requestId ? state.bookmarks.includes(requestId) : false));

  useEffect(() => {
    let mounted = true;
    const loadRequest = async () => {
      if (!requestId) {
        setError('Demande introuvable.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getRequestById(requestId as string);
        if (mounted) {
          setRequest(data);
          setError(data ? null : 'Demande introuvable.');
        }
      } catch (err) {
        if (mounted) setError(isOfflineError(err) ? 'Demande indisponible hors ligne.' : 'Impossible de charger la demande.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadRequest();
    return () => {
      mounted = false;
    };
  }, [requestId]);

  useEffect(() => {
    let mounted = true;
    const loadThread = async () => {
      if (!requestId) return;
      setThreadLoading(true);
      try {
        const summary = await getRequestConversationSummary(requestId);
        const messages = await getRequestMessages(requestId);
        if (summary) {
          await markConversationAsRead(summary.chatId, 'me');
        }
        if (mounted) {
          setThread(messages);
        }
      } catch (err) {
        if (!mounted) return;
        if (isOfflineError(err)) {
          setError('Thread indisponible hors ligne.');
        }
      } finally {
        if (mounted) setThreadLoading(false);
      }
    };
    loadThread();
    return () => {
      mounted = false;
    };
  }, [requestId]);

  const infoRows = useMemo(() => {
    if (!request) return [];
    return [
      {
        icon: 'pricetag-outline' as const,
        label: request.category,
      },
      {
        icon: 'time-outline' as const,
        label: `${request.eta} min`,
      },
      {
        icon: 'location-outline' as const,
        label: `${request.area} - Localisation approximative`,
      },
    ];
  }, [request]);

  const handleOfferHelp = async () => {
    if (!request) return;
    try {
      const conversation = seedMockConversationWithRequest(request.id, request.author.id);
      await markConversationAsRead(conversation.chatId, 'me');
      router.push({ pathname: '/chat/[id]', params: { id: conversation.chatId } });
    } catch (err) {
      if (isOfflineError(err)) {
        showErrorToast('Indisponible hors ligne.');
      }
    }
  };

  const handleReport = (payload: { reason: string; details?: string }) => {
    showSuccessToast(`Signalement envoye: ${payload.reason}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray }}>
        <ActivityIndicator color={colors.brand.text} />
      </SafeAreaView>
    );
  }

  if (error || !request) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.gray }}>
        <Text style={{ color: colors.brand.muted, textAlign: 'center' }}>{error ?? 'Demande introuvable.'}</Text>
        <PrimaryButton title="Retour" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
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
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>Demande</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Pressable
              accessibilityRole="button"
              onPress={() => toggleBookmark(request.id)}
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
              <Ionicons
                name={isBookmarked ? 'star' : 'star-outline'}
                size={20}
                color={isBookmarked ? colors.semantic.success : colors.brand.muted}
              />
            </Pressable>
            <Pressable
              onPress={() => setReportVisible(true)}
              accessibilityRole="button"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fee2e2',
                borderWidth: 1,
                borderColor: colors.semantic.danger,
              }}
            >
              <Ionicons name="alert-circle" size={20} color={colors.semantic.danger} />
            </Pressable>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.md,
            shadowColor: colors.shadow.brand.color,
            shadowOpacity: 0.06,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 10 },
            elevation: 3,
          }}
        >
          <View style={{ gap: spacing.xs }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.brand.text }}>{request.title}</Text>
            <Text style={{ color: colors.brand.muted }}>{formatRelative(request.createdAt)}</Text>
          </View>

          <View style={{ gap: spacing.sm }}>
            {infoRows.map((row) => (
              <View key={row.icon} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Ionicons name={row.icon} size={18} color={colors.brand.muted} />
                <Text style={{ color: colors.brand.muted }}>{row.label}</Text>
              </View>
            ))}
          </View>

          {request.description ? (
            <View style={{ gap: spacing.xs }}>
              <Text style={{ fontWeight: '600', color: colors.brand.text }}>Details</Text>
              <Text style={{ color: colors.brand.muted, lineHeight: 20 }}>{request.description}</Text>
            </View>
          ) : null}

          <View
            style={{
              borderWidth: 1,
              borderColor: colors.brand.border,
              borderRadius: radius.md,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              backgroundColor: colors.brand.surfaceMuted,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.brand.surfaceStrong,
              }}
            >
              <Ionicons name="person-outline" size={22} color={colors.brand.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: colors.brand.text }}>{request.author.name}</Text>
              <Text style={{ color: colors.brand.muted }}>Localise a {request.area}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={handleOfferHelp}
              style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, backgroundColor: '#dcfce7' }}
            >
              <Text style={{ color: colors.semantic.success, fontWeight: '600' }}>Contacter</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={{ fontWeight: '700', color: colors.brand.text }}>Echanges</Text>
          {threadLoading && !thread.length ? (
            <View style={{ padding: spacing.md, alignItems: 'center', backgroundColor: colors.brand.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.brand.border }}>
              <ActivityIndicator color={colors.brand.text} />
            </View>
          ) : !thread.length ? (
            <EmptyState
              title="Aucun message"
              subtitle="Commence une conversation pour aider ce voisin."
              ctaLabel="Envoyer un message"
              onPress={handleOfferHelp}
            />
          ) : (
            <View
              style={{
                backgroundColor: colors.brand.surface,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.brand.border,
                padding: spacing.md,
              }}
            >
              <FlatList
                data={thread.slice(-4)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: spacing.sm }}>
                    <Text style={{ fontWeight: '600', color: colors.brand.text }}>{item.fromId === 'me' ? 'Moi' : 'Voisin'}</Text>
                    <Text style={{ color: colors.brand.muted }}>{item.body}</Text>
                    <Text style={{ color: colors.brand.muted, fontSize: 12 }}>{formatRelative(item.createdAt)}</Text>
                  </View>
                )}
                scrollEnabled={false}
              />
              <PrimaryButton
                title="Continuer la discussion"
                onPress={handleOfferHelp}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          )}
        </View>

        <View style={{ gap: spacing.sm }}>
          <PrimaryButton title="Offrir mon aide" variant="success" onPress={handleOfferHelp} />
          <PrimaryButton title="Signaler" variant="danger" onPress={() => setReportVisible(true)} />
        </View>
      </ScrollView>

      <ReportModal visible={reportVisible} onClose={() => setReportVisible(false)} onConfirm={handleReport} />
    </SafeAreaView>
  );
}
