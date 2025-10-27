import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import type { ConversationSummary } from '../services/mockApi';

type Props = {
  item: ConversationSummary;
  onPress?: (chatId: string) => void;
};

const categoryIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  Bricolage: 'construct-outline',
  Courses: 'cart-outline',
  Conseil: 'school-outline',
  Services: 'briefcase-outline',
  Discussion: 'chatbubble-ellipses-outline',
};

function timeLabel(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'Maintenant';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}

export function ConversationCard({ item, onPress }: Props) {
  const iconName = (item.requestCategory && categoryIcon[item.requestCategory]) || 'chatbubbles-outline';
  const unread = item.unreadCount ?? 0;
  return (
    <Pressable
      onPress={() => onPress?.(item.chatId)}
      style={{
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        padding: spacing.lg,
        flexDirection: 'row',
        gap: spacing.md,
        alignItems: 'center',
        shadowColor: colors.shadow.brand.color,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 20,
          backgroundColor: '#eef2ff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={iconName} size={24} color={colors.brand.text} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ fontWeight: '700', color: colors.brand.text }}>{item.requestTitle}</Text>
          <Text style={{ color: colors.brand.muted, fontSize: 12 }}>{timeLabel(item.lastMessage.createdAt)}</Text>
        </View>
        <Text style={{ color: colors.brand.muted, marginTop: 4 }}>{item.peer.name}</Text>
        <Text style={{ color: colors.brand.muted }} numberOfLines={1}>
          {item.lastMessage.body}
        </Text>
      </View>
      {unread > 0 ? (
        <View
          style={{
            minWidth: 28,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: colors.semantic.success,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '700' }}>{unread}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export default ConversationCard;
