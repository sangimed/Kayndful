import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../theme';
import { RequestCard } from '../../components/RequestCard';
import { ErrorState, OfflineState } from '../../components/StateCards';
import {
  getRequestById,
  getRequestConversationSummary,
  seedMockConversationWithRequest,
  type Request,
} from '../../services/mockApi';
import { useAuthStore } from '../../store/auth';
import { isOfflineError } from '../../utils/errors';
import { showErrorToast } from '../../utils/toast';

export default function RequestDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const requestId = params.id as string | undefined;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const currentUser = useAuthStore(
    (state) => state.currentUser ?? { id: 'me', name: 'Moi', skills: [], area: '' },
  );

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startingChat, setStartingChat] = useState(false);
  const [existingChatId, setExistingChatId] = useState<string | null>(null);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [offerStep, setOfferStep] = useState<'confirm' | 'success'>('confirm');
  const [conversationChatId, setConversationChatId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    try {
      const [data, summary] = await Promise.all([
        getRequestById(requestId),
        getRequestConversationSummary(requestId),
      ]);
      if (!data) {
        setError('Demande introuvable.');
        setRequest(null);
        setExistingChatId(null);
      } else {
        setRequest(data);
        setExistingChatId(summary?.chatId ?? null);
      }
      setOffline(false);
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
      } else {
        setError('Impossible de charger la demande.');
      }
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    load();
  }, [load]);

  const openOfferModal = () => {
    if (existingChatId || conversationChatId) {
      const chatId = conversationChatId ?? existingChatId;
      if (chatId) {
        router.push({ pathname: '/chat/[id]', params: { id: chatId } });
      }
      return;
    }
    setOfferStep('confirm');
    setConversationChatId(null);
    setOfferModalVisible(true);
  };

  const handleConfirmOffer = () => {
    if (!request) return;
    try {
      setStartingChat(true);
      const conv = seedMockConversationWithRequest(request.id, request.author.id);
      if (!conv) {
        showErrorToast("Impossible d'ouvrir la discussion.");
        return;
      }
      setConversationChatId(conv.chatId);
      setExistingChatId(conv.chatId);
      setOfferStep('success');
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        showErrorToast('Indisponible hors ligne.');
      } else {
        showErrorToast("Impossible d'ouvrir la discussion.");
      }
    } finally {
      setStartingChat(false);
    }
  };

  if (!requestId) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.gray,
        }}
      >
        <Text style={{ color: colors.brand.muted }}>Demande introuvable.</Text>
      </SafeAreaView>
    );
  }

  const backgroundColor = isDark ? colors.app.backgroundDark : colors.app.backgroundLight;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
      }}
    >
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
        }}
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
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.brand.text,
              flex: 1,
              marginHorizontal: spacing.md,
            }}
            numberOfLines={1}
          >
            {request?.title ?? 'Demande'}
          </Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {loading && !request && !error && !offline ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.brand.text} />
        </View>
      ) : offline ? (
        <View style={{ flex: 1, padding: spacing.lg }}>
          <OfflineState
            title="Mode hors ligne"
            subtitle="Reconnecte-toi pour voir les details de la demande."
            ctaLabel="Reessayer"
            onPress={load}
          />
        </View>
      ) : error || !request ? (
        <View style={{ flex: 1, padding: spacing.lg }}>
          <ErrorState
            title="Demande indisponible"
            subtitle={error ?? 'Demande introuvable.'}
            ctaLabel="Revenir au fil"
            onPress={() => router.replace('/feed')}
          />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.lg,
            }}
          >
            <View style={{ maxWidth: 480, alignSelf: 'center', width: '100%' }}>
              <RequestCard item={request} />
            </View>
            <View
              style={{
                marginTop: spacing.lg,
                padding: spacing.lg,
                borderRadius: radius.lg,
                backgroundColor: colors.brand.surface,
                borderWidth: 1,
                borderColor: colors.brand.border,
                gap: spacing.sm,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand.text }}>
                Details
              </Text>
              {request.description ? (
                <Text style={{ color: colors.brand.text }}>{request.description}</Text>
              ) : (
                <Text style={{ color: colors.brand.muted }}>
                  Aucune description supplementaire fournie.
                </Text>
              )}
            </View>
          </ScrollView>

          {request.author.id !== currentUser.id && (
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingBottom: spacing.lg + spacing.safeBottom,
                paddingTop: spacing.sm,
                backgroundColor,
              }}
            >
              <Pressable
                accessibilityRole="button"
                onPress={openOfferModal}
                disabled={startingChat}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                  paddingVertical: spacing.md,
                  borderRadius: radius.lg,
                  backgroundColor: colors.semantic.success,
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  {existingChatId || conversationChatId
                    ? 'Échanger avec le demandeur'
                    : startingChat
                      ? 'Ouverture de la discussion...'
                      : 'Proposer mon aide'}
                </Text>
              </Pressable>
            </View>
          )}

          <Modal
            visible={offerModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setOfferModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(15,23,42,0.55)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: spacing.lg,
              }}
            >
              <View
                style={{
                  width: '100%',
                  maxWidth: 420,
                  borderRadius: 24,
                  overflow: 'hidden',
                  backgroundColor: isDark ? colors.app.cardDark : colors.app.cardLight,
                  borderWidth: 1,
                  borderColor: colors.brand.border,
                }}
              >
                <LinearGradient
                  colors={colors.brand.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: spacing.lg,
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: 'rgba(15,23,42,0.15)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={offerStep === 'confirm' ? 'sparkles-outline' : 'chatbubbles-outline'}
                      size={32}
                      color={colors.brand.text}
                    />
                  </View>
                </LinearGradient>

                <View style={{ padding: spacing.lg, gap: spacing.md }}>
                  {offerStep === 'confirm' ? (
                    <>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '700',
                          textAlign: 'center',
                          color: colors.brand.text,
                        }}
                      >
                        Confirmer ta proposition d'aide ?
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: colors.brand.muted,
                        }}
                      >
                        Tu t'engages à proposer ton aide pour{' '}
                        <Text style={{ fontWeight: '600', color: colors.brand.text }}>
                          {request?.title ?? 'cette demande'}
                        </Text>
                        . Si tu confirmes, tu pourras discuter avec le demandeur pour organiser les
                        détails.
                      </Text>
                      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => setOfferModalVisible(false)}
                          style={{
                            flex: 1,
                            paddingVertical: spacing.md,
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: colors.brand.border,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isDark
                              ? colors.app.backgroundDark
                              : colors.brand.surface,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.brand.muted,
                              fontSize: 15,
                              fontWeight: '500',
                            }}
                          >
                            Annuler
                          </Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={handleConfirmOffer}
                          disabled={startingChat}
                          style={{
                            flex: 1,
                            paddingVertical: spacing.md,
                            borderRadius: radius.lg,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.semantic.success,
                          }}
                        >
                          {startingChat ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: '600',
                              }}
                            >
                              Oui, je peux aider
                            </Text>
                          )}
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '700',
                          textAlign: 'center',
                          color: colors.brand.text,
                        }}
                      >
                        Merci pour ton aide !
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          color: colors.brand.muted,
                        }}
                      >
                        Ta participation a bien été prise en compte. Nous te recommandons maintenant
                        de prendre contact avec le demandeur pour préciser les modalités.
                      </Text>
                      <View style={{ gap: spacing.sm }}>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            setOfferModalVisible(false);
                            if (conversationChatId) {
                              router.push({
                                pathname: '/chat/[id]',
                                params: { id: conversationChatId },
                              });
                            }
                          }}
                          style={{
                            paddingVertical: spacing.md,
                            borderRadius: radius.lg,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.semantic.success,
                          }}
                        >
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 15,
                              fontWeight: '600',
                            }}
                          >
                            Ouvrir la discussion
                          </Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => setOfferModalVisible(false)}
                          style={{
                            paddingVertical: spacing.md,
                            borderRadius: radius.lg,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: colors.brand.border,
                            backgroundColor: isDark
                              ? colors.app.backgroundDark
                              : colors.brand.surface,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.brand.muted,
                              fontSize: 15,
                              fontWeight: '500',
                            }}
                          >
                            Rester sur la demande
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}
