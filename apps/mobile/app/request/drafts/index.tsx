import React from 'react';
import { FlatList, SafeAreaView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../../theme';
import { useRequestStore } from '../../../store/requests';
import { EmptyState } from '../../../components/StateCards';
import { PrimaryButton } from '../../../components/Button';
import { showSuccessToast } from '../../../utils/toast';

export default function DraftsScreen() {
  const router = useRouter();
  const { drafts, deleteDraft, clearDrafts } = useRequestStore((state) => ({
    drafts: Object.values(state.drafts),
    deleteDraft: state.deleteDraft,
    clearDrafts: state.clearDrafts,
  }));

  const sortedDrafts = [...drafts].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));

  if (!sortedDrafts.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray }}>
        <View style={{ padding: spacing.lg }}>
          <Header onPressBack={() => router.back()} onPressClear={() => {}} showClear={false} />
        </View>
        <EmptyState
          title="Aucun brouillon"
          subtitle="Commence une demande et elle apparaitra ici automatiquement."
          ctaLabel="Creer une demande"
          onPress={() => router.push('/request/new')}
        />
      </SafeAreaView>
    );
  }

  const handleClearAll = () => {
    clearDrafts();
    showSuccessToast('Tous les brouillons ont ete supprimes.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
        <Header onPressBack={() => router.back()} onPressClear={handleClearAll} showClear />
      </View>
      <FlatList
        data={sortedDrafts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/request/new', params: { draftId: item.id } })}
            style={{
              backgroundColor: colors.brand.surface,
              borderRadius: radius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.brand.border,
              gap: spacing.sm,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand.text }}>
                {item.title || 'Brouillon sans titre'}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  deleteDraft(item.id);
                  showSuccessToast('Brouillon supprime.');
                }}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.semantic.danger} />
              </Pressable>
            </View>
            <Text style={{ color: colors.brand.muted }} numberOfLines={2}>
              {item.description || 'Ajoute une description pour attirer les voisins.'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.brand.muted, fontSize: 12 }}>
                {item.category ?? 'Categorie a definir'} • {item.eta ? `${item.eta} min` : 'Temps?' }
              </Text>
              <Text style={{ color: colors.brand.muted, fontSize: 12 }}>
                Modifie le {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
        )}
      />
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <PrimaryButton title="Nouvelle demande" onPress={() => router.push('/request/new')} variant="success" />
      </View>
    </SafeAreaView>
  );
}

function Header({ onPressBack, onPressClear, showClear }: { onPressBack: () => void; onPressClear: () => void; showClear: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPressBack}
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
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>Mes brouillons</Text>
      {showClear ? (
        <Pressable accessibilityRole="button" onPress={onPressClear}>
          <Text style={{ color: colors.brand.muted }}>Tout effacer</Text>
        </Pressable>
      ) : (
        <View style={{ width: 44 }} />
      )}
    </View>
  );
}
