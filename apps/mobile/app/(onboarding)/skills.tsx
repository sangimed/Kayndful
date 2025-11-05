import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../theme';
import ProgressHeader from '../../components/ProgressHeader';
import StepFooter from '../../components/StepFooter';
import BackButton from '../../components/BackButton';
import Chip from '../../components/Chip';
import FormInput from '../../components/FormInput';
import { useOnboarding } from '../../store/onboarding';
import { useI18n } from '../../i18n';

const BG = '#FFF6EF';

const CATEGORIES = [
  'repairs',
  'cleaning',
  'digital',
  'grocery',
  'tutoring',
  'admin',
  'pet',
  'emotional',
  'activities',
  'other',
] as const;

type CategoryId = (typeof CATEGORIES)[number];

export default function SkillsStep() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { t } = useI18n();

  const labels: Record<CategoryId, string> = useMemo(
    () => ({
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
    }),
    [t],
  );

  const selected = state.skills.skills;
  const isSelected = (id: CategoryId) => selected.includes(id);
  const toggle = (id: CategoryId) => {
    let next: string[];
    if (selected.includes(id)) next = selected.filter((x) => x !== id);
    else next = [...selected, id];
    // If removing 'other', also clear custom text
    const payload: any = { skills: next };
    if (id === 'other' && !next.includes('other')) payload.other = undefined;
    dispatch({ type: 'skills/update', payload });
  };

  const onNext = () => {
    router.push('/availability');
  };

  const showOtherInput = isSelected('other') || !!state.skills.other?.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BackButton style={{ marginBottom: spacing.lg }} />

          <ProgressHeader step={4} total={6} title={t('onboarding_step4_title')} />

          <Text style={styles.helper}>{t('skills_helper')}</Text>

          <View style={styles.chipsWrap}>
            {CATEGORIES.map((id) => (
              <Chip
                key={id}
                label={labels[id]}
                selected={isSelected(id)}
                onPress={() => toggle(id)}
              />
            ))}
          </View>

          {showOtherInput && (
            <View style={{ marginTop: spacing.md }}>
              <FormInput
                label={t('skills_other_label')}
                placeholder={t('skills_other_placeholder')}
                value={state.skills.other || ''}
                onChangeText={(other) => dispatch({ type: 'skills/update', payload: { other } })}
                accessibilityLabel={t('skills_other_label')}
              />
            </View>
          )}

          <View style={{ flex: 1 }} />

          <StepFooter
            onNext={onNext}
            onBack={router.back}
            nextLabel={t('next')}
            backLabel={t('back')}
            onSkip={onNext}
            skipLabel={t('skip_for_now')}
          />
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
  helper: { color: colors.brand.muted, marginBottom: spacing.md },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
