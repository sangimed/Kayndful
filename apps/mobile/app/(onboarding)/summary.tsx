import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius } from '../../theme';
import ProgressHeader from '../../components/ProgressHeader';
import BackButton from '../../components/BackButton';
import { PrimaryButton } from '../../components/Button';
import { useOnboarding, formatDisplayName } from '../../store/onboarding';
import { useI18n } from '../../i18n';

const BG = '#FFF6EF';

export default function SummaryStep() {
  const router = useRouter();
  const { state } = useOnboarding();
  const { t } = useI18n();

  const displayName = useMemo(() => formatDisplayName(state.identity), [state.identity]);

  const visibilityText =
    state.identity.visibility === 'initial'
      ? t('summary_visibility_initial')
      : t('summary_visibility_hidden');

  const locationText = useMemo(() => {
    const { address, zip, city } = state.location;
    if (address && address.trim()) return address;
    if (zip || city) return [zip, city].filter(Boolean).join(' ');
    return t('summary_location_missing');
  }, [state.location, t]);

  const skillsLabels = useMemo(() => {
    const map: Record<string, string> = {
      repairs: t('skills_repairs'),
      cleaning: t('skills_cleaning'),
      digital: t('skills_digital'),
      grocery: t('skills_grocery'),
      tutoring: t('skills_tutoring'),
      admin: t('skills_admin'),
      pet: t('skills_pet'),
      emotional: t('skills_emotional'),
      activities: t('skills_activities'),
      other: t('skills_other'),
    };
    const labels = state.skills.skills.map((k) => map[k] || k);
    if (state.skills.other?.trim()) labels.push(state.skills.other.trim());
    return labels.length ? labels : [t('summary_skills_missing')];
  }, [state.skills, t]);

  const timesMap: Record<string, string> = {
    mornings: t('time_mornings'),
    afternoons: t('time_afternoons'),
    evenings: t('time_evenings'),
    weekends: t('time_weekends'),
  };
  const timesText = state.availability.times.length
    ? state.availability.times.map((k) => timesMap[k] || k).join(', ')
    : t('summary_times_missing');

  const radiusText = `${state.availability.radiusKm} ${t('km')}`;
  const modeMap: Record<string, string> = {
    in_person: t('mode_in_person'),
    remote: t('mode_remote'),
    both: t('mode_both'),
  };
  const modeText = modeMap[state.availability.mode] || state.availability.mode;

  const onFinish = () => {
    // Navigate to the main app (tabs)
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <BackButton style={{ marginBottom: spacing.lg }} />

          <ProgressHeader step={6} total={6} title={t('onboarding_step6_title')} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('summary_identity')}</Text>
            <View style={styles.row}>
              {state.profile.avatarUri ? (
                <Image source={{ uri: state.profile.avatarUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{displayName || t('summary_name_missing')}</Text>
                <Text style={styles.meta}>
                  @{state.identity.username || t('summary_username_missing')}
                </Text>
                <Text style={styles.meta}>{visibilityText}</Text>
              </View>
            </View>
            {state.profile.bio ? <Text style={styles.bio}>{state.profile.bio}</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('summary_location')}</Text>
            <Text style={styles.body}>{locationText}</Text>
            {state.location.usedCurrentLocation && (
              <Text style={styles.hint}>{t('location_privacy_note')}</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('summary_skills')}</Text>
            <Text style={styles.body}>{skillsLabels.join(', ')}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('summary_availability')}</Text>
            <Text style={styles.body}>{timesText}</Text>
            <Text style={styles.body}>
              {t('availability_radius')}: {radiusText}
            </Text>
            <Text style={styles.body}>
              {t('availability_mode')}: {modeText}
            </Text>
          </View>

          <View style={{ height: spacing.lg }} />

          <PrimaryButton title={t('start_exploring')} onPress={onFinish} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  cardTitle: { fontWeight: '700', color: colors.brand.text, marginBottom: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: { backgroundColor: '#F2E7DF' },
  name: { fontSize: 18, fontWeight: '700', color: colors.brand.text },
  meta: { color: colors.brand.muted, marginTop: 2 },
  bio: { marginTop: spacing.sm, color: colors.brand.text },
  body: { color: colors.brand.text },
  hint: { marginTop: spacing.xs, color: colors.brand.muted },
});
