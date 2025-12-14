import React from 'react';
import { Platform, ScrollView, StatusBar, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { useAuthStore } from '../../store/auth';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const user = currentUser ?? {
    id: 'me',
    name: 'Alex Martin',
    bio: 'Toujours pret a aider dans le quartier.',
    skills: ['Bricolage'],
    area: 'Belleville (~800 m)',
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
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
          paddingBottom: spacing.xl + spacing.safeBottom,
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
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>
            Mon compte
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/settings')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Ionicons name="settings-outline" size={22} color={colors.brand.text} />
          </Pressable>
        </View>

        <View
          style={{
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.md,
            shadowColor: colors.shadow.brand.color,
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                backgroundColor: colors.brand.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person-circle-outline" size={48} color={colors.brand.text} />
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.brand.text }}>
                {user.name}
              </Text>
              <Text style={{ color: colors.brand.muted, marginTop: 4 }}>{user.area}</Text>
            </View>
          </View>
          {user.bio ? <Text style={{ color: colors.brand.muted }}>{user.bio}</Text> : null}

          {user.skills?.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
              {user.skills.map((skill) => (
                <View
                  key={skill}
                  style={{
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: 999,
                    backgroundColor: colors.brand.surfaceStrong,
                  }}
                >
                  <Text style={{ color: colors.brand.text, fontSize: 12 }}>{skill}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <PrimaryButton
          title="Editer le profil"
          variant="success"
          onPress={() => router.push('/account/edit')}
        />
        <PrimaryButton title="Mes discussions" onPress={() => router.push('/inbox')} />
        <PrimaryButton
          title="Mes contributions"
          onPress={() => router.push('/request/contributions')}
        />
        <PrimaryButton title="Mes brouillons" onPress={() => router.push('/request/drafts')} />
        <PrimaryButton title="Sauvegardees" onPress={() => router.push('/request/saved')} />
        <PrimaryButton
          title="Parametres"
          variant="ghost"
          onPress={() => router.push('/settings')}
        />
      </ScrollView>
    </View>
  );
}
