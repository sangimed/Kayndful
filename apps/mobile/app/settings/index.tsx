import React, { useState } from 'react';
import { Linking, SafeAreaView, ScrollView, Switch, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>Parametres</Text>
          <View style={{ width: 44 }} />
        </View>

        <View
          style={{
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.md,
            shadowColor: colors.shadow.brand.color,
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand.text }}>Notifications</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <Text style={{ fontWeight: '600', color: colors.brand.text }}>Alertes push</Text>
              <Text style={{ color: colors.brand.muted }}>
                Sois averti quand une demande proche correspond a tes competences.
              </Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.md,
            shadowColor: colors.shadow.brand.color,
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand.text }}>Theme</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.brand.text, fontWeight: '600' }}>Mode sombre (bientot)</Text>
            <Switch value={darkTheme} onValueChange={setDarkTheme} />
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.brand.surface,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.sm,
            shadowColor: colors.shadow.brand.color,
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 8 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand.text }}>Confidentialite</Text>
          <Text style={{ color: colors.brand.muted, lineHeight: 20 }}>
            Kayndful partage uniquement une localisation approximative. Nous affichons un quartier ou un rayon
            indique par l\'utilisateur, jamais une adresse precise.
          </Text>
          <Pressable onPress={() => Linking.openURL('https://kayndful.example/privacy')} accessibilityRole="link">
            <Text style={{ color: colors.brand.text, fontWeight: '600' }}>En savoir plus</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
