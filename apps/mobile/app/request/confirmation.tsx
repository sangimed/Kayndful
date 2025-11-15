import React from 'react';
import { View, Text, SafeAreaView, Pressable, useColorScheme, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { formatDuration } from '../../utils/requestValidation';

export default function RequestConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title: string;
    category: string;
    duration: string;
    volunteers: string;
    isDraft: string;
  }>();

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const textPrimary = isDark ? '#E5E7EB' : colors.brand.text;
  const textMuted = isDark ? '#9CA3AF' : colors.brand.muted;
  const cardBg = isDark ? colors.app.cardDark : colors.app.cardLight;

  const isDraft = params.isDraft === 'true';
  const durationNum = parseInt(params.duration || '60', 10);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.app.backgroundDark : colors.app.backgroundLight },
      ]}
    >
      <View style={styles.content}>
        {/* Icône de succès */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={isDraft ? ['#FEF3C7', '#FDE047'] : colors.semantic.successGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Ionicons
              name={isDraft ? 'document-text' : 'checkmark-circle'}
              size={64}
              color={isDraft ? '#CA8A04' : colors.semantic.success}
            />
          </LinearGradient>
        </View>

        {/* Titre */}
        <Text style={[styles.title, { color: textPrimary }]}>
          {isDraft ? 'Brouillon enregistré' : 'Demande publiée !'}
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: textMuted }]}>
          {isDraft
            ? 'Votre brouillon a été sauvegardé. Vous pourrez le modifier et le publier plus tard.'
            : 'Votre demande a été publiée avec succès. Les volontaires pourront la voir et y répondre.'}
        </Text>

        {/* Résumé */}
        <View style={[styles.summaryCard, { backgroundColor: cardBg }]}>
          <View style={styles.summaryRow}>
            <Ionicons name="document-text-outline" size={20} color={textMuted} />
            <Text style={[styles.summaryLabel, { color: textMuted }]}>Titre</Text>
            <Text style={[styles.summaryValue, { color: textPrimary }]} numberOfLines={2}>
              {params.title || 'Sans titre'}
            </Text>
          </View>

          {params.category && (
            <View style={styles.summaryRow}>
              <Ionicons name="pricetag-outline" size={20} color={textMuted} />
              <Text style={[styles.summaryLabel, { color: textMuted }]}>Catégorie</Text>
              <Text style={[styles.summaryValue, { color: textPrimary }]}>{params.category}</Text>
            </View>
          )}

          {params.duration && (
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={20} color={textMuted} />
              <Text style={[styles.summaryLabel, { color: textMuted }]}>Durée estimée</Text>
              <Text style={[styles.summaryValue, { color: textPrimary }]}>
                {formatDuration(durationNum)}
              </Text>
            </View>
          )}

          {params.volunteers && (
            <View style={styles.summaryRow}>
              <Ionicons name="people-outline" size={20} color={textMuted} />
              <Text style={[styles.summaryLabel, { color: textMuted }]}>Volontaires max</Text>
              <Text style={[styles.summaryValue, { color: textPrimary }]}>{params.volunteers}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          title="Voir mes brouillons"
          variant="ghost"
          onPress={() => router.replace('/request/drafts')}
          style={{ marginBottom: spacing.sm }}
        />
        <PrimaryButton
          title="Créer une nouvelle demande"
          variant="success"
          onPress={() => router.replace('/request/new')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  summaryCard: {
    width: '100%',
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    padding: spacing.lg,
  },
});
