import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import {
  getConversations,
  getMessages,
  markConversationAsRead,
  sendMessage,
  type ConversationSummary,
  type Message,
} from '../../services/mockApi';
import { useAuthStore } from '../../store/auth';
import { OfflineState, ErrorState } from '../../components/StateCards';
import { isOfflineError } from '../../utils/errors';
import { showErrorToast } from '../../utils/toast';

type ChatHeader = {
  title: string;
  subtitle?: string;
  peerName?: string;
  peerId?: string;
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const chatId = params.id as string | undefined;
  const currentUser = useAuthStore(
    (state) => state.currentUser ?? { id: 'me', name: 'Moi', skills: [], area: '' },
  );

  const [header, setHeader] = useState<ChatHeader>({ title: 'Discussion' });
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const load = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    setError(null);
    try {
      const [messagesRes, convRes] = await Promise.all([
        getMessages(chatId),
        getConversations('me'),
      ]);
      setItems(messagesRes);
      const summary: ConversationSummary | undefined = convRes.find((c) => c.chatId === chatId);
      if (summary) {
        setHeader({
          title: summary.peer.name,
          subtitle: summary.requestTitle,
          peerName: summary.peer.name,
          peerId: summary.peer.id,
        });
      }
      await markConversationAsRead(chatId, currentUser.id);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: false });
      });
      setOffline(false);
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        setItems([]);
      } else {
        setError('Impossible de charger la discussion.');
      }
    } finally {
      setLoading(false);
    }
  }, [chatId, currentUser.id]);

  useEffect(() => {
    load();
  }, [load]);

  const onSend = async () => {
    if (!message.trim() || !chatId) return;
    try {
      const outbound = await sendMessage({
        chatId,
        fromId: currentUser.id,
        toId: header.peerId ?? 'neighbor',
        body: message,
      });
      setItems((prev) => [...prev, outbound]);
      setMessage('');
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
      setOffline(false);
    } catch (err) {
      if (isOfflineError(err)) {
        setOffline(true);
        showErrorToast("Impossible d'envoyer le message hors ligne.");
      } else {
        showErrorToast('Envoi du message impossible.');
      }
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.fromId === currentUser.id;
    return (
      <View
        style={{
          alignItems: isMine ? 'flex-end' : 'flex-start',
          marginBottom: spacing.sm,
        }}
      >
        <View
          style={{
            maxWidth: '80%',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: radius.md,
            backgroundColor: isMine ? '#dbeafe' : colors.brand.surface,
            borderTopRightRadius: isMine ? radius.md : 6,
            borderTopLeftRadius: isMine ? 6 : radius.md,
            shadowColor: colors.shadow.brand.color,
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 4 },
            elevation: 1,
            borderWidth: isMine ? 0 : 1,
            borderColor: isMine ? 'transparent' : colors.brand.border,
          }}
        >
          <Text style={{ color: colors.brand.text }}>{item.body}</Text>
        </View>
      </View>
    );
  };

  if (!chatId) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.gray,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Text style={{ color: colors.brand.muted }}>Discussion introuvable.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={90}
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
            <View style={{ flex: 1, marginHorizontal: spacing.md }}>
              <Text
                style={{ fontSize: 18, fontWeight: '700', color: colors.brand.text }}
                numberOfLines={1}
              >
                {header.title}
              </Text>
              {header.subtitle ? (
                <Text style={{ color: colors.brand.muted }} numberOfLines={1}>
                  {header.subtitle}
                </Text>
              ) : null}
            </View>
            <View style={{ width: 44 }} />
          </View>
        </View>

        {(() => {
          if (loading && items.length === 0) {
            return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={colors.brand.text} />
              </View>
            );
          }
          if (offline) {
            return (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <OfflineState
                  title="Mode hors ligne"
                  subtitle="Reconnecte-toi pour poursuivre la discussion."
                  ctaLabel="Reessayer"
                  onPress={load}
                />
              </View>
            );
          }
          if (error) {
            return (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ErrorState
                  title="Discussion indisponible"
                  subtitle={error}
                  ctaLabel="Reessayer"
                  onPress={load}
                />
              </View>
            );
          }
          return (
            <FlatList
              ref={listRef}
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            />
          );
        })()}

        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingBottom: Platform.select({ ios: spacing.lg, android: spacing.lg }),
            backgroundColor: colors.gray,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              backgroundColor: colors.brand.surface,
              borderRadius: radius.lg,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              borderWidth: 1,
              borderColor: colors.brand.border,
            }}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ton message"
              placeholderTextColor={colors.brand.muted}
              multiline
              style={{ flex: 1, minHeight: 46, maxHeight: 120, color: colors.brand.text }}
            />
            <Pressable
              accessibilityRole="button"
              onPress={onSend}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="send" size={22} color={colors.brand.text} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
